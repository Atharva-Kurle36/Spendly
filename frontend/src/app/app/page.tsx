"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity, Wallet, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function DashboardOverview() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Financial Overview</h1>
          <p className="text-ink/60 mt-1">September 2026</p>
        </div>
        <button className="bg-mint text-white px-5 py-2.5 rounded-lg font-medium hover:bg-deepmint transition-colors shadow-sm shadow-mint/20">
          + Quick Add
        </button>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-2">Total Balance</div>
          <div className="font-display text-3xl font-bold mb-4">₹142,500</div>
          <div className="flex items-center gap-2 text-sm text-mint font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-2">Total Spent</div>
          <div className="font-display text-3xl font-bold mb-4">₹24,820</div>
          <div className="flex items-center gap-2 text-sm text-coral font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+4.2% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Financial Health</div>
            <span className="bg-amber/10 text-amber-900 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Watch</span>
          </div>
          <div className="font-display text-3xl font-bold mb-4 text-amber-900">72/100</div>
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <Activity className="w-4 h-4" />
            <span>Budget usage high</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Insight Highlight */}
          <div className="bg-amber/5 border border-amber/20 rounded-2xl p-6 flex gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm shrink-0 h-min">
              <Sparkles className="w-6 h-6 text-amber" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-amber-900">Unusual Activity Detected</h3>
                <span className="text-xs bg-amber text-white px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              <p className="text-amber-900/80 mb-3">
                "₹4,800 at Amazon is 3.4× higher than your typical shopping transaction."
              </p>
              <button className="text-sm font-medium text-amber-900 bg-white border border-amber/20 px-4 py-2 rounded-lg hover:bg-amber/10 transition-colors">
                Review Transaction
              </button>
            </div>
          </div>

          {/* Spending Trend (Placeholder for Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm min-h-[300px] flex flex-col">
            <h3 className="font-bold text-lg mb-6">Spending Trend</h3>
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-ink/5 rounded-xl bg-paper/50">
              <span className="text-ink/40 font-medium">[ Interactive Chart Area ]</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Recent Transactions</h3>
              <button className="text-sm font-medium text-mint hover:text-deepmint transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              {/* Transaction Item */}
              <div className="flex items-center justify-between p-4 hover:bg-paper/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-ink/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center font-bold text-ink/70">S</div>
                  <div>
                    <div className="font-bold">Swiggy</div>
                    <div className="text-sm text-ink/50">Food & Dining • Today, 2:14 PM</div>
                  </div>
                </div>
                <div className="font-display font-bold text-lg">₹420.00</div>
              </div>

              {/* Transaction Item */}
              <div className="flex items-center justify-between p-4 hover:bg-paper/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-ink/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center font-bold text-ink/70">A</div>
                  <div>
                    <div className="font-bold">Amazon</div>
                    <div className="text-sm text-ink/50">Shopping • Yesterday</div>
                  </div>
                </div>
                <div className="font-display font-bold text-lg">₹4,800.00</div>
              </div>
              
            </div>
          </div>

        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-8">
          
          {/* Budget Health */}
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Budget Health</h3>
              <button className="text-ink/40 hover:text-ink transition-colors"><TrendingUp className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-6">
              {/* Budget Item */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="font-medium">Food & Dining</div>
                  <div className="text-sm text-coral font-bold">82% Used</div>
                </div>
                <div className="w-full bg-ink/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-coral h-full w-[82%]" />
                </div>
                <div className="text-xs text-ink/50 mt-2 text-right">₹5,820 / ₹7,000</div>
              </div>

              {/* Budget Item */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="font-medium">Shopping</div>
                  <div className="text-sm text-amber font-bold">68% Used</div>
                </div>
                <div className="w-full bg-ink/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber h-full w-[68%]" />
                </div>
                <div className="text-xs text-ink/50 mt-2 text-right">₹6,800 / ₹10,000</div>
              </div>

               {/* Budget Item */}
               <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="font-medium">Transport</div>
                  <div className="text-sm text-mint font-bold">24% Used</div>
                </div>
                <div className="w-full bg-ink/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-mint h-full w-[24%]" />
                </div>
                <div className="text-xs text-ink/50 mt-2 text-right">₹1,200 / ₹5,000</div>
              </div>
            </div>
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              Upcoming Bills <span className="bg-ink text-white text-xs px-2 py-0.5 rounded-full">2</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-ink/5 pb-4">
                <div>
                  <div className="font-bold">Netflix</div>
                  <div className="text-sm text-amber font-medium">Renews in 4 days</div>
                </div>
                <div className="font-display font-bold">₹649</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">Electricity</div>
                  <div className="text-sm text-ink/50">Due in 7 days</div>
                </div>
                <div className="font-display font-bold">₹1,820</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
