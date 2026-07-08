"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Bitte Email und Passwort eingeben.");
      return;
    }
    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    if (mode === "register" && nickname.trim().length < 2) {
      setError("Bitte einen Nickname (min. 2 Zeichen) eingeben.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const user = await register(email.trim(), password);
        // Profil in Firestore anlegen
        await fetch("/api/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: user.uid,
            nickname: nickname.trim(),
          }),
        });
      } else {
        await login(email.trim(), password);
      }

      localStorage.setItem("nickname", nickname.trim() || email.split("@")[0]!);
      localStorage.setItem("totalXp", "0");
      localStorage.setItem("totalCorrect", "0");
      localStorage.setItem("totalAnswered", "0");
      localStorage.setItem("bestStreak", "0");

      router.push("/play");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fehler";
      if (msg.includes("email-already-in-use")) {
        setError("Diese Email wird bereits verwendet.");
      } else if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
        setError("Email oder Passwort falsch.");
      } else if (msg.includes("invalid-email")) {
        setError("Ungültige Email-Adresse.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-2">
      <div className="text-center mb-8 animate-slide-up">
        <div className="mb-4 flex justify-center">
          <svg viewBox="0 0 200 200" className="h-16 w-16" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="#D6462A"/>
            <polygon points="100,22 168,61 168,139 100,178 32,139 32,61" fill="#17181C"/>
            <g transform="translate(100,100) rotate(-45)"><polygon points="0,-66 11,-46 11,58 -11,58 -11,-46" fill="#D6462A"/></g>
            <g transform="translate(100,100) rotate(45)"><polygon points="0,-66 5,-46 5,40 -5,40 -5,-46" fill="#D6462A"/><rect x="-18" y="40" width="36" height="8" fill="#D6462A"/></g>
            <polygon points="100,85 115,100 100,115 85,100" fill="#17181C"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-200">
          {mode === "login" ? "Willkommen zurück!" : "Account erstellen"}
        </h1>
      </div>

      <div className="card w-full max-w-sm space-y-4 animate-bounce-in">
        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-white/5 p-1">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              mode === "login" ? "bg-[#D6462A] text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              mode === "register" ? "bg-[#D6462A] text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Registrieren
          </button>
        </div>

        {mode === "register" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="AzubiPro99"
              className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="azubi@example.com"
            autoComplete="email"
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-100 outline-none focus:border-[#D6462A] placeholder:text-gray-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center bg-red-500/10 rounded-lg py-2 px-3">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "⏳ Bitte warten…" : mode === "login" ? "🔐 Einloggen" : "📝 Account erstellen"}
        </button>

        <p className="text-center text-xs text-gray-500">
          {mode === "login" ? "Noch keinen Account?" : "Bereits registriert?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-[#D6462A] hover:underline"
          >
            {mode === "login" ? "Registrieren" : "Einloggen"}
          </button>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-600">
        Dein Fortschritt wird in deinem Account gespeichert und ist auf allen Geräten verfügbar.
      </p>
    </div>
  );
}
