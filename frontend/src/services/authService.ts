// src/services/authService.ts
import { post } from './apiClient';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

const AUTH_URL = '/auth';

export const login = async (credentials: LoginRequest): Promise<User> => {
  const response = await post<AuthResponse>(`${AUTH_URL}/login`, credentials);
  
  // Store the token and user in localStorage
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response));
  
  // Return a user object
  return {
    id: response.id,
    username: response.username,
    email: response.email,
    role: response.role,
    name: response.name,
    surname: response.surname,
    token: response.token
  };
};

export const register = async (userData: RegisterRequest): Promise<{ message: string }> => {
  return await post<{ message: string }>(`${AUTH_URL}/register`, userData);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const userData = JSON.parse(userStr) as AuthResponse;
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      surname: userData.surname,
      token: userData.token
    };
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

export { post };
