"use client";

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle, X, Edit2, Trash2, Utensils, Car, ShoppingBag, Receipt, HelpCircle } from 'lucide-react';
import { API_CONFIG } from '@/config';

const ICON_MAP: Record<string, any> = {
  'Utensils': Utensils,
  'Car': Car,
  'ShoppingBag': ShoppingBag,
  'Receipt': Receipt
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editBudgetId, setEditBudgetId] = useState<string | null>(null);
  
  const [newBudget, setNewBudget] = useState({ category_id: 'cat_food', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/budgets`);
      const json = await res.json();
      if (json.success) {
        // Deduplicate budgets by category to ensure only 1 card per category is shown
        const seen = new Set();
        const uniqueBudgets = json.data.filter((b: any) => {
          const categoryName = b.name || 'Uncategorized';
          if (seen.has(categoryName)) return false;
          seen.add(categoryName);
          return true;
        });
        setBudgets(uniqueBudgets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditBudgetId(null);
    setNewBudget({ category_id: 'cat_food', amount: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (budget: any) => {
    setModalMode('edit');
    setEditBudgetId(budget.id);
    // Find category ID based on name or fallback
    let cat_id = 'cat_food';
    if (budget.name === 'Food & Dining') cat_id = 'cat_food';
    else if (budget.name === 'Shopping') cat_id = 'cat_shopping';
    else if (budget.name === 'Transport') cat_id = 'cat_transport';
    else if (budget.name === 'Bills & Utilities') cat_id = 'cat_bills';
    
    setNewBudget({ category_id: cat_id, amount: (budget.limit_amount / 100).toString() });
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/budgets/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchBudgets();
      } else {
        alert('Failed to delete budget.');
      }
    } catch (err) {
      alert('Error deleting budget.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.amount || isNaN(Number(newBudget.amount))) return alert("Please enter a valid amount");
    
    setIsSubmitting(true);
    try {
      const url = modalMode === 'create' 
        ? `${API_CONFIG.baseUrl}/budgets` 
        : `${API_CONFIG.baseUrl}/budgets/${editBudgetId}`;
        
      const res = await fetch(url, {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: newBudget.category_id, amount: Number(newBudget.amount) })
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed");
      
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      alert(`Failed to ${modalMode} budget.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (paise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
  };

  const totalBudget = budgets.reduce((acc, b) => acc + (b.limit_amount || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent_amount || 0), 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Budgets</h1>
          <p className="text-ink/60 mt-1">Track and predict your spending limits.</p>
        </div>
        <button onClick={openCreateModal} className="bg-mint text-white px-5 py-2.5 rounded-lg font-medium hover:bg-deepmint transition-colors shadow-sm shadow-mint/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Budget
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-32 animate-pulse flex flex-col justify-between"><div className="w-1/2 h-4 bg-ink/10 rounded"></div><div className="w-3/4 h-8 bg-ink/10 rounded"></div></div>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-32 animate-pulse flex flex-col justify-between"><div className="w-1/2 h-4 bg-ink/10 rounded"></div><div className="w-3/4 h-8 bg-ink/10 rounded"></div></div>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-32 animate-pulse flex flex-col justify-between"><div className="w-1/2 h-4 bg-ink/10 rounded"></div><div className="w-3/4 h-8 bg-ink/10 rounded"></div></div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
              <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-2">Total Monthly Budget</div>
              <div className="font-display text-3xl font-bold mb-4">{formatCurrency(totalBudget)}</div>
              <div className="text-sm text-ink/60">Across {budgets.length} active categories</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm">
              <div className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-2">Total Remaining</div>
              <div className="font-display text-3xl font-bold mb-4">{formatCurrency(totalRemaining)}</div>
              <div className="text-sm text-ink/60">Active month period</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm bg-amber/5 border-amber/20">
              <div className="text-sm font-semibold text-amber-900/60 uppercase tracking-wider mb-2">Predictive Warning</div>
              <div className="font-display text-xl font-bold mb-2 text-amber-900">Track Carefully</div>
              <div className="text-sm text-amber-900/80">You have consumed {Math.round((totalSpent / (totalBudget || 1)) * 100)}% of your total budget.</div>
            </div>
          </>
        )}
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-ink/5 shadow-sm h-48 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between"><div className="w-1/3 h-6 bg-ink/10 rounded"></div><div className="w-1/4 h-6 bg-ink/10 rounded"></div></div>
                <div className="space-y-3"><div className="w-full h-4 bg-ink/10 rounded"></div><div className="w-full h-2 bg-ink/10 rounded"></div></div>
              </div>
            ))}
          </>
        ) : (
          <>
            {budgets.length === 0 && (
              <div className="col-span-full py-12 text-center text-ink/50 bg-white rounded-2xl border border-ink/5">
                No active budgets found. Create one to start tracking.
              </div>
            )}
            {budgets.map(b => {
              const limitAmount = b.limit_amount || 1;
              const percent = Math.min(Math.round(((b.spent_amount || 0) / limitAmount) * 100), 100);
              const isWarning = percent > 85;
              const isAttention = percent > 65 && percent <= 85;

              return (
                <div key={b.id} className={`group bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow relative ${isWarning ? 'border-coral/30' : 'border-ink/5'}`}>
                  {/* Actions overlay */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => openEditModal(b)} className="p-1.5 bg-white shadow-sm border border-ink/10 rounded-md text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleDeleteBudget(b.id, e)} className="p-1.5 bg-white shadow-sm border border-red-100 rounded-md text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-start mb-6 pr-16">
                    <div>
                      <div className="font-bold text-lg flex items-center gap-2">
                        {b.icon && (() => {
                          const IconComp = ICON_MAP[b.icon] || HelpCircle;
                          return <IconComp className="w-5 h-5" style={{ color: b.color }} />;
                        })()}
                        {b.name || 'Uncategorized'}
                      </div>
                      <div className="text-sm text-ink/50">Category Limit: {formatCurrency(limitAmount)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={`font-medium ${isWarning ? 'text-coral' : ''}`}>{formatCurrency(b.spent_amount || 0)} Spent</span>
                      <span className="text-ink/50">{formatCurrency(limitAmount)}</span>
                    </div>
                    <div className="w-full bg-ink/5 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: isWarning ? '#E11D48' : isAttention ? '#F59E0B' : b.color || '#10B981' }} />
                    </div>
                  </div>
                  <div className={`text-xs flex items-center justify-between`}>
                    <div className={`flex items-center gap-1 ${isWarning ? 'text-coral font-medium' : isAttention ? 'text-amber-900/70' : 'text-ink/50'}`}>
                      <TrendingUp className="w-3 h-3" /> {percent}% used
                    </div>
                    <div className="text-ink/40 font-medium">Monthly</div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Create/Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-ink/5">
            <div className="flex justify-between items-center p-6 border-b border-ink/5">
              <h2 className="font-display text-xl font-bold">{modalMode === 'create' ? 'Create' : 'Edit'} Budget</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors"><X className="w-5 h-5 text-ink/60" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Category</label>
                <select 
                  value={newBudget.category_id}
                  onChange={(e) => setNewBudget({...newBudget, category_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  disabled={modalMode === 'edit'}
                >
                  <option value="cat_food">Food & Dining</option>
                  <option value="cat_shopping">Shopping</option>
                  <option value="cat_transport">Transport</option>
                  <option value="cat_bills">Bills & Utilities</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Monthly Limit (₹)</label>
                <input 
                  type="number"
                  placeholder="e.g. 10000"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
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
                  {isSubmitting ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
