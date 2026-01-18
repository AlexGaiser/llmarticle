import jwt from 'jsonwebtoken';
import { extractBearerToken, verifyToken, generateToken } from './token';
import { UserId } from '@/model/User.model';
import { TOKEN_CONFIG } from '@/config/auth';

describe('Token Utilities', () => {
  describe('extractBearerToken', () => {
    it('should extract token from valid Bearer header', () => {
      expect(extractBearerToken('Bearer my-token')).toBe('my-token');
    });

    it('should return null if header is missing', () => {
      expect(extractBearerToken(undefined)).toBeNull();
    });

    it('should return null if header does not start with Bearer', () => {
      expect(extractBearerToken('Token my-token')).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('should return payload for valid token', () => {
      const payload = { userId: '123' };
      const token = jwt.sign(payload, TOKEN_CONFIG.secret);

      const result = verifyToken(token);
      expect(result.userId).toBe('123');
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw error for token with missing userId', () => {
      const token = jwt.sign({ foo: 'bar' }, TOKEN_CONFIG.secret);
      expect(() => verifyToken(token)).toThrow('Invalid token payload');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT', () => {
      const userId = '123';
      const token = generateToken(UserId(userId));

      const decoded = jwt.verify(token, TOKEN_CONFIG.secret) as any;
      expect(decoded.userId).toBe(userId);
    });
  });
});
