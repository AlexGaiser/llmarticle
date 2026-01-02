import { CorsOptions } from 'cors';

const corsOrigin = ['http://localhost:5173'];

export const corsConfig: CorsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
