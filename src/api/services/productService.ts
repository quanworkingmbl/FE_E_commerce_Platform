import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { ProductDetail, ProductPage, ProductPayload, ProductStatus } from "@/types/catalog";

export const productService = {
  async list(params: {
    page?: number;
    size?: number;
    status?: ProductStatus;
    categoryId?: number;
    brandId?: number;
    search?: string;
  }) {
    const data = await apiClient.get<ProductPage>({
      url: "/admin/catalog/products",
      params,
    });
    return mapPage(data);
  },
  getById(id: number) {
    return apiClient.get<ProductDetail>({ url: `/admin/catalog/products/${id}` });
  },
  create(data: ProductPayload) {
    return apiClient.post<ProductDetail>({ url: "/admin/catalog/products", data });
  },
  update(id: number, data: ProductPayload) {
    return apiClient.put<ProductDetail>({ url: `/admin/catalog/products/${id}`, data });
  },
  archive(id: number) {
    return apiClient.patch<void>({ url: `/admin/catalog/products/${id}/archive` });
  },
  delete(id: number) {
    return apiClient.delete<void>({ url: `/admin/catalog/products/${id}` });
  },
};
