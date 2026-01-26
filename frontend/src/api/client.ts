import axios, { type AxiosInstance } from "axios";

interface ClientConfig {
  baseURL: string;
  withAuth?: boolean;
}

// ISO 8601 date string pattern
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

const deserializeDates = (data: unknown): unknown => {
  if (typeof data === "string" && ISO_DATE_REGEX.test(data)) {
    return new Date(data);
  }
  if (Array.isArray(data)) {
    return data.map(deserializeDates);
  }
  if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        deserializeDates(value),
      ]),
    );
  }
  return data;
};

export const createApiClient = ({ baseURL }: ClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Automatically convert date strings to Date objects in responses
  client.interceptors.response.use((response) => {
    response.data = deserializeDates(response.data);
    return response;
  });

  return client;
};

// Use VITE_API_URL (absolute or relative) or default to /api
// We check for "undefined" string because Vite can sometimes inject that verbatim
const rawUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl = rawUrl && rawUrl !== "undefined" ? rawUrl : "/api";

// Default API client with auth and cookie support
const apiClient = createApiClient({
  baseURL: `${apiBaseUrl}/v1`,
});

export default apiClient;
