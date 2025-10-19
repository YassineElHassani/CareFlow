# CareFlow Database - Visual Diagram

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Database Design](./DATABASE_DESIGN.md)** - Detailed schema
- **[Project Overview](./PROJECT_OVERVIEW.md)** - System architecture
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Code organization
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CAREFLOW EHR DATABASE                              │
│                          MongoDB Schema Design                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       USERS          │
│  (Staff + Patients)  │
├──────────────────────┤
│ _id                  │◄───────────┐
│ email (unique)       │            │
│ password (hashed)    │            │
│ role*                │            │ userId (optional)
│   - admin            │            │ [Links Patient to User]
│   - doctor           │            │
│   - nurse            │            │
│   - secretary        │            │
│   - patient          │            │
│ profile              │            │
│   - firstName        │            │
│   - lastName         │            │
│   - nationalId**     │            │
│   - title            │            │
│   - phone            │            │
│   - avatar           │            │
│ professional         │            │
│   - licenseNumber    │            │
│   - specialization   │            │
│   - department       │            │
│ loginAttempts        │            │
│ lockUntil            │            │
│ timestamps           │            │
└──────────────────────┘            │
         │                          │
         │ assignedDoctor           │
         │                          │
         ▼                          │
┌──────────────────────┐            │
│      PATIENTS        │            │
│   (Recipients of     │            │
│   Healthcare)        │            │
├──────────────────────┤            │
│ _id                  │            │
│ patientNumber*       │            │
│ userId (optional)    ├────────────┘
│ personalInfo         │
│   - firstName        │
│   - lastName         │
│   - nationalId***    │
│   - dateOfBirth      │
│   - gender           │
│   - bloodType        │
│ contact              │
│   - phone            │
│   - email***         │
│   - address          │
│ emergencyContact     │
│ insurance            │
│ medical              │
│   - allergies[]      │
│   - medications[]    │
│   - immunizations[]  │
│ consents             │
│ timestamps           │
└──────────────────────┘
         │                          
         │              
         │              
         │ patient      
         │              
         │              
         ▼              
┌──────────────────────┐
│    APPOINTMENTS      │
│   (Scheduling)       │
├──────────────────────┤
│ _id                  │
│ appointmentNumber*   │
│ patient              ├────┐
│ doctor               │    │
│ type                 │    │
│ scheduledDate        │    │
│ scheduledTime        │    │
│ startAt              │    │
│ endAt                │    │
│ status               │    │
│ chiefComplaint       │    │
│ notes                │    │
│ cancellation         │    │
│   - reason           │    │
│   - cancelledBy      │    │
│   - cancelledAt      │    │
│ followUpRequired     │    │
│ notifications[]      │    │
│ payment              │    │
│ timestamps           │    │
└──────────────────────┘    │
         │                  │
         │ appointment      │
         │                  │
         ▼                  │
┌──────────────────────┐    │
│   MEDICAL RECORDS    │    │
│  (Clinical Data)     │    │
├──────────────────────┤    │
│ _id                  │    │
│ recordNumber*        │    │
│ patient              ├────┘
│ appointment          │
│ doctor               ├────────────┐
│ recordType           │            │
│ visitDate            │            │
│ vitalSigns           │            │
│   - temperature      │            │
│   - bloodPressure    │            │
│   - heartRate        │            │
│   - weight/height    │            │
│ subjective           │            │
│   - chiefComplaint   │            │
│   - symptoms[]       │            │
│ objective            │            │
│   - examination      │            │
│   - findings[]       │            │
│ assessment           │            │
│   - diagnosis[]      │            │
│ plan                 │            │
│   - prescriptions[]  │            │
│   - procedures[]     │            │
│   - labTests[]       │            │
│   - referrals[]      │            │
│   - followUp         │            │
│ attachments[]        │            │
│ status               │            │
│ isLocked             │            │
│ signedBy             │            │
│ signedAt             │            │
│ timestamps           │            │
└──────────────────────┘            │
                                    │
         ┌──────────────────────────┘
         │
         ▼
┌──────────────────────┐
│    AUDIT LOGS        │
│  (Compliance &       │
│   Security)          │
├──────────────────────┤
│ _id                  │
│ user                 │
│ userEmail            │
│ userRole             │
│ action               │
│ resource             │
│ resourceId           │
│ changes              │
│   - before           │
│   - after            │
│ ipAddress            │
│ userAgent            │
│ timestamp            │
│ success              │
│ severity             │
└──────────────────────┘

* Auto-generated unique identifiers:
  - Patients: P-2025-00001
  - Appointments: APT-2025-00001
  - Medical Records: MR-2025-00001

** nationalId (User model):
  - Required for staff (admin, doctor, nurse, secretary)
  - Optional for patients (can be null)
  - Sparse index allows multiple nulls

*** Patient model changes:
  - nationalId: Optional (for emergency/newborn cases)
  - email: Optional (elderly/children may not have email)
  - email: NOT unique (can match User.email for linked accounts)


┌─────────────────────────────────────────────────────────────────────────────┐
│                          RELATIONSHIPS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

User (Patient role) ◄──┐ Patient (0..1:1)
                       └─ userId (optional link)

User (Doctor) ────────► Appointments (1:N)
                   │
                   └────► Medical Records (1:N)
                   │
                   └────► Patients (1:N) [assignedDoctor]

Patient ──────────────► Appointments (1:N)
        │
        └─────────────► Medical Records (1:N)
        │
        └─────────────► User (0..1:1) [optional userId]

Appointment ──────────► Medical Record (1:0..1)


┌─────────────────────────────────────────────────────────────────────────────┐
│                          KEY INDEXES                                        │
└─────────────────────────────────────────────────────────────────────────────┘

Users:
  - email (unique)
  - role
  - profile.nationalId (sparse, unique)
  - professional.specialization

Patients:
  - patientNumber (unique)
  - userId (sparse, unique) [one patient per user]
  - personalInfo.nationalId (sparse, unique)
  - contact.email (sparse, NOT unique)
  - contact.phone
  - assignedDoctor

Appointments:
  - appointmentNumber (unique)
  - patient + scheduledDate
  - doctor + scheduledDate
  - doctor + startAt + endAt (conflict detection)
  - status

Medical Records:
  - recordNumber (unique)
  - patient + visitDate
  - doctor
  - recordType
  - status

Audit Logs:
  - user + timestamp
  - resource + resourceId
  - timestamp (TTL: 2 years)
  - severity


┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW EXAMPLE                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1. REGISTRATION (Two Workflows)

   A. Staff Registration (Admin creates)
      └─► Create User (role: doctor/nurse/secretary)
      └─► No Patient record created

   B. Patient Self-Registration
      └─► Create User (role: patient, email/password)
      └─► Create Patient Record (linked via userId)
      └─► Send Email Verification
      └─► Log Action (Audit)

   C. Walk-in Patient (Secretary creates)
      └─► Create Patient Record only
      └─► No User account (patient can't log in)
      └─► Log Action (Audit)

2. SCHEDULING
   └─► Check Doctor Availability
   └─► Create Appointment
   └─► Send Notification
   └─► Log Action (Audit)

3. CHECK-IN
   └─► Update Appointment Status → "checked_in"
   └─► Log Action (Audit)

4. CONSULTATION
   └─► Update Appointment Status → "in_progress"
   └─► Create Medical Record
       ├─► Record Vital Signs
       ├─► Document SOAP Notes
       ├─► Add Diagnosis
       ├─► Create Prescriptions
       └─► Order Lab Tests
   └─► Log Action (Audit)

5. COMPLETION
   └─► Sign Medical Record
   └─► Update Appointment Status → "completed"
   └─► Schedule Follow-up (if needed)
   └─► Send Prescription Notification
   └─► Log Action (Audit)


┌─────────────────────────────────────────────────────────────────────────────┐
│                      SECURITY FEATURES                                      │
└─────────────────────────────────────────────────────────────────────────────┘

✓ Password Hashing (bcrypt, 10 rounds)
✓ Account Locking (5 failed attempts → 2 hour lock)
✓ Sensitive Data Masking (SSN in responses)
✓ Audit Trail (every action logged)
✓ Record Signing (immutable after signing)
✓ Role-Based Access Control
✓ TTL Indexes (auto-cleanup old logs)
✓ Consent Tracking
✓ Field-Level Encryption Ready


┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPLIANCE FEATURES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

HIPAA Compliant Features:
✓ Unique Patient Identifiers
✓ Audit Logs (who, what, when, where)
✓ Access Controls
✓ Data Encryption Ready
✓ Consent Management
✓ Data Retention (2-year TTL)
✓ Secure Authentication
✓ Immutable Records (after signing)


┌─────────────────────────────────────────────────────────────────────────────┐
│                      SCALABILITY                                            │
└─────────────────────────────────────────────────────────────────────────────┘

Ready for:
✓ Horizontal Scaling (Sharding by patientNumber)
✓ Read Replicas (for analytics)
✓ Caching Layer (Redis)
✓ Microservices Architecture
✓ Multi-Tenant (organization field can be added)
✓ Document Versioning
✓ Soft Deletes (isActive flags)
```

---

**Legend:**
- `├──` = Field in schema
- `│` = Relationship line
- `►` = One-to-Many relationship
- `*` = Auto-generated field
- `[]` = Array field
- `(ref: Model)` = Reference to another collection

**File:** `DATABASE_DIAGRAM.md`
**Created:** October 13, 2025
