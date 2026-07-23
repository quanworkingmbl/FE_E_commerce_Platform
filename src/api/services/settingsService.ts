import apiClient from "@/api/apiClient";

export interface AppSettings {
  siteName: string;
  supportEmail: string;
  paymentExpiryMinutes: number;
  lowStockDefaultThreshold: number;
}

export const settingsService = {
  get() {
    return apiClient.get<AppSettings>({ url: "/admin/settings" });
  },

  update(payload: AppSettings) {
    return apiClient.put<AppSettings>({ url: "/admin/settings", data: payload });
  },
};
