/**
 * Create Appointment Page
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppointmentForm from '@/components/organisms/AppointmentForm/AppointmentForm';
import Button from '@/components/atoms/Button';
import { useAppointments } from '@/hooks/api/useAppointments';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';

export default function CreateAppointment() {
    const navigate = useNavigate();
    const { createAppointment, isCreating } = useAppointments();

    const handleSubmit = async (data: any) => {
        try {
            // Transform form data to API format
            const appointmentData = {
                patient: data.patientId,
                doctor: data.doctorId,
                scheduledDate: data.date,
                scheduledTime: data.time,
                duration: Number(data.duration),
                type: data.type,
                priority: data.priority,
                chiefComplaint: data.reason,
                notes: data.notes,
            };

            logger.debug('Creating appointment:', appointmentData);
            await createAppointment(appointmentData);
            toast.success('Appointment created successfully!');
            navigate(ROUTES.APPOINTMENTS);
        } catch (error) {
            logger.error('Error creating appointment:', error);
            toast.error('Failed to create appointment');
        }
    };

    const handleCancel = () => {
        navigate(ROUTES.APPOINTMENTS);
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
                    <h1 className="text-3xl font-bold text-gray-900">New Appointment</h1>
                    <p className="text-gray-600 mt-1">Schedule a new appointment for a patient</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <AppointmentForm onSubmit={handleSubmit} isLoading={isCreating} />
            </div>
        </div>
    );
}
