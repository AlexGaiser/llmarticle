import { getPublicFeed } from '@/services/feed.service';
import * as ArticleService from '@/services/article.service';
import * as ReviewService from '@/services/review.service';
import { FeedItemType } from '@/types/data/FeedItem.model';
import { UserId, UserName } from '@/types/data/User.model';
import { ArticleData, ArticleId } from '@/types/data/UserArticle.model';
import { ReviewData, ReviewId } from '@/types/data/UserReview.model';

jest.mock('@/services/article.service');
jest.mock('@/services/review.service');

describe('Feed Service', () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  const mockArticle1: ArticleData = {
    id: ArticleId('article-1'),
    title: 'Article 1',
    content: 'Content 1',
    isPrivate: false,
    createdAt: threeHoursAgo,
    updatedAt: now,
    author: { id: UserId('user-1'), username: UserName('User 1') },
  };

  const mockArticle2: ArticleData = {
    id: ArticleId('article-2'),
    title: 'Article 2',
    content: 'Content 2',
    isPrivate: false,
    createdAt: threeHoursAgo,
    updatedAt: threeHoursAgo,
    author: { id: UserId('user-1'), username: UserName('User 1') },
  };

  const mockReview1: ReviewData = {
    id: ReviewId('review-1'),
    title: 'Review 1',
    content: 'Review content 1',
    rating: 5,
    isPrivate: false,
    createdAt: twoHoursAgo,
    updatedAt: oneHourAgo,
    author: { id: UserId('user-2'), username: UserName('User 2') },
  };

  const mockReview2: ReviewData = {
    id: ReviewId('review-2'),
    title: 'Review 2',
    content: 'Review content 2',
    rating: 4,
    isPrivate: false,
    createdAt: twoHoursAgo,
    updatedAt: twoHoursAgo,
    author: { id: UserId('user-2'), username: UserName('User 2') },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublicFeed', () => {
    it('should combine and sort articles and reviews by updatedAt descending', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([
        mockArticle1,
        mockArticle2,
      ]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([
        mockReview1,
        mockReview2,
      ]);

      const feed = await getPublicFeed();

      // Expected order: article1 (now), review1 (1hr ago), review2 (2hr ago), article2 (3hr ago)
      expect(feed).toHaveLength(4);
      expect(feed[0].id).toBe('article-1');
      expect(feed[0].type).toBe(FeedItemType.Article);
      expect(feed[1].id).toBe('review-1');
      expect(feed[1].type).toBe(FeedItemType.Review);
      expect(feed[2].id).toBe('review-2');
      expect(feed[2].type).toBe(FeedItemType.Review);
      expect(feed[3].id).toBe('article-2');
      expect(feed[3].type).toBe(FeedItemType.Article);
    });

    it('should tag articles with FeedItemType.Article', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([mockArticle1]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([]);

      const feed = await getPublicFeed();

      expect(feed).toHaveLength(1);
      expect(feed[0].type).toBe(FeedItemType.Article);
      expect(feed[0]).toMatchObject({
        id: mockArticle1.id,
        title: mockArticle1.title,
        content: mockArticle1.content,
      });
    });

    it('should tag reviews with FeedItemType.Review', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([mockReview1]);

      const feed = await getPublicFeed();

      expect(feed).toHaveLength(1);
      expect(feed[0].type).toBe(FeedItemType.Review);
      expect(feed[0]).toMatchObject({
        id: mockReview1.id,
        title: mockReview1.title,
        rating: mockReview1.rating,
      });
    });

    it('should return empty array when no public content exists', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([]);

      const feed = await getPublicFeed();

      expect(feed).toHaveLength(0);
    });

    it('should respect the limit option with cursor', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([
        mockArticle1,
        mockArticle2,
      ]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([
        mockReview1,
        mockReview2,
      ]);

      const cursor = { updatedAt: oneHourAgo, id: 'some-id' };
      const feed = await getPublicFeed({ limit: 2, cursor });

      expect(feed).toHaveLength(2);
      // Logic: cursor filtering happens in service mock (not implemented here),
      // so we assume service returned correctly filtered items.
      // We check if slice worked.
      expect(feed[0].id).toBe('article-1');
      expect(feed[1].id).toBe('review-1');
    });

    it('should pass cursor to underlying services', async () => {
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([]);

      const cursor = { updatedAt: oneHourAgo, id: 'some-id' };
      await getPublicFeed({ cursor });

      expect(ArticleService.getCursorPaginatedArticles).toHaveBeenCalledWith(
        expect.objectContaining({ cursor }),
      );
      expect(ReviewService.getCursorPaginatedReviews).toHaveBeenCalledWith(
        expect.objectContaining({ cursor }),
      );
    });

    it('should handle items with identical timestamps deterministically', async () => {
      const identicalTime = new Date();
      const articleA = { ...mockArticle1, id: ArticleId('a'), updatedAt: identicalTime };
      const articleB = { ...mockArticle1, id: ArticleId('b'), updatedAt: identicalTime };

      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValue([
        articleA,
        articleB,
      ]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValue([]);

      const feed = await getPublicFeed();

      expect(feed).toHaveLength(2);
      // Should be sorted by updatedAt (same) then id (desc)
      expect(feed[0].id).toBe('b');
      expect(feed[1].id).toBe('a');
    });
    it('should paginate correctly through multiple articles and reviews', async () => {
      // Setup: 4 items total, sorted by date desc:
      // 1. article1 (now)
      // 2. review1 (1 hour ago)
      // 3. review2 (2 hours ago)
      // 4. article2 (3 hours ago)

      // First Request: limit 2
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValueOnce([
        mockArticle1,
        mockArticle2, // fetched but should be filtered out by limit in service logic if real, here we simulate return
      ]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValueOnce([
        mockReview1,
        mockReview2,
      ]);

      const page1 = await getPublicFeed({ limit: 2 });

      expect(page1).toHaveLength(2);
      expect(page1[0].id).toBe(mockArticle1.id);
      expect(page1[1].id).toBe(mockReview1.id);

      // Simulate next cursor from page1 last item (review1)
      const nextCursor = { updatedAt: mockReview1.updatedAt, id: mockReview1.id };

      // Second Request: limit 2, with cursor
      // Mocks should return items AFTER the cursor
      (ArticleService.getCursorPaginatedArticles as jest.Mock).mockResolvedValueOnce([
        mockArticle2,
      ]);
      (ReviewService.getCursorPaginatedReviews as jest.Mock).mockResolvedValueOnce([mockReview2]);

      const page2 = await getPublicFeed({ limit: 2, cursor: nextCursor });

      expect(page2).toHaveLength(2);
      expect(page2[0].id).toBe(mockReview2.id);
      expect(page2[1].id).toBe(mockArticle2.id);
    });
  });
});
