import { prisma } from '@/db/prisma';
import { DefaultIncludeAuthorClause } from '@/services/__test__/queries.constants';
import {
  getReviewsByAuthorId,
  getPublicReviewsByAuthor,
  getAllPublicReviews,
  createUserReview,
  updateReview,
  deleteReview,
} from '@/services/review.service';
import { prismaReviewToReviewData } from '@/types/data/prisma-db/datamappers';
import { ReviewWithAuthor } from '@/types/data/prisma-db/ExtendedPrismaDbTypes.model';

import { UserId } from '@/types/data/User.model';
import { ReviewId } from '@/types/data/UserReview.model';

jest.mock('@/db/prisma', () => ({
  prisma: {
    userReview: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ReviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockReview = (overrides: Partial<ReviewWithAuthor> = {}): ReviewWithAuthor => ({
    id: '1',
    title: 'Test Review',
    content: 'Review Content',
    rating: 5,
    reviewLink: 'https://example.com',
    isPrivate: false,
    authorId: 'user-1',
    author: { id: 'user-1', username: 'user-1' },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  describe('getReviewsByAuthorId', () => {
    it('should find reviews by author', async () => {
      const mockReviews: ReviewWithAuthor[] = [createMockReview()];
      const mockReviewData = mockReviews.map(prismaReviewToReviewData);

      (prisma.userReview.findMany as jest.Mock).mockResolvedValue(mockReviews);

      const result = await getReviewsByAuthorId(UserId('user-1'));

      expect(result).toEqual(mockReviewData);
      expect(prisma.userReview.findMany).toHaveBeenCalledWith({
        where: { authorId: UserId('user-1') },
        orderBy: { createdAt: 'desc' },
        ...DefaultIncludeAuthorClause,
      });
    });
  });

  describe('getPublicReviewsByAuthor', () => {
    it('should find public reviews by author', async () => {
      const mockReviews: ReviewWithAuthor[] = [createMockReview({ isPrivate: false })];
      const mockReviewData = mockReviews.map(prismaReviewToReviewData);

      (prisma.userReview.findMany as jest.Mock).mockResolvedValue(mockReviews);

      const result = await getPublicReviewsByAuthor(UserId('user-1'));

      expect(result).toEqual(mockReviewData);
      expect(prisma.userReview.findMany).toHaveBeenCalledWith({
        where: { authorId: UserId('user-1'), isPrivate: false },
        orderBy: { createdAt: 'desc' },
        ...DefaultIncludeAuthorClause,
      });
    });
  });

  describe('getAllPublicReviews', () => {
    it('should get all public reviews', async () => {
      const mockReviews: ReviewWithAuthor[] = [
        createMockReview({ id: '1' }),
        createMockReview({
          id: '2',
          authorId: 'user-2',
          author: { id: 'user-2', username: 'user-2' },
        }),
      ];
      const mockReviewData = mockReviews.map(prismaReviewToReviewData);

      (prisma.userReview.findMany as jest.Mock).mockResolvedValue(mockReviews);

      const result = await getAllPublicReviews();

      expect(result).toEqual(mockReviewData);
      expect(prisma.userReview.findMany).toHaveBeenCalledWith({
        where: { isPrivate: false },
        orderBy: { updatedAt: 'desc' },
        ...DefaultIncludeAuthorClause,
      });
    });
  });

  describe('createUserReview', () => {
    it('should create a review', async () => {
      const mockReview = createMockReview();
      const mockReviewData = prismaReviewToReviewData(mockReview);

      (prisma.userReview.create as jest.Mock).mockResolvedValue(mockReview);

      const result = await createUserReview({
        title: 'Test Review',
        content: 'Review Content',
        rating: 5,
        reviewLink: 'https://example.com',
        isPrivate: false,
        authorId: UserId('user-1'),
      });

      expect(result).toEqual(mockReviewData);
      expect(prisma.userReview.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Review',
          content: 'Review Content',
          rating: 5,
          reviewLink: 'https://example.com',
          isPrivate: false,
          authorId: 'user-1',
        },
        ...DefaultIncludeAuthorClause,
      });
    });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      const mockReview = createMockReview({ title: 'Updated Review' });
      const mockReviewData = prismaReviewToReviewData(mockReview);

      (prisma.userReview.findFirst as jest.Mock).mockResolvedValue(mockReview);
      (prisma.userReview.update as jest.Mock).mockResolvedValue(mockReview);

      const result = await updateReview(ReviewId('1'), UserId('user-1'), {
        title: 'Updated Review',
        content: 'Review Content',
        rating: 5,
        reviewLink: 'https://example.com',
        isPrivate: false,
        authorId: UserId('user-1'),
      });

      expect(result).toEqual(mockReviewData);
      expect(prisma.userReview.findFirst).toHaveBeenCalledWith({
        where: { id: ReviewId('1'), authorId: UserId('user-1') },
      });
      expect(prisma.userReview.update).toHaveBeenCalledWith({
        where: { id: ReviewId('1') },
        data: {
          title: 'Updated Review',
          content: 'Review Content',
          rating: 5,
          reviewLink: 'https://example.com',
          isPrivate: false,
          authorId: 'user-1',
        },
        ...DefaultIncludeAuthorClause,
      });
    });

    it('should throw error when updating unowned review', async () => {
      (prisma.userReview.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        updateReview(ReviewId('1'), UserId('user-1'), {
          title: 'Updated Review',
          content: 'Review Content',
          rating: 5,
          isPrivate: false,
          authorId: UserId('user-1'),
        }),
      ).rejects.toThrow('Review not found or unauthorized');
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const mockReview = createMockReview();
      (prisma.userReview.findFirst as jest.Mock).mockResolvedValue(mockReview);
      (prisma.userReview.delete as jest.Mock).mockResolvedValue(mockReview);

      await deleteReview('1', UserId('user-1'));

      expect(prisma.userReview.findFirst).toHaveBeenCalledWith({
        where: { id: '1', authorId: UserId('user-1') },
      });
      expect(prisma.userReview.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw error when deleting unowned review', async () => {
      (prisma.userReview.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(deleteReview('1', UserId('user-1'))).rejects.toThrow(
        'Review not found or unauthorized',
      );
    });
  });
});
