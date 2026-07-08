import Anthropic from "@anthropic-ai/sdk";

export type Kategorie =
  | "Beschaffung & Lagerhaltung"
  | "Absatz & Marketing"
  | "Rechnungswesen & Buchführung"
  | "Kosten- & Leistungsrechnung / Controlling"
  | "Personalwirtschaft"
  | "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)";

export type Schwierigkeit = "leicht" | "mittel" | "schwer";

export interface GeneratedQuestion {
  frage: string;
  optionen: [string, string, string, string];
  korrekterIndex: 0 | 1 | 2 | 3;
  erklaerung: string;
}

interface QuestionRecord extends GeneratedQuestion {
  id: string;
  kategorie: Kategorie;
  schwierigkeit: Schwierigkeit;
  punkte: number;
  quelle: "ki" | "user";
  erstelltAm: string;
}

const KATEGORIEN: Kategorie[] = [
  "Beschaffung & Lagerhaltung",
  "Absatz & Marketing",
  "Rechnungswesen & Buchführung",
  "Kosten- & Leistungsrechnung / Controlling",
  "Personalwirtschaft",
  "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
];

const PUNKTE: Record<Schwierigkeit, number> = {
  leicht: 10,
  mittel: 20,
  schwer: 30,
};

const SYSTEM_PROMPT = `Du bist Prüfer für die Ausbildung Industriekaufmann/-frau (IHK, Deutschland).
Erstelle Multiple-Choice-Fragen zum angegebenen Thema und Schwierigkeitsgrad.

Regeln:
- Genau 4 Antwortoptionen, exakt eine ist korrekt.
- Fachlich korrekt, IHK-Prüfungsniveau, aktueller Stand (deutsches Recht/BWL).
- Erklärung: 1–2 Sätze, warum die richtige Antwort stimmt.
- Keine Trickfragen, eindeutige Lösung.
- Antworte NUR mit JSON-Array, Schema:
[{"frage": "...", "optionen": ["A","B","C","D"], "korrekterIndex": 0-3, "erklaerung": "..."}]`;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt.");
  }
  return new Anthropic({ apiKey });
}

export async function generateQuestions(
  kategorie: Kategorie,
  schwierigkeit: Schwierigkeit,
  anzahl: number,
  model: "claude-sonnet-5" | "claude-opus-4-8" = "claude-sonnet-5"
): Promise<QuestionRecord[]> {
  const anthropic = getClient();

  const prompt = `Kategorie: "${kategorie}"
Schwierigkeit: "${schwierigkeit}"
Anzahl: ${anzahl}

Erstelle ${anzahl} Multiple-Choice-Fragen.`;

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (response.content[0] as { type: "text"; text: string }).text;

  // JSON aus der Antwort extrahieren (kann in Markdown-Codeblöcken sein)
  let jsonStr = text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1]!.trim();
  }

  let parsed: GeneratedQuestion[];
  try {
    parsed = JSON.parse(jsonStr) as GeneratedQuestion[];
  } catch {
    throw new Error(`Konnte Claude-Antwort nicht als JSON parsen. Antwort: ${text.slice(0, 500)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Erwartet: JSON-Array. Erhalten: ${typeof parsed}`);
  }

  // Validiere und ergänze die Fragen
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

export { KATEGORIEN, PUNKTE };
export type { QuestionRecord };
