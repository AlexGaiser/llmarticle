import apiClient from "./client";
import { type Article } from "@/types";

export interface CreateArticleInput {
  title: string;
  content: string;
}

export const ArticleApi = {
  getAll: async (): Promise<Article[]> => {
    const response = await apiClient.get("/articles");
    return response.data.articles;
  },

  create: async (input: CreateArticleInput): Promise<Article> => {
    const response = await apiClient.post("/articles", input);
    return response.data;
  },
};
