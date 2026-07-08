import type { Kategorie, Schwierigkeit, GeneratedQuestion } from "./anthropic";
import { KATEGORIEN, PUNKTE } from "./anthropic";
export type { Kategorie, Schwierigkeit, GeneratedQuestion };

export interface QuestionRecord extends GeneratedQuestion {
  id: string;
  kategorie: Kategorie;
  schwierigkeit: Schwierigkeit;
  punkte: number;
  quelle: "ki" | "user";
  erstelltAm: string;
}

const SYSTEM_PROMPT = `Du bist Prüfer für die Ausbildung Industriekaufmann/-frau (IHK, Deutschland).
Erstelle Multiple-Choice-Fragen zum angegebenen Thema und Schwierigkeitsgrad.

Regeln:
- Genau 4 Antwortoptionen, exakt eine ist korrekt.
- Fachlich korrekt, IHK-Prüfungsniveau, aktueller Stand (deutsches Recht/BWL).
- Erklärung: 1–2 Sätze, warum die richtige Antwort stimmt.
- Keine Trickfragen, eindeutige Lösung.
- Antworte NUR mit JSON-Array, Schema:
[{"frage": "...", "optionen": ["A","B","C","D"], "korrekterIndex": 0-3, "erklaerung": "..."}]`;

const GEMINI_MODEL = "gemini-2.5-flash";

export async function generateQuestions(
  kategorie: Kategorie,
  schwierigkeit: Schwierigkeit,
  anzahl: number
): Promise<QuestionRecord[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ist nicht gesetzt.");
  }

  const prompt = `Kategorie: "${kategorie}"
Schwierigkeit: "${schwierigkeit}"
Anzahl: ${anzahl}

Erstelle ${anzahl} Multiple-Choice-Fragen.`;

  const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API Fehler (${res.status}): ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!text) {
    throw new Error("Gemini hat keine Antwort generiert.");
  }

  // JSON aus Antwort extrahieren
  let jsonStr = text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1]!.trim();
  }

  let parsed: GeneratedQuestion[];
  try {
    parsed = JSON.parse(jsonStr) as GeneratedQuestion[];
  } catch {
    throw new Error(`Konnte Gemini-Antwort nicht als JSON parsen. Antwort: ${text.slice(0, 500)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Erwartet: JSON-Array. Erhalten: ${typeof parsed}`);
  }

  return parsed.map((q) => {
    if (
      !q.frage ||
      !Array.isArray(q.optionen) ||
      q.optionen.length !== 4 ||
      typeof q.korrekterIndex !== "number" ||
      q.korrekterIndex < 0 ||
      q.korrekterIndex > 3 ||
      !q.erklaerung
    ) {
      throw new Error(`Ungültige Frage-Struktur: ${JSON.stringify(q)}`);
    }

    return {
      id: crypto.randomUUID(),
      kategorie,
      schwierigkeit,
      frage: q.frage,
      optionen: q.optionen as [string, string, string, string],
      korrekterIndex: q.korrekterIndex as 0 | 1 | 2 | 3,
      erklaerung: q.erklaerung,
      punkte: PUNKTE[schwierigkeit],
      quelle: "ki",
      erstelltAm: new Date().toISOString(),
    };
  });
}
