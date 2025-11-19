/**
 * DataTable Component
 * Reusable table with sorting, filtering, pagination, and search
 */

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Pagination from '../Pagination';

export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    width?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T, index: number) => string | number;
    title?: string;
    description?: string;
    emptyState?: {
        icon?: React.ReactNode;
        title: string;
        description?: string;
    };
    searchableFields?: (keyof T)[];
    pageSize?: number;
    onRowClick?: (row: T) => void;
    actions?: {
        label: string;
        onClick: (row: T) => void;
        variant?: 'primary' | 'secondary' | 'danger';
    }[];
}

interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export default function DataTable<T>({
    columns,
    data,
    keyExtractor,
    title,
    description,
    emptyState,
    searchableFields = [],
    pageSize = 10,
    onRowClick,
    actions = [],
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm || searchableFields.length === 0) return data;

        return data.filter((item) =>
            searchableFields.some((field) => {
                const value = item[field];
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, searchableFields]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof T];
            const bValue = b[sortConfig.key as keyof T];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

        return sorted;
    }, [filteredData, sortConfig]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return {
                    key,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' };
        });
        setCurrentPage(1);
    };

    const renderSortIcon = (columnKey: string) => {
        if (sortConfig?.key !== columnKey) {
            return <span className="text-gray-400 ml-1">⇅</span>;
        }
        return <span className="text-primary-600 ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                {emptyState ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        {emptyState.icon && <div className="mb-4 text-4xl">{emptyState.icon}</div>}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyState.title}</h3>
                        {emptyState.description && <p className="text-gray-600 text-center">{emptyState.description}</p>}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No data available</p>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            {(title || searchableFields.length > 0) && (
                <div className="p-6 border-b border-gray-200">
                    {title && <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>}
                    {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}

                    {searchableFields.length > 0 && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full md:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(String(column.key))}
                                >
                                    <div className="flex items-center">
                                        {column.label}
                                        {column.sortable && renderSortIcon(String(column.key))}
                                    </div>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((row, index) => (
                            <tr
                                key={keyExtractor(row, index)}
                                onClick={() => onRowClick?.(row)}
                                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
                            >
                                {columns.map((column) => (
                                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex gap-2">
                                            {actions.map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        action.onClick(row);
                                                    }}
                                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${action.variant === 'danger'
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : action.variant === 'secondary'
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                                        }`}
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer with Pagination */}
            {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * pageSize + 1} to{' '}
                            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
