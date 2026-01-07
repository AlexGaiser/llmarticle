import axios, { type AxiosInstance } from "axios";

interface ClientConfig {
  baseURL: string;
  withAuth?: boolean;
}

export const createApiClient = ({ baseURL }: ClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return client;
};

// Default API client with auth and cookie support
const apiClient = createApiClient({
  baseURL: `${import.meta.env.VITE_API_URL}/v1`,
});

export default apiClient;
