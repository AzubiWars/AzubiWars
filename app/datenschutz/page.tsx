import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Azubi-Wars",
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 text-sm text-gray-300 leading-relaxed">
      <h1 className="text-2xl font-bold text-gray-100">Datenschutzerklärung</h1>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">1. Verantwortlicher</h2>
        <p>
          Moritz Knieper<br />
          Schladerweg 24, 58809 Neuenrade<br />
          E-Mail: azubiwars@gmail.com
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">2. Welche Daten wir erheben</h2>
        <p>Bei Nutzung von Azubi-Wars werden folgende Daten verarbeitet:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li><strong>Account-Daten:</strong> E-Mail-Adresse (für Login/Registrierung), selbst gewählter Nickname</li>
          <li><strong>Spiel-Daten:</strong> Gesammelte XP, beantwortete Fragen, richtige/falsche Antworten, Streaks, Rang</li>
          <li><strong>Community-Inhalte:</strong> Selbst erstellte Prüfungsfragen (freiwillig)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">3. Zweck der Datenverarbeitung</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li>Bereitstellung des Login-/Registrierungssystems</li>
          <li>Speicherung des Spielfortschritts (XP, Rang, Streaks)</li>
          <li>Darstellung der globalen Rangliste (nur Nickname, XP, Rang)</li>
          <li>Community-Features (von Nutzern erstellte Fragen)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">4. Rechtsgrundlage</h2>
        <p className="text-gray-400">
          Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Registrierung)
          sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung der Spielfunktionen).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">5. Dienste von Drittanbietern</h2>
        <div className="space-y-3 text-gray-400">
          <div>
            <strong className="text-gray-300">Firebase (Google LLC, USA)</strong>
            <p>Für Authentifizierung (Firebase Auth) und Datenspeicherung (Firestore). Firebase ist ein Dienst der Google LLC. Die Daten werden auf Servern in der EU (eur3) gespeichert. Google ist unter dem EU-US Data Privacy Framework zertifiziert. <a href="https://policies.google.com/privacy" className="text-[#D6462A] hover:underline" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Google</a></p>
          </div>
          <div>
            <strong className="text-gray-300">Vercel Inc. (USA)</strong>
            <p>Hosting der Website. Vercel verarbeitet Zugriffsdaten (IP-Adresse, Browser-Typ) zur Bereitstellung der Website. <a href="https://vercel.com/legal/privacy-policy" className="text-[#D6462A] hover:underline" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Vercel</a></p>
          </div>
          <div>
            <strong className="text-gray-300">Google Gemini API</strong>
            <p>Für die KI-generierung neuer Prüfungsfragen (optional, nur über den Admin-Bereich). Es werden keine Nutzerdaten an die API übermittelt.</p>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">6. Speicherdauer</h2>
        <p className="text-gray-400">
          Account-Daten werden gespeichert, solange der Account besteht. Mit Löschung des Accounts werden alle personenbezogenen Daten gelöscht. Spielfortschritts-Daten bleiben anonymisiert in aggregierter Form erhalten.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">7. Deine Rechte</h2>
        <p className="text-gray-400">
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
          Einschränkung der Verarbeitung (Art. 18 DSGVO) und Datenübertragbarkeit (Art. 20 DSGVO).
          Zur Ausübung deiner Rechte schreibe an: azubiwars@gmail.com
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">8. Keine Cookies?</h2>
        <p className="text-gray-400">
          Azubi-Wars verwendet keine Tracking-Cookies. Firebase Auth speichert einen technisch notwendigen Session-Token
          im Browser (localStorage), der für den Login erforderlich ist (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <div className="pt-4 border-t border-white/10">
        <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Zurück zur Startseite</a>
      </div>
    </div>
  );
}
