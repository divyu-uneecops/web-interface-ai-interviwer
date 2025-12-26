import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: "https://api.hrone.studio/api",
  headers: {
    "Content-Type": "application/json",
    "x-org-id": "6944d6b2d4c8f94846e5ef16",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3NjY3MzE4MzIsImlhdCI6MTc2NjczMDAzMiwianRpIjoib25ydHJ0OmY0OWJlMjljLWYyNWYtYjg2My1lNTY0LTFkNTc3MzQwOWRhNCIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiMTdlOTVlYWMtYzVhOC00NThhLTlhMDQtMjU1YjQxZDQ0OGQ4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.iVvhswQYX1VPQNl46oBt4OXk48niRKMDmX8prqz8UYe_hSV13my8nJi4A87hXnZyn-aXuyxu9bb4zPUK4xAJQTzPCHPr_7uevtXXSSxDI2xrAA7q5cognf7W7XM3rRQsxPZjkYVsnFTDfdKlgUkUO5eM-iyk6hNdH2b2MlFe1uaOVM9b8lF9F5fHM6iczcdIPI1nSAS15hbzfB0YLvF6lGHwRWZBWrdyLDbG82OgIua1ni_Tp23yBYeJ4ovZL2mTGX1SfqQ-p4w4-gCAHBxjmnBZRu-1fMp6ZiV6735gG6PrW-TItUzruvz6jgVc8C0eKTWSc9PnPCXgxHpov8i6vQ`;

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
