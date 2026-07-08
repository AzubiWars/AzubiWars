import { NextRequest, NextResponse } from "next/server";
import { generateQuestions, type Kategorie, type Schwierigkeit } from "@/lib/gemini";
import { addQuestions } from "@/lib/questions";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY nicht konfiguriert." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const kategorie = body.kategorie as Kategorie;
    const schwierigkeit = body.schwierigkeit as Schwierigkeit;
    const anzahl = Math.min(body.anzahl ?? 5, 10);

    if (!kategorie || !schwierigkeit) {
      return NextResponse.json(
        { error: "kategorie und schwierigkeit sind erforderlich." },
        { status: 400 }
      );
    }

    const questions = await generateQuestions(kategorie, schwierigkeit, anzahl);
    const added = await addQuestions(questions);

    return NextResponse.json({
      success: true,
      added,
      questions,
    });
  } catch (error) {
    console.error("POST /api/generate error:", error);
    return NextResponse.json(
      { error: "Fragen-Generierung fehlgeschlagen." },
      { status: 500 }
    );
  }
}
