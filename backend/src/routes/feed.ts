import { Router, Request, Response } from 'express';
import { getPublicFeed } from '@/services/feed.service';
import { CursorPaginationOptions } from '@/types/data/Pagination.model';
import {
  computeNextCursor,
  isOffsetPaginationOptions,
  parsePaginationParams,
} from './utils/paginationUtils';
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
      const options = parsePaginationParams(req.query);

      // Validate that only cursor options are used for feed
      if (isOffsetPaginationOptions(options)) {
        res.status(400).json({ error: 'Feed only supports cursor-based pagination' });
        return;
      }

      const feed = await getPublicFeed(options);

      const nextCursor = computeNextCursor(feed, options.limit!);
      res.json({ feed, nextCursor });
    } catch (error) {
      console.error('Error fetching feed:', error);
      res.status(500).json({ error: 'Failed to fetch feed' });
    }
  },
);
