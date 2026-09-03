"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Calendar, AlertCircle, Trash2, X } from 'lucide-react';
import { API_CONFIG } from '@/config';
import { api } from '@/lib/api-client';

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBill, setNewBill] = useState({ merchant: '', amount: '', due_date: '', is_recurring: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      const data = Array.isArray(res) ? res : (res?.data || []);
      setBills(data);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.merchant || !newBill.amount || !newBill.due_date) return alert("Please fill all fields");
    
    setIsSubmitting(true);
    try {
      await api.post('/bills', { 
        merchant: newBill.merchant, 
        amount: Number(newBill.amount), 
        due_date: new Date(newBill.due_date).toISOString(),
        is_recurring: newBill.is_recurring 
      });
      
      setIsModalOpen(false);
      setNewBill({ merchant: '', amount: '', due_date: '', is_recurring: true });
      fetchBills();
    } catch (err: any) {
      alert(err?.message || 'Failed to add bill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBill = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this bill?")) return;
    try {
      await api.delete(`/bills/${id}`);
      fetchBills();
    } catch (err) {
      alert("Failed to delete bill.");
    }
  };

  const formatCurrency = (paise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
  };

  const totalUpcoming = bills.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            Upcoming Bills <span className="bg-mint/10 text-mint text-sm px-3 py-1 rounded-full font-bold tracking-normal">Auto-Tracked</span>
          </h1>
          <p className="text-ink/60 mt-1">Never miss a recurring payment again.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-mint text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-deepmint transition-all shadow-sm shadow-mint/20"
        >
          <Plus className="w-5 h-5" /> Add Bill
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-ink/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-ink/5">
            <h3 className="font-bold text-lg">Next 30 Days</h3>
            <span className="text-sm font-semibold text-ink/50">{bills.length} active bills</span>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center p-4 bg-paper/30 rounded-xl border border-ink/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ink/10 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 bg-ink/10 rounded"></div>
                        <div className="w-24 h-3 bg-ink/5 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-ink/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {bills.length === 0 && (
                  <div className="text-center py-8 text-ink/50">No upcoming bills found.</div>
                )}
                {bills.map((bill) => {
                  const daysUntilDue = Math.ceil((new Date(bill.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  const isUrgent = daysUntilDue <= 5;
                  
                  return (
                    <div key={bill.id} className="flex justify-between items-center p-4 bg-paper/30 rounded-xl border border-ink/5 hover:border-ink/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-coral/10 text-coral' : 'bg-ink/5 text-ink/40'}`}>
                          {isUrgent ? <AlertCircle className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{bill.merchant}</div>
                          <div className={`text-sm font-medium ${isUrgent ? 'text-coral' : 'text-ink/50'}`}>
                            Due in {daysUntilDue} days
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display font-bold text-xl">{formatCurrency(bill.amount)}</div>
                        <button 
                          onClick={(e) => handleDeleteBill(bill.id, e)}
                          className="p-2 text-ink/30 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                          title="Remove Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-mint to-deepmint p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-white/80 font-medium mb-1">Total Upcoming Bills</div>
            {loading ? (
              <div className="h-10 w-32 bg-white/20 rounded animate-pulse mb-4"></div>
            ) : (
              <div className="font-display text-4xl font-bold mb-4">{formatCurrency(totalUpcoming)}</div>
            )}
          </div>
          
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <h4 className="font-bold mb-2">Smart Saving Tip</h4>
            <p className="text-sm text-white/90">
              You are paying for multiple subscriptions. Consolidating or rotating them could save you money.
            </p>
          </div>
        </div>
      </div>
      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-ink/5">
            <div className="flex justify-between items-center p-6 border-b border-ink/5">
              <h2 className="font-display text-xl font-bold">Add Bill</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors"><X className="w-5 h-5 text-ink/60" /></button>
            </div>
            
            <form onSubmit={handleAddBill} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Merchant Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Netflix"
                  value={newBill.merchant}
                  onChange={(e) => setNewBill({...newBill, merchant: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Amount (₹)</label>
                <input 
                  type="number"
                  placeholder="e.g. 649"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Next Due Date</label>
                <input 
                  type="date"
                  value={newBill.due_date}
                  onChange={(e) => setNewBill({...newBill, due_date: e.target.value})}
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
                  {isSubmitting ? 'Saving...' : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
