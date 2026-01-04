import { CookieOptions } from 'express';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true, // Only send over HTTPS
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}

export const TOKEN_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d', // Fixed value or env
};
