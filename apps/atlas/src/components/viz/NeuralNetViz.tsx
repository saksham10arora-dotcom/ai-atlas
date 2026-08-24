import { useState } from "react";

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const relu = (z: number) => Math.max(0, z);
const rand = () => Math.round((Math.random() * 4 - 2) * 10) / 10;

type Net = number[][][];

export default function NeuralNetViz() {
  const [x, setX] = useState<[number, number]>([0.6, 0.8]);
  const [net, setNet] = useState<Net>(([
    [[1.2, -0.8], [-1.5, 0.9]],
    [[1.4, -1.3]],
  ]) as Net);
  const [showProb, setShowProb] = useState(false);

  const h1 = relu(net[0][0][0] * x[0] + net[0][0][1] * x[1]);
  const h2 = relu(net[0][1][0] * x[0] + net[0][1][1] * x[1]);
  const y = sigmoid(net[1][0][0] * h1 + net[1][0][1] * h2);
  const shown = showProb ? y : y > 0.5 ? 1 : 0;

  const nodes = [
    { x: 70, y: 90, label: `x\u2081 ${x[0].toFixed(1)}`, v: (x[0] + 1) / 2 },
    { x: 70, y: 190, label: `x\u2082 ${x[1].toFixed(1)}`, v: (x[1] + 1) / 2 },
    { x: 280, y: 90, label: `h\u2081 ${h1.toFixed(2)}`, v: h1 / (h1 + h2 || 1) },
    { x: 280, y: 190, label: `h\u2082 ${h2.toFixed(2)}`, v: h2 / (h1 + h2 || 1) },
    { x: 490, y: 140, label: `\u0177 ${shown.toFixed(2)}`, v: y },
  ];

  const conns = [
    { a: nodes[0], b: nodes[2], w: net[0][0][0] },
    { a: nodes[0], b: nodes[3], w: net[0][1][0] },
    { a: nodes[1], b: nodes[2], w: net[0][0][1] },
    { a: nodes[1], b: nodes[3], w: net[0][1][1] },
    { a: nodes[2], b: nodes[4], w: net[1][0][0] },
    { a: nodes[3], b: nodes[4], w: net[1][0][1] },
  ];

  return (
    <div className="viz">
      <svg viewBox="0 0 560 280" className="viz-svg">
        {conns.map((c, i) => (
          <line
            key={i}
            x1={c.a.x + 22}
            y1={c.a.y}
            x2={c.b.x - 22}
            y2={c.b.y}
            stroke={c.w >= 0 ? "#34d399" : "#fb7185"}
            strokeWidth={Math.min(6, Math.abs(c.w) * 2.5)}
            opacity={0.7}
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r="22"
              fill={`rgba(52,211,153,${0.15 + n.v * 0.55})`}
              stroke="#34d399"
              strokeWidth="2"
            />
            <text x={n.x} y={n.y + 42} textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="600">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="viz-controls viz-grid">
        <label>
          input x&#8321;
          <input type="range" min={-1} max={1} step={0.1} value={x[0]}
            onChange={(e) => setX([parseFloat(e.target.value), x[1]])} />
        </label>
        <label>
          input x&#8322;
          <input type="range" min={-1} max={1} step={0.1} value={x[1]}
            onChange={(e) => setX([x[0], parseFloat(e.target.value)])} />
        </label>
        <button className="btn btn-sm" onClick={() =>
          setNet([[ [rand(), rand()], [rand(), rand()] ], [ [rand(), rand()] ]])
        }>
          randomize weights
        </button>
        <label className="viz-check">
          <input type="checkbox" checked={showProb} onChange={(e) => setShowProb(e.target.checked)} />
          show probability instead of class
        </label>
      </div>
    </div>
  );
}
