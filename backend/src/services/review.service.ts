import { UserReviewDAO } from '@/db/UserReviewDAO';
import { UserId } from '@/model/User.model';
import { CreateReviewData } from '@/model/UserReview.model';

export const createUserReview = async (review: CreateReviewData) => {
  return UserReviewDAO.create({ data: review });
};

export const getReviewsByAuthor = async (authorId: UserId) => {
  return UserReviewDAO.findMany({ where: { authorId } });
};

export const getPublicReviewsByAuthor = async (authorId: UserId) => {
  return UserReviewDAO.findMany({ where: { authorId, isPrivate: false } });
};
