"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AUSBILDUNGSBERUFE, type Ausbildungsberuf } from "@/lib/berufe";

interface FrageForm {
  frage: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  korrekt: number;
  erklaerung: string;
}

function emptyFrage(): FrageForm {
  return { frage: "", optionA: "", optionB: "", optionC: "", optionD: "", korrekt: 0, erklaerung: "" };
}

export default function ErstellenPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("nickname");
    if (stored) setNickname(stored);
    else if (user?.email) setNickname(user.email.split("@")[0]!);
  }, [user]);

  const [fragen, setFragen] = useState<FrageForm[]>([emptyFrage()]);
  const [beruf, setBeruf] = useState<Ausbildungsberuf>("Industriekaufmann/-frau");
  const [berufSearch, setBerufSearch] = useState("");
  const [schwierigkeit, setSchwierigkeit] = useState<"leicht" | "mittel" | "schwer">("mittel");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const updateFrage = (i: number, field: keyof FrageForm, value: string | number) => {
    setFragen((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  };

  const addFrage = () => setFragen((prev) => [...prev, emptyFrage()]);
  const removeFrage = (i: number) => {
    if (fragen.length <= 1) return;
    setFragen((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    // Validierung
    for (let i = 0; i < fragen.length; i++) {
      const f = fragen[i]!;
      if (!f.frage.trim() || f.frage.trim().length < 5) {
        setResult({ success: false, message: `Frage ${i + 1}: Bitte mindestens 5 Zeichen eingeben.` }); return;
      }
      if (!f.optionA.trim() || !f.optionB.trim() || !f.optionC.trim() || !f.optionD.trim()) {
        setResult({ success: false, message: `Frage ${i + 1}: Alle 4 Optionen ausfüllen.` }); return;
      }
      if (!f.erklaerung.trim() || f.erklaerung.trim().length < 5) {
        setResult({ success: false, message: `Frage ${i + 1}: Erklärung fehlt (min. 5 Zeichen).` }); return;
      }
    }
    if (!nickname) {
      setResult({ success: false, message: "Nicht eingeloggt. Bitte erst auf der Startseite einloggen." }); return;
    }

    setSubmitting(true);
    setResult(null);

    let saved = 0;
    for (const f of fragen) {
      try {
        const res = await fetch("/api/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            frage: f.frage.trim(),
            optionen: [f.optionA.trim(), f.optionB.trim(), f.optionC.trim(), f.optionD.trim()],
            korrekterIndex: f.korrekt,
            erklaerung: f.erklaerung.trim(),
            schwierigkeit,
            beruf,
            authorId: user?.uid || "anonymous",
            authorName: nickname,
          }),
        });
        if (res.ok) saved++;
      } catch { /* continue */ }
    }

    setSubmitting(false);
    if (saved === fragen.length) {
      setResult({ success: true, message: `✅ ${saved} Frage(n) erfolgreich eingereicht!` });
      setFragen([emptyFrage()]);
    } else if (saved > 0) {
      setResult({ success: true, message: `⚠️ ${saved}/${fragen.length} Fragen gespeichert.` });
    } else {
      setResult({ success: false, message: "Keine Fragen gespeichert. Prüfe die Verbindung." });
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-200">🛠️ Challenge erstellen</h1>
        <p className="mt-1 text-sm text-gray-400">
          Erstelle eigene Prüfungsfragen für die Community
        </p>
      </div>

      {/* Beruf + Schwierigkeit */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Ausbildungsberuf</label>
            <input
              type="text" value={berufSearch}
              onChange={(e) => setBerufSearch(e.target.value)}
              placeholder={beruf}
              className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500"
            />
            {berufSearch && (
              <div className="mt-1 max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a22]">
                {AUSBILDUNGSBERUFE.filter((b) => b.toLowerCase().includes(berufSearch.toLowerCase())).slice(0, 10).map((b) => (
                  <button key={b} type="button" onClick={() => { setBeruf(b); setBerufSearch(""); }}
                    className={`w-full text-left px-3 py-2 text-sm ${b === beruf ? "bg-[#D6462A]/10 text-[#D6462A]" : "text-gray-400 hover:bg-white/[0.04]"}`}>{b}</button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Schwierigkeit</label>
            <div className="flex gap-1">
              {(["leicht", "mittel", "schwer"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSchwierigkeit(s)}
                  className={`flex-1 rounded-xl border-2 px-2 py-2.5 text-xs font-medium transition-all ${
                    schwierigkeit === s
                      ? s === "leicht" ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : s === "mittel" ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                      : "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-white/10 text-gray-500 hover:border-white/20"
                  }`}>{s === "leicht" ? "🟢 Leicht" : s === "mittel" ? "🟡 Mittel" : "🔴 Schwer"}</button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Alle {fragen.length} Fragen werden für <span className="text-[#D6462A]">{beruf}</span> auf <span className="text-gray-400">{schwierigkeit}</span>-Niveau eingereicht.
        </p>
      </div>

      {/* Fragen-Liste */}
      {fragen.map((f, i) => (
        <div key={i} className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Frage {i + 1}</h3>
            {fragen.length > 1 && (
              <button onClick={() => removeFrage(i)} className="text-xs text-gray-500 hover:text-red-400">✕ Entfernen</button>
            )}
          </div>

          <textarea
            value={f.frage} onChange={(e) => updateFrage(i, "frage", e.target.value)}
            placeholder="Formuliere deine Prüfungsfrage…" rows={2}
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 outline-none focus:border-[#D6462A] focus:ring-2 focus:ring-[#D6462A]/20 placeholder:text-gray-500 resize-none"
          />

          <div className="space-y-2">
            {["A", "B", "C", "D"].map((label, oi) => (
              <div key={label} className="flex items-center gap-2">
                <button type="button" onClick={() => updateFrage(i, "korrekt", oi)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    f.korrekt === oi ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/50" : "bg-white/10 text-gray-500 hover:bg-white/20"
                  }`}>{label}</button>
                <input
                  type="text" value={[f.optionA, f.optionB, f.optionC, f.optionD][oi]}
                  onChange={(e) => updateFrage(i, `option${label}` as keyof FrageForm, e.target.value)}
                  placeholder={`Option ${label}…`}
                  className="flex-1 rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500"
                />
              </div>
            ))}
          </div>

          <textarea
            value={f.erklaerung} onChange={(e) => updateFrage(i, "erklaerung", e.target.value)}
            placeholder="Warum ist die richtige Antwort richtig? (1–2 Sätze)" rows={2}
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500 resize-none"
          />
        </div>
      ))}

      {/* + Button */}
      <button onClick={addFrage}
        className="w-full rounded-xl border-2 border-dashed border-white/10 py-3 text-sm text-gray-400 hover:border-[#D6462A]/30 hover:text-[#D6462A] transition-all">
        ＋ Weitere Frage hinzufügen
      </button>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full text-lg">
        {submitting ? "⏳ Wird eingereicht…" : `📤 ${fragen.length} Frage(n) einreichen`}
      </button>

      {result && (
        <div className={`rounded-xl p-3 text-center text-sm font-medium ${
          result.success ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"
        }`}>{result.message}</div>
      )}

      <div className="text-center">
        <a href="/challenges" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">📋 Community-Aufgaben ansehen →</a>
      </div>
    </div>
  );
}
