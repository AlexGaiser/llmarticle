import { UserReviewDAO } from '@/db/UserReviewDAO';
import { UserId } from '@shared-types/data/User.model';
import { CreateUpdateReviewData } from '@shared-types/data/UserReview.model';

export const createUserReview = async (review: CreateUpdateReviewData) => {
  return UserReviewDAO.create({ data: review });
};

export const getReviewsByAuthor = async (authorId: UserId) => {
  return UserReviewDAO.findMany({ where: { authorId } });
};

export const getPublicReviewsByAuthor = async (authorId: UserId) => {
  return UserReviewDAO.findMany({ where: { authorId, isPrivate: false } });
};
