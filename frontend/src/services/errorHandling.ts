/**
 * API Error Handling Service
 * Centralized error handling, retry logic, and offline detection
 */

import { AxiosError } from 'axios';

export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  OFFLINE = 'OFFLINE',
  UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  data?: any;
  originalError?: Error;
}

/**
 * Classify API error into specific type
 */
export const classifyApiError = (error: unknown): ApiError => {
  // Handle offline errors
  if (!navigator.onLine) {
    return {
      type: ApiErrorType.OFFLINE,
      message:
        'You are currently offline. Please check your internet connection.',
    };
  }

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    if (!error.response) {
      // Network error - no response from server
      if (error.code === 'ECONNABORTED') {
        return {
          type: ApiErrorType.TIMEOUT,
          message: 'Request timeout. Please try again.',
          originalError: error,
        };
      }
      return {
        type: ApiErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection.',
        originalError: error,
      };
    }

    // Handle specific status codes
    switch (status) {
      case 400:
        return {
          type: ApiErrorType.VALIDATION_ERROR,
          message: data?.message || 'Invalid request data',
          statusCode: status,
          data,
        };
      case 401:
        return {
          type: ApiErrorType.AUTHENTICATION_ERROR,
          message: 'Your session has expired. Please log in again.',
          statusCode: status,
          data,
        };
      case 403:
        return {
          type: ApiErrorType.AUTHORIZATION_ERROR,
          message: 'You do not have permission to perform this action.',
          statusCode: status,
          data,
        };
      case 404:
        return {
          type: ApiErrorType.NOT_FOUND,
          message: 'The requested resource was not found.',
          statusCode: status,
          data,
        };
      case 429:
        return {
          type: ApiErrorType.VALIDATION_ERROR,
          message: 'Too many requests. Please try again later.',
          statusCode: status,
          data,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ApiErrorType.SERVER_ERROR,
          message: 'Server error. Please try again later.',
          statusCode: status,
          data,
        };
      default:
        return {
          type: ApiErrorType.UNKNOWN,
          message: data?.message || 'An unknown error occurred.',
          statusCode: status,
          data,
        };
    }
  }

  // Handle regular errors
  if (error instanceof Error) {
    return {
      type: ApiErrorType.UNKNOWN,
      message: error.message,
      originalError: error,
    };
  }

  return {
    type: ApiErrorType.UNKNOWN,
    message: 'An unknown error occurred.',
  };
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const apiError = classifyApiError(error);
  return apiError.message;
};

/**
 * Check if error is retriable
 */
export const isRetriableError = (error: unknown): boolean => {
  const apiError = classifyApiError(error);
  return [
    ApiErrorType.NETWORK_ERROR,
    ApiErrorType.TIMEOUT,
    ApiErrorType.SERVER_ERROR,
    ApiErrorType.OFFLINE,
  ].includes(apiError.type);
};

/**
 * Retry logic with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retriable
      if (!isRetriableError(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (i === maxRetries - 1) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = delayMs * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
};

/**
 * Offline detection service
 */
export class OfflineDetectionService {
  private isOffline = false;
  private listeners: Set<(isOffline: boolean) => void> = new Set();

  constructor() {
    window.addEventListener('online', () => this.setOnline());
    window.addEventListener('offline', () => this.setOffline());
  }

  private setOnline() {
    if (this.isOffline) {
      this.isOffline = false;
      this.notifyListeners();
    }
  }

  private setOffline() {
    if (!this.isOffline) {
      this.isOffline = true;
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.isOffline));
  }

  public subscribe(listener: (isOffline: boolean) => void) {
    this.listeners.add(listener);
    // Immediately notify of current state
    listener(this.isOffline);
    return () => this.listeners.delete(listener);
  }

  public getStatus() {
    return {
      isOffline: this.isOffline,
      isOnline: !this.isOffline,
    };
  }
}

export const offlineDetectionService = new OfflineDetectionService();
