import { Router } from 'express';
import { prisma } from '@/db/prisma';

export const articlesRouter = Router();

articlesRouter.get('/', async (req, res) => {
  try {
    const articles = await prisma.userArticle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

articlesRouter.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const article = await prisma.userArticle.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});
