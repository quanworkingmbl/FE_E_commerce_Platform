import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { ReturnDetail, ReturnStatus, ReturnSummary } from "@/types/return";

export const returnService = {
  async list(page = 0, size = 20, params?: { status?: ReturnStatus; search?: string }) {
    const data = await apiClient.get<PageResponse<ReturnSummary>>({
      url: "/admin/returns",
      params: { page, size, ...params },
    });
    return mapPage<ReturnSummary>(data);
  },

  getById(id: number) {
    return apiClient.get<ReturnDetail>({ url: `/admin/returns/${id}` });
  },

  approve(id: number, note?: string) {
    return apiClient.patch<ReturnDetail>({ url: `/admin/returns/${id}/approve`, data: { note } });
  },

  reject(id: number, note?: string) {
    return apiClient.patch<ReturnDetail>({ url: `/admin/returns/${id}/reject`, data: { note } });
  },

  received(id: number) {
    return apiClient.patch<ReturnDetail>({ url: `/admin/returns/${id}/received` });
  },

  refund(id: number) {
    return apiClient.patch<ReturnDetail>({ url: `/admin/returns/${id}/refund` });
  },
};
