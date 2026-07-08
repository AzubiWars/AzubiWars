# ⚔️ Azubi-Wars

**Gamified Lernen für die Ausbildung** — Codewars für Azubis.

Löse IHK-Prüfungsfragen (Industriekaufmann/-frau), sammle XP, steige im Rang auf und battle dich an die Spitze des Leaderboards. Alle Fragen werden von **Claude** generiert — unbegrenzt und fachlich geprüft.

## 🚀 Quick Start

### Voraussetzungen
- **Node.js 20+** installiert
- **Firebase-Projekt** `azubi-wars` (Firestore aktiviert)
- **Anthropic API Key** (für die KI-Fragen-Generierung)
- **Firebase Service Account** (für Firestore-Zugriff vom Server)

### Setup

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen konfigurieren
# Bearbeite .env.local:
#   - ANTHROPIC_API_KEY=sk-ant-...
#   - FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
#     (Aus Firebase Console > Project Settings > Service Accounts)

# 3. Fragen-Pool per KI generieren (~50 Fragen)
npm run seed

# 4. Dev-Server starten
npm run dev
# → http://localhost:3000
```

### Deployment (Vercel)

```bash
# Das Deployment läuft automatisch via Vercel Git-Integration.
# Setze die Umgebungsvariablen in den Vercel-Projekt-Einstellungen:
#   - ANTHROPIC_API_KEY
#   - FIREBASE_SERVICE_ACCOUNT
#   - NEXT_PUBLIC_FIREBASE_PROJECT_ID=azubi-wars
```

## 📁 Projekt-Struktur

```
azubi-wars/
├── app/
│   ├── page.tsx                 # Landing Page + Nickname
│   ├── play/page.tsx            # Quiz-Loop (Client)
│   ├── ergebnis/page.tsx        # Runden-Ergebnis
│   ├── leaderboard/page.tsx     # Rangliste
│   ├── admin/page.tsx           # Live-KI-Generierung
│   ├── layout.tsx               # Root-Layout + Header
│   ├── globals.css              # Tailwind + Komponenten
│   └── api/
│       ├── questions/route.ts   # GET: zufällige Fragen
│       ├── players/route.ts     # GET/POST/PATCH: Spieler
│       └── generate/route.ts    # POST: KI-Fragen generieren
├── lib/
│   ├── firestore.ts             # Firebase Admin → Firestore
│   ├── anthropic.ts             # Claude Content-Engine
│   ├── ranks.ts                 # Rang-Tiers + getRang()
│   ├── questions.ts             # Fragen-DB-Operationen
│   └── players.ts               # Spieler-DB-Operationen
├── scripts/
│   └── seed.ts                  # Initialer Fragen-Pool-Generator
└── data/                        # (optional, für lokale Backups)
```

## 🎮 Spiel-Features

- **8 Rang-Tiers**: Neuling → Azubi 1.-3. Lehrjahr → Ausgelernt → Fachwirt → Meister → Ausbilder
- **6 IHK-Kategorien**: Beschaffung, Marketing, Rechnungswesen, Controlling, Personal, Recht
- **3 Schwierigkeitsgrade**: Leicht (10 XP), Mittel (20 XP), Schwer (30 XP)
- **Streak-System**: 🔥 für Serien richtiger Antworten
- **Leaderboard**: Globale Rangliste, eigener Eintrag hervorgehoben

## 🤖 KI-generierte Fragen

Fragen werden von **Claude** (Anthropic) generiert — auf IHK-Prüfungsniveau, fachlich korrekt, mit erklärenden Lösungen. Die Content-Pipeline:

1. **Seed**: `npm run seed` → generiert ~50 Fragen über alle Kategorien
2. **Live**: `/admin` → per Button neue Fragen zu einer Kategorie generieren

## 🔧 Tech-Stack

| Layer | Technologie |
|---|---|
| Frontend | React 19, Next.js 15 (App Router) |
| Styling | Tailwind CSS 3 |
| Backend | Next.js API Routes (Node Runtime) |
| Datenbank | Firestore (Firebase Admin SDK) |
| KI-Content | Claude API (Anthropic SDK) |
| Deployment | Vercel (automatisch) |
