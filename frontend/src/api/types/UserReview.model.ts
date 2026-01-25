import type { UserId } from "@/api/types/User.model";

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

export interface ReviewData {
  id: ReviewId;
  title: string;
  content: string;
  rating: number;
  reviewLink?: string;
  isPrivate: boolean;
  authorId: UserId;
  createdAt: Date;
  updatedAt: Date;
}
