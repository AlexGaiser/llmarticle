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

      const feed = await getPublicFeed({ limit: 2, cursor: oneHourAgo });

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

      await getPublicFeed({ cursor: oneHourAgo });

      expect(ArticleService.getCursorPaginatedArticles).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: oneHourAgo }),
      );
      expect(ReviewService.getCursorPaginatedReviews).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: oneHourAgo }),
      );
    });
  });
});
