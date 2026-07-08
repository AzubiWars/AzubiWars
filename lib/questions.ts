import { getDb } from "./firestore";
import type { QuestionRecord } from "./anthropic";

const COLLECTION = "questions";

export async function getQuestions(limit: number, kategorie?: string): Promise<QuestionRecord[]> {
  const db = getDb();
  let query = db.collection(COLLECTION);

  if (kategorie) {
    query = query.where("kategorie", "==", kategorie);
  }

  // Firestore unterstützt kein zufälliges Sampling nativ.
  // Strategie: alle Fragen holen und zufällig mischen (Pool ist klein genug).
  const snapshot = await query.get();
  const all = snapshot.docs.map((doc) => doc.data() as QuestionRecord);

  // Fisher-Yates Shuffle und auf `limit` begrenzen
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return shuffled.slice(0, limit);
}

export async function addQuestions(questions: QuestionRecord[]): Promise<number> {
  const db = getDb();
  const batch = db.batch();

  for (const q of questions) {
    const ref = db.collection(COLLECTION).doc(q.id);
    batch.set(ref, q);
  }

  await batch.commit();
  return questions.length;
}

export async function getQuestionCount(): Promise<number> {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).count().get();
  return snapshot.data().count;
}
