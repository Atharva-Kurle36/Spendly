"use client";

import { Sparkles, TrendingUp, TrendingDown, ArrowRight, Wallet, PieChart, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config";
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [monthlySalary, setMonthlySalary] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_CONFIG.baseUrl}/overview`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    
    const savedSalary = localStorage.getItem('monthlySalary');
    if (savedSalary) setMonthlySalary(Number(savedSalary));
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-32 flex flex-col justify-between">
            <div className="h-4 bg-ink/10 rounded w-1/3"></div>
            <div className="h-10 bg-ink/10 rounded w-2/3"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-32 flex flex-col justify-between">
            <div className="h-4 bg-ink/10 rounded w-1/3"></div>
            <div className="h-10 bg-ink/10 rounded w-2/3"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-32 flex flex-col justify-between">
            <div className="h-4 bg-ink/10 rounded w-1/3"></div>
            <div className="h-10 bg-ink/10 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-80"></div>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-64"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-64"></div>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-48"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  const formatActionType = (action: string) => {
    if (!action) return 'Review Action';
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-2">Total Balance</div>
          <div className="font-display text-4xl font-bold text-ink mb-2">
            {formatCurrency(data?.totalBalance || 0)}
          </div>
          <div className="flex items-center text-sm font-medium text-mint">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% from last month
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-2">Total Spent</div>
          <div className="font-display text-4xl font-bold text-ink mb-2">
            {formatCurrency(data?.totalSpent || 0)}
          </div>
          <div className="flex items-center text-sm font-medium text-coral">
            <TrendingUp className="w-4 h-4 mr-1" />
            +4.2% from last month
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-bold text-ink/50 uppercase tracking-wider">Financial Health</div>
            <div className="px-2 py-1 bg-amber/10 text-amber text-xs font-bold rounded-md">WATCH</div>
          </div>
          <div className="font-display text-4xl font-bold text-ink mb-2">
            {data?.healthScore || 0}/100
          </div>
          <div className="flex items-center text-sm font-medium text-ink/60">
            <Activity className="w-4 h-4 mr-1" />
            {data?.healthStatus || 'Calculating...'}
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber/20 to-transparent rounded-full blur-2xl" />
        </div>
      </div>

      {/* AI Insight Highlight */}
      {data?.primaryInsight && (
        <div className="bg-gradient-to-r from-amber/10 to-transparent p-4 rounded-xl border border-amber/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-amber-900">{data.primaryInsight.title}</span>
              <span className="px-2 py-0.5 bg-amber text-white text-[10px] font-bold rounded uppercase">New</span>
            </div>
            <p className="text-sm text-amber-900/80 mb-2">"{data.primaryInsight.description}"</p>
            <Link href="/app/insights" className="text-xs font-bold text-amber-700 bg-white px-3 py-1.5 rounded-md shadow-sm border border-amber/10 hover:bg-amber/5 transition-colors inline-block">
              {formatActionType(data.primaryInsight.action_type)}
            </Link>
          </div>
        </div>
      )}

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Salary */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-2">Monthly Salary</div>
          <div className="font-display text-2xl font-bold text-ink mb-1">
            {formatCurrency(monthlySalary * 100)}
          </div>
          <div className="text-sm font-medium text-ink/50">Stored in settings</div>
        </div>

        {/* Total Monthly Budget */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-2">Total Budget</div>
          <div className="font-display text-2xl font-bold text-ink mb-1">
            {formatCurrency(data?.budgetHealth?.reduce((acc: number, b: any) => acc + (b.limit_amount || 0), 0) || 0)}
          </div>
          <div className="text-sm font-medium text-ink/50">Active category limits</div>
        </div>

        {/* Goal Predictions */}
        <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
          <div className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-2">Top Goal Prediction</div>
          {data?.goals?.length > 0 ? (
            (() => {
              const topGoal = data.goals[0];
              const remaining = Math.max(0, topGoal.target_amount - topGoal.current_amount);
              const months = topGoal.monthly_contribution > 0 ? remaining / topGoal.monthly_contribution : 0;
              const estDate = new Date();
              estDate.setMonth(estDate.getMonth() + Math.ceil(months));
              return (
                <>
                  <div className="font-display text-2xl font-bold text-mint mb-1">
                    {estDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-sm font-medium text-ink/50">To reach {topGoal.name}</div>
                </>
              );
            })()
          ) : (
            <>
              <div className="font-display text-2xl font-bold text-ink/30 mb-1">No Goals</div>
              <div className="text-sm font-medium text-ink/50">Create a savings goal</div>
            </>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Charts & Transactions) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-96 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Spending Trend</h3>
            <div className="flex-1 w-full relative">
              {(!data?.spendingTrend || data.spendingTrend.length === 0) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                  <div className="text-ink/50 font-medium">No spending data yet.</div>
                  <Link href="/app/transactions" className="text-mint font-bold text-sm hover:underline mt-1">Import a Bank Statement</Link>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.spendingTrend?.length > 0 ? data.spendingTrend.map((t: any) => ({
                  name: new Date(t.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  amount: t.daily_total / 100
                })) : [{ name: 'Mon', amount: 0 }, { name: 'Tue', amount: 0 }, { name: 'Wed', amount: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                    formatter={(value: any) => [`₹${value}`, 'Spent']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Recent Transactions</h3>
              <Link href="/app/transactions" className="text-sm font-bold text-mint hover:text-deepmint transition-colors">View All</Link>
            </div>
            
            <div className="space-y-4">
              {data?.recentTransactions?.length === 0 && (
                <div className="text-center text-ink/50 py-4">No recent transactions.</div>
              )}
              {data?.recentTransactions?.map((t: any) => (
                <div key={t.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink/60 font-bold">
                      {t.merchant.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-mint transition-colors">{t.merchant}</div>
                      <div className="text-xs font-medium text-ink/50">
                        {new Date(t.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold font-display">
                    {formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Budgets & Bills) */}
        <div className="space-y-6">
          
          {/* Budget Health */}
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Budget Health</h3>
              <TrendingUp className="w-4 h-4 text-ink/40" />
            </div>
            
            <div className="space-y-6">
              {data?.budgetHealth?.length === 0 && (
                <div className="text-center text-ink/50 py-2">No active budgets.</div>
              )}
              {data?.budgetHealth?.map((b: any, i: number) => {
                const percent = Math.min(Math.round((b.spent_amount / b.limit_amount) * 100), 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>{b.name}</span>
                      <span style={{ color: b.color || '#111827' }}>{percent}% Used</span>
                    </div>
                    <div className="w-full bg-ink/5 h-2 rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%`, backgroundColor: b.color || '#10B981' }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-ink/40 text-right">
                      {formatCurrency(b.spent_amount)} / {formatCurrency(b.limit_amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="font-bold text-lg">Upcoming Bills</h3>
              <span className="w-5 h-5 rounded-full bg-ink text-white text-xs flex items-center justify-center font-bold">
                {data?.upcomingBills?.length || 0}
              </span>
            </div>
            
            <div className="space-y-4">
              {data?.upcomingBills?.length === 0 && (
                <div className="text-center text-ink/50 py-2">No upcoming bills.</div>
              )}
              {data?.upcomingBills?.map((bill: any) => (
                <div key={bill.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold text-sm">{bill.merchant}</div>
                      <div className="text-xs text-coral font-medium">Due {new Date(bill.due_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="font-bold font-display text-sm">
                    {formatCurrency(bill.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
