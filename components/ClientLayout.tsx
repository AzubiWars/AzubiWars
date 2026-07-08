"use client";

import { AuthProvider } from "@/lib/auth-context";
import NavBar from "./NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <header className="border-b border-white/10 bg-[#0f0f13]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <svg viewBox="0 0 200 200" className="h-8 w-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <polygon points="100,8 180,54 180,146 100,192 20,146 20,54" fill="#D6462A"/>
              <polygon points="100,22 168,61 168,139 100,178 32,139 32,61" fill="#17181C"/>
              <g transform="translate(100,100) rotate(-45)"><polygon points="0,-66 11,-46 11,58 -11,58 -11,-46" fill="#D6462A"/></g>
              <g transform="translate(100,100) rotate(45)"><polygon points="0,-66 5,-46 5,40 -5,40 -5,-46" fill="#D6462A"/><rect x="-18" y="40" width="36" height="8" fill="#D6462A"/></g>
              <polygon points="100,85 115,100 100,115 85,100" fill="#17181C"/>
            </svg>
            <span className="text-[#D6462A]">Azubi-Wars</span>
          </a>
          <NavBar />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8">{children}</main>

      <footer className="relative z-10 mt-auto border-t border-white/10 bg-white/5 py-6 text-center text-sm text-gray-500">
        Azubi-Wars — Gamified Lernen für Azubis
      </footer>
    </AuthProvider>
  );
}
