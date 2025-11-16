/**
 * Auth Service
 * Authentication and authorization API calls
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import { secureStorage } from '../../utils/secureStorage';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../../types';

/**
 * Register a new user
 */
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );

  // Store tokens
  if (response.data.accessToken) {
    secureStorage.setAccessToken(response.data.accessToken);
    secureStorage.setRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );

  // Store tokens
  if (response.data.accessToken) {
    secureStorage.setAccessToken(response.data.accessToken);
    secureStorage.setRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  } finally {
    // Clear tokens regardless of API response
    secureStorage.clearTokens();
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    { refreshToken }
  );

  // Update tokens
  if (response.data.accessToken) {
    secureStorage.setAccessToken(response.data.accessToken);
    if (response.data.refreshToken) {
      secureStorage.setRefreshToken(response.data.refreshToken);
    }
  }

  return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  );
  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<{ message: string }> => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );
  return response.data;
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (
  data: Partial<User['profile']>
): Promise<User> => {
  const response = await axiosInstance.put<User>(API_ENDPOINTS.AUTH.PROFILE, {
    profile: data,
  });
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
    data
  );
  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};
