import axios, { type AxiosInstance } from "axios";

interface ClientConfig {
  baseURL: string;
  withAuth?: boolean;
}

export const createApiClient = ({
  baseURL,
  withAuth = true,
}: ClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (withAuth) {
    /**
     * TODO: When migrating to HttpOnly cookies:
     * 1. Set withCredentials: true
     * 2. Remove the Authorization header interceptor
     */
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  return client;
};

// Default API client with auth
const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export default apiClient;
