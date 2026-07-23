import apiClient from "@/api/apiClient";
import type { DashboardSummary, LowStockItem, RevenueByMonthItem, TopProductItem } from "@/types/report";

export const reportService = {
  summary(from?: string, to?: string) {
    return apiClient.get<DashboardSummary>({ url: "/admin/reports/summary", params: { from, to } });
  },

  revenueByMonth(year?: number) {
    return apiClient.get<RevenueByMonthItem[]>({ url: "/admin/reports/revenue/month", params: { year } });
  },

  topProducts(from?: string, to?: string, limit = 10) {
    return apiClient.get<TopProductItem[]>({ url: "/admin/reports/top-products", params: { from, to, limit } });
  },

  lowStock(limit = 10) {
    return apiClient.get<LowStockItem[]>({ url: "/admin/reports/low-stock", params: { limit } });
  },
};
