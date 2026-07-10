import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Azubi-Wars",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 text-sm text-gray-300 leading-relaxed">
      <h1 className="text-2xl font-bold text-gray-100">Impressum</h1>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">Angaben gemäß § 5 TMG</h2>
        <p>
          <strong>Moritz Knieper</strong><br />
          Schladerweg 24<br />
          58809 Neuenrade<br />
          Deutschland
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">Kontakt</h2>
        <p>
          E-Mail: <a href="mailto:azubiwars@gmail.com" className="text-[#D6462A] hover:underline">azubiwars@gmail.com</a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">Haftungsausschluss</h2>
        <p className="text-gray-400">
          Dieses Projekt entstand im Rahmen des „Azubi Train Hackathon" als Prototyp. Die Inhalte (insb. Prüfungsfragen) wurden mit KI-Unterstützung generiert und erheben keinen Anspruch auf fachliche Richtigkeit. Für die Richtigkeit der dargestellten IHK-Prüfungsinhalte wird keine Gewähr übernommen.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-200">Haftung für Links</h2>
        <p className="text-gray-400">
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
        </p>
      </section>

      <div className="pt-4 border-t border-white/10">
        <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Zurück zur Startseite</a>
      </div>
    </div>
  );
}
