import { AuthRequest, AuthRequestWithParams } from '@/types';

export interface CreateUpdateReviewBody {
  title: string;
  content: string;
  rating: number;
  reviewLink?: string;
  isPrivate: boolean;
}

export interface CreateReviewRequest extends AuthRequest {
  body: CreateUpdateReviewBody;
}

export interface UpdateReviewRequest {
  params: {
    id: string;
  };
  body: CreateUpdateReviewBody;
}

export interface GetReviewByIdRequest extends AuthRequestWithParams<{ id: string }> {}
