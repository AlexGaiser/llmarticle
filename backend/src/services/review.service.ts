import { UserReviewDAO } from '@/db/UserReviewDAO';
import { UserReview } from '@/generated/prisma/client';
import { Author, prismaToAuthor, UserId, UserName } from '@/types/data/User.model';
import { CreateUpdateReviewData, ReviewData, ReviewId } from '@/types/data/UserReview.model';

type ReviewWithAuthor = UserReview & { author: { id: string; username: string } };

export const prismaReviewToReviewData = (reviewWithAuthor: ReviewWithAuthor): ReviewData => {
  const { author, title, content, rating, isPrivate, createdAt, updatedAt, id, reviewLink } =
    reviewWithAuthor;

  const authorData: Author = prismaToAuthor(author);

  return {
    title,
    content,
    rating,
    isPrivate,
    createdAt,
    updatedAt,
    id: ReviewId(id),
    reviewLink: reviewLink || undefined,
    author: authorData,
  };
};

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

export const getAllPublicReviews = async (): Promise<ReviewData[]> => {
  const reviews = await UserReviewDAO.findMany({
    where: { isPrivate: false },
    orderBy: { updatedAt: 'desc' },
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
