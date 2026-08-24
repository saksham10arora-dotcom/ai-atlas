import { useState } from "react";
import { PROVIDERS } from "../lib/providers";

export interface SettingsState {
  providerId: string;
  model: string;
  apiKey: string;
}

const KEY_STORE = "ai-tutor-key";
const PROV_STORE = "ai-tutor-provider";

export function loadSettings(): SettingsState {
  const providerId = localStorage.getItem(PROV_STORE) ?? "openrouter";
  const p = PROVIDERS.find((x) => x.id === providerId) ?? PROVIDERS[0];
  return {
    providerId,
    model: p.models[0],
    apiKey: localStorage.getItem(KEY_STORE) ?? "",
  };
}

export default function Settings({
  settings,
  onSave,
  onClose,
}: {
  settings: SettingsState;
  onSave: (s: SettingsState) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(settings);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>settings</h2>
        <label className="field">
          provider
          <select
            value={draft.providerId}
            onChange={(e) => {
              const p = PROVIDERS.find((x) => x.id === e.target.value)!;
              setDraft({ ...draft, providerId: p.id, model: p.models[0] });
            }}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          model
          <select value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })}>
            {(PROVIDERS.find((p) => p.id === draft.providerId)?.models ?? []).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        {PROVIDERS.find((p) => p.id === draft.providerId)?.needsKey && (
          <label className="field">
            api key (stored only in your browser's localStorage)
            <input
              type="password"
              placeholder={PROVIDERS.find((p) => p.id === draft.providerId)?.keyHint}
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
            />
          </label>
        )}
        <p className="hint">
          ollama users: run with OLLAMA_ORIGINS=* to allow browser requests.
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>cancel</button>
          <button
            className="btn btn-accent"
            onClick={() => {
              localStorage.setItem(KEY_STORE, draft.apiKey);
              localStorage.setItem(PROV_STORE, draft.providerId);
              onSave(draft);
              onClose();
            }}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}
