import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { Env } from '../types';

export const authMiddleware = async (c: Context<{ Bindings: Env, Variables: { user: any } }>, next: Next) => {
  if (c.req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' } }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET, "HS256");
    
    // Check expiration (hono/jwt verify already does this if 'exp' is present, but good to be explicit or if there are other custom checks)
    if (payload.exp && (payload.exp as number) * 1000 < Date.now()) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token expired' } }, 401);
    }

    const userId = payload.sub || payload.user_id;
    const email = payload.email || '';
    const name = payload.name || 'User';

    // Inject into Hono context
    c.set('user', { id: userId, email, name });
    
    await next();
  } catch (err: any) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: `Invalid token: ${err.message}`, name: err.name, stack: err.stack } }, 401);
  }
};
