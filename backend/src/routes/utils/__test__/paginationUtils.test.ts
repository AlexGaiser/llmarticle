import {
  parsePaginationParams,
  computeNextCursor,
  isCursorPaginationOptions,
  isOffsetPaginationOptions,
  getCursorFromOptions,
  getSkipFromOptions,
} from '../paginationUtils';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@/services/constants/queries.constants';
import { CursorPaginationOptions, OffsetPaginationOptions } from '@/types/data/Pagination.model';

describe('paginationUtils', () => {
  describe('parsePaginationParams', () => {
    it('should return default limit when no params provided', () => {
      const result = parsePaginationParams({});
      expect(result).toEqual({ limit: DEFAULT_PAGE_LIMIT });
    });

    it('should parse valid limit', () => {
      const result = parsePaginationParams({ limit: '10' });
      expect(result).toEqual({ limit: 10 });
    });

    it('should cap limit at MAX_PAGE_LIMIT', () => {
      const result = parsePaginationParams({ limit: (MAX_PAGE_LIMIT + 1).toString() });
      expect(result).toEqual({ limit: MAX_PAGE_LIMIT });
    });

    it('should parse cursor and return CursorPaginationOptions', () => {
      const dateStr = '2023-01-01T00:00:00.000Z';
      const result = parsePaginationParams({ cursor: dateStr });
      expect(isCursorPaginationOptions(result)).toBe(true);
      expect((result as CursorPaginationOptions).cursor).toEqual(new Date(dateStr));
      expect(result.limit).toBe(DEFAULT_PAGE_LIMIT);
    });

    it('should parse skip and return OffsetPaginationOptions', () => {
      const result = parsePaginationParams({ skip: '5' });
      expect(isOffsetPaginationOptions(result)).toBe(true);
      expect((result as OffsetPaginationOptions).skip).toBe(5);
      expect(result.limit).toBe(DEFAULT_PAGE_LIMIT);
    });

    it('should prioritize cursor over skip', () => {
      const dateStr = '2023-01-01T00:00:00.000Z';
      const result = parsePaginationParams({ cursor: dateStr, skip: '5' });
      expect(isCursorPaginationOptions(result)).toBe(true);
      expect((result as any).skip).toBeUndefined();
      expect((result as CursorPaginationOptions).cursor).toEqual(new Date(dateStr));
    });
  });

  describe('computeNextCursor', () => {
    const now = new Date();
    const older = new Date(now.getTime() - 1000);
    const items = [
      { id: '1', updatedAt: now },
      { id: '2', updatedAt: older },
    ];

    it('should return undefined if items length is less than limit', () => {
      const result = computeNextCursor(items, 3);
      expect(result).toBeUndefined();
    });

    it('should return last item updatedAt if items length equals limit', () => {
      const result = computeNextCursor(items, 2);
      expect(result).toBe(older.toISOString());
    });

    // Note: In a real scenario, we might fetch limit + 1 to know if there's a next page.
    // The utility just takes items and limit and returns cursor if length >= limit.
    // If the service logic fetches exactly 'limit' items, this utility will always return a cursor
    // if full page is returned, theoretically correctly.
    // Typically services fetch limit + 1 or count to determine if next page exists,
    // but this utility logic is: if we got a full page, return updated of last item as next cursor.
    // This implies the client will try to fetch next page and get empty results if properly finished.
  });

  describe('Type Guards and Helpers', () => {
    const cursorOptions: CursorPaginationOptions = { limit: 10, cursor: new Date() };
    const offsetOptions: OffsetPaginationOptions = { limit: 10, skip: 5 };
    const baseOptions = { limit: 10 };

    describe('isCursorPaginationOptions', () => {
      it('should return true for CursorPaginationOptions', () => {
        expect(isCursorPaginationOptions(cursorOptions)).toBe(true);
      });

      it('should return false for OffsetPaginationOptions', () => {
        expect(isCursorPaginationOptions(offsetOptions)).toBe(false);
      });

      it('should return false for base options', () => {
        expect(isCursorPaginationOptions(baseOptions)).toBe(false);
      });
    });

    describe('isOffsetPaginationOptions', () => {
      it('should return true for OffsetPaginationOptions', () => {
        expect(isOffsetPaginationOptions(offsetOptions)).toBe(true);
      });

      it('should return false for CursorPaginationOptions', () => {
        expect(isOffsetPaginationOptions(cursorOptions)).toBe(false);
      });

      it('should return false for base options', () => {
        expect(isOffsetPaginationOptions(baseOptions)).toBe(false);
      });
    });

    describe('getCursorFromOptions', () => {
      it('should return cursor from CursorPaginationOptions', () => {
        expect(getCursorFromOptions(cursorOptions)).toEqual(cursorOptions.cursor);
      });

      it('should return undefined from OffsetPaginationOptions', () => {
        expect(getCursorFromOptions(offsetOptions)).toBeUndefined();
      });
    });

    describe('getSkipFromOptions', () => {
      it('should return skip from OffsetPaginationOptions', () => {
        expect(getSkipFromOptions(offsetOptions)).toBe(offsetOptions.skip);
      });

      it('should return undefined from CursorPaginationOptions', () => {
        expect(getSkipFromOptions(cursorOptions)).toBeUndefined();
      });
    });
  });
});
