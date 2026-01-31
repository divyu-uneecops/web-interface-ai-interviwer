import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

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
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3Njk4ODI3MTUsImlhdCI6MTc2OTg4MDkxNSwianRpIjoib25ydHJ0OjIyMjdjMjNjLTNmMGQtODA5MC1kNDRmLTc4MmRiNzZjNzZiYSIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiZTI5OTM3MmItNDNiYS00Yzk3LWFkNDQtOTM3MTlhOWI2OTc5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.R8fJ_Cw4I2AULU3UTSVO7x6zKWsaEOByutvjL1vlDM_vnVnO01IovwRAFJ_74TBKNYtRMGe9p_2lMqHf92d1dUjHvE18sekQBSICYFiN7DGRF1bByQrKgA3ub_FXvRESbgwprG1-agK8WrbLcUqhijN6dpVpNX2ip9SAEK8g11vRlgDV1QV9WXhsDLaK4TZG9HDL_hEf2jG3rXKfap39CYHVdqRTRukiSUolOdT8Iap-z1rX77ptEPUVlg9yeRWUdWw500W-3QNb4UIbxiYowFdGmDM2Xzz0iSvmN8lq28NxwEKHzXFGlV_CKzlNqHPoTdvBOkxRCb0tMRbXZz8Gwg`;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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
  },
);

export default api;
