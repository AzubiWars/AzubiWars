"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { QuestionRecord } from "@/lib/anthropic";
import { getRang } from "@/lib/ranks";

interface RoundResult {
  questionId: string;
  wasCorrect: boolean;
  xpGained: number;
}

const ROUND_SIZE = 10;

export default function PlayPage() {
  const router = useRouter();

  // Spiel-Daten
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerId, setPlayerId] = useState("");

  // Fragen laden
  useEffect(() => {
    const pid = sessionStorage.getItem("playerId");
    if (!pid) {
      router.replace("/");
      return;
    }
    setPlayerId(pid);

    fetch("/api/questions?limit=" + ROUND_SIZE)
      .then((res) => {
        if (!res.ok) throw new Error("Fragen konnten nicht geladen werden.");
        return res.json();
      })
      .then((data) => {
        if (!data.questions || data.questions.length === 0) {
          throw new Error("Keine Fragen verfügbar. Bitte führe zuerst den Seed aus.");
        }
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  // Spieler-XP vom Server laden
  useEffect(() => {
    if (!playerId) return;
    fetch("/api/players?id=" + playerId)
      .then((res) => res.json())
      .then((data) => {
        if (data.xpGesamt !== undefined) {
          // Start-XP vor der Runde speichern
          sessionStorage.setItem("startXp", String(data.xpGesamt));
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, [playerId]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  const handleAnswer = useCallback(
    async (optionIndex: number) => {
      if (isAnswered || !currentQuestion) return;

      setSelectedIndex(optionIndex);
      setIsAnswered(true);

      const wasCorrect = optionIndex === currentQuestion.korrekterIndex;
      const xpGained = wasCorrect ? currentQuestion.punkte : 0;
      const newStreak = wasCorrect ? streak + 1 : 0;

      setStreak(newStreak);
      setTotalXp((prev) => prev + xpGained);
      setResults((prev) => [...prev, { questionId: currentQuestion.id, wasCorrect, xpGained }]);

      // XP auf dem Server updaten
      if (playerId) {
        fetch("/api/players", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId,
            xpGained,
            wasCorrect,
          }),
        }).catch(() => {
          /* silently fail — lokaler State ist führend */
        });
      }
    },
    [isAnswered, currentQuestion, streak, playerId]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Runde beendet → Ergebnisse speichern
      sessionStorage.setItem("roundResults", JSON.stringify(results));
      sessionStorage.setItem("roundTotalXp", String(totalXp));
      sessionStorage.setItem("streak", String(streak));
      sessionStorage.setItem("finalTotalXp", String(totalXp));
      router.push("/ergebnis");
    } else {
      setSelectedIndex(null);
      setIsAnswered(false);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, results, totalXp, streak, router]);

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl animate-bounce">⚔️</div>
        <p className="mt-4 text-lg font-medium text-gray-500">Fragen werden geladen…</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="card mx-auto max-w-md text-center py-12">
        <div className="text-5xl mb-4">😢</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <a href="/" className="btn-primary">
          Zurück zur Startseite
        </a>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const rang = getRang(totalXp);

  return (
    <div className="mx-auto max-w-2xl animate-slide-up">
      {/* Top Bar: Fortschritt + Stats */}
      <div className="mb-6 space-y-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <span>
            Frage {currentIndex + 1}/{questions.length}
          </span>
          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            ⭐ {totalXp} XP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
            {rang.emoji} {rang.name}
          </span>
          {streak >= 3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600 animate-pulse-fast">
              🔥 {streak}er Streak!
            </span>
          )}
          {streak > 0 && streak < 3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-500">
              🔥 {streak}
            </span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-4">
        {/* Kategorie + Schwierigkeit */}
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

        {/* Frage */}
        <h2 className="mb-6 text-xl font-bold text-gray-800 leading-relaxed">
          {currentQuestion.frage}
        </h2>

        {/* Optionen */}
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
            } else if (idx === selectedIndex) {
              btnClass += " option-btn-selected";
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
                  <span className="text-gray-700">{option}</span>
                  {isAnswered && idx === currentQuestion.korrekterIndex && (
                    <span className="ml-auto text-green-500 text-lg">✅</span>
                  )}
                  {isAnswered &&
                    idx === selectedIndex &&
                    idx !== currentQuestion.korrekterIndex && (
                      <span className="ml-auto text-red-500 text-lg">❌</span>
                    )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback nach Antwort */}
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
                : `❌ Falsch! Die richtige Antwort ist ${["A", "B", "C", "D"][currentQuestion.korrekterIndex]}.`}
            </p>
            {selectedIndex === currentQuestion.korrekterIndex && (
              <p className="text-sm font-medium text-green-700">
                +{currentQuestion.punkte} XP
                {streak >= 3 && ` · 🔥 ${streak}er Streak!`}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              💡 {currentQuestion.erklaerung}
            </p>
          </div>
        )}
      </div>

      {/* Weiter Button */}
      {isAnswered && (
        <button onClick={handleNext} className="btn-primary w-full text-lg animate-slide-up">
          {currentIndex + 1 >= questions.length ? "🏁 Ergebnis anzeigen" : "👉 Weiter"}
        </button>
      )}

      {/* Abbruch */}
      {!isAnswered && (
        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Abbrechen und zurück
          </a>
        </div>
      )}
    </div>
  );
}
