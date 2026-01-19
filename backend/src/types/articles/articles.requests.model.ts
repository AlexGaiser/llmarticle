import { AuthRequestWithBody } from '@/types';
import { CreateUpdateArticleData } from '@llmarticle/shared/types';
import { UpdateArticleParams } from '@llmarticle/shared/types';

export interface CreateArticleRequest extends AuthRequestWithBody<CreateUpdateArticleData> {}

export interface UpdateArticleRequest extends AuthRequestWithBody<
  CreateUpdateArticleData,
  UpdateArticleParams
> {}
