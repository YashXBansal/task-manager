import { api } from "./axios.instance";
import type { AuthResponse, ApiResponse } from "../types";

// We map directly to the backend Zod schemas here implicitly
export const authApi = {
  login: async (credentials: Record<string, string>) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  signup: async (userData: Record<string, string>) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/signup",
      userData,
    );
    return data;
  },

  getMe: async () => {
    const { data } =
      await api.get<ApiResponse<{ user: import("../types").User }>>("/auth/me");
    return data;
  },
};
