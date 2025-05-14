// src/types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
  surname?: string;
  token?: string;
}

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