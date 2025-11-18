/**
 * usePatients Hook
 * Handles patient operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiService,
  CreatePatientRequest,
  getErrorMessage,
} from '@/services/api';

export const usePatients = () => {
  const queryClient = useQueryClient();

  // Queries
  const getMyPatient = (options?: { enabled?: boolean }) =>
    useQuery({
      queryKey: ['patients', 'me'],
      queryFn: () => apiService.getMyPatient(),
      enabled: options?.enabled !== false,
    });

  const getPatientById = (id: string) =>
    useQuery({
      queryKey: ['patients', id],
      queryFn: () => apiService.getPatient(id),
      enabled: !!id,
    });

  const getPatientList = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    enabled?: boolean;
  }) =>
    useQuery({
      queryKey: ['patients', 'list', params],
      queryFn: () => apiService.listPatients(params),
      enabled: params?.enabled !== false,
    });

  const searchPatients = (
    query: string,
    params?: { page?: number; limit?: number }
  ) =>
    useQuery({
      queryKey: ['patients', 'search', query, params],
      queryFn: () => apiService.searchPatients(query, params),
      enabled: !!query,
    });

  // Mutations
  const createPatientMutation = useMutation({
    mutationFn: (data: CreatePatientRequest) => apiService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Error creating patient:', getErrorMessage(error));
    },
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePatientRequest>;
    }) => apiService.updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Error updating patient:', getErrorMessage(error));
    },
  });

  const deletePatientMutation = useMutation({
    mutationFn: (id: string) => apiService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Error deleting patient:', getErrorMessage(error));
    },
  });

  return {
    // Queries
    getMyPatient,
    getPatientById,
    getPatientList,
    searchPatients,
    // Mutations
    createPatient: createPatientMutation.mutateAsync,
    updatePatient: updatePatientMutation.mutateAsync,
    deletePatient: deletePatientMutation.mutateAsync,
    // Status
    isCreating: createPatientMutation.isPending,
    isUpdating: updatePatientMutation.isPending,
    isDeleting: deletePatientMutation.isPending,
  };
};
