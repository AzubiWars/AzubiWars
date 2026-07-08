// Alle anerkannten Ausbildungsberufe in Deutschland (IHK + HWK + weitere)
// Quelle: BIBB Verzeichnis der anerkannten Ausbildungsberufe 2024
export const AUSBILDUNGSBERUFE = [
  // ── IHK - Industrie & Handel ──
  "Industriekaufmann/-frau",
  "Kaufmann/-frau für Büromanagement",
  "Kaufmann/-frau im Einzelhandel",
  "Kaufmann/-frau im Groß- und Außenhandel",
  "Kaufmann/-frau für Spedition und Logistik",
  "Kaufmann/-frau für Versicherungen und Finanzen",
  "Kaufmann/-frau für Digitalisierungsmanagement",
  "Kaufmann/-frau für E-Commerce",
  "Kaufmann/-frau für Marketingkommunikation",
  "Kaufmann/-frau im Gesundheitswesen",
  "Kaufmann/-frau für IT-Systemmanagement",
  "Bankkaufmann/-frau",
  "Fachkraft für Lagerlogistik",
  "Fachlagerist/in",
  "Fachkraft für Schutz und Sicherheit",
  "Immobilienkaufmann/-frau",
  "Veranstaltungskaufmann/-frau",
  "Sport- und Fitnesskaufmann/-frau",
  "Tourismuskaufmann/-frau",
  "Medienkaufmann/-frau Digital/Print",
  "Fachinformatiker/in Anwendungsentwicklung",
  "Fachinformatiker/in Systemintegration",
  "Fachinformatiker/in Daten- und Prozessanalyse",
  "Fachinformatiker/in Digitale Vernetzung",
  "IT-Systemelektroniker/in",
  "Elektroniker/in für Betriebstechnik",
  "Elektroniker/in für Automatisierungstechnik",
  "Elektroniker/in für Geräte und Systeme",
  "Elektroniker/in für Energie- und Gebäudetechnik",
  "Mechatroniker/in",
  "Industriemechaniker/in",
  "Konstruktionsmechaniker/in",
  "Werkzeugmechaniker/in",
  "Zerspanungsmechaniker/in",
  "Anlagenmechaniker/in",
  "Verfahrensmechaniker/in für Kunststoff- und Kautschuktechnik",
  "Verfahrensmechaniker/in für Beschichtungstechnik",
  "Chemielaborant/in",
  "Chemikant/in",
  "Pharmakant/in",
  "Maschinen- und Anlagenführer/in",
  "Produktionsfachkraft Chemie",
  "Fachkraft für Metalltechnik",
  "Fachkraft für Lebensmitteltechnik",
  "Brauer/in und Mälzer/in",
  "Destillateur/in",
  "Winzer/in",

  // ── HWK - Handwerk ──
  "Elektroniker/in (Handwerk)",
  "Kfz-Mechatroniker/in",
  "Tischler/in",
  "Maler/in und Lackierer/in",
  "Friseur/in",
  "Bäcker/in",
  "Konditor/in",
  "Fleischer/in",
  "Koch/Köchin",
  "Hotelfachmann/-frau",
  "Restaurantfachmann/-frau",
  "Fachkraft im Gastgewerbe",
  "Metallbauer/in",
  "Feinwerkmechaniker/in",
  "Augenoptiker/in",
  "Hörgeräteakustiker/in",
  "Zahntechniker/in",
  "Orthopädietechnik-Mechaniker/in",
  "Dachdecker/in",
  "Zimmerer/Zimmerin",
  "Maurer/in",
  "Beton- und Stahlbetonbauer/in",
  "Straßenbauer/in",
  "Gärtner/in",
  "Landschaftsgärtner/in",
  "Florist/in",
  "Schornsteinfeger/in",
  "Glaser/in",
  "Raumausstatter/in",
  "Textil- und Modenäher/in",
  "Schuhmacher/in",
  "Goldschmied/in",
  "Uhrmacher/in",

  // ── Medizin & Gesundheit ──
  "Medizinische/r Fachangestellte/r",
  "Zahnmedizinische/r Fachangestellte/r",
  "Tiermedizinische/r Fachangestellte/r",
  "Gesundheits- und Krankenpfleger/in",
  "Altenpfleger/in",
  "Pflegefachmann/-frau",
  "Physiotherapeut/in",
  "Ergotherapeut/in",
  "Logopäde/Logopädin",
  "Medizinisch-technische/r Laboratoriumsassistent/in",
  "Medizinisch-technische/r Radiologieassistent/in",
  "Pharmazeutisch-technische/r Assistent/in",
  "Notfallsanitäter/in",
  "Hebamme/Entbindungspfleger",
  "Diätassistent/in",

  // ── Öffentlicher Dienst & Sonstige ──
  "Verwaltungsfachangestellte/r",
  "Steuerfachangestellte/r",
  "Rechtsanwaltsfachangestellte/r",
  "Notarfachangestellte/r",
  "Justizfachangestellte/r",
  "Fachangestellte/r für Arbeitsmarktdienstleistungen",
  "Sozialversicherungsfachangestellte/r",
  "Beamter/Beamtin mittlerer Dienst",
  "Fachkraft für Kreislauf- und Abfallwirtschaft",
  "Fachkraft für Abwassertechnik",
  "Fachkraft für Wasserversorgungstechnik",
  "Vermessungstechniker/in",
  "Geomatiker/in",
  "Bauzeichner/in",
  "Technische/r Produktdesigner/in",
  "Technische/r Systemplaner/in",
  "Gestalter/in für visuelles Marketing",
  "Fotograf/in",
  "Mediengestalter/in Digital und Print",
  "Mediengestalter/in Bild und Ton",
  "Film- und Videoeditor/in",
  "Buchhändler/in",
  "Fachangestellte/r für Medien- und Informationsdienste",
  "Bestattungsfachkraft",
  "Berufskraftfahrer/in",
  "Eisenbahner/in im Betriebsdienst",
  "Fluggerätmechaniker/in",
  "Schifffahrtskaufmann/-frau",
  "Hafenschiffer/in",
  "Binnenschiffer/in",
] as const;

export type Ausbildungsberuf = (typeof AUSBILDUNGSBERUFE)[number];

export const BERUF_GROUPS = [
  {
    group: "💼 IHK - kaufmännisch",
    berufe: AUSBILDUNGSBERUFE.filter((b) =>
      b.includes("kaufmann") || b.includes("Kaufmann") ||
      b === "Fachkraft für Lagerlogistik" ||
      b === "Fachlagerist/in" ||
      b === "Immobilienkaufmann/-frau"
    ),
  },
  {
    group: "💻 IHK - IT & Technik",
    berufe: AUSBILDUNGSBERUFE.filter((b) =>
      b.includes("Fachinformatiker") || b.includes("IT-") ||
      b.includes("Elektroniker") || b.includes("Mechatroniker") ||
      b.includes("Industriemechaniker") || b.includes("Konstruktionsmechaniker") ||
      b.includes("Werkzeugmechaniker") || b.includes("Zerspanungsmechaniker") ||
      b.includes("Anlagenmechaniker") || b.includes("Verfahrensmechaniker") ||
      b.includes("Maschinen- und Anlagenführer") || b.includes("Fachkraft für Metalltechnik") ||
      b.includes("Chemie") || b.includes("Pharmakant")
    ),
  },
  {
    group: "🔧 Handwerk",
    berufe: AUSBILDUNGSBERUFE.filter((b) =>
      !b.includes("kaufmann") && !b.includes("Kaufmann") &&
      !b.includes("Fachinformatiker") && !b.includes("IT-") &&
      !b.includes("Elektroniker") && !b.includes("Mechatroniker") &&
      !b.includes("mechaniker") && !b.includes("Chemie") &&
      !b.includes("Pharmakant") && !b.includes("medizinische") &&
      !b.includes("pfleger") && !b.includes("therapeut") &&
      !b.includes("Verwaltung") && !b.includes("Steuer") &&
      !b.includes("Rechtsanwalt") && !b.includes("Notar")
    ),
  },
  {
    group: "🏥 Gesundheit & Soziales",
    berufe: AUSBILDUNGSBERUFE.filter((b) =>
      b.includes("medizinische") || b.includes("pfleger") ||
      b.includes("therapeut") || b.includes("Logopäde") ||
      b.includes("Notfallsanitäter") || b.includes("Hebamme") ||
      b.includes("Diätassistent")
    ),
  },
  {
    group: "📋 Verwaltung & Sonstige",
    berufe: AUSBILDUNGSBERUFE.filter((b) =>
      b.includes("Verwaltung") || b.includes("Steuer") ||
      b.includes("Rechtsanwalt") || b.includes("Notar") ||
      b.includes("Justiz") || b.includes("Beamter") ||
      b.includes("Sozialversicherung") || b.includes("Arbeitsmarkt")
    ),
  },
];
