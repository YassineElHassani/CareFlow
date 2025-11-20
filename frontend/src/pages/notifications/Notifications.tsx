/**
 * Notifications Page
 * View all notifications and alerts
 */

import NotificationCenter from '@/components/organisms/NotificationCenter/NotificationCenter';

export default function Notifications() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with all your healthcare alerts and messages</p>
            </div>

            <NotificationCenter />
        </div>
    );
}
