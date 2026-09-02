"use client";

import Link from 'next/link';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <header className="p-6 border-b border-ink/5">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ink/70 hover:text-ink transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-mint" />
            SmartWallet AI
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-20 space-y-12">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">The invisible drain of digital payments</h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            In the era of UPI and frictionless digital payments, it's never been easier to spend money. But this frictionlessness has a cost: we lose awareness of where our money goes. Small, frequent transactions bleed budgets dry before we even realize it.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-ink/5 p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">How SmartWallet AI Works</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-center justify-between">
            <div className="flex-1">
              <div className="font-mono text-sm bg-ink/5 py-2 px-4 rounded mb-4">₹180 Coffee</div>
              <div className="text-sm font-semibold uppercase text-ink/50 mb-1">Raw Transaction</div>
            </div>
            
            <div className="hidden md:block w-8 h-px bg-ink/20" />
            
            <div className="flex-1">
              <div className="font-bold text-lg text-ink mb-4">14 similar transactions</div>
              <div className="text-sm font-semibold uppercase text-ink/50 mb-1">Pattern Identified</div>
            </div>

            <div className="hidden md:block w-8 h-px bg-ink/20" />

            <div className="flex-1">
              <div className="font-bold text-lg text-coral mb-4">27% above baseline</div>
              <div className="text-sm font-semibold uppercase text-ink/50 mb-1">Context Applied</div>
            </div>

            <div className="hidden md:block w-8 h-px bg-ink/20" />

            <div className="flex-1">
              <div className="font-bold text-lg text-mint mb-4">Create ₹450 weekly cap</div>
              <div className="text-sm font-semibold uppercase text-ink/50 mb-1">Actionable Insight</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
