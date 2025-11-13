/**
 * Patient Types
 * Based on CareFlow API v2.0.0
 */

export interface PatientPersonalInfo {
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
}

export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PatientContact {
  phone: string;
  email?: string;
  address: PatientAddress;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  dateDiscovered?: string;
}

export interface CurrentMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  indication?: string;
}

export interface ChronicCondition {
  condition: string;
  icd10Code?: string;
  diagnosedDate?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  status?: 'active' | 'inactive' | 'resolved';
  notes?: string;
}

export interface PatientMedicalInfo {
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: CurrentMedication[];
  pastSurgeries?: string[];
  familyHistory?: string[];
  immunizations?: string[];
}

export interface InsuranceInfo {
  provider?: string;
  policyNumber?: string;
  groupNumber?: string;
  expiryDate?: string;
}

export interface Patient {
  _id: string;
  id?: string;
  userId?: string;
  personalInfo: PatientPersonalInfo;
  contact: PatientContact;
  emergencyContact?: EmergencyContact;
  medicalInfo?: PatientMedicalInfo;
  insurance?: InsuranceInfo;
  consent?: {
    dataSharing: boolean;
    researchParticipation: boolean;
  };
  preferences?: {
    preferredLanguage?: string;
    communicationMethod?: 'email' | 'phone' | 'sms';
  };
  status: 'active' | 'inactive' | 'deceased';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  personalInfo: PatientPersonalInfo;
  contact: PatientContact;
  emergencyContact?: EmergencyContact;
  medicalInfo?: PatientMedicalInfo;
  insurance?: InsuranceInfo;
}

export interface UpdatePatientRequest {
  personalInfo?: Partial<PatientPersonalInfo>;
  contact?: Partial<PatientContact>;
  emergencyContact?: EmergencyContact;
  medicalInfo?: PatientMedicalInfo;
  insurance?: InsuranceInfo;
}

export interface AddAllergyRequest {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  dateDiscovered?: string;
}

export interface AddMedicationRequest {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  indication?: string;
}

export interface AddConditionRequest {
  condition: string;
  icd10Code?: string;
  diagnosedDate?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  status?: 'active' | 'inactive' | 'resolved';
  notes?: string;
}

export interface GetPatientsParams {
  page?: number;
  limit?: number;
  gender?: string;
  bloodType?: string;
  search?: string;
}

export interface PatientsListResponse {
  success: boolean;
  count: number;
  data: Patient[];
}

export interface PatientStatistics {
  total: number;
  active: number;
  inactive: number;
  byGender: {
    male: number;
    female: number;
    other: number;
  };
  byBloodType: Record<string, number>;
}
