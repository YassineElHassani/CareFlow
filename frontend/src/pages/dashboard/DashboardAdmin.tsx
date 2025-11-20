/**
 * Admin Dashboard
 * System management and statistics
 */

import { Link } from 'react-router-dom';
import { Users, UserPlus, Calendar, AlertTriangle, Activity, TrendingUp, Clock, Shield } from 'lucide-react';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/common';
import { useUsers } from '@/hooks/api/useUsers';
import { useAppointments } from '@/hooks/api/useAppointments';
import { usePatients } from '@/hooks/api/usePatients';
import { ROUTES } from '@/constants/routes';
import { useMemo } from 'react';

export default function DashboardAdmin() {
    const { getUserList } = useUsers();
    const { getAppointmentList } = useAppointments();
    const { getPatientList } = usePatients();

    const { data: usersData, isLoading: usersLoading } = getUserList({ page: 1, limit: 1000 });
    const { data: appointmentsData, isLoading: appointmentsLoading } = getAppointmentList({ page: 1, limit: 100 });
    const { data: patientsData, isLoading: patientsLoading } = getPatientList({ page: 1, limit: 100 });

    const users = usersData?.data || [];
    const appointments = appointmentsData?.data || [];
    const patients = patientsData?.data || [];

    const stats = useMemo(() => {
        const roleCount = users.reduce((acc: any, user: any) => {
            const role = user.role || 'unknown';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        const activeAppointments = appointments.filter((apt: any) =>
            apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status === 'in-progress'
        ).length;

        return {
            totalUsers: users.length,
            activeDoctors: roleCount.doctor || 0,
            totalPatients: patients.length,
            totalAppointments: appointments.length,
            activeAppointments,
            roleBreakdown: {
                patients: roleCount.patient || 0,
                doctors: roleCount.doctor || 0,
                nurses: roleCount.nurse || 0,
                pharmacists: roleCount.pharmacist || 0,
                labStaff: (roleCount['lab-technician'] || 0) + (roleCount.secretary || 0),
            }
        };
    }, [users, appointments, patients]);

    const rolePercentages = useMemo(() => {
        const total = stats.totalUsers || 1;
        return {
            patients: Math.round((stats.roleBreakdown.patients / total) * 100),
            doctors: Math.round((stats.roleBreakdown.doctors / total) * 100),
            nurses: Math.round((stats.roleBreakdown.nurses / total) * 100),
            pharmacists: Math.round((stats.roleBreakdown.pharmacists / total) * 100),
            labStaff: Math.round((stats.roleBreakdown.labStaff / total) * 100),
        };
    }, [stats]);

    if (usersLoading || appointmentsLoading || patientsLoading) {
        return <LoadingSpinner fullScreen message="Loading dashboard..." />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-blue-100 text-lg">System overview and management</p>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm text-blue-100">Last updated: Just now</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                <span className="text-sm text-blue-100">All systems operational</span>
                            </div>
                        </div>
                    </div>
                    <Link to={ROUTES.USERS_NEW}>
                        <Button variant="primary" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                            <UserPlus size={20} className="mr-2" />
                            Add New User
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Users className="w-8 h-8" />}
                        label="Total Users"
                        value={stats.totalUsers.toString()}
                        color="blue"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<UserPlus className="w-8 h-8" />}
                        label="Active Doctors"
                        value={stats.activeDoctors.toString()}
                        color="green"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<Calendar className="w-8 h-8" />}
                        label="Total Appointments"
                        value={stats.totalAppointments.toString()}
                        color="yellow"
                    />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                    <StatCard
                        icon={<AlertTriangle className="w-8 h-8" />}
                        label="Active Appointments"
                        value={stats.activeAppointments.toString()}
                        color="red"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Breakdown - Enhanced */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">User Distribution</h2>
                            <p className="text-sm text-gray-500 mt-1">Breakdown by role</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-5">
                        {[
                            { role: 'Patients', count: stats.roleBreakdown.patients, percentage: rolePercentages.patients, color: 'bg-blue-500', lightColor: 'bg-blue-100' },
                            { role: 'Doctors', count: stats.roleBreakdown.doctors, percentage: rolePercentages.doctors, color: 'bg-green-500', lightColor: 'bg-green-100' },
                            { role: 'Nurses', count: stats.roleBreakdown.nurses, percentage: rolePercentages.nurses, color: 'bg-purple-500', lightColor: 'bg-purple-100' },
                            { role: 'Pharmacists', count: stats.roleBreakdown.pharmacists, percentage: rolePercentages.pharmacists, color: 'bg-yellow-500', lightColor: 'bg-yellow-100' },
                            { role: 'Lab Staff', count: stats.roleBreakdown.labStaff, percentage: rolePercentages.labStaff, color: 'bg-red-500', lightColor: 'bg-red-100' },
                        ].filter(item => item.count > 0).map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.role}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-600">{item.count} users</span>
                                        <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                                    </div>
                                </div>
                                <div className={`w-full ${item.lightColor} rounded-full h-3 overflow-hidden`}>
                                    <div
                                        className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health - Enhanced */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
                            <p className="text-sm text-gray-500 mt-1">Real-time monitoring</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { metric: 'Server Status', value: 'Healthy', icon: Activity, color: 'green', status: 'operational' },
                            { metric: 'Database', value: '98.2%', icon: TrendingUp, color: 'green', status: 'excellent' },
                            { metric: 'API Response', value: '124ms', icon: Activity, color: 'green', status: 'fast' },
                            { metric: 'Storage Used', value: '65%', icon: AlertTriangle, color: 'yellow', status: 'normal' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className={`p-4 rounded-xl border-2 ${item.color === 'green' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                                    } transition-all hover:scale-105`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${item.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                                                }`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{item.metric}</p>
                                                <p className={`text-xs ${item.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                                                    } font-semibold mt-0.5`}>{item.status}</p>
                                            </div>
                                        </div>
                                        <span className={`text-lg font-bold ${item.color === 'green' ? 'text-green-700' : 'text-yellow-700'
                                            }`}>
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Activity - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                        <p className="text-sm text-gray-500 mt-1">Latest user actions</p>
                    </div>
                    <Link to="/users" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group">
                        View All
                        <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { user: 'Dr. John Smith', action: 'Created 3 consultations', time: '2 hours ago', type: 'doctor', color: 'blue' },
                        { user: 'Jane Doe', action: 'Booked appointment', time: '4 hours ago', type: 'patient', color: 'green' },
                        { user: 'Pharmacy Admin', action: 'Updated 12 prescriptions', time: '1 day ago', type: 'pharmacist', color: 'purple' },
                        { user: 'Lab Technician', action: 'Finalized 8 lab reports', time: '1 day ago', type: 'lab', color: 'yellow' },
                    ].map((item, i) => (
                        <div key={i} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100 hover:shadow-md transition-all`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{item.user}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.action}</p>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${item.color}-100 text-${item.color}-700`}>
                                    {item.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
