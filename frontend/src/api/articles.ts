import apiClient from "@/api/client";
import type {
  ArticleData,
  CreateUpdateArticleData,
  ArticleId,
} from "@/api/types/UserArticle.model";

export const ArticleApi = {
  getPublicArticles: async (): Promise<ArticleData[]> => {
    const { data } = await apiClient.get<{ articles: ArticleData[] }>(
      "/articles/public",
    );
    return data.articles;
  },

  getAll: async (): Promise<ArticleData[]> => {
    const { data } = await apiClient.get<ArticleData[]>("/articles");
    return data;
  },

  create: async (data: CreateUpdateArticleData): Promise<ArticleData> => {
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
