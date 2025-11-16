/**
 * Services Index
 * Central export for all API services
 */

// Re-export commonly used services and utilities
export { axiosInstance } from './axios';
export {
  classifyApiError,
  getErrorMessage,
  isRetriableError,
  retryWithBackoff,
  offlineDetectionService,
  OfflineDetectionService,
  ApiErrorType,
} from './errorHandling';
export type { ApiError } from './errorHandling';

// Main API service
export { apiService } from './api';
export type { LoginRequest, RegisterRequest, AuthResponse } from './api';

// Domain services
export * from './auth';
export * from './users';
export * from './patients';
export * from './appointments';
export * from './consultations';
export * from './prescriptions';
export * from './pharmacies';
export * from './lab-orders';
export * from './doctors';
export * from './documents';
