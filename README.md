# CareFlow - Electronic Health Record System

> A modern, full-stack Electronic Health Record (EHR) system for clinics and medical practices with intelligent automation and comprehensive workflow management.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [API Coverage](#-api-coverage)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

CareFlow is a comprehensive, production-ready Electronic Health Record system designed for modern healthcare facilities. It combines a powerful RESTful API backend with a responsive React frontend to deliver seamless clinical workflows, from patient registration to lab results and pharmacy integration.

### What Makes CareFlow Special?

- **Enterprise-Grade Security** - JWT authentication, role-based access control, and encrypted data storage
- **Real-Time Conflict Prevention** - Intelligent appointment scheduling with automatic conflict detection
- **Role-Specific Dashboards** - Tailored interfaces for Admins, Doctors, Nurses, Patients, Pharmacists, and Lab Technicians
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Complete Workflow Automation** - Automated email notifications, reminders, and status updates
- **Comprehensive Analytics** - Real-time statistics and reporting capabilities
- **Laboratory Integration** - Complete lab order and results management
- **Pharmacy Module** - E-prescribing, dispensing workflow, and inventory tracking
- **Document Management** - Secure file storage with MinIO S3-compatible object storage

---

## Key Features

### 👥 User & Access Management
- Multi-role authentication (Admin, Doctor, Nurse, Patient, Secretary, Pharmacist, Lab Technician)
- JWT-based security with access and refresh tokens
- Password reset via email
- Profile management with photo upload
- Account suspension/reactivation
- Professional credentials tracking

### Patient Management
- Complete electronic medical records
- Auto-generated patient IDs (P-2025-00001)
- Medical history tracking (allergies, medications, chronic conditions)
- Emergency contact management
- Insurance details
- Patient search and advanced filtering
- Consent and preferences management

### Appointment Scheduling
- Smart scheduling with real-time availability checking
- 30-minute time slots (9 AM - 5 PM)
- **HTTP 409 conflict prevention**
- Auto-generated appointment numbers (APT-2025-00001)
- Multiple status tracking (scheduled, in-progress, completed, cancelled, no-show)
- Automatic email reminders (24 hours before)
- Doctor availability calendar
- Cancellation notifications

### Clinical Documentation
- SOAP note format (Subjective, Objective, Assessment, Plan)
- Vital signs recording (BP, temperature, heart rate, etc.)
- Diagnosis and treatment planning
- Procedure documentation
- Follow-up scheduling
- Consultation history

### Prescription & Pharmacy
- Digital prescription creation with auto-generated IDs (RX-2025-00001)
- 12 medication routes (oral, IV, IM, SC, topical, etc.)
- Digital signature with SHA256 hashing
- Complete workflow: draft → signed → sent → dispensed
- Pharmacy directory with operating hours
- Medication inventory tracking
- Automatic 30-day expiry
- Refill management

### Laboratory Services
- Lab test ordering with auto-generated IDs (LAB-2025-00001)
- Multiple test categories (hematology, biochemistry, microbiology, immunology)
- Priority levels (routine, urgent, stat)
- Specimen collection tracking
- Individual test result uploads
- Critical result flagging (normal, low, high, critical)
- Pathologist signature and report finalization
- Lab technician dashboard

### Document Management
- MinIO S3-compatible object storage
- Dedicated buckets for documents, lab reports, and prescriptions
- Secure upload and retrieval
- Pre-signed URLs for temporary access
- Document metadata tracking

### Notification System
- Redis queue-based email processing (BullMQ)
- Background worker for async email delivery
- Welcome emails for new users
- Appointment reminders and cancellations
- Password reset emails
- HTML email templates

---

## Architecture

CareFlow follows a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Pages &   │  │  Components│  │   Redux    │            │
│  │  Routing   │  │  (Atomic)  │  │   Store    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                         │                                    │
│                    Axios Client                              │
└──────────────────────────┼──────────────────────────────────┘
                           │
                      JWT Auth
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                  Backend API (Express)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Controllers│  │  Services  │  │Middlewares │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
    │ MongoDB  │    │  Redis   │    │  MinIO   │
    │ Database │    │  Cache   │    │ Storage  │
    └──────────┘    └──────────┘    └──────────┘
```

### Design Principles

- **Separation of Concerns** - Clear separation between frontend, backend, and data layers
- **RESTful API Design** - Standard HTTP methods and status codes
- **Atomic Component Architecture** - Reusable UI components (Atoms → Molecules → Organisms)
- **Service Layer Pattern** - Business logic separated from controllers
- **Repository Pattern** - Data access abstraction with Mongoose models
- **Event-Driven Notifications** - Asynchronous email processing with Redis queues

---

## Tech Stack

### Frontend
| Category | Technology |
|----------|-----------|
| **Framework** | React 19.2 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7.2 |
| **State Management** | Redux Toolkit + Redux Persist |
| **Server State** | TanStack Query (React Query) |
| **Routing** | React Router v7 |
| **Forms** | React Hook Form + Yup/Zod |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Testing** | Vitest + Testing Library |

### Backend
| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.x |
| **Language** | JavaScript (ES6+) |
| **Database** | MongoDB 6.0 + Mongoose ODM |
| **Cache/Queue** | Redis 7.x + BullMQ |
| **Storage** | MinIO (S3-compatible) |
| **Authentication** | JWT + bcryptjs |
| **Validation** | Joi |
| **Logging** | Winston + Morgan |
| **Email** | Nodemailer + MailDev (dev) |
| **API Docs** | Swagger/OpenAPI |
| **Testing** | Mocha + Chai + Supertest |

### DevOps
| Category | Technology |
|----------|-----------|
| **Containerization** | Docker + Docker Compose |
| **Version Control** | Git + GitHub |
| **Code Quality** | ESLint + Prettier |

---

## Project Structure

```
CareFlow/
│
├── backend/                      # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/              # Configuration files (DB, Redis, MinIO, Swagger)
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic layer
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API route definitions
│   │   ├── middlewares/         # Auth, validation, error handling
│   │   ├── queues/              # BullMQ email queue workers
│   │   ├── utils/               # Helper functions
│   │   ├── scripts/             # Seed data & utilities
│   │   ├── app.js               # Express app setup
│   │   └── index.js             # Server entry point
│   │
│   ├── docker-compose.yml       # Docker services (MongoDB, Redis, MinIO, MailDev)
│   ├── Dockerfile               # Backend container
│   ├── package.json             # Dependencies & scripts
│   └── README.md                # Backend documentation
│
├── frontend/                     # Frontend App (React + TypeScript)
│   ├── src/
│   │   ├── components/          # UI components (Atomic Design)
│   │   │   ├── atoms/           # Basic elements (Button, Input, etc.)
│   │   │   ├── molecules/       # Composite components (Card, Modal, etc.)
│   │   │   ├── organisms/       # Complex components (Forms, Tables, etc.)
│   │   │   └── common/          # Shared components
│   │   │
│   │   ├── pages/               # Route pages
│   │   │   ├── auth/            # Login, Register, Password Reset
│   │   │   ├── dashboard/       # Role-specific dashboards
│   │   │   ├── patients/        # Patient management
│   │   │   ├── appointments/    # Appointment scheduling
│   │   │   ├── consultations/   # Clinical documentation
│   │   │   ├── prescriptions/   # Prescription management
│   │   │   ├── lab-orders/      # Laboratory orders
│   │   │   └── users/           # User management
│   │   │
│   │   ├── layouts/             # Layout components (Header, Sidebar, Footer)
│   │   ├── routes/              # Route configuration & guards
│   │   ├── services/            # API service layer
│   │   ├── store/               # Redux store & slices
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Helper functions & validators
│   │   ├── constants/           # App constants & config
│   │   ├── styles/              # Global styles
│   │   └── tests/               # Test files
│   │
│   ├── public/                  # Static assets
│   ├── index.html               # HTML entry point
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── package.json             # Dependencies & scripts
│   └── README.md                # Frontend documentation
│
└── README.md                     # This file
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

### Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YassineElHassani/CareFlow.git
cd CareFlow
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start Docker services (MongoDB, Redis, MinIO, MailDev)
docker-compose up -d

# Initialize database collections
npm run migrate

# Seed database with sample data (optional)
npm run seed:all

# Start backend server
npm run dev
```

Backend will be running at `http://localhost:3000`

#### Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

### Default Test Credentials

After seeding the database, you can login with:

**Admin Account:**
- Email: `admin@careflow.com`
- Password: `Admin@123`

**Doctor Account:**
- Email: `dr.sarah.johnson@careflow.com`
- Password: `Doctor@123`

**Patient Account:**
- Email: `john.doe@email.com`
- Password: `Patient@123`

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart mongodb

# Clean up (remove volumes)
docker-compose down -v
```

---

## Documentation

### Backend Documentation
- **[Complete Backend README](./backend/README.md)** - Detailed backend documentation
- **[API Documentation](./backend/SWAGGER_DOCUMENTATION.md)** - Swagger/OpenAPI specs
- **[Quick Start Guide](./backend/QUICKSTART.md)** - Fast setup for experienced developers
- **[Setup Guide](./backend/SETUP_GUIDE.md)** - Step-by-step installation
- **[Postman Guide](./backend/POSTMAN_GUIDE.md)** - API testing with Postman
- **[Database Design](./backend/DATABASE_DESIGN.md)** - Schema and relationships
- **[Docker Hub Guide](./backend/DOCKER_HUB.md)** - Container deployment

### Frontend Documentation
- **[Complete Frontend README](./frontend/README.md)** - Detailed frontend documentation
- **[Getting Started](./frontend/GETTING_STARTED.md)** - Complete overview and quick start
- **[Quick Reference](./frontend/QUICK_REFERENCE.md)** - Developer cheat sheet
- **[Testing Guide](./frontend/TESTING_GUIDE.md)** - How to test features
- **[Project Overview](./frontend/PROJECT_OVERVIEW.md)** - Architecture and tech stack
- **[Roadmap](./frontend/ROADMAP.md)** - 10-week implementation plan
- **[Sprint Reports](./frontend/)** - Sprint completion status

---

## API Coverage

CareFlow provides **86+ API endpoints** across multiple modules:

### Authentication & Users (12 endpoints)
- Registration, Login, Logout
- Token Refresh, Password Reset
- User CRUD, Profile Management
- Account Suspension

### Patients (8 endpoints)
- Patient CRUD operations
- Medical history management
- Search and filtering
- Statistics dashboard

### Appointments (10 endpoints)
- Create, Read, Update, Delete
- Conflict detection
- Doctor availability
- Status management

### Consultations (7 endpoints)
- Create and manage consultations
- SOAP note documentation
- Vital signs recording
- Link to appointments

### Prescriptions (12 endpoints)
- Digital prescription creation
- Signature and workflow management
- Pharmacy assignment
- Renewal and tracking

### Pharmacy (15 endpoints)
- Pharmacy directory
- Operating hours management
- Medication dispensing
- Inventory tracking

### Lab Orders (10 endpoints)
- Test ordering
- Result management
- Critical value flagging
- Report finalization

### Documents (8 endpoints)
- File upload and retrieval
- Document categorization
- Secure access with pre-signed URLs

### Doctors (4 endpoints)
- Doctor listing and search
- Availability calendar
- Specialization filtering

---

## Security

CareFlow implements multiple layers of security:

- **Authentication**: JWT with access and refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Password Security**: bcrypt hashing with salt rounds
- **Data Validation**: Joi schema validation on all inputs
- **API Security**: Helmet.js for HTTP headers
- **CORS**: Configured cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks
- **File Upload**: Secure file handling with type validation
- **SQL Injection**: Mongoose ODM prevents injection attacks
- **XSS Protection**: Input sanitization and output encoding
- **Environment Variables**: Sensitive data in .env files
- **Audit Logging**: Track user actions and system events

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## Author

**Yassine El Hassani**

- GitHub: [@YassineElHassani](https://github.com/YassineElHassani)
- Repository: [CareFlow](https://github.com/YassineElHassani/CareFlow)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for flexible data storage
- Redis for caching and queue management
- MinIO for S3-compatible object storage
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Backend Documentation](./backend/README.md) and [Frontend Documentation](./frontend/README.md)
2. Search existing [GitHub Issues](https://github.com/YassineElHassani/CareFlow/issues)
3. Create a new issue if needed

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star! ⭐**

Made with ❤️ for healthcare professionals

</div>
