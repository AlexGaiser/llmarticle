import { CorsOptions } from 'cors';

const corsOrigin = [
  'http://localhost:5173',
  'https://llmarticle.alexbuildsit.net',
  'https://llmarticle.alexgaiser.com',
];

export const corsConfig: CorsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
