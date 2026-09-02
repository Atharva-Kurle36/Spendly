import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { authMiddleware } from './middleware/auth.middleware';
import { ExpenseRepository } from './repositories/expense.repository';
import { UserRepository } from './repositories/user.repository';
import { BudgetRepository } from './repositories/budget.repository';
import { LLMProvider } from './ai/llm-provider';

const app = new Hono<{ Bindings: Env; Variables: { user: any } }>();

app.use('*', cors());

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

// Bank Statement Import Route
app.post('/api/transactions/import', authMiddleware, async (c) => {
  const user = c.get('user');
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    
    if (!file) {
      return c.json({ success: false, error: { message: 'No file uploaded' } }, 400);
    }
    
    // 1. Save to R2 for audit/storage
    const objectKey = `statements/${user.id}/${Date.now()}-${file.name}`;
    await c.env.RECEIPTS_BUCKET.put(objectKey, await file.arrayBuffer());
    
    // 2. Parse CSV text
    const text = await file.text();
    const rows = text.split('\n').filter(r => r.trim() !== '');
    
    // Very basic CSV parsing (assuming Date, Merchant, Amount structure)
    // In a real system, you'd use PapaParse or similar.
    const transactions = [];
    const expenseRepo = new ExpenseRepository(c.env.DB);
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 3) {
        // Mock parsing logic based on standard bank CSV: Date, Description, Amount
        const date = cols[0];
        const merchant = cols[1];
        let amountStr = cols[cols.length - 1]; // Assume amount is last for safety
        let amountNum = parseFloat(amountStr) || 0;
        
        // Handle negative amounts as expenses
        if (amountNum < 0) amountNum = Math.abs(amountNum);
        
        // Skip empty or zero transactions
        if (amountNum === 0 || !merchant) continue;
        
        const expense = await expenseRepo.create({
          id: crypto.randomUUID(),
          user_id: user.id,
          category_id: null, // AI will categorize later
          amount: Math.round(amountNum * 100), // convert to paise
          merchant: merchant,
          date: new Date(date).toISOString() || new Date().toISOString(),
          payment_method: 'imported_statement',
          note: `Imported from ${file.name}`
        });
        
        transactions.push(expense);
      }
    }
    
    // In a full implementation, you'd feed these newly inserted transactions to the LLM
    // to auto-categorize them. We omit that here to prevent hitting API limits during massive imports,
    // but the structure supports it.
    
    return c.json({ 
      success: true, 
      data: { 
        message: `Successfully imported ${transactions.length} transactions.`,
        transactions,
        storage_key: objectKey
      } 
    });
  } catch (err: any) {
    return c.json({ success: false, error: { message: err.message } }, 500);
  }
});

export default app;
