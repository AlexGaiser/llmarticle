import apiClient from "@/api/client";
import type { User } from "@/api/types/User.model";

export interface AuthResponse {
  user: User;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
}

export const AuthApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", input);
    return response.data;
  },

  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", input);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data.user;
  },
};
