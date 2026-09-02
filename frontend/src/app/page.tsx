"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BrainCircuit, Activity, ShieldAlert, Sparkles, Receipt, Wallet, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState('');
  const [demoStage, setDemoStage] = useState(0); // 0: input, 1: structured, 2: budget impact, 3: AI insight

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoInput.toLowerCase().includes('420') || demoInput.toLowerCase().includes('swiggy')) {
      setDemoStage(1);
      setTimeout(() => setDemoStage(2), 1500);
      setTimeout(() => setDemoStage(3), 3000);
    } else if (demoInput.trim() !== '') {
      setDemoStage(1);
      setTimeout(() => {
        setDemoInput('');
        setDemoStage(0);
      }, 4000); // Reset if not the demo keyword
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-body selection:bg-mint selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-paper/80 backdrop-blur-md border-b border-ink/5">
        <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-mint" />
          SmartWallet AI
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/about" className="hover:text-mint transition-colors">About</Link>
          <Link href="/app" className="bg-ink text-paper px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors">
            Enter App
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            YOUR MONEY <br />
            <span className="text-mint">SHOULD EXPLAIN ITSELF.</span>
          </h1>
          <p className="text-lg md:text-xl text-ink/70 max-w-2xl mx-auto">
            Traditional expense trackers just show you history. SmartWallet AI actively analyzes your behavior, detects leaks, and predicts financial impacts before they happen.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ink/5 p-8 relative overflow-hidden">
          <div className="text-sm font-semibold text-ink/50 uppercase tracking-widest mb-6">Live AI Pipeline Demo</div>
          
          <form onSubmit={handleDemoSubmit} className="relative">
            <input 
              type="text" 
              placeholder="e.g. ₹420 Swiggy dinner" 
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              className="w-full bg-paper border border-ink/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-mint/50 transition-all"
              disabled={demoStage > 0}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 bg-ink text-paper px-6 rounded-lg font-medium hover:bg-mint transition-colors flex items-center gap-2"
              disabled={demoStage > 0}
            >
              Analyze <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <AnimatePresence>
            {demoStage >= 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-6 border-t border-ink/5 flex gap-4"
              >
                <div className="flex-1 bg-paper rounded-xl p-4">
                  <div className="text-xs text-ink/50 uppercase mb-1">Extracted Merchant</div>
                  <div className="font-semibold text-lg">Swiggy</div>
                </div>
                <div className="flex-1 bg-paper rounded-xl p-4">
                  <div className="text-xs text-ink/50 uppercase mb-1">Category</div>
                  <div className="font-semibold text-lg">Food & Dining</div>
                </div>
                <div className="flex-1 bg-paper rounded-xl p-4">
                  <div className="text-xs text-ink/50 uppercase mb-1">Amount</div>
                  <div className="font-display font-bold text-lg">₹420.00</div>
                </div>
              </motion.div>
            )}

            {demoStage >= 2 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-deepmint/5 border border-deepmint/20 rounded-xl p-5 overflow-hidden"
              >
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-xs font-bold text-deepmint uppercase tracking-wider mb-1">Budget Impact</div>
                    <div className="text-sm text-deepmint/80">Food & Dining • ₹7,000 monthly limit</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-display font-bold text-deepmint">82% Used</div>
                    <div className="text-xs opacity-70 text-deepmint/80">₹5,820 spent</div>
                  </div>
                </div>
                <div className="w-full bg-deepmint/10 h-2 rounded-full overflow-hidden mt-3">
                  <motion.div 
                    initial={{ width: '76%' }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-deepmint h-full"
                  />
                </div>
              </motion.div>
            )}

            {demoStage >= 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 bg-amber/10 border border-amber/20 rounded-xl p-5 flex gap-4 items-start"
              >
                <div className="bg-white p-2 rounded-full shadow-sm shrink-0 mt-1">
                  <Sparkles className="w-5 h-5 text-amber" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">AI Observation: Accelerated Spending</h4>
                  <p className="text-sm text-amber-900/80 leading-relaxed mb-3">
                    You're spending 18% faster than your normal pace. At this rate, you'll exceed your Food & Dining budget in 5 days.
                  </p>
                  <button className="text-sm bg-white border border-amber/20 px-4 py-2 rounded-lg font-medium text-amber-900 hover:bg-amber/5 transition-colors">
                    Set ₹310 weekly limit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-mint/10 text-mint rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">Spending Leak Detector</h3>
            <p className="text-ink/70">Identifies patterns of small, frequent purchases that quietly drain your budget over time.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber/10 text-amber rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">What Changed?</h3>
            <p className="text-ink/70">Instantly compare your monthly habits against historical baselines to explain exactly where your money went.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-coral/10 text-coral rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">Predictive Warnings</h3>
            <p className="text-ink/70">Get alerted before you break your budget based on your unique spending velocity, not after the fact.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
