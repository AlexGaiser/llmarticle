import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '@/types';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

/**
 * Extracts Bearer token from Authorization header
 * @returns token string or null if not found/invalid
 */
export const extractBearerToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // 'Bearer '.length === 7
};

/**
 * Type guard for JWT payload
 */
const isJwtPayload = (decoded: unknown): decoded is JwtPayload => {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    typeof (decoded as JwtPayload).userId === 'string'
  );
};

/**
 * Verifies JWT token and returns payload
 * @throws Error if token is invalid
 */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!isJwtPayload(decoded)) {
    throw new Error('Invalid token payload');
  }

  return decoded;
};

/**
 * Generates a JWT token for a user
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
