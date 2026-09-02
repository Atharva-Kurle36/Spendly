DELETE FROM expenses;
DELETE FROM ai_insights;
DELETE FROM budget_periods;
DELETE FROM budgets;
DELETE FROM bills;
DELETE FROM savings_goals;
UPDATE accounts SET balance = 0;
