import { User } from '../types';

export class UserRepository {
  constructor(private db: D1Database) {}

  async createOrUpdate(user: Pick<User, 'id' | 'email' | 'name'>): Promise<User> {
    const query = `
      INSERT INTO users (id, email, name)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await this.db.prepare(query).bind(
      user.id,
      user.email,
      user.name
    ).first<User>();
    
    if (!result) throw new Error("Failed to create or update user");
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = ?`;
    return await this.db.prepare(query).bind(id).first<User>();
  }
}
