/**
 * Users Listing Page
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Plus, Filter } from 'lucide-react';
import DataTable, { Column } from '@/components/molecules/DataTable';
import { Button, Badge } from '@/components/atoms';
import { LoadingSpinner, ConfirmDialog } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useUsers } from '@/hooks/api/useUsers';
import { toast, logger } from '@/utils';

export default function UserList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [roleFilter, setRoleFilter] = useState('');
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    const { getUserList, deleteUser, isDeleting } = useUsers();
    const { data, isLoading, error } = getUserList({
        page,
        limit,
        role: roleFilter as any,
    });

    // Filter out inactive (deleted) users, but show active and suspended
    const allUsers = data?.data || [];
    const users = useMemo(() => allUsers.filter((u: any) => u.status !== 'inactive'), [allUsers]);
    const totalCount = data?.count || 0;

    const handleDelete = async () => {
        if (!deleteUserId) return;

        try {
            await deleteUser(deleteUserId);
            toast.success('User deactivated successfully');
            setDeleteUserId(null);
        } catch (error) {
            logger.error('Delete failed:', error);
            toast.error('Failed to deactivate user');
            setDeleteUserId(null);
        }
    };

    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'firstName',
                label: 'Name',
                sortable: true,
                width: '180px',
                render: (_, row) => (
                    <div className="text-sm font-medium">
                        {row.profile.firstName} {row.profile.lastName}
                    </div>
                ),
            },
            {
                key: 'email',
                label: 'Email',
                sortable: true,
                width: '220px',
            },
            {
                key: 'phone',
                label: 'Phone',
                sortable: false,
                width: '140px',
                render: (_, row) => row.profile.phone || 'N/A',
            },
            {
                key: 'role',
                label: 'Role',
                sortable: true,
                width: '120px',
                render: (_, row) => (
                    <Badge variant="info">
                        {row.role}
                    </Badge>
                ),
            },
            {
                key: 'createdAt',
                label: 'Join Date',
                sortable: true,
                width: '120px',
                render: (_, row) => new Date(row.createdAt).toLocaleDateString(),
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                width: '100px',
                render: (_, row) => (
                    <Badge variant={row.status === 'active' ? 'success' : 'danger'}>
                        {row.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                ),
            },
        ],
        []
    );

    const stats = useMemo(() => {
        return {
            total: totalCount,
            active: users.filter((u: any) => u.status === 'active').length,
            doctors: users.filter((u: any) => u.role === 'doctor').length,
            admins: users.filter((u: any) => u.role === 'admin').length,
        };
    }, [users, totalCount]);

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading users..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading users</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-1">Manage all system users</p>
                </div>
                <Button variant="primary" onClick={() => navigate(ROUTES.USERS_NEW)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Active</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">{stats.active}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Doctors</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">{stats.doctors}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Admins</div>
                    <div className="text-2xl font-bold text-purple-600 mt-1">{stats.admins}</div>
                </div>
            </div>

            {/* Pagination Info */}
            <div className="text-sm text-gray-600 mb-4">
                Showing {users.length} of {totalCount} users
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="lab-staff">Lab Staff</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <DataTable<any>
                columns={columns}
                data={users}
                keyExtractor={(user) => user._id}
                searchableFields={['firstName', 'lastName', 'email']}
                pageSize={limit}
                actions={[
                    {
                        label: 'View',
                        onClick: (user) => navigate(`${ROUTES.USERS}/${user._id}`),
                        variant: 'primary',
                    },
                    {
                        label: 'Edit',
                        onClick: (user) => navigate(`${ROUTES.USERS}/${user._id}/edit`),
                        variant: 'secondary',
                    },
                    {
                        label: 'Delete',
                        onClick: (user) => setDeleteUserId(user._id),
                        variant: 'danger',
                    },
                ]}
                emptyState={{
                    icon: <UserCog className="w-16 h-16" />,
                    title: 'No Users Found',
                    description: 'Create a new user to get started',
                }}
            />

            {/* Pagination */}
            {totalCount > limit && (
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
                            Page {page} of {Math.ceil(totalCount / limit)}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= Math.ceil(totalCount / limit)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!deleteUserId}
                onCancel={() => setDeleteUserId(null)}
                onConfirm={handleDelete}
                title="Deactivate User"
                message="Are you sure you want to deactivate this user? This action cannot be undone."
                confirmText="Deactivate"
                loading={isDeleting}
            />
        </div>
    );
}
