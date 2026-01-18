import bcrypt from 'bcryptjs';
import { prisma } from '@/db/prisma';
import { generateToken } from '@/utils/token';
import { UserPublic } from '@/types';
import { UserDAO } from '@/db/UserDAO';

interface AuthResult {
  token: string;
  user: UserPublic;
}

export const registerUser = async (
  username: string,
  password: string,
  email?: string,
): Promise<AuthResult> => {
  const existingUser = await UserDAO.findUnique({ where: { username } });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  if (email) {
    const existingEmail = await UserDAO.findUnique({ where: { email } });
    if (existingEmail) {
      throw new Error('Email already exists');
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserDAO.create({
    data: { username, email, password: hashedPassword },
  });

  const token = generateToken(user.id);
  return { token, user: { id: user.id, username: user.username } };
};

export const loginUser = async (identifier: string, password: string): Promise<AuthResult> => {
  const user = await UserDAO.findUnique({ where: { username: identifier } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);
  return { token, user: { id: user.id, username: user.username } };
};

export const getCurrentUser = async (userId: string): Promise<UserPublic | null> => {
  const user = await UserDAO.findUnique({
    where: { id: userId },
    select: { id: true, username: true, createdAt: true },
  });
  return user;
};
