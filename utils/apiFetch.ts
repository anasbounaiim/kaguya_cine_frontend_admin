import axios, { AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/AuthStore";

// Crée l'instance Axios
const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor (injecte le token du store si appelé côté client React)
if (typeof window !== "undefined") {
  apiClient.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Helper pour query string
const buildQueryString = (params?: Record<string, string | number>) => {
  if (!params) return '';
  return '?' + new URLSearchParams(params as Record<string, string>).toString();
};

// Les fonctions prennent en option un config Axios pour override headers côté API route
const api = {
  get: (
    endpoint: string,
    params?: Record<string, string | number>,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient
      .get(endpoint + buildQueryString(params), config)
      .then((res) => res.data),

  post: (
    endpoint: string,
    body: any,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient.post(endpoint, body, config).then((res) => res.data),

  put: (
    endpoint: string,
    body: any,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient.put(endpoint, body, config).then((res) => res.data),

  delete: (
    endpoint: string,
    config: AxiosRequestConfig = {}
  ) =>
    apiClient.delete(endpoint, config).then((res) => res.data),
};

export default api;
