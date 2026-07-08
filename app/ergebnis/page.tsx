"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRang, getNextRank } from "@/lib/ranks";

export default function ErgebnisPage() {
  const router = useRouter();
  const [roundXp, setRoundXp] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundTotal, setRoundTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [startXp, setStartXp] = useState(0);
  const [nickname, setNickname] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const nick = localStorage.getItem("nickname");
    const rxp = localStorage.getItem("roundTotalXp");
    const str = localStorage.getItem("streak");
    const sxp = localStorage.getItem("startXp");
    const resultsStr = localStorage.getItem("roundResults");

    if (!nick) {
      router.replace("/");
      return;
    }

    setNickname(nick);
    setRoundXp(Number(rxp) || 0);
    setStreak(Number(str) || 0);
    setStartXp(Number(sxp) || 0);

    if (resultsStr) {
      try {
        const r = JSON.parse(resultsStr);
        setRoundCorrect(r.roundCorrect || 0);
        setRoundTotal(r.total || 10);
      } catch { /* ignore */ }
    }

    setLoaded(true);
  }, [router]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Lade Ergebnis…</p>
      </div>
    );
  }

  const totalXp = startXp + roundXp;
  const percentage = roundTotal > 0 ? Math.round((roundCorrect / roundTotal) * 100) : 0;

  const oldRang = getRang(startXp);
  const newRang = getRang(totalXp);
  const nextRank = getNextRank(totalXp);
  const didRankUp = oldRang.name !== newRang.name;

  return (
    <div className="mx-auto max-w-lg animate-slide-up space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-100">Runde beendet!</h1>
        <p className="mt-1 text-gray-400">
          {nickname} · {newRang.emoji} {newRang.name}
        </p>
      </div>

      <div className="card text-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-extrabold text-[#D6462A]">{roundCorrect}/{roundTotal}</div>
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
          <p className="mt-4 text-sm font-semibold text-[#D6462A]">🌟 Super! Du bist top vorbereitet!</p>
        )}
        {percentage < 50 && (
          <p className="mt-4 text-sm font-semibold text-gray-400">💡 Weiter üben! Jeder Fehler macht dich stärker.</p>
        )}
      </div>

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
              <div className="mt-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D6462A] transition-all duration-700"
                  style={{ width: `${newRang.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {didRankUp && (
          <div className="mt-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-3 text-center animate-bounce-in">
            <p className="font-bold text-yellow-300">
              🎉 Aufgestiegen! {oldRang.emoji} → {newRang.emoji} {newRang.name}!
            </p>
          </div>
        )}

        {nextRank && !didRankUp && (
          <p className="mt-3 text-xs text-gray-400 text-center">
            Noch {nextRank.xpNeeded} XP bis {nextRank.emoji} {nextRank.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={() => router.push("/play")} className="btn-primary text-lg">
          🔄 Noch eine Runde spielen
        </button>
        <button onClick={() => router.push("/leaderboard")} className="btn-secondary text-lg">
          🏆 Persönliche Stats
        </button>
        <button onClick={() => router.push("/")} className="btn-secondary text-lg">
          🏠 Startseite
        </button>
      </div>
    </div>
  );
}
