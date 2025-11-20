/**
 * User Details Page
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Shield, Calendar, Edit2, AlertCircle, Trash2 } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import { useUsers } from '@/hooks/api/useUsers';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/utils';

export default function UserDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    const { getUserById, deleteUser, isDeleting } = useUsers();
    const { data: user, isLoading, error } = getUserById(id!);

    const handleResetPassword = () => {
        setShowResetDialog(true);
    };

    const handleResetPasswordConfirm = async () => {
        if (!id || !user) return;

        try {
            // In a real app, this would call an API to send reset password email
            toast.success(`Password reset email sent to ${user.email}`);
            setShowResetDialog(false);
        } catch (error) {
            toast.error('Failed to send password reset email');
            setShowResetDialog(false);
        }
    };

    const handleViewActivityLog = () => {
        toast.info('Activity log feature coming soon');
    };

    const handleDeactivateAccount = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!id) return;

        try {
            await deleteUser(id);
            toast.success('User account deactivated successfully');
            setShowDeleteDialog(false);
            navigate(ROUTES.USERS);
        } catch (error) {
            toast.error('Failed to deactivate user account');
            setShowDeleteDialog(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading user details..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error loading user</p>
            </div>
        );
    }

    if (!user) {
        return <div className="text-center py-8 text-red-600">User not found</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.USERS)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.profile?.firstName} {user.profile?.lastName}
                            </h1>
                            <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                                {user.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                        </div>
                        <p className="text-gray-600 mt-1 capitalize">{user.role}</p>
                    </div>
                </div>
                <Button variant="primary">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit User
                </Button>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-primary-600" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Email</div>
                                    <div className="text-base font-medium text-gray-900">{user.email}</div>
                                </div>
                            </div>

                            {/* Phone */}
                            {user.profile.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Phone</div>
                                        <div className="text-base font-medium text-gray-900">{user.profile.phone}</div>
                                    </div>
                                </div>
                            )}

                            {/* Role */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Role</div>
                                    <div className="text-base font-medium text-gray-900 capitalize">{user.role}</div>
                                </div>
                            </div>

                            {/* Join Date */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Joined</div>
                                    <div className="text-base font-medium text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">User ID</span>
                            <span className="font-mono text-sm text-gray-900">#{user._id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                                {user.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="text-sm text-gray-900">
                                {new Date(user.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleViewActivityLog}
                        >
                            View Activity Log
                        </Button>
                        <Button
                            variant="danger"
                            className="w-full justify-start"
                            onClick={handleDeactivateAccount}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deactivating...' : 'Deactivate Account'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reset Password Confirmation Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Password</h3>
                                <p className="text-gray-600 mb-4">
                                    Send a password reset email to{' '}
                                    <span className="font-medium">{user?.email}</span>?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowResetDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleResetPasswordConfirm}
                                    >
                                        Send Reset Email
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete/Deactivate Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deactivate User Account</h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to deactivate{' '}
                                    <span className="font-medium">
                                        {user?.profile?.firstName} {user?.profile?.lastName}
                                    </span>
                                    's account? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteDialog(false)}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deactivating...' : 'Deactivate Account'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
