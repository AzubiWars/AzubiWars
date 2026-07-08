"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KATEGORIEN, type Kategorie, type Schwierigkeit } from "@/lib/anthropic";
import { AUSBILDUNGSBERUFE, type Ausbildungsberuf } from "@/lib/berufe";

export default function ErstellenPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    setNickname(localStorage.getItem("nickname") ?? "");
    setPlayerId(localStorage.getItem("playerId") ?? "");
  }, []);

  const [frage, setFrage] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [korrekt, setKorrekt] = useState<number>(0);
  const [erklaerung, setErklaerung] = useState("");
  const [kategorie, setKategorie] = useState<Kategorie>(KATEGORIEN[0]);
  const [schwierigkeit, setSchwierigkeit] = useState<Schwierigkeit>("mittel");
  const [beruf, setBeruf] = useState<Ausbildungsberuf>("Industriekaufmann/-frau");
  const [berufSearch, setBerufSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const optionen = [optionA, optionB, optionC, optionD] as [string, string, string, string];

  const handleSubmit = async () => {
    if (!frage.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim() || !erklaerung.trim()) {
      setResult({ success: false, message: "Bitte alle Felder ausfüllen." });
      return;
    }
    if (!nickname) {
      setResult({ success: false, message: "Bitte erst auf der Startseite einen Nickname eingeben." });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frage: frage.trim(),
          optionen: optionen.map((o) => o.trim()),
          korrekterIndex: korrekt,
          erklaerung: erklaerung.trim(),
          kategorie,
          schwierigkeit,
          authorId: playerId,
          authorName: nickname,
          beruf,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: "✅ Deine Aufgabe wurde eingereicht und erscheint jetzt im Fragen-Pool!" });
        // Formular zurücksetzen
        setFrage("");
        setOptionA(""); setOptionB(""); setOptionC(""); setOptionD("");
        setKorrekt(0); setErklaerung("");
      } else {
        setResult({ success: false, message: data.error || "Fehler beim Speichern." });
      }
    } catch {
      setResult({ success: false, message: "Netzwerkfehler. Bitte versuche es erneut." });
    } finally {
      setSubmitting(false);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-200">🛠️ Aufgabe erstellen</h1>
        <p className="mt-1 text-sm text-gray-400">
          Erstelle eine eigene IHK-Prüfungsfrage für die Community
        </p>
      </div>

      <div className="card space-y-5">
        {/* Frage */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Frage</label>
          <textarea
            value={frage}
            onChange={(e) => setFrage(e.target.value)}
            placeholder="Formuliere deine Prüfungsfrage…"
            rows={3}
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 outline-none focus:border-[#D6462A] focus:ring-2 focus:ring-[#D6462A]/20 placeholder:text-gray-500 resize-none"
          />
        </div>

        {/* Optionen */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Antwortoptionen <span className="text-xs text-gray-500">(genau eine richtig)</span>
          </label>
          <div className="space-y-2">
            {optionLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKorrekt(i)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    korrekt === i
                      ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/50"
                      : "bg-white/10 text-gray-500 hover:bg-white/20"
                  }`}
                  title={korrekt === i ? "Richtige Antwort" : "Als richtig markieren"}
                >
                  {label}
                </button>
                <input
                  type="text"
                  value={[optionA, optionB, optionC, optionD][i]}
                  onChange={(e) => {
                    const setters = [setOptionA, setOptionB, setOptionC, setOptionD];
                    setters[i]!(e.target.value);
                  }}
                  placeholder={`Option ${label}…`}
                  className="flex-1 rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A] focus:ring-2 focus:ring-[#D6462A]/20 placeholder:text-gray-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Erklärung */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Erklärung</label>
          <textarea
            value={erklaerung}
            onChange={(e) => setErklaerung(e.target.value)}
            placeholder="Warum ist die richtige Antwort richtig? (1–2 Sätze)"
            rows={2}
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 outline-none focus:border-[#D6462A] focus:ring-2 focus:ring-[#D6462A]/20 placeholder:text-gray-500 resize-none"
          />
        </div>

        {/* Kategorie + Schwierigkeit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Kategorie</label>
            <select
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value as Kategorie)}
              className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A]"
            >
              {KATEGORIEN.map((k) => (
                <option key={k} value={k} className="bg-gray-900">{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Schwierigkeit</label>
            <div className="flex gap-1">
              {(["leicht", "mittel", "schwer"] as Schwierigkeit[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchwierigkeit(s)}
                  className={`flex-1 rounded-xl border-2 px-2 py-2 text-xs font-medium transition-all ${
                    schwierigkeit === s
                      ? s === "leicht" ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : s === "mittel" ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                      : "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-white/10 text-gray-500 hover:border-white/20"
                  }`}
                >
                  {s === "leicht" ? "🟢 Leicht" : s === "mittel" ? "🟡 Mittel" : "🔴 Schwer"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Beruf */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Ausbildungsberuf <span className="text-xs text-gray-500">(für wen ist diese Frage?)</span>
          </label>
          <input
            type="text"
            value={berufSearch}
            onChange={(e) => setBerufSearch(e.target.value)}
            placeholder="🔍 Beruf suchen…"
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500"
          />
          {berufSearch && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a22]">
              {AUSBILDUNGSBERUFE.filter((b) => b.toLowerCase().includes(berufSearch.toLowerCase())).slice(0, 15).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => { setBeruf(b); setBerufSearch(""); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    b === beruf ? "bg-[#D6462A]/10 text-[#D6462A]" : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
          {!berufSearch && (
            <p className="mt-1 text-xs text-gray-500">
              Gewählt: <span className="text-[#D6462A]">{beruf}</span>
            </p>
          )}
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          {showPreview ? "👁️ Vorschau ausblenden" : "👁️ Vorschau anzeigen"}
        </button>

        {/* Vorschau */}
        {showPreview && (
          <div className="rounded-xl border border-dashed border-white/10 p-4 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Vorschau</p>
            <p className="font-semibold text-gray-200">{frage || "(Keine Frage eingegeben)"}</p>
            <div className="space-y-1">
              {optionen.map((opt, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    i === korrekt ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-white/5 text-gray-400"
                  }`}
                >
                  <span className="font-bold mr-2">{optionLabels[i]}.</span>
                  {opt || `(Option ${optionLabels[i]} leer)`}
                  {i === korrekt && <span className="ml-2 text-xs">✓ Richtig</span>}
                </div>
              ))}
            </div>
            {erklaerung && (
              <p className="text-xs text-gray-400">💡 {erklaerung}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full"
        >
          {submitting ? "⏳ Wird eingereicht…" : "📤 Aufgabe einreichen"}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`rounded-xl p-3 text-center text-sm font-medium ${
              result.success
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {result.message}
          </div>
        )}
      </div>

      <div className="text-center">
        <a href="/challenges" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
          📋 Community-Aufgaben ansehen →
        </a>
      </div>
    </div>
  );
}
