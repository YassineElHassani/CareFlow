import { useState, useRef } from 'react';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface User {
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

export interface HeaderProps {
    user: User;
    onLogout: () => void;
    onToggleSidebar: () => void;
    showNotifications?: boolean;
    notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
    user,
    onLogout,
    onToggleSidebar,
    showNotifications = true,
    notificationCount = 0,
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));
    useClickOutside(notificationsRef, () => setIsNotificationsOpen(false));

    const MenuIcon = () => (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    );

    const BellIcon = () => (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
        </svg>
    );

    const ChevronDownIcon = () => (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-full px-4">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Hamburger Menu (Mobile) */}
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <MenuIcon />
                    </button>

                    {/* Search Bar (Optional) */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    {showNotifications && (
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Notifications"
                            >
                                <BellIcon />
                                {notificationCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slide-down">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <h3 className="font-semibold text-gray-900">
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notificationCount === 0 ? (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                No new notifications
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100">
                                                {/* Sample notification items */}
                                                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        New appointment scheduled
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        2 minutes ago
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-200">
                                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Avatar
                                src={user.avatar}
                                name={user.name}
                                size="sm"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                            <ChevronDownIcon />
                        </button>

                        {/* User Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-slide-down">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                    <Badge variant="primary" size="sm" className="mt-2">
                                        {user.role}
                                    </Badge>
                                </div>

                                <div className="py-1">
                                    <a
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Profile
                                    </a>
                                    <a
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Settings
                                    </a>
                                </div>

                                <div className="border-t border-gray-200 py-1">
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;