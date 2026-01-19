import { AuthRequest, AuthRequestWithBody, AuthRequestWithParams } from '@/types';
import { ArticleId } from '@shared-types/data/UserArticle.model';
import { UpdateArticleParams } from '@shared-types/requests/article.request';

export interface CreateUpdateArticleBody {
  title: string;
  content: string;
}

export interface CreateArticleRequest extends AuthRequestWithBody<CreateUpdateArticleBody> {}

export interface UpdateArticleRequest extends AuthRequestWithBody<
  CreateUpdateArticleBody,
  UpdateArticleParams
> {}
