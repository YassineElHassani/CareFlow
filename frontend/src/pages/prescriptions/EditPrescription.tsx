/**
 * Edit Prescription Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import PrescriptionForm from '@/components/organisms/PrescriptionForm/PrescriptionForm';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';
import { usePrescriptions } from '@/hooks/api/usePrescriptions';

export default function EditPrescription() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPrescriptionById, updatePrescription, isUpdating } = usePrescriptions();

    // Fetch prescription data
    const { data: prescriptionData, isLoading: isLoadingData, error } = getPrescriptionById(id!);

    const handleSubmit = async (data: any) => {
        try {
            // Transform form data to API format
            const updateData = {
                consultationId: data.consultationId,
                medications: data.medications.map((med: any) => ({
                    name: med.name,
                    genericName: med.genericName || undefined,
                    dosage: med.dosage,
                    route: med.route,
                    frequency: med.frequency,
                    duration: med.duration,
                    quantity: Number(med.quantity),
                    refills: Number(med.refills) || 0,
                    instructions: med.instructions || undefined,
                })),
                notes: data.notes || undefined,
            };

            logger.debug('Updating prescription:', { id, ...updateData });
            await updatePrescription({ id: id!, data: updateData });
            toast.success('Prescription updated successfully!');
            navigate(`${ROUTES.PRESCRIPTIONS}/${id}`);
        } catch (error) {
            logger.error('Error updating prescription:', error);
            toast.error('Failed to update prescription');
        }
    };

    if (isLoadingData) {
        return <LoadingSpinner fullScreen message="Loading prescription..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading prescription</p>
            </div>
        );
    }

    if (!prescriptionData) {
        return <div className="text-center py-8 text-red-600">Prescription not found</div>;
    }

    // Transform API data to form format
    const initialData = {
        consultationId: prescriptionData.consultation || '',
        medications: prescriptionData.medications?.map((med: any) => ({
            name: med.name || '',
            genericName: med.genericName || '',
            dosage: med.dosage || '',
            route: med.route || 'oral',
            frequency: med.frequency || '',
            duration: med.duration || '',
            quantity: med.quantity || 1,
            refills: med.refills || 0,
            instructions: med.instructions || '',
        })) || [],
        notes: prescriptionData.notes || '',
    } as any;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(`${ROUTES.PRESCRIPTIONS}/${id}`)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Prescription</h1>
                    <p className="text-gray-600 mt-1">Update prescription details</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <PrescriptionForm onSubmit={handleSubmit} isLoading={isUpdating} initialData={initialData} />
            </div>
        </div>
    );
}
