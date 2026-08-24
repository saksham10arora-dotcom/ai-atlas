export interface Provider {
  id: string;
  label: string;
  baseUrl: string;
  models: string[];
  needsKey: boolean;
  keyHint?: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: [
      "anthropic/claude-3.5-haiku",
      "openai/gpt-4o-mini",
      "meta-llama/llama-3.3-70b-instruct",
      "google/gemini-flash-1.5",
    ],
    needsKey: true,
    keyHint: "sk-or-...",
  },
  {
    id: "groq",
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    needsKey: true,
    keyHint: "gsk_...",
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    baseUrl: "http://localhost:11434/v1",
    models: ["llama3.2", "qwen2.5", "mistral"],
    needsKey: false,
  },
];

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamConfig {
  providerId: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  onToken: (t: string) => void;
  onDone: () => void;
  onError: (e: string) => void;
}

export async function streamChat(cfg: StreamConfig) {
  const p = PROVIDERS.find((x) => x.id === cfg.providerId)!;
  try {
    const res = await fetch(`${p.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(p.needsKey && cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: cfg.messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 900,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    if (!res.body) throw new Error("no response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") {
          cfg.onDone();
          return;
        }
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) cfg.onToken(delta);
        } catch {
          // partial json, wait for more
        }
      }
    }
    cfg.onDone();
  } catch (e) {
    cfg.onError(e instanceof Error ? e.message : String(e));
  }
}
