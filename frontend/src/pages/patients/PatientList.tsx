/**
 * Patients Listing Page
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, Download, RefreshCw } from 'lucide-react';
import DataTable, { Column } from '@/components/molecules/DataTable';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { usePatients } from '@/hooks/api/usePatients';
import { ROUTES } from '@/constants/routes';
import { formatDate, getAge } from '@/utils/date';
import { toast, logger } from '@/utils';
import type { PatientResponse } from '@/services/api';

// Helper function to transform PatientResponse to list display format
interface PatientListItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender?: string;
    age?: number;
    status: 'active' | 'inactive';
    createdAt: string;
}

const transformPatientToListItem = (patient: PatientResponse): PatientListItem => {
    return {
        id: patient?._id || patient?.id || 'unknown',
        firstName: patient?.personalInfo?.firstName || 'Unknown',
        lastName: patient?.personalInfo?.lastName || 'Unknown',
        email: patient?.contact?.email || '',
        phone: patient?.contact?.phone || '',
        dateOfBirth: patient?.personalInfo?.dateOfBirth || '',
        gender: patient?.personalInfo?.gender,
        age: patient?.personalInfo?.dateOfBirth ? getAge(patient.personalInfo.dateOfBirth) : undefined,
        status: patient?.isActive === false ? 'inactive' : 'active',
        createdAt: patient?.createdAt || new Date().toISOString(),
    };
};

export default function PatientList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active'); // Default to active only
    const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

    // Fetch patients using React Query
    const { getPatientList, deletePatient, isDeleting } = usePatients();
    const { data: patientsData, isLoading, error, refetch } = getPatientList({
        page: currentPage,
        limit: 100,
        search: searchQuery || undefined,
    });

    const handleRefresh = () => {
        refetch();
        toast.info('Refreshing patient data...');
    };

    // Transform API data to list format
    const patients: PatientListItem[] = useMemo(() => {
        if (!patientsData?.data) return [];
        return patientsData.data.map(transformPatientToListItem);
    }, [patientsData]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = patients.length;
        const active = patients.filter(p => p.status === 'active').length;
        const inactive = patients.filter(p => p.status === 'inactive').length;
        const newThisMonth = patients.filter(p => {
            const createdDate = new Date(p.createdAt);
            const now = new Date();
            return createdDate.getMonth() === now.getMonth() &&
                createdDate.getFullYear() === now.getFullYear();
        }).length;
        return { total, active, inactive, newThisMonth };
    }, [patients]);

    // Filter by status and search
    const filteredPatients = useMemo(() => {
        let filtered = patients;

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.firstName.toLowerCase().includes(query) ||
                p.lastName.toLowerCase().includes(query) ||
                p.email.toLowerCase().includes(query) ||
                p.phone.includes(query)
            );
        }

        return filtered;
    }, [patients, statusFilter, searchQuery]);

    const handleView = (patientId: string) => {
        navigate(`${ROUTES.PATIENTS}/${patientId}`);
    };

    const handleEdit = (patientId: string) => {
        navigate(`${ROUTES.PATIENTS}/${patientId}/edit`);
    };

    const handleDelete = async () => {
        if (!deletePatientId) return;

        try {
            await deletePatient(deletePatientId);
            toast.success('Patient deleted successfully');
            setDeletePatientId(null);
            refetch();
        } catch (error) {
            logger.error('Delete failed:', error);
            toast.error('Failed to delete patient');
            setDeletePatientId(null);
        }
    };

    const handleExport = () => {
        try {
            // Convert data to CSV format
            const headers = ['MRN', 'Name', 'Email', 'Phone', 'Gender', 'Age', 'Status', 'Created Date'];
            const rows = filteredPatients.map(p => [
                p.id || '',
                `${p.firstName} ${p.lastName}`,
                p.email || '',
                p.phone || '',
                p.gender || '',
                p.age?.toString() || '',
                p.status || '',
                new Date(p.createdAt).toLocaleDateString()
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Exported ${filteredPatients.length} patients to CSV`);
        } catch (error) {
            logger.error('Export failed:', error);
            toast.error('Failed to export patient data');
        }
    };

    const columns: Column<PatientListItem>[] = useMemo(
        () => [
            {
                key: 'id',
                label: 'MRN',
                sortable: true,
                render: (_, row) => {
                    if (!row || !row.id) return <div className="text-gray-400">N/A</div>;
                    return (
                        <div className="font-mono text-sm font-medium text-gray-900">
                            {`ID: ${row.id.slice(0, 8)}`}
                        </div>
                    );
                },
                width: '120px',
            },
            {
                key: 'firstName',
                label: 'Patient Name',
                sortable: true,
                render: (_, row) => (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                            {row.firstName[0]}{row.lastName[0]}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
                            <div className="text-sm text-gray-500">{row.email}</div>
                        </div>
                    </div>
                ),
                width: '280px',
            },
            {
                key: 'phone',
                label: 'Contact',
                sortable: true,
                render: (value) => (
                    <div className="text-sm text-gray-600">{value as string}</div>
                ),
                width: '140px',
            },
            {
                key: 'dateOfBirth',
                label: 'Age',
                sortable: true,
                render: (value) => (
                    <div className="text-sm">
                        <div className="font-medium text-gray-900">{getAge(value as string)} years</div>
                        <div className="text-xs text-gray-500">{formatDate(value as string)}</div>
                    </div>
                ),
                width: '140px',
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (value) => (
                    <Badge variant={value === 'active' ? 'success' : 'danger'}>
                        {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                    </Badge>
                ),
                width: '100px',
            },
            {
                key: 'createdAt',
                label: 'Registered',
                sortable: true,
                render: (value) => (
                    <div className="text-sm text-gray-600">
                        {formatDate(value as string)}
                    </div>
                ),
                width: '120px',
            },
        ],
        [],
    );

    // Handle loading state
    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading patients..." />;
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">Error loading patients</div>
                    <div className="text-gray-600">{error instanceof Error ? error.message : 'Unknown error'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and view all patient records
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate(ROUTES.PATIENTS_NEW)}
                        className="flex items-center gap-2"
                    >
                        <UserPlus size={18} />
                        New Patient
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Patients</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {stats.active}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Inactive</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {stats.inactive}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">New This Month</p>
                            <p className="text-2xl font-bold text-purple-600 mt-1">
                                {stats.newThisMonth}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, or MRN..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('active')}
                        >
                            Active
                        </Button>
                        <Button
                            variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('inactive')}
                        >
                            Inactive
                        </Button>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <DataTable<PatientListItem>
                    columns={columns}
                    data={filteredPatients}
                    keyExtractor={(patient) => patient.id}
                    searchableFields={['firstName', 'lastName', 'email', 'phone']}
                    pageSize={10}
                    onRowClick={(patient) => handleView(patient.id)}
                    actions={[
                        {
                            label: 'View',
                            onClick: (patient) => handleView(patient.id),
                            variant: 'primary',
                        },
                        {
                            label: 'Edit',
                            onClick: (patient) => handleEdit(patient.id),
                            variant: 'secondary',
                        },
                        {
                            label: 'Delete',
                            onClick: (patient) => setDeletePatientId(patient.id),
                            variant: 'danger',
                        },
                    ]}
                    emptyState={{
                        icon: <Users className="w-16 h-16 text-gray-400" />,
                        title: 'No Patients Found',
                        description: statusFilter === 'all'
                            ? 'Get started by creating your first patient record.'
                            : `No ${statusFilter} patients found.`,
                    }}
                />
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!deletePatientId}
                onCancel={() => setDeletePatientId(null)}
                onConfirm={handleDelete}
                title="Delete Patient"
                message="Are you sure you want to delete this patient? This action cannot be undone."
                confirmText="Delete"
                loading={isDeleting}
            />
        </div>
    );
}
