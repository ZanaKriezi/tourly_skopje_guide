// src/services/authService.ts
import { post } from './apiClient';
import { AuthResponse, LoginRequest, RegisterRequest, User, MessageResponse } from '../types/auth';

const AUTH_URL = '/auth';

/**
 * Login a user and store their session
 */
export const login = async (credentials: LoginRequest): Promise<User> => {
  const response = await post<AuthResponse>(`${AUTH_URL}/login`, credentials);
  
  // Store auth data in localStorage
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
  }
  
  // Return user object
  return {
    id: response.id,
    username: response.username,
    email: response.email,
    role: response.role,
    name: response.name,
    surname: response.surname,
  };
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterRequest): Promise<MessageResponse> => {
  return await post<MessageResponse>(`${AUTH_URL}/register`, userData);
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const userData = JSON.parse(userStr) as AuthResponse;
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        surname: userData.surname,
      };
    } catch (error) {
      // If parsing fails, clear storage and return null
      console.log('Error parsing user data:', error);
      logout();

      return null;
    }
  }
  return null;
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

/**
 * Check if current user is an admin
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'ROLE_ADMIN';
};