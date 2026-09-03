"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { User, Mail, DollarSign, Trash2, LogOut, ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api-client";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [salary, setSalary] = useState("100000");
  const [saved, setSaved] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("monthlySalary") || localStorage.getItem("smartwallet_salary");
    if (stored) setSalary(stored);
  }, []);

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("monthlySalary", salary);
    localStorage.setItem("smartwallet_salary", salary);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = async () => {
    if (!confirm("Are you sure you want to wipe all your transactions, budgets, bills, and insights? This action cannot be undone.")) {
      return;
    }

    setIsWiping(true);
    try {
      await api.delete("/transactions");
      alert("All user data has been successfully reset!");
      window.location.href = "/app";
    } catch (err: any) {
      alert(err?.message || "Failed to reset data.");
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-ink/60 mt-1">Manage your account preferences and application settings.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Card */}
        <section className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-mint" /> User Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-paper/50 rounded-xl border border-ink/5">
              <span className="text-xs text-ink/50 uppercase font-semibold">Account Name</span>
              <p className="font-bold text-ink mt-0.5">{user?.name || "SmartWallet User"}</p>
            </div>
            <div className="p-4 bg-paper/50 rounded-xl border border-ink/5">
              <span className="text-xs text-ink/50 uppercase font-semibold">Registered Gmail</span>
              <p className="font-bold text-ink mt-0.5">{user?.email || "user@gmail.com"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-mint font-medium pt-1">
            <ShieldCheck className="w-4 h-4" /> End-to-end data isolation active on Cloudflare D1
          </div>
        </section>

        {/* Monthly Income Settings */}
        <section className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-mint" /> Default Monthly Income
          </h2>
          <p className="text-sm text-ink/60">
            This value is used to calculate your Health Score and budget distribution across categories.
          </p>
          <form onSubmit={handleSaveSalary} className="flex gap-4 items-center pt-2">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-bold">₹</span>
              <input 
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="100000"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all font-bold"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-mint text-white px-6 py-3 rounded-xl font-bold hover:bg-deepmint transition-all shadow-sm shadow-mint/20 flex items-center gap-2"
            >
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : "Update Income"}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-white p-6 rounded-2xl border border-coral/20 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-coral flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Reset Demo Data
          </h2>
          <p className="text-sm text-ink/60">
            Wipes all imported transactions, auto-pilot bills, budgets, and AI insights for this account so you can demo a fresh upload.
          </p>
          <button 
            type="button"
            onClick={handleResetData}
            disabled={isWiping}
            className="bg-coral/10 text-coral hover:bg-coral hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isWiping ? "Resetting..." : "Reset All Data"}
          </button>
        </section>

        {/* Sign Out */}
        <section className="pt-2">
          <button 
            onClick={signOut}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-ink/10 text-ink/70 hover:text-ink hover:bg-ink/5 font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </section>
      </div>
    </div>
  );
}
