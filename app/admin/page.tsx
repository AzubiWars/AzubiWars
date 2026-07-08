"use client";

import { useState } from "react";
import { KATEGORIEN, type Kategorie, type Schwierigkeit } from "@/lib/anthropic";

const SCHWIERIGKEITEN: { value: Schwierigkeit; label: string }[] = [
  { value: "leicht", label: "🟢 Leicht (10 XP)" },
  { value: "mittel", label: "🟡 Mittel (20 XP)" },
  { value: "schwer", label: "🔴 Schwer (30 XP)" },
];

export default function AdminPage() {
  const [kategorie, setKategorie] = useState<Kategorie>(KATEGORIEN[0]);
  const [schwierigkeit, setSchwierigkeit] = useState<Schwierigkeit>("mittel");
  const [anzahl, setAnzahl] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategorie, schwierigkeit, anzahl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generierung fehlgeschlagen.");
      }

      setResult(
        `${data.added} neue Fragen generiert und in Firestore gespeichert!`
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unbekannter Fehler bei der Generierung."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">🤖 Admin</h1>
        <p className="mt-1 text-gray-500">
          Neue Fragen per Claude generieren und zum Pool hinzufügen
        </p>
      </div>

      <div className="card space-y-4">
        {/* Kategorie */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">
            Kategorie
          </label>
          <select
            value={kategorie}
            onChange={(e) => setKategorie(e.target.value as Kategorie)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          >
            {KATEGORIEN.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Schwierigkeit */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">
            Schwierigkeit
          </label>
          <div className="flex gap-2 flex-wrap">
            {SCHWIERIGKEITEN.map((s) => (
              <button
                key={s.value}
                onClick={() => setSchwierigkeit(s.value)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${
                  schwierigkeit === s.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Anzahl */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">
            Anzahl (max. 10 pro Batch)
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={anzahl}
            onChange={(e) => setAnzahl(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-bold text-brand-600">{anzahl}</div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary w-full"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Claude denkt nach…
            </span>
          ) : (
            `🤖 ${anzahl} Fragen generieren`
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center animate-slide-up">
            <p className="font-semibold text-green-700">✅ {result}</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center animate-slide-up">
            <p className="font-semibold text-red-600">❌ {error}</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Zurück zur Startseite
        </a>
      </div>
    </div>
  );
}
