import { CorsOptions } from 'cors';

const corsOrigin = ['http://localhost:5173', 'https://llmarticle.alexgaiser.dev'];

export const corsConfig: CorsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
