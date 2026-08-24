import { useEffect, useRef } from "react";

export default function XorVisualizer({
  predict,
  losses,
}: {
  predict: (a: number, b: number) => number;
  losses: number[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const N = 36;
    const cell = cv.width / N;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const a = j / (N - 1);
        const b = 1 - i / (N - 1);
        let p: number;
        try {
          p = predict(a, b);
        } catch {
          return;
        }
        const v = Math.max(0, Math.min(1, p));
        const r = Math.round(251 * (1 - v) + 52 * v);
        const g = Math.round(113 * (1 - v) + 211 * v);
        const bch = Math.round(133 * (1 - v) + 153 * v);
        ctx.fillStyle = `rgb(${r},${g},${bch})`;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(j * cell, i * cell, cell + 1, cell + 1);
      }
    }
    ctx.globalAlpha = 1;
    const dot = (x: number, y: number, label: number) => {
      const cx = x * cv.width;
      const cy = (1 - y) * cv.height;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = label === 1 ? "#0d0d14" : "#fff";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = label === 1 ? "#34d399" : "#fb7185";
      ctx.stroke();
      ctx.fillStyle = label === 1 ? "#34d399" : "#fb7185";
      ctx.font = "bold 9px monospace";
      ctx.fillText(String(label), cx - 2.5, cy + 3);
    };
    dot(0, 0, 0);
    dot(1, 1, 0);
    dot(0, 1, 1);
    dot(1, 0, 1);
  }, [predict]);

  const W = 260;
  const H = 120;
  const maxLoss = Math.max(...losses, 1e-9);
  const pts = losses
    .map((l, i) => {
      const x = (i / Math.max(1, losses.length - 1)) * W;
      const y = H - (l / maxLoss) * (H - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="xor-viz">
      <div>
        <canvas ref={canvasRef} width={180} height={180} className="xor-canvas" />
        <p className="viz-caption">decision surface</p>
      </div>
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="loss-svg">
          <path d={pts} fill="none" stroke="#f59e0b" strokeWidth="2" />
        </svg>
        <p className="viz-caption">
          loss curve · first {losses[0]?.toFixed(3)} → last {losses[losses.length - 1]?.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
