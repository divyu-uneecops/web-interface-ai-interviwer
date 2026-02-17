import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://api.hrone.studio",
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
    // Get token from localStorage
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3NzEzMTM5ODYsImlhdCI6MTc3MTMxMjE4NiwianRpIjoib25ydHJ0Ojc4MzAzYzM3LTE2MTUtNDY5Ni1hNTdkLTk4ZDUyZTI1MDI1NSIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiZTI5OTM3MmItNDNiYS00Yzk3LWFkNDQtOTM3MTlhOWI2OTc5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.YXv5U7lEiL9sF1ctwHBfi7B9Fl2ZWewf62zRVaqRDXhxj5kBjrLhS2-QhMFvGQ-TSTAJ_FraqEm_cNUS9_OKTsqkmASVDemxK3UaP8gj2ynfSlcgcy1BB5QD6bG3S7iVnEuGbxgfi05nwcLtc7X5Eko0LaXfV_MCMV3AwXBvSrCYUya_Edw0yep5E_oUgMVOs5TFS5BGeJ9Ki2DOZaJlmAzHyGT6v6nbrL971djw1m2253UWSBW_gGTv-N4FtLnMYaPV2q2GWACTN1QHo0HHO3382tCZL45osSOGIfN9KDCR1ADzI6zG3obNYCgdjgcQtGPu5lW8eRywxN7wUEQ8yg`;

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
