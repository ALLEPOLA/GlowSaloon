import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface LoginData {
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

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  staffLogin: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/staff-login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  getCustomerProfile: async () => {
    try {
      const response = await api.get('/customer/profile');
      return response.data.profile;
    } catch (error) {
      throw error;
    }
  },

  getCustomerAppointments: async () => {
    try {
      const response = await api.get('/customer/appointments');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },
};

export default api;
