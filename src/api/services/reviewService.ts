import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { ReviewStatus, ReviewSummary } from "@/types/review";

export const reviewService = {
  async list(page = 0, size = 20, params?: { status?: ReviewStatus; search?: string }) {
    const data = await apiClient.get<PageResponse<ReviewSummary>>({
      url: "/admin/reviews",
      params: { page, size, ...params },
    });
    return mapPage<ReviewSummary>(data);
  },

  moderate(id: number, payload: { status: ReviewStatus; adminNote?: string }) {
    return apiClient.patch<ReviewSummary>({ url: `/admin/reviews/${id}/moderate`, data: payload });
  },
};
