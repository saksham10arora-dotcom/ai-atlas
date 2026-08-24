import { useState } from "react";
import Chat, { type Msg } from "./components/Chat";
import Settings, { loadSettings, type SettingsState } from "./components/Settings";
import { TOPICS, type Mode } from "./data/topics";
import { systemPrompt } from "./lib/prompts";
import { streamChat, type ChatMessage } from "./lib/providers";

export default function App() {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("learn");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState(0);

  const topic = TOPICS.find((t) => t.id === topicId) ?? null;
  const started = topic !== null;

  const startSession = (id: string, m: Mode) => {
    setTopicId(id);
    setMode(m);
    setMessages([]);
    setTurns(0);
  };

  const send = (text: string) => {
    if (!topic || busy) return;
    setTurns((n) => n + 1);
    sendRaw(text);
  };

  const sendRaw = (text?: string) => {
    if (!topic) return;
    const userMsg: Msg | null = text ? { role: "user", content: text } : null;

    const history: ChatMessage[] = [
      { role: "system", content: systemPrompt(mode, topic.title) },
      ...(text === undefined
        ? []
        : messages.map((m): ChatMessage => ({ role: m.role, content: m.content }))),
      ...(userMsg ? [{ role: "user" as const, content: userMsg.content }] : []),
    ];

    if (userMsg) setMessages((ms) => [...ms, userMsg]);
    setBusy(true);
    setStreaming("");

    let acc = "";
    streamChat({
      providerId: settings.providerId,
      apiKey: settings.apiKey,
      model: settings.model,
      messages: history,
      onToken: (t) => {
        acc += t;
        setStreaming(acc);
      },
      onDone: () => {
        setMessages((ms) => [...ms, { role: "assistant", content: acc }]);
        setStreaming("");
        setBusy(false);
      },
      onError: (e) => {
        setMessages((ms) => [
          ...ms,
          { role: "assistant", content: `**connection error.** ${e}\n\ncheck settings (api key, model, ollama CORS).` },
        ]);
        setStreaming("");
        setBusy(false);
      },
    });
  };

  const MODES: { id: Mode; label: string; desc: string }[] = [
    { id: "learn", label: "learn", desc: "guided discovery, one question at a time" },
    { id: "quiz", label: "quiz me", desc: "honest grading, adaptive difficulty" },
    { id: "debug", label: "debug me", desc: "explain it yourself, tutor finds your flaws" },
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">◈</span>
          <h1>AI TUTOR</h1>
          <span className="brand-sub">never gives you the answer</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="provider-tag">{settings.providerId} · {settings.model.split("/").pop()}</span>
          <button className="btn btn-sm" onClick={() => setShowSettings(true)}>settings</button>
        </div>
      </header>

      {!started ? (
        <div className="picker">
          <p className="picker-lead">pick a topic and a mode.</p>
          <div className="picker-grid">
            {TOPICS.map((t) => (
              <div key={t.id} className="topic-card">
                <span className="topic-area">{t.area}</span>
                <h3>{t.title}</h3>
                <div className="topic-modes">
                  {MODES.map((m) => (
                    <button key={m.id} title={m.desc} onClick={() => startSession(t.id, m.id)}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <nav className="session-bar">
            <button
              className="btn btn-sm"
              onClick={() => { setTopicId(null); setMessages([]); }}
            >
              ← topics
            </button>
            <span className="session-topic">{topic.title}</span>
            <div className="mode-switch">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  className={`btn btn-sm ${mode === m.id ? "btn-accent" : ""}`}
                  onClick={() => {
                    setMode(m.id);
                    setMessages([]);
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <span className="turn-count">{turns} turns</span>
          </nav>
          <Chat messages={messages} streaming={streaming} onSend={send} />
        </>
      )}

      {showSettings && (
        <Settings settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
