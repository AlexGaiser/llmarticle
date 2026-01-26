import { Router, Response } from 'express';
import { authMiddleware } from '@/middleware/auth';
import {
  createUserReview,
  getPublicReviewsByAuthor,
  getReviewsByAuthor as getReviewsByAuthorId,
} from '@/services/review.service';
import { CreateReviewRequest } from '@/types/reviews/review.requests.model';
import { AuthRequest } from '@/types';
import { UserId } from '@/types/data/User.model';
export const reviewsRouter = Router();

reviewsRouter.post('/', authMiddleware, async (req: CreateReviewRequest, res: Response) => {
  try {
    const { content, rating, title, reviewLink, isPrivate } = req.body;
    const { userId } = req;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const review = await createUserReview({
      rating,
      content,
      title,
      reviewLink,
      isPrivate,
      authorId: userId,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

reviewsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const reviews = await getReviewsByAuthorId(req.userId!);
    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

reviewsRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const authorizedUser = req.userId === req.params.id;

    const authorId = UserId(req.params.id);
    if (!authorizedUser) {
      // TODO implement a polymorphic system to handle private and public requests
      const reviews = await getPublicReviewsByAuthor(authorId);
      res.json({ reviews });
    } else {
      const reviews = await getReviewsByAuthorId(authorId);
      res.json({ reviews });
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
