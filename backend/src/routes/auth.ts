import { Router, Request, Response } from 'express';
import { AuthRequest } from '@/types';
import { authMiddleware } from '@/middleware/auth';
import { registerUser, loginUser, getCurrentUser } from '@/services/auth.service';
import { COOKIE_OPTIONS } from '@/config/auth';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { token, user } = await registerUser(email, password);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to register user';
    const status = message === 'User already exists' ? 409 : 500;
    res.status(status).json({ error: message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { token, user } = await loginUser(email, password);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to login';
    const status = message === 'Invalid credentials' ? 401 : 500;
    res.status(status).json({ error: message });
  }
});

authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
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
