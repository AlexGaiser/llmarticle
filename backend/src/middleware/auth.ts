import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { extractBearerToken, verifyToken } from '@/utils/token';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  /**
   * TODO: Migrate to HttpOnly cookies.
   * Extract token from req.cookies['token'] instead of Authorization header.
   */
  const token = extractBearerToken(req.headers.authorization);

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
