import { useMemo, useState } from "react";

const SENTENCES = [
  "the animal did not cross the street because it was tired",
  "the cat sat on the mat because it was warm",
  "she poured water from the bottle into the cup until it was full",
];

const softmax = (v: number[]) => {
  const m = Math.max(...v);
  const e = v.map((x) => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / s);
};

export default function AttentionViz() {
  const [si, setSi] = useState(0);
  const [temp, setTemp] = useState(1);
  const [qi, setQi] = useState(0);
  const tokens = SENTENCES[si].split(" ");
  const d = 8;

  const scores = useMemo(() => {
    return tokens.map((_, i) => {
      const q = Array.from({ length: d }, (_, k) => Math.sin(i * (k + 1) * 1.7));
      return tokens.map((__, j) => {
        if (j > i) return -Infinity;
        const kv = Array.from({ length: d }, (_, k) => Math.cos(j * (k + 2) * 1.3));
        const dot = q.reduce((a, b, idx) => a + b * kv[idx], 0) / Math.sqrt(d);
        return dot / temp;
      });
    });
  }, [tokens, temp]);

  const row = softmax(scores[qi].filter(Number.isFinite));

  return (
    <div className="viz">
      <div className="viz-tabs">
        {SENTENCES.map((_, i) => (
          <button key={i} className={`btn btn-sm ${i === si ? "btn-accent" : ""}`} onClick={() => { setSi(i); setQi(0); }}>
            sentence {i + 1}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 560 300" className="viz-svg">
        {tokens.map((t, j) => (
          <text key={`c${j}`} x={120 + j * 44} y={44} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">
            {t.slice(0, 7)}
          </text>
        ))}
        {tokens.map((t, i) => (
          <g key={`r${i}`} onClick={() => setQi(i)} style={{ cursor: "pointer" }}>
            <text x={112} y={70 + i * 36} textAnchor="end" fill={i === qi ? "#fff" : "#94a3b8"} fontSize="11" fontWeight={i === qi ? 700 : 400}>
              {t}
            </text>
            {tokens.map((_, j) => {
              if (j > i) return null;
              const v = softmax(scores[i].filter(Number.isFinite))[j];
              const isSel = i === qi;
              return (
                <rect
                  key={j}
                  x={98 + j * 44}
                  y={56 + i * 36}
                  width={40}
                  height={28}
                  rx="4"
                  fill="#f59e0b"
                  opacity={isSel ? 0.2 + v * 0.8 : v * 0.45}
                  stroke={isSel && row[j] === v ? "#fff" : "none"}
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        ))}
      </svg>
      <p className="viz-caption">
        row "<span style={{ color: "#fbbf24" }}>{tokens[qi]}</span>" attends to earlier tokens.
        causal mask hides the future. temperature sharpens or flattens focus.
      </p>
      <div className="viz-controls">
        <label>
          temperature {temp.toFixed(1)}
          <input type="range" min={0.3} max={3} step={0.1} value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))} />
        </label>
      </div>
    </div>
  );
}
