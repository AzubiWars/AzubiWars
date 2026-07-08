"use client";

import { useAuth } from "@/lib/auth-context";
import { getRang } from "@/lib/ranks";

export default function NavBar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const xp = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("totalXp") ?? "0", 10)
    : 0;
  const rang = getRang(xp);

  return (
    <nav className="flex items-center gap-3 text-sm font-medium text-gray-400">
      {user ? (
        <>
          <span className="text-gray-500 text-xs hidden md:inline">
            {rang.emoji} {user.email?.split("@")[0]}
          </span>
          <a href="/challenges" className="hover:text-[#D6462A] transition-colors hidden sm:inline">
            📋 Community
          </a>
          <a href="/erstellen" className="hover:text-[#D6462A] transition-colors">
            🛠️ Erstellen
          </a>
          <a href="/leaderboard" className="hover:text-[#D6462A] transition-colors">
            🏆 Rangliste
          </a>
          <button onClick={handleLogout} className="hover:text-red-400 transition-colors text-xs">
            🚪
          </button>
        </>
      ) : (
        <a href="/login" className="text-[#D6462A] hover:text-[#c13d24] transition-colors font-semibold">
          🔐 Login
        </a>
      )}
    </nav>
  );
}
