/**
 * Validation schemas for forms using Yup
 */

import * as yup from 'yup';

// Common password validation
const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character'
  );

const emailValidation = yup
  .string()
  .email('Must be a valid email')
  .required('Email is required');

// Login Schema
export const loginSchema = yup.object({
  email: emailValidation,
  password: yup.string().required('Password is required'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Register Schema - Dynamic based on role
export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: emailValidation,
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[+]?[0-9\s-()]{10,}$/,
      'Phone number must be at least 10 digits'
    ),
  nationalId: yup
    .string()
    .required('National ID is required')
    .min(3, 'National ID must be at least 3 characters'),
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(
      [
        'PATIENT',
        'DOCTOR',
        'NURSE',
        'SECRETARY',
        'PHARMACIST',
        'LAB_TECHNICIAN',
      ],
      'Invalid role'
    ),
  // Professional Info fields (conditional based on role)
  specialization: yup.string().when('role', {
    is: 'DOCTOR',
    then: (schema) => schema.required('Specialization is required for doctors'),
    otherwise: (schema) => schema.notRequired(),
  }),
  licenseNumber: yup.string().when('role', {
    is: 'DOCTOR',
    then: (schema) => schema.required('License number is required for doctors'),
    otherwise: (schema) => schema.notRequired(),
  }),
  department: yup.string().when('role', {
    is: 'DOCTOR',
    then: (schema) => schema.required('Department is required for doctors'),
    otherwise: (schema) => schema.notRequired(),
  }),
  qualifications: yup.string().when('role', {
    is: (val: string) =>
      ['DOCTOR', 'PHARMACIST', 'LAB_TECHNICIAN'].includes(val),
    then: (schema) => schema.required('Qualifications are required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  yearsOfExperience: yup.number().when('role', {
    is: (val: string) =>
      ['DOCTOR', 'PHARMACIST', 'LAB_TECHNICIAN'].includes(val),
    then: (schema) =>
      schema
        .required('Years of experience is required')
        .min(0, 'Must be 0 or greater'),
    otherwise: (schema) => schema.notRequired(),
  }),
  pharmacyLicense: yup.string().when('role', {
    is: 'PHARMACIST',
    then: (schema) =>
      schema.required('Pharmacy license is required for pharmacists'),
    otherwise: (schema) => schema.notRequired(),
  }),
  labLicense: yup.string().when('role', {
    is: 'LAB_TECHNICIAN',
    then: (schema) =>
      schema.required('Lab license is required for lab technicians'),
    otherwise: (schema) => schema.notRequired(),
  }),
  laboratory: yup.string().when('role', {
    is: 'LAB_TECHNICIAN',
    then: (schema) =>
      schema.required('Laboratory name is required for lab technicians'),
    otherwise: (schema) => schema.notRequired(),
  }),
  labSpecialization: yup.string().when('role', {
    is: 'LAB_TECHNICIAN',
    then: (schema) =>
      schema.required('Lab specialization is required for lab technicians'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  confirmPassword: string;
  role: string;
  // Professional fields (optional)
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  qualifications?: string;
  yearsOfExperience?: number;
  pharmacyLicense?: string;
  labLicense?: string;
  laboratory?: string;
  labSpecialization?: string;
};

// Forgot Password Schema
export const forgotPasswordSchema = yup.object({
  email: emailValidation,
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = yup.object({
  token: yup.string().required('Reset token is required'),
  newPassword: passwordValidation,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;

// Patient Profile Schema
export const patientProfileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: emailValidation,
  phone: yup
    .string()
    .matches(/^[0-9\-\+\s\(\)]+$/, 'Please enter a valid phone number'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']),
  bloodType: yup
    .string()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
  address: yup.string(),
  city: yup.string(),
  country: yup.string(),
});

export type PatientProfileFormData = yup.InferType<typeof patientProfileSchema>;

// Appointment Schema
export const appointmentSchema = yup.object({
  doctor: yup.string().required('Please select a doctor'),
  reason: yup.string().required('Reason for appointment is required').min(5),
  scheduledDate: yup
    .string()
    .required('Appointment date is required')
    .test('dateInFuture', 'Appointment must be in the future', (value) => {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  scheduledTime: yup.string().required('Appointment time is required'),
  notes: yup.string(),
});

export type AppointmentFormData = yup.InferType<typeof appointmentSchema>;

// Prescription Schema
export const prescriptionSchema = yup.object({
  patient: yup.string().required('Patient is required'),
  medication: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup
    .string()
    .required('Frequency is required')
    .oneOf([
      'ONCE_DAILY',
      'TWICE_DAILY',
      'THREE_TIMES_DAILY',
      'FOUR_TIMES_DAILY',
      'AS_NEEDED',
    ]),
  duration: yup
    .number()
    .required('Duration is required')
    .positive('Duration must be positive'),
  durationUnit: yup.string().oneOf(['DAYS', 'WEEKS', 'MONTHS']),
  instructions: yup.string(),
});

export type PrescriptionFormData = yup.InferType<typeof prescriptionSchema>;

// Lab Order Schema
export const labOrderSchema = yup.object({
  patient: yup.string().required('Patient is required'),
  tests: yup
    .array()
    .of(
      yup.object({
        testName: yup.string().required('Test name is required'),
        instructions: yup.string(),
      })
    )
    .min(1, 'At least one test is required'),
  priority: yup.string().oneOf(['ROUTINE', 'URGENT']),
  notes: yup.string(),
});

export type LabOrderFormData = yup.InferType<typeof labOrderSchema>;

// Change Password Schema
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: passwordValidation,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
