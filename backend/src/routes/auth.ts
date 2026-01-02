import { Router, Request, Response } from 'express';
import { AuthRequest } from '@/types';
import { authMiddleware } from '@/middleware/auth';
import { registerUser, loginUser, getCurrentUser } from '@/services/auth.service';

export const authRouter = Router();

/**
 * TODO: Implement HttpOnly cookies for session management.
 * 1. Update response to set 'Set-Cookie' header.
 * 2. Remove token from JSON response body.
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const result = await registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to register user';
    const status = message === 'User already exists' ? 409 : 500;
    res.status(status).json({ error: message });
  }
});

/**
 * TODO: Implement HttpOnly cookies for session management.
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to login';
    const status = message === 'Invalid credentials' ? 401 : 500;
    res.status(status).json({ error: message });
  }
});

authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Failed to get user' });
  }
});
