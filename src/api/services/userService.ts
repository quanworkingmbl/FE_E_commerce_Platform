import apiClient from "@/api/apiClient";
import type { UserProfile } from "@/types/api";

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export const userService = {
  getMe() {
    return apiClient.get<UserProfile>({ url: "/users/me" });
  },

  updateMe(payload: UpdateProfilePayload) {
    return apiClient.patch<UserProfile>({ url: "/users/me", data: payload });
  },
};
