import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: "https://api.hrone.studio",
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
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3NjgyMTM5MDIsImlhdCI6MTc2ODIxMjEwMiwianRpIjoib25ydHJ0OmUyMzc2ZjY2LTA0ZTUtNDQ1ZS03NDk0LWY2NGU0MmNkZDY4MSIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiZjkxZDA1Y2MtOTg3Ni00MGQxLThmZGMtZmM4ZTRkMTEyNzcyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.fBNQbTcpk9fM2siB3FDkzU0SSpdMEUoO5gc5Umw_j8b-tDtGAIjNfa6Ke2fANBFjBQcc-KZs8ZhSGRsoAbz5cndb2oC17ykiZ2UFiXnDQvlad-jT0Eag37sCdkrqcJVV8lwUsCtzYGLCrpi6EjDOqRUxk_wY3k_zl2If5v5bIHgRCLhH8HE5PF_FJO3C0Xyu-GvTmtYVOsD-uht9bUSyB_7tTxiJm8g2TffW1eV8_iIG7zFlN_iUVlQj-93HKLBj8PWmILF1ocSaZlHQKntSh6RdaBqT7K948iUIf3tD5YKixjeJ7E_so7WDQVER4w6oUKT86ogKN-d5rkCfaX72vA`;

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

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
