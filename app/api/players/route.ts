import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreatePlayer,
  updatePlayerStats,
  getLeaderboard,
  getPlayerById,
} from "@/lib/players";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("id");

    if (playerId) {
      try {
        const player = await getPlayerById(playerId);
        if (!player) {
          return NextResponse.json({ error: "Spieler nicht gefunden." }, { status: 404 });
        }
        return NextResponse.json(player);
      } catch {
        return NextResponse.json({ error: "Datenbank nicht verfügbar" }, { status: 200 });
      }
    }

    const players = await getLeaderboard();
    return NextResponse.json({ players });
  } catch (error) {
    console.error("GET /api/players error:", error);
    return NextResponse.json({ players: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nickname = body.nickname?.trim();

    if (!nickname || nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { error: "Nickname muss 2–20 Zeichen lang sein." },
        { status: 400 }
      );
    }

    const player = await getOrCreatePlayer(nickname, body.playerId);
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("POST /api/players error:", error);
    // Player creation failed (Firestore not available) → return a local-play compatible response
    return NextResponse.json(
      { id: "local", nickname: "local", xpGesamt: 0, beantwortet: 0, richtig: 0, besteStreak: 0 },
      { status: 201 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, xpGained, wasCorrect } = body;

    if (!playerId || typeof xpGained !== "number" || typeof wasCorrect !== "boolean") {
      return NextResponse.json(
        { error: "playerId, xpGained (number), wasCorrect (boolean) benötigt." },
        { status: 400 }
      );
    }

    const player = await updatePlayerStats(playerId, xpGained, wasCorrect);
    return NextResponse.json(player);
  } catch (error) {
    console.error("PATCH /api/players error:", error);
    // Silently accept — client uses localStorage as source of truth
    return NextResponse.json({ ok: true });
  }
}
