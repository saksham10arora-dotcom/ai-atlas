import { useEffect, useRef, useState } from "react";
import { renderMarkdown } from "../lib/markdown";

export interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function Chat({
  messages,
  streaming,
  onSend,
}: {
  messages: Msg[];
  streaming: string;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streaming]);

  const submit = () => {
    const t = input.trim();
    if (!t) return;
    setInput("");
    onSend(t);
  };

  return (
    <div className="chat">
      <div className="chat-scroll">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-avatar">{m.role === "user" ? "you" : "tutor"}</div>
            <div
              className="msg-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
            />
          </div>
        ))}
        {streaming && (
          <div className="msg assistant">
            <div className="msg-avatar">tutor</div>
            <div
              className="msg-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(streaming + "▍") }}
            />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <textarea
          value={input}
          placeholder="answer the tutor's question... (enter to send)"
          rows={2}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button className="btn btn-accent" onClick={submit} disabled={!input.trim()}>
          send
        </button>
      </div>
    </div>
  );
}
