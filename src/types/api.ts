export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  timestamp?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}
