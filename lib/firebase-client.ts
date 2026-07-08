import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjHfRkpz15FoBLm5DDP9e2782Sz-TBbZY",
  authDomain: "azubi-wars.firebaseapp.com",
  projectId: "azubi-wars",
  storageBucket: "azubi-wars.firebasestorage.app",
  messagingSenderId: "524920752780",
  appId: "1:524920752780:web:a0f49ab2a667f952a2c9a9",
};

function getApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}

let _auth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

export async function registerWithEmail(
  email: string,
  password: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}
