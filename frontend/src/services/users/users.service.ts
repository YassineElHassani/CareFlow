/**
 * Users Service
 * User management API calls
 */

import { axiosInstance } from '../axios';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  User,
  GetUsersParams,
  UsersListResponse,
  SuspendUserRequest,
} from '../../types';

/**
 * Get all users with filters (admin only)
 */
export const getUsers = async (
  params?: GetUsersParams
): Promise<UsersListResponse> => {
  const response = await axiosInstance.get<UsersListResponse>(
    API_ENDPOINTS.AUTH.GET_ALL_USERS,
    { params }
  );
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<{ success: boolean; data: User }>(
    API_ENDPOINTS.AUTH.GET_USER(id)
  );
  return response.data.data;
};

/**
 * Create user (admin only)
 */
export const createUser = async (data: any): Promise<User> => {
  const response = await axiosInstance.post<User>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );
  return response.data;
};

/**
 * Update user (admin only)
 */
export const updateUser = async (id: string, data: any): Promise<User> => {
  const response = await axiosInstance.put<User>(
    API_ENDPOINTS.AUTH.GET_USER(id),
    data
  );
  return response.data;
};

/**
 * Suspend user (admin only)
 */
export const suspendUser = async (
  id: string,
  data: SuspendUserRequest
): Promise<User> => {
  const response = await axiosInstance.put<User>(
    API_ENDPOINTS.AUTH.SUSPEND_USER(id),
    data
  );
  return response.data;
};

/**
 * Reactivate user (admin only)
 */
export const reactivateUser = async (id: string): Promise<User> => {
  const response = await axiosInstance.put<User>(
    API_ENDPOINTS.AUTH.REACTIVATE_USER(id)
  );
  return response.data;
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.AUTH.DELETE_USER(id));
};

export const usersService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  suspendUser,
  reactivateUser,
  deleteUser,
};
