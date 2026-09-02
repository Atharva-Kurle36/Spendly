"use client";

import { useState } from 'react';
import { UploadCloud, Search, Filter, Plus, FileSpreadsheet } from 'lucide-react';
import { api } from '@/lib/api-client';
import { API_CONFIG } from '@/config';

export default function TransactionsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Direct fetch bypasses api-client json constraint for FormData
      const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactions.import}`, {
        method: 'POST',
        // In a real app with auth, add headers here
        body: formData
      });
      const data = await res.json();
      setUploadResult(data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to upload statement');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Transactions</h1>
          <p className="text-ink/60 mt-1">Manage and import your spending records.</p>
        </div>
        <div className="flex gap-4">
          <label className="cursor-pointer bg-white border border-ink/10 text-ink px-4 py-2.5 rounded-lg font-medium hover:bg-ink/5 transition-colors shadow-sm flex items-center gap-2">
            {isUploading ? 'Uploading...' : <><FileSpreadsheet className="w-4 h-4" /> Import CSV</>}
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={isUploading}
            />
          </label>
          <button className="bg-mint text-white px-5 py-2.5 rounded-lg font-medium hover:bg-deepmint transition-colors shadow-sm shadow-mint/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Manual
          </button>
        </div>
      </header>

      {uploadResult && (
        <div className="bg-mint/10 border border-mint/20 text-mint-900 p-4 rounded-xl flex items-center gap-3">
          <UploadCloud className="w-5 h-5 text-mint" />
          <span className="font-medium">{uploadResult.message}</span>
        </div>
      )}

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-ink/5 shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-10 pr-4 py-2 bg-paper/50 border border-ink/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-ink/10 rounded-lg text-ink/70 font-medium hover:bg-ink/5 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Transaction List (Finance Style Rows) */}
      <div className="bg-white rounded-2xl border border-ink/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-ink/5 bg-paper/50">
              <th className="py-4 px-6 text-xs font-semibold text-ink/50 uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-ink/50 uppercase tracking-wider">Merchant</th>
              <th className="py-4 px-6 text-xs font-semibold text-ink/50 uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 text-xs font-semibold text-ink/50 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {/* Mock Rows */}
            <tr className="hover:bg-paper/30 transition-colors">
              <td className="py-4 px-6 text-sm text-ink/70">Sep 02, 2026</td>
              <td className="py-4 px-6 font-medium">Swiggy</td>
              <td className="py-4 px-6">
                <span className="bg-ink/5 text-ink/70 px-2.5 py-1 rounded-md text-xs font-medium">Food & Dining</span>
              </td>
              <td className="py-4 px-6 font-display font-bold text-right">₹420.00</td>
            </tr>
            <tr className="hover:bg-paper/30 transition-colors">
              <td className="py-4 px-6 text-sm text-ink/70">Sep 01, 2026</td>
              <td className="py-4 px-6 font-medium">Amazon</td>
              <td className="py-4 px-6">
                <span className="bg-ink/5 text-ink/70 px-2.5 py-1 rounded-md text-xs font-medium">Shopping</span>
              </td>
              <td className="py-4 px-6 font-display font-bold text-right">₹4,800.00</td>
            </tr>
            <tr className="hover:bg-paper/30 transition-colors">
              <td className="py-4 px-6 text-sm text-ink/70">Aug 28, 2026</td>
              <td className="py-4 px-6 font-medium">Netflix</td>
              <td className="py-4 px-6">
                <span className="bg-ink/5 text-ink/70 px-2.5 py-1 rounded-md text-xs font-medium">Subscription</span>
              </td>
              <td className="py-4 px-6 font-display font-bold text-right">₹649.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
