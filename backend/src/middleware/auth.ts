import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { verifyToken } from '@/utils/token';

export const authMiddleware = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  req: AuthRequest<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'Authorization token required' });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
