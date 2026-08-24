export interface Topic {
  id: string;
  title: string;
  area: string;
}

export const TOPICS: Topic[] = [
  { id: "linear-algebra", title: "Linear Algebra for ML", area: "Foundations" },
  { id: "backprop", title: "Backpropagation", area: "Deep Learning" },
  { id: "gradient-descent", title: "Gradient Descent & Optimizers", area: "Core ML" },
  { id: "attention", title: "Attention Mechanism", area: "LLMs" },
  { id: "transformers", title: "Transformer Architecture", area: "LLMs" },
  { id: "gpt", title: "Autoregressive Language Models", area: "LLMs" },
  { id: "tokenization", title: "Tokenization & BPE", area: "LLMs" },
  { id: "rlhf", title: "RLHF & Preference Learning", area: "Alignment" },
  { id: "diffusion", title: "Diffusion Models", area: "Generative" },
  { id: "policy-gradients", title: "Policy Gradients & PPO", area: "Reinforcement" },
  { id: "cnn", title: "Convolutional Networks", area: "Deep Learning" },
  { id: "embeddings", title: "Embeddings & Vector Space", area: "Deep Learning" },
  { id: "rag", title: "Retrieval Augmented Generation", area: "Systems" },
  { id: "bias-variance", title: "Bias-Variance Tradeoff", area: "Core ML" },
  { id: "scaling-laws", title: "Scaling Laws", area: "LLMs" },
  { id: "quantization", title: "Quantization & Efficiency", area: "Systems" },
];

export type Mode = "learn" | "quiz" | "debug";
