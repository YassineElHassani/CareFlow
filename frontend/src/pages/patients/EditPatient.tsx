/**
 * Edit Patient Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PatientForm from '@/components/organisms/PatientForm/PatientForm';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePatients } from '@/hooks/api/usePatients';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';

export default function EditPatient() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPatientById, updatePatient, isUpdating } = usePatients();

    // Fetch patient data
    const { data: patient, isLoading, isError } = getPatientById(id || '');

    console.log('EditPatient - patient data:', patient);
    console.log('EditPatient - isLoading:', isLoading);
    console.log('EditPatient - isError:', isError);

    const handleSubmit = async (data: any) => {
        if (!id) return;

        try {
            console.log('EditPatient handleSubmit - form data received:', data);
            logger.debug('Updating patient', { id, data });

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

            console.log('EditPatient handleSubmit - patientData to send:', patientData);
            await updatePatient({ id, data: patientData });
            toast.success('Patient updated successfully!');
            navigate(`${ROUTES.PATIENTS}/${id}`);
        } catch (error) {
            logger.error('Error updating patient:', error);
            toast.error('Failed to update patient. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(`${ROUTES.PATIENTS}/${id}`);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !patient) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">Patient not found</p>
                <Button onClick={() => navigate(ROUTES.PATIENTS)} className="mt-4">
                    Back to Patients
                </Button>
            </div>
        );
    }

    // Don't create initialData if patient is undefined
    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-500">Patient data not available</p>
                </div>
            </div>
        );
    }

    // Transform API data to form format
    const initialData = {
        firstName: patient.personalInfo?.firstName || '',
        lastName: patient.personalInfo?.lastName || '',
        nationalId: patient.personalInfo?.nationalId || '',
        email: patient.contact?.email || '',
        phone: patient.contact?.phone || '',
        dateOfBirth: patient.personalInfo?.dateOfBirth || '',
        gender: patient.personalInfo?.gender || '',
        maritalStatus: patient.personalInfo?.maritalStatus || '',
        address: patient.contact?.address?.street || '',
        city: patient.contact?.address?.city || '',
        state: patient.contact?.address?.state || '',
        zipCode: patient.contact?.address?.zipCode || '',
        bloodType: patient.personalInfo?.bloodType || '',
        allergies: patient.medicalInfo?.allergies?.join(', ') || '',
        chronicConditions: patient.medicalInfo?.chronicConditions?.join(', ') || '',
        emergencyContact: patient.emergencyContact?.name || '',
        emergencyRelationship: patient.emergencyContact?.relationship || '',
        emergencyPhone: patient.emergencyContact?.phone || '',
    };

    console.log('EditPatient - initialData created:', initialData);

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
                    <h1 className="text-3xl font-bold text-gray-900">Edit Patient</h1>
                    <p className="text-gray-600 mt-1">
                        Update information for {patient.personalInfo?.firstName} {patient.personalInfo?.lastName}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <PatientForm
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                    initialData={initialData as any}
                />
            </div>
        </div>
    );
}
