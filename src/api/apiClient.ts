import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import useUserStore from "@/store/userStore";
import type { ApiResponse, AuthResponse } from "@/types/api";

const normalizeBaseUrl = (value?: string) => {
  const raw = (value || "").trim();
  if (!raw) return "/api/v1";
  return raw.replace(/\/+$/, "");
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken } = useUserStore.getState().userToken;
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      `${normalizeBaseUrl(import.meta.env.VITE_APP_BASE_API)}/auth/refresh`,
      { refreshToken },
    );
    const payload = response.data.data;
    useUserStore.getState().actions.setAuth({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresIn: payload.expiresIn,
      user: payload.user,
    });
    return payload.accessToken;
  } catch {
    useUserStore.getState().actions.clearUserInfoAndToken();
    return null;
  }
};

export const createApiClient = (baseURL?: string) => {
  const instance = axios.create({
    baseURL: normalizeBaseUrl(baseURL ?? import.meta.env.VITE_APP_BASE_API),
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().userToken.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res: AxiosResponse<ApiResponse>) => {
      const body = res.data;
      if (!body?.success) {
        throw new Error(body?.message || "Request failed");
      }
      return body.data as never;
    },
    async (error: AxiosError<ApiResponse>) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;

      if (status === 401 && original && !original._retry) {
        original._retry = true;
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return instance.request(original);
        }
      }

      return Promise.reject(error);
    },
  );

  return new ApiClient(instance);
};

class ApiClient {
  constructor(private instance: AxiosInstance) {}

  get<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "GET" });
  }

  post<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "POST" });
  }

  patch<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PATCH" });
  }

  private request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request<any, T>(config);
  }
}

const apiClient = createApiClient();
export default apiClient;
