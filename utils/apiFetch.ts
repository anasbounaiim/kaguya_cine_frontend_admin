// utils/apiFetch.ts

import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helpers
const buildQueryString = (params?: Record<string, string | number>) => {
  if (!params) return '';
  return '?' + new URLSearchParams(params as Record<string, string>).toString();
};

const api = {
  get: (endpoint: string, params?: Record<string, string | number>) =>
    apiClient.get(endpoint + buildQueryString(params)).then(res => res.data),

  post: (endpoint: string, body: any) =>
    apiClient.post(endpoint, body).then(res => res.data),

  put: (endpoint: string, body: any) =>
    apiClient.put(endpoint, body).then(res => res.data),

  delete: (endpoint: string) =>
    apiClient.delete(endpoint).then(res => res.data),
};

export default api;
