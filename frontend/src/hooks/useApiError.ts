/**
 * useApiError Hook
 * Provides error handling utilities for API operations in components
 */

import { useState, useCallback } from 'react';
import {
  ApiError,
  classifyApiError,
  retryWithBackoff,
} from '../services/errorHandling';

export interface UseApiErrorReturn {
  error: ApiError | null;
  isError: boolean;
  errorMessage: string;
  setError: (error: unknown) => void;
  clearError: () => void;
  handleApiError: (error: unknown) => Promise<void>;
  retryOperation: <T>(operation: () => Promise<T>) => Promise<T>;
}

/**
 * Hook for managing API errors in components
 */
export const useApiError = (): UseApiErrorReturn => {
  const [error, setErrorState] = useState<ApiError | null>(null);

  const setError = useCallback((error: unknown) => {
    const apiError = classifyApiError(error);
    setErrorState(apiError);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleApiError = useCallback(
    async (error: unknown) => {
      setError(error);
      // Log error for monitoring/debugging
      console.error('API Error:', error);
    },
    [setError]
  );

  const retryOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      try {
        clearError();
        return await retryWithBackoff(operation, 3, 1000);
      } catch (err) {
        await handleApiError(err);
        throw err;
      }
    },
    [clearError, handleApiError]
  );

  return {
    error,
    isError: error !== null,
    errorMessage: error?.message || '',
    setError,
    clearError,
    handleApiError,
    retryOperation,
  };
};

export default useApiError;
