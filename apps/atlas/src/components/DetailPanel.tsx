import { CONCEPT_MAP, DOMAINS } from "../data/concepts";
import VizHost from "./viz/VizHost";

interface Props {
  id: string;
  learned: Set<string>;
  onToggleLearned: (id: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function DetailPanel({ id, learned, onToggleLearned, onSelect, onClose }: Props) {
  const c = CONCEPT_MAP[id];
  if (!c) return null;
  const domain = DOMAINS[c.domain];
  const isLearned = learned.has(id);

  return (
    <aside className="panel" style={{ borderTopColor: domain.color }}>
      <button className="panel-close" onClick={onClose} aria-label="close">×</button>
      <div className="panel-domain" style={{ color: domain.color }}>{domain.label}</div>
      <h2 className="panel-title">{c.title}</h2>
      <p className="panel-summary">{c.summary}</p>

      <section>
        <h3>intuition</h3>
        <p>{c.intuition}</p>
      </section>

      {c.formula && (
        <div className="panel-formula"><code>{c.formula}</code></div>
      )}

      <section>
        <h3>why it matters</h3>
        <p>{c.why}</p>
      </section>

      {c.viz && (
        <section>
          <h3>interactive</h3>
          <VizHost viz={c.viz} />
        </section>
      )}

      <section>
        <h3>prerequisites</h3>
        {c.prereqs.length === 0 ? (
          <p className="muted">none, this is a root of the map</p>
        ) : (
          <div className="prereq-row">
            {c.prereqs.map((p) => (
              <button
                key={p}
                className={`chip ${learned.has(p) ? "chip-done" : ""}`}
                style={{ borderColor: DOMAINS[CONCEPT_MAP[p].domain].color }}
                onClick={() => onSelect(p)}
              >
                {learned.has(p) && "✓ "}{CONCEPT_MAP[p].title}
              </button>
            ))}
          </div>
        )}
      </section>

      <button
        className={`btn ${isLearned ? "" : "btn-accent"} panel-learn`}
        onClick={() => onToggleLearned(id)}
      >
        {isLearned ? "✓ learned (click to unmark)" : "mark as learned"}
      </button>
    </aside>
  );
}
