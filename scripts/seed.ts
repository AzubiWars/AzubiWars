/**
 * Seed-Skript für Azubi-Wars.
 *
 * Generiert den initialen Fragen-Pool via Claude und speichert
 * die Fragen in Firestore.
 *
 * Nutzung: npm run seed
 *
 * Voraussetzungen:
 *   - ANTHROPIC_API_KEY in .env.local
 *   - FIREBASE_SERVICE_ACCOUNT oder GOOGLE_APPLICATION_CREDENTIALS gesetzt
 */

import { generateQuestions, KATEGORIEN, type Schwierigkeit } from "../lib/anthropic";
import { addQuestions, getQuestionCount } from "../lib/questions";

const SEED_PLAN: { kategorie: (typeof KATEGORIEN)[number]; schwierigkeit: Schwierigkeit; anzahl: number }[] = [
  // Leicht (40% von ~50 = ~20)
  { kategorie: KATEGORIEN[0]!, schwierigkeit: "leicht", anzahl: 4 },
  { kategorie: KATEGORIEN[1]!, schwierigkeit: "leicht", anzahl: 3 },
  { kategorie: KATEGORIEN[2]!, schwierigkeit: "leicht", anzahl: 4 },
  { kategorie: KATEGORIEN[3]!, schwierigkeit: "leicht", anzahl: 3 },
  { kategorie: KATEGORIEN[4]!, schwierigkeit: "leicht", anzahl: 3 },
  { kategorie: KATEGORIEN[5]!, schwierigkeit: "leicht", anzahl: 3 },
  // Mittel (40% von ~50 = ~20)
  { kategorie: KATEGORIEN[0]!, schwierigkeit: "mittel", anzahl: 3 },
  { kategorie: KATEGORIEN[1]!, schwierigkeit: "mittel", anzahl: 4 },
  { kategorie: KATEGORIEN[2]!, schwierigkeit: "mittel", anzahl: 3 },
  { kategorie: KATEGORIEN[3]!, schwierigkeit: "mittel", anzahl: 4 },
  { kategorie: KATEGORIEN[4]!, schwierigkeit: "mittel", anzahl: 3 },
  { kategorie: KATEGORIEN[5]!, schwierigkeit: "mittel", anzahl: 3 },
  // Schwer (20% von ~50 = ~10)
  { kategorie: KATEGORIEN[0]!, schwierigkeit: "schwer", anzahl: 2 },
  { kategorie: KATEGORIEN[1]!, schwierigkeit: "schwer", anzahl: 2 },
  { kategorie: KATEGORIEN[2]!, schwierigkeit: "schwer", anzahl: 2 },
  { kategorie: KATEGORIEN[3]!, schwierigkeit: "schwer", anzahl: 1 },
  { kategorie: KATEGORIEN[4]!, schwierigkeit: "schwer", anzahl: 2 },
  { kategorie: KATEGORIEN[5]!, schwierigkeit: "schwer", anzahl: 1 },
];

async function main() {
  console.log("🌱 Azubi-Wars Seed-Skript\n");
  console.log(`📋 ${SEED_PLAN.length} Batches geplant\n`);

  // Check: ANTHROPIC_API_KEY
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY nicht gesetzt. Bitte in .env.local konfigurieren.");
    process.exit(1);
  }

  // Check: Firestore (indirekt über getQuestionCount)
  try {
    const existing = await getQuestionCount();
    console.log(`📦 Aktuell ${existing} Fragen in Firestore.\n`);
  } catch (err) {
    console.error("❌ Firestore nicht erreichbar:", err);
    console.error("   Stelle sicher, dass GOOGLE_APPLICATION_CREDENTIALS oder FIREBASE_SERVICE_ACCOUNT gesetzt ist.");
    process.exit(1);
  }

  let totalGenerated = 0;

  for (let i = 0; i < SEED_PLAN.length; i++) {
    const batch = SEED_PLAN[i]!;
    console.log(
      `🔄 Batch ${i + 1}/${SEED_PLAN.length}: ${batch.kategorie} · ${batch.schwierigkeit} · ${batch.anzahl} Fragen`
    );

    try {
      // Verwende Claude Opus für Seed-Qualität
      const questions = await generateQuestions(
        batch.kategorie,
        batch.schwierigkeit,
        batch.anzahl,
        "claude-opus-4-8"
      );

      const added = await addQuestions(questions);
      totalGenerated += added;
      console.log(`   ✅ ${added} Fragen gespeichert.`);
    } catch (err) {
      console.error(`   ❌ Fehler:`, err instanceof Error ? err.message : err);
      console.log(`   ⏭️  Überspringe Batch, mache weiter...`);
    }

    // Kleine Pause zwischen Batches (Rate-Limits vermeiden)
    if (i < SEED_PLAN.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n🎉 Fertig! ${totalGenerated} neue Fragen generiert.`);
  const total = await getQuestionCount();
  console.log(`📦 Insgesamt ${total} Fragen im Pool.\n`);

  if (total < 40) {
    console.warn("⚠️  Weniger als 40 Fragen. Starte den Seed erneut oder generiere manuell über /admin.");
  }
}

main().catch((err) => {
  console.error("Seed fehlgeschlagen:", err);
  process.exit(1);
});
