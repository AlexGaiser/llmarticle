import apiClient from "@/api/client";
import type { PaginatedFeedResponse } from "./types/FeedResponse.model";

export const FeedApi = {
  getFeed: async (
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedFeedResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());

    const { data } = await apiClient.get<PaginatedFeedResponse>(
      `/feed?${params.toString()}`,
    );
    return data;
  },
};
