// src/services/apiClient.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Determine if running in production (on Vercel) or locally
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1');

// Set the API URL based on environment
const API_URL = isProduction 
  ? "https://tourly-backend.onrender.com/api"
  : "http://localhost:8080/api";

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

// Error response from API
export interface ApiErrorResponse {
  message: string;
  status?: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

// Create a configured axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Response interceptor - handles common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<ApiErrorResponse>): Promise<never> => {
    // Handle expired tokens or auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Generic get method with error handling
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiErrorResponse>);
    throw error;
  }
};

// Generic post method with error handling
export const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiErrorResponse>);
    throw error;
  }
};

// Generic put method with error handling
export const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiErrorResponse>);
    throw error;
  }
};

// Generic delete method with error handling
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiErrorResponse>);
    throw error;
  }
};

// Error handling helper with proper typing
const handleApiError = (error: AxiosError<ApiErrorResponse>): void => {
  if (error.response) {
    console.error("API error:", error.response.data);
  } else if (error.request) {
    console.error("Network error:", error.message);
  } else {
    console.error("Error:", error.message);
  }
};

export default apiClient;
