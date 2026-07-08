import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Azubi-Wars — Gamified Lernen für die Ausbildung",
  description:
    "Azubi-Wars macht Ausbildung so süchtig wie ein Spiel. Löse Quiz-Aufgaben, sammle XP und steige im Rang auf – vom Neuling bis zum Ausbilder.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-[#0f0f13] relative">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
