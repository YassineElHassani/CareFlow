/**
 * Create Prescription Page
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms';
import PrescriptionForm from '@/components/organisms/PrescriptionForm/PrescriptionForm';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';
import { usePrescriptions } from '@/hooks/api/usePrescriptions';

export default function CreatePrescription() {
    const navigate = useNavigate();
    const { createPrescription, isCreating } = usePrescriptions();

    const handleSubmit = async (data: any) => {
        try {
            // Transform form data to API format
            const prescriptionData = {
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

            logger.debug('Creating prescription:', prescriptionData);
            await createPrescription(prescriptionData);
            toast.success('Prescription created successfully!');
            navigate(ROUTES.PRESCRIPTIONS);
        } catch (error) {
            logger.error('Error creating prescription:', error);
            toast.error('Failed to create prescription');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PRESCRIPTIONS)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Prescription</h1>
                    <p className="text-gray-600 mt-1">Create a new prescription for a patient</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <PrescriptionForm onSubmit={handleSubmit} isLoading={isCreating} />
            </div>
        </div>
    );
}
