"use client";

import { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Trophy, X } from 'lucide-react';
import { API_CONFIG } from '@/config';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ name: '', target_amount: '', monthly_contribution: '', target_date: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch(`${API_CONFIG.baseUrl}/goals`);
        const json = await res.json();
        if (json.success) {
          setGoals(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/goals`);
      const json = await res.json();
      if (json.success) setGoals(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target_amount || !newGoal.monthly_contribution || !newGoal.target_date) return alert("Please fill all fields");
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newGoal.name, 
          target_amount: Number(newGoal.target_amount), 
          monthly_contribution: Number(newGoal.monthly_contribution),
          target_date: new Date(newGoal.target_date).toISOString(),
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed");
      
      setIsModalOpen(false);
      setNewGoal({ name: '', target_amount: '', monthly_contribution: '', target_date: '' });
      fetchGoals();
    } catch (err) {
      alert('Failed to create goal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAmount || !selectedGoalId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/goals/${selectedGoalId}/add-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(fundAmount) })
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed");
      
      setIsFundModalOpen(false);
      setFundAmount('');
      fetchGoals();
    } catch (err) {
      alert('Failed to add funds.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (paise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-deepmint" /> 
            Savings Goals
          </h1>
          <p className="text-ink/60 mt-1">Plan for the future, one step at a time.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-mint text-white px-5 py-2.5 rounded-lg font-medium hover:bg-deepmint transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Goal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm animate-pulse flex flex-col justify-between h-48">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ink/10 rounded-xl"></div>
                    <div className="space-y-2"><div className="w-24 h-4 bg-ink/10 rounded"></div><div className="w-16 h-3 bg-ink/5 rounded"></div></div>
                  </div>
                  <div className="space-y-2 text-right"><div className="w-20 h-6 bg-ink/10 rounded"></div><div className="w-16 h-3 bg-ink/5 rounded ml-auto"></div></div>
                </div>
                <div className="w-full bg-ink/10 h-3 rounded-full mb-3"></div>
                <div className="flex justify-between"><div className="w-20 h-3 bg-ink/10 rounded"></div><div className="w-24 h-3 bg-ink/10 rounded"></div></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {goals.length === 0 && (
              <div className="col-span-full text-center py-12 text-ink/50 bg-white rounded-2xl border border-ink/5">
                No goals found. Set a new savings goal!
              </div>
            )}
            {goals.map((goal, index) => {
              const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
              const isPrimary = index === 0;
              
              return (
                <div key={goal.id} className={`bg-white p-6 rounded-2xl border border-ink/5 shadow-sm group transition-colors cursor-pointer ${isPrimary ? 'hover:border-deepmint/30' : 'hover:border-mint/30'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPrimary ? 'bg-deepmint/10 text-deepmint' : 'bg-mint/10 text-mint'}`}>
                        {isPrimary ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{goal.name}</h3>
                        <p className="text-sm text-ink/50">{isPrimary ? 'High Priority' : 'Medium Priority'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-xl">{formatCurrency(goal.current_amount)}</div>
                      <div className="text-sm text-ink/50">of {formatCurrency(goal.target_amount)}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-ink/5 h-3 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isPrimary ? 'bg-deepmint' : 'bg-mint'}`} style={{ width: `${percent}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${isPrimary ? 'text-deepmint' : 'text-mint'}`}>{percent}% Completed</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGoalId(goal.id);
                        setIsFundModalOpen(true);
                      }}
                      className="text-mint font-bold hover:underline"
                    >
                      + Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-ink/5">
            <div className="flex justify-between items-center p-6 border-b border-ink/5">
              <h2 className="font-display text-xl font-bold">Create Goal</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors"><X className="w-5 h-5 text-ink/60" /></button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Goal Name</label>
                <input 
                  type="text"
                  placeholder="e.g. New Car"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Target (₹)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 500000"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink/70 mb-1.5">Monthly (₹)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 10000"
                    value={newGoal.monthly_contribution}
                    onChange={(e) => setNewGoal({...newGoal, monthly_contribution: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Target Date</label>
                <input 
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-mint text-white py-3.5 rounded-xl font-bold hover:bg-deepmint transition-all shadow-sm shadow-mint/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {isFundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-ink/5">
            <div className="flex justify-between items-center p-6 border-b border-ink/5">
               <h2 className="font-display text-xl font-bold">Add Saved Funds</h2>
               <button onClick={() => setIsFundModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors"><X className="w-5 h-5 text-ink/60" /></button>
            </div>
            <form onSubmit={handleAddFunds} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Amount Saved (₹)</label>
                <input 
                  type="number"
                  placeholder="e.g. 5000"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-mint text-white py-3.5 rounded-xl font-bold hover:bg-deepmint transition-all shadow-sm shadow-mint/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
