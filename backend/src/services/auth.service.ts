import bcrypt from 'bcryptjs';
import { prisma } from '@/db/prisma';
import { generateToken } from '@/utils/token';
import { UserDAO } from '@/db/UserDAO';
import { UserId, UserName, UserEmail, User } from '@/types/data/User.model';

interface AuthResult {
  token: string;
  user: User;
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

  const token = generateToken(UserId(user.id));
  return {
    token,
    user: {
      id: UserId(user.id),
      username: UserName(user.username),
      email: user.email ? UserEmail(user.email) : undefined,
    },
  };
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

  const token = generateToken(UserId(user.id));
  return {
    token,
    user: {
      id: UserId(user.id),
      username: UserName(user.username),
    },
  };
};

export const getCurrentUser = async (userId: UserId): Promise<User | null> => {
  const user = await UserDAO.findUnique({
    where: { id: userId },
    select: { id: true, username: true, createdAt: true, email: true },
  });

  if (!user) return null;

  return {
    id: UserId(user.id),
    username: UserName(user.username),
    createdAt: user.createdAt,
  };
};
