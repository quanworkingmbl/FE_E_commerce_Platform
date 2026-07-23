import apiClient from "@/api/apiClient";
import type { UserProfile } from "@/types/api";

export const userService = {
  getMe() {
    return apiClient.get<UserProfile>({ url: "/users/me" });
  },

  updateMe(payload: Pick<UserProfile, "fullName" | "phone">) {
    return apiClient.patch<UserProfile>({ url: "/users/me", data: payload });
  },
};
