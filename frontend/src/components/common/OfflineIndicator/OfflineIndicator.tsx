/**
 * OfflineIndicator Component
 * Shows when user is offline and data might be stale
 */

import React from 'react';
import { useOnlineStatus } from '../../../hooks';
import { Wifi, WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
    className?: string;
}

/**
 * Component that displays offline status
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
    const { isOffline } = useOnlineStatus();

    if (!isOffline) {
        return null;
    }

    return (
        <div
            className={`flex items-center gap-2 px-4 py-2 bg-yellow-50 border-b border-yellow-200 ${className}`}
            role="status"
            aria-live="polite"
        >
            <WifiOff className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
                You are offline. Some features may not be available.
            </span>
        </div>
    );
};

/**
 * Floating offline indicator (small badge in corner)
 */
export const FloatingOfflineIndicator: React.FC<OfflineIndicatorProps> = ({
    className = '',
}) => {
    const { isOffline } = useOnlineStatus();

    if (!isOffline) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 border border-yellow-300 shadow-lg ${className}`}
            role="status"
            aria-live="polite"
        >
            <WifiOff className="w-4 h-4 text-yellow-600 animate-pulse" />
            <span className="text-xs text-yellow-800 font-medium">Offline</span>
        </div>
    );
};

/**
 * Status icon showing connection status
 */
export const ConnectionStatusIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { isOnline } = useOnlineStatus();

    return (
        <div
            className={`flex items-center justify-center ${className}`}
            title={isOnline ? 'Connected' : 'Offline'}
            aria-label={isOnline ? 'Connected' : 'Offline'}
        >
            {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
            ) : (
                <WifiOff className="w-5 h-5 text-red-500 animate-pulse" />
            )}
        </div>
    );
};
