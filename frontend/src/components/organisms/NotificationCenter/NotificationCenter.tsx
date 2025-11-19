/**
 * Notification Center Component
 * Displays and manages notifications, alerts, and messages
 */

import { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Button from '@/components/atoms/Button';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationCenterProps {
    notifications?: Notification[];
    onMarkAsRead?: (id: string) => void;
    onDismiss?: (id: string) => void;
    maxNotifications?: number;
}

// Mock notifications for demonstration
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-001',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Smith on Feb 15 at 9:00 AM has been confirmed.',
        type: 'success',
        timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        read: false,
    },
    {
        id: 'notif-002',
        title: 'Lab Results Available',
        message: 'Your lab results for blood test are now available for review.',
        type: 'info',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        read: false,
        action: {
            label: 'View Results',
            onClick: () => console.log('View results clicked'),
        },
    },
    {
        id: 'notif-003',
        title: 'Prescription Refill Needed',
        message: 'Your prescription for Lisinopril needs refilling. Please contact your doctor.',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
        read: false,
    },
    {
        id: 'notif-004',
        title: 'System Maintenance',
        message: 'System maintenance scheduled for tonight 10 PM - 2 AM.',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
        read: true,
    },
    {
        id: 'notif-005',
        title: 'Patient Record Updated',
        message: 'Medical record for John Anderson has been updated.',
        type: 'success',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
        read: true,
    },
];

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="text-green-600" size={24} />;
        case 'error':
            return <AlertCircle className="text-red-600" size={24} />;
        case 'warning':
            return <AlertCircle className="text-yellow-600" size={24} />;
        case 'info':
        default:
            return <Info className="text-blue-600" size={24} />;
    }
};

const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200',
    };
    return colors[type] || colors.info;
};

const getTypeBgColor = (type: string): string => {
    const colors: Record<string, string> = {
        success: 'bg-green-100',
        error: 'bg-red-100',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100',
    };
    return colors[type] || colors.info;
};

const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
};

export default function NotificationCenter({
    notifications = MOCK_NOTIFICATIONS,
    onMarkAsRead,
    onDismiss,
    maxNotifications = 50,
}: NotificationCenterProps) {
    const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>(
        notifications.slice(0, maxNotifications)
    );
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        setDisplayedNotifications(notifications.slice(0, maxNotifications));
    }, [notifications, maxNotifications]);

    const handleMarkAsRead = (id: string) => {
        setDisplayedNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        onMarkAsRead?.(id);
    };

    const handleDismiss = (id: string) => {
        setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
        onDismiss?.(id);
    };

    const unreadCount = displayedNotifications.filter((n) => !n.read).length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    {unreadCount > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button
                        onClick={() => {
                            displayedNotifications.forEach((n) => {
                                if (!n.read) handleMarkAsRead(n.id);
                            });
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            {displayedNotifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">No notifications</p>
                    <p className="text-gray-600">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayedNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`rounded-lg border-2 p-4 transition-all ${getTypeColor(
                                notification.type
                            )} ${!notification.read ? 'border-current' : 'border-transparent'}`}
                        >
                            <div
                                className="flex items-start gap-4 cursor-pointer"
                                onClick={() =>
                                    setExpandedId(
                                        expandedId === notification.id ? null : notification.id
                                    )
                                }
                            >
                                <div
                                    className={`rounded-full p-2 flex-shrink-0 ${getTypeBgColor(
                                        notification.type
                                    )}`}
                                >
                                    {getTypeIcon(notification.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDismiss(notification.id);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-xs text-gray-500">
                                            {formatTime(notification.timestamp)}
                                        </p>
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(notification.id);
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>

                                    {notification.action && expandedId === notification.id && (
                                        <div className="mt-3 pt-3 border-t border-current">
                                            <Button
                                                onClick={notification.action.onClick}
                                                className="text-sm font-medium"
                                            >
                                                {notification.action.label}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
