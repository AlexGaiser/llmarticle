import { CookieOptions, Request } from 'express';

const ALLOWED_DOMAINS = ['alexgaiser.com', 'alexbuildsit.net'];

export const getCookieOptions = (req: Request): CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  const origin = req.headers.origin || '';

  const options: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-site cookies in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Dynamically set domain if origin matches allowlist
  if (isProd) {
    const matchedDomain = ALLOWED_DOMAINS.find(
      (domain) => origin.endsWith(`.${domain}`) || origin === `https://${domain}`,
    );

    if (matchedDomain) {
      options.domain = `.${matchedDomain}`;
    }
  }

  return options;
};

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}

export const TOKEN_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d', // Fixed value or env
};
