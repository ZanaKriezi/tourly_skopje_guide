// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import ApiService, { RegisterRequest } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
  name?: string;
  surname?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (registerData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = ApiService.getCurrentUser();
    if (currentUser) {
      setUser({
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        token: currentUser.token,
        name: currentUser.name,
        surname: currentUser.surname,
      });
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const data = await ApiService.login(username, password);
    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      token: data.token,
    });
  };

  const register = async (registerData: RegisterRequest): Promise<void> => {
    await ApiService.register(registerData);
  };

  const logout = (): void => {
    ApiService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);