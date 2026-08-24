import { useEffect, useMemo, useState } from "react";
import { LEVELS, type TestResult } from "./data/levels";
import { runUserCode } from "./lib/runner";
import Editor from "./components/Editor";
import XorVisualizer from "./components/XorVisualizer";

const PROGRESS_KEY = "ai-playground-progress";
const CODE_KEY = "ai-playground-code";

function loadProgress(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export default function App() {
  const [passed, setPassed] = useState<Set<number>>(loadProgress);
  const [current, setCurrent] = useState(1);
  const [codes, setCodes] = useState<Record<number, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [justWon, setJustWon] = useState(false);

  const level = LEVELS[current - 1];
  const code = codes[level.id] ?? level.starterCode;
  const done = passed.has(level.id);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...passed]));
  }, [passed]);

  useEffect(() => {
    localStorage.setItem(CODE_KEY, JSON.stringify(codes));
  }, [codes]);

  const setCode = (c: string) => {
    setCodes((prev) => ({ ...prev, [level.id]: c }));
    setResults(null);
    setRunError(null);
  };

  const xorData = useMemo(() => {
    if (level.id !== 6 || !results?.every((r) => r.pass)) return null;
    const out = runUserCode(code, level.exports);
    if (!out.ok) return null;
    try {
      const t = out.exports.trainXor();
      return typeof t.predict === "function" ? t : null;
    } catch {
      return null;
    }
  }, [level.id === 6 ? results : null]);

  const runTests = () => {
    setShowSolution(false);
    setJustWon(false);
    const out = runUserCode(code, level.exports);
    if (!out.ok) {
      setRunError(out.error);
      setResults(null);
      return;
    }
    setRunError(null);
    const rs: TestResult[] = level.tests.map((t) => {
      try {
        const r = t.run(out.exports);
        return { name: t.name, pass: !!r.pass, detail: r.detail ?? "" };
      } catch (e) {
        return {
          name: t.name,
          pass: false,
          detail: `threw: ${e instanceof Error ? e.message : String(e)}`,
        };
      }
    });
    setResults(rs);
    if (rs.every((r) => r.pass) && !passed.has(level.id)) {
      setPassed((s) => new Set(s).add(level.id));
      setJustWon(true);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">◈</span>
          <h1>AI PLAYGROUND</h1>
          <span className="brand-sub">build it yourself or it never counts</span>
        </div>
        <div className="progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(passed.size / LEVELS.length) * 100}%` }} />
          </div>
          <span className="progress-num">{passed.size}/{LEVELS.length} cleared</span>
        </div>
      </header>

      <nav className="levelbar">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`level-btn ${l.id === current ? "active" : ""} ${passed.has(l.id) ? "cleared" : ""}`}
            onClick={() => {
              setCurrent(l.id);
              setResults(null);
              setRunError(null);
              setShowSolution(false);
              setJustWon(false);
            }}
          >
            {l.id}. {l.title}
          </button>
        ))}
      </nav>

      <main className="play-main">
        <section className="lesson">
          <div className="lesson-head">
            <h2>Level {level.id}: {level.title}</h2>
            {done && <span className="done-badge">✓ cleared</span>}
          </div>
          {level.theory.map((p, i) => (
            <p key={i} className="theory">{p}</p>
          ))}
          <div className="task-box">
            <strong>YOUR TASK</strong>
            <p>{level.task}</p>
          </div>

          <Editor code={code} onChange={setCode} />

          <div className="run-row">
            <button className="btn btn-accent run-btn" onClick={runTests}>
              ▶ run tests
            </button>
            <button
              className="btn"
              onClick={() => setCodes((prev) => ({ ...prev, [level.id]: level.starterCode }))}
            >
              reset code
            </button>
            <button className="btn btn-ghost" onClick={() => setShowSolution((v) => !v)}>
              {showSolution ? "hide solution" : "stuck? show solution"}
            </button>
          </div>

          {justWon && (
            <div className="win-banner">
              ⚡ ALL TESTS GREEN. Level {level.id + 1} unlocked. You built this with your own hands.
            </div>
          )}

          {runError && (
            <div className="error-box">
              <strong>your code threw before tests could run:</strong>
              <pre>{runError}</pre>
            </div>
          )}

          {results && (
            <div className="results">
              {results.map((r, i) => (
                <div key={i} className={`test-row ${r.pass ? "pass" : "fail"}`}>
                  <span>{r.pass ? "✓" : "✗"}</span>
                  <div>
                    <div className="test-name">{r.name}</div>
                    {r.detail && !r.pass && <div className="test-detail">{r.detail}</div>}
                  </div>
                </div>
              ))}
              {!results.every((r) => r.pass) && (
                <p className="results-hint">red means the machine disagrees with you. read the detail.</p>
              )}
            </div>
          )}

          {xorData && <XorVisualizer predict={xorData.predict} losses={xorData.losses} />}

          {showSolution && (
            <div className="solution-box">
              <strong>solution (read it, close it, type it yourself):</strong>
              <pre>{level.solution}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
