import request from 'supertest';
import { app } from '@/server';
import * as ArticleService from '@/services/article.service';
import * as ReviewService from '@/services/review.service';
import { FeedItemType } from '@/types/data/FeedItem.model';
import { UserId, UserName } from '@/types/data/User.model';
import { ArticleData, ArticleId } from '@/types/data/UserArticle.model';
import { ReviewData, ReviewId } from '@/types/data/UserReview.model';
import { encodeCursor } from '@/routes/utils/paginationUtils';

jest.mock('@/services/article.service');
jest.mock('@/services/review.service');

describe('Feed Router Integration', () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const mockArticle: ArticleData = {
    id: ArticleId('article-1'),
    title: 'Test Article',
    content: 'Article content',
    isPrivate: false,
    createdAt: twoHoursAgo,
    updatedAt: now,
    author: {
      id: UserId('user-1'),
      username: UserName('User 1'),
    },
  };

  const mockReview: ReviewData = {
    id: ReviewId('review-1'),
    title: 'Test Review',
    content: 'Review content',
    rating: 5,
    isPrivate: false,
    createdAt: twoHoursAgo,
    updatedAt: oneHourAgo,
    author: {
      id: UserId('user-2'),
      username: UserName('User 2'),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/feed', () => {
    it('should return combined articles and reviews sorted by updatedAt with nextCursor', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([
        mockArticle,
        {
          ...mockArticle,
          id: ArticleId('article-2'),
          updatedAt: twoHoursAgo, // first review is two hours ago
        },
      ]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([
        mockReview,
        {
          ...mockReview,
          id: ReviewId('review-2'),
          updatedAt: new Date(mockReview.updatedAt.getTime() - 1000),
        },
      ]);

      const response = await request(app).get('/v1/feed').query({ limit: '2' });
      expect(response.status).toBe(200);
      expect(response.body.feed).toHaveLength(2);
      expect(response.body.nextCursor).toBeDefined();
      // Article has newer updatedAt (now) so should be first
      expect(response.body.feed[0].type).toBe(FeedItemType.Article);
      expect(response.body.feed[0].id).toBe(mockArticle.id);
      // Review has older updatedAt (oneHourAgo) so should be second
      expect(response.body.feed[1].type).toBe(FeedItemType.Review);
      expect(response.body.feed[1].id).toBe(mockReview.id);
    });

    it('should return empty feed with undefined nextCursor when no public content exists', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/v1/feed');

      expect(response.status).toBe(200);
      expect(response.body.feed).toHaveLength(0);
      expect(response.body.nextCursor).toBeUndefined();
    });

    it('should accept cursor and limit query params', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([mockArticle]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([]);

      const cursorObj = { updatedAt: new Date(), id: 'some-id' };
      const cursorStr = encodeCursor(cursorObj);

      const response = await request(app).get('/v1/feed').query({ limit: '10', cursor: cursorStr });

      expect(response.status).toBe(200);
      expect(ArticleService.getCursorPaginatedArticles).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 11, cursor: cursorObj }),
      );
    });

    it('should handle service errors', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockRejectedValue(
        new Error('Service error'),
      );

      const response = await request(app).get('/v1/feed');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch feed' });
    });
  });
});
