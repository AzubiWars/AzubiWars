# Azubi-Wars — Bau-Prompt für den Prototyp

> **Zweck dieser Datei:** Selbst-tragender Prompt/Spec. In eine neue Claude-Code-Session einfügen und direkt bauen. Enthält allen Kontext — keine Vorkenntnis nötig.

---

## Context (warum dieses Projekt)

**KI-Hackathon.** Ziel: lauffähiger Prototyp + Pitch. Idee: **Azubi-Wars** — „Codewars für Azubis". Codewars ist eine Plattform, auf der Entwickler Coding-Aufgaben („Kata") lösen, die automatisch gegen Tests geprüft werden, und dabei im Rang aufsteigen (kyu → dan) und sich über Leaderboards messen. Azubi-Wars überträgt dieses Prinzip auf **Ausbildungsinhalte**: gamifiziertes Lernen + sich battlen.

**Kernproblem, das die KI löst:** Lern-Content für Azubis manuell zu erstellen ist teuer und langsam. Hier erzeugt **Claude den kompletten Frage-/Aufgabenpool inkl. Lösungen und Erklärungen** — unbegrenzt, skalierbar über jeden Ausbildungsberuf. Das ist der KI-Hook des Projekts.

**Entschiedene Weichen (aus Brainstorming):**
| Entscheidung | Wahl |
|---|---|
| Zielgruppe (Prototyp) | Industriekaufmann/-frau (ein Beruf = scharfe Demo) |
| Challenge-Format | Multiple-Choice-Wissensquiz (4 Optionen, 1 richtig) |
| Battle-Modus | Async Leaderboard + Wochen-Challenge; dazu private Team-/Jahrgang-Battles |
| Content-Quelle | **KI generiert Pool vorab** (Claude) → später auch user-eingestellte Aufgaben |
| KI-Rolle | Content-Engine: erzeugt Fragen + korrekte Lösung + Erklärung |
| Zeit | Wenige Stunden, heute |
| Team | Calvin solo mit Claude Code |

---

---

## Scope

### MVP — muss heute stehen (Demo-fähig)
1. **Landing / Onboarding:** Nickname eingeben → Start. Kurzer Pitch-Text „Azubi-Wars".
2. **Play-Loop (Kern):** Fragen aus dem KI-Pool nacheinander. Karte mit Frage + 4 Optionen. Antwort wählen → sofort richtig/falsch + **Erklärung** (aus dem Pool). „Weiter" → nächste Frage. Fortschritts- und Punktanzeige. Runde = ~10 Fragen.
3. **Punkte & Rang:** Richtige Antwort gibt XP (nach Schwierigkeit gewichtet). XP-Summe → **Ausbildungs-Rang-Tier** (siehe unten). Streak-Zähler für Serie richtiger Antworten.
4. **Ergebnis-Screen:** Score der Runde, gewonnene XP, aktueller/neuer Rang, Streak.
5. **Leaderboard:** globale Rangliste nach Gesamt-XP, eigener Eintrag hervorgehoben.
6. **Seed-Skript:** generiert den Start-Pool via Claude (siehe Generierungs-Spec) → `data/questions.json`.

### Stretch — wenn Zeit übrig
- **Live-KI-Button** (`/admin`): „Neue Fragen generieren" ruft Claude live, hängt an den Pool an. Starker Live-Wow-Moment im Pitch.
- **Wochen-Challenge:** fixes Fragenset der Woche, eigenes Mini-Leaderboard.
- **Private Team-/Jahrgang-Battle:** Invite-Code erstellen/beitreten → gruppen-gefiltertes Leaderboard.

### Später (Vision, NICHT im Prototyp)
User-eingestellte Aufgaben mit Claude als Co-Autor · echte Accounts/DB/Auth · Deploy auf Vercel · weitere Ausbildungsberufe · Voting/Kuratierung wie Codewars.

---

## Datenmodell

```ts
// data/questions.json — Pool
type Question = {
  id: string;
  kategorie: Kategorie;              // s. Content-Spec
  schwierigkeit: "leicht" | "mittel" | "schwer";
  frage: string;
  optionen: [string, string, string, string];
  korrekterIndex: 0 | 1 | 2 | 3;
  erklaerung: string;               // warum richtig — von Claude
  punkte: number;                   // leicht 10 / mittel 20 / schwer 30
  quelle: "ki" | "user";
};

// data/players.json — Runtime
type Player = {
  nickname: string;
  xpGesamt: number;
  beantwortet: number;
  richtig: number;
  besteStreak: number;
  teamCode?: string;                // Stretch
  zuletztAktiv: string;             // ISO-String (Date im Code stampeln)
};
```

Rang-Tiers (`lib/ranks.ts`) — Ausbildungs-thematisch, motivierend:

| Rang | XP-Schwelle |
|---|---|
| Neuling | 0 |
| Azubi 1. Lehrjahr | 100 |
| Azubi 2. Lehrjahr | 300 |
| Azubi 3. Lehrjahr | 600 |
| Ausgelernt (Geselle) | 1000 |
| Fachwirt | 1600 |
| Meister | 2500 |
| Ausbilder | 4000 |

`getRang(xp)` gibt aktuellen Rang + XP bis zum nächsten zurück (für Fortschrittsbalken).

---

## Content-Spec (Industriekaufmann)

Kategorien (= Prüfungs-/Lernfelder):
- `Beschaffung & Lagerhaltung`
- `Absatz & Marketing`
- `Rechnungswesen & Buchführung`
- `Kosten- & Leistungsrechnung / Controlling`
- `Personalwirtschaft`
- `Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)`

Seed-Ziel: **ca. 40–60 Fragen**, verteilt über alle Kategorien und Schwierigkeiten (grob 40 % leicht, 40 % mittel, 20 % schwer).

---

## KI-Generierung (Claude als Content-Engine)

`lib/anthropic.ts` → `generateQuestions(kategorie, schwierigkeit, anzahl)`:
- Anthropic SDK, Modell `claude-sonnet-5` (Seed-Skript darf `claude-opus-4-8` für Qualität nutzen).
- Erzwinge **striktes JSON** (Array von `Question` ohne `id`/`punkte`/`quelle` — die setzt der Code). Nutze Tool-Use oder klare System-Anweisung + JSON-Parsing mit Fehler-Retry.

**Generierungs-Prompt (Vorlage):**
```
Du bist Prüfer für die Ausbildung Industriekaufmann/-frau (IHK, Deutschland).
Erstelle {anzahl} Multiple-Choice-Fragen zur Kategorie "{kategorie}",
Schwierigkeit "{schwierigkeit}".

Regeln:
- Genau 4 Antwortoptionen, exakt eine ist korrekt.
- Fachlich korrekt, IHK-Prüfungsniveau, aktueller Stand (deutsches Recht/BWL).
- Erklärung: 1–2 Sätze, warum die richtige Antwort stimmt.
- Keine Trickfragen, eindeutige Lösung.
- Antworte NUR mit JSON-Array, Schema:
[{"frage": "...", "optionen": ["A","B","C","D"], "korrekterIndex": 0-3, "erklaerung": "..."}]
```

`scripts/seed.ts`: iteriert über Kategorien × Schwierigkeiten, ruft `generateQuestions`, ergänzt `id` (`crypto.randomUUID()`), `punkte` (leicht 10/mittel 20/schwer 30), `quelle: "ki"`, schreibt nach `data/questions.json`. Idempotent (überschreibt Datei), per `npm run seed` startbar.

---

## Dateistruktur

```
azubi-wars/
  app/
    page.tsx                 # Landing + Nickname
    play/page.tsx            # Quiz-Loop (Client-Component)
    ergebnis/page.tsx        # Runden-Zusammenfassung (oder Modal in play)
    leaderboard/page.tsx     # Rangliste
    admin/page.tsx           # STRETCH: KI-Generieren-Button
    layout.tsx, globals.css  # Tailwind
    api/
      questions/route.ts     # GET: n zufällige Fragen (optional ?kategorie=)
      players/route.ts       # GET Leaderboard · POST/PATCH: XP updaten
      generate/route.ts      # STRETCH: POST → Claude → Pool erweitern
  lib/
    anthropic.ts             # Client + generateQuestions()
    store.ts                 # JSON lesen/schreiben (questions, players)
    ranks.ts                 # Tiers + getRang()
  data/
    questions.json           # geseedeter Pool
    players.json             # Runtime (startet als [])
  scripts/seed.ts
  .env.local                 # ANTHROPIC_API_KEY
```

**Wichtig:** API-Routes auf **Node-Runtime** (`export const runtime = "nodejs"`), nicht Edge — Dateisystem-Zugriff nötig. Anthropic-Aufrufe nur serverseitig (Key nie im Client).

---

## UI / UX

- Klarer, moderner Look (Tailwind). Gamified: Fortschrittsbalken, XP-Zähler, Rang-Badge, Streak-Flamme.
- **Ton:** motivierend, jung, aber seriös (Ausbildung). Eine Akzentfarbe + neutrale Basis. Light reicht für Demo.
- Feedback nach Antwort: grün/rot, Erklärung eingeblendet, „Weiter"-Button.
- Leaderboard: Platz, Nickname, Rang-Badge, XP; eigener Eintrag farbig hervorgehoben.
- Mobile-freundlich (Azubis am Handy) — responsive, große Tap-Targets.

---

## Verifikation (End-to-End-Test nach Bau)

1. `.env.local` mit `ANTHROPIC_API_KEY` anlegen.
2. `npm run seed` → prüfen: `data/questions.json` enthält 40+ valide Fragen (Schema stimmt, `korrekterIndex` im Bereich 0–3).
3. `npm run dev` → `localhost:3000`:
   - Nickname eingeben → Start.
   - 10 Fragen spielen: falsche + richtige Antwort → Feedback + Erklärung erscheint, XP steigt.
   - Ergebnis-Screen: Score + Rang korrekt.
   - `/leaderboard`: eigener Eintrag sichtbar, nach XP sortiert. Zweiter Durchlauf mit anderem Nickname → beide gelistet.
4. Stretch: `/admin` „Neue Fragen generieren" → Pool wächst, neue Fragen spielbar.

---

## Pitch-Kernaussage (für die Präsentation)

> Azubi-Wars macht Ausbildung so süchtig wie ein Spiel. Der Clou: **Claude erzeugt den kompletten, fachlich geprüften Lern-Content selbst** — unbegrenzt und für jeden Ausbildungsberuf skalierbar. Azubis lernen im Wettkampf (Ränge, Leaderboard, Team-Battles), Betriebe/Schulen bekommen messbaren Lernfortschritt. Wir lösen das teuerste Problem jeder Lernplattform — die Content-Erstellung — mit KI.
