"use client";

import { useEffect, useState } from "react";
import { getRang, RANKS } from "@/lib/ranks";

interface LeaderboardPlayer {
  id: string;
  nickname: string;
  xpGesamt: number;
  beantwortet: number;
  richtig: number;
  besteStreak: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFirestore, setUsingFirestore] = useState(false);
  const [myPlayerId] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("playerId") ?? "" : ""
  );
  const [myNickname] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("nickname") ?? "" : ""
  );
  const [myXp] = useState(() =>
    typeof window !== "undefined" ? parseInt(sessionStorage.getItem("totalXp") ?? "0", 10) : 0
  );

  useEffect(() => {
    fetch("/api/players")
      .then((res) => {
        if (!res.ok) throw new Error("API nicht verfügbar");
        return res.json();
      })
      .then((data) => {
        if (data.players && data.players.length > 0) {
          setPlayers(data.players);
          setUsingFirestore(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // Fallback: keine Firestore-Daten → lokale Stats werden gezeigt
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Lade Leaderboard…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">🏆 Leaderboard</h1>
        <p className="mt-1 text-gray-500">
          {usingFirestore ? "Die besten Azubis auf einen Blick" : "Deine persönlichen Stats"}
        </p>
      </div>

      {/* Firestore Leaderboard */}
      {usingFirestore && players.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span className="w-10 text-center">#</span>
            <span className="flex-1">Spieler</span>
            <span className="w-20 text-center">Rang</span>
            <span className="w-20 text-right">XP</span>
            <span className="w-16 text-right">Quote</span>
          </div>
          {players.map((player, index) => {
            const rang = getRang(player.xpGesamt);
            const isMe = player.id === myPlayerId || player.nickname === myNickname;
            const quote =
              player.beantwortet > 0
                ? Math.round((player.richtig / player.beantwortet) * 100)
                : 0;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isMe ? "bg-brand-50 ring-2 ring-brand-300" : "bg-white hover:bg-gray-50"
                }`}
              >
                <span className="w-10 text-center font-bold text-sm">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <span className={`flex-1 font-semibold ${isMe ? "text-brand-700" : "text-gray-800"}`}>
                  {player.nickname}
                  {isMe && <span className="ml-2 text-xs text-brand-500">(Du)</span>}
                </span>
                <span className="w-20 text-center text-sm">{rang.emoji}</span>
                <span className="w-20 text-right font-bold text-brand-600 text-sm">
                  {player.xpGesamt.toLocaleString()}
                </span>
                <span
                  className={`w-16 text-right text-xs font-medium ${
                    quote >= 70 ? "text-green-600" : quote >= 40 ? "text-yellow-600" : "text-gray-400"
                  }`}
                >
                  {quote}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Eigene Stats (immer sichtbar) */}
      {myNickname && (
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{getRang(myXp).emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{myNickname}</h2>
              <p className="text-sm text-brand-600 font-semibold">{getRang(myXp).name}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-extrabold text-brand-600">{myXp}</div>
              <div className="text-xs text-gray-400">Gesamt-XP</div>
            </div>
          </div>

          {/* Rang-Leiste */}
          <div className="space-y-1">
            {RANKS.map((rank, i) => {
              const isCurrent = getRang(myXp).index === i;
              const isUnlocked = myXp >= rank.minXp;
              return (
                <div
                  key={rank.name}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                    isCurrent ? "bg-brand-100 font-bold" : isUnlocked ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  <span>{rank.emoji}</span>
                  <span className="flex-1">{rank.name}</span>
                  <span className="text-xs">{isUnlocked ? "✅" : `${rank.minXp} XP`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!myNickname && !usingFirestore && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">👻</div>
          <p className="text-gray-500">Noch kein Spieler. Starte deine erste Runde!</p>
          <a href="/" className="btn-primary mt-4 inline-block">🚀 Jetzt starten</a>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        <a href="/play" className="btn-primary">🔄 Neue Runde</a>
        <a href="/" className="btn-secondary">🏠 Startseite</a>
      </div>
    </div>
  );
}
