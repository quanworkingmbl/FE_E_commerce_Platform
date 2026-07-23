import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { InventoryItem, InventoryLog } from "@/types/inventory";

export const inventoryService = {
  async list(page = 0, size = 20, search?: string, lowStockOnly?: boolean) {
    const data = await apiClient.get<PageResponse<InventoryItem>>({
      url: "/admin/inventory",
      params: { page, size, search, lowStockOnly },
    });
    return mapPage<InventoryItem>(data);
  },

  async getLogs(variantId: number, page = 0, size = 20) {
    const data = await apiClient.get<PageResponse<InventoryLog>>({
      url: `/admin/inventory/${variantId}/logs`,
      params: { page, size },
    });
    return mapPage<InventoryLog>(data);
  },

  stockIn(variantId: number, quantity: number, note?: string) {
    return apiClient.post<InventoryItem>({
      url: `/admin/inventory/${variantId}/stock-in`,
      data: { quantity, note },
    });
  },

  updateThreshold(variantId: number, lowStockThreshold: number) {
    return apiClient.patch<InventoryItem>({
      url: `/admin/inventory/${variantId}/threshold`,
      data: { lowStockThreshold },
    });
  },
};
