import request from 'supertest';
import { app } from '@/server';
import * as ReviewService from '@/services/review.service';
import { UserId } from '@/types/data/User.model';
import { ReviewId, ReviewData } from '@/types/data/UserReview.model';

jest.mock('@/services/review.service');
jest.mock('@/middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.userId = 'user-1';
    next();
  },
}));

describe('Reviews Router Integration', () => {
  const mockReview: ReviewData = {
    id: ReviewId('review-1'),
    title: 'Test Review',
    content: 'Great content',
    rating: 5,
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: UserId('user-1'),
      username: 'User 1' as any,
    },
  };

  const mockPublicReview: ReviewData = { ...mockReview };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/reviews/public', () => {
    it('should return a list of public reviews', async () => {
      (ReviewService.getAllPublicReviews as jest.Mock).mockResolvedValue([mockPublicReview]);

      const response = await request(app).get('/v1/reviews/public');

      expect(response.status).toBe(200);
      expect(response.body.reviews).toHaveLength(1);
      expect(response.body.reviews[0].id).toBe(mockPublicReview.id);
      expect(ReviewService.getAllPublicReviews).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      (ReviewService.getAllPublicReviews as jest.Mock).mockRejectedValue(
        new Error('Service error'),
      );

      const response = await request(app).get('/v1/reviews/public');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch public reviews' });
    });
  });

  describe('POST /v1/reviews', () => {
    it('should create a new review', async () => {
      (ReviewService.createUserReview as jest.Mock).mockResolvedValue(mockReview);

      const response = await request(app).post('/v1/reviews').send({
        title: 'Test Review',
        content: 'Great content',
        rating: 5,
        isPrivate: false,
        authorId: 'user-1',
        reviewLink: undefined,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockReview.id);
      expect(ReviewService.createUserReview).toHaveBeenCalledWith({
        title: 'Test Review',
        content: 'Great content',
        rating: 5,
        isPrivate: false,
        authorId: 'user-1',
        reviewLink: undefined,
      });
    });
  });

  describe('GET /v1/reviews', () => {
    it('should return authenticated user reviews', async () => {
      (ReviewService.getReviewsByAuthorId as jest.Mock).mockResolvedValue([mockReview]);

      const response = await request(app).get('/v1/reviews');

      expect(response.status).toBe(200);
      expect(response.body.reviews).toHaveLength(1);
      expect(ReviewService.getReviewsByAuthorId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('GET /v1/reviews/:id', () => {
    it('should return a specific review by ID for owner', async () => {
      // Mocking auth to match the ID requested for ownership
      jest
        .spyOn(require('@/middleware/auth'), 'authMiddleware')
        .mockImplementation((req: any, res: any, next: any) => {
          req.userId = 'user-1';
          next();
        });

      (ReviewService.getReviewsByAuthorId as jest.Mock).mockResolvedValue([mockReview]);

      const response = await request(app).get('/v1/reviews/user-1'); // Treating ID as user ID based on logic logic

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /v1/reviews/:id', () => {
    it('should update a review', async () => {
      (ReviewService.updateReview as jest.Mock).mockResolvedValue(mockReview);

      const response = await request(app).put('/v1/reviews/review-1').send({
        title: 'Updated Title',
        content: 'Updated Content',
        rating: 4,
        isPrivate: true,
        authorId: 'user-1',
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(mockReview.title);
      expect(ReviewService.updateReview).toHaveBeenCalledWith(expect.anything(), 'user-1', {
        title: 'Updated Title',
        content: 'Updated Content',
        rating: 4,
        isPrivate: true,
        authorId: 'user-1',
      });
    });

    it('should return 404 if review not found', async () => {
      (ReviewService.updateReview as jest.Mock).mockRejectedValue(
        new Error('Review not found or unauthorized'),
      );

      const response = await request(app).put('/v1/reviews/review-999').send({
        title: 'Updated Title',
        content: 'Updated Content',
        rating: 4,
        isPrivate: true,
        authorId: 'user-1',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Review not found or unauthorized' });
    });
  });

  describe('DELETE /v1/reviews/:id', () => {
    it('should delete a review', async () => {
      (ReviewService.deleteReview as jest.Mock).mockResolvedValue(mockReview);

      const response = await request(app).delete('/v1/reviews/review-1');

      expect(response.status).toBe(204);
      expect(ReviewService.deleteReview).toHaveBeenCalledWith('review-1', 'user-1');
    });

    it('should return 404 if review not found', async () => {
      (ReviewService.deleteReview as jest.Mock).mockRejectedValue(
        new Error('Review not found or unauthorized'),
      );

      const response = await request(app).delete('/v1/reviews/review-999');

      expect(response.status).toBe(404);
    });
  });
});
