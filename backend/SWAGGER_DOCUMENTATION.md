# Swagger API Documentation

## Overview

The CareFlow API is now fully documented using Swagger/OpenAPI 3.0 specification. All endpoints have comprehensive JSDoc annotations with request/response schemas, authentication requirements, and examples.

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Postman Guide](./POSTMAN_GUIDE.md)** - Alternative testing method
- **[Postman Quick Reference](./POSTMAN_QUICK_REFERENCE.md)** - Quick commands
- **[Quick Start](./QUICKSTART.md)** - Setup the app
- **[Database Design](./DATABASE_DESIGN.md)** - Understand data models

---

## Access Points

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json

## Documentation Coverage

### Total Endpoints Documented: **39 endpoints**

### 1. Health Endpoints (3 endpoints)
- `GET /api/v1/` - API information
- `GET /api/v1/health` - Liveness check
- `GET /api/v1/ready` - Readiness check (MongoDB + Redis)

### 2. Authentication Endpoints (6 endpoints)
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/refresh-token` - Refresh access token
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgot-password` - Request password reset
- `POST /api/v1/users/reset-password` - Reset password with token

### 3. User Management Endpoints (8 endpoints)
**Protected Routes:**
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/change-password` - Change password

**Admin Only:**
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id/suspend` - Suspend user account
- `PUT /api/v1/users/:id/reactivate` - Reactivate user account
- `DELETE /api/v1/users/:id` - Delete user permanently

### 4. Doctor Endpoints (5 endpoints)
**Public:**
- `GET /api/v1/doctors` - Get all doctors (filtered, paginated)
- `GET /api/v1/doctors/search` - Search doctors by name/specialization
- `GET /api/v1/doctors/:id` - Get doctor details
- `GET /api/v1/doctors/:id/availability` - Get available time slots

**Protected:**
- `GET /api/v1/doctors/:id/appointments` - Get doctor's appointments (Admin/Doctor)

### 5. Patient Endpoints (13 endpoints)
**Patient Access:**
- `GET /api/v1/patients/me` - Get my patient record

**Staff Access:**
- `GET /api/v1/patients` - Get all patients (paginated, filtered)
- `GET /api/v1/patients/search/:searchTerm` - Search patients
- `POST /api/v1/patients` - Create new patient
- `GET /api/v1/patients/:id` - Get patient by ID
- `PUT /api/v1/patients/:id` - Update patient
- `GET /api/v1/patients/user/:userId` - Get patient by user ID

**Medical Staff Access:**
- `GET /api/v1/patients/:id/medical-history` - Get medical history
- `POST /api/v1/patients/:id/allergies` - Add allergy
- `POST /api/v1/patients/:id/medications` - Add medication
- `POST /api/v1/patients/:id/conditions` - Add chronic condition

**Admin Only:**
- `GET /api/v1/patients/stats` - Get patient statistics
- `DELETE /api/v1/patients/:id` - Delete patient

### 6. Appointment Endpoints (10 endpoints)
**Patient Access:**
- `GET /api/v1/appointments/my-appointments` - Get my appointments

**Doctor Access:**
- `GET /api/v1/appointments/my-schedule` - Get my schedule

**All Authenticated:**
- `POST /api/v1/appointments/check-availability` - Check availability
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments/:id` - Get appointment by ID
- `PATCH /api/v1/appointments/:id/cancel` - Cancel appointment

**Staff Only:**
- `GET /api/v1/appointments` - Get all appointments (filtered, paginated)
- `PUT /api/v1/appointments/:id` - Update appointment
- `PATCH /api/v1/appointments/:id/status` - Update status

**Admin Only:**
- `DELETE /api/v1/appointments/:id` - Delete appointment

## Authentication

All protected endpoints use **Bearer Token Authentication** (JWT).

### How to Authenticate in Swagger UI:

1. Click the **"Authorize"** button (🔓 icon) at the top right
2. Enter your JWT token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"**
4. Click **"Close"**

All subsequent requests will include the authentication header.

### Getting a Token:

1. Use the `POST /api/v1/users/register` endpoint to create an account
2. Use the `POST /api/v1/users/login` endpoint to get access and refresh tokens
3. Copy the `accessToken` from the response
4. Use it in the Authorize dialog

## Request/Response Schemas

All endpoints include detailed schemas for:

### Request Bodies
- Required fields marked clearly
- Field types and formats specified
- Enum values for restricted fields
- Example values for all properties
- Validation rules (minLength, pattern, etc.)

### Response Bodies
- Success responses (200, 201)
- Error responses (400, 401, 403, 404, 409, 503)
- Pagination objects where applicable
- References to shared schemas (User, Patient, Appointment)

## Tags & Organization

Endpoints are organized into logical groups:

- **Health** - System health and readiness checks
- **Authentication** - User registration, login, token management
- **Users** - User profile and account management
- **Doctors** - Doctor information and availability
- **Patients** - Patient records and medical information
- **Appointments** - Appointment scheduling and management

## Features

### Interactive API Testing
- **Try it out** button on each endpoint
- Pre-filled example values
- Real-time response display
- HTTP status codes shown
- Response headers visible

### Comprehensive Documentation
- Clear descriptions for each endpoint
- Parameter documentation (path, query, body)
- Authentication requirements clearly marked
- Role-based access control documented
- Example requests and responses

### Schema Definitions
All shared schemas are defined in `src/config/swagger.js`:
- **User** - User account schema
- **Patient** - Patient record schema
- **Appointment** - Appointment schema
- **Error** - Error response schema

## Examples

### Example 1: Create Patient (POST /api/v1/patients)

**Request:**
```json
{
  "personalInfo": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "nationalId": "AB123456",
    "bloodType": "O+"
  },
  "contact": {
    "phone": "+1234567890",
    "email": "patient@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  },
  "medicalInfo": {
    "allergies": ["Penicillin"],
    "chronicConditions": ["Diabetes"],
    "currentMedications": ["Metformin 500mg"]
  }
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "patientNumber": "P-2025-00001",
    "personalInfo": { ... },
    "contact": { ... },
    "medicalInfo": { ... },
    "createdAt": "2025-10-19T10:30:00.000Z"
  }
}
```

### Example 2: Create Appointment (POST /api/v1/appointments)

**Request:**
```json
{
  "patient": "60d5ec49f1b2c72b8c8e4f1b",
  "doctor": "60d5ec49f1b2c72b8c8e4f1a",
  "scheduledDate": "2025-10-20",
  "scheduledTime": "10:00",
  "duration": 30,
  "type": "consultation",
  "chiefComplaint": "Chest pain and shortness of breath"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "appointmentNumber": "APT-2025-00001",
    "patient": { ... },
    "doctor": { ... },
    "scheduledDate": "2025-10-20",
    "scheduledTime": "10:00",
    "duration": 30,
    "type": "consultation",
    "status": "scheduled",
    "chiefComplaint": "Chest pain and shortness of breath",
    "createdAt": "2025-10-19T10:35:00.000Z"
  }
}
```

### Example 3: Check Doctor Availability (GET /api/v1/doctors/:id/availability)

**Request:**
```
GET /api/v1/doctors/60d5ec49f1b2c72b8c8e4f1a/availability?date=2025-10-20
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "doctor": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "email": "doctor@careflow.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "professional": {
        "specialization": ["Cardiology"]
      }
    },
    "date": "2025-10-20",
    "availableSlots": [
      "09:00", "09:30", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00"
    ],
    "totalSlots": 10
  }
}
```

## Usage Tips

### 1. Explore by Tag
Use the tag filters to view endpoints by category (Health, Authentication, Users, etc.)

### 2. Use Models Section
Scroll to the bottom to see all schema definitions with expandable examples

### 3. Test Authentication Flow
1. Register a new user
2. Login to get tokens
3. Authorize with the access token
4. Test protected endpoints

### 4. Check Response Codes
Each endpoint documents all possible HTTP status codes and their meanings

### 5. View Request Examples
Click on "Example Value" to see pre-filled request bodies

## Configuration

### Swagger Configuration File
**Location:** `src/config/swagger.js`

**Contains:**
- OpenAPI 3.0 specification
- API information (title, version, description)
- Server URLs (development, production)
- Security schemes (Bearer JWT)
- Component schemas (User, Patient, Appointment, Error)
- Tags definitions

### Route Annotations
All routes include JSDoc comments with `@swagger` tags:
- `src/routes/index.js` - Health endpoints
- `src/routes/v1/UserRoutes.js` - User & auth endpoints
- `src/routes/v1/DoctorRoutes.js` - Doctor endpoints
- `src/routes/v1/PatientRoutes.js` - Patient endpoints
- `src/routes/v1/AppointmentRoutes.js` - Appointment endpoints

## Additional Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc @swagger Comments](https://github.com/Surnet/swagger-jsdoc)

## Validation

All endpoints have been documented with:
- ✅ Complete request/response schemas
- ✅ Authentication requirements
- ✅ Role-based access control
- ✅ Pagination support
- ✅ Filtering options
- ✅ Error responses
- ✅ Examples for all fields
- ✅ Validation rules

## Result

Visit http://localhost:3000/api-docs to explore and test all 39 endpoints.

---

**Last Updated:** October 19, 2025  
**API Version:** 1.0.0  
**Documentation Standard:** OpenAPI 3.0
