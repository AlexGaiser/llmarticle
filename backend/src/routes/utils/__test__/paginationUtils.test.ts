import {
  computeNextCursor,
  encodeCursor,
  decodeCursor,
  parseCursorPaginationParams,
  parseOffsetPaginationParams,
  isCursorPaginationOptions,
  isOffsetPaginationOptions,
  getCursorFromOptions,
  getSkipFromOptions,
} from '@/routes/utils/paginationUtils';
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '@/services/constants/queries.constants';
import { CursorPaginationOptions, OffsetPaginationOptions } from '@/types/data/Pagination.model';

describe('paginationUtils', () => {
  describe('encodeCursor & decodeCursor', () => {
    it('should correctly encode and decode a composite cursor', () => {
      const originalCursor = { updatedAt: new Date(), id: 'test-id' };
      const encoded = encodeCursor(originalCursor);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(originalCursor);
    });

    it('should return undefined when decoding invalid base64 string', () => {
      const result = decodeCursor('invalid-base64-string');
      expect(result).toBeUndefined();
    });

    it('should return undefined when decoding valid base64 but invalid JSON', () => {
      const invalidJson = Buffer.from('invalid-json').toString('base64');
      const result = decodeCursor(invalidJson);
      expect(result).toBeUndefined();
    });
  });

  describe('parseCursorPaginationParams', () => {
    it('should return default limit when no params provided', () => {
      const result = parseCursorPaginationParams({});
      expect(result).toEqual({ limit: DEFAULT_PAGE_LIMIT });
    });

    it('should cap limit at MAX_PAGE_LIMIT', () => {
      const result = parseCursorPaginationParams({ limit: (MAX_PAGE_LIMIT + 1).toString() });
      expect(result).toEqual({ limit: MAX_PAGE_LIMIT });
    });

    it('should parse cursor and return CursorPaginationOptions', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const cursorObj = { updatedAt: date, id: '123' };
      const cursorStr = encodeCursor(cursorObj);

      const result = parseCursorPaginationParams({ cursor: cursorStr });
      expect(isCursorPaginationOptions(result)).toBe(true);
      expect(result.cursor).toEqual(cursorObj);
      expect(result.limit).toBe(DEFAULT_PAGE_LIMIT);
    });
  });

  describe('parseOffsetPaginationParams', () => {
    it('should return default limit and skip 0 when no params provided', () => {
      const result = parseOffsetPaginationParams({});
      expect(result).toEqual({ limit: DEFAULT_PAGE_LIMIT, skip: 0 });
    });

    it('should parse valid limit and skip', () => {
      const result = parseOffsetPaginationParams({ limit: '10', skip: '5' });
      expect(result).toEqual({ limit: 10, skip: 5 });
    });

    it('should cap limit at MAX_PAGE_LIMIT', () => {
      const result = parseOffsetPaginationParams({ limit: (MAX_PAGE_LIMIT + 1).toString() });
      expect(result.limit).toEqual(MAX_PAGE_LIMIT);
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

    it('should return base64 encoded cursor of last item if items length equals limit', () => {
      const result = computeNextCursor(items, 2);
      const expectedCursor = { updatedAt: older, id: '2' };
      const decodedResult = decodeCursor(result!);

      expect(decodedResult).toEqual(expectedCursor);
    });
  });

  describe('Type Guards and Helpers', () => {
    const cursorOptions: CursorPaginationOptions = {
      limit: 10,
      cursor: { updatedAt: new Date(), id: '1' },
    };
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
