"use client";

import { useEffect, useState } from "react";

interface CommunityQuestion {
  id: string;
  frage: string;
  kategorie: string;
  schwierigkeit: string;
  beruf?: string;
  punkte: number;
  authorName: string;
  erstelltAm: string;
  playCount: number;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<CommunityQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data.challenges || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Lade Community-Aufgaben…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-slide-up space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-200">📋 Community-Aufgaben</h1>
        <p className="mt-1 text-sm text-gray-400">
          Von Azubis erstellte Fragen — spiel sie und sammle XP!
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="card text-center py-12 border-dashed">
          <div className="text-4xl mb-3 opacity-50">📝</div>
          <p className="text-gray-400 text-sm mb-4">Noch keine Community-Aufgaben.</p>
          <a href="/erstellen" className="btn-primary text-sm inline-block">
            🛠️ Erste Aufgabe erstellen
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="card p-4 hover:bg-white/[0.04] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-gray-100 transition-colors line-clamp-2">
                      {c.frage}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {c.beruf && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#D6462A]/10 text-[#D6462A]/70">
                          {c.beruf}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-gray-400">
                        {c.kategorie}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md ${
                          c.schwierigkeit === "leicht"
                            ? "bg-green-500/10 text-green-400"
                            : c.schwierigkeit === "mittel"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {c.schwierigkeit} · {c.punkte} XP
                      </span>
                      <span className="text-xs text-gray-500">
                        von <span className="text-gray-400">{c.authorName}</span>
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/play?q=${c.id}`}
                    className="btn-primary text-xs px-4 py-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ▶ Spielen
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a href="/erstellen" className="btn-secondary text-sm">
              🛠️ Eigene Aufgabe erstellen
            </a>
          </div>
        </>
      )}
    </div>
  );
}
