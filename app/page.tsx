"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setError("");

    const playerId = crypto.randomUUID();

    // Immer lokal speichern (Fallback)
    sessionStorage.setItem("playerId", playerId);
    sessionStorage.setItem("nickname", trimmed);
    sessionStorage.setItem("totalXp", "0");
    sessionStorage.setItem("totalCorrect", "0");
    sessionStorage.setItem("totalAnswered", "0");
    sessionStorage.setItem("bestStreak", "0");

    // Versuche, Spieler via API in Firestore anzulegen (für Leaderboard)
    try {
      await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed, playerId }),
      });
    } catch {
      // API nicht verfügbar → nur lokaler Spielstand (funktioniert trotzdem)
    }

    router.push("/play");
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-2">
      {/* Hero */}
      <div className="text-center animate-slide-up">
        <div className="mb-4 flex justify-center">
          <svg viewBox="0 0 200 200" className="h-24 w-24 sm:h-28 sm:w-28" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="#D6462A"/>
            <polygon points="100,22 168,61 168,139 100,178 32,139 32,61" fill="#17181C"/>
            <g transform="translate(100,100) rotate(-45)"><polygon points="0,-66 11,-46 11,58 -11,58 -11,-46" fill="#D6462A"/></g>
            <g transform="translate(100,100) rotate(45)"><polygon points="0,-66 5,-46 5,40 -5,40 -5,-46" fill="#D6462A"/><rect x="-18" y="40" width="36" height="8" fill="#D6462A"/></g>
            <polygon points="100,85 115,100 100,115 85,100" fill="#17181C"/>
          </svg>
        </div>
        <h1 className="mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="text-[#D6462A]">
            Azubi-Wars
          </span>
        </h1>
        <p className="mb-2 text-lg sm:text-xl font-semibold text-gray-200">
          Gamified Lernen für die Ausbildung 🎮📚
        </p>
        <p className="mx-auto mb-6 max-w-md text-balance text-sm sm:text-base text-gray-400">
          Meistere IHK-Prüfungsfragen, sammle XP, steige im Rang auf. Vom{" "}
          <strong>Neuling</strong> bis zum <strong>Ausbilder</strong>.
        </p>
      </div>

      {/* Features */}
      <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg">
        {[
          { icon: "🎯", title: "6 Kategorien", desc: "IHK-Lernfelder" },
          { icon: "📚", title: "35 Fragen", desc: "3 Schwierigkeiten" },
          { icon: "🏆", title: "8 Ränge", desc: "Vom Neuling zum Ausbilder" },
        ].map((f) => (
          <div key={f.title} className="card text-center py-3 px-2">
            <div className="text-xl sm:text-2xl mb-1">{f.icon}</div>
            <div className="font-semibold text-xs sm:text-sm text-gray-200">{f.title}</div>
            <div className="text-xs text-gray-400 hidden sm:block">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Nickname Input */}
      <div className="card w-full max-w-md animate-bounce-in">
        <label htmlFor="nickname" className="mb-2 block font-semibold text-gray-200">
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
          className="mb-3 w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-lg font-medium text-gray-100 outline-none transition-all duration-200 focus:border-[#D6462A] focus:ring-2 focus:ring-[#D6462A]/20 placeholder:text-gray-500"
          autoFocus
        />
        {error && (
          <p className="mb-3 text-sm font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
        <button onClick={handleStart} disabled={loading} className="btn-primary w-full text-lg">
          {loading ? "Starte…" : "🚀 Los geht's!"}
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Industriekaufmann/-frau · IHK-Prüfungsniveau
        </p>
      </div>
    </div>
  );
}
