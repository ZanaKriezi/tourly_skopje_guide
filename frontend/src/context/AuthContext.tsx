// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { User, RegisterRequest, LoginRequest } from '../types/auth';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => { throw new Error('Not implemented'); },
  register: async () => { throw new Error('Not implemented'); },
  logout: () => {},
  error: null,
  clearError: () => {},
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = (): void => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // Handle any errors during initialization
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      setError(null);
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    }
  };

  // Register handler
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setError(null);
      await authService.register(userData);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  // Logout handler
  const logout = useCallback((): void => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  // Clear error state
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Derived states
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};