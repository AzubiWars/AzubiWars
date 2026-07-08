import { NextResponse } from "next/server";
import { generateQuestions, type Kategorie, KATEGORIEN } from "@/lib/gemini";
import { getDb } from "@/lib/firestore";

export const runtime = "nodejs";

// POST: Generiert Fragen für ALLE Kategorien in allen Schwierigkeiten
export async function POST() {
  const results: string[] = [];
  let totalAdded = 0;

  for (const kat of KATEGORIEN) {
    for (const diff of ["leicht", "mittel", "schwer"] as const) {
      try {
        results.push(`🔄 ${kat} · ${diff}…`);
        const questions = await generateQuestions(kat as Kategorie, diff, 3);

        // In Firestore speichern
        try {
          const db = getDb();
          const batch = db.batch();
          for (const q of questions) {
            const ref = db.collection("questions").doc(q.id);
            batch.set(ref, q);
          }
          await batch.commit();
          totalAdded += questions.length;
          results.push(`   ✅ ${questions.length} Fragen gespeichert`);
        } catch {
          // Fallback: ohne Firestore, Fragen trotzdem generiert
          results.push(`   ⚠️ Firestore nicht verfügbar, ${questions.length} Fragen nur generiert`);
        }

        // Kurze Pause (Rate Limit)
        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        results.push(`   ❌ Fehler: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  return NextResponse.json({
    success: true,
    totalAdded,
    results,
    message: `${totalAdded} neue Fragen generiert über ${KATEGORIEN.length} Kategorien × 3 Schwierigkeiten`,
  });
}
