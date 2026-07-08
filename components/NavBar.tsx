"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRang } from "@/lib/ranks";

export default function NavBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  const xp = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("totalXp") ?? "0", 10)
    : 0;
  const rang = getRang(xp);

  const navItems = [
    { href: "/play", label: "⚔️ Spielen" },
    { href: "/challenges", label: "📋 Community" },
    { href: "/leaderboard", label: "🏆 Rangliste" },
  ];

  return (
    <div className="flex items-center gap-0.5">
      {/* ── Center Nav ── */}
      <div className="hidden sm:flex items-center bg-white/[0.04] rounded-xl p-0.5">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-3.5 py-2 rounded-[10px] text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] transition-all"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Mobile: compact icons */}
      <div className="flex sm:hidden items-center gap-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] transition-all text-lg"
            title={item.label}
          >
            {item.label.split(" ")[0]}
          </a>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

      {/* ── Right: Profile / Login ── */}
      {user ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-xl hover:bg-white/[0.06] transition-all px-2 py-1.5"
          >
            <div className="w-7 h-7 rounded-full bg-[#D6462A]/20 flex items-center justify-center text-sm font-bold text-[#D6462A]">
              {(user.email?.[0] ?? "A").toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 hidden md:block max-w-[80px] truncate">
              {user.email?.split("@")[0]}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#1a1a22] shadow-xl shadow-black/50 overflow-hidden animate-slide-up z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-[#D6462A]">{rang.emoji} {rang.name}</span>
                  <span className="text-xs text-gray-500">{xp} XP</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => { setOpen(false); router.push("/erstellen"); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 transition-colors"
                >
                  🛠️ Aufgabe erstellen
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.04] hover:text-red-400 transition-colors"
                >
                  🚪 Abmelden
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <a
          href="/login"
          className="flex items-center gap-1.5 rounded-xl bg-[#D6462A]/10 hover:bg-[#D6462A]/20 text-[#D6462A] px-3.5 py-2 text-sm font-semibold transition-all"
        >
          🔐 <span className="hidden sm:inline">Login</span>
        </a>
      )}
    </div>
  );
}
