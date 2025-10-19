# CareFlow EHR - Backend API

> Electronic Health Record (EHR) system for clinics and medical practices

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## Documentation Navigation

- **[Complete Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation files
- **[Quick Start Guide](./QUICKSTART.md)** - Fast setup for experienced developers
- **[Detailed Setup Guide](./SETUP_GUIDE.md)** - Step-by-step installation
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Swagger/OpenAPI docs
- **[Testing Guide](./POSTMAN_GUIDE.md)** - Postman collection and testing

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## About

CareFlow is a comprehensive Electronic Health Record (EHR) backend system designed for clinics and medical practices. It provides a robust REST API for managing users, patients, appointments, and automating healthcare workflows with conflict prevention and notification systems.

## Features

### User Management
- Secure registration and login (JWT with access + refresh tokens)
- Role-based access control (Admin, Doctor, Nurse, Patient, Secretary)
- Customizable user profiles
- Account suspension/reactivation (Admin only)
- Password reset via email
- Profile picture upload support
- Professional credentials management

### Patient Management
- Complete patient records (CRUD operations)
- Auto-generated patient numbers (P-2025-00001)
- Medical history tracking (allergies, medications, chronic conditions)
- Contact information and insurance details
- Emergency contact management
- Patient search and filtering
- Consent and preferences management
- Patient statistics dashboard

### Appointment Management
- Smart appointment scheduling with doctor assignment
- Real-time availability checking (30-minute slots, 9 AM - 5 PM)
- **Conflict prevention with HTTP 409 response**
- Auto-generated appointment numbers (APT-2025-00001)
- Multiple statuses: scheduled, in-progress, completed, cancelled, no-show
- Appointment modification and cancellation
- Doctor availability endpoint with booked slots
- Patient appointment history
- Doctor schedule management
- Automatic email reminders (24 hours before)
- Cancellation email notifications

### Doctor Management
- Doctor listing with specialization filters
- Search doctors by name or specialization
- Real-time availability calendar
- Professional profile management
- Department and qualifications tracking

### Notifications
- Email notifications via Redis queue (BullMQ)
- Background worker for email processing
- Welcome emails for new users
- Appointment reminder emails (24 hours before)
- Appointment cancellation emails
- Password reset emails
- HTML email templates

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Cache/Queue** | Redis + BullMQ |
| **Authentication** | JWT + bcryptjs |
| **Validation** | Joi |
| **Logging** | Winston + Morgan |
| **Email** | Nodemailer + MailDev (development) |
| **Testing** | Mocha + Chai + Supertest |
| **Containerization** | Docker + Docker Compose |

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── redis.js         # Redis connection
│   │   └── logger.js        # Winston logger setup
│   │
│   ├── controllers/         # Request handlers
│   │   ├── AuthController.js
│   │   ├── UsersController.js
│   │   ├── PatientsController.js
│   │   ├── DoctorsController.js
│   │   └── AppointmentsController.js
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── UserModel.js
│   │   ├── PatientModel.js
│   │   ├── AppointmentModel.js
│   │   ├── AuditLogModel.js
│   │   ├── index.js
|   |   └── MedicalRecordModel.js
│   │
│   ├── services/            # Business logic
│   │   ├── AuthService.js
│   │   ├── PatientService.js
│   │   ├── UserService.js
│   │   └── AppointmentService.js
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── AuthMiddleware.js
│   │   ├── ValidateMiddleware.js
│   │   └── ErrorMiddleware.js
│   │
│   ├── routes/              # API routes
│   │   ├── index.js 
│   │   └── v1/
│   │       ├── AppointmentRoutes.js
│   │       ├── DoctorRoutes.js
│   │       ├── MedicalRecordRoutes.js
│   │       ├── PatientRoutes.js
│   │       └── UserRoutes.js
│   │
│   ├── queues/              # Background jobs
│   │   ├── EmailQueue.js
│   │   └── WorkerEmail.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── jwt.js
│   │   └── DateHelpers.js
│   │
│   ├── tests/               # Test files
│   │   ├── unit/
│   │   └── integration/
│   │
│   ├── app.js               # Express app setup
│   └── index.js             # Entry point
│
├── scripts/                 # Utility scripts
│   └── start-worker.sh
│
├── .env.example             # Environment variables template
├── .gitignore
├── .eslintrc.js
├── docker-compose.yml       # Docker services definition
├── Dockerfile
├── package.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** >= 9.x (comes with Node.js)
- **Docker** >= 20.x ([Download](https://www.docker.com/))
- **Docker Compose** >= 2.x
- **Git** ([Download](https://git-scm.com/))

Optional (for local development without Docker):
- **MongoDB** >= 6.0
- **Redis** >= 7.0

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/YassineElHassani/CareFlow.git
cd CareFlow/backend
```

### Step 2: Environment Configuration

Create a `.env` file from the example template:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration (see [Environment Variables](#environment-variables) section).

**Important:** Change the `JWT_SECRET` to a strong, unique secret key (minimum 32 characters).

### Step 3: Install Dependencies

```bash
npm install
```

## Running the Application

### Option 1: Docker Compose (Recommended)

This will start all services (API, MongoDB, Redis, Email server, Worker):

```bash
# Start all services
docker-compose up

# Or in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

**Services will be available at:**
- 🌐 API: http://localhost:3000
- 📧 MailDev UI: http://localhost:1080
- 🗄️ MongoDB: mongodb://localhost:27017
- 🔴 Redis: redis://localhost:6379

### Option 2: Local Development

**Prerequisites:** MongoDB and Redis must be running locally.

```bash
# Terminal 1: Start the API
npm run dev

# Terminal 2: Start the email worker
npm run worker
```

### Production Mode

```bash
npm start
```

## Testing

### Run All Tests

```bash
npm test
```

### Test Structure

- **Unit Tests**: Test individual functions and business logic
  - Services validation
  - Joi schemas
  - Helper functions

- **Integration Tests**: Test API endpoints with real database
  - Authentication flows
  - CRUD operations
  - Conflict prevention
  - Access control

### Running Specific Test Suites

```bash
# Run only unit tests
npm test -- --grep "Unit"

# Run only integration tests
npm test -- --grep "Integration"

# Run tests with coverage
npm run test:coverage
```

## API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-access-token>
```

### Example: Create Patient

```bash
curl -X POST http://localhost:3000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "personalInfo": {
      "firstName": "Ahmed",
      "lastName": "Hassan",
      "nationalId": "PAT12345",
      "gender": "male",
      "dateOfBirth": "1985-03-20",
      "bloodType": "A+"
    },
    "contact": {
      "phone": "+212612345690",
      "email": "ahmed.hassan@email.com",
      "address": {
        "street": "123 Main Street",
        "city": "Rabat",
        "country": "Morocco"
      }
    },
    "emergencyContact": {
      "name": "Fatima Hassan",
      "relationship": "wife",
      "phone": "+212612345691"
    }
  }'
```

### Example: Create Appointment

```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "patient": "68f200806f16ca2bede738c4",
    "doctor": "68f1fe7b333f8a608de664cf",
    "scheduledDate": "2025-10-18",
    "scheduledTime": "10:00",
    "duration": 30,
    "type": "consultation",
    "chiefComplaint": "Annual checkup"
  }'
```
### Authentication Endpoints

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Main Endpoints

#### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login
- `POST /api/v1/users/refresh` - Refresh access token
- `POST /api/v1/users/logout` - Logout
- `POST /api/v1/users/forgot-password` - Request password reset
- `POST /api/v1/users/reset-password` - Reset password

#### Users
- `GET /api/v1/users` - List all users (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (Admin)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin)
- `PATCH /api/v1/users/:id/suspend` - Suspend user (Admin)
- `PATCH /api/v1/users/:id/activate` - Activate user (Admin)

#### Patients
- `GET /api/v1/patients` - List all patients (Staff)
- `GET /api/v1/patients/me` - Get own patient record (Patient)
- `GET /api/v1/patients/stats` - Get patient statistics (Admin)
- `GET /api/v1/patients/search/:searchTerm` - Search patients by term
- `GET /api/v1/patients/:id` - Get patient by ID
- `POST /api/v1/patients` - Create new patient (Staff)
- `PUT /api/v1/patients/:id` - Update patient
- `DELETE /api/v1/patients/:id` - Delete patient (Admin)
- `POST /api/v1/patients/:id/medical/allergy` - Add allergy
- `POST /api/v1/patients/:id/medical/medication` - Add medication
- `POST /api/v1/patients/:id/medical/condition` - Add chronic condition
- `GET /api/v1/patients/:id/medical-history` - Get full medical history

#### Appointments
- `GET /api/v1/appointments` - List all appointments (Staff)
- `GET /api/v1/appointments/:id` - Get appointment details
- `POST /api/v1/appointments` - Create new appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `PATCH /api/v1/appointments/:id/status` - Update appointment status
- `PATCH /api/v1/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/v1/appointments/:id` - Delete appointment (Admin)
- `POST /api/v1/appointments/check-availability` - Check doctor availability
- `GET /api/v1/appointments/my-appointments` - Get my appointments (Patient)
- `GET /api/v1/appointments/my-schedule` - Get my schedule (Doctor)

#### Doctors
- `GET /api/v1/doctors` - List all doctors (with filters)
- `GET /api/v1/doctors/search` - Search doctors by name/specialization
- `GET /api/v1/doctors/:id/availability` - Get doctor availability slots (30-min slots, 9 AM - 5 PM)
- `GET /api/v1/doctors/:id/appointments` - Get doctor appointments (Private)
- `GET /api/v1/appointments/availability` - Check practitioner availability
- `PATCH /api/v1/appointments/:id/status` - Update appointment status

### User Roles & Permissions

| Role          | Can Do                                                            |
|---------------|-------------------------------------------------------------------|
| **Admin**     | Full system access, user management, suspend accounts             |
| **Doctor**    | View patients, manage own appointments, view all appointments     |
| **Nurse**     | Create appointments, view patient info, check availability        |
| **Patient**   | View own profile, book appointments, view own appointments        |
| **Secretary** | Schedule appointments, manage cancellations, view clinic schedule |

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://mongo:27017/careflow

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Email
EMAIL_HOST=maildev
EMAIL_PORT=1025
EMAIL_FROM=noreply@careflow.com

# Other configurations...
```

## Troubleshooting

### Docker Issues

**Problem:** Containers won't start
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs <service-name>

# Restart services
docker-compose restart
```

**Problem:** Port already in use
```bash
# Check what's using the port
# Windows (PowerShell)
netstat -ano | findstr :3000

# Kill the process or change the port in .env
```

### Database Connection Issues

**Problem:** Cannot connect to MongoDB
```bash
# Check if MongoDB is running
docker-compose ps mongo

# Restart MongoDB
docker-compose restart mongo
```

### Worker Not Processing Jobs

**Problem:** Email worker not sending emails
```bash
# Check worker logs
docker-compose logs worker

# Restart worker
docker-compose restart worker
```

## Development Scripts

```json
{
  "dev": "nodemon --watch src src/index.js",     // Start with hot reload
  "start": "node src/index.js",                  // Production start
  "worker": "node src/queues/WorkerEmail.js",    // Start email worker
  "test": "mocha --recursive --exit",            // Run tests
  "lint": "eslint .",                            // Run linter
  "lint:fix": "eslint . --fix"                   // Fix linting issues
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Yassine El Hassani**

- GitHub: [@YassineElHassani](https://github.com/YassineElHassani)

## Acknowledgments

- Express.js community
- MongoDB documentation
- BullMQ for queue management
- All contributors

---

## 📚 Related Documentation

- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Complete navigation guide
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Architecture and design
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Code organization
- **[DATABASE_DESIGN.md](./DATABASE_DESIGN.md)** - Database schema
- **[SWAGGER_DOCUMENTATION.md](./SWAGGER_DOCUMENTATION.md)** - API documentation
- **[DOCKER_HUB.md](./DOCKER_HUB.md)** - Docker deployment
- **[QUICK_FIX.md](./QUICK_FIX.md)** - Troubleshooting guide

---

**Note:** This is an MVP (Minimum Viable Product) version focusing on core authentication and appointment management features. Additional features will be added in future releases.

For questions or support, please open an issue on GitHub.
