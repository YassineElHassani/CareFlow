/**
 * Common Types
 * Shared types used across the application
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Doctor {
  _id: string;
  id?: string;
  userId: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  professionalInfo: {
    specialization: string[];
    licenseNumber: string;
    department?: string;
    qualifications?: string[];
    yearsOfExperience?: number;
  };
  isActive: boolean;
  availability?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface DateRange {
  fromDate?: string;
  toDate?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}
