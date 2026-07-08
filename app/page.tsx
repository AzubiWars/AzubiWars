"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      setError("Bitte gib einen Nickname mit mindestens 2 Zeichen ein.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Nickname darf maximal 20 Zeichen lang sein.");
      return;
    }

    setIsStarting(true);
    setError("");

    try {
      // Spieler registrieren / abrufen
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed }),
      });

      if (!res.ok) {
        throw new Error("Fehler beim Erstellen des Spielers.");
      }

      const player = await res.json();

      // Spieler-ID in Session Storage speichern
      sessionStorage.setItem("playerId", player.id);
      sessionStorage.setItem("nickname", player.nickname);

      router.push("/play");
    } catch {
      setError("Verbindungsfehler. Bitte versuche es noch einmal.");
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Hero */}
      <div className="text-center animate-slide-up">
        <div className="mb-6 text-7xl">⚔️</div>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-brand-900 bg-clip-text text-transparent">
            Azubi-Wars
          </span>
        </h1>
        <p className="mb-2 text-xl font-semibold text-gray-700">
          Gamified Lernen für die Ausbildung 🎮📚
        </p>
        <p className="mx-auto mb-8 max-w-md text-balance text-gray-500">
          Meistere IHK-Prüfungsfragen, sammle XP, steige im Rang auf und
          battle dich an die Spitze des Leaderboards. Vom{" "}
          <strong>Neuling</strong> bis zum <strong>Ausbilder</strong>.
        </p>
      </div>

      {/* Features */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-2xl">
        {[
          { icon: "🎯", title: "6 Kategorien", desc: "Alle IHK-Lernfelder" },
          { icon: "⚡", title: "KI-Content", desc: "Unbegrenzt neue Fragen" },
          { icon: "🏆", title: "Rang-System", desc: "8 Ausbildungs-Tiers" },
        ].map((f) => (
          <div key={f.title} className="card text-center py-4">
            <div className="text-2xl mb-1">{f.icon}</div>
            <div className="font-semibold text-sm text-gray-800">{f.title}</div>
            <div className="text-xs text-gray-400">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Nickname Input */}
      <div className="card w-full max-w-md animate-bounce-in">
        <label htmlFor="nickname" className="mb-2 block font-semibold text-gray-700">
          Dein Nickname
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          placeholder="z. B. AzubiPro99"
          maxLength={20}
          className="mb-3 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-medium outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          autoFocus
        />
        {error && (
          <p className="mb-3 text-sm font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="btn-primary w-full text-lg"
        >
          {isStarting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Starte…
            </span>
          ) : (
            "🚀 Los geht's!"
          )}
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Industriekaufmann/-frau · IHK-Prüfungsniveau
        </p>
      </div>
    </div>
  );
}
