/**
 * useAuth Hook
 * Handles authentication operations (login, register, logout, etc.)
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginSuccess,
  loginFailure,
  logout,
  loginStart,
} from '@/store/slices/authSlice';
import {
  apiService,
  LoginRequest,
  RegisterRequest,
  getErrorMessage,
} from '@/services/api';
import { secureStorage } from '@/utils/secureStorage';
import { logger } from '@/utils/logger';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, token } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(loginStart());
      try {
        const response = await apiService.login({
          email,
          password,
        } as LoginRequest);

        // Validate response has required user data
        if (!response.user || !response.user.id || !response.user.role) {
          const errorMsg = `Invalid login response: ${JSON.stringify(response)}`;
          logger.error(errorMsg);
          dispatch(loginFailure('Invalid server response: missing user data'));
          throw new Error(errorMsg);
        }

        // Store tokens in secure storage
        secureStorage.setAccessToken(response.accessToken);
        secureStorage.setRefreshToken(response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        dispatch(
          loginSuccess({
            user: { ...response.user, role: response.user.role as any },
            token: response.accessToken,
          })
        );

        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        dispatch(loginFailure(message));
        throw err;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      dispatch(loginStart());
      try {
        const response = await apiService.register(data);

        // Store tokens in secure storage
        secureStorage.setAccessToken(response.accessToken);
        secureStorage.setRefreshToken(response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        dispatch(
          loginSuccess({
            user: { ...response.user, role: response.user.role as any },
            token: response.accessToken,
          })
        );

        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        dispatch(loginFailure(message));
        throw err;
      }
    },
    [dispatch]
  );

  const registerOnly = useCallback(
    async (data: RegisterRequest) => {
      dispatch(loginStart());
      try {
        const response = await apiService.register(data);
        // Don't auto-login, just return response
        dispatch(loginFailure('')); // Clear loading state
        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        dispatch(loginFailure(message));
        throw err;
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (err) {
      logger.error('Logout error:', err);
    } finally {
      // Clear secure storage
      secureStorage.clearTokens();
      localStorage.removeItem('user');

      // Clear Redux state
      dispatch(logout());
    }
  }, [dispatch]);

  const forgotPassword = useCallback(async (email: string) => {
    return apiService.forgotPassword({ email });
  }, []);

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      return apiService.resetPassword({ token, newPassword });
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      return apiService.changePassword({ currentPassword, newPassword });
    },
    []
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    login,
    register,
    registerOnly,
    logout: logoutUser,
    forgotPassword,
    resetPassword,
    changePassword,
  };
};
