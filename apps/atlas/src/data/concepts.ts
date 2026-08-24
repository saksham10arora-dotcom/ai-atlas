export type Domain =
  | "foundations"
  | "core-ml"
  | "deep-learning"
  | "llms"
  | "generative"
  | "rl"
  | "systems"
  | "safety";

export interface Concept {
  id: string;
  title: string;
  domain: Domain;
  prereqs: string[];
  summary: string;
  intuition: string;
  why: string;
  formula?: string;
  viz?: "gradient-descent" | "neural-net" | "attention";
}

export const DOMAINS: Record<Domain, { label: string; color: string }> = {
  foundations: { label: "Foundations", color: "#8b5cf6" },
  "core-ml": { label: "Core ML", color: "#22d3ee" },
  "deep-learning": { label: "Deep Learning", color: "#34d399" },
  llms: { label: "LLMs", color: "#f59e0b" },
  generative: { label: "Generative", color: "#fb7185" },
  rl: { label: "Reinforcement", color: "#e879f9" },
  systems: { label: "Systems & MLOps", color: "#60a5fa" },
  safety: { label: "Safety", color: "#f87171" },
};

export const CONCEPTS: Concept[] = [
  {
    id: "linear-algebra",
    title: "Linear Algebra",
    domain: "foundations",
    prereqs: [],
    summary: "Vectors, matrices, and the operations that transform space itself.",
    intuition:
      "A matrix is not a grid of numbers, it is a machine that stretches, rotates, and projects space. Every layer of a neural network is one such machine applied in sequence.",
    why: "Data lives in vector spaces. Model weights are matrices. GPU hardware exists to multiply them fast.",
    formula: "(Ax)_i = sum_j A_ij * x_j",
  },
  {
    id: "calculus",
    title: "Calculus",
    domain: "foundations",
    prereqs: [],
    summary: "Derivatives measure sensitivity; the chain rule composes it through functions.",
    intuition:
      "A derivative answers: if I nudge this input, how much does the output move? The chain rule says sensitivity flows backwards through every step of a pipeline.",
    why: "Learning is literally 'nudge weights to reduce error'. Without derivatives you cannot know which way is down.",
    formula: "d/dx f(g(x)) = f'(g(x)) * g'(x)",
  },
  {
    id: "probability",
    title: "Probability",
    domain: "foundations",
    prereqs: [],
    summary: "The mathematics of uncertainty: distributions, conditionals, Bayes' rule.",
    intuition:
      "Probability is bookkeeping for what you do not know. Bayes' rule is the exact recipe for updating beliefs when evidence arrives.",
    why: "Every model output is a distribution pretending to be a number. Classification, generation, RL policies all speak probability.",
    formula: "P(A|B) = P(B|A) P(A) / P(B)",
  },
  {
    id: "statistics",
    title: "Statistics",
    domain: "foundations",
    prereqs: ["probability"],
    summary: "Estimation, hypothesis testing, and knowing when a result is noise.",
    intuition:
      "A sample is a noisy photograph of reality. Statistics tells you how blurry the photo is and whether two photos really differ.",
    why: "Model A beats model B by 0.3%? Statistics decides whether that means anything or you got lucky.",
  },
  {
    id: "python-numpy",
    title: "Python + NumPy",
    domain: "foundations",
    prereqs: [],
    summary: "The lingua franca of AI and its vectorized numeric kernel.",
    intuition:
      "NumPy forces you to think in whole-array operations instead of loops, which mirrors how GPUs think. That mental shift is half of practical ML.",
    why: "Every framework, from PyTorch to JAX, is NumPy thinking with extra steps.",
  },
  {
    id: "data-wrangling",
    title: "Data Wrangling",
    domain: "foundations",
    prereqs: ["python-numpy"],
    summary: "Cleaning, joining, and reshaping messy real-world data.",
    intuition:
      "Real data arrives lying to you: missing values, silent type coercion, leakage from the future. Ninety percent of modeling pain is data pain.",
    why: "Garbage in, confident garbage out. The best modelers spend most of their time here.",
  },
  {
    id: "optimization",
    title: "Optimization Theory",
    domain: "foundations",
    prereqs: ["calculus"],
    summary: "Finding minima: convexity, gradients, constraints, duality.",
    intuition:
      "The loss landscape is terrain and training is a ball rolling downhill. Convex terrain has one valley so any path works. Nonconvex terrain is a mountain range full of traps and plateaus.",
    why: "Training any model is optimization. Knowing the theory tells you when your optimizer is stuck versus when it is done.",
    formula: "min_w L(w) subject to constraints",
  },
  {
    id: "regression",
    title: "Linear & Logistic Regression",
    domain: "core-ml",
    prereqs: ["linear-algebra", "calculus"],
    summary: "Fit a line, then bend it through a sigmoid to predict probabilities.",
    intuition:
      "Linear regression draws the best straight line through points. Logistic regression feeds that line into an S-curve so outputs become probabilities between 0 and 1.",
    why: "It is the 'hello world' of learning from data, and the baseline every fancy model must beat.",
    formula: "sigma(w^T x), sigma(z) = 1/(1+e^-z)",
  },
  {
    id: "loss-functions",
    title: "Loss Functions",
    domain: "core-ml",
    prereqs: ["regression"],
    summary: "A single number that measures how wrong the model is.",
    intuition:
      "The loss is the contract between you and the optimizer. MSE punishes big misses hard; cross-entropy punishes confident wrongness brutally. Choose the loss and you choose the behavior.",
    why: "Models optimize exactly what you write, never what you meant. Loss design is where intent becomes math.",
    formula: "CE = -sum y_i log(p_i)",
  },
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    domain: "core-ml",
    prereqs: ["loss-functions", "optimization"],
    summary: "Repeatedly step downhill against the gradient until you settle.",
    intuition:
      "Stand on a foggy hillside, feel the slope under your feet, take a small step downhill, repeat. The learning rate is your stride length: too big and you leap over the valley, too small and you never arrive.",
    why: "This loop, at massive scale, trained every neural network that matters.",
    formula: "w <- w - lr * dL/dw",
    viz: "gradient-descent",
  },
  {
    id: "bias-variance",
    title: "Bias-Variance Tradeoff",
    domain: "core-ml",
    prereqs: ["statistics"],
    summary: "Underfit vs overfit: too rigid misses signal, too flexible memorizes noise.",
    intuition:
      "A straight line through a spiral is blind (high bias). A degree-50 polynomial threading every point is paranoid (high variance). Generalization lives in between.",
    why: "Every modeling decision, from depth to regularization to data size, navigates this tradeoff.",
  },
  {
    id: "regularization",
    title: "Regularization",
    domain: "core-ml",
    prereqs: ["bias-variance"],
    summary: "Penalize complexity on purpose: L1/L2, dropout, early stopping.",
    intuition:
      "You are telling the model 'prefer simpler explanations unless the data really insists'. L1 zeroes weights out, L2 shrinks them, dropout makes networks redundant on purpose.",
    why: "The gap between train and test performance is closed by regularization more than by architecture.",
    formula: "L_total = L_data + lambda * ||w||^2",
  },
  {
    id: "trees",
    title: "Decision Trees",
    domain: "core-ml",
    prereqs: ["data-wrangling"],
    summary: "Twenty questions played by splitting data on the most informative feature.",
    intuition:
      "Each split asks the question that most purifies the resulting groups. Trees speak human: 'if income > 50k and age < 30 then...'",
    why: "Interpretable, handle mixed data, no scaling needed, and they power the tabular-data champions.",
  },
  {
    id: "ensembles",
    title: "Ensembles: Forests & Boosting",
    domain: "core-ml",
    prereqs: ["trees"],
    summary: "Average many decorrelated trees (bagging) or fix their mistakes in sequence (boosting).",
    intuition:
      "Random Forest = ask a crowd of independent experts and vote. Gradient boosting = each new expert specializes in the previous crowd's residual errors.",
    why: "XGBoost/LightGBM still win most tabular competitions. The workhorse of applied ML outside deep learning.",
  },
  {
    id: "knn-clustering",
    title: "kNN & Clustering",
    domain: "core-ml",
    prereqs: ["linear-algebra"],
    summary: "Classify by neighbors, or discover structure by grouping similar points.",
    intuition:
      "kNN assumes near things are alike: no training, just lookup. k-means iteratively claims territory around centroids until assignments stop moving.",
    why: "Distance-based thinking is the seed of embeddings and vector search, which power modern RAG systems.",
  },
  {
    id: "pca",
    title: "PCA & Dimensionality Reduction",
    domain: "core-ml",
    prereqs: ["linear-algebra", "statistics"],
    summary: "Project data onto the directions where it varies most.",
    intuition:
      "If you photograph a coffee cup from the perfect angle, one photo captures it all. PCA finds that angle for datasets using eigenvectors of the covariance matrix.",
    why: "Compression, visualization, denoising, and the classic proof that linear algebra is everywhere.",
  },
  {
    id: "svm-kernels",
    title: "SVMs & Kernel Methods",
    domain: "core-ml",
    prereqs: ["regression"],
    summary: "Maximize the margin between classes; kernels bend space to make that possible.",
    intuition:
      "SVM picks the boundary with the widest safety corridor on both sides. The kernel trick computes similarity in a richer space without ever visiting it.",
    why: "Margin maximization is a beautiful geometric idea, and kernels foreshadow attention's similarity scores.",
  },
  {
    id: "perceptron",
    title: "Perceptron",
    domain: "deep-learning",
    prereqs: ["regression"],
    summary: "One artificial neuron: weighted sum, threshold, error-driven update rule.",
    intuition:
      "The perceptron is logistic regression's strict ancestor: fire or do not fire. Its 1958 promise and 1969 collapse (XOR) framed the first AI winter.",
    why: "Everything after this is stacking and smoothing this one idea.",
    formula: "y = step(w^T x + b)",
  },
  {
    id: "neural-nets",
    title: "Neural Networks",
    domain: "deep-learning",
    prereqs: ["perceptron", "gradient-descent"],
    summary: "Layers of neurons with nonlinear activations, trained end to end.",
    intuition:
      "Stack linear maps with nonlinearities between them and you get a function machine that can approximate almost anything. Depth lets earlier layers build concepts that later layers compose.",
    why: "The universal substrate of modern AI. Everything else on this map is a variation on this theme.",
    formula: "h = relu(W1 x + b1), y = W2 h + b2",
    viz: "neural-net",
  },
  {
    id: "backprop",
    title: "Backpropagation",
    domain: "deep-learning",
    prereqs: ["neural-nets", "calculus"],
    summary: "The chain rule run backward through the network graph to get every gradient at once.",
    intuition:
      "Blame flows backward: the output error assigns responsibility to each weight through the chain rule. One forward pass stores intermediates, one backward pass collects every derivative.",
    why: "It makes training cost barely more than inference. Without it, deep learning is computationally impossible.",
    formula: "dL/dW1 = dL/dy * dy/dh * dh/dW1",
  },
  {
    id: "optimizers",
    title: "Optimizers: SGD to Adam",
    domain: "deep-learning",
    prereqs: ["backprop"],
    summary: "Momentum remembers velocity; Adam adapts per-parameter step sizes.",
    intuition:
      "Vanilla SGD is a drunk walker. Momentum gives him a heavy backpack that smooths his path. Adam also measures how consistently steep each direction is and sizes steps accordingly.",
    why: "Optimizer choice changes convergence speed and final quality. AdamW trains nearly everything today.",
  },
  {
    id: "training-tricks",
    title: "Training Dynamics",
    domain: "deep-learning",
    prereqs: ["optimizers"],
    summary: "Initialization, batch norm, layer norm, dropout, schedules: the craft of stable training.",
    intuition:
      "Deep nets fail boringly: dead ReLUs, exploding gradients, covariate drift. Normalization keeps activations centered, good init starts signals alive, schedules anneal the stride.",
    why: "Transformers only train because of layer norm and careful init. This is the difference between loss=NaN and GPT.",
  },
  {
    id: "autoencoders",
    title: "Autoencoders",
    domain: "deep-learning",
    prereqs: ["neural-nets"],
    summary: "Compress then reconstruct, forcing the bottleneck to learn what matters.",
    intuition:
      "Squeeze the input through a keyhole. Whatever survives must be the essence. The bottleneck is learned compression, discovered rather than designed like PCA.",
    why: "The conceptual parent of VAEs, representation learning, and modern embedding models.",
  },
  {
    id: "cnn",
    title: "Convolutional Networks",
    domain: "deep-learning",
    prereqs: ["backprop"],
    summary: "Sliding filters share weights to detect local patterns anywhere in an image.",
    intuition:
      "A cat detector should work whether the cat is top-left or bottom-right. Convolutions bake translation invariance into the architecture, building edges into textures into parts into objects.",
    why: "They ran vision for a decade, remain core to efficient models, and the idea of local receptive fields echoes everywhere.",
  },
  {
    id: "rnn",
    title: "Recurrent Networks",
    domain: "deep-learning",
    prereqs: ["backprop"],
    summary: "Process sequences step by step, carrying a hidden memory forward.",
    intuition:
      "An RNN reads a sentence like you read this one: word by word, updating a running mental state. LSTMs add gates so old information can survive without being overwritten.",
    why: "The pre-transformer king of sequence modeling. Understanding why it struggles (vanishing memory, no parallelism) explains exactly why transformers won.",
  },
  {
    id: "embeddings",
    title: "Embeddings",
    domain: "deep-learning",
    prereqs: ["neural-nets"],
    summary: "Map discrete things (words, users, products) into geometric space where distance means meaning.",
    intuition:
      "Give every token a coordinate vector such that similar meanings land close together. king - man + woman lands near queen because relationships become directions.",
    why: "Embeddings are the interface between the symbolic world and geometry. Search, recommendation, and RAG all stand on them.",
  },
  {
    id: "seq2seq",
    title: "Seq2Seq",
    domain: "llms",
    prereqs: ["rnn", "embeddings"],
    summary: "Encode a sequence into a vector, decode it back out as another sequence.",
    intuition:
      "Read the whole French sentence, crush it into one thought-vector, then write the English sentence out of that thought. The bottleneck was crushing entire paragraphs into one vector, which became the crisis that birthed attention.",
    why: "Established encode-then-generate as THE template for translation, summarization, and eventually all of LLM behavior.",
  },
  {
    id: "attention",
    title: "Attention",
    domain: "llms",
    prereqs: ["seq2seq"],
    summary: "Every token queries every other token and pulls in weighted relevance.",
    intuition:
      "For the word 'it' in 'the animal did not cross the street because it was tired', attention lets 'it' look back and softly grab 'animal'. Each token asks a question (query), tokens advertise what they offer (key), and matching Q against K yields mixing weights over values V.",
    why: "The single most important mechanism in modern AI. It is dynamic, content-based routing of information, differentiable end to end.",
    formula: "Attention(Q,K,V) = softmax(QK^T / sqrt(d)) V",
    viz: "attention",
  },
  {
    id: "transformers",
    title: "Transformer",
    domain: "llms",
    prereqs: ["attention", "training-tricks"],
    summary: "Stack self-attention plus feedforward blocks, drop recurrence entirely.",
    intuition:
      "'Attention Is All You Need' removed the sequential bottleneck: every token connects to every other token in one parallel step. Residual streams carry information forward; layer norm keeps it stable at depth.",
    why: "Parallelizable training unlocked scaling, and scaling unlocked everything. GPT, BERT, ViT, diffusion transformers all share this skeleton.",
  },
  {
    id: "tokenization",
    title: "Tokenization",
    domain: "llms",
    prereqs: ["embeddings"],
    summary: "Chop raw text into subword units via algorithms like BPE.",
    intuition:
      "'unbelievable' might split into 'un', 'believ', 'able'. Frequent chunks earn their own token, rare words shatter. The tokenizer defines the atoms of the model's universe.",
    why: "Explains why LLMs fumble character counting, arithmetic digits, and non-English text. Real bugs live here.",
  },
  {
    id: "positional-encoding",
    title: "Positional Encoding",
    domain: "llms",
    prereqs: ["transformers"],
    summary: "Inject order information, since attention alone is permutation-blind.",
    intuition:
      "Attention treats input as a bag of tokens. Add sinusoidal patterns or rotary rotations to each position so 'dog bites man' differs from 'man bites dog'. RoPE does this inside the attention score itself.",
    why: "Context-length extensions (ALiBi, RoPE scaling) are active engineering. Order is meaning.",
  },
  {
    id: "bert",
    title: "BERT & Encoders",
    domain: "llms",
    prereqs: ["transformers"],
    summary: "Bidirectional masked-language pretraining: read everything, then fill blanks.",
    intuition:
      "Hide 15% of tokens and force the model to reconstruct them from both left AND right context. You get deep bidirectional understanding, great for classification and retrieval rather than generation.",
    why: "Encoder models still power search engines and embedding APIs everywhere.",
  },
  {
    id: "gpt",
    title: "GPT & Autoregressive LMs",
    domain: "llms",
    prereqs: ["transformers", "tokenization"],
    summary: "Predict the next token, forever, conditioned on everything before it.",
    intuition:
      "One objective: given the prefix, guess the next token. Do this at internet scale and prediction pressure squeezes grammar, facts, reasoning, and style into the weights. Sampling temperature trades coherence for creativity.",
    why: "The scaling recipe behind ChatGPT. Next-token prediction turned out to be a general-purpose teacher.",
    formula: "P(x_t | x_<t) via softmax(W h_t)",
  },
  {
    id: "scaling-laws",
    title: "Scaling Laws",
    domain: "llms",
    prereqs: ["gpt"],
    summary: "Loss falls as a smooth power law in parameters, data, and compute.",
    intuition:
      "Before training, you can forecast how good the model will be from a budget curve. Chinchilla's correction: most models were starved of data, not parameters. Bigger helps, but balanced bigger helps more.",
    why: "The economics of the entire field: these curves decide billion-dollar compute allocations.",
  },
  {
    id: "fine-tuning",
    title: "Fine-tuning & Instruction Tuning",
    domain: "llms",
    prereqs: ["gpt"],
    summary: "Continue training a pretrained model on curated examples to shape behavior.",
    intuition:
      "Pretraining teaches language, fine-tuning teaches manners and format. Instruction tuning shows thousands of prompt-response pairs so the base model stops completing text and starts answering people.",
    why: "The bridge between a raw next-token predictor and a usable assistant.",
  },
  {
    id: "peft-lora",
    title: "PEFT & LoRA",
    domain: "llms",
    prereqs: ["fine-tuning"],
    summary: "Freeze the base model, train tiny low-rank adapter matrices instead.",
    intuition:
      "Weight updates during fine-tuning have low intrinsic rank. So learn two skinny matrices BA whose product approximates the update: 0.1% of parameters, swap adapters per task like cartridges.",
    why: "Democratized customization: fine-tune a 70B model on one consumer GPU.",
    formula: "W' = W + BA, rank(BA) << rank(W)",
  },
  {
    id: "rlhf",
    title: "RLHF",
    domain: "llms",
    prereqs: ["fine-tuning", "policy-gradients"],
    summary: "Learn a reward model from human preferences, then optimize the LM against it with RL.",
    intuition:
      "Humans cannot write the ideal answer, but they reliably prefer one draft over another. Train a reward model on those comparisons, then let PPO push the policy toward higher-rated outputs while KL penalties stop it drifting into gibberish that games the reward.",
    why: "The technique that turned GPT-3 into ChatGPT. Also the source of sycophancy and mode-collapse quirks.",
  },
  {
    id: "prompting",
    title: "Prompt Engineering",
    domain: "llms",
    prereqs: ["gpt"],
    summary: "Steer frozen models through context design: roles, examples, chains of thought.",
    intuition:
      "The context window is programmable memory. Few-shot examples set the format, 'think step by step' recruits internal computation, structured prompts reduce ambiguity. You are doing gradient descent by prose.",
    why: "Zero infrastructure, immediate leverage, and the fastest way to ship AI features.",
  },
  {
    id: "rag",
    title: "RAG",
    domain: "llms",
    prereqs: ["embeddings", "prompting"],
    summary: "Retrieve relevant documents by embedding similarity, stuff them into context, generate grounded.",
    intuition:
      "Do not ask the model to memorize your company wiki. Embed documents once, embed the question at runtime, fetch nearest neighbors, and let the model read citations instead of hallucinating.",
    why: "The default enterprise pattern: fresh knowledge, sources, access control, without retraining anything.",
  },
  {
    id: "vae",
    title: "VAEs",
    domain: "generative",
    prereqs: ["autoencoders", "probability"],
    summary: "Autoencoders over distributions: encode to a distribution, sample, decode.",
    intuition:
      "Instead of a point in latent space, produce a cloud (mean plus variance) with a prior-pulling penalty. Sampling from that smooth cloud generates new data. The ELBO balances reconstruction against staying close to the prior.",
    why: "Taught the field latent-variable generation. Diffusion inherits its variational machinery directly.",
    formula: "ELBO = recon - KL(q(z|x) || p(z))",
  },
  {
    id: "gan",
    title: "GANs",
    domain: "generative",
    prereqs: ["backprop", "probability"],
    summary: "Forger vs detective: generator and discriminator improve in an adversarial game.",
    intuition:
      "The counterfeiter gets better only as fast as the detective does. Minimax training produces razor-sharp samples, but the game is unstable: mode collapse, oscillation, delicate tuning.",
    why: "Proved adversarial training works and dominated image generation 2014-2021. Historical context for why diffusion displaced it.",
    formula: "min_G max_D E[log D(x)] + E[log(1-D(G(z)))]",
  },
  {
    id: "diffusion",
    title: "Diffusion Models",
    domain: "generative",
    prereqs: ["vae", "cnn"],
    summary: "Learn to reverse gradual noising; generate by walking noise back to structure.",
    intuition:
      "Take a photo, add a bit of static, a thousand times until it is pure noise. Train a network to predict the static added at each step. Generation is running that film backward from TV snow to picture. Stable Diffusion and Sora live here.",
    why: "Current state of the art in image/video/audio generation: stable to train, high fidelity, controllable.",
  },
  {
    id: "multimodal",
    title: "Multimodal Models",
    domain: "generative",
    prereqs: ["transformers", "cnn"],
    summary: "Unify text, images, audio in one shared representation space.",
    intuition:
      "Project every modality into common embedding geometry so 'a photo of a sunset', the pixels of a sunset, and the sound of waves sit near each other. CLIP aligned image-text pairs; GPT-4V reasons across them.",
    why: "The frontier: world models that read, see, hear, and act through one interface.",
  },
  {
    id: "mdp",
    title: "MDPs",
    domain: "rl",
    prereqs: ["probability"],
    summary: "States, actions, rewards, transitions: the formal skeleton of sequential decisions.",
    intuition:
      "An agent in a maze: observe state, pick action, environment pays reward and hands you the next state. The Markov property means the present state is all you need; history adds nothing.",
    why: "The mathematical frame for every RL algorithm, game AI, robotics controller, and RLHF itself.",
  },
  {
    id: "q-learning",
    title: "Q-Learning",
    domain: "rl",
    prereqs: ["mdp"],
    summary: "Learn action values via bootstrapped Bellman updates; act greedily on Q.",
    intuition:
      "Keep a cheat-sheet rating every (state, action) pair by long-run payoff. After each step, blend observed reward plus next-state best value into the sheet. Off-policy: you can explore randomly and still converge.",
    why: "The cleanest entry to value-based RL, and DQN playing Atari from pixels is just this with a neural Q sheet.",
    formula: "Q(s,a) <- Q(s,a) + alpha(r + gamma max_a' Q(s',a') - Q(s,a))",
  },
  {
    id: "policy-gradients",
    title: "Policy Gradients",
    domain: "rl",
    prereqs: ["q-learning"],
    summary: "Differentiate the policy directly: increase log-prob of actions that paid off.",
    intuition:
      "Roll out episodes, note which actions led to reward, then nudge the policy network toward those actions proportionally to payoff. REINFORCE is trial-and-error made differentiable; variance reduction via baselines is essential.",
    why: "Handles continuous actions and stochastic optimal policies where value methods strain. The engine inside RLHF.",
    formula: "grad J = E[ grad log pi(a|s) * A(s,a) ]",
  },
  {
    id: "ppo",
    title: "PPO",
    domain: "rl",
    prereqs: ["policy-gradients"],
    summary: "Clip policy updates so each improvement step stays trustfully small.",
    intuition:
      "Policy gradients die from one oversized destructive update. PPO clips the probability ratio between old and new policy into a safe band: improve, but never lurch. Simple, robust, shockingly effective.",
    why: "The industry default for continuous control AND the RL half of RLHF for InstructGPT/ChatGPT.",
  },
  {
    id: "vector-databases",
    title: "Vector Databases",
    domain: "systems",
    prereqs: ["embeddings"],
    summary: "Billions of embeddings searched in milliseconds via ANN indexes like HNSW.",
    intuition:
      "Exact nearest neighbor over a billion vectors is hopeless, so build navigable graphs or quantized buckets that visit only a logarithmic sliver of the space, trading a little recall for enormous speed.",
    why: "The storage backbone of semantic search and RAG. Pinecone, pgvector, FAISS all implement this idea.",
  },
  {
    id: "agents",
    title: "Agents & Tool Use",
    domain: "systems",
    prereqs: ["prompting", "rag"],
    summary: "LLMs that plan, call tools, observe results, and loop until done.",
    intuition:
      "Wrap the model in a control loop: give it tools (search, code execution, APIs), let it emit structured calls, feed observations back, repeat. Reasoning emerges from the loop, not just the model.",
    why: "The current product frontier: coding agents, computer-use agents, research agents. All are this loop plus guardrails.",
  },
  {
    id: "serving-inference",
    title: "Inference Serving",
    domain: "systems",
    prereqs: ["gpt"],
    summary: "KV caching, continuous batching, paged attention: making generation fast and cheap.",
    intuition:
      "Autoregressive decoding is memory-bandwidth bound and wasteful: recomputing attention keys per token is insane, so cache them. Batch many requests into one pass; page the KV cache like virtual memory.",
    why: "vLLM-class systems cut serving costs by orders of magnitude. Latency engineering IS the product experience.",
  },
  {
    id: "quantization",
    title: "Quantization",
    domain: "systems",
    prereqs: ["serving-inference"],
    summary: "Shrink weights from FP16 to INT8/INT4 with minimal quality loss.",
    intuition:
      "Neural net weights are forgiving: store each in fewer bits, calibrate the rounding error, keep accuracy within a hair. A 70B model drops from 140GB to ~35GB and suddenly fits on consumer hardware.",
    why: "The gap between lab and laptop. GGUF, AWQ, GPTQ are this idea industrialized.",
  },
  {
    id: "distributed-training",
    title: "Distributed Training",
    domain: "systems",
    prereqs: ["optimizers", "gpt"],
    summary: "Split models and data across thousands of GPUs: DP, TP, PP, ZeRO.",
    intuition:
      "No single chip holds GPT-4. Shard the data (each GPU sees a slice), shard the layers (pipeline), shard each matmul (tensor parallel), shard optimizer states (ZeRO). Then fight communication overhead.",
    why: "Frontier training runs are planetary-scale distributed-systems problems wearing an ML costume.",
  },
  {
    id: "evaluation-benchmarks",
    title: "Evaluation",
    domain: "systems",
    prereqs: ["gpt"],
    summary: "Measuring capability honestly: benchmarks, contamination, evals-as-product.",
    intuition:
      "If a benchmark leaks into training data, you measured memorization. Good evals are held-out, task-faithful, and statistically powered. LLM-as-judge scales but inherits judge biases.",
    why: "Without trustworthy measurement, everything else on this map is unfalsifiable vibes.",
  },
  {
    id: "interpretability",
    title: "Interpretability",
    domain: "safety",
    prereqs: ["transformers"],
    summary: "Open the black box: circuits, features, sparse autoencoders, activation patching.",
    intuition:
      "Reverse-engineer the network like a biologist dissects an organ: find neurons that track specific concepts, causal pathways that implement algorithms, superposition packing many features into few dimensions.",
    why: "The only path to trusting model internals rather than outputs. Anthropic bet a company segment on it.",
  },
  {
    id: "adversarial-ml",
    title: "Adversarial ML",
    domain: "safety",
    prereqs: ["neural-nets"],
    summary: "Imperceptible perturbations break classifiers; jailbreaks break LLMs.",
    intuition:
      "Shift a panda photo's pixels by 0.1% along the loss gradient and the model screams 'gibbon'. Networks rely on brittle features; attackers exploit the gaps between robust features.",
    why: "Security mindset for ML systems: prompt injection, data poisoning, extraction attacks are production risks now.",
  },
  {
    id: "alignment",
    title: "Alignment",
    domain: "safety",
    prereqs: ["rlhf", "interpretability"],
    summary: "Making powerful models want what humans intend, provably and at scale.",
    intuition:
      "Specification gaming: the boat races through the target circle because the reward counted laps, not winning. As capability grows, naive objectives get optimized in increasingly alien ways. Alignment researches objectives, oversight, and honesty that survive scaling.",
    why: "The defining problem of the decade: capability is racing ahead, assurance lags. This is where careers will be made.",
  },
];

export const CONCEPT_MAP: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c])
);
