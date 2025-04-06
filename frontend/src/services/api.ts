// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:8080/api';

// Define types for auth responses
export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
  surname?: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  age?: number;
  gender?: string;
}

export interface Place {
  id: number;
  name: string;
  description: string;
  category: string;
  // Add other place properties as needed
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name?: string;
  surname?: string;
  age?: number;
  gender?: string;
  // Add other user profile properties as needed
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Generic API service
const ApiService = {
  // Test connection to backend
  testConnection: async (): Promise<string> => {
    try {
      const response = await apiClient.get<string>('/test');
      return response.data;
    } catch (error) {
      console.error('API connection error:', error);
      throw error;
    }
  },

  // Authentication methods
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (registerData: RegisterRequest): Promise<MessageResponse> => {
    try {
      const response = await apiClient.post<MessageResponse>('/auth/register', registerData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as AuthResponse;
    }
    return null;
  },

  // Get all places
  getPlaces: async (category?: string): Promise<Place[]> => {
    try {
      const response = await apiClient.get<Place[]>('/places', {
        params: { category },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  },

  // Protected route example
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};

export default ApiService;