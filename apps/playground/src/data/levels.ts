export interface TestResult {
  name: string;
  pass: boolean;
  detail: string;
}

export interface Test {
  name: string;
  run: (x: Record<string, any>) => { pass: boolean; detail?: string };
}

export interface Level {
  id: number;
  title: string;
  concept: string;
  theory: string[];
  task: string;
  exports: string[];
  starterCode: string;
  solution: string;
  tests: Test[];
}

const approx = (a: number, b: number, tol = 1e-4) =>
  Number.isFinite(a) && Math.abs(a - b) <= tol;

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Neuron",
    concept: "perceptron",
    theory: [
      "A neuron takes inputs, weights them, adds a bias, and squashes the result through an activation. That is the entire atom of deep learning.",
      "Here you use the sigmoid activation: sigma(z) = 1 / (1 + e^(-z)). It maps any real number into (0,1), which lets a neuron output a probability.",
    ],
    task:
      "Implement sigmoid(z) = 1/(1+e^(-z)) and neuron(inputs, weights, bias): compute the weighted sum z = sum(inputs[i] * weights[i]) + bias, then return sigmoid(z).",
    exports: ["sigmoid", "neuron"],
    starterCode: `function sigmoid(z) {
  // TODO
}

function neuron(inputs, weights, bias) {
  // weighted sum + bias, then squash through sigmoid
  // TODO
}`,
    solution: `function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function neuron(inputs, weights, bias) {
  let z = bias;
  for (let i = 0; i < inputs.length; i++) {
    z += inputs[i] * weights[i];
  }
  return sigmoid(z);
}`,
    tests: [
      {
        name: "sigmoid(0) = 0.5",
        run: (x) => {
          const s = x.sigmoid?.(0);
          if (typeof s !== "number") return { pass: false, detail: "implement sigmoid first" };
          return approx(s, 0.5)
            ? { pass: true }
            : { pass: false, detail: `got ${s}, want 0.5` };
        },
      },
      {
        name: "neuron([1,0],[2,1],0) = sigma(2)",
        run: (x) => {
          const got = x.neuron?.([1, 0], [2, 1], 0);
          const want = 1 / (1 + Math.exp(-2));
          return approx(got, want)
            ? { pass: true }
            : { pass: false, detail: `got ${got}, want ${want.toFixed(6)}` };
        },
      },
      {
        name: "strong negative bias pushes output near 0",
        run: (x) => {
          const got = x.neuron?.([0, 0], [1, 1], -5);
          return approx(got, 0.0066929, 1e-3)
            ? { pass: true }
            : { pass: false, detail: `got ${got}, want ~0.0067` };
        },
      },
    ],
  },
  {
    id: 2,
    title: "Measuring Wrongness",
    concept: "loss-functions",
    theory: [
      "Before a model can learn it needs a single number that says how wrong it is. Mean Squared Error is the classic: average of squared differences.",
      "Squaring does two jobs at once: it punishes big misses disproportionately, and it keeps negative and positive errors from cancelling.",
    ],
    task:
      "Implement mse(preds, labels): return the mean of (preds[i] - labels[i]) squared.",
    exports: ["mse"],
    starterCode: `function mse(preds, labels) {
  // mean of squared differences
  // TODO
}`,
    solution: `function mse(preds, labels) {
  let sum = 0;
  for (let i = 0; i < preds.length; i++) {
    sum += (preds[i] - labels[i]) ** 2;
  }
  return sum / preds.length;
}`,
    tests: [
      {
        name: "perfect prediction gives 0",
        run: (x) => {
          const got = x.mse?.([5], [5]);
          return approx(got, 0) ? { pass: true } : { pass: false, detail: `got ${got}, want 0` };
        },
      },
      {
        name: "mse([1,2,3],[2,4,6]) = 14/3",
        run: (x) => {
          const got = x.mse?.([1, 2, 3], [2, 4, 6]);
          return approx(got, 14 / 3)
            ? { pass: true }
            : { pass: false, detail: `got ${got}, want ${(14 / 3).toFixed(4)}` };
        },
      },
      {
        name: "sign does not matter",
        run: (x) => {
          const got = x.mse?.([-2], [2]);
          return approx(got, 16) ? { pass: true } : { pass: false, detail: `got ${got}, want 16` };
        },
      },
    ],
  },
  {
    id: 3,
    title: "Rolling Downhill",
    concept: "gradient-descent",
    theory: [
      "Gradient descent is one line of math run in a loop: x <- x - lr * gradient(x).",
      "The learning rate controls stride length. Watch what happens when you make it too large in your head: the ball overshoots the valley and bounces out.",
    ],
    task:
      "Implement minimize(f, gradFn, x0, lr, steps): starting at x0, take exactly 'steps' gradient steps and return the final x.",
    exports: ["minimize"],
    starterCode: `function minimize(f, gradFn, x0, lr, steps) {
  // loop: x <- x - lr * grad(x)
  // f is provided so you can inspect the loss if curious
  // TODO
}`,
    solution: `function minimize(f, gradFn, x0, lr, steps) {
  let x = x0;
  for (let i = 0; i < steps; i++) {
    x = x - lr * gradFn(x);
  }
  return x;
}`,
    tests: [
      {
        name: "converges to minimum of (x-3)^2",
        run: (x) => {
          const got = x.minimize?.((v: number) => (v - 3) ** 2, (v: number) => 2 * (v - 3), 0, 0.1, 200);
          return approx(got, 3, 1e-6)
            ? { pass: true }
            : { pass: false, detail: `ended at ${got}, want 3` };
        },
      },
      {
        name: "respects step count (lr tiny => barely moves)",
        run: (x) => {
          const got = x.minimize?.((v: number) => v * v, (v: number) => 2 * v, 10, 0.001, 3);
          return approx(got, 10 * 0.998 ** 3, 1e-9)
            ? { pass: true }
            : { pass: false, detail: `got ${got}: did you take exactly 3 steps?` };
        },
      },
    ],
  },
  {
    id: 4,
    title: "Stacking Layers",
    concept: "neural-nets",
    theory: [
      "One neuron is weak. A layer of neurons voting together is stronger. Two layers with a nonlinearity between them can approximate almost anything.",
      "Forward pass: h = relu(W1x + b1), then y = sigmoid(W2h + b2). ReLU just clamps negatives to zero.",
    ],
    task:
      "Implement forward(x, W1, b1, W2, b2): W1 is h-by-in matrix (W1[j][i] connects input i to hidden j), W2 is a length-h vector producing ONE output via sigmoid. Hidden uses relu, output uses sigmoid.",
    exports: ["forward"],
    starterCode: `function forward(x, W1, b1, W2, b2) {
  // hidden[j] = relu( dot(W1[j], x) + b1[j] )
  // y = sigmoid( dot(W2, hidden) + b2 )
  // matrices are arrays: W1[j][i]
  // TODO
}`,
    solution: `function forward(x, W1, b1, W2, b2) {
  const hidden = [];
  for (let j = 0; j < W1.length; j++) {
    let z = b1[j];
    for (let i = 0; i < x.length; i++) {
      z += W1[j][i] * x[i];
    }
    hidden.push(Math.max(0, z));
  }
  let o = b2;
  for (let j = 0; j < hidden.length; j++) {
    o += W2[j] * hidden[j];
  }
  return 1 / (1 + Math.exp(-o));
}`,
    tests: [
      {
        name: "known 2-2-1 network value",
        run: (x) => {
          const got = x.forward?.(
            [1, 2],
            [[1, -1], [0, 2]],
            [0, -0.5],
            [1, 2],
            [0]
          );
          const want = 1 / (1 + Math.exp(-7));
          return approx(got, want)
            ? { pass: true }
            : { pass: false, detail: `got ${got}, want ${want.toFixed(6)}` };
        },
      },
      {
        name: "relu actually clamps (dead hidden unit case)",
        run: (x) => {
          const got = x.forward?.(
            [-1, -1],
            [[1, 1], [1, 1]],
            [0, 0],
            [1, 1],
            [0]
          );
          return approx(got, 0.5)
            ? { pass: true }
            : { pass: false, detail: `got ${got}: both hidden units should be dead -> output 0.5` };
        },
      },
    ],
  },
  {
    id: 5,
    title: "Gradients You Can Trust",
    concept: "backprop",
    theory: [
      "Backprop computes exact gradients symbolically. But how do you KNOW your backprop code is right? You interrogate it numerically.",
      "Central difference: f'(w) ~= (f(w+eps) - f(w-eps)) / (2*eps). Slow but bulletproof. Every serious ML engineer has debugged gradients this way.",
    ],
    task:
      "Implement numericGradient(f, w, eps=1e-5): f maps a vector to a scalar. Return a vector g where g[i] is the central-difference derivative w.r.t. w[i]. Do not mutate the input array.",
    exports: ["numericGradient"],
    starterCode: `function numericGradient(f, w, eps = 1e-5) {
  // for each dimension i:
  //   nudge w[i] up by eps, record loss
  //   nudge down by eps, record loss
  //   central difference
  // remember: copy before nudging, never mutate w itself
  // TODO
}`,
    solution: `function numericGradient(f, w, eps = 1e-5) {
  const g = new Array(w.length);
  for (let i = 0; i < w.length; i++) {
    const up = w.slice();
    const down = w.slice();
    up[i] += eps;
    down[i] -= eps;
    g[i] = (f(up) - f(down)) / (2 * eps);
  }
  return g;
}`,
    tests: [
      {
        name: "f(w)=w0^2*w1 + w2 at [1,2,3] -> [4,1,1]",
        run: (x) => {
          const g = x.numericGradient?.(
            (w: number[]) => w[0] ** 2 * w[1] + w[2],
            [1, 2, 3]
          );
          if (!Array.isArray(g)) return { pass: false, detail: "must return an array" };
          const ok = approx(g[0], 4, 1e-3) && approx(g[1], 1, 1e-3) && approx(g[2], 1, 1e-3);
          return ok ? { pass: true } : { pass: false, detail: `got [${g}], want ~[4,1,1]` };
        },
      },
      {
        name: "does not mutate input",
        run: (x) => {
          const w = [1, 2];
          x.numericGradient?.((v: number[]) => v[0] * v[1], w);
          return w[0] === 1 && w[1] === 2
            ? { pass: true }
            : { pass: false, detail: `input became [${w}]. slice before nudging!` };
        },
      },
      {
        name: "matches analytic sin derivative",
        run: (x) => {
          const g = x.numericGradient?.((w: number[]) => Math.sin(w[0]), [Math.PI / 3]);
          return approx(g?.[0], Math.cos(Math.PI / 3), 1e-4)
            ? { pass: true }
            : { pass: false, detail: `got ${g?.[0]}, want ~${Math.cos(Math.PI / 3).toFixed(4)}` };
        },
      },
    ],
  },
  {
    id: 6,
    title: "Boss Fight: Train XOR",
    concept: "training-tricks",
    theory: [
      "1969: Minsky and Papert proved a single neuron cannot learn XOR. The field froze for a decade.",
      "You will end that freeze right now. A 2-2-1 network trained with plain gradient descent cracks XOR in seconds. This is the moment backprop stops being math and becomes power.",
    ],
    task:
      "Implement trainXor(): train a 2-2-1 network on all four XOR pairs using full-batch gradient descent. Return { predict, losses } where predict(a,b) outputs a number in (0,1) and losses is your per-epoch MSE history (>= 100 epochs).",
    exports: ["trainXor"],
    starterCode: `function trainXor() {
  // architecture: 2 inputs -> 2 hidden (tanh or sigmoid) -> 1 sigmoid output
  //
  // recipe:
  //   1. init weights randomly in [-1, 1]
  //   2. for >= 100 epochs:
  //        forward each of the 4 samples, collect predictions
  //        compute dLoss/dW for every weight (chain rule!)
  //        update all weights by -lr * grad
  //        push epoch mse into losses[]
  //   3. return { predict, losses }
  //
  // data: [0,0]->0  [0,1]->1  [1,0]->1  [1,1]->0
  // hint: derive dLoss/dz_out = pred - label. everything else flows backward.
  // TODO
}`,
    solution: `function trainXor() {
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const tanh = Math.tanh;
  const data = [
    { x: [0, 0], y: 0 },
    { x: [0, 1], y: 1 },
    { x: [1, 0], y: 1 },
    { x: [1, 1], y: 0 },
  ];
  const r = () => Math.random() * 2 - 1;

  function attempt() {
    let W1 = [[r(), r()], [r(), r()]];
    let b1 = [r(), r()];
    let W2 = [r(), r()];
    let b2 = r();
    const fwd = (x) => {
      const h = W1.map((wj, j) => tanh(wj[0] * x[0] + wj[1] * x[1] + b1[j]));
      const p = sig(W2[0] * h[0] + W2[1] * h[1] + b2);
      return { h, p };
    };
    const losses = [];
    const lr = 5;
    for (let epoch = 0; epoch < 600; epoch++) {
      const gw1 = [[0, 0], [0, 0]];
      const gb1 = [0, 0];
      const gw2 = [0, 0];
      let gb2 = 0;
      let loss = 0;
      for (const d of data) {
        const { h, p } = fwd(d.x);
        const err = p - d.y;
        loss += err ** 2;
        gb2 += err;
        for (let j = 0; j < 2; j++) {
          gw2[j] += err * h[j];
          const dh = err * W2[j] * (1 - h[j] * h[j]);
          gb1[j] += dh;
          gw1[j][0] += dh * d.x[0];
          gw1[j][1] += dh * d.x[1];
        }
      }
      W1 = W1.map((wj, j) => wj.map((w, i) => w - (lr * gw1[j][i]) / 4));
      b1 = b1.map((b, j) => b - (lr * gb1[j]) / 4);
      W2 = W2.map((w, j) => w - (lr * gw2[j]) / 4);
      b2 -= (lr * gb2) / 4;
      losses.push(loss / 4);
    }
    return { predict: (a, b) => fwd([a, b]).p, losses };
  }

  let best = attempt();
  const good = (t) =>
    [[0,0,0],[0,1,1],[1,0,1],[1,1,0]].every(
      ([a,b,y]) => Math.abs(t.predict(a,b) - y) < 0.25
    );
  for (let tries = 0; tries < 10 && !good(best); tries++) best = attempt();
  return best;
}`,
    tests: [
      {
        name: "returns predict fn + loss history (>=100 epochs)",
        run: (x) => {
          const t = x.trainXor?.();
          if (!t || typeof t.predict !== "function" || !Array.isArray(t.losses))
            return { pass: false, detail: "return { predict, losses }" };
          if (t.losses.length < 100)
            return { pass: false, detail: `only ${t.losses.length} epochs logged, need >= 100` };
          return { pass: true };
        },
      },
      {
        name: "loss actually went down",
        run: (x) => {
          const l = x.trainXor?.().losses ?? [];
          const ok = Number.isFinite(l[0]) && Number.isFinite(l[l.length - 1]) &&
            l[l.length - 1] < l[0];
          return ok ? { pass: true } : { pass: false, detail: "last loss must be < first loss" };
        },
      },
      {
        name: "all four XOR decisions correct",
        run: (x) => {
          const t = x.trainXor?.();
          const cases: [number, number, number][] = [
            [0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0],
          ];
          const bad = cases.filter(([a, b, y]) => Math.abs(t.predict(a, b) - y) > 0.25);
          return bad.length === 0
            ? { pass: true }
            : { pass: false, detail: bad.map(([a, b]) => `predict(${a},${b}) off target`).join("; ") };
        },
      },
    ],
  },
  {
    id: 7,
    title: "Softmax & Cross-Entropy",
    concept: "gpt",
    theory: [
      "Every language model ends its forward pass here: raw scores (logits) become probabilities via softmax, and training measures surprise via cross-entropy.",
      "Numerical stability matters: exp(1000) overflows to Infinity. The fix is elegant: subtract the max before exponentiating. Same answer, no explosion.",
    ],
    task:
      "Implement softmax(v) (numerically stable) and crossEntropy(probs, label) = -log(probs[label]).",
    exports: ["softmax", "crossEntropy"],
    starterCode: `function softmax(v) {
  // stable version: subtract max first
  // TODO
}

function crossEntropy(probs, label) {
  // -log(probs[label])
  // TODO
}`,
    solution: `function softmax(v) {
  const m = Math.max(...v);
  const e = v.map((x) => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / s);
}

function crossEntropy(probs, label) {
  return -Math.log(probs[label]);
}`,
    tests: [
      {
        name: "softmax sums to 1 and matches ratios",
        run: (x) => {
          const s = x.softmax?.([1, 2, 3]);
          if (!Array.isArray(s)) return { pass: false, detail: "must return array" };
          const sum = s.reduce((a, b) => a + b, 0);
          const e = [1, 2, 3].map((z) => Math.exp(z));
          const tot = e.reduce((a, b) => a + b, 0);
          const ok = approx(sum, 1, 1e-9) && s.every((p, i) => approx(p, e[i] / tot));
          return ok ? { pass: true } : { pass: false, detail: `got [${s}]` };
        },
      },
      {
        name: "does NOT explode on huge logits",
        run: (x) => {
          const s = x.softmax?.([1000, 1000, 1000]);
          const ok = Array.isArray(s) && s.every((p) => Number.isFinite(p));
          return ok
            ? { pass: true }
            : { pass: false, detail: "NaN/Infinity detected: subtract the max first!" };
        },
      },
      {
        name: "crossEntropy([0.7,0.3],0) = -ln(0.7)",
        run: (x) => {
          const got = x.crossEntropy?.([0.7, 0.3], 0);
          return approx(got, -Math.log(0.7))
            ? { pass: true }
            : { pass: false, detail: `got ${got}` };
        },
      },
    ],
  },
  {
    id: 8,
    title: "Final Boss: Attention",
    concept: "attention",
    theory: [
      "Attention is three matrix multiplications and a softmax. That is genuinely all it is.",
      "scores = Q K^T / sqrt(d), weights = softmax(scores), output = weights V. Each token decides, from content alone, how much information to pull from every other token.",
    ],
    task:
      "Implement attention(Q, K, V): matrices are arrays of row vectors. Compute softmax(QK^T/sqrt(d)) V where d = Q[0].length. Output shape: n x dv.",
    exports: ["attention"],
    starterCode: `function attention(Q, K, V) {
  // 1. scores[i][j] = dot(Q[i], K[j]) / sqrt(d)
  // 2. weights[i] = softmax(scores[i])
  // 3. out[i] = weights[i] . V  (weighted sum of V's rows)
  // TODO
}`,
    solution: `function attention(Q, K, V) {
  const d = Q[0].length;
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const sm = (row) => {
    const m = Math.max(...row);
    const e = row.map((x) => Math.exp(x - m));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map((x) => x / s);
  };
  return Q.map((q) => {
    const scores = K.map((k) => dot(q, k) / Math.sqrt(d));
    const w = sm(scores);
    return V[0].map((_, c) =>
      w.reduce((s, wi, r) => s + wi * V[r][c], 0)
    );
  });
}`,
    tests: [
      {
        name: "output shape matches n x dv",
        run: (x) => {
          const out = x.attention?.(
            [[1, 0], [0, 1]],
            [[1, 0], [0, 1]],
            [[1, 2], [3, 4]]
          );
          const ok = Array.isArray(out) && out.length === 2 &&
            out.every((r) => Array.isArray(r) && r.length === 2);
          return ok ? { pass: true } : { pass: false, detail: `bad shape: ${JSON.stringify(out)}` };
        },
      },
      {
        name: "symmetric toy case hits known values",
        run: (x) => {
          const out = x.attention?.(
            [[1, 0], [0, 1], [1, 1]],
            [[1, 0], [0, 1], [1, 1]],
            [[1, 2], [3, 4], [5, 6]]
          );
          const r0ok = approx(out?.[0]?.[0], 3, 0.05) && approx(out?.[0]?.[1], 4, 0.05);
          return r0ok
            ? { pass: true }
            : { pass: false, detail: `row0 got [${out?.[0]}], want ~[3, 4]` };
        },
      },
      {
        name: "uniform scores give uniform mixing",
        run: (x) => {
          const out = x.attention?.(
            [[0, 0], [0, 0]],
            [[5, 5], [-5, -5]],
            [[1, 0], [0, 1]]
          );
          const ok = approx(out?.[0]?.[0], 0.5, 1e-6) && approx(out?.[1]?.[1], 0.5, 1e-6);
          return ok
            ? { pass: true }
            : { pass: false, detail: `zero queries should mix rows equally: got ${JSON.stringify(out)}` };
        },
      },
    ],
  },
];
