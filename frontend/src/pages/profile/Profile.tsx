/**
 * Profile Page
 */

import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Edit2 } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/constants/routes';

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">User not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">View and manage your profile information</p>
                </div>
                <Button variant="primary" onClick={() => navigate(ROUTES.EDIT_PROFILE)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-primary-600" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h2>
                            <Badge variant="info">{user.role?.toUpperCase()}</Badge>
                        </div>

                        <div className="space-y-3 mt-6">
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
                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Phone</div>
                                        <div className="text-base font-medium text-gray-900">{user.phone}</div>
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

                            {/* Member Since */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Member Since</div>
                                    <div className="text-base font-medium text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">User ID</span>
                        <span className="font-mono text-sm text-gray-900">#{user.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
