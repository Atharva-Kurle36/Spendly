"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";
import { api } from "@/lib/api-client";

type User = { name: string; email: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => void;
};

const TOKEN_KEY = "smartwallet-token";
const SESSION_KEY = "smartwallet-session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure API client to use this token for all requests
    api.setTokenProvider(async () => localStorage.getItem(TOKEN_KEY));

    try {
      const session = localStorage.getItem(SESSION_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (session && token) {
        setUser(JSON.parse(session));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { ok: false, message: data?.error?.message || "Registration failed." };
      }

      const userData = { name: data.data.user.name, email: data.data.user.email };
      localStorage.setItem(TOKEN_KEY, data.data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return { ok: true, message: "Account created successfully." };
    } catch (err: any) {
      return { ok: false, message: err.message || "Network error." };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return { ok: false, message: data?.error?.message || "Invalid email or password." };
      }

      const userData = { name: data.data.user.name, email: data.data.user.email };
      localStorage.setItem(TOKEN_KEY, data.data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return { ok: true, message: "Logged in successfully." };
    } catch (err: any) {
      return { ok: false, message: err.message || "Network error." };
    }
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, register, login, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}