"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { name: string; email: string };
type StoredUser = User & { password: string };
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  login: (email: string, password: string) => { ok: boolean; message: string };
  signOut: () => void;
};

const USERS_KEY = "smartwallet-users";
const SESSION_KEY = "smartwallet-session";
const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem(SESSION_KEY) || "null")); } catch { setUser(null); }
    setLoading(false);
  }, []);

  const register = (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.some((item) => item.email === email)) return { ok: false, message: "An account with this Gmail already exists." };
    const newUser = { name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
    setUser({ name, email });
    return { ok: true, message: "Account created successfully." };
  };

  const login = (email: string, password: string) => {
    const account = readUsers().find((item) => item.email === email && item.password === password);
    if (!account) return { ok: false, message: "The Gmail or password is incorrect." };
    const session = { name: account.name, email: account.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true, message: "Logged in successfully." };
  };

  const signOut = () => { localStorage.removeItem(SESSION_KEY); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, register, login, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}