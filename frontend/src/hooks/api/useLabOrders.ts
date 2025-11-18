/**
 * useLabOrders Hook
 * Handles lab order operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiService,
  CreateLabOrderRequest,
  getErrorMessage,
} from '@/services/api';

export const useLabOrders = () => {
  const queryClient = useQueryClient();

  // Queries
  const getLabOrderById = (id: string) =>
    useQuery({
      queryKey: ['lab-orders', id],
      queryFn: () => apiService.getLabOrder(id),
      enabled: !!id,
    });

  const getLabOrderList = (params?: any) =>
    useQuery({
      queryKey: ['lab-orders', 'list', params],
      queryFn: () => apiService.listLabOrders(params),
    });

  const getPatientLabOrders = (patientId: string, params?: any) =>
    useQuery({
      queryKey: ['lab-orders', 'patient', patientId, params],
      queryFn: () => apiService.getPatientLabOrders(patientId, params),
      enabled: !!patientId,
    });

  // Mutations
  const createLabOrderMutation = useMutation({
    mutationFn: (data: CreateLabOrderRequest) =>
      apiService.createLabOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] });
    },
    onError: (error) => {
      console.error('Error creating lab order:', getErrorMessage(error));
    },
  });

  const updateSpecimenMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        collectionStatus: string;
        collectionDate?: string;
        collectorNotes?: string;
      };
    }) => apiService.updateSpecimenCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] });
    },
    onError: (error) => {
      console.error(
        'Error updating specimen collection:',
        getErrorMessage(error)
      );
    },
  });

  const uploadResultMutation = useMutation({
    mutationFn: ({
      id,
      testIndex,
      data,
    }: {
      id: string;
      testIndex: number;
      data: {
        result: string;
        resultDocument?: File;
        interpretation?: string;
        referenceRange?: string;
      };
    }) => apiService.uploadTestResult(id, testIndex, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] });
    },
    onError: (error) => {
      console.error('Error uploading test result:', getErrorMessage(error));
    },
  });

  const finalizeReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.finalizeLabReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] });
    },
    onError: (error) => {
      console.error('Error finalizing lab report:', getErrorMessage(error));
    },
  });

  const updateLabOrderMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateLabOrderRequest>;
    }) => apiService.updateLabOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] });
    },
    onError: (error) => {
      console.error('Error updating lab order:', getErrorMessage(error));
    },
  });

  return {
    // Queries
    getLabOrderById,
    getLabOrderList,
    getPatientLabOrders,
    // Mutations
    createLabOrder: createLabOrderMutation.mutateAsync,
    updateSpecimen: updateSpecimenMutation.mutateAsync,
    uploadResult: uploadResultMutation.mutateAsync,
    finalizeReport: finalizeReportMutation.mutateAsync,
    updateLabOrder: updateLabOrderMutation.mutateAsync,
    // Status
    isCreating: createLabOrderMutation.isPending,
    isUpdatingSpecimen: updateSpecimenMutation.isPending,
    isUploadingResult: uploadResultMutation.isPending,
    isFinalizing: finalizeReportMutation.isPending,
    isUpdating: updateLabOrderMutation.isPending,
  };
};
