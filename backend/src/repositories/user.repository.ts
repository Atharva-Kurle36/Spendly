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

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = ?`;
    return await this.db.prepare(query).bind(email).first<User>();
  }

  async createUserWithPassword(id: string, email: string, name: string, passwordHash: string): Promise<User> {
    const query = `
      INSERT INTO users (id, email, name, password_hash)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `;
    const result = await this.db.prepare(query).bind(
      id,
      email,
      name,
      passwordHash
    ).first<User>();

    if (!result) throw new Error("Failed to create user");
    return result;
  }
}
