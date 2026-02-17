import { Router, Request, Response } from 'express';
import { getPublicFeed } from '@/services/feed.service';
import { CursorPaginationOptions } from '@/types/data/Pagination.model';
import { computeNextCursor, parseCursorPaginationParams } from '@/routes/utils/paginationUtils';
import { PaginatedFeedResponse } from '@/types/requests/feed.response.model';
import { ErrorResponseBody } from '@/types/requests/error.response';

export const feedRouter = Router();

interface GetFeedRequest extends Request {
  query: {
    cursor?: string;
    limit?: string;
  };
}

feedRouter.get(
  '/',
  async (req: GetFeedRequest, res: Response<PaginatedFeedResponse | ErrorResponseBody>) => {
    try {
      const options = parseCursorPaginationParams(req.query);

      const feed = await getPublicFeed(options);

      const nextCursor = computeNextCursor(feed, options.limit!);
      res.json({ feed, nextCursor });
    } catch (error) {
      console.error('Error fetching feed:', error);
      res.status(500).json({ error: 'Failed to fetch feed' });
    }
  },
);
