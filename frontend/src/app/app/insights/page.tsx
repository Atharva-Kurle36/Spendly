"use client";

import { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Target, BrainCircuit, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/config';
import { api } from '@/lib/api-client';

export default function InsightsPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/insights`);
      const json = await res.json();
      if (json.success) {
        setInsights(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/insights/generate`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");
      await fetchInsights();
    } catch (err) {
      console.error(err);
      alert('Failed to generate insights. Ensure OpenRouter is configured and you have transactions.');
    } finally {
      setIsGenerating(false);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const primaryInsight = insights.length > 0 ? insights[0] : null;
  const otherInsights = insights.slice(1);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-mint" /> 
            AI Insight Engine
          </h1>
          <p className="text-ink/60 mt-1">Your money, explained by AI.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-ink text-white px-5 py-2.5 rounded-lg font-medium hover:bg-ink/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-mint" />}
          {isGenerating ? 'Analyzing...' : 'Generate New Insight'}
        </button>
      </header>

      {loading ? (
        <div className="bg-gradient-to-br from-mint/20 via-deepmint/10 to-transparent p-1 rounded-3xl animate-pulse">
          <div className="bg-white rounded-[23px] p-8 h-64 flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-mint/10"></div>
             <div className="space-y-4 flex-1">
               <div className="w-32 h-4 bg-ink/10 rounded"></div>
               <div className="w-1/2 h-8 bg-ink/10 rounded"></div>
               <div className="w-3/4 h-16 bg-ink/5 rounded"></div>
             </div>
          </div>
        </div>
      ) : primaryInsight ? (
        <div className="bg-gradient-to-br from-mint/20 via-deepmint/10 to-transparent p-1 rounded-3xl">
          <div className="bg-white rounded-[23px] p-8 h-full">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-mint/10 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-mint" />
              </div>
              <div>
                <div className="text-sm font-semibold text-mint-900 uppercase tracking-wider mb-2">Primary Directive</div>
                <h2 className="font-display text-2xl font-bold mb-4">
                  {primaryInsight.title}
                </h2>
                <p className="text-ink/70 text-lg leading-relaxed max-w-3xl mb-6">
                  {primaryInsight.description}
                </p>
                
                <div className="flex gap-4">
                  <button onClick={() => navigateTo('/app/budgets')} className="bg-mint text-white px-6 py-3 rounded-xl font-bold shadow-sm shadow-mint/20 hover:bg-deepmint transition-colors">
                    {primaryInsight.action_type || 'Take Action'}
                  </button>
                  <button onClick={() => navigateTo('/app/transactions')} className="bg-paper text-ink px-6 py-3 rounded-xl font-bold hover:bg-ink/5 transition-colors">
                    Show Breakdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-ink/5 text-center shadow-sm">
          <BrainCircuit className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">No Insights Yet</h2>
          <p className="text-ink/60">Generate an AI analysis to see personalized insights about your spending.</p>
        </div>
      )}

      {/* Three Column AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Spending Leak Detector (Anomaly) */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber" />
            </div>
            <h3 className="font-bold text-lg">Spending Leaks</h3>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                 <div className="h-12 bg-ink/5 rounded"></div>
                 <div className="h-12 bg-ink/5 rounded"></div>
              </div>
            ) : otherInsights.length > 0 ? (
              otherInsights.map((insight: any, i: number) => (
                <div onClick={() => navigateTo('/app/budgets')} key={i} className="border-l-2 border-amber pl-4 hover:bg-paper/50 p-2 -ml-2 rounded-r-lg cursor-pointer transition-colors">
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-sm text-ink/60">{insight.description.substring(0, 60)}...</div>
                </div>
              ))
            ) : (
               <div className="text-ink/50 text-sm">No secondary insights found.</div>
            )}
          </div>
        </div>

        {/* What Changed? */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-coral" />
            </div>
            <h3 className="font-bold text-lg">Behavior Shifts</h3>
          </div>
          
          <div className="space-y-4">
            {insights.length > 0 ? (
              <div onClick={() => navigateTo('/app/transactions')} className="bg-paper/50 p-4 rounded-xl cursor-pointer hover:bg-paper transition-colors">
                <div className="flex justify-between items-end mb-2">
                  <div className="font-bold text-coral">Dining Out</div>
                  <div className="font-bold">+42%</div>
                </div>
                <p className="text-sm text-ink/60">
                  You've shifted ₹12,000 from grocery shopping into dining out over the last 3 weeks.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 opacity-60">
                <TrendingDown className="w-8 h-8 text-ink/30" />
                <p className="text-sm font-medium">Requires 30 days of history</p>
              </div>
            )}
          </div>
        </div>

        {/* Goal Predictions */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-deepmint/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-deepmint" />
            </div>
            <h3 className="font-bold text-lg">Goal Predictions</h3>
          </div>
          
          <div className="space-y-4">
            {insights.length > 0 ? (
              <div onClick={() => navigateTo('/app/goals')} className="group cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium group-hover:text-mint transition-colors">Emergency Fund</div>
                  <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-mint group-hover:translate-x-1 transition-all" />
                </div>
                <div className="w-full bg-ink/5 h-1.5 rounded-full mb-2">
                  <div className="bg-deepmint h-full w-[65%]" />
                </div>
                <p className="text-sm text-ink/60">
                  On track to complete by <span className="font-medium text-ink">Nov 14</span> based on recent savings velocity.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 opacity-60">
                <Target className="w-8 h-8 text-ink/30" />
                <p className="text-sm font-medium">Add a Goal to predict</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
