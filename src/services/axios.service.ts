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
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3Njk4ODA3NzEsImlhdCI6MTc2OTg3ODk3MSwianRpIjoib25ydHJ0OjI3Mzg2NDZhLWQwODEtNDczYy1mNTU4LWE2NjA4ZGEwZjFmYyIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiZTI5OTM3MmItNDNiYS00Yzk3LWFkNDQtOTM3MTlhOWI2OTc5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.KnYxEP6aHPzhFJKMdhdYotV_cNlCRP3RZSQrS_n1r4chiOEGrKECc5mrK49isByAu5ISq8htMzQNTgHVkRO6_Zpx_wyIHJHI171zsjpopMWtRZBlERpMjcCqUDW92FrF-zPzZsP9rNUmV65dpe3HT-u5bLniCTKeGNl9GdcN-49L9YxjC4qY4cWbKWTx2VI8nLkn3_s7FD5vP7UEAM9OKcRYkkslYaw4CXXtk8VFw4LtlFbidlGcugqAite2bdDltves2kIIShCE-Q6I8HjaZCXT36_YCRu36hJG5DtJfZbULSbIa_xLhpWfIS6R5Yn4jKz3CEAtqVhAKlLkMFU2sQ`;

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
