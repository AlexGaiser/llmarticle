import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '@/types';
import { TOKEN_CONFIG } from '@/config/auth';
import { UserId } from '@llmarticle/shared/types';

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
 * Ref: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
const isJwtPayload = (decoded: unknown): decoded is JwtPayload => {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    typeof (decoded as Record<string, unknown>).userId === 'string'
  );
};

/**
 * Verifies JWT token and returns payload
 * @throws Error if token is invalid
 */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, TOKEN_CONFIG.secret);

  if (!isJwtPayload(decoded)) {
    throw new Error('Invalid token payload');
  }

  return decoded;
};

/**
 * Generates a JWT token for a user
 */
export const generateToken = (userId: UserId): string => {
  return jwt.sign({ userId }, TOKEN_CONFIG.secret, {
    expiresIn: TOKEN_CONFIG.expiresIn as SignOptions['expiresIn'],
  });
};
