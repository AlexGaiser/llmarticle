import type { FeedItem } from "./FeedItem.model";

export interface PaginatedFeedResponse {
  feed: FeedItem[];
  nextCursor: string | undefined;
}
