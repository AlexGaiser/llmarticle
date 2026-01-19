import apiClient from "@/api/client";
import type {
  ArticleData,
  ArticleId,
  CreateUpdateArticleData,
} from "@shared-types/data/UserArticle.model";

export const ArticleApi = {
  getAll: async (): Promise<ArticleData[]> => {
    const response = await apiClient.get("/articles");
    return response.data.articles;
  },

  create: async (data: CreateUpdateArticleData): Promise<ArticleData> => {
    const response = await apiClient.post("/articles", data);
    return response.data;
  },

  update: async (
    id: ArticleId,
    data: CreateUpdateArticleData,
  ): Promise<ArticleData> => {
    const response = await apiClient.put(`/articles/${id}`, data);
    return response.data;
  },

  delete: async (id: ArticleId): Promise<void> => {
    await apiClient.delete(`/articles/${id}`);
  },
};
