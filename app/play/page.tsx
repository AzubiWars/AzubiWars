"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SAMPLE_QUESTIONS } from "@/lib/sample-questions";
import { getRang } from "@/lib/ranks";

const ROUND_SIZE = 10;

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, count);
}

function getStorageNumber(key: string, fallback = 0): number {
  if (typeof window === "undefined") return fallback;
  return parseInt(sessionStorage.getItem(key) ?? String(fallback), 10);
}

export default function PlayPage() {
  const router = useRouter();

  // Shuffle questions once on mount
  const questions = useMemo(() => shuffleAndPick(SAMPLE_QUESTIONS, ROUND_SIZE), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roundXp, setRoundXp] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXpFromStorage, setTotalXpFromStorage] = useState(0);

  useEffect(() => {
    setTotalXpFromStorage(getStorageNumber("totalXp", 0));
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const totalXp = totalXpFromStorage + roundXp;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (isAnswered || !currentQuestion) return;

      setSelectedIndex(optionIndex);
      setIsAnswered(true);

      const wasCorrect = optionIndex === currentQuestion.korrekterIndex;
      const xpGained = wasCorrect ? currentQuestion.punkte : 0;
      const newStreak = wasCorrect ? streak + 1 : 0;

      setStreak(newStreak);
      setRoundXp((prev) => prev + xpGained);
      if (wasCorrect) setRoundCorrect((prev) => prev + 1);
    },
    [isAnswered, currentQuestion, streak]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Runde beendet → Ergebnisse speichern
      const newTotalXp = totalXpFromStorage + roundXp;
      const newTotalCorrect =
        parseInt(sessionStorage.getItem("totalCorrect") ?? "0", 10) + roundCorrect;
      const newTotalAnswered =
        parseInt(sessionStorage.getItem("totalAnswered") ?? "0", 10) + questions.length;
      const prevBestStreak = parseInt(sessionStorage.getItem("bestStreak") ?? "0", 10);

      sessionStorage.setItem("totalXp", String(newTotalXp));
      sessionStorage.setItem("totalCorrect", String(newTotalCorrect));
      sessionStorage.setItem("totalAnswered", String(newTotalAnswered));
      sessionStorage.setItem("bestStreak", String(Math.max(prevBestStreak, streak)));

      sessionStorage.setItem("roundResults", JSON.stringify({ roundXp, roundCorrect, streak, total: questions.length }));
      sessionStorage.setItem("roundTotalXp", String(roundXp));
      sessionStorage.setItem("streak", String(streak));
      sessionStorage.setItem("startXp", String(totalXpFromStorage));

      router.push("/ergebnis");
    } else {
      setSelectedIndex(null);
      setIsAnswered(false);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, roundXp, roundCorrect, streak, totalXpFromStorage, router]);

  if (!currentQuestion) {
    return (
      <div className="card mx-auto max-w-md text-center py-12">
        <p className="text-gray-500">Keine Fragen verfügbar.</p>
        <a href="/" className="btn-primary mt-4 inline-block">Zurück</a>
      </div>
    );
  }

  const rang = getRang(totalXp);

  return (
    <div className="mx-auto max-w-2xl animate-slide-up">
      {/* Top Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <span>Frage {currentIndex + 1}/{questions.length}</span>
          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            ⭐ {totalXp} XP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
            {rang.emoji} {rang.name}
          </span>
          {streak >= 3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
              🔥 {streak}er Streak!
            </span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {currentQuestion.kategorie}
          </span>
          <span
            className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
              currentQuestion.schwierigkeit === "leicht"
                ? "bg-green-100 text-green-700"
                : currentQuestion.schwierigkeit === "mittel"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {currentQuestion.schwierigkeit} · {currentQuestion.punkte} XP
          </span>
        </div>

        <h2 className="mb-6 text-lg sm:text-xl font-bold text-gray-800 leading-relaxed">
          {currentQuestion.frage}
        </h2>

        <div className="space-y-2.5">
          {currentQuestion.optionen.map((option, idx) => {
            let btnClass = "option-btn";
            if (isAnswered) {
              if (idx === currentQuestion.korrekterIndex) {
                btnClass += " option-btn-correct";
              } else if (idx === selectedIndex && idx !== currentQuestion.korrekterIndex) {
                btnClass += " option-btn-wrong";
              }
              btnClass += " option-btn-disabled";
            }

            return (
              <button
                key={idx}
                className={btnClass}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
              >
                <span className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500">
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  <span className="text-left text-gray-700">{option}</span>
                  {isAnswered && idx === currentQuestion.korrekterIndex && (
                    <span className="ml-auto text-green-500 text-lg">✅</span>
                  )}
                  {isAnswered && idx !== currentQuestion.korrekterIndex && idx === selectedIndex && (
                    <span className="ml-auto text-red-500 text-lg">❌</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            className={`mt-4 rounded-xl p-4 animate-slide-up ${
              selectedIndex === currentQuestion.korrekterIndex
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p className="font-semibold mb-1 text-sm">
              {selectedIndex === currentQuestion.korrekterIndex
                ? "✅ Richtig!"
                : `❌ Leider falsch. Richtig ist ${["A", "B", "C", "D"][currentQuestion.korrekterIndex]}.`}
            </p>
            {selectedIndex === currentQuestion.korrekterIndex && (
              <p className="text-sm font-medium text-green-700">+{currentQuestion.punkte} XP</p>
            )}
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              💡 {currentQuestion.erklaerung}
            </p>
          </div>
        )}
      </div>

      {isAnswered && (
        <button onClick={handleNext} className="btn-primary w-full text-lg animate-slide-up">
          {currentIndex + 1 >= questions.length ? "🏁 Ergebnis anzeigen" : "👉 Weiter"}
        </button>
      )}
    </div>
  );
}
