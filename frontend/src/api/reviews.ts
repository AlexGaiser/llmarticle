import apiClient from "@/api/client";
import type {
  ReviewData,
  CreateUpdateReviewData,
  ReviewId,
} from "@/api/types/UserReview.model";

export const ReviewsApi = {
  getPublicReviews: async (): Promise<ReviewData[]> => {
    const { data } = await apiClient.get<{ reviews: ReviewData[] }>(
      "/reviews/public",
    );
    return data.reviews;
  },

  getMyReviews: async (): Promise<ReviewData[]> => {
    const { data } = await apiClient.get<{ reviews: ReviewData[] }>("/reviews");
    return data.reviews;
  },

  create: async (data: CreateUpdateReviewData): Promise<ReviewData> => {
    const response = await apiClient.post<ReviewData>("/reviews", data);
    return response.data;
  },

  update: async (
    id: ReviewId,
    data: CreateUpdateReviewData,
  ): Promise<ReviewData> => {
    const response = await apiClient.put<ReviewData>(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id: ReviewId): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },
};
