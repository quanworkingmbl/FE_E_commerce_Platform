import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { OrderDetail, OrderStatus, OrderSummary, UpdateOrderStatusPayload } from "@/types/order";

export const orderService = {
  async list(page = 0, size = 20, params?: {
    status?: OrderStatus;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const data = await apiClient.get<PageResponse<OrderSummary>>({
      url: "/admin/orders",
      params: { page, size, ...params },
    });
    return mapPage<OrderSummary>(data);
  },

  getById(id: number) {
    return apiClient.get<OrderDetail>({ url: `/admin/orders/${id}` });
  },

  updateStatus(id: number, payload: UpdateOrderStatusPayload) {
    return apiClient.patch<OrderDetail>({
      url: `/admin/orders/${id}/status`,
      data: payload,
    });
  },
};
