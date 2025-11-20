/**
 * Appointment Details Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, Edit2, X } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';
import { LoadingSpinner, ConfirmDialog } from '@/components/common';
import { useAppointments } from '@/hooks/api/useAppointments';
import { toast } from '@/utils';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';

const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'scheduled':
            return 'info';
        case 'cancelled':
            return 'danger';
        case 'no-show':
            return 'warning';
        default:
            return 'primary';
    }
};

const getPriorityColor = (priority: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (priority) {
        case 'urgent':
            return 'danger';
        case 'high':
            return 'warning';
        case 'normal':
            return 'info';
        default:
            return 'primary';
    }
};

export default function AppointmentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const { getAppointmentById, cancelAppointment, isCanceling } = useAppointments();
    const { data: appointment, isLoading, error } = getAppointmentById(id!);

    const handleCancel = async () => {
        try {
            await cancelAppointment({ id: id!, reason: 'Canceled by user' });
            toast.success('Appointment canceled successfully');
            navigate(ROUTES.APPOINTMENTS);
        } catch (error) {
            toast.error('Failed to cancel appointment');
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading appointment details..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading appointment</p>
            </div>
        );
    }

    if (!appointment) {
        return <div className="text-center py-8 text-red-600">Appointment not found</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.APPOINTMENTS)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Appointment #{appointment._id?.slice(0, 6) || appointment.id?.slice(0, 6)}
                            </h1>
                            <Badge variant={getStatusColor(appointment.status)}>
                                {appointment.status?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                            {appointment.priority && (
                                <Badge variant={getPriorityColor(appointment.priority)}>
                                    {appointment.priority.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-600 mt-1">{appointment.type || 'N/A'} Appointment</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={() => navigate(`${ROUTES.APPOINTMENTS}/${id}/edit`)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Date</h2>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Time</h2>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{appointment.scheduledTime}</p>
                </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Patient</h2>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="text-base font-medium text-gray-900">
                                {typeof appointment.patient === 'object' && appointment.patient.personalInfo
                                    ? `${appointment.patient.personalInfo.firstName} ${appointment.patient.personalInfo.lastName}`
                                    : 'Unknown Patient'}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Patient ID</div>
                            <div className="text-base font-mono text-gray-900">
                                #{typeof appointment.patient === 'object' ? appointment.patient._id?.slice(0, 8) : appointment.patient}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Doctor</h2>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="text-base font-medium text-gray-900">
                                {typeof appointment.doctor === 'object' && appointment.doctor.profile
                                    ? `Dr. ${appointment.doctor.profile.firstName} ${appointment.doctor.profile.lastName}`
                                    : 'Unknown Doctor'}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Doctor ID</div>
                            <div className="text-base font-mono text-gray-900">
                                #{typeof appointment.doctor === 'object' ? appointment.doctor._id?.slice(0, 8) : appointment.doctor}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chief Complaint */}
            {appointment.chiefComplaint && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Chief Complaint</h2>
                    <p className="text-gray-700">{appointment.chiefComplaint}</p>
                </div>
            )}

            {/* Notes */}
            {appointment.notes && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                    <p className="text-gray-700">{appointment.notes}</p>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            <ConfirmDialog
                open={showCancelDialog}
                onCancel={() => setShowCancelDialog(false)}
                onConfirm={handleCancel}
                title="Cancel Appointment"
                message="Are you sure you want to cancel this appointment? This action cannot be undone."
                confirmText="Cancel Appointment"
                loading={isCanceling}
            />
        </div>
    );
}
