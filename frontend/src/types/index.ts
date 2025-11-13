/**
 * Central Type Definitions
 * Re-export all types for easy imports
 */

export * from './user.types';
export * from './patient.types';
export * from './appointment.types';
export * from './common.types';
export * from './prescription.types';
export * from './lab-order.types';
export * from './document.types';

// Consultation types
export interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: {
    value: number;
    unit: 'celsius' | 'fahrenheit';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  height?: {
    value: number;
    unit: 'cm' | 'inches';
  };
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: number;
}

export interface Diagnosis {
  code: string;
  name: string;
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  notes?: string;
}

export interface Procedure {
  code: string;
  name: string;
  description?: string;
  performedAt?: string;
  outcome?: string;
}

export interface Consultation {
  _id: string;
  id?: string;
  appointment: string;
  patient: string;
  doctor: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  vitalSigns?: VitalSigns;
  physicalExamination?: string;
  diagnoses?: Diagnosis[];
  procedures?: Procedure[];
  assessment?: string;
  plan?: string;
  notes?: string;
  status: 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Pharmacy types
export interface PharmacyOperatingHours {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  open: string;
  close: string;
  isClosed: boolean;
}

export interface PharmacyAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PharmacyContact {
  phone: string;
  email: string;
  website?: string;
}

export interface Pharmacy {
  _id: string;
  id?: string;
  name: string;
  licenseNumber: string;
  contact: PharmacyContact;
  address: PharmacyAddress;
  operatingHours: PharmacyOperatingHours[];
  servicesOffered: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
