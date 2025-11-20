/**
 * Schedule Management Page
 * View and manage appointments with interactive calendar
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentCalendar from '@/components/organisms/AppointmentCalendar/AppointmentCalendar';

interface Appointment {
    id: string;
    title: string;
    date: string;
    time: string;
    patient?: string;
    doctor?: string;
    type: 'consultation' | 'follow-up' | 'preventive' | 'specialist' | 'surgery' | 'other';
    status: 'scheduled' | 'completed' | 'cancelled';
    location?: string;
}

export default function Schedule() {
    const navigate = useNavigate();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const handleCreateAppointment = () => {
        navigate('/appointments/new');
    };

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
                <p className="text-gray-600 mt-1">View and manage appointments with our interactive calendar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <AppointmentCalendar
                        onCreateClick={handleCreateAppointment}
                        onAppointmentClick={handleAppointmentClick}
                    />
                </div>

                {/* Appointment Details Panel */}
                {selectedAppointment && (
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900">{selectedAppointment.title}</h3>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Date & Time:</span>
                                    <p className="font-medium text-gray-900">
                                        {new Date(selectedAppointment.date + 'T' + selectedAppointment.time).toLocaleString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>

                                {selectedAppointment.location && (
                                    <div>
                                        <span className="text-gray-600">Location:</span>
                                        <p className="font-medium text-gray-900">{selectedAppointment.location}</p>
                                    </div>
                                )}

                                {selectedAppointment.patient && (
                                    <div>
                                        <span className="text-gray-600">Patient:</span>
                                        <p className="font-medium text-gray-900">{selectedAppointment.patient}</p>
                                    </div>
                                )}

                                {selectedAppointment.doctor && (
                                    <div>
                                        <span className="text-gray-600">Doctor:</span>
                                        <p className="font-medium text-gray-900">Dr. {selectedAppointment.doctor}</p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-600">Type:</span>
                                    <p className="font-medium text-gray-900 capitalize">{selectedAppointment.type}</p>
                                </div>

                                <div>
                                    <span className="text-gray-600">Status:</span>
                                    <p className="font-medium text-gray-900 capitalize">{selectedAppointment.status}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-2">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Edit Appointment
                                </button>
                                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                                    Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
