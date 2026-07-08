export interface SampleQuestion {
  id: string;
  kategorie: string;
  schwierigkeit: "leicht" | "mittel" | "schwer";
  frage: string;
  optionen: [string, string, string, string];
  korrekterIndex: 0 | 1 | 2 | 3;
  erklaerung: string;
  punkte: number;
}

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  // ── Beschaffung & Lagerhaltung ──
  {
    id: "s1",
    kategorie: "Beschaffung & Lagerhaltung",
    schwierigkeit: "leicht",
    frage: "Was versteht man unter der optimalen Bestellmenge?",
    optionen: [
      "Die Menge, bei der die Summe aus Bestell- und Lagerhaltungskosten minimal ist",
      "Die maximal mögliche Bestellmenge pro Lieferant",
      "Die Menge, die der Lieferant als Mindestabnahme vorschreibt",
      "Die durchschnittliche Bestellmenge der letzten 12 Monate",
    ],
    korrekterIndex: 0,
    erklaerung:
      "Die optimale Bestellmenge minimiert die Gesamtkosten aus Bestellkosten (fallend bei größeren Mengen) und Lagerhaltungskosten (steigend bei größeren Mengen).",
    punkte: 10,
  },
  {
    id: "s2",
    kategorie: "Beschaffung & Lagerhaltung",
    schwierigkeit: "mittel",
    frage: "Welches Ziel verfolgt das Just-in-Time-Verfahren (JIT) in der Beschaffung?",
    optionen: [
      "Maximale Lagerbestände für Lieferengpässe aufbauen",
      "Material genau dann anliefern, wenn es in der Produktion benötigt wird",
      "Möglichst viele Lieferanten gleichzeitig beauftragen",
      "Bestellungen nur einmal pro Quartal auslösen",
    ],
    korrekterIndex: 1,
    erklaerung:
      "JIT zielt darauf ab, Lagerbestände zu minimieren und Material bedarfssynchron bereitzustellen. Das senkt Lagerkosten, erfordert aber zuverlässige Lieferanten.",
    punkte: 20,
  },

  // ── Absatz & Marketing ──
  {
    id: "s3",
    kategorie: "Absatz & Marketing",
    schwierigkeit: "leicht",
    frage: "Welche der folgenden Maßnahmen gehört zur Preispolitik im Marketing-Mix?",
    optionen: [
      "Einführung eines neuen Logos",
      "Eröffnung einer neuen Filiale",
      "Gewährung eines Mengenrabatts",
      "Schaltung einer Social-Media-Kampagne",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Der Mengenrabatt ist ein preispolitisches Instrument. Die anderen Optionen gehören zur Kommunikationspolitik (Logo, Kampagne) bzw. Distributionspolitik (Filiale).",
    punkte: 10,
  },
  {
    id: "s4",
    kategorie: "Absatz & Marketing",
    schwierigkeit: "mittel",
    frage: "Was beschreibt der Begriff USP (Unique Selling Proposition)?",
    optionen: [
      "Den durchschnittlichen Verkaufspreis eines Produkts",
      "Die einzigartige Verkaufseigenschaft, die ein Produkt von der Konkurrenz abhebt",
      "Die Gesamtzahl der verkauften Einheiten pro Jahr",
      "Den Standardpreis innerhalb einer Branche",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Der USP ist das Alleinstellungsmerkmal eines Produkts oder einer Marke. Er beantwortet die Frage: Warum soll der Kunde genau dieses Produkt kaufen?",
    punkte: 20,
  },
  {
    id: "s5",
    kategorie: "Absatz & Marketing",
    schwierigkeit: "schwer",
    frage: "Ein Unternehmen führt eine Deckungsbeitragsrechnung durch. Der Nettoverkaufspreis beträgt 120 €, die variablen Stückkosten 80 €. Wie hoch ist der Deckungsbeitrag pro Stück?",
    optionen: ["20 €", "30 €", "40 €", "80 €"],
    korrekterIndex: 2,
    erklaerung:
      "Deckungsbeitrag = Nettoverkaufspreis − variable Stückkosten = 120 € − 80 € = 40 €. Der Deckungsbeitrag dient zur Deckung der Fixkosten.",
    punkte: 30,
  },

  // ── Rechnungswesen & Buchführung ──
  {
    id: "s6",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "leicht",
    frage: "Welche der folgenden Positionen steht auf der Aktivseite einer Bilanz?",
    optionen: [
      "Eigenkapital",
      "Verbindlichkeiten aus Lieferungen und Leistungen",
      "Grundstücke und Gebäude",
      "Rückstellungen",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Grundstücke und Gebäude sind Anlagevermögen und stehen auf der Aktivseite (Mittelverwendung). Eigenkapital, Verbindlichkeiten und Rückstellungen sind Passivposten (Mittelherkunft).",
    punkte: 10,
  },
  {
    id: "s7",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "mittel",
    frage: "Was ist der Unterschied zwischen Aufwand und Ausgabe?",
    optionen: [
      "Es gibt keinen Unterschied, die Begriffe sind synonym",
      "Aufwand ist erfolgswirksam, Ausgabe führt zu einer Geldabfluss",
      "Ausgabe ist erfolgswirksam, Aufwand führt zu einem Geldabfluss",
      "Aufwand betrifft nur das Anlagevermögen, Ausgabe das Umlaufvermögen",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Aufwand mindert das Eigenkapital (erfolgswirksam). Eine Ausgabe ist der reine Geldabfluss, der nicht zwingend erfolgswirksam sein muss (z. B. Tilgung eines Kredits).",
    punkte: 20,
  },
  {
    id: "s8",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Ein Unternehmen kauft eine Maschine für 60.000 € netto. Die Nutzungsdauer beträgt 8 Jahre. Wie hoch ist der jährliche Abschreibungsbetrag bei linearer Abschreibung?",
    optionen: ["6.000 €", "7.500 €", "8.000 €", "12.000 €"],
    korrekterIndex: 1,
    erklaerung:
      "Lineare Abschreibung: Anschaffungskosten / Nutzungsdauer = 60.000 € / 8 Jahre = 7.500 € pro Jahr.",
    punkte: 30,
  },

  // ── Controlling ──
  {
    id: "s9",
    kategorie: "Kosten- & Leistungsrechnung / Controlling",
    schwierigkeit: "mittel",
    frage: "Was versteht man unter dem Begriff 'Break-Even-Point'?",
    optionen: [
      "Den Zeitpunkt, an dem ein Produkt vom Markt genommen wird",
      "Die Menge, bei der Erlöse und Gesamtkosten gleich hoch sind",
      "Die maximale Produktionskapazität eines Unternehmens",
      "Die Gewinnschwelle, ab der variable Kosten sinken",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Der Break-Even-Point (Gewinnschwelle) bezeichnet die Absatzmenge, bei der der Gesamterlös den Gesamtkosten entspricht — das Unternehmen macht weder Gewinn noch Verlust.",
    punkte: 20,
  },
  {
    id: "s10",
    kategorie: "Kosten- & Leistungsrechnung / Controlling",
    schwierigkeit: "schwer",
    frage: "Die Fixkosten betragen 100.000 €, der Deckungsbeitrag pro Stück 25 €. Wie viele Einheiten müssen verkauft werden, um die Gewinnschwelle zu erreichen?",
    optionen: ["2.500 Stück", "3.000 Stück", "4.000 Stück", "5.000 Stück"],
    korrekterIndex: 2,
    erklaerung:
      "Break-Even-Menge = Fixkosten / Deckungsbeitrag pro Stück = 100.000 € / 25 € = 4.000 Stück.",
    punkte: 30,
  },

  // ── Personalwirtschaft ──
  {
    id: "s11",
    kategorie: "Personalwirtschaft",
    schwierigkeit: "leicht",
    frage: "Welches Gesetz regelt die Mitbestimmung der Arbeitnehmer im Betrieb?",
    optionen: [
      "Das Bürgerliche Gesetzbuch (BGB)",
      "Das Handelsgesetzbuch (HGB)",
      "Das Betriebsverfassungsgesetz (BetrVG)",
      "Die Gewerbeordnung (GewO)",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Das Betriebsverfassungsgesetz (BetrVG) regelt die Bildung und Rechte von Betriebsräten und damit die Mitbestimmung der Arbeitnehmer auf betrieblicher Ebene.",
    punkte: 10,
  },
  {
    id: "s12",
    kategorie: "Personalwirtschaft",
    schwierigkeit: "mittel",
    frage: "Was versteht man unter dem Tarifvorrang nach § 77 Abs. 3 BetrVG?",
    optionen: [
      "Betriebsvereinbarungen haben immer Vorrang vor Tarifverträgen",
      "Tarifverträge haben Vorrang vor Betriebsvereinbarungen bei Arbeitsentgelt und Arbeitsbedingungen",
      "Einzelarbeitsverträge haben Vorrang vor Tarifverträgen",
      "Betriebsräte können Tarifverträge eigenständig kündigen",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Der Tarifvorrang besagt, dass Arbeitsentgelt und sonstige Arbeitsbedingungen, die durch Tarifvertrag geregelt sind oder üblicherweise geregelt werden, nicht Gegenstand einer Betriebsvereinbarung sein können.",
    punkte: 20,
  },

  // ── Wirtschafts- & Sozialkunde ──
  {
    id: "s13",
    kategorie: "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
    schwierigkeit: "leicht",
    frage: "Ein Kaufvertrag kommt nach BGB zustande durch...",
    optionen: [
      "Übergabe der Ware und Bezahlung",
      "Zwei übereinstimmende Willenserklärungen (Angebot und Annahme)",
      "Schriftliche Fixierung und notarielle Beglaubigung",
      "Allein durch die Bestellung des Käufers",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Ein Kaufvertrag kommt durch Antrag (Angebot) und Annahme zustande (§§ 145 ff. BGB). Das sind zwei übereinstimmende Willenserklärungen. Grundsätzlich ist kein Schriftformerfordernis nötig.",
    punkte: 10,
  },
  {
    id: "s14",
    kategorie: "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
    schwierigkeit: "mittel",
    frage: "Welche Rechtsform hat eine GmbH?",
    optionen: [
      "Personengesellschaft",
      "Kapitalgesellschaft und juristische Person",
      "Einzelunternehmen",
      "Gesellschaft bürgerlichen Rechts",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Die GmbH (Gesellschaft mit beschränkter Haftung) ist eine Kapitalgesellschaft und zugleich juristische Person. Sie haftet mit ihrem Gesellschaftsvermögen, nicht mit dem Privatvermögen der Gesellschafter.",
    punkte: 20,
  },
  {
    id: "s15",
    kategorie: "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
    schwierigkeit: "mittel",
    frage: "Ab welchem Alter ist man in Deutschland grundsätzlich voll geschäftsfähig?",
    optionen: [
      "Ab 16 Jahren",
      "Ab 18 Jahren",
      "Ab 21 Jahren",
      "Ab 14 Jahren",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Die volle Geschäftsfähigkeit tritt mit Vollendung des 18. Lebensjahres ein (§ 2 BGB). Zwischen 7 und 17 Jahren ist man beschränkt geschäftsfähig.",
    punkte: 20,
  },
];
