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

CareFlow is a modern, scalable backend API for electronic health records management, designed for clinics and medical practices. Built with Node.js, Express, MongoDB, and Redis, it provides comprehensive user management, patient records, appointment scheduling with automatic conflict detection, and email notifications.

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
- **Profile Management**
- **Account Suspension/Activation**
- **Password Reset via Email**
- **Professional credentials tracking**

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
