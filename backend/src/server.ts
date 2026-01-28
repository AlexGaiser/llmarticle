import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { corsConfig } from '@/config/cors';
import { articlesRouter } from '@/routes/articles';
import { authRouter } from '@/routes/auth';
import { reviewsRouter } from '@/routes/reviews';

export const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.use('/v1/auth', authRouter);
app.use('/v1/articles', articlesRouter);
app.use('/v1/reviews', reviewsRouter);

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
