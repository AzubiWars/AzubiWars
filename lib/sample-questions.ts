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

  // ═══════════════════════════════════════════
  // Neue Fragen aus Industriekaufmann_Quizfragen.txt
  // ═══════════════════════════════════════════

  // ── Leichte Fragen ──
  {
    id: "s16",
    kategorie: "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
    schwierigkeit: "leicht",
    frage: "Was bedeutet die Abkürzung BWL?",
    optionen: [
      "Betriebswirtschaftslehre",
      "Berufsweiterbildung Lehrgang",
      "Bundeswirtschaftsliga",
      "Betriebswarenlager",
    ],
    korrekterIndex: 0,
    erklaerung:
      "BWL steht für Betriebswirtschaftslehre. Sie befasst sich mit wirtschaftlichen Entscheidungen und Abläufen in Betrieben — im Gegensatz zur VWL (Volkswirtschaftslehre), die gesamtwirtschaftliche Zusammenhänge betrachtet.",
    punkte: 10,
  },
  {
    id: "s17",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "leicht",
    frage: "Was ist eine Rechnung?",
    optionen: [
      "Ein Vertrag",
      "Eine Zahlungsaufforderung",
      "Ein Lieferschein",
      "Ein Angebot",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Eine Rechnung ist eine Zahlungsaufforderung an den Kunden für eine erbrachte Leistung oder gelieferte Ware. Sie enthält u. a. Leistungsbeschreibung, Betrag, Umsatzsteuer und Zahlungsziel.",
    punkte: 10,
  },
  {
    id: "s18",
    kategorie: "Personalwirtschaft",
    schwierigkeit: "leicht",
    frage: "Welche Abteilung kümmert sich um Mitarbeiter?",
    optionen: [
      "Einkauf",
      "Vertrieb",
      "Personalabteilung",
      "Produktion",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Die Personalabteilung (auch HR = Human Resources) ist für alle Mitarbeiterbelange zuständig: Einstellung, Verträge, Gehaltsabrechnung, Weiterbildung und Kündigung.",
    punkte: 10,
  },
  {
    id: "s19",
    kategorie: "Absatz & Marketing",
    schwierigkeit: "leicht",
    frage: "Was ist ein Angebot im kaufmännischen Sinne?",
    optionen: [
      "Eine Rechnung",
      "Eine Anfrage",
      "Eine unverbindliche Aufforderung zum Kauf",
      "Ein Vertrag",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Ein Angebot ist eine unverbindliche Aufforderung an den Kunden, ein konkretes Geschäft abzuschließen. Rechtlich ist es eine invitatio ad offerendum (Aufforderung zur Abgabe eines Angebots), noch kein bindender Vertrag.",
    punkte: 10,
  },
  {
    id: "s20",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "leicht",
    frage: "Was bedeutet Umsatz?",
    optionen: [
      "Gewinn",
      "Einnahmen aus Verkäufen",
      "Steuer",
      "Verlust",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Der Umsatz bezeichnet die Summe aller Einnahmen aus dem Verkauf von Waren und Dienstleistungen in einer Periode — ohne Abzug von Kosten. Der Gewinn ergibt sich erst nach Abzug aller Kosten vom Umsatz.",
    punkte: 10,
  },
  {
    id: "s21",
    kategorie: "Absatz & Marketing",
    schwierigkeit: "leicht",
    frage: "Was gehört zum Marketing?",
    optionen: [
      "Personal einstellen",
      "Werbung",
      "Buchhaltung",
      "Lagerhaltung",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Werbung ist ein zentrales Instrument der Kommunikationspolitik im Marketing-Mix. Marketing umfasst die 4 Ps: Product, Price, Place, Promotion (Produkt-, Preis-, Distributions- und Kommunikationspolitik).",
    punkte: 10,
  },
  {
    id: "s22",
    kategorie: "Beschaffung & Lagerhaltung",
    schwierigkeit: "leicht",
    frage: "Was ist ein Lager?",
    optionen: [
      "Ort zur Warenaufbewahrung",
      "Bürogebäude",
      "Parkplatz",
      "Produktionsmaschine",
    ],
    korrekterIndex: 0,
    erklaerung:
      "Ein Lager dient der Aufbewahrung von Waren, Rohstoffen oder Fertigerzeugnissen. Es überbrückt Zeitdifferenzen zwischen Beschaffung, Produktion und Absatz und ist Teil der Logistikkette.",
    punkte: 10,
  },
  {
    id: "s23",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "leicht",
    frage: "Was bedeutet Skonto?",
    optionen: [
      "Ratenzahlung",
      "Preisnachlass bei schneller Zahlung",
      "Mahngebühr",
      "Steuerabzug",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Skonto ist ein prozentualer Preisnachlass, den der Lieferant bei Zahlung innerhalb einer bestimmten Frist gewährt (z. B. '2 % Skonto bei Zahlung innerhalb von 10 Tagen'). Es dient der Liquiditätssicherung des Verkäufers.",
    punkte: 10,
  },
  {
    id: "s24",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "leicht",
    frage: "Welche Steuer steht auf den meisten Rechnungen?",
    optionen: [
      "Hundesteuer",
      "Kirchensteuer",
      "Umsatzsteuer",
      "Gewerbesteuer",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Die Umsatzsteuer (auch Mehrwertsteuer genannt) wird auf fast alle Lieferungen und Leistungen im Inland erhoben. Der Regelsteuersatz beträgt 19 %, der ermäßigte Satz 7 %.",
    punkte: 10,
  },
  {
    id: "s25",
    kategorie: "Beschaffung & Lagerhaltung",
    schwierigkeit: "leicht",
    frage: "Was macht der Einkauf?",
    optionen: [
      "Kunden beraten",
      "Waren beschaffen",
      "Rechnungen schreiben",
      "Werbung erstellen",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Der Einkauf (Beschaffung) ist für die Versorgung des Unternehmens mit benötigten Waren, Rohstoffen und Dienstleistungen zuständig — zum richtigen Zeitpunkt, in der richtigen Menge und Qualität, zum besten Preis.",
    punkte: 10,
  },

  // ── Schwere Fragen ──
  {
    id: "s26",
    kategorie: "Kosten- & Leistungsrechnung / Controlling",
    schwierigkeit: "schwer",
    frage: "Was versteht man unter dem Deckungsbeitrag?",
    optionen: [
      "Umsatz minus Gewinn",
      "Erlöse minus variable Kosten",
      "Umsatz minus Steuern",
      "Gewinn minus Fixkosten",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Der Deckungsbeitrag ist die Differenz zwischen Erlösen und variablen Kosten. Er dient zur Deckung der Fixkosten. Alles, was danach übrig bleibt, ist Gewinn (DB = E − Kv).",
    punkte: 30,
  },
  {
    id: "s27",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Welche Bilanzposition gehört zum Anlagevermögen?",
    optionen: [
      "Kasse",
      "Bank",
      "Fuhrpark",
      "Forderungen",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Der Fuhrpark (Firmenfahrzeuge) gehört zum Sachanlagevermögen und steht auf der Aktivseite. Kasse, Bank und Forderungen sind dem Umlaufvermögen zugeordnet, da sie kurzfristig gebunden sind.",
    punkte: 30,
  },
  {
    id: "s28",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Was passiert bei einer Inventur?",
    optionen: [
      "Mitarbeiter werden gezählt",
      "Vermögenswerte und Schulden werden erfasst",
      "Rechnungen werden bezahlt",
      "Kunden werden analysiert",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Die Inventur ist die körperliche oder buchmäßige Bestandsaufnahme aller Vermögenswerte und Schulden zu einem bestimmten Stichtag. Sie ist Grundlage für den Jahresabschluss (§§ 240, 241 HGB).",
    punkte: 30,
  },
  {
    id: "s29",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Welche Formel beschreibt den Gewinn?",
    optionen: [
      "Umsatz + Kosten",
      "Umsatz − Kosten",
      "Kosten − Umsatz",
      "Umsatz × Kosten",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Gewinn = Umsatz (Erlöse) − Kosten. Übersteigen die Kosten den Umsatz, entsteht ein Verlust. Der Gewinn ist die zentrale Kennzahl für den wirtschaftlichen Erfolg eines Unternehmens.",
    punkte: 30,
  },
  {
    id: "s30",
    kategorie: "Wirtschafts- & Sozialkunde (Recht, BGB/HGB, Arbeitsrecht, Sozialversicherung)",
    schwierigkeit: "schwer",
    frage: "Was ist ein Zielkonflikt in Unternehmen?",
    optionen: [
      "Zwei identische Ziele",
      "Sich widersprechende Ziele",
      "Keine Unternehmensziele",
      "Ein Bilanzfehler",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Ein Zielkonflikt liegt vor, wenn die Verfolgung eines Ziels die Erreichung eines anderen Ziels beeinträchtigt (z. B. hohe Qualität vs. niedrige Kosten, oder ökonomische vs. ökologische Ziele).",
    punkte: 30,
  },
  {
    id: "s31",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Was bedeutet Liquidität?",
    optionen: [
      "Rentabilität",
      "Zahlungsfähigkeit",
      "Vermögen",
      "Gewinn",
    ],
    korrekterIndex: 1,
    erklaerung:
      "Liquidität bezeichnet die Fähigkeit eines Unternehmens, seinen Zahlungsverpflichtungen jederzeit fristgerecht nachzukommen. Fehlende Liquidität ist der häufigste Insolvenzgrund — selbst bei profitablem Geschäft.",
    punkte: 30,
  },
  {
    id: "s32",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Welches Dokument begründet eine Forderung gegen einen Kunden?",
    optionen: [
      "Bestellung",
      "Angebot",
      "Rechnung",
      "Inventur",
    ],
    korrekterIndex: 2,
    erklaerung:
      "Die Rechnung begründet eine Forderung aus Lieferung und Leistung (LuL). Sie entsteht mit Auslieferung der Ware oder Erbringung der Leistung und wird auf der Aktivseite der Bilanz unter Umlaufvermögen ausgewiesen.",
    punkte: 30,
  },
  {
    id: "s33",
    kategorie: "Kosten- & Leistungsrechnung / Controlling",
    schwierigkeit: "schwer",
    frage: "Was versteht man unter der Kostenartenrechnung?",
    optionen: [
      "Erfassung der Art der Kosten",
      "Verteilung der Kosten",
      "Gewinnermittlung",
      "Steuerberechnung",
    ],
    korrekterIndex: 0,
    erklaerung:
      "Die Kostenartenrechnung ist die erste Stufe der Kostenrechnung. Sie erfasst, welche Kosten in welcher Höhe angefallen sind — gegliedert nach Kostenarten wie Materialkosten, Personalkosten, Abschreibungen etc.",
    punkte: 30,
  },
  {
    id: "s34",
    kategorie: "Kosten- & Leistungsrechnung / Controlling",
    schwierigkeit: "schwer",
    frage: "Welche Aufgabe hat die Kostenstellenrechnung?",
    optionen: [
      "Kosten verursachungsgerecht Bereichen zuordnen",
      "Jahresabschluss erstellen",
      "Kunden werben",
      "Steuern berechnen",
    ],
    korrekterIndex: 0,
    erklaerung:
      "Die Kostenstellenrechnung ist die zweite Stufe der Kostenrechnung. Sie verteilt die Gemeinkosten verursachungsgerecht auf die Bereiche (Kostenstellen), in denen sie entstanden sind — z. B. Fertigung, Verwaltung, Vertrieb.",
    punkte: 30,
  },
  {
    id: "s35",
    kategorie: "Rechnungswesen & Buchführung",
    schwierigkeit: "schwer",
    frage: "Was ist die Eigenkapitalquote?",
    optionen: [
      "Eigenkapital im Verhältnis zum Gesamtkapital",
      "Gewinn pro Mitarbeiter",
      "Umsatz pro Kunde",
      "Fremdkapitalquote",
    ],
    korrekterIndex: 0,
    erklaerung:
      "Die Eigenkapitalquote = Eigenkapital / Gesamtkapital × 100. Sie zeigt, wie hoch der Anteil des Eigenkapitals an der Bilanzsumme ist und ist ein wichtiger Indikator für die finanzielle Stabilität eines Unternehmens.",
    punkte: 30,
  },
];
