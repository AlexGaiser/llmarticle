import apiClient from "@/api/client";
import type {
  ArticleData,
  ArticleId,
  CreateUpdateArticleData,
} from "@shared-types/data/UserArticle.model";
import type { ErrorResponseBody } from "@shared-types/requests/error.response";

export const ArticleApi = {
  getAll: async (): Promise<ArticleData[]> => {
    const { data } = await apiClient.get<ArticleData[]>("/articles");
    return data;
  },

  create: async (
    data: CreateUpdateArticleData,
  ): Promise<ArticleData | ErrorResponseBody> => {
    const response = await apiClient.post<ArticleData>("/articles", data);
    return response.data;
  },

  update: async (
    id: ArticleId,
    data: CreateUpdateArticleData,
  ): Promise<ArticleData> => {
    const response = await apiClient.put<ArticleData>(`/articles/${id}`, data);
    return response.data;
  },

  delete: async (id: ArticleId): Promise<void> => {
    await apiClient.delete(`/articles/${id}`);
  },
};
