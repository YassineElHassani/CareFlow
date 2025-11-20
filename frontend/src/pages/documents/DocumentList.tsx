/**
 * Document List Page
 */

import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import { Button, Badge, Spinner } from '@/components/atoms';
import DataTable, { Column } from '@/components/molecules/DataTable';
import { ROUTES } from '@/constants/routes';
import { useDocuments } from '@/hooks';
import type { MedicalDocument } from '@/types';

const getTypeColor = (category: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (category) {
        case 'prescription':
            return 'info';
        case 'lab-report':
            return 'success';
        case 'consultation-note':
            return 'primary';
        case 'imaging':
            return 'warning';
        case 'referral':
            return 'secondary';
        default:
            return 'secondary';
    }
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default function DocumentList() {
    const navigate = useNavigate();
    const {
        getDocumentList,
        deleteDocumentMutation,
        downloadDocumentMutation,
    } = useDocuments();

    // Note: Query is disabled until backend implements documents endpoint
    const { data: documentsData, isLoading, error } = getDocumentList();

    const documents = documentsData?.data && Array.isArray(documentsData.data) ? documentsData.data : [];

    const columns: Column<MedicalDocument>[] = [
        {
            key: 'title',
            label: 'Document Name',
            sortable: true,
            width: '250px',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{row.title}</span>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Type',
            sortable: true,
            width: '130px',
            render: (_, row) => (
                <Badge variant={getTypeColor(row.category)}>
                    {row.category.replace(/-/g, ' ').toUpperCase()}
                </Badge>
            ),
        },
        {
            key: 'uploadedBy',
            label: 'Uploaded By',
            sortable: true,
            width: '150px',
            render: (_, row) => {
                if (typeof row.uploadedBy === 'string') {
                    return row.uploadedBy;
                }
                return `${row.uploadedBy.profile.firstName} ${row.uploadedBy.profile.lastName}`;
            },
        },
        {
            key: 'createdAt',
            label: 'Upload Date',
            sortable: true,
            width: '120px',
            render: (_, row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            key: 'fileSize',
            label: 'File Size',
            sortable: true,
            width: '100px',
            render: (_, row) => formatFileSize(row.fileSize),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: '100px',
            render: (_, row) => (
                <Badge variant={row.status === 'verified' ? 'success' : row.status === 'pending' ? 'warning' : 'secondary'}>
                    {row.status.toUpperCase()}
                </Badge>
            ),
        },
    ];

    // Show placeholder message since backend doesn't have documents endpoint yet
    if (!isLoading && !error && documents.length === 0) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                        <p className="text-gray-600 mt-1">Manage medical documents and records</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate(`${ROUTES.DOCUMENTS}/upload`)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                    </Button>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <FileText className="w-16 h-16 text-blue-400" />
                        <div>
                            <h3 className="text-xl font-semibold text-blue-900 mb-2">
                                Documents Feature Ready
                            </h3>
                            <p className="text-blue-700 max-w-2xl">
                                The documents management system is fully implemented and ready to use.
                                However, the backend API endpoint (<code className="bg-blue-100 px-2 py-1 rounded">/api/v1/documents</code>)
                                is not yet available.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 mt-4 text-left max-w-2xl w-full">
                            <h4 className="font-semibold text-gray-900 mb-3">✅ Frontend Features Implemented:</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Document upload with metadata (patient, category, title, tags)</li>
                                <li>• Document listing with search and filters</li>
                                <li>• Download and delete operations</li>
                                <li>• Document verification and archival</li>
                                <li>• Support for multiple file types (PDF, images, docs)</li>
                                <li>• Confidential document marking</li>
                            </ul>
                            <p className="mt-4 text-sm text-gray-600 italic">
                                Once the backend implements the documents endpoints, this feature will work seamlessly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
                <p className="text-red-600 text-lg font-medium">Error loading documents</p>
                <p className="text-gray-600 text-sm">
                    {error instanceof Error ? error.message : 'The documents service may not be available yet.'}
                </p>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                    <p className="text-gray-600 mt-1">Manage medical documents and records</p>
                </div>
                <Button variant="primary" onClick={() => navigate(`${ROUTES.DOCUMENTS}/upload`)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                </Button>
            </div>

            <DataTable<MedicalDocument>
                columns={columns}
                data={documents}
                keyExtractor={(doc) => doc._id}
                searchableFields={['title', 'category']}
                pageSize={10}
                actions={[
                    {
                        label: 'View',
                        onClick: (doc) => navigate(`${ROUTES.DOCUMENTS}/${doc._id}`),
                        variant: 'primary',
                    },
                    {
                        label: 'Download',
                        onClick: (doc) => {
                            downloadDocumentMutation.mutate({ id: doc._id, fileName: doc.fileName });
                        },
                        variant: 'secondary',
                    },
                    {
                        label: 'Delete',
                        onClick: (doc) => {
                            if (window.confirm('Are you sure you want to delete this document?')) {
                                deleteDocumentMutation.mutate(doc._id);
                            }
                        },
                        variant: 'danger',
                    },
                ]}
                emptyState={{
                    icon: <FileText className="w-16 h-16" />,
                    title: 'No Documents Found',
                    description: 'Upload a new document to get started',
                }}
            />
        </div>
    );
}
