"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SAMPLE_QUESTIONS, type SampleQuestion } from "@/lib/sample-questions";
import { getRang } from "@/lib/ranks";
import { useAuth } from "@/lib/auth-context";

const ROUND_SIZE = 10;

// ── Streak-Bonus ──
function getStreakBonus(streak: number): number {
  if (streak >= 7) return 15;
  if (streak >= 5) return 10;
  if (streak >= 3) return 5;
  return 0;
}

// ── Fragen-Runde bauen (respektiert difficulty) ──
function buildRound(
  questions: SampleQuestion[],
  count: number,
  difficulty: string
): SampleQuestion[] {
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  };

  // Einzelne Schwierigkeit gewählt → nur diese Fragen
  if (difficulty !== "gemischt") {
    const filtered = questions.filter((q) => q.schwierigkeit === difficulty);
    return shuffle(filtered).slice(0, count);
  }

  // Gemischt: progressiv (leicht → mittel → schwer)
  const easy = questions.filter((q) => q.schwierigkeit === "leicht");
  const medium = questions.filter((q) => q.schwierigkeit === "mittel");
  const hard = questions.filter((q) => q.schwierigkeit === "schwer");

  const pick = shuffle(easy).slice(0, 3);
  const pMed = shuffle(medium).slice(0, 4);
  const pHard = shuffle(hard).slice(0, 3);

  const result = [...pick, ...pMed, ...pHard];
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

export default function PlayPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [allQuestions, setAllQuestions] = useState(SAMPLE_QUESTIONS);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fragen-Runde (respektiert Schwierigkeit + Beruf, inkl. Community-Fragen)
  const questions = useMemo(() => {
    const diff = typeof window !== "undefined" ? localStorage.getItem("difficulty") ?? "gemischt" : "gemischt";
    const beruf = typeof window !== "undefined" ? localStorage.getItem("beruf") ?? "Industriekaufmann/-frau" : "Industriekaufmann/-frau";
    const byBeruf = allQuestions.filter((q) => !q.beruf || q.beruf === beruf);
    const pool = byBeruf.length >= 5 ? byBeruf : allQuestions;
    return buildRound(pool, ROUND_SIZE, diff);
  }, [allQuestions]);

  // Community-Fragen vom Server laden und mit lokalen mischen
  useEffect(() => {
    fetch("/api/questions?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.questions && data.questions.length > 0) {
          // Firestore-Fragen mit Sample-Fragen mergen
          const firestoreQs = data.questions.map((q: Record<string, unknown>) => ({
            ...q,
            id: q.id as string,
            frage: q.frage as string,
            optionen: q.optionen as [string, string, string, string],
            korrekterIndex: q.korrekterIndex as 0 | 1 | 2 | 3,
            erklaerung: q.erklaerung as string,
            kategorie: q.kategorie as string,
            schwierigkeit: q.schwierigkeit as "leicht" | "mittel" | "schwer",
            punkte: q.punkte as number,
            authorName: q.authorName as string | undefined,
          })) as SampleQuestion[];
          setAllQuestions([...firestoreQs, ...SAMPLE_QUESTIONS]);
        }
        setLoadingQuestions(false);
      })
      .catch(() => setLoadingQuestions(false));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roundXp, setRoundXp] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXpFromStorage, setTotalXpFromStorage] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]); // per 50:50 ausgeblendet

  // ── Beim Laden: Auth check + XP vom Server syncen ──
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    // Lokale XP als Fallback
    const localXp = getStorageNumber("totalXp", 0);
    setTotalXpFromStorage(localXp);

    // Vom Server aktuelle XP laden (Firestore)
    fetch(`/api/players?id=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.xpGesamt !== undefined && data.xpGesamt > localXp) {
          setTotalXpFromStorage(data.xpGesamt);
          localStorage.setItem("totalXp", String(data.xpGesamt));
        }
      })
      .catch(() => { /* Offline → lokale XP nutzen */ });
  }, [user, authLoading, router]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const totalXp = totalXpFromStorage + roundXp;

  // ── 50:50 Tipp ──
  const handleHint = useCallback(() => {
    if (isAnswered || hintUsed || !currentQuestion) return;

    // Kosten: halbe XP der Frage (min. 5)
    const cost = Math.max(5, Math.floor(currentQuestion.punkte / 2));
    setRoundXp((prev) => prev - cost);
    setHintUsed(true);

    // Zwei falsche Optionen zufällig auswählen zum Ausblenden
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.korrekterIndex);
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    setEliminatedOptions(shuffled.slice(0, 2));
  }, [isAnswered, hintUsed, currentQuestion]);

  // ── Antwort-Handler ──
  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (isAnswered || !currentQuestion) return;

      setSelectedIndex(optionIndex);
      setIsAnswered(true);

      const wasCorrect = optionIndex === currentQuestion.korrekterIndex;
      const newStreak = wasCorrect ? streak + 1 : 0;
      const baseXp = wasCorrect ? currentQuestion.punkte : 0;
      const bonus = wasCorrect ? getStreakBonus(newStreak) : 0;
      const xpGained = baseXp + bonus;

      setStreak(newStreak);
      setRoundXp((prev) => prev + xpGained);
      if (wasCorrect) setRoundCorrect((prev) => prev + 1);
    },
    [isAnswered, currentQuestion, streak]
  );

  // ── Nächste Frage ──
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      const newTotalXp = totalXpFromStorage + roundXp;
      const newTotalCorrect =
        parseInt(localStorage.getItem("totalCorrect") ?? "0", 10) + roundCorrect;
      const newTotalAnswered =
        parseInt(localStorage.getItem("totalAnswered") ?? "0", 10) + questions.length;
      const prevBestStreak = parseInt(localStorage.getItem("bestStreak") ?? "0", 10);

      localStorage.setItem("totalXp", String(newTotalXp));
      localStorage.setItem("totalCorrect", String(newTotalCorrect));
      localStorage.setItem("totalAnswered", String(newTotalAnswered));
      localStorage.setItem("bestStreak", String(Math.max(prevBestStreak, streak)));

      // Sync mit Firestore
      if (user) {
        fetch("/api/players", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: user.uid,
            xpGained: roundXp,
            wasCorrect: roundCorrect > 0,
            nickname: localStorage.getItem("nickname") || user.email?.split("@")[0] || "Azubi",
          }),
        }).catch(() => {});
      }

      localStorage.setItem("roundResults", JSON.stringify({ roundXp, roundCorrect, streak, total: questions.length }));
      localStorage.setItem("roundTotalXp", String(roundXp));
      localStorage.setItem("streak", String(streak));
      localStorage.setItem("startXp", String(totalXpFromStorage));

      router.push("/ergebnis");
    } else {
      setSelectedIndex(null);
      setIsAnswered(false);
      setHintUsed(false);
      setEliminatedOptions([]);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, roundXp, roundCorrect, streak, totalXpFromStorage, router]);

  if (!currentQuestion) {
    return (
      <div className="card mx-auto max-w-md text-center py-12">
        <p className="text-gray-300">Keine Fragen verfügbar.</p>
        <a href="/" className="btn-primary mt-4 inline-block">Zurück</a>
      </div>
    );
  }

  const rang = getRang(totalXp);
  const streakBonus = getStreakBonus(streak);

  // Schwierigkeits-Indikator für Progression
  const difficultyPhase =
    currentIndex < 3 ? "🟢 Leicht" : currentIndex < 7 ? "🟡 Mittel" : "🔴 Schwer";

  return (
    <div className="mx-auto max-w-2xl animate-slide-up">
      {/* ── Top Bar ── */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
          <span>Frage {currentIndex + 1}/{questions.length}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{difficultyPhase}</span>
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D6462A] to-[#e85d3f] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D6462A]/20 px-3 py-1 text-sm font-semibold text-[#e85d3f]">
            ⭐ {totalXp} XP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-gray-300">
            {rang.emoji} {rang.name}
          </span>
          {streak >= 3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-400">
              🔥 {streak}er Streak{streakBonus > 0 && ` · +${streakBonus} Bonus`}!
            </span>
          )}
          {streak > 0 && streak < 3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300">
              🔥 {streak}
            </span>
          )}
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-4">
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-gray-400">
            {currentQuestion.kategorie}
          </span>
          <span
            className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
              currentQuestion.schwierigkeit === "leicht"
                ? "bg-green-500/20 text-green-400"
                : currentQuestion.schwierigkeit === "mittel"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {currentQuestion.schwierigkeit} · {currentQuestion.punkte} XP
          </span>
          {currentQuestion.authorName && (
            <span className="rounded-lg bg-[#D6462A]/10 px-2 py-0.5 text-xs font-medium text-[#D6462A]/70">
              von {currentQuestion.authorName}
            </span>
          )}
          {hintUsed && (
            <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-400">
              💡 Tipp genutzt
            </span>
          )}
        </div>

        <h2 className="mb-6 text-lg sm:text-xl font-bold text-gray-100 leading-relaxed">
          {currentQuestion.frage}
        </h2>

        <div className="space-y-2.5">
          {currentQuestion.optionen.map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);

            let btnClass = "option-btn text-gray-200";
            if (isAnswered) {
              if (idx === currentQuestion.korrekterIndex) {
                btnClass = "option-btn option-btn-correct text-green-300";
              } else if (idx === selectedIndex && idx !== currentQuestion.korrekterIndex) {
                btnClass = "option-btn option-btn-wrong text-red-300";
              } else {
                btnClass = "option-btn option-btn-disabled opacity-40";
              }
            }
            if (isEliminated) {
              btnClass += " opacity-20 line-through";
            }

            return (
              <button
                key={idx}
                className={btnClass}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered || isEliminated}
              >
                <span className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-gray-400">
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  <span className="text-left">{option}</span>
                  {isAnswered && idx === currentQuestion.korrekterIndex && (
                    <span className="ml-auto text-green-400 text-lg">✅</span>
                  )}
                  {isAnswered && idx !== currentQuestion.korrekterIndex && idx === selectedIndex && (
                    <span className="ml-auto text-red-400 text-lg">❌</span>
                  )}
                  {isEliminated && (
                    <span className="ml-auto text-gray-500 text-sm">🚫</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Feedback ── */}
        {isAnswered && (
          <div
            className={`mt-4 rounded-xl p-4 animate-slide-up ${
              selectedIndex === currentQuestion.korrekterIndex
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <p className="font-semibold mb-1 text-sm text-gray-200">
              {selectedIndex === currentQuestion.korrekterIndex
                ? "✅ Richtig!"
                : `❌ Leider falsch. Richtig ist ${["A", "B", "C", "D"][currentQuestion.korrekterIndex]}.`}
            </p>
            {selectedIndex === currentQuestion.korrekterIndex && (
              <p className="text-sm font-medium text-green-400">
                +{currentQuestion.punkte} XP
                {streakBonus > 0 && streak >= 3 && (
                  <span className="text-orange-400"> · +{streakBonus} Streak-Bonus 🔥</span>
                )}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              💡 {currentQuestion.erklaerung}
            </p>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="space-y-3">
        {/* 50:50 Tipp Button */}
        {!isAnswered && !hintUsed && (
          <button
            onClick={handleHint}
            className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-500/20 hover:border-purple-500/50 active:scale-[0.98]"
          >
            💡 50:50-Tipp ({Math.max(5, Math.floor(currentQuestion.punkte / 2))} XP) —
            Entfernt zwei falsche Antworten
          </button>
        )}

        {isAnswered && (
          <button onClick={handleNext} className="btn-primary w-full text-lg animate-slide-up bg-[#D6462A] hover:bg-[#c13d24]">
            {currentIndex + 1 >= questions.length ? "🏁 Ergebnis anzeigen" : "👉 Weiter"}
          </button>
        )}

        {!isAnswered && (
          <div className="text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Abbrechen
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
