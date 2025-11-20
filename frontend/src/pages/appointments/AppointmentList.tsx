/**
 * Appointments Listing Page
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Filter, RefreshCw, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/molecules/DataTable';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAppointments } from '@/hooks/api/useAppointments';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils/date';
import { toast, logger } from '@/utils';

interface AppointmentListItem {
    _id: string;
    patient: string | {
        _id: string;
        personalInfo: {
            firstName: string;
            lastName: string;
        };
    };
    doctor: string | {
        _id: string;
        profile: {
            firstName: string;
            lastName: string;
        };
    };
    scheduledDate: string;
    scheduledTime: string;
    type: string;
    status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
    chiefComplaint?: string;
    priority: string;
}

export default function AppointmentList() {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { getAppointmentList, getMyAppointments } = useAppointments();

    // Use role-based endpoint: patients use my-appointments, others use list
    const isPatient = user?.role === 'patient';
    const queryParams = {
        page,
        limit,
        status: statusFilter || undefined,
    };

    const { data, isLoading, error, refetch } = isPatient
        ? getMyAppointments(queryParams)
        : getAppointmentList(queryParams);

    const appointments = data?.data || [];
    const pagination = data?.pagination;

    const handleRefresh = () => {
        refetch();
        toast.info('Refreshing appointments...');
    };

    const handleExport = () => {
        try {
            const headers = ['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Type', 'Status', 'Priority'];
            const rows = appointments.map((apt: any) => {
                const patientName = typeof apt.patient === 'object'
                    ? `${apt.patient.personalInfo?.firstName || ''} ${apt.patient.personalInfo?.lastName || ''}`
                    : apt.patient;
                const doctorName = typeof apt.doctor === 'object'
                    ? `${apt.doctor.profile?.firstName || ''} ${apt.doctor.profile?.lastName || ''}`
                    : apt.doctor;

                return [
                    apt._id.slice(0, 8),
                    patientName,
                    doctorName,
                    formatDate(apt.scheduledDate),
                    apt.scheduledTime,
                    apt.type,
                    apt.status,
                    apt.priority
                ];
            });

            const csvContent = [
                headers.join(','),
                ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Exported ${appointments.length} appointments to CSV`);
        } catch (error) {
            logger.error('Export failed:', error);
            toast.error('Failed to export appointments');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
            scheduled: 'info',
            confirmed: 'success',
            'in-progress': 'warning',
            completed: 'success',
            cancelled: 'danger',
            'no-show': 'danger',
        };
        return colors[status] || 'info';
    };

    const columns: Column<AppointmentListItem>[] = useMemo(
        () => [
            {
                key: '_id',
                label: 'ID',
                sortable: true,
                width: '100px',
                render: (_, row) => <div className="font-mono text-sm">#{row._id.slice(0, 6)}</div>,
            },
            {
                key: 'patient',
                label: 'Patient',
                sortable: true,
                width: '180px',
                render: (_, row) => {
                    if (typeof row.patient === 'object') {
                        const { firstName, lastName } = row.patient.personalInfo;
                        return (
                            <div className="text-sm font-medium">
                                {firstName} {lastName}
                            </div>
                        );
                    }
                    return <div className="text-sm">Patient #{row.patient}</div>;
                },
            },
            {
                key: 'doctor',
                label: 'Doctor',
                sortable: true,
                width: '180px',
                render: (_, row) => {
                    if (typeof row.doctor === 'object') {
                        const { firstName, lastName } = row.doctor.profile;
                        return (
                            <div className="text-sm">
                                Dr. {firstName} {lastName}
                            </div>
                        );
                    }
                    return <div className="text-sm">Doctor #{row.doctor}</div>;
                },
            },
            {
                key: 'scheduledDate',
                label: 'Date',
                sortable: true,
                render: (_, row) => formatDate(row.scheduledDate),
                width: '120px',
            },
            {
                key: 'scheduledTime',
                label: 'Time',
                sortable: true,
                width: '100px',
            },
            {
                key: 'type',
                label: 'Type',
                sortable: true,
                width: '130px',
                render: (_, row) => (
                    <div className="capitalize text-sm">{row.type.replace('-', ' ')}</div>
                ),
            },
            {
                key: 'chiefComplaint',
                label: 'Complaint',
                sortable: false,
                width: '180px',
                render: (_, row) => (
                    <div className="text-sm text-gray-600 truncate">{row.chiefComplaint || 'N/A'}</div>
                ),
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (_, row) => (
                    <Badge variant={getStatusColor(row.status)}>
                        {row.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                ),
                width: '130px',
            },
        ],
        []
    );

    const stats = useMemo(() => {
        return {
            total: appointments.length,
            scheduled: appointments.filter((a: AppointmentListItem) => a.status === 'scheduled').length,
            confirmed: appointments.filter((a: AppointmentListItem) => a.status === 'confirmed').length,
            completed: appointments.filter((a: AppointmentListItem) => a.status === 'completed').length,
            cancelled: appointments.filter((a: AppointmentListItem) => a.status === 'cancelled').length,
        };
    }, [appointments]);

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading appointments..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading appointments</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-600 mt-1">Manage all appointments</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="primary" onClick={() => navigate(ROUTES.APPOINTMENTS_NEW)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Appointment
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Scheduled</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
                        </div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Confirmed</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
                        </div>
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
                        </div>
                        <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
                        </div>
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === '' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('')}
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'scheduled' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('scheduled')}
                        >
                            Scheduled
                        </Button>
                        <Button
                            variant={statusFilter === 'confirmed' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('confirmed')}
                        >
                            Confirmed
                        </Button>
                        <Button
                            variant={statusFilter === 'completed' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('completed')}
                        >
                            Completed
                        </Button>
                        <Button
                            variant={statusFilter === 'cancelled' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('cancelled')}
                        >
                            Cancelled
                        </Button>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <DataTable<AppointmentListItem>
                columns={columns}
                data={appointments}
                keyExtractor={(apt) => apt._id}
                searchableFields={['_id', 'chiefComplaint', 'type']}
                pageSize={limit}
                actions={[
                    {
                        label: 'View',
                        onClick: (apt) => navigate(`${ROUTES.APPOINTMENTS}/${apt._id}`),
                        variant: 'primary',
                    },
                    {
                        label: 'Edit',
                        onClick: (apt) => navigate(`${ROUTES.APPOINTMENTS}/${apt._id}/edit`),
                        variant: 'secondary',
                    },
                ]}
                emptyState={{
                    icon: <Calendar className="w-16 h-16" />,
                    title: 'No Appointments Found',
                    description: 'Create a new appointment to get started',
                }}
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center px-4">
                        Page {page} of {pagination.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page === pagination.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
