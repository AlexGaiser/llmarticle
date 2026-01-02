import { Router, Response } from 'express';
import { authMiddleware } from '@/middleware/auth';
import { AuthRequest } from '@/types';
import { ArticleService } from '@/services/article.service';

export const articlesRouter = Router();

articlesRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const articles = await ArticleService.findByAuthor(req.userId!);
    res.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

articlesRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const article = await ArticleService.create({
      title,
      content,
      authorId: req.userId!,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});
