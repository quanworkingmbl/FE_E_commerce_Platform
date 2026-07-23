import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { Coupon, CouponRequest } from "@/types/promotion";

export const promotionService = {
  async list(page = 0, size = 20, search?: string) {
    const data = await apiClient.get<PageResponse<Coupon>>({
      url: "/admin/promotions",
      params: { page, size, search },
    });
    return mapPage<Coupon>(data);
  },

  getById(id: number) {
    return apiClient.get<Coupon>({ url: `/admin/promotions/${id}` });
  },

  create(payload: CouponRequest) {
    return apiClient.post<Coupon>({ url: "/admin/promotions", data: payload });
  },

  update(id: number, payload: CouponRequest) {
    return apiClient.put<Coupon>({ url: `/admin/promotions/${id}`, data: payload });
  },

  delete(id: number) {
    return apiClient.delete({ url: `/admin/promotions/${id}` });
  },
};
