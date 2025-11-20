/**
 * Patient Details Page
 * Displays comprehensive patient information
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Phone,
    Mail,
    MapPin,
    User,
    Heart,
    AlertCircle,
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePatients } from '@/hooks/api/usePatients';
import { ROUTES } from '@/constants/routes';
import { formatDate, getAge } from '@/utils/date';
import { toast } from '@/utils';

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'contacts'>('overview');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { getPatientById, deletePatient, isDeleting } = usePatients();
    const { data: patient, isLoading, error } = getPatientById(id || '');

    const handleEdit = () => {
        navigate(`${ROUTES.PATIENTS}/${id}/edit`);
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!id) return;

        try {
            await deletePatient(id);
            toast.success('Patient deleted successfully');
            setShowDeleteDialog(false);
            navigate(ROUTES.PATIENTS);
        } catch (error) {
            toast.error('Failed to delete patient');
            setShowDeleteDialog(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    const handleBack = () => {
        navigate(ROUTES.PATIENTS);
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading patient details..." />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">Error loading patient</div>
                    <div className="text-gray-600 mb-4">
                        {error instanceof Error ? error.message : 'Unknown error'}
                    </div>
                    <Button onClick={handleBack}>Back to Patients</Button>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-gray-600 text-lg mb-4">Patient not found</div>
                    <Button onClick={handleBack}>Back to Patients</Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBack}
                            className="!p-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {patient.personalInfo?.firstName} {patient.personalInfo?.lastName}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Patient ID: {patient._id || patient.id} • {patient.personalInfo?.dateOfBirth ? getAge(patient.personalInfo.dateOfBirth) : 'N/A'} years old
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEdit}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="danger" onClick={handleDeleteClick} disabled={isDeleting}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>

                {/* Patient Overview Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-semibold">
                            {patient.personalInfo?.firstName?.[0]}{patient.personalInfo?.lastName?.[0]}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="font-medium text-gray-900 capitalize">{patient.personalInfo?.gender || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date of Birth</p>
                                <p className="font-medium text-gray-900">
                                    {patient.personalInfo?.dateOfBirth ? formatDate(patient.personalInfo.dateOfBirth) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Blood Type</p>
                                <p className="font-medium text-gray-900">{patient.personalInfo?.bloodType || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Marital Status</p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {patient.personalInfo?.maritalStatus || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">National ID</p>
                                <p className="font-medium text-gray-900">{patient.personalInfo?.nationalId || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Registered</p>
                                <p className="font-medium text-gray-900">{formatDate(patient.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('medical')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'medical'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Heart className="w-4 h-4 inline mr-2" />
                            Medical Information
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'contacts'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Phone className="w-4 h-4 inline mr-2" />
                            Contact Information
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Contact Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-900">{patient.contact?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{patient.contact?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium text-gray-900">
                                            {patient.contact?.address?.street || 'N/A'}<br />
                                            {patient.contact?.address?.city}, {patient.contact?.address?.state} {patient.contact?.address?.zipCode}<br />
                                            {patient.contact?.address?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        {patient.emergencyContact && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    Emergency Contact
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium text-gray-900">{patient.emergencyContact?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Relationship</p>
                                        <p className="font-medium text-gray-900">{patient.emergencyContact?.relationship || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-900">{patient.emergencyContact?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'medical' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Allergies */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                Allergies
                            </h3>
                            {patient.medicalInfo?.allergies && patient.medicalInfo.allergies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.medicalInfo.allergies.map((allergy, index) => (
                                        <Badge key={index} variant="warning">
                                            {allergy}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No known allergies</p>
                            )}
                        </div>

                        {/* Chronic Conditions */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-600" />
                                Chronic Conditions
                            </h3>
                            {patient.medicalInfo?.chronicConditions && patient.medicalInfo.chronicConditions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.medicalInfo.chronicConditions.map((condition, index) => (
                                        <Badge key={index} variant="danger">
                                            {condition}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No chronic conditions</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'contacts' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">All Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4">Primary Contact</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-900">{patient.contact?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{patient.contact?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium text-gray-900">
                                            {patient.contact?.address?.street || 'N/A'}<br />
                                            {patient.contact?.address?.city}, {patient.contact?.address?.state} {patient.contact?.address?.zipCode}<br />
                                            {patient.contact?.address?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {patient.emergencyContact && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium text-gray-900">{patient.emergencyContact?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Relationship</p>
                                            <p className="font-medium text-gray-900">{patient.emergencyContact?.relationship || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium text-gray-900">{patient.emergencyContact?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Patient</h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to delete{' '}
                                    <span className="font-medium">
                                        {patient?.personalInfo?.firstName} {patient?.personalInfo?.lastName}
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={handleDeleteCancel}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Patient'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}