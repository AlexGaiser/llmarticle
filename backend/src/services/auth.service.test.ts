import { registerUser, loginUser } from './auth.service';
import { prisma } from '@/db/prisma';
import bcrypt from 'bcryptjs';

jest.mock('@/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@/utils/token', () => ({
  generateToken: jest.fn(() => 'mock-token'),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      const result = await registerUser('test@example.com', 'password');

      expect(result).toEqual({
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' },
      });
    });

    it('should throw error if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(registerUser('test@example.com', 'password')).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('loginUser', () => {
    it('should login a user with valid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await loginUser('test@example.com', 'password');

      expect(result).toEqual({
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' },
      });
    });

    it('should throw error with invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(loginUser('test@example.com', 'password')).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
