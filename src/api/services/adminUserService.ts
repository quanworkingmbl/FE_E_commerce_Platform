import apiClient from "@/api/apiClient";
import { mapPage } from "@/api/pageMapper";
import type { PageResponse } from "@/types/api";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}

export interface UpdateAdminUserPayload {
  fullName?: string;
  phone?: string;
  enabled?: boolean;
  roles?: string[];
}

export const adminUserService = {
  async list(page = 0, size = 20, search?: string) {
    const data = await apiClient.get<PageResponse<AdminUser>>({
      url: "/admin/users",
      params: { page, size, search },
    });
    return mapPage<AdminUser>(data);
  },

  getById(id: number) {
    return apiClient.get<AdminUser>({ url: `/admin/users/${id}` });
  },

  update(id: number, payload: UpdateAdminUserPayload) {
    return apiClient.patch<AdminUser>({ url: `/admin/users/${id}`, data: payload });
  },
};
