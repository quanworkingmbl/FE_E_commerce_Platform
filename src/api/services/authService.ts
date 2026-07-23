import apiClient from "@/api/apiClient";
import type { AuthResponse, LoginPayload } from "@/types/api";

export const authService = {
  login(payload: LoginPayload) {
    return apiClient.post<AuthResponse>({ url: "/auth/login", data: payload });
  },

  logout(refreshToken: string) {
    return apiClient.post<void>({ url: "/auth/logout", data: { refreshToken } });
  },

  forgotPassword(email: string) {
    return apiClient.post<void>({ url: "/auth/forgot-password", data: { email } });
  },
};
