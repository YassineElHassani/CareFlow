/**
 * Doctor Dashboard
 * Manage patient consultations, appointments, and prescriptions
 */

import { Link } from 'react-router-dom';
import { Users, Calendar, ClipboardList, Pill, FileText, Clock, Star, TrendingUp } from 'lucide-react';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/common';
import { useAppointments } from '@/hooks/api/useAppointments';
import { usePatients } from '@/hooks/api/usePatients';
import { usePrescriptions } from '@/hooks/api/usePrescriptions';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { format } from 'date-fns';

export default function DashboardDoctor() {
    const { user } = useAppSelector((state) => state.auth);
    const { getAppointmentList } = useAppointments();
    const { getPatientList } = usePatients();
    const { getPrescriptionList } = usePrescriptions();

    const { data: appointmentsData, isLoading: appointmentsLoading } = getAppointmentList({ page: 1, limit: 100 });
    const { data: patientsData, isLoading: patientsLoading } = getPatientList({ page: 1, limit: 100 });
    const { data: prescriptionsData, isLoading: prescriptionsLoading } = getPrescriptionList({ page: 1, limit: 100 });

    const appointments = appointmentsData?.data || [];
    const patients = patientsData?.data || [];
    const prescriptions = prescriptionsData?.data || [];

    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const todayAppointments = useMemo(() => {
        return appointments.filter((apt: any) => {
            const aptDate = new Date(apt.dateTime).toISOString().split('T')[0];
            return aptDate === today && (apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status === 'in-progress');
        }).sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }, [appointments, today]);

    const stats = useMemo(() => {
        const pendingConsultations = appointments.filter((apt: any) =>
            apt.status === 'confirmed' || apt.status === 'scheduled'
        ).length;

        return {
            myPatients: patients.length,
            todayAppointments: todayAppointments.length,
            pendingConsultations,
            prescriptionsWritten: prescriptions.length,
        };
    }, [appointments, patients, prescriptions, todayAppointments]);

    const nextAppointment = todayAppointments[0];

    if (appointmentsLoading || patientsLoading || prescriptionsLoading) {
        return <LoadingSpinner fullScreen message="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header with Gradient */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome Back, Dr. {user?.lastName || 'Doctor'}</h1>
                        <p className="text-green-100 text-lg">
                            {todayAppointments.length > 0
                                ? `You have ${todayAppointments.length} appointment${todayAppointments.length !== 1 ? 's' : ''} scheduled today`
                                : 'No appointments scheduled for today'}
                        </p>
                        <div className="flex items-center gap-6 mt-4">
                            {nextAppointment && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-sm">Next patient at {format(new Date(nextAppointment.dateTime), 'h:mm a')}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-sm">{stats.myPatients} Active Patients</span>
                            </div>
                        </div>
                    </div>
                    <Link to="/consultations/create">
                        <Button variant="primary" className="bg-white text-green-600 hover:bg-green-50 shadow-lg">
                            <FileText size={20} className="mr-2" />
                            New Consultation
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Users className="w-8 h-8" />}
                        label="My Patients"
                        value={stats.myPatients.toString()}
                        color="blue"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Calendar className="w-8 h-8" />}
                        label="Today's Appointments"
                        value={stats.todayAppointments.toString()}
                        color="green"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<ClipboardList className="w-8 h-8" />}
                        label="Pending Consultations"
                        value={stats.pendingConsultations.toString()}
                        color="yellow"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Pill className="w-8 h-8" />}
                        label="Prescriptions Written"
                        value={stats.prescriptionsWritten.toString()}
                        color="purple"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
                            <p className="text-sm text-gray-500 mt-1">{todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled</p>
                        </div>
                        <Link to="/appointments" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 group">
                            View Calendar
                            <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {todayAppointments.length > 0 ? (
                            todayAppointments.slice(0, 6).map((apt: any, i: number) => {
                                const getStatusColor = (status: string) => {
                                    if (status === 'confirmed') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
                                    if (status === 'in-progress') return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
                                    return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
                                };
                                const statusColor = getStatusColor(apt.status);
                                const patientName = apt.patient?.personalInfo
                                    ? `${apt.patient.personalInfo.firstName} ${apt.patient.personalInfo.lastName}`
                                    : 'Unknown Patient';

                                return (
                                    <div key={apt._id || i} className={`p-4 rounded-xl border-2 ${statusColor.border} ${statusColor.bg} transition-all hover:shadow-md`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-center justify-center bg-white rounded-lg p-2 min-w-[60px] shadow-sm">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {format(new Date(apt.dateTime), 'h:mm')}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-bold">
                                                        {format(new Date(apt.dateTime), 'a')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{patientName}</p>
                                                    <p className="text-sm text-gray-600">{apt.type || 'Consultation'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No appointments scheduled for today</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Pending Tasks</h2>
                            <p className="text-sm text-gray-500 mt-1">4 items to complete</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { task: 'Review Lab Results', priority: 'High', count: 3 },
                            { task: 'Update Patient Records', priority: 'Medium', count: 5 },
                            { task: 'Sign Prescriptions', priority: 'High', count: 2 },
                            { task: 'Approve Leave Request', priority: 'Low', count: 1 },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${item.priority === 'High' ? 'bg-red-50 border-red-200 hover:shadow-red-100' :
                                item.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200 hover:shadow-yellow-100' :
                                    'bg-green-50 border-green-200 hover:shadow-green-100'
                                } hover:shadow-md`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900">{item.task}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {item.priority}
                                            </span>
                                            <span className="text-xs text-gray-600">{item.count} pending</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recent Consultations</h2>
                        <p className="text-sm text-gray-500 mt-1">Latest patient visits</p>
                    </div>
                    <Link to="/consultations" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 group">
                        View All
                        <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { patient: 'John Doe', date: 'Nov 22, 2024', diagnosis: 'Hypertension', status: 'Completed', color: 'blue' },
                        { patient: 'Jane Smith', date: 'Nov 21, 2024', diagnosis: 'Diabetes Type 2', status: 'Completed', color: 'green' },
                        { patient: 'Michael Brown', date: 'Nov 20, 2024', diagnosis: 'Follow-up', status: 'Pending Review', color: 'yellow' },
                    ].map((item, i) => (
                        <div key={i} className={`p-5 border-2 rounded-2xl transition-all hover:scale-105 hover:shadow-lg bg-${item.color}-50 border-${item.color}-200`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-full bg-${item.color}-100 flex items-center justify-center font-bold text-${item.color}-700`}>
                                    {item.patient.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${item.color}-100 text-${item.color}-700`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">{item.patient}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.diagnosis}</p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.date}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
