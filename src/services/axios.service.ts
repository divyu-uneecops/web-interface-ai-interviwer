import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HRONE_API_URL || "",
  withCredentials: true, // 👈 this sends cookies
  headers: {
    "Content-Type": "application/json",
    "x-org-id": process.env.NEXT_PUBLIC_ORGANIZATION_ID || "",
    "x-app-id": process.env.NEXT_PUBLIC_APP_ID || "",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
