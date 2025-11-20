/**
 * Document Viewer Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, FileText } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';
import { ROUTES } from '@/constants/routes';

export default function DocumentViewer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock document data
    const document = {
        id: id || 'doc-001',
        name: 'Blood Test Results - Jan 2024.pdf',
        type: 'lab-result',
        uploadedBy: 'Dr. Sarah Johnson',
        uploadedAt: '2024-01-15',
        size: 2048576,
        status: 'verified',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DOCUMENTS)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{document.name}</h1>
                        <p className="text-gray-600 mt-1">
                            Uploaded by {document.uploadedBy} on {new Date(document.uploadedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                    <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Document Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Type</div>
                        <Badge variant="success" className="mt-1">
                            {document.type.replace(/-/g, ' ').toUpperCase()}
                        </Badge>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <Badge variant="success" className="mt-1">
                            {document.status.toUpperCase()}
                        </Badge>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Size</div>
                        <div className="text-base font-medium text-gray-900 mt-1">2.0 MB</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Document ID</div>
                        <div className="text-base font-mono text-gray-900 mt-1">#{document.id}</div>
                    </div>
                </div>
            </div>

            {/* Document Viewer */}
            <div className="bg-white rounded-lg border border-gray-200 p-12 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Preview</h3>
                    <p className="text-gray-600 mb-6">
                        Document preview functionality coming soon.
                        <br />
                        Use the download button to view the document.
                    </p>
                    <Button variant="primary">
                        <Download className="w-4 h-4 mr-2" />
                        Download Document
                    </Button>
                </div>
            </div>
        </div>
    );
}
