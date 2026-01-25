import { AuthRequestWithBody } from '@/types';
import { CreateUpdateArticleData } from '@/types/data/UserArticle.model';
import { UpdateArticleParams } from '@/types/requests/article.request';

export interface CreateArticleRequest extends AuthRequestWithBody<CreateUpdateArticleData> {}

export interface UpdateArticleRequest extends AuthRequestWithBody<
  CreateUpdateArticleData,
  UpdateArticleParams
> {}
