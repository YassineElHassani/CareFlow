/**
 * usePrescriptions Hook
 * Handles prescription operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiService,
  CreatePrescriptionRequest,
  getErrorMessage,
} from '@/services/api';

export const usePrescriptions = () => {
  const queryClient = useQueryClient();

  // Queries
  const getPrescriptionById = (id: string) =>
    useQuery({
      queryKey: ['prescriptions', id],
      queryFn: () => apiService.getPrescription(id),
      enabled: !!id,
    });

  const getPrescriptionList = (params?: any) =>
    useQuery({
      queryKey: ['prescriptions', 'list', params],
      queryFn: () => apiService.listPrescriptions(params),
    });

  const getPatientPrescriptions = (patientId: string, params?: any) =>
    useQuery({
      queryKey: ['prescriptions', 'patient', patientId, params],
      queryFn: () => apiService.getPatientPrescriptions(patientId, params),
      enabled: !!patientId,
    });

  // Mutations
  const createPrescriptionMutation = useMutation({
    mutationFn: (data: CreatePrescriptionRequest) =>
      apiService.createPrescription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    onError: (error) => {
      console.error('Error creating prescription:', getErrorMessage(error));
    },
  });

  const signPrescriptionMutation = useMutation({
    mutationFn: (id: string) => apiService.signPrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    onError: (error) => {
      console.error('Error signing prescription:', getErrorMessage(error));
    },
  });

  const sendToPharmacyMutation = useMutation({
    mutationFn: ({ id, pharmacyId }: { id: string; pharmacyId: string }) =>
      apiService.sendPrescriptionToPharmacy(id, pharmacyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    onError: (error) => {
      console.error(
        'Error sending prescription to pharmacy:',
        getErrorMessage(error)
      );
    },
  });

  const renewPrescriptionMutation = useMutation({
    mutationFn: (id: string) => apiService.renewPrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    onError: (error) => {
      console.error('Error renewing prescription:', getErrorMessage(error));
    },
  });

  const updatePrescriptionMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePrescriptionRequest>;
    }) => apiService.updatePrescription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    onError: (error) => {
      console.error('Error updating prescription:', getErrorMessage(error));
    },
  });

  const deletePrescriptionMutation = useMutation({
    mutationFn: (id: string) => apiService.deletePrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
    onError: (error) => {
      console.error('Error deleting prescription:', getErrorMessage(error));
    },
  });

  return {
    // Queries
    getPrescriptionById,
    getPrescriptionList,
    getPatientPrescriptions,
    // Mutations
    createPrescription: createPrescriptionMutation.mutateAsync,
    signPrescription: signPrescriptionMutation.mutateAsync,
    sendToPharmacy: sendToPharmacyMutation.mutateAsync,
    renewPrescription: renewPrescriptionMutation.mutateAsync,
    updatePrescription: updatePrescriptionMutation.mutateAsync,
    deletePrescription: deletePrescriptionMutation.mutateAsync,
    // Status
    isCreating: createPrescriptionMutation.isPending,
    isSigning: signPrescriptionMutation.isPending,
    isSending: sendToPharmacyMutation.isPending,
    isRenewing: renewPrescriptionMutation.isPending,
    isUpdating: updatePrescriptionMutation.isPending,
    isDeleting: deletePrescriptionMutation.isPending,
  };
};
