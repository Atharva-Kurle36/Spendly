"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BrainCircuit, Activity, ShieldAlert, Sparkles,
  TrendingUp, Wallet, Receipt, Target, PieChart, Bell,
  Upload, Zap, Lock, Globe, ChevronRight, Star,
  Mail, Heart, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import WalletScrollReveal from '@/components/landing/WalletScrollReveal';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState('');
  const [demoStage, setDemoStage] = useState(0);

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
      }, 4000);
    }
  };

  const resetDemo = () => {
    setDemoInput('');
    setDemoStage(0);
  };

  return (
    <div className="landing-page min-h-screen bg-paper text-ink font-body selection:bg-mint selection:text-white">
      {/* Header for Landing Page */}
      <header className="absolute top-0 left-0 right-0 p-5 px-8 flex justify-between items-center z-[90]">
        <Link href="/" className="font-display font-bold text-xl tracking-tight flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-gradient-to-br from-mint to-deepmint rounded-xl flex items-center justify-center shadow-lg shadow-mint/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          Spendly
        </Link>
        <div>
          <Link href="/auth" className="bg-gradient-to-r from-ink to-ink/90 text-paper px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-ink/20 transition-all hover:-translate-y-0.5 font-semibold text-sm">
            Enter App
          </Link>
        </div>
      </header>
      {/* Hero Section */}
      <main className="pt-36 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto mb-20 space-y-8"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 bg-mint/10 text-deepmint px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              AI-Powered Financial Intelligence
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            YOUR MONEY <br />
            <span className="bg-gradient-to-r from-mint to-deepmint bg-clip-text text-transparent">SHOULD EXPLAIN ITSELF.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed">
            Traditional expense trackers just show you history. Spendly actively analyzes your behavior, detects spending leaks, and predicts financial impacts <span className="font-semibold text-ink/80">before they happen.</span>
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link href="/auth" className="group bg-gradient-to-r from-mint to-deepmint text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-mint/30 transition-all hover:-translate-y-1 flex items-center gap-3">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="group text-ink/70 hover:text-ink px-8 py-4 rounded-2xl font-semibold text-lg transition-colors flex items-center gap-2 border border-ink/10 hover:border-ink/20 hover:bg-ink/5">
              Watch Demo
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mb-24 text-ink/40 text-sm"
        >
          <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> Bank-Grade Encryption</div>
          <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Works with Any Bank</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Real-time Analysis</div>
          <div className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Privacy First</div>
        </motion.div>

        {/* Interactive Demo Section */}
        <div id="demo" className="max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-ink/5 p-8 md:p-10 relative overflow-hidden mb-32">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mint via-deepmint to-mint" />
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-bold text-ink/40 uppercase tracking-widest">Live AI Pipeline Demo</div>
            {demoStage > 0 && (
              <button onClick={resetDemo} className="text-xs text-mint hover:text-deepmint font-semibold transition-colors">Reset Demo</button>
            )}
          </div>

          <form onSubmit={handleDemoSubmit} className="relative">
            <input
              type="text"
              placeholder="Try: ₹420 Swiggy dinner"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              className="w-full bg-paper border border-ink/10 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint/30 transition-all"
              disabled={demoStage > 0}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-ink to-ink/90 text-paper px-6 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
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
                <div className="w-full bg-deepmint/10 h-2.5 rounded-full overflow-hidden mt-3">
                  <motion.div
                    initial={{ width: '76%' }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-deepmint to-mint h-full rounded-full"
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
                <div className="bg-white p-2.5 rounded-full shadow-sm shrink-0 mt-0.5">
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
        {/* Interactive Demo Section End */}

        {/* Wallet Scrollytelling Section */}
        <section id="how-it-works" className="-mx-6 md:mx-auto">
          <WalletScrollReveal />
        </section>

        {/* Features Section */}
        <section id="features" className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="text-sm font-bold text-mint uppercase tracking-widest">Core Features</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Everything Your Wallet Needs
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-ink/60 text-lg max-w-2xl mx-auto mt-4">
              More than just tracking — Spendly understands, predicts, and protects your finances with AI at every step.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Activity, color: 'mint', title: 'Spending Leak Detector', desc: 'Identifies patterns of small, frequent purchases that quietly drain your budget over time.' },
              { icon: TrendingUp, color: 'amber', title: 'What Changed?', desc: 'Instantly compare your monthly habits against historical baselines to see exactly where money went.' },
              { icon: ShieldAlert, color: 'coral', title: 'Predictive Warnings', desc: 'Get alerted before you break your budget based on spending velocity, not after the fact.' },
              { icon: Upload, color: 'deepmint', title: 'Smart Statement Import', desc: 'Upload any bank statement PDF — our AI extracts, categorizes, and creates budgets automatically.' },
              { icon: PieChart, color: 'mint', title: 'Auto-Pilot Budgets', desc: 'AI analyzes your income and spending patterns to create optimized budget allocations for you.' },
              { icon: Bell, color: 'amber', title: 'Bill Reminders', desc: 'Never miss a payment. Track recurring bills and get timely notifications before due dates.' },
              { icon: Target, color: 'coral', title: 'Savings Goals', desc: 'Set financial targets, track progress, and get AI-powered suggestions to reach them faster.' },
              { icon: Receipt, color: 'deepmint', title: 'Transaction Intelligence', desc: 'Every transaction is enriched with category, merchant insights, and anomaly detection.' },
              { icon: Wallet, color: 'mint', title: 'Financial Health Score', desc: 'A dynamic 0-100 score showing your overall financial wellness updated in real-time.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="group bg-white rounded-2xl p-7 border border-ink/5 hover:border-mint/20 hover:shadow-xl hover:shadow-mint/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-${feature.color}/10 text-${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-ink/60 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="text-sm font-bold text-amber uppercase tracking-widest">How It Works</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Three Steps to Financial Clarity
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { step: '01', title: 'Connect & Import', desc: 'Upload your bank statement PDF or manually add transactions. Our AI handles the rest — parsing, categorizing, and structuring all your data.', icon: Upload },
              { step: '02', title: 'AI Analyzes Everything', desc: 'Spendly\'s engine runs anomaly detection, budget forecasting, and spending velocity analysis on every single transaction in real-time.', icon: BrainCircuit },
              { step: '03', title: 'Get Actionable Insights', desc: 'Receive personalized AI observations, predictive alerts, and one-tap actions to optimize your spending before problems arise.', icon: Sparkles },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="relative">
                <div className="bg-white rounded-3xl p-8 border border-ink/5 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="font-display text-6xl font-black text-ink/5 mb-4">{item.step}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-mint to-deepmint rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-mint/20">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-ink/60 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ChevronRight className="w-8 h-8 text-ink/10" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="bg-gradient-to-br from-ink via-ink to-ink/95 rounded-3xl p-10 md:p-16 text-paper relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(47,163,107,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(231,165,43,0.1),transparent_50%)]" />

            <div className="relative z-10">
              <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
                <span className="text-mint text-sm font-bold uppercase tracking-widest">Why Spendly</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 tracking-tight text-white">
                  Numbers That Speak
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '₹2.4L', label: 'Average savings per user/year', sublabel: 'detected leaks' },
                  { value: '< 3s', label: 'AI processing time', sublabel: 'per statement' },
                  { value: '99.2%', label: 'Categorization accuracy', sublabel: 'AI-powered' },
                  { value: '24/7', label: 'Financial monitoring', sublabel: 'always watching' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                    <div className="font-display text-3xl md:text-5xl font-black bg-gradient-to-r from-mint to-amber bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-paper/70 text-sm mt-2 font-medium">{stat.label}</div>
                    <div className="text-paper/40 text-xs mt-1">{stat.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials / Use Cases */}
        <section className="mb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="text-sm font-bold text-coral uppercase tracking-widest">Built For Everyone</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Who Uses Spendly?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                emoji: '🎓',
                title: 'Students',
                desc: 'Track pocket money, split expenses with roommates, and build financial habits early with AI guidance.',
                features: ['Budget tracking', 'Spending alerts', 'Savings goals']
              },
              {
                emoji: '💼',
                title: 'Working Professionals',
                desc: 'Manage salary, bills, investments, and subscriptions — all in one intelligent dashboard.',
                features: ['Bill reminders', 'Income analysis', 'Tax-ready reports']
              },
              {
                emoji: '👨‍👩‍👧‍👦',
                title: 'Families',
                desc: 'Track household expenses, plan for big purchases, and ensure everyone stays within budget.',
                features: ['Family budgets', 'Goal planning', 'Predictive insights']
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-3xl p-8 border border-ink/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-ink/60 leading-relaxed text-sm mb-5">{card.desc}</p>
                <div className="space-y-2">
                  {card.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-ink/70">
                      <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-mint via-deepmint to-mint rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Ready to Take Control of Your Finances?
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                Join Spendly today and let AI do the heavy lifting. Start in seconds, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/app" className="group bg-white text-deepmint px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3 justify-center">
                  Launch Spendly
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2 justify-center">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer-main" className="bg-ink text-paper/70 border-t border-ink/10">
        <div id="footer-container" className="max-w-7xl mx-auto px-8 py-16">
          {/* Top Footer */}
          <div id="footer-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
            {/* Brand Column */}
            <div id="footer-brand" className="space-y-5 lg:col-span-1">
              <div id="footer-logo" className="font-display font-bold text-xl text-white flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-mint to-deepmint rounded-xl flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                Spendly
              </div>
              <p id="footer-tagline" className="text-paper/50 text-sm leading-relaxed max-w-xs">
                AI-powered financial intelligence that helps you understand, predict, and optimize your spending habits.
              </p>
              <div id="footer-socials" className="flex gap-3">
                <a id="footer-github" href="https://github.com/Atharva-Kurle36/Spendly" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-paper/5 font-bold text-xs hover:bg-mint/20 hover:text-mint rounded-xl flex items-center justify-center transition-all">
                  GH
                </a>
                <a id="footer-twitter" href="https://twitter.com/spendly_ai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-paper/5 font-bold text-xs hover:bg-mint/20 hover:text-mint rounded-xl flex items-center justify-center transition-all">
                  X
                </a>
                <a id="footer-email" href="mailto:team@spendly.ai" className="w-10 h-10 bg-paper/5 hover:bg-mint/20 hover:text-mint rounded-xl flex items-center justify-center transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div id="footer-product">
              <h4 id="footer-product-title" className="font-bold text-white text-sm uppercase tracking-widest mb-5">Product</h4>
              <ul id="footer-product-links" className="space-y-3 text-sm">
                <li><a id="footer-link-features" href="#features" className="hover:text-mint transition-colors">Features</a></li>
                <li><a id="footer-link-how-it-works" href="#how-it-works" className="hover:text-mint transition-colors">How It Works</a></li>
                <li><a id="footer-link-demo" href="#demo" className="hover:text-mint transition-colors">Live Demo</a></li>
                <li><Link id="footer-link-dashboard" href="/app" className="hover:text-mint transition-colors">Dashboard</Link></li>
                <li><Link id="footer-link-transactions" href="/app/transactions" className="hover:text-mint transition-colors">Transactions</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div id="footer-resources">
              <h4 id="footer-resources-title" className="font-bold text-white text-sm uppercase tracking-widest mb-5">Resources</h4>
              <ul id="footer-resources-links" className="space-y-3 text-sm">
                <li><Link id="footer-link-about" href="/about" className="hover:text-mint transition-colors">About Us</Link></li>
                <li><a id="footer-link-docs" href="#" className="hover:text-mint transition-colors">Documentation</a></li>
                <li><a id="footer-link-api" href="#" className="hover:text-mint transition-colors">API Reference</a></li>
                <li><a id="footer-link-privacy" href="#" className="hover:text-mint transition-colors">Privacy Policy</a></li>
                <li><a id="footer-link-terms" href="#" className="hover:text-mint transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div id="footer-techstack">
              <h4 id="footer-techstack-title" className="font-bold text-white text-sm uppercase tracking-widest mb-5">Tech Stack</h4>
              <ul id="footer-techstack-list" className="space-y-3 text-sm">
                <li id="footer-tech-nextjs" className="flex items-center gap-2"><span className="w-2 h-2 bg-mint rounded-full" /> Next.js 16 (App Router)</li>
                <li id="footer-tech-cf-workers" className="flex items-center gap-2"><span className="w-2 h-2 bg-amber rounded-full" /> Cloudflare Workers</li>
                <li id="footer-tech-hono" className="flex items-center gap-2"><span className="w-2 h-2 bg-coral rounded-full" /> Hono Framework</li>
                <li id="footer-tech-d1" className="flex items-center gap-2"><span className="w-2 h-2 bg-mint rounded-full" /> Cloudflare D1 (SQLite)</li>
                <li id="footer-tech-openrouter" className="flex items-center gap-2"><span className="w-2 h-2 bg-amber rounded-full" /> OpenRouter AI</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div id="footer-bottom" className="border-t border-paper/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p id="footer-copyright" className="text-paper/40 text-sm">
                © 2026 Spendly — NEXORA Hackathon. All rights reserved.
              </p>
              <p id="footer-credit" className="text-paper/40 text-sm flex items-center gap-1.5">
                Built with <Heart className="w-3.5 h-3.5 text-coral fill-coral" /> by Team Spendly
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
