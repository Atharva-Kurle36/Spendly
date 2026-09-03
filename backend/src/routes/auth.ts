import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Env } from '../types';
import { UserRepository } from '../repositories/user.repository';

const authRoutes = new Hono<{ Bindings: Env }>();

// Simple SHA-256 hash function (in a real app, use bcrypt/argon2)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

authRoutes.post('/register', async (c) => {
  const { name, email, password } = await c.req.json();
  
  if (!name || !email || !password) {
    return c.json({ success: false, error: { message: 'Missing required fields' } }, 400);
  }

  const cleanEmail = email.trim().toLowerCase();
  const userRepo = new UserRepository(c.env.DB);
  
  // Check if user already exists
  const existingUser = await userRepo.findByEmail(cleanEmail);
  if (existingUser) {
    return c.json({ success: false, error: { message: 'An account with this email already exists' } }, 400);
  }

  const id = `user_${crypto.randomUUID()}`;
  const passwordHash = await hashPassword(password);
  
  try {
    const user = await userRepo.createUserWithPassword(id, cleanEmail, name.trim(), passwordHash);
    
    // Initialize default checking account
    await c.env.DB.prepare('INSERT INTO accounts (id, user_id, name, type, balance) VALUES (?, ?, ?, ?, ?)')
      .bind(`acc_${crypto.randomUUID()}`, user.id, 'Main Checking', 'checking', 0).run();

    // Generate JWT
    const token = await sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    }, c.env.JWT_SECRET);
    
    // Remove password hash from response
    const { password_hash, ...safeUser } = user;
    
    return c.json({ success: true, data: { user: safeUser, token } });
  } catch (error: any) {
    return c.json({ success: false, error: { message: error.message } }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  
  if (!email || !password) {
    return c.json({ success: false, error: { message: 'Missing required fields' } }, 400);
  }

  const cleanEmail = email.trim().toLowerCase();
  const userRepo = new UserRepository(c.env.DB);
  const user = await userRepo.findByEmail(cleanEmail);
  
  if (!user || !user.password_hash) {
    return c.json({ success: false, error: { message: 'Invalid email or password' } }, 401);
  }

  const attemptHash = await hashPassword(password);
  if (attemptHash !== user.password_hash) {
    return c.json({ success: false, error: { message: 'Invalid email or password' } }, 401);
  }

  // Generate JWT
  const token = await sign({
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  }, c.env.JWT_SECRET);

  // Don't send password hash to client
  const { password_hash, ...safeUser } = user;

  return c.json({ success: true, data: { user: safeUser, token } });
});

export { authRoutes };
