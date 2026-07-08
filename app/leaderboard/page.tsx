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
    typeof window !== "undefined" ? localStorage.getItem("playerId") ?? "" : ""
  );
  const [myNickname] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("nickname") ?? "" : ""
  );
  const [myXp] = useState(() =>
    typeof window !== "undefined" ? parseInt(localStorage.getItem("totalXp") ?? "0", 10) : 0
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
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Lade Leaderboard…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-300">🏆 Leaderboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          {usingFirestore ? "Die besten Azubis" : "Deine Stats"}
        </p>
      </div>

      {/* Firestore Leaderboard */}
      {usingFirestore && players.length > 0 && (
        <div className="space-y-0.5">
          {/* Table Header */}
          <div className="flex items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            <span className="w-8 text-center">#</span>
            <span className="flex-1">Spieler</span>
            <span className="w-14 text-center">Rang</span>
            <span className="w-16 text-right">XP</span>
            <span className="w-12 text-right">Quote</span>
          </div>

          {players.map((player, index) => {
            const rang = getRang(player.xpGesamt);
            const isMe = player.id === myPlayerId || player.nickname === myNickname;
            const quote =
              player.beantwortet > 0
                ? Math.round((player.richtig / player.beantwortet) * 100)
                : 0;
            const top3 = index < 3;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors ${
                  isMe
                    ? "bg-[#D6462A]/10 ring-1 ring-[#D6462A]/20"
                    : top3
                      ? "bg-white/[0.03]"
                      : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Rank */}
                <span className={`w-8 text-center text-sm font-semibold ${
                  top3 ? "text-gray-200" : "text-gray-500"
                }`}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                </span>

                {/* Name */}
                <span className={`flex-1 text-sm font-medium truncate ${
                  isMe ? "text-[#D6462A]" : "text-gray-300"
                }`}>
                  {player.nickname}
                  {isMe && <span className="ml-1.5 text-xs text-[#D6462A]/70">(Du)</span>}
                </span>

                {/* Rang Emoji */}
                <span className="w-14 text-center text-sm" title={rang.name}>
                  {rang.emoji}
                </span>

                {/* XP */}
                <span className={`w-16 text-right text-sm font-semibold ${
                  isMe ? "text-[#D6462A]" : "text-gray-400"
                }`}>
                  {player.xpGesamt.toLocaleString()}
                </span>

                {/* Quote */}
                <span
                  className={`w-12 text-right text-xs font-medium ${
                    quote >= 70 ? "text-green-500" : quote >= 40 ? "text-yellow-500" : "text-gray-500"
                  }`}
                >
                  {quote}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Keine Daten */}
      {!myNickname && !usingFirestore && (
        <div className="card text-center py-12 border-dashed">
          <div className="text-4xl mb-3 opacity-50">👻</div>
          <p className="text-gray-500 text-sm">Noch kein Spieler.</p>
          <a href="/" className="btn-primary mt-4 inline-block text-sm">🚀 Jetzt starten</a>
        </div>
      )}

      {/* Persönliche Stats Card */}
      {myNickname && (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{getRang(myXp).emoji}</span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-300 truncate">{myNickname}</h2>
              <p className="text-xs text-[#D6462A]/80">{getRang(myXp).name}</p>
            </div>
            <div className="ml-auto text-right shrink-0">
              <div className="text-xl font-bold text-gray-400">{myXp}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Gesamt-XP</div>
            </div>
          </div>

          {/* Rang Progress */}
          <div className="space-y-0.5">
            {RANKS.map((rank, i) => {
              const currentIdx = getRang(myXp).index;
              const isCurrent = currentIdx === i;
              const isUnlocked = myXp >= rank.minXp;
              return (
                <div
                  key={rank.name}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                    isCurrent
                      ? "bg-[#D6462A]/10 text-gray-200 font-medium"
                      : isUnlocked
                        ? "text-gray-500"
                        : "text-gray-600"
                  }`}
                >
                  <span className="w-5 text-center">{rank.emoji}</span>
                  <span className="flex-1">{rank.name}</span>
                  <span className="tabular-nums">
                    {isUnlocked ? "✅" : `${rank.minXp} XP`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-center">
        <a href="/play" className="btn-primary text-sm px-5 py-2.5">🔄 Neue Runde</a>
        <a href="/" className="btn-secondary text-sm px-5 py-2.5">🏠 Startseite</a>
      </div>

      {!usingFirestore && myNickname && (
        <p className="text-center text-[11px] text-gray-600">
          Sobald Firestore konfiguriert ist, erscheint hier die globale Rangliste.
        </p>
      )}
    </div>
  );
}
