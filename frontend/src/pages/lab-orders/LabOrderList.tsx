/**
 * Lab Orders Listing Page
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Plus, Filter, RefreshCw, Download } from 'lucide-react';
import DataTable, { Column } from '@/components/molecules/DataTable';
import { Button, Badge } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useLabOrders } from '@/hooks/api/useLabOrders';
import { toast } from '@/utils/toast';
import logger from '@/utils/logger';

interface LabOrderListItem {
    _id: string;
    patient: {
        _id: string;
        personalInfo: {
            firstName: string;
            lastName: string;
        };
    };
    doctor: {
        _id: string;
        profile: {
            firstName: string;
            lastName: string;
        };
    };
    tests: Array<{
        testName: string;
        testCode: string;
        status: string;
    }>;
    status: 'pending' | 'specimen-collected' | 'in-progress' | 'completed' | 'cancelled';
    specimenCollection?: {
        status: string;
        collectionDate?: string;
    };
    createdAt: string;
}

const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'danger';
        case 'in-progress':
        case 'specimen-collected':
            return 'info';
        default:
            return 'primary';
    }
};

export default function LabOrderList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');

    const { getLabOrderList } = useLabOrders();
    const { data, isLoading, error, refetch } = getLabOrderList({
        page,
        limit,
        status: statusFilter || undefined
    });

    const labOrders: LabOrderListItem[] = data?.labOrders || [];
    const pagination = data?.pagination;

    const columns: Column<LabOrderListItem>[] = useMemo(
        () => [
            {
                key: '_id',
                label: 'Order ID',
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
                        {row.patient.personalInfo.firstName} {row.patient.personalInfo.lastName}
                    </div>
                ),
            },
            {
                key: 'tests',
                label: 'Tests',
                sortable: false,
                width: '200px',
                render: (_, row) => (
                    <div className="text-sm">
                        {row.tests.length > 0 ? (
                            <div>
                                <div className="font-medium">{row.tests[0].testName}</div>
                                {row.tests.length > 1 && (
                                    <div className="text-gray-500 text-xs">
                                        +{row.tests.length - 1} more
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
                label: 'Ordered By',
                sortable: false,
                width: '150px',
                render: (_, row) => (
                    <div className="text-sm">
                        Dr. {row.doctor.profile.firstName} {row.doctor.profile.lastName}
                    </div>
                ),
            },
            {
                key: 'createdAt',
                label: 'Order Date',
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
            total: labOrders.length,
            pending: labOrders.filter((o: LabOrderListItem) => o.status === 'pending').length,
            inProgress: labOrders.filter((o: LabOrderListItem) => o.status === 'in-progress').length,
            completed: labOrders.filter((o: LabOrderListItem) => o.status === 'completed').length,
        };
    }, [labOrders]);

    const handleRefresh = () => {
        refetch();
        toast.success('Lab orders refreshed successfully');
    };

    const handleExport = () => {
        try {
            const headers = ['ID', 'Patient', 'Doctor', 'Tests', 'Status', 'Order Date'];
            const rows = labOrders.map((order: LabOrderListItem) => [
                order._id,
                `${order.patient.personalInfo.firstName} ${order.patient.personalInfo.lastName}`,
                `${order.doctor.profile.firstName} ${order.doctor.profile.lastName}`,
                order.tests.map((t: any) => t.testName).join('; '),
                order.status,
                new Date(order.createdAt).toLocaleDateString(),
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `lab-orders-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Lab orders exported successfully');
            logger.info('Exported lab orders to CSV', { count: labOrders.length });
        } catch (error) {
            toast.error('Failed to export lab orders');
            logger.error('Error exporting lab orders:', error);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading lab orders..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading lab orders</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lab Orders</h1>
                    <p className="text-gray-600 mt-1">Manage all laboratory orders</p>
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
                    <Button variant="primary" onClick={() => navigate(ROUTES.LAB_ORDERS_NEW)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Lab Order
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
                    <div className="text-sm text-gray-600">In Progress</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</div>
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
                        <option value="specimen-collected">Specimen Collected</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <DataTable<LabOrderListItem>
                columns={columns}
                data={labOrders}
                keyExtractor={(order) => order._id}
                searchableFields={['_id']}
                pageSize={limit}
                actions={[
                    {
                        label: 'View',
                        onClick: (order) => navigate(`${ROUTES.LAB_ORDERS}/${order._id}`),
                        variant: 'primary',
                    },
                ]}
                emptyState={{
                    icon: <FlaskConical className="w-16 h-16" />,
                    title: 'No Lab Orders Found',
                    description: 'Create a new lab order to get started',
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
