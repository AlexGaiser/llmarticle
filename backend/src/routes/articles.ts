import { Router, Response } from 'express';
import { authMiddleware } from '@/middleware/auth';
import { AuthRequest } from '@/types';
import { ArticleService } from '@/services/article.service';
import {
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@/types/articles/articles.requests.model';

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

articlesRouter.post('/', authMiddleware, async (req: CreateArticleRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const { userId } = req;

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

articlesRouter.put('/:id', authMiddleware, async (req: UpdateArticleRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!id) {
      res.status(400).json({ error: 'Article ID is required' });
      return;
    }
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, content } = req.body;
    const article = await ArticleService.update(id, userId!, { title, content });
    res.json(article);
  } catch (error: any) {
    if (error.message === 'Article not found or unauthorized') {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Failed to update article' });
    }
  }
});

articlesRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await ArticleService.delete(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Article not found or unauthorized') {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  }
});
