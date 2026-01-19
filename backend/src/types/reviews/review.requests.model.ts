import { AuthRequest, AuthRequestWithParams } from '@/types';
import { CreateUpdateReviewBody, UpdateReviewParams } from '@shared-types/requests/review.request';

export interface CreateReviewRequest extends AuthRequest {
  body: CreateUpdateReviewBody;
}

export interface UpdateReviewRequest {
  params: UpdateReviewParams;
  body: CreateUpdateReviewBody;
}

export interface GetReviewByIdRequest extends AuthRequestWithParams<{ id: string }> {}
