-- Seed data for SmartWallet AI local database

-- 1. Create a dummy user
INSERT INTO users (id, email, name) VALUES ('user_12345', 'aryan@example.com', 'Aryan');

-- 2. Create User Preferences
INSERT INTO user_preferences (user_id, currency, theme) VALUES ('user_12345', 'INR', 'system');

-- 3. Create Accounts
INSERT INTO accounts (id, user_id, name, type, balance) VALUES 
('acc_1', 'user_12345', 'HDFC Bank Checking', 'checking', 14250000), -- ₹142,500.00
('acc_2', 'user_12345', 'SBI Savings', 'savings', 50000000);

-- 4. Create Categories
INSERT INTO categories (id, user_id, name, icon, color, is_system) VALUES 
('cat_food', 'user_12345', 'Food & Dining', 'Utensils', '#E11D48', TRUE),
('cat_shopping', 'user_12345', 'Shopping', 'ShoppingBag', '#F59E0B', TRUE),
('cat_transport', 'user_12345', 'Transport', 'Car', '#10B981', TRUE),
('cat_bills', 'user_12345', 'Bills & Utilities', 'Receipt', '#3B82F6', TRUE);

-- 5. Create Expenses (Recent Transactions)
INSERT INTO expenses (id, user_id, category_id, amount, merchant, date, payment_method, note) VALUES 
('exp_1', 'user_12345', 'cat_food', 42000, 'Swiggy', datetime('now', '-2 hours'), 'UPI', 'Lunch'),
('exp_2', 'user_12345', 'cat_shopping', 1400000, 'Amazon', datetime('now', '-1 day'), 'Credit Card', 'New Monitor'),
('exp_3', 'user_12345', 'cat_transport', 35000, 'Uber', datetime('now', '-2 days'), 'UPI', 'Office ride'),
('exp_4', 'user_12345', 'cat_food', 120000, 'Zomato', datetime('now', '-3 days'), 'UPI', 'Dinner'),
('exp_5', 'user_12345', 'cat_bills', 249900, 'JioFiber', datetime('now', '-4 days'), 'Credit Card', 'Internet Bill');

-- 6. Create Budgets
INSERT INTO budgets (id, user_id, category_id, amount, period) VALUES 
('bud_1', 'user_12345', 'cat_food', 700000, 'monthly'),
('bud_2', 'user_12345', 'cat_shopping', 1000000, 'monthly'),
('bud_3', 'user_12345', 'cat_transport', 500000, 'monthly');

-- 7. Create Budget Periods (Current month usage)
INSERT INTO budget_periods (id, budget_id, start_date, end_date, spent_amount) VALUES 
('budp_1', 'bud_1', datetime('now', 'start of month'), datetime('now', 'start of month', '+1 month'), 582000), -- 83%
('budp_2', 'bud_2', datetime('now', 'start of month'), datetime('now', 'start of month', '+1 month'), 680000), -- 68%
('budp_3', 'bud_3', datetime('now', 'start of month'), datetime('now', 'start of month', '+1 month'), 120000); -- 24%

-- 8. Create Bills
INSERT INTO bills (id, user_id, merchant, amount, due_date, status, is_recurring, recurrence_interval) VALUES 
('bill_1', 'user_12345', 'Netflix Premium', 64900, datetime('now', '+4 days'), 'pending', TRUE, 'monthly'),
('bill_2', 'user_12345', 'Electricity (BESCOM)', 182000, datetime('now', '+7 days'), 'pending', TRUE, 'monthly'),
('bill_3', 'user_12345', 'Gym Membership', 250000, datetime('now', '+22 days'), 'pending', TRUE, 'monthly');

-- 9. Create Savings Goals
INSERT INTO savings_goals (id, user_id, name, target_amount, current_amount, monthly_contribution, target_date) VALUES 
('goal_1', 'user_12345', 'Emergency Fund', 10000000, 6500000, 500000, datetime('now', '+6 months')),
('goal_2', 'user_12345', 'New Laptop', 8500000, 1250000, 400000, datetime('now', '+12 months'));

-- 10. Create AI Insights
INSERT INTO ai_insights (id, user_id, type, severity, title, description, evidence, recommendation, action_type) VALUES 
('ins_1', 'user_12345', 'Unusual Activity', 'high', 'Unusual Activity Detected', '₹4,800 at Amazon is 3.4x higher than your typical shopping transaction.', '{"merchant":"Amazon","avg":1400,"current":4800}', 'Review this transaction to ensure it is legitimate.', 'Review Transaction'),
('ins_2', 'user_12345', 'Spending Leak', 'medium', 'You are losing ₹4,800/mo to micro-subscriptions.', 'We detected 7 separate active subscriptions under ₹999 that you haven''t utilized in the past 60 days. Canceling these will increase your monthly savings rate by 14% without affecting your lifestyle.', '{"subs_count":7,"wasted_amount":4800}', 'Cancel unused subscriptions immediately.', 'Cancel Subscriptions');
