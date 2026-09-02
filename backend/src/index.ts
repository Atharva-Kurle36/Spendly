import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { authMiddleware } from './middleware/auth.middleware';
import { ExpenseRepository } from './repositories/expense.repository';
import { UserRepository } from './repositories/user.repository';
import { BudgetRepository } from './repositories/budget.repository';
import { LLMProvider } from './ai/llm-provider';

const app = new Hono<{ Bindings: Env; Variables: { user: any } }>();

app.use('/*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Root Health Check Route
app.get('/', (c) => {
  return c.json({ 
    status: 'online', 
    service: 'SmartWallet AI Backend', 
    version: '1.0.0' 
  });
});

// Health Check
app.get('/api/health', (c) => {
  return c.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Sync User (called by frontend after Firebase auth)
app.post('/api/users/sync', authMiddleware, async (c) => {
  const user = c.get('user');
  const userRepo = new UserRepository(c.env.DB);
  
  try {
    const dbUser = await userRepo.createOrUpdate({
      id: user.id,
      email: user.email,
      name: user.name
    });
    return c.json({ success: true, data: dbUser });
  } catch (err: any) {
    return c.json({ success: false, error: { message: err.message } }, 500);
  }
});

// Expenses Routes
const expenses = new Hono<{ Bindings: Env; Variables: { user: any } }>();
expenses.use('*', authMiddleware);

expenses.get('/', async (c) => {
  const user = c.get('user');
  const repo = new ExpenseRepository(c.env.DB);
  const data = await repo.findAllByUserId(user.id);
  return c.json({ success: true, data });
});

expenses.post('/', async (c) => {
  const user = c.get('user');
  const repo = new ExpenseRepository(c.env.DB);
  const body = await c.req.json();
  
  // Basic validation omitted for brevity
  const expense = await repo.create({
    id: body.id || crypto.randomUUID(),
    user_id: user.id,
    category_id: body.category_id || null,
    amount: body.amount,
    merchant: body.merchant,
    date: body.date,
    payment_method: body.payment_method || null,
    note: body.note || null
  });
  return c.json({ success: true, data: expense });
});

app.route('/api/expenses', expenses);

// Budgets Routes
const budgets = new Hono<{ Bindings: Env; Variables: { user: any } }>();
budgets.use('*', authMiddleware);

budgets.get('/', async (c) => {
  const user = c.get('user');
  const repo = new BudgetRepository(c.env.DB);
  const data = await repo.findAllByUserId(user.id);
  return c.json({ success: true, data });
});

app.route('/api/budgets', budgets);

// AI Insights Route
app.post('/api/insights/generate', authMiddleware, async (c) => {
  const user = c.get('user');
  const expenseRepo = new ExpenseRepository(c.env.DB);
  const budgetRepo = new BudgetRepository(c.env.DB);
  
  const [expensesList, budgetsList] = await Promise.all([
    expenseRepo.findAllByUserId(user.id),
    budgetRepo.findAllByUserId(user.id)
  ]);
  
  const llm = new LLMProvider(c.env.OPENROUTER_API_KEY);
  
  try {
    const insight = await llm.generateInsight(expensesList.slice(0, 50), budgetsList);
    return c.json({ success: true, data: insight });
  } catch (err: any) {
    return c.json({ success: false, error: { message: err.message } }, 500);
  }
});

// Bank Statement Import Route (AI Powered PDF/Text parsing)
app.post('/api/transactions/import', authMiddleware, async (c) => {
  const user = c.get('user');
  try {
    const { text, filename, income } = await c.req.json();
    
    if (!text) {
      return c.json({ success: false, error: { message: 'No text extracted from document' } }, 400);
    }
    
    // 1. Save raw text to R2 for audit/storage
    const objectKey = `statements/${user.id}/${Date.now()}-${filename}.txt`;
    await c.env.RECEIPTS_BUCKET.put(objectKey, text);
    
    // 2. Parse using AI LLM
    const llm = new LLMProvider(c.env.OPENROUTER_API_KEY);
    const parsedPayload = await llm.parseStatementText(text);
    const parsedRows = parsedPayload.transactions || [];
    const parsedBills = parsedPayload.bills || [];
    const parsedBudgets = parsedPayload.budgets || [];
    const parsedInsight = parsedPayload.insight || null;
    
    // 3. Insert into Database
    const transactions = [];
    const expenseRepo = new ExpenseRepository(c.env.DB);
    
    for (const row of parsedRows) {
      if (!row.amount || !row.merchant) continue;
      
      let category_id = null;
      if (row.category_name) {
        if (row.category_name.includes('Food')) category_id = 'cat_food';
        else if (row.category_name.includes('Shopping')) category_id = 'cat_shopping';
        else if (row.category_name.includes('Transport')) category_id = 'cat_transport';
        else if (row.category_name.includes('Bills')) category_id = 'cat_bills';
      }

      const expense = await expenseRepo.create({
        id: crypto.randomUUID(),
        user_id: user.id,
        category_id: category_id, 
        amount: Math.round(row.amount * 100), // convert to paise
        merchant: row.merchant,
        date: new Date(row.date).toISOString() || new Date().toISOString(),
        payment_method: 'imported_statement',
        note: `Imported via AI from ${filename}`
      });
      
      transactions.push(expense);
    }
    
    // 3.1 Insert Auto-Pilot Bills
    for (const bill of parsedBills) {
      if (!bill.merchant || !bill.amount) continue;
      await c.env.DB.prepare('INSERT INTO bills (id, user_id, merchant, amount, due_date, status) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), user.id, bill.merchant, Math.round(bill.amount * 100), bill.due_date || new Date().toISOString(), 'pending').run();
    }

    // 3.2 Insert Auto-Pilot Budgets
    for (const budget of parsedBudgets) {
      if (!budget.category_name || !budget.limit_amount) continue;
      let cat_id = 'cat_shopping'; // Default to shopping to pass foreign key check
      if (budget.category_name.includes('Food')) cat_id = 'cat_food';
      else if (budget.category_name.includes('Shopping')) cat_id = 'cat_shopping';
      else if (budget.category_name.includes('Transport')) cat_id = 'cat_transport';
      
      const budgetId = crypto.randomUUID();
      await c.env.DB.prepare('INSERT INTO budgets (id, user_id, category_id, amount, period) VALUES (?, ?, ?, ?, ?)')
        .bind(budgetId, user.id, cat_id, Math.round(budget.limit_amount * 100), 'monthly').run();
        
      await c.env.DB.prepare('INSERT INTO budget_periods (id, budget_id, start_date, end_date, spent_amount) VALUES (?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), budgetId, new Date().toISOString(), new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString(), 0).run();
    }

    // 3.3 Insert AI Insight
    if (parsedInsight && parsedInsight.title) {
      await c.env.DB.prepare('INSERT INTO ai_insights (id, user_id, type, severity, title, description, evidence, action_type, is_dismissed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(crypto.randomUUID(), user.id, 'anomaly', 'medium', parsedInsight.title, parsedInsight.description, 'Detected during initial PDF bank statement import', parsedInsight.action_type || 'Review', 0).run();
    }

    // 4. Update Income (if provided)
    if (income) {
      await c.env.DB.prepare('UPDATE accounts SET balance = balance + ? WHERE type = ? AND user_id = ?')
        .bind(Math.round(Number(income) * 100), 'checking', user.id).run();
    }

    return c.json({ 
      success: true, 
      data: { 
        message: `Successfully analyzed and imported ${transactions.length} transactions via AI.`,
        transactions,
        storage_key: objectKey
      } 
    });
  } catch (err: any) {
    return c.json({ success: false, error: { message: err.message } }, 500);
  }
});

// ==========================================
// DYNAMIC DATA GET ROUTES (Database Driven)
// ==========================================

app.get('/api/overview', authMiddleware, async (c) => {
  const user = c.get('user');
  
  // Dynamic Live Data
  const { results: accounts } = await c.env.DB.prepare('SELECT * FROM accounts WHERE user_id = ?').bind(user.id).all();
  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
  
  // Calculate true total spent
  const { results: allExpenses } = await c.env.DB.prepare('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?').bind(user.id).all();
  const totalSpent = (allExpenses[0]?.total as number) || 0;

  // Get exactly 5 recent transactions with Category Join (so UI icons work properly)
  const { results: recentTransactions } = await c.env.DB.prepare(`
    SELECT e.*, c.name as category_name, c.icon, c.color 
    FROM expenses e 
    LEFT JOIN categories c ON e.category_id = c.id 
    WHERE e.user_id = ? ORDER BY e.date DESC LIMIT 5
  `).bind(user.id).all();

  const { results: insights } = await c.env.DB.prepare('SELECT * FROM ai_insights WHERE user_id = ? AND is_dismissed = 0 ORDER BY created_at DESC LIMIT 1').bind(user.id).all();

  const { results: budgetsData } = await c.env.DB.prepare(`
    SELECT b.amount as limit_amount, bp.spent_amount, c.name, c.color 
    FROM budgets b 
    JOIN budget_periods bp ON b.id = bp.budget_id 
    JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = ?
  `).bind(user.id).all();

  const { results: bills } = await c.env.DB.prepare('SELECT * FROM bills WHERE user_id = ? AND status = "pending" ORDER BY due_date ASC LIMIT 2').bind(user.id).all();

  // Dynamic Health Score Logic (0-100) based on spending vs balance. 
  // If no balance, fallback to 50. If totalSpent is higher than totalBalance, score goes down.
  let healthScore = 100;
  let healthStatus = "Excellent Health";
  
  if (totalBalance > 0) {
    const spendingRatio = totalSpent / totalBalance;
    if (spendingRatio > 0.8) {
      healthScore = 40;
      healthStatus = "Critical budget usage";
    } else if (spendingRatio > 0.5) {
      healthScore = 70;
      healthStatus = "Budget usage high";
    } else if (spendingRatio > 0.2) {
      healthScore = 85;
      healthStatus = "Good standing";
    } else {
      healthScore = 95;
      healthStatus = "Excellent standing";
    }
  } else if (totalSpent > 0 && totalBalance === 0) {
    healthScore = 30;
    healthStatus = "Negative cash flow";
  } else {
    healthScore = 100;
    healthStatus = "Ready to start";
  }

  return c.json({
    success: true,
    data: {
      totalBalance,
      totalSpent,
      healthScore,
      healthStatus,
      recentTransactions,
      primaryInsight: insights[0] || null,
      budgetHealth: budgetsData,
      upcomingBills: bills
    }
  });
});

app.get('/api/transactions', authMiddleware, async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare(`
    SELECT e.*, c.name as category_name, c.icon, c.color 
    FROM expenses e 
    LEFT JOIN categories c ON e.category_id = c.id 
    WHERE e.user_id = ? ORDER BY e.date DESC
  `).bind(user.id).all();
  return c.json({ success: true, data: results });
});

app.post('/api/transactions', authMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  
  const expenseId = crypto.randomUUID();
  await c.env.DB.prepare('INSERT INTO expenses (id, user_id, category_id, amount, merchant, date, payment_method, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(expenseId, user.id, body.category_id, Math.round(body.amount * 100), body.merchant, new Date().toISOString(), body.payment_method || 'UPI', body.note || '').run();

  await c.env.DB.prepare('UPDATE accounts SET balance = balance - ? WHERE type = ? AND user_id = ?')
    .bind(Math.round(body.amount * 100), 'checking', user.id).run();

  return c.json({ success: true, message: 'Transaction added successfully' });
});

app.delete('/api/transactions', authMiddleware, async (c) => {
  const user = c.get('user');
  await c.env.DB.prepare('DELETE FROM expenses WHERE user_id = ?').bind(user.id).run();
  await c.env.DB.prepare('DELETE FROM bills WHERE user_id = ?').bind(user.id).run();
  await c.env.DB.prepare('DELETE FROM budgets WHERE user_id = ?').bind(user.id).run();
  await c.env.DB.prepare('DELETE FROM budget_periods').run();
  await c.env.DB.prepare('DELETE FROM ai_insights WHERE user_id = ?').bind(user.id).run();
  await c.env.DB.prepare('UPDATE accounts SET balance = 0 WHERE user_id = ?').bind(user.id).run();
  return c.json({ success: true, message: 'All user data wiped and reset' });
});

app.get('/api/budgets', authMiddleware, async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare(`
    SELECT b.id, b.amount as limit_amount, bp.spent_amount, c.name, c.color, c.icon 
    FROM budgets b 
    JOIN budget_periods bp ON b.id = bp.budget_id 
    JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = ?
  `).bind(user.id).all();
  return c.json({ success: true, data: results });
});

app.post('/api/budgets', authMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const budgetId = crypto.randomUUID();
  
  await c.env.DB.prepare('INSERT INTO budgets (id, user_id, category_id, amount, period) VALUES (?, ?, ?, ?, ?)')
    .bind(budgetId, user.id, body.category_id, Math.round(body.amount * 100), 'monthly').run();
    
  await c.env.DB.prepare('INSERT INTO budget_periods (id, budget_id, start_date, end_date, spent_amount) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), budgetId, new Date().toISOString(), new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString(), 0).run();

  return c.json({ success: true, message: 'Budget created successfully' });
});

app.get('/api/bills', authMiddleware, async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare('SELECT * FROM bills WHERE user_id = ? ORDER BY due_date ASC').bind(user.id).all();
  return c.json({ success: true, data: results });
});

app.post('/api/bills', authMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  
  await c.env.DB.prepare('INSERT INTO bills (id, user_id, merchant, amount, due_date, status, is_recurring, recurrence_interval) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), user.id, body.merchant, Math.round(body.amount * 100), body.due_date, 'pending', body.is_recurring ? 1 : 0, 'monthly').run();

  return c.json({ success: true, message: 'Bill added successfully' });
});

app.get('/api/goals', authMiddleware, async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare('SELECT * FROM savings_goals WHERE user_id = ?').bind(user.id).all();
  return c.json({ success: true, data: results });
});

app.post('/api/goals', authMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  
  await c.env.DB.prepare('INSERT INTO savings_goals (id, user_id, name, target_amount, current_amount, monthly_contribution, target_date) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), user.id, body.name, Math.round(body.target_amount * 100), 0, Math.round(body.monthly_contribution * 100), body.target_date).run();

  return c.json({ success: true, message: 'Goal created successfully' });
});

app.get('/api/insights', authMiddleware, async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare('SELECT * FROM ai_insights WHERE user_id = ? AND is_dismissed = 0 ORDER BY created_at DESC').bind(user.id).all();
  return c.json({ success: true, data: results });
});

app.post('/api/insights/generate', authMiddleware, async (c) => {
  const user = c.get('user');
  
  try {
    const { results: expenses } = await c.env.DB.prepare('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC LIMIT 20').bind(user.id).all();
    const { results: budgets } = await c.env.DB.prepare(`
      SELECT b.amount as limit_amount, bp.spent_amount, c.name as category_name
      FROM budgets b 
      JOIN budget_periods bp ON b.id = bp.budget_id 
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = ?
    `).bind(user.id).all();

    const llm = new LLMProvider(c.env.OPENROUTER_API_KEY);
    const insight = await llm.generateInsight(expenses, budgets);

    await c.env.DB.prepare('INSERT INTO ai_insights (id, user_id, type, severity, title, description, evidence, recommendation, action_type, is_dismissed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(
        crypto.randomUUID(), 
        user.id, 
        insight.type || 'anomaly', 
        insight.severity || 'medium', 
        insight.title || 'New Insight', 
        insight.description || 'Generated insight.', 
        insight.evidence || '', 
        insight.recommendation || '', 
        insight.action_type || 'Review', 
        0
      ).run();

    return c.json({ success: true, message: 'Insight generated successfully' });
  } catch(err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

import { html } from 'hono/html';

app.get('/api/debug/dump', async (c) => {
  const { results: users } = await c.env.DB.prepare('SELECT * FROM users').all();
  const { results: expenses } = await c.env.DB.prepare('SELECT * FROM expenses').all();
  const { results: budgets } = await c.env.DB.prepare('SELECT * FROM budgets').all();
  const { results: bills } = await c.env.DB.prepare('SELECT * FROM bills').all();
  const { results: goals } = await c.env.DB.prepare('SELECT * FROM savings_goals').all();
  
  const renderTable = (name: string, rows: any[]) => {
    if (!rows || rows.length === 0) return html`<h3>${name} (Empty)</h3>`;
    const cols = Object.keys(rows[0]);
    return html`
      <div class="table-container">
        <h3>${name} <span class="badge">${rows.length} rows</span></h3>
        <table>
          <thead>
            <tr>${cols.map(col => html`<th>${col}</th>`)}</tr>
          </thead>
          <tbody>
            ${rows.map(row => html`
              <tr>${cols.map(col => html`<td>${row[col] !== null ? String(row[col]) : 'NULL'}</td>`)}</tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  };

  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SmartWallet Database Viewer</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #111827; padding: 2rem; margin: 0; }
        .header { display: flex; justify-content: space-between; items-align: center; margin-bottom: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; }
        h1 { margin: 0; font-size: 1.5rem; }
        .table-container { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; margin-bottom: 2rem; overflow-x: auto; }
        h3 { margin-top: 0; display: flex; align-items: center; gap: 0.5rem; }
        .badge { background: #e0e7ff; color: #4338ca; padding: 0.2rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; font-size: 0.875rem; }
        th { background: #f9fafb; padding: 0.75rem 1rem; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
        td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; color: #374151; }
        tr:hover { background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🗄️ Local D1 Database Viewer</h1>
        <div><strong>Status:</strong> <span style="color: #10B981;">Online</span></div>
      </div>
      ${renderTable('Users', users)}
      ${renderTable('Expenses (Transactions)', expenses)}
      ${renderTable('Budgets', budgets)}
      ${renderTable('Bills', bills)}
      ${renderTable('Savings Goals', goals)}
    </body>
    </html>
  `);
});

export default app;
