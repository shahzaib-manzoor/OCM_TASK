import { apiClient } from './client';
import { User, LoginCredentials, RegisterData } from '../types';

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<{ message: string; user: User }>(
      '/auth/login',
      credentials
    );
  },

  register: async (data: RegisterData) => {
    return apiClient.post<{ message: string; user: User }>(
      '/auth/register',
      data
    );
  },

  getCurrentUser: async () => {
    return apiClient.get<{ user: User }>('/auth/me');
  },

  logout: async () => {
    return apiClient.post<{ message: string }>('/auth/logout');
  },
};
