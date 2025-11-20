/**
 * Create Patient Page
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PatientForm from '@/components/organisms/PatientForm/PatientForm';
import Button from '@/components/atoms/Button';
import { usePatients } from '@/hooks/api/usePatients';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';

export default function CreatePatient() {
    const navigate = useNavigate();
    const { createPatient, isCreating } = usePatients();

    const handleSubmit = async (data: any) => {
        try {
            logger.debug('Creating patient', data);

            // Transform form data to API format
            const patientData = {
                personalInfo: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    nationalId: data.nationalId || 'N/A',
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth,
                    bloodType: data.bloodType,
                    maritalStatus: data.maritalStatus || 'single',
                },
                contact: {
                    phone: data.phone,
                    email: data.email,
                    address: {
                        street: data.address,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zipCode,
                        country: 'USA',
                    },
                },
                emergencyContact: {
                    name: data.emergencyContact,
                    relationship: data.emergencyRelationship || 'Family',
                    phone: data.emergencyPhone,
                },
                medicalInfo: {
                    allergies: data.allergies ? data.allergies.split(',').map((a: string) => a.trim()) : [],
                    chronicConditions: data.chronicConditions ? data.chronicConditions.split(',').map((c: string) => c.trim()) : [],
                },
            };

            await createPatient(patientData);
            toast.success('Patient created successfully!');
            navigate(ROUTES.PATIENTS);
        } catch (error) {
            logger.error('Error creating patient:', error);
            toast.error('Failed to create patient. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.PATIENTS);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="!p-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Patient</h1>
                    <p className="text-gray-600 mt-1">Add a new patient to the system</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <PatientForm
                    onSubmit={handleSubmit}
                    isLoading={isCreating}
                />
            </div>
        </div>
    );
}
