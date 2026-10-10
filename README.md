# AI Atlas

**Learn all of AI three ways: see the map, get taught, build it yourself.**

One repo, three machines. Each attacks the same body of knowledge from a different angle, because reading about attention, being quizzed on attention, and implementing attention are three completely different skills. yes

```
┌─────────────────────────────────────────────────────────┐
│                        AI ATLAS                         │
├──────────────┬──────────────────┬───────────────────────┤
│  apps/atlas  │    apps/tutor    │   apps/playground     │
│              │                  │                       │
│ explorable   │ Socratic LLM     │ implement neuron →    │
│ dependency   │ tutor that never │ backprop → XOR →      │
│ graph of 57  │ gives you the    │ softmax → attention   │
│ AI concepts  │ answer           │ tests unlock levels   │
│ + live viz   │ (streaming)      │ + XOR decision viz    │
└──────────────┴──────────────────┴───────────────────────┘
```

## The three machines

### 1. Atlas - the map

An explorable dependency graph of **57 core concepts** across 8 domains:
Foundations · Core ML · Deep Learning · LLMs · Generative · Reinforcement · Systems & MLOps · Safety.

- Every node carries a one-line summary, an intuition, why it matters, and its formula
- Prerequisite edges lock concepts until you mark their parents learned (progress saved locally)
- Glowing nodes = your current learning frontier
- Three **interactive visualizations** embedded in concept panels:
  - gradient descent on a bumpy loss surface (learning rate slider)
  - a live 2-2-1 neural network (drag inputs and weights, watch activations)
  - an attention heatmap over real sentences with causal masking and temperature

### 2. Tutor - the interrogator

An LLM-powered tutor hard-constrained to **never give you the answer**:

- **Learn mode**: progressive Socratic questioning, one question at a time
- **Quiz me**: honest grading with adaptive difficulty
- **Debug me**: explain the topic yourself, it surgically finds your misconceptions
- Works with OpenRouter, Groq, or local Ollama. Streams tokens. API key stays in your browser's localStorage.

### 3. Playground - the dojo

Eight hands-on levels where you build AI from scratch in plain JavaScript, right in the browser:

| # | Level | You build |
|---|-------|-----------|
| 1 | The Neuron | sigmoid + weighted sum |
| 2 | Measuring Wrongness | MSE loss |
| 3 | Rolling Downhill | gradient descent loop |
| 4 | Stacking Layers | full forward pass with ReLU hidden layer |
| 5 | Gradients You Can Trust | numeric gradient checker |
| 6 | Boss Fight: Train XOR | complete training loop via manual backprop |
| 7 | Softmax & Cross-Entropy | numerically stable LM head |
| 8 | Final Boss: Attention | `softmax(QKᵀ/√d)V` from scratch |

Each level has theory, starter code, a hidden solution, and a test suite that unlocks the next level when green. Clearing Level 6 renders your network's actual decision surface.

## Quickstart

```bash
npm install

npm run dev:atlas        # map of all AI
npm run dev:tutor        # Socratic tutor (add API key in settings)
npm run dev:playground   # build-it-yourself levels

npm run build            # production build for all three
```

## Why this exists

Most AI education fails in one of three ways: it shows you a map but no territory (courses), territory but no map (tutorials), or neither (video lectures watched at 1.5x). This project is the counter-argument: navigation, interrogation, and construction as one connected system.

Zero runtime dependencies beyond React. Every visualization, the force-free DAG layout, the streaming SSE parser, the test runner, the markdown renderer: hand-built.

## Roadmap

- [ ] more visualizations (backprop blame flow, diffusion denoising steps, Q-learning gridworld)
- [ ] spaced repetition scheduling on learned atlas nodes
- [ ] playground levels: CNN convolutions, LoRA fine-tuning math, KV cache
- [ ] shared progress: atlas "learned" status feeds tutor difficulty selection
- [ ] export session transcripts from tutor

## License

MIT
