"use client";

import { useEffect, useState } from "react";
import { getRang } from "@/lib/ranks";
import type { Player } from "@/lib/players";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myPlayerId, setMyPlayerId] = useState("");

  useEffect(() => {
    setMyPlayerId(sessionStorage.getItem("playerId") ?? "");

    fetch("/api/players")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden des Leaderboards.");
        return res.json();
      })
      .then((data) => {
        setPlayers(data.players || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Lade Leaderboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mx-auto max-w-md text-center py-12">
        <div className="text-5xl mb-4">😢</div>
        <p className="text-gray-500 mb-6">{error}</p>
        <a href="/" className="btn-primary">
          Zurück zur Startseite
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">🏆 Leaderboard</h1>
        <p className="mt-1 text-gray-500">Die besten Azubis auf einen Blick</p>
      </div>

      {players.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">👻</div>
          <p className="text-gray-500">Noch keine Spieler. Sei der Erste!</p>
          <a href="/" className="btn-primary mt-4 inline-block">
            🚀 Jetzt starten
          </a>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Table Header */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span className="w-10 text-center">#</span>
            <span className="flex-1">Spieler</span>
            <span className="w-20 text-center">Rang</span>
            <span className="w-20 text-right">XP</span>
            <span className="w-16 text-right">Quote</span>
          </div>

          {players.map((player, index) => {
            const rang = getRang(player.xpGesamt);
            const isMe = player.id === myPlayerId;
            const quote =
              player.beantwortet > 0
                ? Math.round((player.richtig / player.beantwortet) * 100)
                : 0;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isMe
                    ? "bg-brand-50 ring-2 ring-brand-300"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* Platz */}
                <span className="w-10 text-center font-bold text-sm">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>

                {/* Name */}
                <span className={`flex-1 font-semibold ${isMe ? "text-brand-700" : "text-gray-800"}`}>
                  {player.nickname}
                  {isMe && <span className="ml-2 text-xs text-brand-500">(Du)</span>}
                </span>

                {/* Rang Badge */}
                <span className="w-20 text-center text-sm" title={rang.name}>
                  {rang.emoji}
                </span>

                {/* XP */}
                <span className="w-20 text-right font-bold text-brand-600 text-sm">
                  {player.xpGesamt.toLocaleString()}
                </span>

                {/* Quote */}
                <span
                  className={`w-16 text-right text-xs font-medium ${
                    quote >= 70
                      ? "text-green-600"
                      : quote >= 40
                        ? "text-yellow-600"
                        : "text-gray-400"
                  }`}
                >
                  {quote}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <a href="/play" className="btn-primary">
          🔄 Neue Runde
        </a>
        <a href="/" className="btn-secondary">
          🏠 Startseite
        </a>
      </div>
    </div>
  );
}
