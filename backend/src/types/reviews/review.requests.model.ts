import { AuthRequestWithBody } from '@/types';
import { UpdateReviewParams } from '@/types/requests/review.request';
import { CreateUpdateReviewData } from '@/types/data/UserReview.model';

export interface CreateReviewRequest extends AuthRequestWithBody<CreateUpdateReviewData> {}

export interface UpdateReviewRequest extends AuthRequestWithBody<
  CreateUpdateReviewData,
  UpdateReviewParams
> {}
