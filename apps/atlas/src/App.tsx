import { useCallback, useEffect, useState } from "react";
import { DOMAINS, type Domain } from "./data/concepts";
import GraphCanvas from "./components/GraphCanvas";
import DetailPanel from "./components/DetailPanel";

const STORE_KEY = "ai-atlas-learned";

function loadLearned(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export default function App() {
  const [learned, setLearned] = useState<Set<string>>(loadLearned);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Domain | null>(null);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify([...learned]));
  }, [learned]);

  const toggleLearned = useCallback((id: string) => {
    setLearned((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const pct = Math.round((learned.size / 57) * 100);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">◈</span>
          <h1>AI ATLAS</h1>
          <span className="brand-sub">the map of all of AI</span>
        </div>
        <div className="progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-num">{learned.size}/57 · {pct}%</span>
        </div>
      </header>

      <nav className="filters">
        {(Object.keys(DOMAINS) as Domain[]).map((d) => (
          <button
            key={d}
            className="filter-btn"
            style={{
              borderColor: filter === d ? DOMAINS[d].color : "#ffffff18",
              color: filter === d ? DOMAINS[d].color : "#94a3b8",
              background: filter === d ? `${DOMAINS[d].color}14` : "transparent",
            }}
            onClick={() => setFilter(filter === d ? null : d)}
          >
            <span className="dot" style={{ background: DOMAINS[d].color }} />
            {DOMAINS[d].label}
          </button>
        ))}
        {filter && (
          <button className="filter-clear" onClick={() => setFilter(null)}>clear</button>
        )}
        {!filter && !selected && (
          <p className="hint">click any node · dashed = locked behind prereqs · glowing = at your frontier · drag to pan</p>
        )}
      </nav>

      <main className={`stage ${selected ? "with-panel" : ""}`}>
        <GraphCanvas learned={learned} onSelect={setSelected} selected={selected} filter={filter} />
        {selected && (
          <DetailPanel
            id={selected}
            learned={learned}
            onToggleLearned={toggleLearned}
            onSelect={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
      </main>
    </div>
  );
}
