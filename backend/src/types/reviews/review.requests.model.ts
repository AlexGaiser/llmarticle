import { AuthRequest, AuthRequestWithParams } from '@/types';
import { UpdateReviewParams } from '@llmarticle/shared/types';
import { CreateUpdateReviewData } from '@llmarticle/shared/types';

export interface CreateReviewRequest extends AuthRequest {
  body: CreateUpdateReviewData;
}

export interface UpdateReviewRequest {
  params: UpdateReviewParams;
  body: CreateUpdateReviewData;
}

export interface GetReviewByIdRequest extends AuthRequestWithParams<{ id: string }> {}
