/**
 * Create User Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button, Input, Label } from '@/components/atoms';
import { useUsers } from '@/hooks/api/useUsers';
import { toast, logger } from '@/utils';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types/user.types';

export default function CreateUser() {
    const navigate = useNavigate();
    const { createUser, isCreating } = useUsers();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'doctor' as UserRole,
        nationalId: '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            logger.debug('Creating user:', formData);

            // Build professional info based on role
            let professionalInfo: any = undefined;

            if (formData.role === 'doctor' || formData.role === 'nurse') {
                professionalInfo = {
                    specialization: formData.specialization ? formData.specialization.split(',').map(s => s.trim()) : [],
                    licenseNumber: formData.licenseNumber || undefined,
                    department: formData.department || undefined,
                    qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : [],
                    yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
                };
            } else if (formData.role === 'pharmacist') {
                professionalInfo = {
                    pharmacyLicense: formData.pharmacyLicense || undefined,
                };
            } else if (formData.role === 'lab-technician') {
                professionalInfo = {
                    labLicense: formData.labLicense || undefined,
                    laboratory: formData.laboratory || undefined,
                    labSpecialization: formData.labSpecialization || undefined,
                };
            }

            // Transform to API format
            const createData = {
                email: formData.email,
                password: formData.password,
                role: formData.role,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                nationalId: formData.nationalId || '',
                professionalInfo,
            };

            await createUser(createData);
            toast.success('User created successfully!');
            navigate(ROUTES.USERS);
        } catch (error) {
            logger.error('Error creating user:', error);
            toast.error('Failed to create user');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Clear professional info fields when role changes
        if (name === 'role') {
            setFormData({
                ...formData,
                role: value as UserRole,
                // Reset all professional fields
                specialization: '',
                licenseNumber: '',
                department: '',
                qualifications: '',
                yearsOfExperience: '',
                pharmacyLicense: '',
                labLicense: '',
                laboratory: '',
                labSpecialization: '',
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Helper function to determine which fields to show based on role
    const showDoctorNurseFields = formData.role === 'doctor' || formData.role === 'nurse';
    const showPharmacistFields = formData.role === 'pharmacist';
    const showLabFields = formData.role === 'lab-technician';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.USERS)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
                    <p className="text-gray-600 mt-1">Add a new user to the system</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name *</Label>
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
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                        <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
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

                    {/* Role */}
                    <div>
                        <Label htmlFor="role">Role *</Label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                            <option value="nurse">Nurse</option>
                            <option value="pharmacist">Pharmacist</option>
                            <option value="lab-technician">Lab Technician</option>
                            <option value="receptionist">Receptionist</option>
                        </select>
                    </div>

                    {/* National ID */}
                    <div>
                        <Label htmlFor="nationalId">National ID</Label>
                        <Input
                            id="nationalId"
                            name="nationalId"
                            value={formData.nationalId}
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
                        <Button type="submit" variant="primary" disabled={isCreating}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            {isCreating ? 'Creating...' : 'Create User'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(ROUTES.USERS)}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
