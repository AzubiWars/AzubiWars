"use client";

import { AuthProvider } from "@/lib/auth-context";
import NavBar from "./NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0f0f13]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2.5">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <svg viewBox="0 0 200 200" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
              <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="#D6462A"/>
              <polygon points="100,22 168,61 168,139 100,178 32,139 32,61" fill="#17181C"/>
              <g transform="translate(100,100) rotate(-45)"><polygon points="0,-66 11,-46 11,58 -11,58 -11,-46" fill="#D6462A"/></g>
              <g transform="translate(100,100) rotate(45)"><polygon points="0,-66 5,-46 5,40 -5,40 -5,-46" fill="#D6462A"/><rect x="-18" y="40" width="36" height="8" fill="#D6462A"/></g>
              <polygon points="100,85 115,100 100,115 85,100" fill="#17181C"/>
            </svg>
            <span className="text-base sm:text-lg font-extrabold text-[#D6462A] tracking-tight hidden sm:block">
              Azubi-Wars
            </span>
          </a>

          {/* Navigation + Profile */}
          <NavBar />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-5 text-center text-xs text-gray-600 space-x-4">
        <span>Azubi-Wars — Gamified Lernen für Azubis</span>
        <a href="/impressum" className="hover:text-gray-400 transition-colors">Impressum</a>
        <a href="/datenschutz" className="hover:text-gray-400 transition-colors">Datenschutz</a>
      </footer>
    </AuthProvider>
  );
}
