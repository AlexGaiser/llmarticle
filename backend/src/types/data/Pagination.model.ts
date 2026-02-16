export interface CompositeCursor {
  updatedAt: Date;
  id: string;
}

export interface CursorPaginationOptions {
  cursor?: CompositeCursor;
  limit?: number;
}

export interface OffsetPaginationOptions {
  skip?: number;
  limit?: number;
}

export type PaginationOptions = CursorPaginationOptions | OffsetPaginationOptions;

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | undefined;
}
