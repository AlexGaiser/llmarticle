import { UserReviewDAO } from '@/db/UserReviewDAO';
import { UserId } from '@llmarticle/shared/types';
import { CreateUpdateReviewData } from '@llmarticle/shared/types';

export const createUserReview = async (review: CreateUpdateReviewData) => {
  return UserReviewDAO.create({ data: review });
};

export const getReviewsByAuthor = async (authorId: UserId) => {
  return UserReviewDAO.findMany({ where: { authorId } });
};

export const getPublicReviewsByAuthor = async (authorId: UserId) => {
  return UserReviewDAO.findMany({ where: { authorId, isPrivate: false } });
};
