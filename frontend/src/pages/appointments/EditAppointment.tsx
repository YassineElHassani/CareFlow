/**
 * Edit Appointment Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppointmentForm from '@/components/organisms/AppointmentForm/AppointmentForm';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAppointments } from '@/hooks/api/useAppointments';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';

export default function EditAppointment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getAppointmentById, updateAppointment, isUpdating } = useAppointments();

    // Fetch appointment data
    const { data: appointment, isLoading, isError } = getAppointmentById(id || '');

    const handleSubmit = async (data: any) => {
        if (!id) return;

        try {
            // Transform form data to API format
            const updateData = {
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

            logger.debug('Updating appointment:', { id, ...updateData });
            await updateAppointment({ id, data: updateData });
            toast.success('Appointment updated successfully!');
            navigate(`${ROUTES.APPOINTMENTS}/${id}`);
        } catch (error) {
            logger.error('Error updating appointment:', error);
            toast.error('Failed to update appointment');
        }
    };

    const handleCancel = () => {
        navigate(`${ROUTES.APPOINTMENTS}/${id}`);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !appointment) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg">Appointment not found</p>
                <Button onClick={() => navigate(ROUTES.APPOINTMENTS)} className="mt-4">
                    Back to Appointments
                </Button>
            </div>
        );
    }

    // Extract IDs from populated objects or use string IDs directly
    const patientId = typeof appointment.patient === 'object'
        ? appointment.patient._id
        : appointment.patient;

    const doctorId = typeof appointment.doctor === 'object'
        ? appointment.doctor._id
        : appointment.doctor;

    // Transform API data to form format
    const initialData = {
        patientId,
        doctorId,
        date: appointment.scheduledDate ? new Date(appointment.scheduledDate).toISOString().split('T')[0] : '',
        time: appointment.scheduledTime || '',
        duration: appointment.duration || 30,
        type: appointment.type,
        priority: appointment.priority || 'routine',
        reason: appointment.chiefComplaint || '',
        notes: appointment.notes || '',
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
                    <h1 className="text-3xl font-bold text-gray-900">Edit Appointment</h1>
                    <p className="text-gray-600 mt-1">Update appointment details</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <AppointmentForm
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                    initialData={initialData as any}
                />
            </div>
        </div>
    );
}
