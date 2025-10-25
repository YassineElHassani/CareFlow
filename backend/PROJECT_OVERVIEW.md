# CareFlow EHR - Project Overview

**Complete Electronic Health Record (EHR) System Backend**

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Complete navigation
- **[README](./README.md)** - Quick overview
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Code organization
- **[Database Design](./DATABASE_DESIGN.md)** - Schema details
- **[Database Diagram](./DATABASE_DIAGRAM.md)** - Visual relationships
- **[Setup Guide](./SETUP_GUIDE.md)** - Get started

---

## Project Summary

CareFlow is a modern, scalable backend API for electronic health records management, designed for clinics and medical practices. Built with Node.js, Express, MongoDB, Redis, and MinIO, it provides comprehensive user management, patient records, appointment scheduling with automatic conflict detection, clinical consultations, digital prescriptions, pharmacy integration, laboratory test management, and email notifications.

---

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              Frontend (Future)              │
│         React / Vue / Angular / Mobile      │
└────────────────┬────────────────────────────┘
                 │ REST API (JSON)
                 ▼
┌─────────────────────────────────────────────┐
│           Express.js Backend                │
│  ┌────────────────────────────────────┐     │
│  │ Routes → Controllers → Services    │     │
│  │      → Models → Database           │     │
│  └────────────────────────────────────┘     │
│                                             │
│  Middlewares: Auth, Validation, Error       │
│  Utils: JWT, Date Helpers                   │
└───────┬──────────────────┬──────────────────┘
        │                  │
        ▼                  ▼
┌───────────────┐  ┌──────────────┐
│   MongoDB     │  │    Redis     │
│  (Mongoose)   │  │   (BullMQ)   │
│               │  │              │
│ • Users       │  │ • Job Queue  │
│ • Patients    │  │ • Cache      │
│ • Appointments│  │ • Sessions   │
└───────────────┘  └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Email Worker │
                   │ (Nodemailer) │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ MailDev/SMTP │
                   └──────────────┘
```

---

## Core Features

### 1. User Management
- **Registration & Authentication** (JWT tokens)
- **Role-Based Access Control**
  - Admin
  - Doctor
  - Nurse
  - Patient
  - Secretary
  - **Pharmacist**
  - **Lab Technician**
- **Profile Management**
- **Account Suspension/Activation**
- **Password Reset via Email**
- **Professional credentials tracking**
- **Pharmacy and laboratory license management**

### 2. Patient Management
- **Complete Patient Records**
  - Personal information (nested structure)
  - Medical history (allergies, medications, chronic conditions)
  - Emergency contacts
  - Insurance details
  - Contact information
- **Auto-generated patient numbers** (P-2025-00001)
- **Search & Filtering**
- **Consent Management**
- **Patient statistics dashboard**

**Tested:** Create, List, Get by ID

### 3. Appointment Management
- **Smart Scheduling**
  - **Real-time conflict detection** (HTTP 409)
  - Auto-generated appointment numbers (APT-2025-00001)
  - 30-minute time slots (9 AM - 5 PM)
- **Appointment Lifecycle**
  - Multiple statuses: scheduled, in-progress, completed, cancelled, no-show
  - Modification and cancellation
  - Doctor assignment
- **Availability Management**
  - Real-time availability checking
  - Doctor schedule view with booked slots
  - Patient appointment history
- **Automated Notifications**
  - Email reminders 24 hours before appointment
  - Cancellation notifications

**Tested:** Create, List, Get by ID, Doctor Availability, Conflict Detection

### 4. Consultation Management
- **Clinical Documentation**
  - SOAP note format (Subjective, Objective, Assessment, Plan)
  - Vital signs recording (BP, temp, heart rate, respiratory rate, O2 saturation, weight, height)
  - Chief complaint and present illness
  - Physical examination findings
- **Diagnosis & Treatment**
  - ICD-10 diagnosis codes
  - Treatment plan documentation
  - Follow-up scheduling
- **Linked to Appointments**
  - One consultation per appointment
  - Auto-populated doctor and patient
- **Search & Filtering**
  - By patient, doctor, date range, diagnosis

### 5. Prescription Management
- **Digital Prescriptions**
  - Medication details (name, generic name, dosage, quantity)
  - 12 medication routes (oral, IV, IM, SC, topical, inhalation, rectal, vaginal, sublingual, transdermal, ophthalmic, otic)
  - Frequency, duration, and special instructions
  - Refill tracking
- **Prescription Workflow**
  - Draft → Signed → Sent to Pharmacy → Partially Dispensed → Dispensed
  - Digital signature with SHA256 hashing
  - Doctor authorization required
- **Auto-numbering**: RX-2025-00001
- **Prescription Features**
  - Automatic 30-day expiry
  - Renewal capability (creates new prescription)
  - Link to consultations
  - Cancellation with reason tracking
- **Views**
  - Patient prescription history
  - Doctor prescribed medications
  - Pharmacy pending prescriptions

### 6. Pharmacy Management
- **Pharmacy Directory**
  - Auto-generated pharmacy numbers (PH-2025-00001)
  - Contact information and address with geolocation
  - License number tracking
  - Operating hours management
  - 24-hour pharmacy indicator
- **Services Offered**
  - Prescription dispensing
  - Home delivery
  - Pharmacist consultation
  - Vaccination services
  - Blood pressure monitoring
  - Diabetes care
  - Medication compounding
- **Inventory Management**
  - Medication stock tracking
  - Expiry date monitoring
  - Last restocked timestamp
- **Pharmacist Operations**
  - View assigned prescriptions
  - Dispense medications (individual tracking)
  - Mark medications as unavailable
  - Update inventory levels
- **Public Features**
  - Search pharmacies by city
  - Filter by 24-hour availability
  - Check operating hours in real-time

### 7. Laboratory Integration
- **Lab Order Management**
  - Auto-generated lab order numbers (LAB-2025-00001)
  - Link to consultations
  - Multiple tests per order
- **Test Categories**
  - Hematology (CBC, differential, etc.)
  - Biochemistry (glucose, lipids, etc.)
  - Microbiology (cultures, sensitivity)
  - Immunology (antibodies, antigens)
  - Serology (viral markers)
  - Urinalysis
  - Pathology (biopsies, cytology)
  - Radiology (X-ray, CT, MRI)
  - Genetics (DNA testing)
- **Priority Levels**
  - Routine
  - Urgent
  - STAT (immediate)
- **Specimen Tracking**
  - Collection date/time and collector
  - Received by lab timestamp
- **Results Management**
  - Individual test result uploads
  - Reference ranges
  - Flags: normal, low, high, **critical**
  - Result interpretation notes
  - Performed by and reviewed by tracking
- **Lab Report**
  - Overall summary
  - General comments
  - Pathologist digital signature
  - Report completion date
- **Status Workflow**
  - Ordered → Specimen Collected → In Progress → Partially Completed → Completed
  - Cancellation with reason
- **Lab Technician Dashboard**
  - Pending tests count
  - In-progress tests count
  - Urgent/STAT priority alerts
  - Filter by laboratory and category
- **Progress Tracking**
  - Completion percentage
  - Critical results indicator
  - Abnormal results count

### 8. Document Management
- **MinIO S3-Compatible Storage**
  - Self-hosted object storage
  - Three dedicated buckets:
    - `careflow-documents` - General medical documents
    - `careflow-lab-reports` - Laboratory PDF reports
    - `careflow-prescriptions` - Prescription documents
- **File Operations**
  - Secure file upload
  - Pre-signed URL generation
  - File metadata retrieval
  - Document deletion
- **Integration**
  - Link documents to lab orders
  - Store prescription PDFs
  - Medical record attachments
  - Practitioner availability checking (30-min slots, 9 AM - 5 PM)
  - Multiple status support
- **Email Reminders** (24h before)
- **Email Cancellation Notices**
- **Appointment Lifecycle**
  - Scheduled → In Progress → Completed
  - Cancellation support
  - No-show tracking

**Tested:** Create, Cancel, Conflict Detection working

### 4. Doctor Management
- **Doctor Listing** with filters
- **Search by name/specialization**
- **Real-time availability calendar**
- **Professional profile management**

**Tested:** List (2 doctors), Search, Availability (16 slots)

### 5. Notification System
- **Background Job Processing** (Redis + BullMQ)
- **Email Notifications**
  - Welcome emails
  - Password reset
  - Appointment reminders
  - Cancellation notices

**Tested:** All 6 emails sent successfully

---

## Project Structure

```
backend/
├── 📁 src/
│   ├── 📁 config/          Database, Redis, Logger
│   ├── 📁 controllers/     HTTP request handlers
│   ├── 📁 models/          MongoDB schemas
│   ├── 📁 services/        Business logic
│   ├── 📁 middlewares/     Auth, Validation, Errors
│   ├── 📁 routes/          API endpoints
│   ├── 📁 queues/          Background jobs
│   ├── 📁 utils/           Helper functions
│   └── 📁 tests/           Unit & Integration tests
│
├── 📁 scripts/             Setup & utility scripts
├── 📄 .env.example         Environment template
├── 📄 docker-compose.yml   Services definition
├── 📄 Dockerfile           Container image
├── 📄 package.json         Dependencies
│
└── 📚 Documentation/
    ├── README.md           Main documentation
    ├── QUICKSTART.md       5-minute setup
    ├── SETUP_GUIDE.md      Detailed setup
    ├── SETUP_CHECKLIST.md  Step-by-step checklist
    ├── PROJECT_STRUCTURE.md Architecture details
    └── CONTRIBUTING.md     Contribution guidelines
```

---

## Security Features

1. **JWT Authentication** - Access + Refresh tokens
2. **Password Hashing** - bcrypt with salt rounds
3. **Role-Based Authorization** - Fine-grained permissions
4. **Input Validation** - Joi schemas
5. **Security Headers** - Helmet middleware
6. **CORS Protection** - Configurable origins
7. **Rate Limiting** - (Planned)
8. **SQL Injection Prevention** - MongoDB parameterization

---

## Quick Start

### Prerequisites
```bash
Node.js 18+
Docker Desktop
Git
```

### Setup (3 commands)
```bash
git clone https://github.com/YassineElHassani/CareFlow.git
cd CareFlow/backend
npm install
```

### Configure
```bash
cp .env.example .env
# Edit .env and change JWT_SECRET
```

### Launch
```bash
docker-compose up -d
```

### Verify
```bash
curl http://localhost:3000/api/v1/health
# Open http://localhost:1080 for MailDev
```

**Done! API running at http://localhost:3000** 🎉

---

## API Endpoints Overview

### Authentication (`/api/v1/users`)
```
POST   /register          Register new user
POST   /login             User login
POST   /refresh           Refresh access token
POST   /logout            User logout
POST   /forgot-password   Request password reset
POST   /reset-password    Reset password
```

### Users (`/api/v1/users`)
```
GET    /users             List all users (Admin)
GET    /users/:id         Get user details
POST   /users             Create user (Admin)
PUT    /users/:id         Update user
DELETE /users/:id         Delete user (Admin)
PATCH  /users/:id/suspend Suspend account (Admin)
PATCH  /users/:id/activate Activate account (Admin)
```

### Patients (`/api/v1/patients`)
```
GET    /patients          List patients
GET    /patients/:id      Get patient details
POST   /patients          Create patient
PUT    /patients/:id      Update patient
DELETE /patients/:id      Delete patient
GET    /patients/search   Search patients
```

### Appointments (`/api/v1/appointments`)
```
GET    /appointments              List appointments
GET    /appointments/:id          Get appointment
POST   /appointments              Create appointment
PUT    /appointments/:id          Update appointment
DELETE /appointments/:id          Delete appointment
PATCH  /appointments/:id/cancel   Cancel appointment
GET    /appointments/patient/:id  Patient appointments
GET    /appointments/doctor/:id   Doctor appointments
```

### Doctors (`/api/v1/doctors`)
```
GET    /doctors                   List doctors
GET    /doctors/:id               Get doctor details
GET    /doctors/:id/availability  Check doctor availability
POST   /doctors/search            Search doctors
```

### Consultations (`/api/v1/consultations`)
```
POST   /consultations             Create consultation (Doctor)
GET    /consultations             List consultations
GET    /consultations/:id         Get consultation details
PUT    /consultations/:id         Update consultation (Doctor)
DELETE /consultations/:id         Delete consultation (Doctor)
GET    /consultations/patient/:id Patient consultations
GET    /consultations/doctor/:id  Doctor consultations
```

### Prescriptions (`/api/v1/prescriptions`)
```
POST   /prescriptions                      Create prescription (Doctor)
GET    /prescriptions                      List prescriptions
GET    /prescriptions/:id                  Get prescription details
PUT    /prescriptions/:id                  Update draft prescription (Doctor)
POST   /prescriptions/:id/sign             Sign prescription (Doctor)
POST   /prescriptions/:id/send-to-pharmacy Send to pharmacy (Doctor)
POST   /prescriptions/:id/cancel           Cancel prescription (Doctor)
POST   /prescriptions/:id/renew            Renew prescription (Doctor)
GET    /prescriptions/patient/:patientId   Patient prescriptions
GET    /prescriptions/doctor/:doctorId     Doctor prescriptions
```

### Pharmacies (`/api/v1/pharmacies`)
```
POST   /pharmacies                                 Create pharmacy (Admin)
GET    /pharmacies                                 List pharmacies (Public)
GET    /pharmacies/:id                             Get pharmacy details
PUT    /pharmacies/:id                             Update pharmacy (Admin)
DELETE /pharmacies/:id                             Delete pharmacy (Admin)
GET    /pharmacies/:id/prescriptions               Pharmacy prescriptions (Pharmacist)
POST   /pharmacies/prescriptions/:id/dispense      Dispense medication (Pharmacist)
POST   /pharmacies/prescriptions/:id/mark-unavailable  Mark unavailable (Pharmacist)
```

### Lab Orders (`/api/v1/lab-orders`)
```
POST   /lab-orders                          Create lab order (Doctor)
GET    /lab-orders                          List lab orders
GET    /lab-orders/:id                      Get lab order details
POST   /lab-orders/:id/specimen-collection  Update specimen info (Nurse/Lab Tech)
POST   /lab-orders/:id/tests/:index/result  Upload test result (Lab Tech)
PUT    /lab-orders/:id/tests/:index/status  Update test status (Lab Tech)
POST   /lab-orders/:id/finalize-report      Finalize lab report (Lab Tech)
POST   /lab-orders/:id/cancel               Cancel lab order (Doctor)
GET    /lab-orders/patient/:patientId       Patient lab orders
GET    /lab-orders/doctor/:doctorId         Doctor lab orders
GET    /lab-orders/dashboard/technician     Lab tech dashboard
```
POST   /appointments              Create appointment
PUT    /appointments/:id          Update appointment
DELETE /appointments/:id          Cancel appointment
GET    /appointments/availability Check availability
PATCH  /appointments/:id/status   Update status
```

### System (`/api`)
```
GET    /health            API health check
GET    /ready             Readiness check (DB + Redis)
```

---

## Testing

### Coverage Targets
- **80%+ overall coverage**
- **90%+ business logic**
- **100% critical paths**

### Test Commands
```bash
npm test                  # All tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Test Structure
```
tests/
├── unit/
│   ├── services/       Business logic tests
│   ├── models/         Schema validation tests
│   └── utils/          Helper function tests
│
└── integration/
    ├── auth.test.js           Auth endpoints
    ├── users.test.js          User management
    ├── patients.test.js       Patient operations
    └── appointments.test.js   Appointment scheduling
```

---

## Docker Services

| Service     | Container        | Port       | Purpose             |
|-------------|------------------|------------|---------------------|
| **API**     | careflow_app     | 3000       | Main REST API       |
| **Worker**  | careflow_worker  | -          | Email job processor |
| **MongoDB** | careflow_mongo   | 27017      | Database            |
| **Redis**   | careflow_redis   | 6379       | Queue & cache       |
| **MailDev** | careflow_maildev | 1080, 1025 | Email testing       |

### Docker Commands
```bash
docker-compose up           # Start all services
docker-compose up -d        # Start in background
docker-compose down         # Stop services
docker-compose down -v      # Stop + remove data
docker-compose logs -f      # View logs
docker-compose ps           # Service status
docker-compose restart app  # Restart specific service
```

---

## Development Workflow

```
1. Setup Environment
   ├─ Install prerequisites
   ├─ Clone repository
   ├─ Configure .env
   └─ Start Docker services

2. Development
   ├─ Make code changes (hot reload enabled)
   ├─ Write/update tests
   ├─ Run tests locally
   └─ Check linting

3. Testing
   ├─ Unit tests
   ├─ Integration tests
   └─ Coverage report

4. Commit
   ├─ Follow conventional commits
   ├─ All tests pass
   └─ No lint errors

5. Deploy
   ├─ Build Docker image
   └─ Deploy to production
```

---

## User Roles & Permissions

| Role          | Permissions                                                       |
|---------------|-------------------------------------------------------------------|
| **Admin**     | Full system access, user management, suspend/activate accounts    |
| **Doctor**    | View all patients, manage appointments, view medical records      |
| **Nurse**     | Create appointments, view patient info, check availability        |
| **Patient**   | View own profile, book appointments, view own appointments        |
| **Secretary** | Schedule appointments, manage cancellations, view clinic schedule |

---

## Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://mongo:27017/careflow

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT (CHANGE IN PRODUCTION!)
JWT_SECRET=generate-a-secure-32-char-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Email
EMAIL_HOST=maildev
EMAIL_PORT=1025
EMAIL_FROM=noreply@careflow.com
```

---

## NPM Scripts

```json
{
  "dev": "Start development server with hot reload",
  "start": "Start production server",
  "worker": "Start email worker process",
  "test": "Run all tests",
  "test:unit": "Run unit tests",
  "test:integration": "Run integration tests",
  "test:coverage": "Run tests with coverage",
  "lint": "Check code quality",
  "lint:fix": "Auto-fix linting issues",
  "docker:up": "Start Docker services",
  "docker:down": "Stop Docker services",
  "docker:logs": "View Docker logs",
  "docker:clean": "Clean Docker volumes"
}
```

---

## Documentation Files

| File                     | Purpose                | Audience       |
|--------------------------|------------------------|----------------|
| **README.md**            | Complete documentation | All developers |
| **QUICKSTART.md**        | 5-minute setup         | New users      |
| **SETUP_GUIDE.md**       | Detailed setup steps   | Beginners      |
| **SETUP_CHECKLIST.md**   | Step-by-step checklist | Setup process  |
| **PROJECT_STRUCTURE.md** | Architecture details   | Developers     |
| **CONTRIBUTING.md**      | Contribution guide     | Contributors   |
| **PROJECT_OVERVIEW.md**  | This file              | Overview       |

---

## Learning Resources

### Understanding the Codebase
1. Start with `PROJECT_STRUCTURE.md` - Understand architecture
2. Read `src/models/` - Learn data structures
3. Explore `src/services/` - Business logic
4. Check `src/controllers/` - API handlers
5. Review `src/tests/` - Test examples

### Key Concepts
- **MVC Pattern** - Separation of concerns
- **JWT Authentication** - Stateless auth
- **Redis Queues** - Background jobs
- **Mongoose ODM** - MongoDB abstraction
- **Middleware Chain** - Request processing
- **Async/Await** - Asynchronous operations

---

## Getting Help

| Issue               | Solution                                         |
|---------------------|--------------------------------------------------|
| **Setup problems**  | Check `SETUP_GUIDE.md`                           |
| **Docker issues**   | Run `docker-compose logs -f`                     |
| **API not working** | Check `curl http://localhost:3000/api/v1/health` |
| **Tests failing**   | Review error messages and logs                   |
| **Code questions**  | Read `PROJECT_STRUCTURE.md`                      |
| **Contributing**    | See `CONTRIBUTING.md`                            |

---

## Roadmap

### MVP (Current)
- User authentication & authorization
- Patient management
- Appointment scheduling
- Conflict detection
- Email notifications

### Phase 2 (Planned)
- Medical records management
- Prescription system
- Lab results integration
- Billing & invoicing
- Reports & analytics

### Phase 3 (Future)
- Telemedicine support
- Mobile app
- Payment integration
- Insurance claims
- Multi-clinic support

---

## Project Statistics

```
Languages:
  JavaScript/Node.js     100%

Lines of Code:
  Source Code            ~2,000 lines
  Tests                  ~1,500 lines
  Documentation          ~3,000 lines

Dependencies:
  Production             15 packages
  Development            7 packages

Test Coverage:
  Target                 80%+
```

---

## Key Achievements

✅ **Production-Ready Architecture**  
✅ **Comprehensive Documentation**  
✅ **Docker Support**  
✅ **Automated Testing**  
✅ **Security Best Practices**  
✅ **Role-Based Access Control**  
✅ **Background Job Processing**  
✅ **Conflict Detection System**  

---

## Contact & Support

- **Repository:** https://github.com/YassineElHassani/CareFlow
- **Author:** Yassine El Hassani
- **Issues:** Create an issue on GitHub
- **Contributions:** See CONTRIBUTING.md

---

## License

ISC License - See LICENSE file for details

---

**CareFlow EHR - Building the Future of Healthcare Technology**

*This document provides a high-level overview. For detailed information, refer to specific documentation files.*

Last Updated: October 2025
