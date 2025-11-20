/**
 * Main Application Layout
 * Used for all authenticated pages
 */

import { Suspense, useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Calendar, Users, User, Menu, LogOut,
    ClipboardList, Pill, FlaskConical, Bell,
    Activity, Stethoscope, UserCog, Package
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import Button from '../components/atoms/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { OfflineIndicator } from '../components/common';
import { ROUTES } from '../constants/routes';
import { secureStorage } from '../utils/secureStorage';
import { ROLES } from '../constants/roles';

export default function MainLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        secureStorage.clearTokens();
        localStorage.removeItem('user');
        navigate(ROUTES.LOGIN);
    };

    // Define menu items based on role
    const getMenuItems = () => {
        const role = user?.role;
        const baseItems = [
            { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
            { path: ROUTES.PROFILE, label: 'Profile', icon: User },
        ];

        const roleSpecificItems: Record<string, any[]> = {
            [ROLES.ADMIN]: [
                { path: ROUTES.USERS, label: 'User Management', icon: UserCog },
                { path: ROUTES.PATIENTS, label: 'Patients', icon: Users },
                { path: ROUTES.APPOINTMENTS, label: 'Appointments', icon: Calendar },
                { path: ROUTES.PRESCRIPTIONS, label: 'Prescriptions', icon: Pill },
                { path: ROUTES.LAB_ORDERS, label: 'Lab Orders', icon: FlaskConical },
            ],
            [ROLES.DOCTOR]: [
                { path: ROUTES.PATIENTS, label: 'My Patients', icon: Users },
                { path: ROUTES.APPOINTMENTS, label: 'Appointments', icon: Calendar },
                { path: ROUTES.CONSULTATIONS, label: 'Consultations', icon: ClipboardList },
                { path: ROUTES.PRESCRIPTIONS, label: 'Prescriptions', icon: Pill },
                { path: ROUTES.LAB_ORDERS, label: 'Lab Orders', icon: FlaskConical },
            ],
            [ROLES.NURSE]: [
                { path: ROUTES.PATIENTS, label: 'Patients', icon: Users },
                { path: ROUTES.APPOINTMENTS, label: 'Appointments', icon: Calendar },
                { path: ROUTES.CONSULTATIONS, label: 'Consultations', icon: Activity },
            ],
            [ROLES.PATIENT]: [
                { path: ROUTES.APPOINTMENTS, label: 'My Appointments', icon: Calendar },
                { path: ROUTES.PRESCRIPTIONS, label: 'Prescriptions', icon: Pill },
                { path: ROUTES.LAB_ORDERS, label: 'Lab Results', icon: FlaskConical },
            ],
            [ROLES.PHARMACIST]: [
                { path: ROUTES.PRESCRIPTIONS, label: 'Prescriptions', icon: Pill },
                { path: '/pharmacies', label: 'Pharmacy', icon: Package },
            ],
            [ROLES.LAB_STAFF]: [
                { path: ROUTES.LAB_ORDERS, label: 'Lab Orders', icon: FlaskConical },
                { path: ROUTES.PATIENTS, label: 'Patients', icon: Users },
            ],
        };

        return [...baseItems, ...(roleSpecificItems[role as string] || [])];
    };

    const menuItems = getMenuItems();

    return (
        <div className="flex h-screen bg-gray-50 flex-col">
            {/* Offline Indicator */}
            <OfflineIndicator />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Desktop */}
                <aside
                    className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'
                        } hidden lg:block`}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                        {sidebarOpen && (
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-8 h-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">CareFlow</span>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    } ${!sidebarOpen ? 'justify-center' : ''}`
                                }
                                title={!sidebarOpen ? item.label : undefined}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile Sidebar */}
                <aside
                    className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-50 w-64 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">CareFlow</span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                    }`}>
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                                aria-label="Toggle mobile menu"
                            >
                                <Menu size={24} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                                    Welcome, {user?.firstName}
                                </h1>
                                <p className="text-xs lg:text-sm text-gray-500">{user?.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-4">
                            {/* Notifications */}
                            <button
                                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Notifications"
                            >
                                <Bell size={20} className="text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Menu */}
                            <div className="hidden lg:flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                            </div>

                            {/* Logout Button */}
                            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden lg:flex">
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </Button>
                            <button
                                onClick={handleLogout}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-auto bg-gray-50">
                        <div className="p-4 lg:p-6">
                            <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
                                <Outlet />
                            </Suspense>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
