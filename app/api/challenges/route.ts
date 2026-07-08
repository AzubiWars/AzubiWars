import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";

export const runtime = "nodejs";

// GET: Alle User-erstellten Fragen abrufen
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");

    let query = db.collection("questions").where("quelle", "==", "user");

    if (authorId) {
      query = query.where("authorId", "==", authorId);
    }

    const snapshot = await query.orderBy("erstelltAm", "desc").limit(50).get();
    const challenges = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("GET /api/challenges error:", error);
    return NextResponse.json(
      { challenges: [] },
      { status: 200 } // Fallback: leeres Array statt Fehler
    );
  }
}

// POST: Neue Frage einreichen
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const {
      frage,
      optionen,
      korrekterIndex,
      erklaerung,
      kategorie,
      schwierigkeit,
      authorId,
      authorName,
    } = body;

    // Validierung
    if (!frage || !optionen || optionen.length !== 4 ||
        typeof korrekterIndex !== "number" || !erklaerung ||
        !kategorie || !schwierigkeit || !authorName) {
      return NextResponse.json(
        { error: "Alle Felder (frage, optionen[4], korrekterIndex, erklaerung, kategorie, schwierigkeit, authorName) sind erforderlich." },
        { status: 400 }
      );
    }

    const punkteMap: Record<string, number> = { leicht: 10, mittel: 20, schwer: 30 };

    const question = {
      id: crypto.randomUUID(),
      frage,
      optionen,
      korrekterIndex,
      erklaerung,
      kategorie,
      schwierigkeit,
      punkte: punkteMap[schwierigkeit] ?? 20,
      quelle: "user",
      authorId: authorId || "anonymous",
      authorName,
      erstelltAm: new Date().toISOString(),
      playCount: 0,
      likes: 0,
    };

    await db.collection("questions").doc(question.id).set(question);

    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error) {
    console.error("POST /api/challenges error:", error);
    return NextResponse.json(
      { error: "Challenge konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
