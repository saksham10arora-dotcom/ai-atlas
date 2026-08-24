import { useEffect, useRef, useState } from "react";

const START = -2.2;
const loss = (x: number) => (x * x) / 2 + Math.sin(x * 3) * 0.35;
const grad = (x: number) => x + Math.cos(x * 3) * 1.05;

export default function GradientDescentViz() {
  const [lr, setLr] = useState(0.3);
  const [pos, setPos] = useState(START);
  const [path, setPath] = useState<number[]>([START]);
  const [running, setRunning] = useState(false);
  const lrRef = useRef(lr);
  lrRef.current = lr;

  useEffect(() => {
    if (!running) return;
    let cur = START;
    let steps = 0;
    const hist: number[] = [START];
    setPos(START);
    setPath([START]);
    const id = window.setInterval(() => {
      cur -= lrRef.current * grad(cur);
      hist.push(cur);
      steps++;
      setPos(cur);
      setPath([...hist]);
      if (Math.abs(lrRef.current * grad(cur)) < 1e-4 || steps >= 200) {
        window.clearInterval(id);
        setRunning(false);
      }
    }, 30);
    return () => window.clearInterval(id);
  }, [running]);

  const W = 560;
  const H = 260;
  const px = (x: number) => W / 2 + x * 90;
  const py = (v: number) => H - 30 - v * 85;
  const curve: string = Array.from({ length: 140 }, (_, i) => {
    const x = -3.1 + (i * 6.2) / 139;
    return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)},${py(loss(x)).toFixed(1)}`;
  }).join(" ");

  return (
    <div className="viz">
      <svg viewBox={`0 0 ${W} ${H}`} className="viz-svg">
        <defs>
          <linearGradient id="gd-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={px(-3.1)} y1={py(0)} x2={px(3.1)} y2={py(0)} stroke="#ffffff18" />
        <path d={`${curve} L${px(3.1)},${H - 20} L${px(-3.1)},${H - 20} Z`} fill="url(#gd-fill)" />
        <path d={curve} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        {path.map((x, i) => (
          <circle
            key={i}
            cx={px(x)}
            cy={py(loss(x))}
            r={Math.max(1.2, 4.5 * (i / Math.max(1, path.length)))}
            fill="#f59e0b"
            opacity={0.15 + 0.85 * (i / Math.max(1, path.length))}
          />
        ))}
        <circle cx={px(pos)} cy={py(loss(pos))} r="9" fill="#fff" stroke="#f59e0b" strokeWidth="3">
          <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
        </circle>
        <text x={px(pos) + 14} y={py(loss(pos)) - 12} fill="#fbbf24" fontSize="13" fontWeight="600">
          loss {loss(pos).toFixed(3)}
        </text>
      </svg>
      <div className="viz-controls">
        <label>
          learning rate {lr.toFixed(2)}
          <input
            type="range"
            min={0.01}
            max={1.2}
            step={0.01}
            value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))}
          />
        </label>
        <button className="btn btn-accent btn-sm" onClick={() => setRunning(true)}>
          restart descent
        </button>
      </div>
    </div>
  );
}
