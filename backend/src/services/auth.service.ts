import bcrypt from 'bcryptjs';
import { prisma } from '@/db/prisma';
import { generateToken } from '@/utils/token';
import { UserPublic } from '@/types';
import { UserDAO } from '@/db/UserDAO';

interface AuthResult {
  token: string;
  user: UserPublic;
}

export const registerUser = async (email: string, password: string): Promise<AuthResult> => {
  const existingUser = await UserDAO.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserDAO.create({
    data: { email, password: hashedPassword },
  });

  const token = generateToken(user.id);
  return { token, user: { id: user.id, email: user.email } };
};

export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  const user = await UserDAO.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);
  return { token, user: { id: user.id, email: user.email } };
};

export const getCurrentUser = async (userId: string): Promise<UserPublic | null> => {
  const user = await UserDAO.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });
  return user;
};
