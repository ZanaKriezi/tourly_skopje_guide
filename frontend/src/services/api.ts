import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, RegisterRequest, MessageResponse } from '../types/auth';
import { Place, UserProfile } from '../types/places';

const API_URL = 'http://localhost:8080/api';

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

// API service with organized endpoints by functionality
const ApiService = {
  // Auth-related endpoints
  auth: {
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
  },
  
  // Place-related endpoints
  places: {
    getAll: async (category?: string): Promise<Place[]> => {
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
    
    getById: async (id: number): Promise<Place> => {
      try {
        const response = await apiClient.get<Place>(`/places/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching place with ID ${id}:`, error);
        throw error;
      }
    },
  },
  
  // User-related endpoints
  user: {
    getProfile: async (): Promise<UserProfile> => {
      try {
        const response = await apiClient.get<UserProfile>('/user/profile');
        return response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
  },
  
  // System-related endpoints
  system: {
    testConnection: async (): Promise<string> => {
      try {
        const response = await apiClient.get<string>('/test');
        return response.data;
      } catch (error) {
        console.error('API connection error:', error);
        throw error;
      }
    },
  },
};

export default ApiService;