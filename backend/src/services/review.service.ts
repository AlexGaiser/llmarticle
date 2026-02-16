import { UserReviewDAO } from '@/db/UserReviewDAO';
import { CursorPaginationOptions, OffsetPaginationOptions } from '@/types/data/Pagination.model';
import { DEFAULT_PAGE_LIMIT } from '@/services/constants/queries.constants';
import { prismaReviewToReviewData } from '@/types/data/prisma-db/datamappers';
import { ReviewWithAuthor } from '@/types/data/prisma-db/ExtendedPrismaDbTypes.model';
import { UserId } from '@/types/data/User.model';
import { CreateUpdateReviewData, ReviewData, ReviewId } from '@/types/data/UserReview.model';

export const createUserReview = async (review: CreateUpdateReviewData): Promise<ReviewData> => {
  const res: ReviewWithAuthor = await UserReviewDAO.create({
    data: review,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return prismaReviewToReviewData(res);
};

export const getReviewsByAuthorId = async (authorId: UserId): Promise<ReviewData[]> => {
  const reviews = await UserReviewDAO.findMany({
    where: { authorId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return reviews.map(prismaReviewToReviewData);
};

export const getPublicReviewsByAuthor = async (authorId: UserId): Promise<ReviewData[]> => {
  const reviews = await UserReviewDAO.findMany({
    where: { authorId, isPrivate: false },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return reviews.map(prismaReviewToReviewData);
};

export const getPublicReviews = async (
  options?: OffsetPaginationOptions,
): Promise<ReviewData[]> => {
  const limit = options?.limit ?? DEFAULT_PAGE_LIMIT;
  const skip = 'skip' in (options ?? {}) ? (options as OffsetPaginationOptions).skip : undefined;

  const reviews = await UserReviewDAO.findMany({
    where: {
      isPrivate: false,
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return reviews.map(prismaReviewToReviewData);
};

export const getCursorPaginatedReviews = async (
  options: CursorPaginationOptions,
): Promise<ReviewData[]> => {
  const { limit, cursor } = options;

  const reviews = await UserReviewDAO.findMany({
    where: {
      isPrivate: false,
      ...(cursor
        ? {
            OR: [
              { updatedAt: { lt: cursor.updatedAt } },
              { updatedAt: cursor.updatedAt, id: { lt: cursor.id } },
            ],
          }
        : {}),
    },
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return reviews.map(prismaReviewToReviewData);
};

export const updateReview = async (
  id: ReviewId,
  authorId: UserId,
  data: CreateUpdateReviewData,
): Promise<ReviewData> => {
  const review = await UserReviewDAO.findFirst({
    where: { id, authorId },
  });

  if (!review) {
    throw new Error('Review not found or unauthorized');
  }

  const res = await UserReviewDAO.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return prismaReviewToReviewData(res);
};

export const deleteReview = async (id: string, authorId: UserId) => {
  const review = await UserReviewDAO.findFirst({
    where: { id, authorId },
  });

  if (!review) {
    throw new Error('Review not found or unauthorized');
  }

  return UserReviewDAO.delete({
    where: { id },
  });
};
