export type RunOutcome =
  | { ok: true; exports: Record<string, any> }
  | { ok: false; error: string };

export function runUserCode(code: string, exportNames: string[]): RunOutcome {
  try {
    const collectors = exportNames
      .map((n) => `${JSON.stringify(n)}: typeof ${n} !== "undefined" ? ${n} : undefined`)
      .join(", ");
    const factory = new Function(`"use strict";\n${code}\n\nreturn { ${collectors} };`);
    const result = factory();
    return { ok: true, exports: result };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
    };
  }
}
