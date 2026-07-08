"use client";

import { useEffect, useState } from "react";
import { getRang } from "@/lib/ranks";
import { useAuth } from "@/lib/auth-context";

interface LeaderboardPlayer {
  id: string;
  nickname: string;
  xpGesamt: number;
  beantwortet: number;
  richtig: number;
  besteStreak: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Erst Health-Check
    fetch("/api/health")
      .then((r) => r.json())
      .then((health) => {
        if (health.checks?.Firestore?.startsWith("❌")) {
          setError(`Firestore nicht erreichbar: ${health.checks.Firestore}`);
          setLoading(false);
          return;
        }
        // Firestore okay → Leaderboard laden
        return fetch("/api/players")
          .then((res) => res.json())
          .then((data) => {
            if (data.players) setPlayers(data.players);
            setLoading(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Lade Rangliste…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-200">🏆 Globale Rangliste</h1>
        <p className="mt-1 text-sm text-gray-500">
          {players.length > 0
            ? `${players.length} Azubis im Ranking`
            : "Noch keine Spieler"}
        </p>
      </div>

      {error && (
        <div className="card border-red-500/20 text-center space-y-3">
          <div className="text-4xl">🔌</div>
          <p className="text-red-400 text-sm font-semibold">Firestore-Datenbank nicht erreichbar</p>
          <p className="text-gray-500 text-xs">{error}</p>
          <div className="text-left text-xs text-gray-400 bg-white/[0.03] rounded-lg p-3 space-y-1">
            <p className="font-medium text-gray-300">So behebst du das:</p>
            <p>1. Firebase Console → Firestore Database</p>
            <p>2. „Datenbank erstellen" (Native Mode)</p>
            <p>3. Standort: eur3, Testmodus</p>
            <p>4. Deploy erneut auslösen</p>
          </div>
        </div>
      )}

      {players.length === 0 && !error && (
        <div className="card text-center py-12 border-dashed">
          <div className="text-4xl mb-3 opacity-50">👻</div>
          <p className="text-gray-400 text-sm">Noch keine Spieler auf der Rangliste.</p>
          <p className="text-gray-500 text-xs mt-1">Spiele eine Runde, um dich einzutragen!</p>
          <a href="/play" className="btn-primary mt-4 inline-block text-sm">⚡ Battle starten</a>
        </div>
      )}

      {players.length > 0 && (
        <div className="space-y-0.5">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            <span className="w-8 text-center">#</span>
            <span className="flex-1">Spieler</span>
            <span className="w-14 text-center">Rang</span>
            <span className="w-16 text-right">XP</span>
            <span className="w-12 text-right">Quote</span>
          </div>

          {players.map((player, index) => {
            const rang = getRang(player.xpGesamt);
            const isMe = user && (player.id === user.uid);
            const top3 = index < 3;
            const quote =
              player.beantwortet > 0
                ? Math.round((player.richtig / player.beantwortet) * 100)
                : 0;

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

      <div className="flex gap-2 justify-center">
        <a href="/" className="btn-primary text-sm">⚡ Battlen</a>
        <a href="/challenges" className="btn-secondary text-sm">📋 Community</a>
      </div>

    </div>
  );
}
