"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRang, getNextRank } from "@/lib/ranks";

interface RoundResult {
  questionId: string;
  wasCorrect: boolean;
  xpGained: number;
}

export default function ErgebnisPage() {
  const router = useRouter();
  const [results, setResults] = useState<RoundResult[]>([]);
  const [roundXp, setRoundXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startXp, setStartXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("roundResults");
    const rxp = sessionStorage.getItem("roundTotalXp");
    const str = sessionStorage.getItem("streak");
    const sxp = sessionStorage.getItem("startXp");
    const nick = sessionStorage.getItem("nickname");

    if (!stored || !nick) {
      router.replace("/");
      return;
    }

    const parsed: RoundResult[] = JSON.parse(stored);
    const roundXpVal = Number(rxp) || 0;
    const startXpVal = Number(sxp) || 0;

    setResults(parsed);
    setRoundXp(roundXpVal);
    setStreak(Number(str) || 0);
    setStartXp(startXpVal);
    setTotalXp(startXpVal + roundXpVal);
    setNickname(nick);
  }, [router]);

  const correct = results.filter((r) => r.wasCorrect).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const oldRang = getRang(startXp);
  const newRang = getRang(totalXp);
  const nextRank = getNextRank(totalXp);
  const didRankUp = oldRang.name !== newRang.name;

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Lade Ergebnis…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg animate-slide-up space-y-6">
      {/* Titel */}
      <div className="text-center">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">Runde beendet!</h1>
        <p className="mt-1 text-gray-500">
          {nickname} · {newRang.emoji} {newRang.name}
        </p>
      </div>

      {/* Score Card */}
      <div className="card text-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-extrabold text-brand-600">{correct}/{total}</div>
            <div className="text-xs text-gray-400 mt-1">Richtig</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-green-600">+{roundXp}</div>
            <div className="text-xs text-gray-400 mt-1">XP diese Runde</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-orange-500">{streak > 0 ? `🔥${streak}` : "—"}</div>
            <div className="text-xs text-gray-400 mt-1">Beste Streak</div>
          </div>
        </div>

        {percentage >= 80 && (
          <p className="mt-4 text-sm font-semibold text-brand-600">
            🌟 Super! Du bist top vorbereitet!
          </p>
        )}
        {percentage < 50 && (
          <p className="mt-4 text-sm font-semibold text-gray-500">
            💡 Weiter üben! Jeder Fehler macht dich stärker.
          </p>
        )}
      </div>

      {/* Rang Fortschritt */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{newRang.emoji}</span>
          <div className="flex-1">
            <div className="flex justify-between text-sm font-semibold">
              <span>{newRang.name}</span>
              <span className="text-gray-400">
                {newRang.xpToNext !== null
                  ? `${newRang.xpInRank} / ${newRang.xpToNext} XP`
                  : "Max. Rang!"}
              </span>
            </div>
            {newRang.xpToNext !== null && (
              <div className="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-out"
                  style={{ width: `${newRang.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {didRankUp && (
          <div className="mt-3 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-center animate-bounce-in">
            <p className="font-bold text-yellow-700">
              🎉 Aufgestiegen! {oldRang.emoji} → {newRang.emoji} {newRang.name}!
            </p>
          </div>
        )}

        {nextRank && !didRankUp && (
          <p className="mt-3 text-xs text-gray-400 text-center">
            Noch {nextRank.xpNeeded} XP bis {nextRank.emoji} {nextRank.name}
          </p>
        )}

        {!nextRank && (
          <p className="mt-3 text-xs text-gray-400 text-center">
            Du hast den höchsten Rang erreicht! 🏆
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button onClick={() => router.push("/play")} className="btn-primary text-lg">
          🔄 Noch eine Runde spielen
        </button>
        <button onClick={() => router.push("/leaderboard")} className="btn-secondary text-lg">
          🏆 Leaderboard
        </button>
        <button onClick={() => router.push("/")} className="btn-secondary text-lg">
          🏠 Zurück zur Startseite
        </button>
      </div>
    </div>
  );
}
