export const RANKS = [
  { name: "Neuling", minXp: 0, emoji: "🌱" },
  { name: "Azubi 1. Lehrjahr", minXp: 100, emoji: "📘" },
  { name: "Azubi 2. Lehrjahr", minXp: 300, emoji: "📗" },
  { name: "Azubi 3. Lehrjahr", minXp: 600, emoji: "📙" },
  { name: "Ausgelernt (Geselle)", minXp: 1000, emoji: "🎓" },
  { name: "Fachwirt", minXp: 1600, emoji: "💼" },
  { name: "Meister", minXp: 2500, emoji: "🏅" },
  { name: "Ausbilder", minXp: 4000, emoji: "👑" },
] as const;

export interface RankInfo {
  name: string;
  emoji: string;
  xpInRank: number;
  xpToNext: number | null; // null = max rank
  progress: number; // 0–100
  index: number;
}

type RankEntry = (typeof RANKS)[number];

export function getRang(xp: number): RankInfo {
  let currentRank: RankEntry = RANKS[0]!;
  let nextRank: RankEntry | null = RANKS[1] ?? null;

  for (let i = RANKS.length - 1; i >= 0; i--) {
    const rank = RANKS[i]!;
    if (xp >= rank.minXp) {
      currentRank = rank;
      nextRank = RANKS[i + 1] ?? null;
      break;
    }
  }

  const xpInRank = xp - currentRank.minXp;
  const xpToNext = nextRank ? nextRank.minXp - currentRank.minXp : null;
  const progress = xpToNext ? Math.min(100, Math.round((xpInRank / xpToNext) * 100)) : 100;

  return {
    name: currentRank.name,
    emoji: currentRank.emoji,
    xpInRank,
    xpToNext,
    progress,
    index: RANKS.findIndex((r) => r.name === currentRank.name),
  };
}

export function getNextRank(xp: number): { name: string; emoji: string; xpNeeded: number } | null {
  for (const rank of RANKS) {
    if (rank.minXp > xp) {
      return {
        name: rank.name,
        emoji: rank.emoji,
        xpNeeded: rank.minXp - xp,
      };
    }
  }
  return null; // already max rank
}
