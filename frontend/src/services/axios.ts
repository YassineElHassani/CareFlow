/**
 * Axios Instance with Request/Response Interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, HTTP_STATUS } from '../constants/api';
import { logger } from '../utils/logger';
import { secureStorage } from '../utils/secureStorage';

// Request interceptor config type
interface RequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Response error type
interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Create and configure Axios instance
 */
export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request Interceptor - Add authorization token
   */
  instance.interceptors.request.use(
    (config: RequestConfig) => {
      // Get token from secure storage
      const token = secureStorage.getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor - Handle errors and token refresh
   */
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest = error.config as RequestConfig;

      // Handle 401 Unauthorized - try to refresh token
      if (
        error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = secureStorage.getRefreshToken();

          if (!refreshToken) {
            // No refresh token available, redirect to login
            handleAuthError();
            return Promise.reject(error);
          }

          // Attempt to refresh the token
          const response = await axios.post(
            `${API_BASE_URL}/users/refresh-token`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Update tokens in secure storage
          secureStorage.setAccessToken(accessToken);
          if (newRefreshToken) {
            secureStorage.setRefreshToken(newRefreshToken);
          }

          // Update authorization header and retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, redirect to login
          handleAuthError();
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Handle authentication errors (clear tokens and redirect to login)
 */
const handleAuthError = () => {
  secureStorage.clearTokens();
  localStorage.removeItem('user');

  // Dispatch Redux action or emit event to redirect to login
  // This will be handled by the app's global error handler
  window.dispatchEvent(new CustomEvent('AUTH_ERROR'));
};

/**
 * Create the Axios instance
 */
export const axiosInstance = createAxiosInstance();

/**
 * Helper function to extract error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse;

    // Log full error response for debugging (development only)
    if (error.response?.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      logger.error('Backend error response:', data);
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (data?.errors) {
      // Handle validation errors
      const messages = Object.values(data.errors).flat();
      return messages[0] || 'An error occurred';
    }

    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      return 'Unauthorized. Please login again.';
    }

    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      return 'You do not have permission to perform this action.';
    }

    if (error.response?.status === HTTP_STATUS.NOT_FOUND) {
      return 'Resource not found.';
    }

    if (error.response?.status === HTTP_STATUS.CONFLICT) {
      return 'Conflict. Resource already exists or has been modified.';
    }

    if (error.response?.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      return 'Server error. Please try again later.';
    }

    return error.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export default axiosInstance;
