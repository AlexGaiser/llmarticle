import {
  PaginationOptions,
  CursorPaginationOptions,
  OffsetPaginationOptions,
  CompositeCursor,
} from '@/types/data/Pagination.model';
import { MAX_PAGE_LIMIT, DEFAULT_PAGE_LIMIT } from '@/services/constants/queries.constants';

export const encodeCursor = (cursor: CompositeCursor): string => {
  const json = JSON.stringify(cursor);
  return Buffer.from(json).toString('base64');
};

export const decodeCursor = (cursor: string): CompositeCursor | undefined => {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf-8');
    const parsed = JSON.parse(json);
    return {
      updatedAt: new Date(parsed.updatedAt),
      id: parsed.id,
    };
  } catch (e) {
    console.warn('Failed to decode cursor:', e);
    return undefined;
  }
};

export const parseCursorPaginationParams = (query: {
  cursor?: string;
  limit?: string;
}): CursorPaginationOptions => {
  const { cursor, limit } = query;
  const parsedLimit = limit ? Math.min(parseInt(limit, 10), MAX_PAGE_LIMIT) : DEFAULT_PAGE_LIMIT;

  if (cursor) {
    const decodedCursor = decodeCursor(cursor);
    if (decodedCursor) {
      return {
        cursor: decodedCursor,
        limit: parsedLimit,
      };
    }
  }

  return {
    limit: parsedLimit,
  };
};

export const parseOffsetPaginationParams = (query: {
  skip?: string;
  limit?: string;
}): OffsetPaginationOptions => {
  const { skip, limit } = query;
  const parsedLimit = limit ? Math.min(parseInt(limit, 10), MAX_PAGE_LIMIT) : DEFAULT_PAGE_LIMIT;
  const parsedSkip = skip ? parseInt(skip, 10) : 0;

  return {
    limit: parsedLimit,
    skip: parsedSkip,
  };
};

export const computeNextCursor = <T extends { updatedAt: Date; id: string }>(
  items: T[],
  limit: number,
): string | undefined => {
  if (items.length < limit) {
    return undefined;
  }
  const lastItem = items[items.length - 1];
  const cursor: CompositeCursor = {
    updatedAt: lastItem.updatedAt,
    id: lastItem.id,
  };
  return encodeCursor(cursor);
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

export const getCursorFromOptions = (options: PaginationOptions): CompositeCursor | undefined => {
  return isCursorPaginationOptions(options) ? options.cursor : undefined;
};

export const getSkipFromOptions = (options: PaginationOptions): number | undefined => {
  return isOffsetPaginationOptions(options) ? options.skip : undefined;
};
