"use client";

import { useState, useEffect } from 'react';
import { UploadCloud, Search, Filter, Plus, FileText, Trash2, X, Utensils, ShoppingBag, Car, Zap } from 'lucide-react';
import { api } from '@/lib/api-client';
import { API_CONFIG } from '@/config';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const IconMap: Record<string, React.ReactNode> = {
  'Utensils': <Utensils className="w-6 h-6" />,
  'ShoppingBag': <ShoppingBag className="w-6 h-6" />,
  'Car': <Car className="w-6 h-6" />,
  'Zap': <Zap className="w-6 h-6" />
};

export default function TransactionsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [income, setIncome] = useState<string>('');
  
  const [newTransaction, setNewTransaction] = useState({ merchant: '', amount: '', category_id: 'cat_food' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/transactions`);
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to wipe all transactions? This is for testing purposes.")) return;
    try {
      await fetch(`${API_CONFIG.baseUrl}/transactions`, { method: 'DELETE' });
      setTransactions([]);
      alert("All transactions wiped successfully!");
    } catch (err) {
      alert("Failed to wipe data.");
    }
  };

  const submitImport = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);
    setIsModalOpen(false); // Close modal immediately so user can navigate!
    
    // Simulate AI parsing progress
    const progressInterval = setInterval(() => {
      setProgress(p => {
        const next = p + (Math.random() * 15);
        return next > 95 ? 95 : next;
      });
    }, 1500);

    try {
      let extractedText = "";
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        extractedText = fullText;
      } else {
        extractedText = await selectedFile.text();
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

      const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactions.import}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: selectedFile.name, 
          text: extractedText,
          income: income ? Number(income) : undefined
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message);
      
      alert(data.data.message);
      setSelectedFile(null);
      setIncome('');
      fetchTransactions(); // Reload after upload
    } catch (err) {
      console.error(err);
      alert('Failed to analyze and import statement');
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.merchant || !newTransaction.amount) return alert("Please fill all fields");
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          merchant: newTransaction.merchant, 
          amount: Number(newTransaction.amount), 
          category_id: newTransaction.category_id 
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed");
      
      setIsManualModalOpen(false);
      setNewTransaction({ merchant: '', amount: '', category_id: 'cat_food' });
      fetchTransactions();
    } catch (err) {
      alert('Failed to add transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (paise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Transactions</h1>
          <p className="text-ink/60 mt-1">View and manage all your expenses.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => !isUploading && setIsModalOpen(true)} className="bg-white border border-ink/10 text-ink px-4 py-2.5 rounded-lg font-medium hover:bg-ink/5 transition-colors shadow-sm flex items-center gap-2">
            {isUploading ? (
              <><UploadCloud className="w-4 h-4 animate-bounce text-mint" /> Analyzing in background...</>
            ) : (
              <><FileText className="w-4 h-4" /> Import PDF/CSV</>
            )}
          </button>
          <button onClick={() => setIsManualModalOpen(true)} className="bg-mint text-white px-5 py-2.5 rounded-lg font-medium hover:bg-deepmint transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Manual
          </button>
        </div>
      </header>

      {/* Tools Row */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search merchants, categories, or notes..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
          />
        </div>
        <button onClick={() => alert('Filters coming soon!')} className="bg-white border border-ink/10 px-4 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-ink/5 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <button onClick={handleClearData} className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-red-100 transition-colors">
          <Trash2 className="w-4 h-4" /> Wipe Data
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-ink/5">
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
          <div className="divide-y divide-ink/5">
            {transactions.length === 0 && !isUploading && (
              <div className="p-12 text-center text-ink/50">No transactions found. Try importing a bank statement.</div>
            )}
            {transactions.length === 0 && isUploading && (
              <div className="p-16 text-center flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="w-20 h-20 bg-mint/10 rounded-full flex items-center justify-center">
                  <UploadCloud className="w-10 h-10 text-mint animate-bounce" />
                </div>
                <div className="font-display font-bold text-2xl text-ink">AI Analysis in Progress...</div>
                
                <div className="w-64 max-w-full space-y-2 mt-4">
                  <div className="flex justify-between text-sm font-medium text-ink/70">
                    <span>Extracting Insights</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-ink/10 rounded-full h-2">
                    <div className="bg-mint h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="text-ink/60 max-w-sm mx-auto mt-4">
                  Please stay on this page for a few seconds while we automatically generate your budgets, bills, and insights.
                </div>
              </div>
            )}
            {transactions.map((t) => (
              <div key={t.id} className="p-4 hover:bg-paper/50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: t.color || '#374151' }}>
                    {t.icon && IconMap[t.icon] ? IconMap[t.icon] : <span className="font-bold text-lg">{t.merchant.charAt(0).toUpperCase()}</span>}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{t.merchant}</div>
                    <div className="text-sm text-ink/50">{t.category_name || 'Uncategorized'} • {new Date(t.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-xl">{formatCurrency(t.amount)}</div>
                  {t.payment_method && <div className="text-xs font-medium text-ink/40 uppercase mt-1">{t.payment_method}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-ink/10 flex justify-between items-center">
              <h2 className="font-display font-bold text-xl">Import Bank Statement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-ink/50 hover:text-ink"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Statement File (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full border border-ink/10 rounded-lg p-2 focus:outline-none focus:border-mint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Total Salary / Income for this period (₹)</label>
                <p className="text-xs text-ink/50 mb-2">We will add this to your checking account balance.</p>
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full border border-ink/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-ink/10 bg-paper flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-ink/70 hover:bg-ink/5 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                onClick={submitImport}
                disabled={isUploading || !selectedFile}
                className="bg-mint text-white px-6 py-2 rounded-lg font-medium hover:bg-deepmint transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? <><UploadCloud className="w-4 h-4 animate-bounce" /> Analyzing...</> : 'Analyze & Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-ink/5">
            <div className="flex justify-between items-center p-6 border-b border-ink/5">
              <h2 className="font-display text-xl font-bold">Add Transaction</h2>
              <button onClick={() => setIsManualModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors"><X className="w-5 h-5 text-ink/60" /></button>
            </div>
            
            <form onSubmit={handleManualSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Merchant</label>
                <input 
                  type="text"
                  placeholder="e.g. Swiggy"
                  value={newTransaction.merchant}
                  onChange={(e) => setNewTransaction({...newTransaction, merchant: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Amount (₹)</label>
                <input 
                  type="number"
                  placeholder="e.g. 500"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">Category</label>
                <select 
                  value={newTransaction.category_id}
                  onChange={(e) => setNewTransaction({...newTransaction, category_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:border-mint transition-all"
                >
                  <option value="cat_food">Food & Dining</option>
                  <option value="cat_shopping">Shopping</option>
                  <option value="cat_transport">Transport</option>
                  <option value="cat_bills">Bills & Utilities</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-mint text-white py-3.5 rounded-xl font-bold hover:bg-deepmint transition-all shadow-sm shadow-mint/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
