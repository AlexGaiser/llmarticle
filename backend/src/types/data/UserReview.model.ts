import { Author, UserId } from '@/types/data/User.model';

export type ReviewId = string & { readonly __brand: unique symbol };
export const ReviewId = (id: string): ReviewId => id as ReviewId;

export interface CreateUpdateReviewData {
  title: string;
  content: string;
  rating: number;
  reviewLink?: string;
  isPrivate: boolean;
  authorId: UserId;
}

// Currently we are not extending because create does not include author but does include authorId
export interface ReviewData {
  id: ReviewId;
  title: string;
  content: string;
  rating: number;
  reviewLink?: string;
  isPrivate: boolean;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
