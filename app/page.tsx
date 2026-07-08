"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      setError("Bitte gib einen Nickname mit mindestens 2 Zeichen ein.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Nickname darf maximal 20 Zeichen lang sein.");
      return;
    }

    sessionStorage.setItem("playerId", crypto.randomUUID());
    sessionStorage.setItem("nickname", trimmed);
    sessionStorage.setItem("totalXp", "0");
    sessionStorage.setItem("totalCorrect", "0");
    sessionStorage.setItem("totalAnswered", "0");
    sessionStorage.setItem("bestStreak", "0");

    router.push("/play");
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-2">
      {/* Hero */}
      <div className="text-center animate-slide-up">
        <div className="mb-4 text-6xl sm:text-7xl">⚔️</div>
        <h1 className="mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-brand-900 bg-clip-text text-transparent">
            Azubi-Wars
          </span>
        </h1>
        <p className="mb-2 text-lg sm:text-xl font-semibold text-gray-700">
          Gamified Lernen für die Ausbildung 🎮📚
        </p>
        <p className="mx-auto mb-6 max-w-md text-balance text-sm sm:text-base text-gray-500">
          Meistere IHK-Prüfungsfragen, sammle XP, steige im Rang auf. Vom{" "}
          <strong>Neuling</strong> bis zum <strong>Ausbilder</strong>.
        </p>
      </div>

      {/* Features */}
      <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg">
        {[
          { icon: "🎯", title: "6 Kategorien", desc: "IHK-Lernfelder" },
          { icon: "📚", title: "15+ Fragen", desc: "3 Schwierigkeiten" },
          { icon: "🏆", title: "8 Ränge", desc: "Vom Neuling zum Ausbilder" },
        ].map((f) => (
          <div key={f.title} className="card text-center py-3 px-2">
            <div className="text-xl sm:text-2xl mb-1">{f.icon}</div>
            <div className="font-semibold text-xs sm:text-sm text-gray-800">{f.title}</div>
            <div className="text-xs text-gray-400 hidden sm:block">{f.desc}</div>
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
        <button onClick={handleStart} className="btn-primary w-full text-lg">
          🚀 Los geht&apos;s!
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Industriekaufmann/-frau · IHK-Prüfungsniveau
        </p>
      </div>
    </div>
  );
}
