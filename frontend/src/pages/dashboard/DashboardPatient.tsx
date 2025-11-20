/**
 * Patient Dashboard
 * View appointments, prescriptions, and health records
 */

import { Link } from 'react-router-dom';
import { Calendar, Pill, FlaskConical, FileText, Plus, Heart, Activity, TrendingUp, Clock } from 'lucide-react';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/common';
import { useAppointments } from '@/hooks/api/useAppointments';
import { usePrescriptions } from '@/hooks/api/usePrescriptions';
import { useLabOrders } from '@/hooks/api/useLabOrders';
import { usePatients } from '@/hooks/api/usePatients';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { format, isFuture } from 'date-fns';

export default function DashboardPatient() {
    const { user } = useAppSelector((state) => state.auth);
    const { getMyAppointments } = useAppointments();
    const { getPatientPrescriptions } = usePrescriptions();
    const { getPatientLabOrders } = useLabOrders();
    const { getMyPatient } = usePatients();

    // First get patient record to get patient ID
    const { data: patientData, isLoading: patientLoading } = getMyPatient();
    const patientId = patientData?._id || patientData?.id || '';

    // Use patient-specific endpoints
    const { data: appointmentsData, isLoading: appointmentsLoading } = getMyAppointments({ page: 1, limit: 100 });
    const { data: prescriptionsData, isLoading: prescriptionsLoading } = getPatientPrescriptions(patientId, { page: 1, limit: 100 });
    const { data: labOrdersData, isLoading: labOrdersLoading } = getPatientLabOrders(patientId, { page: 1, limit: 100 });

    const appointments = appointmentsData?.data || [];
    const prescriptions = prescriptionsData?.data || [];
    const labOrders = labOrdersData?.labOrders || [];

    const upcomingAppointments = useMemo(() => {
        return appointments
            .filter((apt: any) => isFuture(new Date(apt.dateTime)) && apt.status !== 'cancelled')
            .sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }, [appointments]);

    const activePrescriptions = useMemo(() => {
        return prescriptions.filter((p: any) =>
            p.status === 'signed' || p.status === 'sent-to-pharmacy' || p.status === 'dispensed'
        );
    }, [prescriptions]);

    const pendingLabResults = useMemo(() => {
        return labOrders.filter((lab: any) =>
            lab.status === 'pending' || lab.status === 'specimen-collected' || lab.status === 'in-progress'
        );
    }, [labOrders]);

    const stats = useMemo(() => ({
        upcomingAppointments: upcomingAppointments.length,
        activePrescriptions: activePrescriptions.length,
        pendingLabResults: pendingLabResults.length,
        medicalRecords: appointments.length + prescriptions.length + labOrders.length,
    }), [upcomingAppointments, activePrescriptions, pendingLabResults, appointments, prescriptions, labOrders]);

    const nextAppointment = upcomingAppointments[0];

    if (patientLoading || appointmentsLoading || prescriptionsLoading || labOrdersLoading) {
        return <LoadingSpinner fullScreen message="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header with Gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName || 'Patient'}</h1>
                        <p className="text-purple-100 text-lg">
                            {nextAppointment
                                ? `Your next appointment is on ${format(new Date(nextAppointment.dateTime), 'MMM d, yyyy')}`
                                : 'No upcoming appointments'}
                        </p>
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 fill-current" />
                                <span className="text-sm">Stay healthy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                <span className="text-sm">{stats.activePrescriptions} active prescriptions</span>
                            </div>
                        </div>
                    </div>
                    <Link to="/appointments/new">
                        <Button variant="primary" className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg">
                            <Plus size={20} className="mr-2" />
                            Book Appointment
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Calendar className="w-8 h-8" />}
                        label="Upcoming Appointments"
                        value={stats.upcomingAppointments.toString()}
                        color="blue"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Pill className="w-8 h-8" />}
                        label="Active Prescriptions"
                        value={stats.activePrescriptions.toString()}
                        color="green"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<FlaskConical className="w-8 h-8" />}
                        label="Pending Lab Results"
                        value={stats.pendingLabResults.toString()}
                        color="yellow"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<FileText className="w-8 h-8" />}
                        label="Medical Records"
                        value={stats.medicalRecords.toString()}
                        color="purple"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Appointments */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
                            <p className="text-sm text-gray-500 mt-1">Your scheduled visits</p>
                        </div>
                        <Link to="/appointments" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group">
                            View All
                            <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.slice(0, 3).map((apt: any, i: number) => {
                                const doctorName = apt.doctor?.profile
                                    ? `Dr. ${apt.doctor.profile.lastName}`
                                    : 'Doctor';
                                const specialty = apt.doctor?.professional?.specialization?.[0] || 'General';

                                return (
                                    <div key={apt._id || i} className="p-5 rounded-2xl border-2 transition-all hover:shadow-lg bg-purple-50 border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                                                    <Activity className="w-7 h-7 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg">{doctorName}</p>
                                                    <p className="text-sm text-gray-600">{specialty}</p>
                                                    <p className="text-sm font-medium text-gray-700 mt-1">{apt.type || 'Consultation'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">{format(new Date(apt.dateTime), 'MMM d, yyyy')}</p>
                                                <p className="text-sm text-gray-600 mt-1">{format(new Date(apt.dateTime), 'h:mm a')}</p>
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 mt-2">
                                                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No upcoming appointments</p>
                                <Link to="/appointments/new">
                                    <Button variant="primary" className="mt-4">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Book an Appointment
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Prescriptions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
                            <p className="text-sm text-gray-500 mt-1">Active prescriptions</p>
                        </div>
                        <Link to="/prescriptions" className="bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors">
                            <Pill className="w-6 h-6 text-green-600" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Aspirin', dosage: '100mg', freq: 'Daily', color: 'blue', time: 'Morning' },
                            { name: 'Metformin', dosage: '500mg', freq: 'Twice Daily', color: 'green', time: 'After meals' },
                            { name: 'Lisinopril', dosage: '10mg', freq: 'Once Daily', color: 'purple', time: 'Evening' },
                        ].map((rx, i) => (
                            <div key={i} className={`p-4 rounded-xl border-2 bg-${rx.color}-50 border-${rx.color}-200 transition-all hover:scale-105`}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-gray-900">{rx.name}</p>
                                    <span className={`w-3 h-3 rounded-full bg-${rx.color}-500`}></span>
                                </div>
                                <p className="text-sm font-medium text-gray-700">{rx.dosage} · {rx.freq}</p>
                                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {rx.time}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Link to="/prescriptions">
                        <Button variant="outline" className="w-full mt-4">
                            View All Medications
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Health Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Health Profile</h2>
                        <p className="text-sm text-gray-500 mt-1">Personal health information</p>
                    </div>
                    <Link to="/profile" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group">
                        Update Profile
                        <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Blood Type', value: 'O+', icon: Heart, color: 'red' },
                        { label: 'Last Checkup', value: 'Nov 15, 2024', icon: Calendar, color: 'blue' },
                        { label: 'Height / Weight', value: '5\'10" / 180 lbs', icon: Activity, color: 'green' },
                        { label: 'Insurance', value: 'Active', icon: FileText, color: 'purple' },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className={`p-5 rounded-2xl border-2 bg-${item.color}-50 border-${item.color}-200 transition-all hover:scale-105`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Icon className={`w-6 h-6 text-${item.color}-600`} />
                                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
