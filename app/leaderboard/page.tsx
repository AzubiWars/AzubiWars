"use client";

import { useEffect, useState } from "react";
import { getRang, RANKS } from "@/lib/ranks";

export default function LeaderboardPage() {
  const [nickname, setNickname] = useState("");
  const [totalXp, setTotalXp] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname") ?? "");
    setTotalXp(parseInt(sessionStorage.getItem("totalXp") ?? "0", 10));
    setTotalCorrect(parseInt(sessionStorage.getItem("totalCorrect") ?? "0", 10));
    setTotalAnswered(parseInt(sessionStorage.getItem("totalAnswered") ?? "0", 10));
    setBestStreak(parseInt(sessionStorage.getItem("bestStreak") ?? "0", 10));
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Lade…</p>
      </div>
    );
  }

  const rang = getRang(totalXp);
  const quote = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">🏆 Deine Stats</h1>
        <p className="mt-1 text-gray-500">Spiele mehrere Runden und verbessere dich!</p>
      </div>

      {!nickname ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">👻</div>
          <p className="text-gray-500 mb-4">Noch kein Spieler. Starte deine erste Runde!</p>
          <a href="/" className="btn-primary inline-block">🚀 Jetzt starten</a>
        </div>
      ) : (
        <>
          {/* Player Card */}
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{rang.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{nickname}</h2>
                <p className="text-sm text-brand-600 font-semibold">{rang.name}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-extrabold text-brand-600">{totalXp}</div>
                <div className="text-xs text-gray-400">Gesamt-XP</div>
              </div>
            </div>

            {/* Rank Progress */}
            {rang.xpToNext !== null && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Fortschritt zu {RANKS[rang.index + 1]?.name}</span>
                  <span>{rang.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${rang.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{totalAnswered}</div>
                <div className="text-xs text-gray-400">Beantwortet</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{totalCorrect}</div>
                <div className="text-xs text-gray-400">Richtig</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-brand-600">{quote}%</div>
                <div className="text-xs text-gray-400">Quote</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-500">{bestStreak > 0 ? `🔥${bestStreak}` : "—"}</div>
                <div className="text-xs text-gray-400">Beste Streak</div>
              </div>
            </div>
          </div>

          {/* All Ranks Overview */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">Rang-Übersicht</h3>
            <div className="space-y-1">
              {RANKS.map((rank, i) => {
                const isCurrent = rang.index === i;
                const isUnlocked = totalXp >= rank.minXp;
                return (
                  <div
                    key={rank.name}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                      isCurrent ? "bg-brand-100 font-bold" : isUnlocked ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    <span>{rank.emoji}</span>
                    <span className="flex-1">{rank.name}</span>
                    <span className="text-xs text-gray-400">
                      {isUnlocked ? "✅" : `${rank.minXp} XP`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        <a href="/play" className="btn-primary">🔄 Neue Runde</a>
        <a href="/" className="btn-secondary">🏠 Startseite</a>
      </div>

      <p className="text-center text-xs text-gray-400">
        💡 Die globale Rangliste ist verfügbar, sobald Firestore und Umgebungsvariablen konfiguriert sind.
      </p>
    </div>
  );
}
