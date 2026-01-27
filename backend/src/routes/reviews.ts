import { Router, Response } from 'express';
import { authMiddleware } from '@/middleware/auth';
import {
  createUserReview,
  getAllPublicReviews,
  getPublicReviewsByAuthor,
  getReviewsByAuthorId,
  updateReview,
  deleteReview,
} from '@/services/review.service';
import { CreateReviewRequest, UpdateReviewRequest } from '@/types/reviews/review.requests.model';
import { AuthRequest } from '@/types';
import { UserId } from '@/types/data/User.model';
import { ReviewId, ReviewData, CreateUpdateReviewData } from '@/types/data/UserReview.model';
import { UpdateReviewParams } from '@/types/requests/review.request';
import { ErrorResponseBody } from '@/types/requests/error.response';

export const reviewsRouter = Router();

reviewsRouter.get(
  '/public',
  async (_req, res: Response<{ reviews: ReviewData[] } | ErrorResponseBody>) => {
    try {
      const reviews = await getAllPublicReviews();
      res.json({ reviews });
    } catch (error) {
      console.error('Error fetching public reviews:', error);
      res.status(500).json({ error: 'Failed to fetch public reviews' });
    }
  },
);

reviewsRouter.post(
  '/',
  authMiddleware,
  async (req: CreateReviewRequest, res: Response<ReviewData | ErrorResponseBody>) => {
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
  },
);

reviewsRouter.get(
  '/',
  authMiddleware,
  async (req: AuthRequest, res: Response<{ reviews: ReviewData[] } | ErrorResponseBody>) => {
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
  },
);

reviewsRouter.get(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response<{ reviews: ReviewData[] } | ErrorResponseBody>) => {
    try {
      const { id } = req.params;
      const { userId } = req;

      if (!id || !userId) {
        res.status(400).json({ error: 'Invalid parameters' });
        return;
      }

      const authorizedUser = userId === id;
      const authorId = UserId(id);

      if (!authorizedUser) {
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
  },
);

reviewsRouter.put<UpdateReviewParams, any, CreateUpdateReviewData>(
  '/:id',
  authMiddleware,
  async (req: UpdateReviewRequest, res: Response<ReviewData | ErrorResponseBody>) => {
    try {
      const { id } = req.params;
      const { userId } = req;

      if (!id || !userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const review = await updateReview(ReviewId(id), userId, req.body);
      res.json(review);
    } catch (error: any) {
      if (error.message === 'Review not found or unauthorized') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
      }
    }
  },
);

reviewsRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    if (!id || !userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await deleteReview(id, userId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Review not found or unauthorized') {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }
});
