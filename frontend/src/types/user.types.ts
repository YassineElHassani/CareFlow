/**
 * User Types
 * Based on CareFlow API v2.0.0
 */

export type UserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'patient'
  | 'receptionist'
  | 'pharmacist'
  | 'lab-technician';

export type UserStatus = 'active' | 'suspended' | 'inactive';

export interface ProfessionalInfo {
  // Doctor/Nurse fields
  specialization?: string[];
  licenseNumber?: string;
  department?: string;
  qualifications?: string[];
  yearsOfExperience?: number;

  // Pharmacist fields
  pharmacyLicense?: string;

  // Lab Technician fields
  labLicense?: string;
  laboratory?: string;
  labSpecialization?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface User {
  _id: string;
  id?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  professionalInfo?: ProfessionalInfo;
  nationalId?: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  suspendedAt?: string;
  suspensionReason?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;
  professionalInfo?: ProfessionalInfo;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  profile: Partial<UserProfile>;
}

export interface SuspendUserRequest {
  reason: string;
}

// Query params types
export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export interface UsersListResponse {
  success: boolean;
  count: number;
  data: User[];
}

// Aliases for consistency
export type CreateUserDto = RegisterRequest;
export type UpdateUserDto = UpdateProfileRequest;
export type UserListParams = GetUsersParams;
export type UserListResponse = UsersListResponse;
