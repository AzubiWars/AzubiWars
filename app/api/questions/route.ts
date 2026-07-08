import { NextRequest, NextResponse } from "next/server";
import { getQuestions } from "@/lib/questions";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);
    const kategorie = searchParams.get("kategorie") ?? undefined;

    const questions = await getQuestions(limit, kategorie);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json(
      { error: "Fragen konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}
