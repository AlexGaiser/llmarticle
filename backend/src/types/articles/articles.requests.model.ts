import { AuthRequest, AuthRequestWithBody, AuthRequestWithParams } from '@/types';

export interface CreateUpdateArticleBody {
  title: string;
  content: string;
}

export interface CreateArticleRequest extends AuthRequestWithBody<CreateUpdateArticleBody> {}

export interface UpdateArticleRequest extends AuthRequestWithBody<CreateUpdateArticleBody> {
  params: { id: string };
}
