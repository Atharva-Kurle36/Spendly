"use client";

import { Plus, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Budgets</h1>
          <p className="text-ink/60 mt-1">Track and predict your spending limits.</p>
        </div>
        <button className="bg-mint text-white px-5 py-2.5 rounded-lg font-medium hover:bg-deepmint transition-colors shadow-sm shadow-mint/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Budget
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-2">Total Monthly Budget</div>
          <div className="font-display text-3xl font-bold mb-4">₹45,000</div>
          <div className="text-sm text-ink/60">Across 6 active categories</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-2">Total Remaining</div>
          <div className="font-display text-3xl font-bold mb-4">₹20,180</div>
          <div className="text-sm text-ink/60">12 days left in September</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm bg-amber/5 border-amber/20">
          <div className="text-sm font-semibold text-amber-900/60 uppercase tracking-wider mb-2">Predictive Warning</div>
          <div className="font-display text-xl font-bold mb-2 text-amber-900">Projected Overspend</div>
          <div className="text-sm text-amber-900/80">At current velocity, you will exceed your total budget by ₹3,200.</div>
        </div>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Budget Item: Normal */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-bold text-lg">Transport</div>
              <div className="text-sm text-ink/50">Monthly</div>
            </div>
            <span className="bg-mint/10 text-mint px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Normal
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">₹1,200 Spent</span>
              <span className="text-ink/50">₹5,000</span>
            </div>
            <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
              <div className="bg-mint h-full w-[24%]" />
            </div>
          </div>
          <div className="text-xs text-ink/50 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> On track to finish ₹1,500 under budget
          </div>
        </div>

        {/* Budget Item: Attention */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-bold text-lg">Shopping</div>
              <div className="text-sm text-ink/50">Monthly</div>
            </div>
            <span className="bg-amber/10 text-amber px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Attention
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">₹6,800 Spent</span>
              <span className="text-ink/50">₹10,000</span>
            </div>
            <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber h-full w-[68%]" />
            </div>
          </div>
          <div className="text-xs text-amber-900/70 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> 68% used with 12 days left
          </div>
        </div>

        {/* Budget Item: Warning */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-coral/30">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-bold text-lg">Food & Dining</div>
              <div className="text-sm text-ink/50">Weekly</div>
            </div>
            <span className="bg-coral/10 text-coral px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Warning
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-coral">₹5,820 Spent</span>
              <span className="text-ink/50">₹7,000</span>
            </div>
            <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
              <div className="bg-coral h-full w-[82%]" />
            </div>
          </div>
          <div className="text-xs text-coral font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Projected to exceed by ₹1,400
          </div>
        </div>

      </div>
    </div>
  );
}
