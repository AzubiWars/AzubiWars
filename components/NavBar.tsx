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
    <nav className="flex items-center gap-4 text-sm font-medium text-gray-400">
      {nickname && (
        <span className="text-gray-500 text-xs hidden sm:inline">
          {nickname}
        </span>
      )}
      <a href="/leaderboard" className="hover:text-[#D6462A] transition-colors">
        🏆 Leaderboard
      </a>
      {nickname && (
        <button
          onClick={handleLogout}
          className="hover:text-red-400 transition-colors text-xs"
        >
          🚪 Abmelden
        </button>
      )}
    </nav>
  );
}
