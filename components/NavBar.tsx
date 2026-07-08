"use client";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    setNickname(localStorage.getItem("nickname"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center gap-3 text-sm font-medium text-gray-400">
      {nickname && (
        <span className="text-gray-500 text-xs hidden md:inline max-w-24 truncate">
          {nickname}
        </span>
      )}
      <a href="/challenges" className="hover:text-[#D6462A] transition-colors hidden sm:inline">
        📋 Community
      </a>
      <a href="/erstellen" className="hover:text-[#D6462A] transition-colors">
        🛠️ Erstellen
      </a>
      <a href="/leaderboard" className="hover:text-[#D6462A] transition-colors">
        🏆 Rangliste
      </a>
      {nickname && (
        <button
          onClick={handleLogout}
          className="hover:text-red-400 transition-colors text-xs"
        >
          🚪
        </button>
      )}
    </nav>
  );
}
