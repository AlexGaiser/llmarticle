import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { corsConfig } from '@/config/cors';
import { articlesRouter } from '@/routes/articles';
import { authRouter } from '@/routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
