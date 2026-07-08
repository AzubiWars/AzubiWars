import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks["GEMINI_API_KEY"] = process.env.GEMINI_API_KEY ? "✅ gesetzt" : "❌ fehlt";
  checks["FIREBASE_SERVICE_ACCOUNT"] = process.env.FIREBASE_SERVICE_ACCOUNT
    ? "✅ gesetzt"
    : "❌ fehlt";
  checks["NEXT_PUBLIC_FIREBASE_PROJECT_ID"] = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? "✅ " + process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    : "❌ fehlt";

  // Check Firestore connectivity
  try {
    const { getDb } = await import("@/lib/firestore");
    const db = getDb();
    // Try to write and read a test doc
    const testRef = db.collection("_health_check").doc("test");
    await testRef.set({ timestamp: new Date().toISOString() });
    const doc = await testRef.get();
    if (doc.exists) {
      checks["Firestore"] = "✅ Verbindung OK (lesen & schreiben)";
      await testRef.delete();
    } else {
      checks["Firestore"] = "⚠️ Schreiben OK, aber lesen fehlgeschlagen";
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Ganze Fehlermeldung zeigen
    checks["Firestore"] = `❌ ${msg}`;
    if (msg.includes("NOT_FOUND")) {
      checks["HILFE"] = "Firestore-Datenbank existiert nicht! Gehe zu Firebase Console → Firestore Database → Datenbank erstellen (Native Mode, eur3, Testmodus)";
    }
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    checks,
  });
}
