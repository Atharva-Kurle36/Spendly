"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrainCircuit, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const gmailPattern = /^[^\s@]+@gmail\.com$/i;

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => { if (!loading && user) router.replace("/app"); }, [loading, router, user]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (mode === "register" && !name.trim()) return setFeedback({ type: "error", text: "Please enter your name." });
    if (!cleanEmail) return setFeedback({ type: "error", text: "Please enter your Gmail address." });
    if (!gmailPattern.test(cleanEmail)) return setFeedback({ type: "error", text: "Please use a valid @gmail.com address." });
    if (!password) return setFeedback({ type: "error", text: "Please enter a password." });
    if (mode === "register" && password.length < 8) return setFeedback({ type: "error", text: "Password must be at least 8 characters." });
    
    const result = mode === "login" 
      ? await login(cleanEmail, password) 
      : await register(name.trim(), cleanEmail, password);
      
    setFeedback({ type: result.ok ? "success" : "error", text: result.message });
    if (result.ok) setTimeout(() => router.replace("/app"), 450);
  };

  return (
    <main className="min-h-screen bg-paper text-ink font-body flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2.5 font-display font-bold text-xl mb-8">
          <span className="w-10 h-10 bg-gradient-to-br from-mint to-deepmint rounded-xl flex items-center justify-center shadow-lg shadow-mint/20"><BrainCircuit className="w-5 h-5 text-white" /></span>
          Spendly
        </Link>
        <section className="bg-white rounded-3xl border border-ink/5 shadow-[0_20px_60px_rgb(0,0,0,0.06)] p-7 md:p-9">
          <div className="text-center mb-7"><h1 className="font-display text-3xl font-bold">Welcome to Spendly</h1><p className="text-ink/55 mt-2">Your money should explain itself.</p></div>
          <div className="grid grid-cols-2 bg-paper rounded-xl p-1 mb-7">
            {(["login", "register"] as const).map((item) => <button key={item} type="button" onClick={() => { setMode(item); setFeedback(null); }} className={`py-2.5 rounded-lg text-sm font-bold capitalize transition-colors ${mode === item ? "bg-white text-mint shadow-sm" : "text-ink/50"}`}>{item}</button>)}
          </div>
          <form onSubmit={submit} className="space-y-4" noValidate>
            {mode === "register" && <label className="block text-sm font-semibold">Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-ink/10 px-4 py-3 font-normal outline-none focus:border-mint" placeholder="Your name" /></label>}
            <label className="block text-sm font-semibold">Gmail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-ink/10 px-4 py-3 font-normal outline-none focus:border-mint" placeholder="you@gmail.com" /></label>
            <label className="block text-sm font-semibold">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-ink/10 px-4 py-3 font-normal outline-none focus:border-mint" placeholder={mode === "register" ? "At least 8 characters" : "Your password"} /></label>
            {feedback && <div className={`rounded-xl px-4 py-3 text-sm ${feedback.type === "success" ? "bg-mint/10 text-deepmint" : "bg-coral/10 text-coral"}`}>{feedback.type === "success" && <CheckCircle2 className="inline w-4 h-4 mr-1" />}{feedback.text}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-mint to-deepmint text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-mint/20 transition-all">{mode === "login" ? "Login" : "Create Account"}<ArrowRight className="w-4 h-4" /></button>
          </form>
          <p className="text-center text-xs text-ink/40 mt-6">Use your Gmail address to keep your SmartWallet account secure.</p>
        </section>
      </div>
    </main>
  );
}