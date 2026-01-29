import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://api.hrone.studio",
  withCredentials: true, // 👈 this sends cookies
  headers: {
    "Content-Type": "application/json",
    "x-org-id": "69521ba88ecab90ed22cbcd9",
    "x-app-id": "69521cd1c9ba83a076aac3ae",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
   // Get token from localStorage
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3Njk2Njg2NzAsImlhdCI6MTc2OTY2Njg3MCwianRpIjoib25ydHJ0OmQ3OWIzMTMyLTRiMTEtMDg5MS0wZTY3LWRiMjdkNGFiNzA2MCIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiZGM1MTYzNDYtMzNiOS00NzVmLWEyMTQtODE0YzBhZjFlMTgzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.Pv-RZYxQUu62wpttuDN7QBZxW2UtCmzR0ABC76cowyzoh2ne3mmGSBEzuuTLehL32L5ZsmjM25EOQGd5dKjePCkbU1Ao6KhgYqes7eISvtFXe5c8fyZMT6UerxjHOSHXvm9En9rp-npn1pAEa_od5_OQ4DzFBLDeL85CIJPwF7k6ET5EWXmLKADw66bm3DJgs0_rAP6ufHKarv-2Acrm1-iSdJqpA32FwG49_viBVXZ80aI5Tl4YVUqnJlY4N-sZs8EgzwoeWIQJ-e_Gyj0HBZjn4Ht2jU7oGn552QT2_j6WLnyIB5W91MjPCwpjZn5sPkCHARdKtCgNbu6SC64tww`;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
