export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  createdBy: string;
  createdAt: string;
  creator?: User;
  assignment?: Assignment;
}

export interface Assignment {
  id: string;
  caseId: string;
  userId: string;
  assignedAt: string;
  user?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateCaseData {
  title: string;
  description: string;
}

export interface UpdateCaseStatusData {
  status: CaseStatus;
}

export interface AssignCaseData {
  userId: string;
}
