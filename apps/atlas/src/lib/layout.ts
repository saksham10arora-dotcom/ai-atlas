import { CONCEPTS, CONCEPT_MAP, type Concept } from "../data/concepts";

export interface PositionedConcept extends Concept {
  x: number;
  y: number;
  depth: number;
}

const COL_WIDTH = 240;
const ROW_HEIGHT = 96;
const MARGIN_X = 90;
const MARGIN_Y = 70;

function computeDepth(id: string, memo: Map<string, number>, seen: Set<string>): number {
  const cached = memo.get(id);
  if (cached !== undefined) return cached;
  if (seen.has(id)) return 0;
  seen.add(id);
  const c = CONCEPT_MAP[id];
  const d =
    c.prereqs.length === 0
      ? 0
      : Math.max(...c.prereqs.map((p) => computeDepth(p, memo, new Set(seen)))) + 1;
  memo.set(id, d);
  return d;
}

const domainOrder = [
  "foundations",
  "core-ml",
  "deep-learning",
  "llms",
  "generative",
  "rl",
  "systems",
  "safety",
] as const;

export function layout(): PositionedConcept[] {
  const memo = new Map<string, number>();
  CONCEPTS.forEach((c) => computeDepth(c.id, memo, new Set()));

  const byDepth = new Map<number, Concept[]>();
  for (const c of CONCEPTS) {
    const d = memo.get(c.id) ?? 0;
    if (!byDepth.has(d)) byDepth.set(d, []);
    byDepth.get(d)!.push(c);
  }

  const out: PositionedConcept[] = [];
  const maxDepth = Math.max(...byDepth.keys());

  for (let d = 0; d <= maxDepth; d++) {
    const col = (byDepth.get(d) ?? []).sort(
      (a, b) => domainOrder.indexOf(a.domain) - domainOrder.indexOf(b.domain)
    );
    const colHeight = (col.length - 1) * ROW_HEIGHT;
    const startY = MARGIN_Y + (maxDepth * ROW_HEIGHT * 1.4 - colHeight) / 2;
    col.forEach((c, i) => {
      out.push({
        ...c,
        depth: d,
        x: MARGIN_X + d * COL_WIDTH,
        y: startY + i * ROW_HEIGHT,
      });
    });
  }

  return out;
}

export function graphDimensions(nodes: PositionedConcept[]) {
  const w = Math.max(...nodes.map((n) => n.x));
  const h = Math.max(...nodes.map((n) => n.y));
  return { width: w + MARGIN_X * 2, height: h + MARGIN_Y * 2 };
}

export interface Edge {
  from: PositionedConcept;
  to: PositionedConcept;
}

export function edges(nodes: PositionedConcept[]): Edge[] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const out: Edge[] = [];
  for (const n of nodes) {
    for (const p of n.prereqs) {
      const from = map.get(p);
      if (from) out.push({ from, to: n });
    }
  }
  return out;
}
