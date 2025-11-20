/**
 * Edit Profile Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, Input, Label } from '@/components/atoms';
import { LoadingSpinner } from '@/components/common';
import { authService } from '@/services/auth';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/types/user.types';

export default function EditProfile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        // Professional Info - Doctor/Nurse
        specialization: '',
        licenseNumber: '',
        department: '',
        qualifications: '',
        yearsOfExperience: '',
        // Pharmacist
        pharmacyLicense: '',
        // Lab Technician
        labLicense: '',
        laboratory: '',
        labSpecialization: '',
    });

    // Fetch full user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await authService.getProfile();
                setUser(profileData);

                // Populate form with existing data
                setFormData({
                    firstName: profileData.profile?.firstName || '',
                    lastName: profileData.profile?.lastName || '',
                    email: profileData.email || '',
                    phone: profileData.profile?.phone || '',
                    // Professional Info - Doctor/Nurse
                    specialization: profileData.professionalInfo?.specialization?.join(', ') || '',
                    licenseNumber: profileData.professionalInfo?.licenseNumber || '',
                    department: profileData.professionalInfo?.department || '',
                    qualifications: profileData.professionalInfo?.qualifications?.join(', ') || '',
                    yearsOfExperience: profileData.professionalInfo?.yearsOfExperience?.toString() || '',
                    // Pharmacist
                    pharmacyLicense: profileData.professionalInfo?.pharmacyLicense || '',
                    // Lab Technician
                    labLicense: profileData.professionalInfo?.labLicense || '',
                    laboratory: profileData.professionalInfo?.laboratory || '',
                    labSpecialization: profileData.professionalInfo?.labSpecialization || '',
                });
            } catch (error) {
                logger.error('Failed to fetch profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (!user) return;

            // Build professional info based on role
            let professionalInfo: any = undefined;

            if (user.role === 'doctor' || user.role === 'nurse') {
                professionalInfo = {
                    specialization: formData.specialization ? formData.specialization.split(',').map(s => s.trim()) : [],
                    licenseNumber: formData.licenseNumber || undefined,
                    department: formData.department || undefined,
                    qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : [],
                    yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
                };
            } else if (user.role === 'pharmacist') {
                professionalInfo = {
                    pharmacyLicense: formData.pharmacyLicense || undefined,
                };
            } else if (user.role === 'lab-technician') {
                professionalInfo = {
                    labLicense: formData.labLicense || undefined,
                    laboratory: formData.laboratory || undefined,
                    labSpecialization: formData.labSpecialization || undefined,
                };
            }

            // Update profile with professional info
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                professionalInfo,
            };

            await authService.updateProfile(updateData);
            toast.success('Profile updated successfully!');
            navigate(ROUTES.PROFILE);
        } catch (error) {
            logger.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Helper function to determine which fields to show based on role
    const showDoctorNurseFields = user?.role === 'doctor' || user?.role === 'nurse';
    const showPharmacistFields = user?.role === 'pharmacist';
    const showLabFields = user?.role === 'lab-technician';

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading profile..." />;
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">User not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PROFILE)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-600 mt-1">Update your profile information</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="bg-gray-50"
                        />
                        <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Professional Info - Doctor/Nurse Fields */}
                    {showDoctorNurseFields && (
                        <>
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Professional Information
                                </h3>
                            </div>

                            <div>
                                <Label htmlFor="licenseNumber">License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="specialization">Specialization(s)</Label>
                                <Input
                                    id="specialization"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g., Cardiology, Pediatrics (comma-separated)"
                                />
                                <p className="text-sm text-gray-500 mt-1">Separate multiple specializations with commas</p>
                            </div>

                            <div>
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="e.g., Emergency, Cardiology"
                                />
                            </div>

                            <div>
                                <Label htmlFor="qualifications">Qualifications</Label>
                                <Input
                                    id="qualifications"
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    placeholder="e.g., MBBS, MD (comma-separated)"
                                />
                                <p className="text-sm text-gray-500 mt-1">Separate multiple qualifications with commas</p>
                            </div>

                            <div>
                                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                                <Input
                                    id="yearsOfExperience"
                                    name="yearsOfExperience"
                                    type="number"
                                    min="0"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    placeholder="e.g., 5"
                                />
                            </div>
                        </>
                    )}

                    {/* Professional Info - Pharmacist Fields */}
                    {showPharmacistFields && (
                        <>
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Professional Information
                                </h3>
                            </div>

                            <div>
                                <Label htmlFor="pharmacyLicense">Pharmacy License Number *</Label>
                                <Input
                                    id="pharmacyLicense"
                                    name="pharmacyLicense"
                                    value={formData.pharmacyLicense}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Professional Info - Lab Technician Fields */}
                    {showLabFields && (
                        <>
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Professional Information
                                </h3>
                            </div>

                            <div>
                                <Label htmlFor="labLicense">Lab License Number *</Label>
                                <Input
                                    id="labLicense"
                                    name="labLicense"
                                    value={formData.labLicense}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="laboratory">Laboratory</Label>
                                <Input
                                    id="laboratory"
                                    name="laboratory"
                                    value={formData.laboratory}
                                    onChange={handleChange}
                                    placeholder="e.g., Main Lab, Pathology Lab"
                                />
                            </div>

                            <div>
                                <Label htmlFor="labSpecialization">Lab Specialization</Label>
                                <Input
                                    id="labSpecialization"
                                    name="labSpecialization"
                                    value={formData.labSpecialization}
                                    onChange={handleChange}
                                    placeholder="e.g., Hematology, Microbiology"
                                />
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" variant="primary" disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(ROUTES.PROFILE)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
