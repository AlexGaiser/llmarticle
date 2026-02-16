import {
  PaginationOptions,
  CursorPaginationOptions,
  OffsetPaginationOptions,
} from '@/types/data/Pagination.model';
import { MAX_PAGE_LIMIT, DEFAULT_PAGE_LIMIT } from '@/services/constants/queries.constants';

export const parsePaginationParams = (query: {
  cursor?: string;
  limit?: string;
  skip?: string;
}): PaginationOptions => {
  const { cursor, limit, skip } = query;
  const parsedLimit = limit ? Math.min(parseInt(limit, 10), MAX_PAGE_LIMIT) : DEFAULT_PAGE_LIMIT;

  if (cursor) {
    return {
      cursor: new Date(cursor),
      limit: parsedLimit,
    };
  }

  if (skip) {
    return {
      skip: parseInt(skip, 10),
      limit: parsedLimit,
    };
  }

  // Default to generic pagination with just limit if nothing provided
  return {
    limit: parsedLimit,
  };
};

export const computeNextCursor = <T extends { updatedAt: Date }>(
  items: T[],
  limit: number,
): string | undefined => {
  if (items.length < limit) {
    return undefined;
  }
  const lastItem = items[items.length - 1];
  return lastItem.updatedAt.toISOString();
};

export const isCursorPaginationOptions = (
  options: PaginationOptions,
): options is CursorPaginationOptions => {
  return 'cursor' in options;
};

export const isOffsetPaginationOptions = (
  options: PaginationOptions,
): options is OffsetPaginationOptions => {
  return 'skip' in options;
};

export const getCursorFromOptions = (options: PaginationOptions): Date | undefined => {
  return isCursorPaginationOptions(options) ? options.cursor : undefined;
};

export const getSkipFromOptions = (options: PaginationOptions): number | undefined => {
  return isOffsetPaginationOptions(options) ? options.skip : undefined;
};
