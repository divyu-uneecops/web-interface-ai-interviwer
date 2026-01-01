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
    "x-org-id": "69521ba88ecab90ed22cbcd9",
    "x-app-id": "69521cd1c9ba83a076aac3ae",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGX3l5RkRHa0RtaDdhQkd0RF9ocEVfM2czbUota244NjlTSmRJV0pmMzhJIn0.eyJleHAiOjE3NjcyODM3NDIsImlhdCI6MTc2NzI4MTk0MiwianRpIjoib25ydHJ0OmMxYjk3NzQ3LTZkNGMtY2FkNC04MDE3LWEyMGVjNzAzYzA1MCIsImlzcyI6Imh0dHBzOi8vbGVnby1rZXljbG9hay1wcm9kdWN0aW9uLnJvY2tldC5jb3Ntb2Nsb3VkLmlvL3JlYWxtcy9MZWdvIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjVlZmUzOGVhLWFlZTMtNDFlYi1iMjQzLWRjZThjYWUyODJjNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJhY2tlbmQtY2xpZW50Iiwic2lkIjoiMTdlOTVlYWMtYzVhOC00NThhLTlhMDQtMjU1YjQxZDQ0OGQ4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWxlZ28iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkRpdnlhbnNodSBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkaXZ5YW5zaHUuc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IkRpdnlhbnNodSIsImZhbWlseV9uYW1lIjoiU2h1a2xhIiwiZW1haWwiOiJkaXZ5YW5zaHUuc2h1a2xhQHVuZWVjb3BzLmluIn0.BO4XRawWz6eT3OLxRyOiCxoea1kACHkmkWj_A6AlP7M_IgCR1NTxVqzGaOpPrIDyfJqA0_rM5p0TBKd3WcyLH-ICyfjMKtn6Ah_3rFcDZk6Jkl-O8s3F7OGy_Oil9bmjjLNqrC7M0WZAk5MW-xZyv1xC-ua0Ci4zpGqxA8w3Q_nTkeoH_1aBkvZt4sHfExOiR7OVujmGog0wsqliUv4f5Mdv6fYeopNRJS7Opmna2jxplg9pLIy0Y5gf4n_2fdN4_C9iWSrse2G2MUHaxKwkJ_LgmeiVHai8iOr_3u-cjf1LOyxbMOUpkRIPUEtedRdSIF2L_GKWUi4_FrLa7Zhx2w`;

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
