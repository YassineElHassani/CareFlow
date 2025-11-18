/**
 * Users API Hook
 * Handles all user-related API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserListParams,
  UserListResponse,
} from '@/types/user.types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Get user list
  const getUserList = (params: UserListParams = {}) => {
    return useQuery<UserListResponse>({
      queryKey: ['users', 'list', params],
      queryFn: () => usersService.getUsers(params),
    });
  };

  // Get user by ID
  const getUserById = (id: string) => {
    return useQuery<User>({
      queryKey: ['users', id],
      queryFn: () => usersService.getUserById(id),
      enabled: !!id,
    });
  };

  // Create user mutation
  const {
    mutateAsync: createUser,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: (data: CreateUserDto) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user mutation
  const {
    mutateAsync: updateUser,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });

  // Delete user mutation
  const {
    mutateAsync: deleteUser,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    getUserList,
    getUserById,
    createUser,
    isCreating,
    createError,
    updateUser,
    isUpdating,
    updateError,
    deleteUser,
    isDeleting,
    deleteError,
  };
};
