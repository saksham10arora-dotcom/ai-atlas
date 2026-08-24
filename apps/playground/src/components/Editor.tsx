import { useRef, useState } from "react";

export default function Editor({
  code,
  onChange,
}: {
  code: string;
  onChange: (c: string) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const lineCount = code.split("\n").length;

  return (
    <div className={`editor ${focused ? "editor-focus" : ""}`}>
      <div
        ref={gutterRef}
        className="gutter"
        onScroll={() => {
          if (taRef.current && gutterRef.current)
            gutterRef.current.scrollTop = taRef.current.scrollTop;
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        className="code-area"
        value={code}
        spellCheck={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onScroll={() => {
          if (taRef.current && gutterRef.current)
            gutterRef.current.scrollTop = taRef.current.scrollTop;
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const ta = e.currentTarget;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const next = code.slice(0, start) + "  " + code.slice(end);
            onChange(next);
            requestAnimationFrame(() => {
              ta.selectionStart = ta.selectionEnd = start + 2;
            });
          }
        }}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
