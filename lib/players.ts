import { getDb } from "./firestore";

const COLLECTION = "players";

export interface Player {
  id: string;
  nickname: string;
  xpGesamt: number;
  beantwortet: number;
  richtig: number;
  aktuelleStreak: number;
  besteStreak: number;
  teamCode?: string;
  zuletztAktiv: string;
}

export async function getOrCreatePlayer(nickname: string): Promise<Player> {
  const db = getDb();

  // Suche existierenden Spieler per Nickname
  const snapshot = await db
    .collection(COLLECTION)
    .where("nickname", "==", nickname)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0]!;
    const player = doc.data() as Player;
    // Update zuletztAktiv
    await doc.ref.update({ zuletztAktiv: new Date().toISOString() });
    return { ...player, zuletztAktiv: new Date().toISOString() };
  }

  // Neuen Spieler anlegen
  const newPlayer: Player = {
    id: crypto.randomUUID(),
    nickname,
    xpGesamt: 0,
    beantwortet: 0,
    richtig: 0,
    aktuelleStreak: 0,
    besteStreak: 0,
    zuletztAktiv: new Date().toISOString(),
  };

  await db.collection(COLLECTION).doc(newPlayer.id).set(newPlayer);
  return newPlayer;
}

export async function updatePlayerStats(
  playerId: string,
  xpGained: number,
  wasCorrect: boolean
): Promise<Player> {
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(playerId);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error(`Spieler ${playerId} nicht gefunden.`);
  }

  const player = doc.data() as Player;
  const neueStreak = wasCorrect ? player.aktuelleStreak + 1 : 0;

  const updates: Partial<Player> = {
    xpGesamt: player.xpGesamt + xpGained,
    beantwortet: player.beantwortet + 1,
    richtig: player.richtig + (wasCorrect ? 1 : 0),
    aktuelleStreak: neueStreak,
    besteStreak: Math.max(player.besteStreak, neueStreak),
    zuletztAktiv: new Date().toISOString(),
  };

  await ref.update(updates);
  return { ...player, ...updates };
}

export async function getLeaderboard(limit = 50): Promise<Player[]> {
  const db = getDb();
  const snapshot = await db
    .collection(COLLECTION)
    .orderBy("xpGesamt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Player);
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
  const db = getDb();
  const doc = await db.collection(COLLECTION).doc(playerId).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as Player;
}
