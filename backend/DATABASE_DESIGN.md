# CareFlow EHR - Database Design

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Database Diagram](./DATABASE_DIAGRAM.md)** - Visual relationships
- **[Project Overview](./PROJECT_OVERVIEW.md)** - System architecture
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Code organization
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

## Database Structure Overview

### Philosophy:
- **Normalized but practical** - Balance between data integrity and performance
- **FHIR-inspired** - Follow healthcare data standards where applicable
- **Scalable** - Support for multi-tenant (future) and large datasets
- **Audit-friendly** - Track all changes with timestamps

---

## Core Entities

### 1. **Users** (Authentication & Staff)
Healthcare professionals and system users

### 2. **Patients** (Healthcare Recipients)
Patient demographic and medical information

### 3. **Appointments** (Scheduling)
Patient visits and consultations

### 4. **Medical Records** (Clinical Data)
Diagnoses, treatments, prescriptions

### 5. **Audit Logs** (Compliance)
Track all sensitive data access

---

## Detailed Schema Design

### Users Collection

**Purpose:** Healthcare staff and system users (doctors, nurses, admins, etc.)

```javascript
{
  _id: ObjectId,
  
  // Authentication
  email: String (unique, lowercase, indexed),
  password: String (bcrypt hashed, never returned),
  refreshToken: String (JWT refresh token, never returned),
  
  // Authorization
  role: Enum ['admin', 'doctor', 'nurse', 'secretary', 'lab_tech'],
  permissions: [String], // ['read:patients', 'write:prescriptions']
  isActive: Boolean,
  isEmailVerified: Boolean,
  
  // Profile
  profile: {
    firstName: String (required),
    lastName: String (required),
    title: String, // 'Dr.', 'Nurse', etc.
    gender: Enum ['male', 'female', 'other'],
    phone: String,
    avatar: String (URL),
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  
  // Professional Info (for doctors/nurses)
  professional: {
    licenseNumber: String,
    specialization: [String], // ['Cardiology', 'Pediatrics']
    department: String,
    qualifications: [String],
    yearsOfExperience: Number
  },
  
  // System
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `role`
- `isActive`
- `professional.specialization` (for doctors)

---

### Patients Collection

**Purpose:** Patient demographic and medical information

```javascript
{
  _id: ObjectId,
  
  // Optional: Link to User account (if patient has login)
  userId: ObjectId (ref: User, optional),
  
  // Demographics (Required)
  personalInfo: {
    firstName: String (required),
    lastName: String (required),
    dateOfBirth: Date (required),
    gender: Enum ['male', 'female', 'other'] (required),
    bloodType: Enum ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    maritalStatus: Enum ['single', 'married', 'divorced', 'widowed'],
    ssn: String (encrypted, optional),
    nationalId: String
  },
  
  // Contact Information
  contact: {
    phone: String (required),
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String (required),
    email: String
  },
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validFrom: Date,
    validUntil: Date,
    isPrimary: Boolean
  },
  
  // Medical Information
  medical: {
    allergies: [{
      allergen: String,
      reaction: String,
      severity: Enum ['mild', 'moderate', 'severe'],
      recordedDate: Date
    }],
    
    chronicConditions: [{
      condition: String,
      diagnosedDate: Date,
      status: Enum ['active', 'resolved', 'managed']
    }],
    
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date,
      prescribedBy: ObjectId (ref: User)
    }],
    
    immunizations: [{
      vaccine: String,
      date: Date,
      administeredBy: ObjectId (ref: User),
      nextDueDate: Date
    }],
    
    familyHistory: [{
      relation: String, // 'father', 'mother', etc.
      condition: String,
      notes: String
    }]
  },
  
  // Preferences
  preferences: {
    preferredLanguage: String,
    preferredDoctor: ObjectId (ref: User),
    communicationMethod: Enum ['email', 'sms', 'phone', 'mail']
  },
  
  // Consent & Legal
  consents: {
    dataSharing: { agreed: Boolean, date: Date },
    treatmentConsent: { agreed: Boolean, date: Date },
    researchParticipation: { agreed: Boolean, date: Date }
  },
  
  // System
  isActive: Boolean,
  patientNumber: String (unique, auto-generated), // e.g., 'P-2025-00001'
  assignedDoctor: ObjectId (ref: User),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `patientNumber` (unique)
- `userId` (sparse)
- `contact.email`
- `contact.phone`
- `assignedDoctor`
- `isActive`

---

### Appointments Collection

**Purpose:** Schedule and track patient visits

```javascript
{
  _id: ObjectId,
  
  // References
  patient: ObjectId (ref: Patient, required),
  doctor: ObjectId (ref: User, required),
  
  // Appointment Details
  appointmentNumber: String (unique), // 'APT-2025-00001'
  type: Enum ['consultation', 'follow_up', 'emergency', 'routine_checkup', 'lab_test', 'imaging'],
  
  // Scheduling
  scheduledDate: Date (required),
  scheduledTime: String (required), // '14:30'
  startAt: Date (required, indexed),
  endAt: Date (required),
  duration: Number, // minutes
  
  // Status Management
  status: Enum ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'],
  
  // Cancellation Info
  cancellation: {
    reason: String,
    cancelledBy: ObjectId (ref: User),
    cancelledAt: Date,
    refundStatus: Enum ['pending', 'processed', 'not_applicable']
  },
  
  // Clinical Info
  chiefComplaint: String, // Why patient is coming
  notes: String, // Doctor's notes
  diagnosis: String,
  prescription: String,
  
  // Follow-up
  followUpRequired: Boolean,
  followUpDate: Date,
  nextAppointment: ObjectId (ref: Appointment),
  
  // Notifications
  notifications: [{
    type: Enum ['email', 'sms'],
    sentAt: Date,
    status: Enum ['sent', 'failed', 'pending']
  }],
  
  // Payment (if applicable)
  payment: {
    amount: Number,
    currency: String,
    status: Enum ['pending', 'paid', 'refunded'],
    method: Enum ['cash', 'card', 'insurance'],
    transactionId: String
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (ref: User)
}
```

**Indexes:**
- `patient` + `scheduledDate`
- `doctor` + `scheduledDate`
- `status`
- `startAt` + `endAt` (for conflict detection)
- `appointmentNumber` (unique)

---

### Medical Records Collection

**Purpose:** Store clinical encounters and medical history

```javascript
{
  _id: ObjectId,
  
  // References
  patient: ObjectId (ref: Patient, required),
  appointment: ObjectId (ref: Appointment),
  doctor: ObjectId (ref: User, required),
  
  // Record Identification
  recordNumber: String (unique), // 'MR-2025-00001'
  recordType: Enum ['consultation', 'lab_result', 'imaging', 'prescription', 'procedure', 'discharge'],
  
  // Visit Information
  visitDate: Date (required),
  department: String,
  
  // Clinical Data
  vital_signs: {
    temperature: { value: Number, unit: String }, // Celsius
    bloodPressure: { systolic: Number, diastolic: Number },
    heartRate: Number, // bpm
    respiratoryRate: Number, // breaths/min
    oxygenSaturation: Number, // %
    weight: { value: Number, unit: String }, // kg
    height: { value: Number, unit: String }, // cm
    bmi: Number,
    recordedAt: Date
  },
  
  // Subjective (Patient's complaint)
  subjective: {
    chiefComplaint: String,
    historyOfPresentIllness: String,
    symptoms: [String],
    duration: String
  },
  
  // Objective (Doctor's findings)
  objective: {
    physicalExamination: String,
    findings: [String]
  },
  
  // Assessment (Diagnosis)
  assessment: {
    diagnosis: [{
      code: String, // ICD-10 code
      description: String,
      type: Enum ['primary', 'secondary'],
      status: Enum ['confirmed', 'suspected', 'ruled_out']
    }]
  },
  
  // Plan (Treatment)
  plan: {
    prescriptions: [{
      medication: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
      refills: Number
    }],
    
    procedures: [{
      name: String,
      description: String,
      scheduledDate: Date
    }],
    
    referrals: [{
      specialty: String,
      doctor: ObjectId (ref: User),
      reason: String,
      urgency: Enum ['routine', 'urgent', 'emergency']
    }],
    
    labTests: [{
      testName: String,
      ordered: Boolean,
      completedDate: Date,
      results: String,
      attachments: [String] // URLs
    }],
    
    followUp: {
      required: Boolean,
      date: Date,
      instructions: String
    }
  },
  
  // Attachments
  attachments: [{
    name: String,
    type: String, // 'image', 'pdf', 'lab_report'
    url: String,
    uploadedAt: Date,
    uploadedBy: ObjectId (ref: User)
  }],
  
  // Notes
  clinicalNotes: String,
  privateNotes: String, // Only visible to doctor
  
  // Status
  status: Enum ['draft', 'final', 'amended'],
  isLocked: Boolean,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  signedBy: ObjectId (ref: User),
  signedAt: Date
}
```

**Indexes:**
- `patient` + `visitDate`
- `doctor`
- `appointment`
- `recordNumber` (unique)
- `recordType`
- `status`

---

### Audit Logs Collection

**Purpose:** Track all access and changes for compliance (HIPAA, GDPR)

```javascript
{
  _id: ObjectId,
  
  // Who
  user: ObjectId (ref: User, required),
  userEmail: String, // Snapshot
  userRole: String,
  
  // What
  action: Enum ['create', 'read', 'update', 'delete', 'login', 'logout', 'export'],
  resource: Enum ['user', 'patient', 'appointment', 'medical_record'],
  resourceId: ObjectId,
  
  // Details
  changes: {
    before: Object, // Old values
    after: Object   // New values
  },
  
  // Where
  ipAddress: String,
  userAgent: String,
  
  // When
  timestamp: Date,
  
  // Why (optional)
  reason: String,
  
  // Result
  success: Boolean,
  errorMessage: String
}
```

**Indexes:**
- `user` + `timestamp`
- `resource` + `resourceId`
- `action`
- `timestamp` (TTL - auto-delete after X days)

---

## Relationships

```
User (1) ─── (N) Appointments (Doctor)
Patient (1) ─── (N) Appointments
Patient (1) ─── (N) Medical Records
User (1) ─── (N) Medical Records (Doctor)
Appointment (1) ─── (0..1) Medical Record
Patient (0..1) ─── (1) User (Optional account)
```

---

## Scalability Considerations

### Indexes Strategy:
1. **Compound indexes** for common queries (patient + date)
2. **Sparse indexes** for optional fields (userId in patients)
3. **TTL indexes** for audit logs (auto-cleanup)

### Sharding Strategy (Future):
- **Shard key**: `patientNumber` or geographic region
- **Replica sets**: Read replicas for analytics

### Performance:
- **Denormalization** where needed (doctor name in appointments)
- **Caching**: Redis for frequent queries
- **Pagination**: Always use cursor-based pagination

---

## Security & Compliance

### Data Protection:
1. **Sensitive fields encrypted** at rest (SSN, medical records)
2. **Field-level encryption** for PHI (Protected Health Information)
3. **Access control** via role-based permissions
4. **Audit all access** to patient data

### HIPAA Compliance:
- ✅ Unique patient identifiers
- ✅ Audit logs (who accessed what, when)
- ✅ Encryption at rest and in transit
- ✅ Access controls
- ✅ Data retention policies

---

## Sample Queries

### Find available time slots:
```javascript
Appointment.find({
  doctor: doctorId,
  scheduledDate: targetDate,
  status: { $in: ['scheduled', 'confirmed'] }
})
```

### Patient medical history:
```javascript
MedicalRecord.find({ patient: patientId })
  .sort({ visitDate: -1 })
  .populate('doctor', 'profile.firstName profile.lastName')
```

### Doctor's schedule:
```javascript
Appointment.find({
  doctor: doctorId,
  scheduledDate: { $gte: startDate, $lte: endDate },
  status: { $ne: 'cancelled' }
}).populate('patient', 'personalInfo.firstName personalInfo.lastName')
```

---

## Best Practices

1. **Always use timestamps** (createdAt, updatedAt)
2. **Soft delete** (isActive flag) instead of hard delete
3. **Validate at schema level** (required, enums, min/max)
4. **Use virtuals** for computed fields (fullName, age)
5. **Pre/post hooks** for business logic (send email after appointment)
6. **Lean queries** when you don't need Mongoose documents
7. **Projection** - only select fields you need
8. **Populate wisely** - avoid deep population

---

**Next Steps:**
1. Implement these models in Mongoose
2. Add validation and business logic
3. Create seed data for testing
4. Write model tests
5. Add indexes for performance

**Last Updated:** October 13, 2025
