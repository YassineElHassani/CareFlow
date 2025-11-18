/**
 * useAppointments Hook
 * Handles appointment operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiService,
  CreateAppointmentRequest,
  getErrorMessage,
} from '@/services/api';

export const useAppointments = () => {
  const queryClient = useQueryClient();

  // Queries
  const getMyAppointments = (params?: any) =>
    useQuery({
      queryKey: ['appointments', 'my', params],
      queryFn: () => apiService.getMyAppointments(params),
    });

  const getAppointmentList = (params?: any) =>
    useQuery({
      queryKey: ['appointments', 'list', params],
      queryFn: () => apiService.listAppointments(params),
    });

  const getAppointmentById = (id: string) =>
    useQuery({
      queryKey: ['appointments', id],
      queryFn: () => apiService.getAppointment(id),
      enabled: !!id,
    });

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      apiService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Error creating appointment:', getErrorMessage(error));
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAppointmentRequest>;
    }) => apiService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Error updating appointment:', getErrorMessage(error));
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiService.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Error canceling appointment:', getErrorMessage(error));
    },
  });

  const checkAvailabilityMutation = useMutation({
    mutationFn: (data: {
      doctor: string;
      scheduledDate: string;
      scheduledTime: string;
      duration: number;
    }) => apiService.checkAvailability(data),
  });

  return {
    // Queries
    getMyAppointments,
    getAppointmentList,
    getAppointmentById,
    // Mutations
    createAppointment: createAppointmentMutation.mutateAsync,
    updateAppointment: updateAppointmentMutation.mutateAsync,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    checkAvailability: checkAvailabilityMutation.mutateAsync,
    // Status
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isCanceling: cancelAppointmentMutation.isPending,
    isCheckingAvailability: checkAvailabilityMutation.isPending,
  };
};
