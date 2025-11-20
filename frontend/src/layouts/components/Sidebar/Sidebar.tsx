import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string | number;
  children?: MenuItem[];
}

export interface SidebarProps {
  menuItems: MenuItem[];
  userRole: string;
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  userRole,
  isOpen,
  onClose,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path)
        ? prev.filter((item) => item !== path)
        : [...prev, path]
    );
  };

  const filterMenuByRole = (items: MenuItem[]): MenuItem[] => {
    return items.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.includes(userRole);
    });
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const filteredChildren = hasChildren
      ? filterMenuByRole(item.children!)
      : [];

    const ChevronIcon = () => (
      <svg
        className={`w-4 h-4 transition-transform ${
          isExpanded ? 'rotate-90' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    );

    if (hasChildren && filteredChildren.length > 0) {
      return (
        <div key={item.path}>
          <button
            onClick={() => toggleExpand(item.path)}
            className={`
              w-full flex items-center justify-between px-4 py-3 text-sm font-medium
              text-gray-700 hover:bg-primary-50 hover:text-primary-700 
              transition-colors rounded-lg
              ${level > 0 ? 'pl-8' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <ChevronIcon />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {filteredChildren.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `
          flex items-center justify-between px-4 py-3 text-sm font-medium
          transition-colors rounded-lg
          ${level > 0 ? 'pl-8' : ''}
          ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
          }
        `
        }
      >
        <div className="flex items-center gap-3">
          <span className={level > 0 ? 'text-gray-400' : ''}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="badge badge-sm badge-primary">{item.badge}</span>
        )}
      </NavLink>
    );
  };

  const filteredMenu = filterMenuByRole(menuItems);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
          w-64
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CareFlow</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close sidebar"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredMenu.map((item) => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            CareFlow
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;