export interface Env {
  DB: D1Database;
  RECEIPTS_BUCKET: R2Bucket;
  OPENROUTER_API_KEY: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number; // paise
  merchant: string;
  date: string;
  payment_method: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  amount: number; // paise
  merchant: string;
  date: string;
  type: 'expense' | 'income';
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number; // paise
  period: 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface AiInsight {
  id: string;
  user_id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  evidence: string; // JSON string
  impact: string | null;
  recommendation: string | null;
  action_type: string | null;
  is_dismissed: boolean;
  created_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  merchant: string;
  amount: number; // paise
  due_date: string;
  status: 'pending' | 'paid';
  is_recurring: boolean;
  recurrence_interval: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number; // paise
  current_amount: number; // paise
  monthly_contribution: number; // paise
  target_date: string | null;
  created_at: string;
  updated_at: string;
}
