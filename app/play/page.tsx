"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SAMPLE_QUESTIONS, type SampleQuestion } from "@/lib/sample-questions";
import { getRang } from "@/lib/ranks";
import { useAuth } from "@/lib/auth-context";
import { AUSBILDUNGSBERUFE, type Ausbildungsberuf } from "@/lib/berufe";
import { KATEGORIEN, type Kategorie, type Schwierigkeit } from "@/lib/anthropic";

const ROUND_SIZE = 10;
const PUNKTE: Record<string, number> = { leicht: 10, mittel: 20, schwer: 30 };

// ── Streak-Bonus ──
function getStreakBonus(streak: number): number {
  if (streak >= 7) return 15;
  if (streak >= 5) return 10;
  if (streak >= 3) return 5;
  return 0;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
};

function buildRound(questions: SampleQuestion[], count: number, difficulty: string): SampleQuestion[] {
  if (difficulty !== "gemischt") {
    const filtered = questions.filter((q) => q.schwierigkeit === difficulty);
    return shuffle(filtered).slice(0, count);
  }
  const easy = shuffle(questions.filter((q) => q.schwierigkeit === "leicht")).slice(0, 3);
  const med = shuffle(questions.filter((q) => q.schwierigkeit === "mittel")).slice(0, 4);
  const hard = shuffle(questions.filter((q) => q.schwierigkeit === "schwer")).slice(0, 3);
  const result = [...easy, ...med, ...hard];
  if (result.length < count) {
    const rest = shuffle(questions.filter((q) => !result.includes(q)));
    result.push(...rest.slice(0, count - result.length));
  }
  return result.slice(0, count);
}

function getStorageNumber(key: string, fallback = 0): number {
  if (typeof window === "undefined") return fallback;
  return parseInt(localStorage.getItem(key) ?? String(fallback), 10);
}

// ── Kategorie-Icons ──
const KAT_ICONS: Record<string, string> = {
  "Beschaffung & Lagerhaltung": "📦",
  "Absatz & Marketing": "📢",
  "Rechnungswesen & Buchführung": "🧾",
  "Kosten- & Leistungsrechnung / Controlling": "📊",
  "Personalwirtschaft": "👥",
  "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)": "⚖️",
};

export default function PlayPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // ── Browser-Mode State ──
  const [mode, setMode] = useState<"browse" | "quiz">("browse");
  const [allQuestions, setAllQuestions] = useState(SAMPLE_QUESTIONS);
  const [selectedBeruf, setSelectedBeruf] = useState<Ausbildungsberuf>("Industriekaufmann/-frau");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("gemischt");
  const [selectedKategorie, setSelectedKategorie] = useState<string>("alle");
  const [berufSearch, setBerufSearch] = useState("");

  // ── Quiz-Mode State ──
  const [questions, setQuestions] = useState<SampleQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roundXp, setRoundXp] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXpFromStorage, setTotalXpFromStorage] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  // ── Init: Auth check + Community-Fragen laden ──
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }

    setTotalXpFromStorage(getStorageNumber("totalXp", 0));
    fetch(`/api/players?id=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.xpGesamt !== undefined && data.xpGesamt > getStorageNumber("totalXp", 0)) {
          localStorage.setItem("totalXp", String(data.xpGesamt));
          setTotalXpFromStorage(data.xpGesamt);
        }
      }).catch(() => {});

    // Community-Fragen laden
    fetch("/api/questions?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.questions?.length > 0) {
          const mapped = data.questions.map((q: Record<string, unknown>) => ({
            id: q.id as string, kategorie: q.kategorie as string,
            schwierigkeit: (q.schwierigkeit || "mittel") as "leicht" | "mittel" | "schwer",
            frage: q.frage as string, optionen: q.optionen as [string, string, string, string],
            korrekterIndex: q.korrekterIndex as 0|1|2|3, erklaerung: q.erklaerung as string,
            punkte: q.punkte as number, authorName: q.authorName as string | undefined,
            beruf: q.beruf as string | undefined,
          })) as SampleQuestion[];
          setAllQuestions([...mapped, ...SAMPLE_QUESTIONS]);
        }
      }).catch(() => {});

    // Gespeicherte Einstellungen laden
    const savedBeruf = localStorage.getItem("beruf");
    if (savedBeruf) setSelectedBeruf(savedBeruf as Ausbildungsberuf);
    const savedDiff = localStorage.getItem("difficulty");
    if (savedDiff) setSelectedDifficulty(savedDiff);
  }, [user, authLoading, router]);

  // ── Gefilterte Fragen für Browser ──
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedKategorie !== "alle" && q.kategorie !== selectedKategorie) return false;
      if (selectedBeruf !== "Industriekaufmann/-frau" && q.beruf && q.beruf !== selectedBeruf) return false;
      return true;
    });
  }, [allQuestions, selectedKategorie, selectedBeruf]);

  // ── Kategorie-Stats für Browser ──
  const katStats = useMemo(() => {
    return KATEGORIEN.map((kat) => ({
      name: kat,
      icon: KAT_ICONS[kat] || "📋",
      count: allQuestions.filter((q) => q.kategorie === kat).length,
      easy: allQuestions.filter((q) => q.kategorie === kat && q.schwierigkeit === "leicht").length,
      medium: allQuestions.filter((q) => q.kategorie === kat && q.schwierigkeit === "mittel").length,
      hard: allQuestions.filter((q) => q.kategorie === kat && q.schwierigkeit === "schwer").length,
    }));
  }, [allQuestions]);

  // ── Quiz starten ──
  const startQuiz = (kategorie?: string) => {
    const pool = kategorie
      ? allQuestions.filter((q) => q.kategorie === kategorie)
      : filteredQuestions;

    const byBeruf = pool.filter((q) => !q.beruf || q.beruf === selectedBeruf);
    const finalPool = byBeruf.length >= 5 ? byBeruf : pool;

    const round = buildRound(finalPool, ROUND_SIZE, selectedDifficulty);
    if (round.length === 0) return; // keine Fragen

    setQuestions(round);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsAnswered(false);
    setRoundXp(0);
    setRoundCorrect(0);
    setStreak(0);
    setHintUsed(false);
    setEliminatedOptions([]);
    setMode("quiz");

    localStorage.setItem("difficulty", selectedDifficulty);
    localStorage.setItem("beruf", selectedBeruf);
  };

  // ── Quiz: Handler ──
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const totalXp = totalXpFromStorage + roundXp;
  const rang = getRang(totalXp);
  const streakBonus = getStreakBonus(streak);

  const handleHint = useCallback(() => {
    if (isAnswered || hintUsed || !currentQuestion) return;
    const cost = Math.max(5, Math.floor(currentQuestion.punkte / 2));
    setRoundXp((prev) => prev - cost);
    setHintUsed(true);
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.korrekterIndex);
    setEliminatedOptions(shuffle(wrongIndices).slice(0, 2));
  }, [isAnswered, hintUsed, currentQuestion]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedIndex(optionIndex);
    setIsAnswered(true);
    const wasCorrect = optionIndex === currentQuestion.korrekterIndex;
    const newStreak = wasCorrect ? streak + 1 : 0;
    const xpGained = wasCorrect ? currentQuestion.punkte + getStreakBonus(newStreak) : 0;
    setStreak(newStreak);
    setRoundXp((prev) => prev + xpGained);
    if (wasCorrect) setRoundCorrect((prev) => prev + 1);
  }, [isAnswered, currentQuestion, streak]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      const newTotalXp = totalXpFromStorage + roundXp;
      localStorage.setItem("totalXp", String(newTotalXp));
      localStorage.setItem("totalCorrect", String(getStorageNumber("totalCorrect", 0) + roundCorrect));
      localStorage.setItem("totalAnswered", String(getStorageNumber("totalAnswered", 0) + questions.length));
      localStorage.setItem("bestStreak", String(Math.max(getStorageNumber("bestStreak", 0), streak)));
      localStorage.setItem("roundResults", JSON.stringify({ roundXp, roundCorrect, streak, total: questions.length }));
      localStorage.setItem("roundTotalXp", String(roundXp));
      localStorage.setItem("streak", String(streak));
      localStorage.setItem("startXp", String(totalXpFromStorage));

      if (user) {
        fetch("/api/players", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: user.uid, xpGained: roundXp, wasCorrect: roundCorrect > 0,
            nickname: localStorage.getItem("nickname") || user.email?.split("@")[0] || "Azubi",
          }),
        }).catch(() => {});
      }

      router.push("/ergebnis");
    } else {
      setSelectedIndex(null); setIsAnswered(false);
      setHintUsed(false); setEliminatedOptions([]);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, roundXp, roundCorrect, streak, totalXpFromStorage, user, router]);

  // ── Loading ──
  if (authLoading) {
    return <div className="flex items-center justify-center py-20"><p className="text-gray-500">Lade…</p></div>;
  }

  // ═══════════════════ BROWSER MODE ═══════════════════
  if (mode === "browse") {
    return (
      <div className="animate-slide-up space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100">⚡ Battlen</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Wähle eine Kategorie oder starte direkt eine gemischte Runde mit Fragen aus deinem Ausbildungsberuf.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button onClick={() => startQuiz()} className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
            🎲 Zufällige Runde starten
          </button>
          <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
            {(["gemischt", "leicht", "mittel", "schwer"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedDifficulty === d
                    ? "bg-[#D6462A] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                {d === "gemischt" ? "🎯 Mix" : d === "leicht" ? "🟢 Leicht" : d === "mittel" ? "🟡 Mittel" : "🔴 Schwer"}
              </button>
            ))}
          </div>
        </div>

        {/* Beruf Selector */}
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            value={berufSearch}
            onChange={(e) => { setBerufSearch(e.target.value); if (e.target.value === "") setSelectedBeruf("Industriekaufmann/-frau"); }}
            placeholder="🔍 Ausbildungsberuf filtern…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-[#D6462A]/50 placeholder:text-gray-500 text-center"
          />
          {berufSearch && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a22]">
              {AUSBILDUNGSBERUFE.filter((b) => b.toLowerCase().includes(berufSearch.toLowerCase())).slice(0, 15).map((b) => (
                <button key={b} onClick={() => { setSelectedBeruf(b); setBerufSearch(""); }}
                  className={`w-full text-left px-4 py-2 text-sm ${b === selectedBeruf ? "bg-[#D6462A]/10 text-[#D6462A]" : "text-gray-400 hover:bg-white/[0.04]"}`}>
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Kategorien</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {katStats.map((kat) => (
              <button
                key={kat.name}
                onClick={() => startQuiz(kat.name)}
                className="card p-4 text-left hover:bg-white/[0.06] transition-all group flex items-center gap-4"
              >
                <span className="text-2xl">{kat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 group-hover:text-gray-100 truncate">
                    {kat.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-500">{kat.count} Fragen</span>
                    <span className="flex gap-1">
                      {kat.easy > 0 && <span className="text-[10px] px-1 rounded bg-green-500/10 text-green-500">{kat.easy}🟢</span>}
                      {kat.medium > 0 && <span className="text-[10px] px-1 rounded bg-yellow-500/10 text-yellow-500">{kat.medium}🟡</span>}
                      {kat.hard > 0 && <span className="text-[10px] px-1 rounded bg-red-500/10 text-red-500">{kat.hard}🔴</span>}
                    </span>
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-lg">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* All Questions Quick-Start */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 mb-3">
            {filteredQuestions.length} Fragen verfügbar · {selectedBeruf} · {
              selectedDifficulty === "gemischt" ? "Progressiv" : selectedDifficulty
            }
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════ QUIZ MODE ═══════════════════
  if (!currentQuestion) return null;

  const difficultyPhase = currentIndex < 3 ? "🟢 Leicht" : currentIndex < 7 ? "🟡 Mittel" : "🔴 Schwer";

  return (
    <div className="mx-auto max-w-2xl animate-slide-up">
      {/* Top Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
          <button onClick={() => setMode("browse")} className="hover:text-gray-200 transition-colors text-xs">← Zurück</button>
          <span>Frage {currentIndex + 1}/{questions.length}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{difficultyPhase}</span>
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#D6462A] to-[#e85d3f] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D6462A]/20 px-3 py-1 text-sm font-semibold text-[#e85d3f]">⭐ {totalXp} XP</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-gray-300">{rang.emoji} {rang.name}</span>
          {streak >= 3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-400">🔥 {streak}er Streak{streakBonus > 0 && ` · +${streakBonus}`}!</span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-4">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-gray-400">{currentQuestion.kategorie}</span>
          <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
            currentQuestion.schwierigkeit === "leicht" ? "bg-green-500/20 text-green-400" :
            currentQuestion.schwierigkeit === "mittel" ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400"}`}>
            {currentQuestion.schwierigkeit} · {currentQuestion.punkte} XP
          </span>
          {currentQuestion.authorName && (
            <span className="rounded-lg bg-[#D6462A]/10 px-2 py-0.5 text-xs font-medium text-[#D6462A]/70">von {currentQuestion.authorName}</span>
          )}
          {hintUsed && <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-400">💡 Tipp</span>}
        </div>
        <h2 className="mb-6 text-lg sm:text-xl font-bold text-gray-100 leading-relaxed">{currentQuestion.frage}</h2>
        <div className="space-y-2.5">
          {currentQuestion.optionen.map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            let btnClass = "option-btn text-gray-200";
            if (isAnswered) {
              if (idx === currentQuestion.korrekterIndex) btnClass = "option-btn option-btn-correct text-green-300";
              else if (idx === selectedIndex) btnClass = "option-btn option-btn-wrong text-red-300";
              else btnClass = "option-btn option-btn-disabled opacity-40";
            }
            if (isEliminated) btnClass += " opacity-20 line-through";
            return (
              <button key={idx} className={btnClass} onClick={() => handleAnswer(idx)} disabled={isAnswered || isEliminated}>
                <span className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-gray-400">{["A","B","C","D"][idx]}</span>
                  <span className="text-left">{option}</span>
                  {isAnswered && idx === currentQuestion.korrekterIndex && <span className="ml-auto text-green-400 text-lg">✅</span>}
                  {isAnswered && idx !== currentQuestion.korrekterIndex && idx === selectedIndex && <span className="ml-auto text-red-400 text-lg">❌</span>}
                  {isEliminated && <span className="ml-auto text-gray-500 text-sm">🚫</span>}
                </span>
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <div className={`mt-4 rounded-xl p-4 animate-slide-up ${selectedIndex === currentQuestion.korrekterIndex ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
            <p className="font-semibold mb-1 text-sm text-gray-200">
              {selectedIndex === currentQuestion.korrekterIndex ? "✅ Richtig!" : `❌ Falsch. Richtig: ${["A","B","C","D"][currentQuestion.korrekterIndex]}.`}
            </p>
            {selectedIndex === currentQuestion.korrekterIndex && (
              <p className="text-sm font-medium text-green-400">+{currentQuestion.punkte} XP{streakBonus > 0 && streak >= 3 && <span className="text-orange-400"> · +{streakBonus} Bonus 🔥</span>}</p>
            )}
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">💡 {currentQuestion.erklaerung}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isAnswered && !hintUsed && (
          <button onClick={handleHint} className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-500/20">
            💡 50:50-Tipp ({Math.max(5, Math.floor(currentQuestion.punkte / 2))} XP) — Entfernt zwei falsche Antworten
          </button>
        )}
        {isAnswered && (
          <button onClick={handleNext} className="btn-primary w-full text-lg">
            {currentIndex + 1 >= questions.length ? "🏁 Ergebnis anzeigen" : "👉 Weiter"}
          </button>
        )}
      </div>
    </div>
  );
}
