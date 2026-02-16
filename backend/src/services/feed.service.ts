import { getCursorPaginatedArticles, getPublicArticles } from '@/services/article.service';
import { getPublicReviews, getCursorPaginatedReviews } from '@/services/review.service';
import { FeedItem } from '@/types/data/FeedItem.model';
import { CursorPaginationOptions } from '@/types/data/Pagination.model';
import { DEFAULT_PAGE_LIMIT } from './constants/queries.constants';
import { tagArticlesAsFeedItems, tagReviewsAsFeedItems } from '@/types/data/prisma-db/datamappers';

export const getPublicFeed = async (options?: CursorPaginationOptions): Promise<FeedItem[]> => {
  const { cursor, limit = DEFAULT_PAGE_LIMIT } = options ?? {};

  // Fetch limit+1 from each source to ensure enough items after merge
  const fetchLimit = limit + 1;

  const [articles, reviews] = await Promise.all([
    getCursorPaginatedArticles({ cursor, limit: fetchLimit }),
    getCursorPaginatedReviews({ cursor, limit: fetchLimit }),
  ]);

  // Tag each item with its type
  const feedArticles = tagArticlesAsFeedItems(articles);
  const feedReviews = tagReviewsAsFeedItems(reviews);

  // Merge, sort by updatedAt descending, and apply limit
  const feed = [...feedArticles, ...feedReviews]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
  return feed;
};
