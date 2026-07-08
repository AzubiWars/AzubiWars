import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Azubi-Wars — Gamified Lernen für die Ausbildung",
  description:
    "Azubi-Wars macht Ausbildung so süchtig wie ein Spiel. Löse Quiz-Aufgaben, sammle XP und steige im Rang auf – vom Neuling bis zum Ausbilder.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
              <span className="text-2xl">⚔️</span>
              <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                Azubi-Wars
              </span>
            </a>
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
              <a href="/leaderboard" className="hover:text-brand-600 transition-colors">
                🏆 Leaderboard
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
          ⚔️ Azubi-Wars — Gamified Lernen für Azubis ·{" "}
          <span className="text-brand-500">Powered by Claude</span>
        </footer>
      </body>
    </html>
  );
}
