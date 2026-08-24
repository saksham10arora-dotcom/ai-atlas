import { useMemo, useRef, useState } from "react";
import { DOMAINS, type Domain } from "../data/concepts";
import { layout, edges, graphDimensions } from "../lib/layout";

interface Props {
  learned: Set<string>;
  onSelect: (id: string) => void;
  selected: string | null;
  filter: Domain | null;
}

export default function GraphCanvas({ learned, onSelect, selected, filter }: Props) {
  const nodes = useMemo(() => layout(), []);
  const edgesList = useMemo(() => edges(nodes), [nodes]);
  const dims = useMemo(() => graphDimensions(nodes), [nodes]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  const isUnlocked = (prereqs: string[]) => prereqs.every((p) => learned.has(p));

  return (
    <svg
      ref={svgRef}
      className="graph"
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      onMouseDown={(e) => {
        drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      }}
      onMouseMove={(e) => {
        if (drag.current) setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
      }}
      onMouseUp={() => (drag.current = null)}
      onMouseLeave={() => (drag.current = null)}
    >
      <g transform={`translate(${pan.x},${pan.y})`}>
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#ffffff30" />
          </marker>
        </defs>

        {edgesList.map((e, i) => {
          const active = learned.has(e.from.id);
          const dim = filter && e.from.domain !== filter && e.to.domain !== filter;
          return (
            <path
              key={i}
              d={`M${e.from.x + 62},${e.from.y} C${e.from.x + 130},${e.from.y} ${e.to.x - 130},${e.to.y} ${e.to.x - 64},${e.to.y}`}
              fill="none"
              stroke={active ? DOMAINS[e.to.domain].color : "#ffffff"}
              strokeOpacity={dim ? 0.03 : active ? 0.45 : 0.09}
              strokeWidth={active ? 1.6 : 1}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {nodes.map((n) => {
          const done = learned.has(n.id);
          const open = !done && isUnlocked(n.prereqs);
          const locked = !done && !open;
          const color = DOMAINS[n.domain].color;
          const dimmed = filter !== null && n.domain !== filter;
          const isSel = selected === n.id;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              opacity={dimmed ? 0.15 : 1}
              onClick={() => onSelect(n.id)}
              className="node"
            >
              {isSel && <rect x="-66" y="-19" width="132" height="38" rx="10" fill="#fff" opacity="0.08" />}
              <rect
                x="-62"
                y="-16"
                width="124"
                height="32"
                rx="8"
                fill={done ? color : "#0d0d14"}
                fillOpacity={done ? 0.22 : 1}
                stroke={done ? color : locked ? "#ffffff22" : color}
                strokeWidth={isSel ? 2.2 : 1.2}
                strokeOpacity={locked ? 0.5 : 0.9}
                filter={done || open ? "url(#glow)" : undefined}
                strokeDasharray={locked && !open ? "4 3" : undefined}
              />
              <text
                textAnchor="middle"
                dy="4"
                fontSize="11"
                fontWeight={600}
                fill={done ? "#fff" : locked ? "#ffffff55" : color}
              >
                {n.title.length > 20 ? n.title.slice(0, 18) + "…" : n.title}
              </text>
              {done && <text x="52" y="-8" fontSize="10" fill={color}>✓</text>}
              {open && !done && <circle cx="52" cy="-8" r="3.5" fill={color} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
