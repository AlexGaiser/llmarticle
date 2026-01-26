import { AuthRequest, AuthRequestWithParams } from '@/types';
import { UpdateReviewParams } from '@/types/requests/review.request';
import { CreateUpdateReviewData } from '@/types/data/UserReview.model';

export interface CreateReviewRequest extends AuthRequest {
  body: CreateUpdateReviewData;
}

export interface UpdateReviewRequest {
  params: UpdateReviewParams;
  body: CreateUpdateReviewData;
}

export interface GetReviewByIdRequest extends AuthRequestWithParams<{ id: string }> {}
