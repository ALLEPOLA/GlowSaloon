import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roleId: number;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    roleId: number;
  };
}

export interface JWTPayload {
  id: number;
  email: string;
  roleId: number;
}
