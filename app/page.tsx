"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedPlayer, setSavedPlayer] = useState<{
    nickname: string;
    playerId: string;
    xp: number;
  } | null>(null);
  const [showNewPlayer, setShowNewPlayer] = useState(false);

  // Beim Laden: localStorage checken → Auto-Login anbieten
  useEffect(() => {
    const storedNick = localStorage.getItem("nickname");
    const storedId = localStorage.getItem("playerId");
    const storedXp = localStorage.getItem("totalXp");

    if (storedNick && storedId) {
      // Auch Firestore checken für aktuellste XP
      fetch(`/api/players?id=${storedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.xpGesamt !== undefined) {
            localStorage.setItem("totalXp", String(data.xpGesamt));
            setSavedPlayer({
              nickname: data.nickname || storedNick,
              playerId: storedId,
              xp: data.xpGesamt,
            });
          } else {
            setSavedPlayer({
              nickname: storedNick,
              playerId: storedId,
              xp: parseInt(storedXp ?? "0", 10),
            });
          }
        })
        .catch(() => {
          setSavedPlayer({
            nickname: storedNick,
            playerId: storedId,
            xp: parseInt(storedXp ?? "0", 10),
          });
        });
    }
  }, []);

  const startGame = (nick: string, id: string) => {
    localStorage.setItem("playerId", id);
    localStorage.setItem("nickname", nick);
    if (!localStorage.getItem("totalXp")) localStorage.setItem("totalXp", "0");
    if (!localStorage.getItem("totalCorrect")) localStorage.setItem("totalCorrect", "0");
    if (!localStorage.getItem("totalAnswered")) localStorage.setItem("totalAnswered", "0");
    if (!localStorage.getItem("bestStreak")) localStorage.setItem("bestStreak", "0");
    router.push("/play");
  };

  const handleNewPlayer = async () => {
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

    // Firestore: Spieler anlegen
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed, playerId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Server-seitige ID nutzen falls vorhanden
        startGame(trimmed, data.id || playerId);
        return;
      }
    } catch {
      // Fallback: Lokal
    }

    startGame(trimmed, playerId);
  };

  const handleContinue = () => {
    if (savedPlayer) {
      startGame(savedPlayer.nickname, savedPlayer.playerId);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setSavedPlayer(null);
    setShowNewPlayer(false);
    setNickname("");
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
          <span className="text-[#D6462A]">Azubi-Wars</span>
        </h1>
        <p className="mb-2 text-lg sm:text-xl font-semibold text-gray-200">
          Gamified Lernen für die Ausbildung 🎮📚
        </p>
        <p className="mx-auto mb-6 max-w-md text-balance text-sm sm:text-base text-gray-400">
          Meistere IHK-Prüfungsfragen, sammle XP, steige im Rang auf. Vom{" "}
          <strong className="text-gray-200">Neuling</strong> bis zum <strong className="text-gray-200">Ausbilder</strong>.
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

      {/* ── Auto-Login Card ── */}
      {savedPlayer && !showNewPlayer ? (
        <div className="card w-full max-w-md animate-bounce-in text-center space-y-4">
          <div>
            <div className="text-5xl mb-2">👋</div>
            <h2 className="text-xl font-bold text-gray-100">Willkommen zurück!</h2>
            <p className="text-gray-400 mt-1">
              <span className="font-semibold text-[#D6462A]">{savedPlayer.nickname}</span>
              {" · "}
              <span className="text-gray-300">{savedPlayer.xp} XP</span>
            </p>
          </div>

          <button onClick={handleContinue} className="btn-primary w-full text-lg">
            ⚔️ Weiterspielen
          </button>

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setShowNewPlayer(true)}
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Neuer Spieler?
            </button>
            <span className="text-gray-600">·</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      ) : (
        /* ── Login / New Player Card ── */
        <div className="card w-full max-w-md animate-bounce-in">
          {savedPlayer && (
            <button
              onClick={() => setShowNewPlayer(false)}
              className="mb-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Zurück zu {savedPlayer.nickname}
            </button>
          )}

          <label htmlFor="nickname" className="mb-2 block font-semibold text-gray-200">
            {savedPlayer ? "Neuer Nickname" : "Dein Nickname"}
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleNewPlayer()}
            placeholder="z. B. AzubiPro99"
            maxLength={20}
            className="mb-3 w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-lg font-medium text-gray-100 outline-none transition-all duration-200 focus:border-[#D6462A] focus:ring-2 focus:ring-[#D6462A]/20 placeholder:text-gray-500"
            autoFocus
          />
          {error && (
            <p className="mb-3 text-sm font-medium text-red-400" role="alert">
              {error}
            </p>
          )}
          <button onClick={handleNewPlayer} disabled={loading} className="btn-primary w-full text-lg">
            {loading ? "Starte…" : "🚀 Los geht's!"}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">
            Industriekaufmann/-frau · IHK-Prüfungsniveau
          </p>
        </div>
      )}
    </div>
  );
}
