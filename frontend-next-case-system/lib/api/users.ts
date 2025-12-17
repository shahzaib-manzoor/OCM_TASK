import { apiClient } from './client';
import { User } from '../types';

export const usersAPI = {
  getAll: async () => {
    return apiClient.get<User[]>('/users');
  },
};
