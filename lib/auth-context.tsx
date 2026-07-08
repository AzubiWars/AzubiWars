"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  registerWithEmail,
  loginWithEmail,
  logoutUser,
  onAuthChange,
} from "./firebase-client";
import type { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  register: async () => { throw new Error("AuthProvider not mounted"); },
  login: async () => { throw new Error("AuthProvider not mounted"); },
  logout: async () => { throw new Error("AuthProvider not mounted"); },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((fbUser) => {
      setUser(fbUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (email: string, password: string) => {
    const newUser = await registerWithEmail(email, password);
    setUser(newUser);
    return newUser;
  };

  const login = async (email: string, password: string) => {
    const loggedIn = await loginWithEmail(email, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const logout = async () => {
    await logoutUser();
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
