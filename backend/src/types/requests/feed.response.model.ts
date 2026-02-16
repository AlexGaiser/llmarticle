import { FeedItem } from '@/types/data/FeedItem.model';

export interface PaginatedFeedResponse {
  feed: FeedItem[];
  nextCursor: string | undefined;
}
