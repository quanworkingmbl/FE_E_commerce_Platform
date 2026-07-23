import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";
import type { PaymentSummary, PaymentTransactionStatus } from "@/types/payment";

export const paymentService = {
  async list(page = 0, size = 20, params?: {
    status?: PaymentTransactionStatus;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const data = await apiClient.get<PageResponse<PaymentSummary>>({
      url: "/admin/payments",
      params: { page, size, ...params },
    });
    return mapPage<PaymentSummary>(data);
  },
};
