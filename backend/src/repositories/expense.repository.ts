import { Expense } from '../types';

export class ExpenseRepository {
  constructor(private db: D1Database) {}

  async create(expense: Omit<Expense, 'created_at' | 'updated_at'>): Promise<Expense> {
    const id = expense.id || crypto.randomUUID();
    const query = `
      INSERT INTO expenses (id, user_id, category_id, amount, merchant, date, payment_method, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;
    const result = await this.db.prepare(query).bind(
      id,
      expense.user_id,
      expense.category_id,
      expense.amount,
      expense.merchant,
      expense.date,
      expense.payment_method,
      expense.note
    ).first<Expense>();
    
    if (!result) throw new Error("Failed to create expense");
    return result;
  }

  async findById(id: string, userId: string): Promise<Expense | null> {
    const query = `SELECT * FROM expenses WHERE id = ? AND user_id = ?`;
    return await this.db.prepare(query).bind(id, userId).first<Expense>();
  }

  async findAllByUserId(userId: string): Promise<Expense[]> {
    const query = `SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC`;
    const result = await this.db.prepare(query).bind(userId).all<Expense>();
    return result.results || [];
  }

  async update(id: string, userId: string, updates: Partial<Expense>): Promise<Expense | null> {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) return this.findById(id, userId);
    
    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id, userId);
    
    const query = `
      UPDATE expenses 
      SET ${fields.join(', ')} 
      WHERE id = ? AND user_id = ? 
      RETURNING *
    `;
    
    return await this.db.prepare(query).bind(...values).first<Expense>();
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const query = `DELETE FROM expenses WHERE id = ? AND user_id = ?`;
    const result = await this.db.prepare(query).bind(id, userId).run();
    return result.meta.changes > 0;
  }
}
