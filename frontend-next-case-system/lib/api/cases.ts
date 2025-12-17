import { apiClient } from './client';
import {
  Case,
  PaginatedResponse,
  CreateCaseData,
  UpdateCaseStatusData,
  AssignCaseData,
  Assignment,
} from '../types';

export const casesAPI = {
  getAll: async (page: number = 1, limit: number = 10) => {
    return apiClient.get<PaginatedResponse<Case>>(
      `/cases?page=${page}&limit=${limit}`
    );
  },

  getById: async (id: string) => {
    return apiClient.get<Case>(`/cases/${id}`);
  },

  create: async (data: CreateCaseData) => {
    return apiClient.post<Case>('/cases', data);
  },

  updateStatus: async (id: string, data: UpdateCaseStatusData) => {
    return apiClient.patch<Case>(`/cases/${id}/status`, data);
  },

  assign: async (id: string, data: AssignCaseData) => {
    return apiClient.post<Assignment>(`/cases/${id}/assign`, data);
  },
};
