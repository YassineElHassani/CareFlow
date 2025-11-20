/**
 * Authentication Layout
 * Used for login, register, password reset, and home pages
 */

import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AuthLayout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className={`min-h-screen bg-gradient-to-br ${isHome
                ? 'from-primary-50 via-blue-50 to-secondary-50'
                : 'from-primary-50 via-blue-50 to-secondary-50'
            } py-12 px-4`}>
            {!isHome && (
                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-primary-700 font-heading">CareFlow</h1>
                        <p className="text-secondary-600 text-sm mt-2">Healthcare Management System</p>
                    </div>
                </div>
            )}

            {/* Content */}
            <Suspense fallback={<LoadingSpinner fullScreen />}>
                {isHome ? (
                    <Outlet />
                ) : (
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                            <Outlet />
                        </div>
                    </div>
                )}
            </Suspense>

            {/* Footer */}
            {!isHome && (
                <div className="text-center mt-6 text-xs text-secondary-500">
                    <p>&copy; 2025 CareFlow. All rights reserved.</p>
                </div>
            )}
        </div>
    );
}
