/**
 * useConsultations Hook
 * Handles consultation operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiService,
  CreateConsultationRequest,
  getErrorMessage,
} from '@/services/api';

export const useConsultations = () => {
  const queryClient = useQueryClient();

  // Queries
  const getConsultationById = (id: string) =>
    useQuery({
      queryKey: ['consultations', id],
      queryFn: () => apiService.getConsultation(id),
      enabled: !!id,
    });

  const getPatientConsultations = (patientId: string, params?: any) =>
    useQuery({
      queryKey: ['consultations', 'patient', patientId, params],
      queryFn: () => apiService.getPatientConsultations(patientId, params),
      enabled: !!patientId,
    });

  const getConsultationList = (params?: any) =>
    useQuery({
      queryKey: ['consultations', 'list', params],
      queryFn: () => apiService.listConsultations(params),
    });

  // Mutations
  const createConsultationMutation = useMutation({
    mutationFn: (data: CreateConsultationRequest) =>
      apiService.createConsultation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      console.error('Error creating consultation:', getErrorMessage(error));
    },
  });

  const updateConsultationMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateConsultationRequest>;
    }) => apiService.updateConsultation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: (error) => {
      console.error('Error updating consultation:', getErrorMessage(error));
    },
  });

  const completeConsultationMutation = useMutation({
    mutationFn: (id: string) => apiService.completeConsultation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: (error) => {
      console.error('Error completing consultation:', getErrorMessage(error));
    },
  });

  return {
    // Queries
    getConsultationById,
    getPatientConsultations,
    getConsultationList,
    // Mutations
    createConsultation: createConsultationMutation.mutateAsync,
    updateConsultation: updateConsultationMutation.mutateAsync,
    completeConsultation: completeConsultationMutation.mutateAsync,
    // Status
    isCreating: createConsultationMutation.isPending,
    isUpdating: updateConsultationMutation.isPending,
    isCompleting: completeConsultationMutation.isPending,
  };
};
