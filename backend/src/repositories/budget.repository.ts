import { Budget } from '../types';

export class BudgetRepository {
  constructor(private db: D1Database) {}

  async create(budget: Omit<Budget, 'created_at' | 'updated_at'>): Promise<Budget> {
    const id = budget.id || crypto.randomUUID();
    const query = `
      INSERT INTO budgets (id, user_id, category_id, amount, period)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `;
    const result = await this.db.prepare(query).bind(
      id,
      budget.user_id,
      budget.category_id,
      budget.amount,
      budget.period
    ).first<Budget>();
    
    if (!result) throw new Error("Failed to create budget");
    return result;
  }

  async findAllByUserId(userId: string): Promise<Budget[]> {
    const query = `SELECT * FROM budgets WHERE user_id = ?`;
    const result = await this.db.prepare(query).bind(userId).all<Budget>();
    return result.results || [];
  }
}
