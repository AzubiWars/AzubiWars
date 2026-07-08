"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const DIFFICULTIES = [
  { value: "gemischt", label: "🎯 Gemischt", desc: "Leicht → Schwer (progressiv)", color: "border-white/20 hover:border-[#D6462A]/50" },
  { value: "leicht", label: "🟢 Leicht", desc: "Nur leichte Fragen (10 XP)", color: "border-green-500/30 hover:border-green-500/60" },
  { value: "mittel", label: "🟡 Mittel", desc: "Nur mittlere Fragen (20 XP)", color: "border-yellow-500/30 hover:border-yellow-500/60" },
  { value: "schwer", label: "🔴 Schwer", desc: "Nur schwere Fragen (30 XP)", color: "border-red-500/30 hover:border-red-500/60" },
] as const;

type Difficulty = (typeof DIFFICULTIES)[number]["value"];

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [difficulty, setDifficulty] = useState<Difficulty>("gemischt");
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [loadingXp, setLoadingXp] = useState(true);

  // XP vom Server laden
  useEffect(() => {
    if (user) {
      fetch(`/api/players?id=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.xpGesamt !== undefined) {
            localStorage.setItem("totalXp", String(data.xpGesamt));
          }
          if (data.nickname) {
            localStorage.setItem("nickname", data.nickname);
          }
          setLoadingXp(false);
        })
        .catch(() => setLoadingXp(false));
    } else if (!authLoading) {
      setLoadingXp(false);
    }
  }, [user, authLoading]);

  const startGame = () => {
    localStorage.setItem("difficulty", difficulty);
    if (!localStorage.getItem("totalXp")) localStorage.setItem("totalXp", "0");
    if (!localStorage.getItem("totalCorrect")) localStorage.setItem("totalCorrect", "0");
    if (!localStorage.getItem("totalAnswered")) localStorage.setItem("totalAnswered", "0");
    if (!localStorage.getItem("bestStreak")) localStorage.setItem("bestStreak", "0");
    router.push("/play");
  };

  // Loading
  if (authLoading || (user && loadingXp)) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Lade…</p>
      </div>
    );
  }

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
      {!showDifficulty && (
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg">
          {[
            { icon: "🎯", title: "6 Kategorien", desc: "IHK-Lernfelder" },
            { icon: "📚", title: "35+ Fragen", desc: "3 Schwierigkeiten" },
            { icon: "🏆", title: "8 Ränge", desc: "Neuling → Ausbilder" },
          ].map((f) => (
            <div key={f.title} className="card text-center py-3 px-2">
              <div className="text-xl sm:text-2xl mb-1">{f.icon}</div>
              <div className="font-semibold text-xs sm:text-sm text-gray-200">{f.title}</div>
              <div className="text-xs text-gray-400 hidden sm:block">{f.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Authenticated: Difficulty + Play */}
      {user ? (
        showDifficulty ? (
          <div className="card w-full max-w-md animate-bounce-in text-center space-y-4">
            <div>
              <div className="text-4xl mb-2">⚙️</div>
              <h2 className="text-xl font-bold text-gray-100">Schwierigkeit wählen</h2>
            </div>
            <div className="space-y-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                    difficulty === d.value
                      ? d.color.replace("hover:", "").replace("/50", "") + " bg-white/5 ring-2 ring-white/10"
                      : d.color + " bg-transparent"
                  }`}
                >
                  <div className="font-semibold text-gray-200">{d.label}</div>
                  <div className="text-xs text-gray-400">{d.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={startGame} className="btn-primary w-full text-lg">
              ⚔️ Spiel starten
            </button>
            <button onClick={() => setShowDifficulty(false)} className="text-sm text-gray-500 hover:text-gray-300">
              ← Zurück
            </button>
          </div>
        ) : (
          <div className="card w-full max-w-md animate-bounce-in text-center space-y-4">
            <div>
              <div className="text-4xl mb-2">👋</div>
              <h2 className="text-xl font-bold text-gray-100">
                Bereit, {user.email?.split("@")[0]}?
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Dein Fortschritt wird in deinem Account gespeichert.
              </p>
            </div>
            <button onClick={() => setShowDifficulty(true)} className="btn-primary w-full text-lg">
              🚀 Neue Runde starten
            </button>
          </div>
        )
      ) : (
        /* Not authenticated */
        <div className="card w-full max-w-md animate-bounce-in text-center space-y-4">
          <div>
            <div className="text-4xl mb-2">🔐</div>
            <h2 className="text-xl font-bold text-gray-100">Login oder Registrieren</h2>
            <p className="text-gray-400 text-sm mt-1">
              Erstelle einen Account, um deinen Fortschritt zu speichern und auf dem Leaderboard zu erscheinen.
            </p>
          </div>
          <a href="/login" className="btn-primary w-full text-lg inline-block">
            🔐 Einloggen / Registrieren
          </a>
          <p className="text-xs text-gray-500">
            Deine Daten werden sicher in Firebase gespeichert.
          </p>
        </div>
      )}
    </div>
  );
}
