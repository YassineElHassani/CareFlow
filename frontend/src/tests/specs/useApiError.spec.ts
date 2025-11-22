/**
 * useApiError Hook Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApiError } from '../../hooks/useApiError';

describe('useApiError Hook', () => {
  it('initializes with no error', () => {
    const { result } = renderHook(() => useApiError());
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('sets error correctly', () => {
    const { result } = renderHook(() => useApiError());
    const error = new Error('Test error');

    act(() => {
      result.current.setError(error);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe('Test error');
  });

  it('clears error correctly', () => {
    const { result } = renderHook(() => useApiError());
    const error = new Error('Test error');

    act(() => {
      result.current.setError(error);
    });

    expect(result.current.isError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors', async () => {
    const { result } = renderHook(() => useApiError());
    const error = new Error('Network error');

    await act(async () => {
      await result.current.handleApiError(error);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe('Network error');
  });

  it('retries operation successfully', async () => {
    const { result } = renderHook(() => useApiError());
    const mockOperation = vi.fn().mockResolvedValue('success');

    let operationResult;
    await act(async () => {
      operationResult = await result.current.retryOperation(mockOperation);
    });

    expect(operationResult).toBe('success');
    expect(mockOperation).toHaveBeenCalled();
    expect(result.current.isError).toBe(false);
  });

  it('retries operation and sets error on failure', async () => {
    const { result } = renderHook(() => useApiError());
    const mockError = new Error('Operation failed');
    const mockOperation = vi.fn().mockRejectedValue(mockError);

    await act(async () => {
      try {
        await result.current.retryOperation(mockOperation);
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe('Operation failed');
  });
});
