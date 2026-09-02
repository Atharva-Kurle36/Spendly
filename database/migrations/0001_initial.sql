-- Migration number: 0001 	 2026-09-02T00:00:00.000Z
-- Initial Schema for SmartWallet AI

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    currency TEXT DEFAULT 'INR',
    theme TEXT DEFAULT 'system',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'checking', 'savings', 'credit'
    balance INTEGER NOT NULL DEFAULT 0, -- stored in paise
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    user_id TEXT, -- NULL for system defaults
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    category_id TEXT,
    amount INTEGER NOT NULL, -- stored in paise
    merchant TEXT NOT NULL,
    date DATETIME NOT NULL,
    type TEXT NOT NULL, -- 'expense', 'income'
    notes TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_merchant ON transactions(merchant);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

CREATE TABLE expenses (
    -- Expenses can just be a view or specific transaction type, but since it's listed as a separate table, let's treat it as user-created expenses that might not be linked to a specific account yet, or just an alias for simplicity. We will map expenses directly here.
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category_id TEXT,
    amount INTEGER NOT NULL, -- stored in paise
    merchant TEXT NOT NULL,
    date DATETIME NOT NULL,
    payment_method TEXT,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_merchant ON expenses(merchant);

CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    category_id TEXT, -- If null, represents total overall budget
    amount INTEGER NOT NULL, -- stored in paise
    period TEXT DEFAULT 'monthly', -- 'weekly', 'monthly'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);

CREATE TABLE budget_periods (
    id TEXT PRIMARY KEY,
    budget_id TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    spent_amount INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);
CREATE INDEX idx_budget_periods_budget_id ON budget_periods(budget_id);

CREATE TABLE bills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    merchant TEXT NOT NULL,
    amount INTEGER NOT NULL,
    due_date DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_interval TEXT, -- 'monthly', 'yearly'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_due_date ON bills(due_date);

CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    merchant TEXT NOT NULL,
    amount INTEGER NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly',
    next_billing_date DATETIME NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

CREATE TABLE savings_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    target_amount INTEGER NOT NULL,
    current_amount INTEGER NOT NULL DEFAULT 0,
    monthly_contribution INTEGER NOT NULL DEFAULT 0,
    target_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);

CREATE TABLE alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'warning', 'info', 'success', 'critical'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

CREATE TABLE ai_insights (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'Spending Leak', 'Budget Overrun'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT NOT NULL, -- JSON string
    impact TEXT,
    recommendation TEXT,
    action_type TEXT,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_created_at ON ai_insights(created_at);

CREATE TABLE receipt_metadata (
    id TEXT PRIMARY KEY,
    expense_id TEXT NOT NULL,
    bucket_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);
CREATE INDEX idx_receipt_metadata_expense_id ON receipt_metadata(expense_id);
