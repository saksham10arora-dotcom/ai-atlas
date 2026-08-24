export function renderMarkdown(src: string): string {
  let s = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  s = s.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

  const parts = s.split(/(<pre>[\s\S]*?<\/pre>)/g);
  return parts
    .map((p) =>
      p.startsWith("<pre>")
        ? p
        : p
            .split(/\n{2,}/)
            .map((para) => (para.trim() ? `<p>${para.trim().replace(/\n/g, "<br/>")}</p>` : ""))
            .join("")
    )
    .join("");
}
