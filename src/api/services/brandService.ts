import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { Brand, BrandPage } from "@/types/catalog";

export const brandService = {
  async list(page = 0, size = 20) {
    const data = await apiClient.get<BrandPage>({
      url: "/admin/catalog/brands",
      params: { page, size },
    });
    return mapPage(data);
  },
  create(data: { name: string; logoUrl?: string; active?: boolean }) {
    return apiClient.post<Brand>({ url: "/admin/catalog/brands", data });
  },
  update(id: number, data: { name: string; logoUrl?: string; active?: boolean }) {
    return apiClient.put<Brand>({ url: `/admin/catalog/brands/${id}`, data });
  },
  delete(id: number) {
    return apiClient.delete<void>({ url: `/admin/catalog/brands/${id}` });
  },
};
