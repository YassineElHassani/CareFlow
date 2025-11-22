/**
 * Error Handling Service Tests
 */

import { describe, it, expect, vi } from 'vitest';
import {
  classifyApiError,
  getErrorMessage,
  isRetriableError,
  retryWithBackoff,
  ApiErrorType,
} from '../../services/errorHandling';
import { AxiosError } from 'axios';
describe('Error Handling Service', () => {
  describe('classifyApiError', () => {
    it('classifies network errors', () => {
      const error = new Error('Network Error');
      (error as any).code = 'ECONNREFUSED';
      const result = classifyApiError(error);
      expect(result.type).toBe(ApiErrorType.NETWORK_ERROR);
    });

    it('classifies timeout errors', () => {
      const error = new Error('Timeout');
      (error as any).code = 'ECONNABORTED';
      const result = classifyApiError(error);
      expect(result.type).toBe(ApiErrorType.TIMEOUT);
    });

    it('classifies 401 as authentication error', () => {
      const error = new AxiosError('Unauthorized');
      error.response = {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };
      const result = classifyApiError(error);
      expect(result.type).toBe(ApiErrorType.AUTHENTICATION_ERROR);
    });

    it('classifies 403 as authorization error', () => {
      const error = new AxiosError('Forbidden');
      error.response = {
        status: 403,
        data: {},
        statusText: 'Forbidden',
        headers: {},
        config: {} as any,
      };
      const result = classifyApiError(error);
      expect(result.type).toBe(ApiErrorType.AUTHORIZATION_ERROR);
    });

    it('classifies 404 as not found', () => {
      const error = new AxiosError('Not Found');
      error.response = {
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };
      const result = classifyApiError(error);
      expect(result.type).toBe(ApiErrorType.NOT_FOUND);
    });

    it('classifies 500 as server error', () => {
      const error = new AxiosError('Server Error');
      error.response = {
        status: 500,
        data: {},
        statusText: 'Server Error',
        headers: {},
        config: {} as any,
      };
      const result = classifyApiError(error);
      expect(result.type).toBe(ApiErrorType.SERVER_ERROR);
    });
  });

  describe('getErrorMessage', () => {
    it('returns user-friendly error message', () => {
      const error = new Error('Test error');
      const message = getErrorMessage(error);
      expect(message).toBe('Test error');
    });
  });

  describe('isRetriableError', () => {
    it('returns true for network errors', () => {
      const error = new Error('Network Error');
      expect(isRetriableError(error)).toBe(true);
    });

    it('returns true for timeout errors', () => {
      const error = new Error('Timeout');
      (error as any).code = 'ECONNABORTED';
      expect(isRetriableError(error)).toBe(true);
    });

    it('returns true for server errors', () => {
      const error = new AxiosError('Server Error');
      error.response = {
        status: 500,
        data: {},
        statusText: 'Server Error',
        headers: {},
        config: {} as any,
      };
      expect(isRetriableError(error)).toBe(true);
    });

    it('returns false for auth errors', () => {
      const error = new AxiosError('Unauthorized');
      error.response = {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };
      expect(isRetriableError(error)).toBe(false);
    });
  });

  describe('retryWithBackoff', () => {
    it('succeeds on first attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(mockFn);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('retries on failure', async () => {
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce('success');

      const result = await retryWithBackoff(mockFn, 2, 10);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('throws after max retries exceeded', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Network error'));

      try {
        await retryWithBackoff(mockFn, 2, 10);
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('does not retry non-retriable errors', async () => {
      const error = new AxiosError('Unauthorized');
      error.response = {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };
      const mockFn = vi.fn().mockRejectedValue(error);

      try {
        await retryWithBackoff(mockFn, 3, 10);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(mockFn).toHaveBeenCalledTimes(1);
      }
    });
  });
});
