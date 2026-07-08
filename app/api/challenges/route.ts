import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";
import { type Firestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

// GET: Alle User-erstellten Fragen abrufen
export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db
      .collection("questions")
      .where("quelle", "==", "user")
      .orderBy("erstelltAm", "desc")
      .limit(50)
      .get();

    const challenges = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("GET /api/challenges error:", error);
    // Fallback: leeres Array
    return NextResponse.json({ challenges: [] });
  }
}

// POST: Neue Frage einreichen
export async function POST(request: NextRequest) {
  try {
    let db: Firestore;
    try {
      db = getDb();
    } catch (initError) {
      console.error("Firestore init error:", initError);
      return NextResponse.json(
        { error: "Datenbank nicht verfügbar. Bitte Firestore-Umgebungsvariablen prüfen." },
        { status: 500 }
      );
    }

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
      beruf,
    } = body;

    // Validierung
    if (!frage || typeof frage !== "string" || frage.trim().length < 5) {
      return NextResponse.json({ error: "Bitte eine Frage mit mindestens 5 Zeichen eingeben." }, { status: 400 });
    }
    if (!optionen || !Array.isArray(optionen) || optionen.length !== 4) {
      return NextResponse.json({ error: "Genau 4 Antwortoptionen erforderlich." }, { status: 400 });
    }
    if (optionen.some((o: unknown) => typeof o !== "string" || (o as string).trim().length === 0)) {
      return NextResponse.json({ error: "Alle 4 Optionen müssen ausgefüllt sein." }, { status: 400 });
    }
    if (typeof korrekterIndex !== "number" || korrekterIndex < 0 || korrekterIndex > 3) {
      return NextResponse.json({ error: "Bitte eine korrekte Antwort auswählen (A–D)." }, { status: 400 });
    }
    if (!erklaerung || typeof erklaerung !== "string" || erklaerung.trim().length < 5) {
      return NextResponse.json({ error: "Bitte eine Erklärung mit mindestens 5 Zeichen eingeben." }, { status: 400 });
    }
    if (!authorName) {
      return NextResponse.json({ error: "Nicht eingeloggt. Bitte erst auf der Startseite einloggen." }, { status: 400 });
    }

    const punkteMap: Record<string, number> = { leicht: 10, mittel: 20, schwer: 30 };
    const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const question = {
      id,
      frage: frage.trim(),
      optionen: optionen.map((o: string) => o.trim()),
      korrekterIndex,
      erklaerung: erklaerung.trim(),
      kategorie: kategorie || "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
      schwierigkeit: schwierigkeit || "mittel",
      beruf: beruf || "Industriekaufmann/-frau",
      punkte: punkteMap[schwierigkeit] ?? 20,
      quelle: "user",
      authorId: authorId || "anonymous",
      authorName,
      erstelltAm: new Date().toISOString(),
      playCount: 0,
    };

    await db.collection("questions").doc(id).set(question);
    console.log("Challenge saved:", id, "by", authorName);

    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/challenges error:", msg);
    return NextResponse.json(
      { error: `Fehler beim Speichern: ${msg.slice(0, 200)}` },
      { status: 500 }
    );
  }
}
