/**
 * Prescriptions Listing Page
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Plus, Filter, RefreshCw, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/molecules/DataTable';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePrescriptions } from '@/hooks/api/usePrescriptions';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/utils/toast';
import logger from '@/utils/logger';

interface PrescriptionListItem {
    _id: string;
    patient: { id: string; firstName: string; lastName: string };
    doctor: { id: string; firstName: string; lastName: string };
    medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
    status: 'pending' | 'signed' | 'sent-to-pharmacy' | 'dispensed' | 'completed' | 'cancelled';
    createdAt: string;
}

export default function PrescriptionList() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { getPrescriptionList } = usePrescriptions();
    const { data, isLoading, error, refetch } = getPrescriptionList({
        page,
        limit,
        status: statusFilter || undefined,
    });

    const prescriptions = data?.data || [];
    const pagination = data?.pagination;

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
            pending: 'warning',
            signed: 'info',
            'sent-to-pharmacy': 'info',
            dispensed: 'success',
            completed: 'success',
            cancelled: 'danger',
        };
        return colors[status] || 'info';
    };

    const columns: Column<PrescriptionListItem>[] = useMemo(
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
                sortable: false,
                width: '150px',
                render: (_, row) => (
                    <div className="text-sm">
                        {row.patient.firstName} {row.patient.lastName}
                    </div>
                ),
            },
            {
                key: 'medications',
                label: 'Medications',
                sortable: false,
                width: '200px',
                render: (_, row) => (
                    <div className="text-sm">
                        {row.medications.length > 0 ? (
                            <div>
                                <div className="font-medium">{row.medications[0].name}</div>
                                {row.medications.length > 1 && (
                                    <div className="text-gray-500 text-xs">
                                        +{row.medications.length - 1} more
                                    </div>
                                )}
                            </div>
                        ) : (
                            'N/A'
                        )}
                    </div>
                ),
            },
            {
                key: 'doctor',
                label: 'Doctor',
                sortable: false,
                width: '150px',
                render: (_, row) => (
                    <div className="text-sm">
                        Dr. {row.doctor.firstName} {row.doctor.lastName}
                    </div>
                ),
            },
            {
                key: 'createdAt',
                label: 'Date',
                sortable: true,
                width: '120px',
                render: (_, row) => new Date(row.createdAt).toLocaleDateString(),
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                width: '130px',
                render: (_, row) => (
                    <Badge variant={getStatusColor(row.status)}>
                        {row.status.replace(/-/g, ' ').toUpperCase()}
                    </Badge>
                ),
            },
        ],
        []
    );

    const stats = useMemo(() => {
        return {
            total: prescriptions.length,
            pending: prescriptions.filter((p: PrescriptionListItem) => p.status === 'pending').length,
            signed: prescriptions.filter((p: PrescriptionListItem) => p.status === 'signed').length,
            dispensed: prescriptions.filter((p: PrescriptionListItem) => p.status === 'dispensed').length,
        };
    }, [prescriptions]);

    const handleRefresh = () => {
        refetch();
        toast.success('Prescriptions refreshed successfully');
    };

    const handleExport = () => {
        try {
            const headers = ['ID', 'Patient', 'Doctor', 'Medications', 'Status', 'Created Date'];
            const rows = prescriptions.map((p: PrescriptionListItem) => [
                p._id,
                `${p.patient.firstName} ${p.patient.lastName}`,
                `${p.doctor.firstName} ${p.doctor.lastName}`,
                p.medications.map((m: any) => `${m.name} ${m.dosage}`).join('; '),
                p.status,
                new Date(p.createdAt).toLocaleDateString(),
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `prescriptions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Prescriptions exported successfully');
            logger.info('Exported prescriptions to CSV', { count: prescriptions.length });
        } catch (error) {
            toast.error('Failed to export prescriptions');
            logger.error('Error exporting prescriptions:', error);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading prescriptions..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading prescriptions</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
                    <p className="text-gray-600 mt-1">Manage all prescriptions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleRefresh}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="secondary" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="primary" onClick={() => navigate(ROUTES.PRESCRIPTIONS_NEW)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Prescription
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Signed</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">{stats.signed}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Dispensed</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">{stats.dispensed}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="signed">Signed</option>
                        <option value="sent-to-pharmacy">Sent to Pharmacy</option>
                        <option value="dispensed">Dispensed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <DataTable<PrescriptionListItem>
                columns={columns}
                data={prescriptions}
                keyExtractor={(rx) => rx._id}
                searchableFields={['_id']}
                pageSize={limit}
                actions={[
                    {
                        label: 'View',
                        onClick: (rx) => navigate(`${ROUTES.PRESCRIPTIONS}/${rx._id}`),
                        variant: 'primary',
                    },
                ]}
                emptyState={{
                    icon: <Pill className="w-16 h-16" />,
                    title: 'No Prescriptions Found',
                    description: 'Create a new prescription to get started',
                }}
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <div className="px-4 py-2 text-sm text-gray-700">
                            Page {page} of {pagination.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page === pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
