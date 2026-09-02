import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Hackathon Fallback: If no token is provided, assume default user
    c.set('user', { id: 'user_12345', email: 'aryan@example.com', name: 'Aryan' });
    return await next();
  }

  const token = authHeader.split(' ')[1];

  try {
    // For Hackathon reliability and speed on Cloudflare Workers,
    // we parse the Firebase JWT payload without strict remote JWKS validation.
    // In production, use a library like 'jose' to verify against Google's public keys.
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token expired' } }, 401);
    }

    const userId = payload.user_id || payload.sub;
    const email = payload.email || '';
    const name = payload.name || 'User';

    // Inject into Hono context
    c.set('user', { id: userId, email, name });
    
    await next();
  } catch (err) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, 401);
  }
};
