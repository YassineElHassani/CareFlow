# CareFlow API - Postman Testing Guide

Complete guide to testing your CareFlow EHR API using Postman.

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Swagger Documentation](./SWAGGER_DOCUMENTATION.md)** - Interactive API testing
- **[Postman Quick Reference](./POSTMAN_QUICK_REFERENCE.md)** - Quick commands
- **[Database Design](./DATABASE_DESIGN.md)** - Data models
- **[Setup Guide](./SETUP_GUIDE.md)** - Installation

---

## Table of Contents

1. [Setup Postman](#setup-postman)
2. [Environment Setup](#environment-setup)
3. [Authentication Flow](#authentication-flow)
4. [Testing All Endpoints](#testing-all-endpoints)
5. [Collection Variables](#collection-variables)
6. [Common Issues](#common-issues)

---

## Setup Postman

### Step 1: Install Postman

Download from: https://www.postman.com/downloads/

### Step 2: Create a New Collection

1. Open Postman
2. Click **"Collections"** in the sidebar
3. Click **"+"** or **"Create Collection"**
4. Name it: **"CareFlow EHR API"**

### Step 3: Set Base URL

1. Click on your collection
2. Go to **"Variables"** tab
3. Add a variable:
   - **Variable:** `baseUrl`
   - **Initial Value:** `http://localhost:3000/api/v1`
   - **Current Value:** `http://localhost:3000/api/v1`

---

## Environment Setup

### Create Development Environment

1. Click **"Environments"** (left sidebar)
2. Click **"+"** to create new environment
3. Name: **"CareFlow - Development"**
4. Add these variables:

| Variable          | Initial Value                  | Current Value                  |
|-------------------|--------------------------------|--------------------------------|
| `baseUrl`         | `http://localhost:3000/api/v1` | `http://localhost:3000/api/v1` |
| `accessToken`     | (will be set automatically)    | (will be set automatically)    |
| `refreshToken`    | (will be set automatically)    | (will be set automatically)    |
| `userId`          | (will be set automatically)    | (will be set automatically)    |
| `patientId`       | (will be set automatically)    | (will be set automatically)    |
| `doctorId`        | (will be set automatically)    | (will be set automatically)    |
| `appointmentId`   | (will be set automatically)    | (will be set automatically)    |

5. Click **"Save"**
6. Select this environment from the dropdown (top right)

---

## Authentication Flow

### 1. Health Check (No Auth Required)

**Request:**
```
GET {{baseUrl}}/health
```

**Expected Response (200 OK):**
```json
{
  "status": "success",
  "message": "CareFlow API is running",
  "version": "1.0.0",
  "timestamp": "2025-10-18T..."
}
```

---

### 2. Readiness Check (No Auth Required)

**Request:**
```
GET {{baseUrl}}/ready
```

**Expected Response (200 OK):**
```json
{
  "status": "ready",
  "checks": {
    "database": "connected",
    "redis": "connected"
  },
  "timestamp": "2025-10-18T..."
}
```

---

### 3. Register a Doctor

**Request:**
```
POST {{baseUrl}}/users/register
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "dr.john@careflow.com",
  "password": "Doctor@123",
  "firstName": "John",
  "lastName": "Doe",
  "nationalId": "DOC98765",
  "gender": "male",
  "phone": "+212612345678",
  "dateOfBirth": "1980-05-15",
  "address": {
    "street": "123 Medical Street",
    "city": "Casablanca",
    "state": "Casablanca-Settat",
    "country": "Morocco"
  },
  "role": "doctor",
  "specialization": ["Cardiology", "Internal Medicine"],
  "licenseNumber": "MED-2024-5678",
  "department": "Cardiology",
  "qualifications": ["MD", "Board Certified Cardiologist"],
  "yearsOfExperience": 15
}
```

**Tests Tab (add this script):**
```javascript
// Save tokens and userId to environment
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    pm.environment.set("accessToken", responseJson.data.accessToken);
    pm.environment.set("refreshToken", responseJson.data.refreshToken);
    pm.environment.set("userId", responseJson.data.user.id);
    
    // Save as doctorId if role is doctor
    if (responseJson.data.user.role === 'doctor') {
        pm.environment.set("doctorId", responseJson.data.user.id);
    }
}
```

---

### 4. Login (Get Tokens)

**Request:**
```
POST {{baseUrl}}/users/login
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "dr.john@careflow.com",
  "password": "Doctor@123"
}
```

**Tests Tab:**
```javascript
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    pm.environment.set("accessToken", responseJson.data.accessToken);
    pm.environment.set("refreshToken", responseJson.data.refreshToken);
    pm.environment.set("userId", responseJson.data.user.id);
}
```

---

### 5. Get User Profile (Test Authentication)

**Request:**
```
GET {{baseUrl}}/users/profile
Authorization: Bearer {{accessToken}}
```

**Headers:**
- Key: `Authorization`
- Value: `Bearer {{accessToken}}`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "dr.john@careflow.com",
    "role": "doctor",
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

---

## Testing All Endpoints

### PATIENT MANAGEMENT

#### 1. Create Patient

**Request:**
```
POST {{baseUrl}}/patients
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "personalInfo": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "nationalId": "PAT12345",
    "gender": "male",
    "dateOfBirth": "1985-03-20",
    "bloodType": "A+",
    "maritalStatus": "married"
  },
  "contact": {
    "phone": "+212612345690",
    "email": "ahmed.hassan@email.com",
    "address": {
      "street": "123 Main Street",
      "city": "Rabat",
      "state": "Rabat-Salé-Kénitra",
      "zipCode": "10000",
      "country": "Morocco"
    }
  },
  "emergencyContact": {
    "name": "Fatima Hassan",
    "relationship": "wife",
    "phone": "+212612345691"
  },
  "medicalInfo": {
    "allergies": ["Penicillin"],
    "chronicConditions": ["Hypertension"]
  }
}
```

**Tests Tab:**
```javascript
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    pm.environment.set("patientId", responseJson.data._id);
}
```

---

#### 2. List All Patients

**Request:**
```
GET {{baseUrl}}/patients?page=1&limit=10
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `page`: 1
- `limit`: 10
- `gender`: male (optional)
- `bloodType`: A+ (optional)

---

#### 3. Get Patient by ID

**Request:**
```
GET {{baseUrl}}/patients/{{patientId}}
Authorization: Bearer {{accessToken}}
```

---

#### 4. Update Patient

**Request:**
```
PUT {{baseUrl}}/patients/{{patientId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "contact": {
    "phone": "+212612345699"
  }
}
```

---

#### 5. Add Allergy

**Request:**
```
POST {{baseUrl}}/patients/{{patientId}}/medical/allergy
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "allergy": "Aspirin",
  "severity": "moderate",
  "reaction": "Skin rash"
}
```

---

#### 6. Search Patients

**Request:**
```
GET {{baseUrl}}/patients/search/Ahmed
Authorization: Bearer {{accessToken}}
```

---

#### 7. Get Patient Statistics (Admin only)

**Request:**
```
GET {{baseUrl}}/patients/stats
Authorization: Bearer {{accessToken}}
```

---

### DOCTOR MANAGEMENT

#### 1. List All Doctors (Public)

**Request:**
```
GET {{baseUrl}}/doctors?page=1&limit=10
```

**Query Parameters:**
- `specialization`: Cardiology (optional)
- `isActive`: true (optional)

---

#### 2. Search Doctors

**Request:**
```
GET {{baseUrl}}/doctors/search?q=cardiology
```

**Query Parameters:**
- `q`: cardiology

---

#### 3. Get Doctor Availability

**Request:**
```
GET {{baseUrl}}/doctors/{{doctorId}}/availability?date=2025-10-19
```

**Query Parameters:**
- `date`: 2025-10-19 (YYYY-MM-DD format)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "doctor": {
      "id": "...",
      "name": "John Doe",
      "specialization": ["Cardiology"]
    },
    "date": "2025-10-19",
    "workingHours": {
      "start": "9:00",
      "end": "17:00"
    },
    "totalSlots": 16,
    "availableSlots": 16,
    "bookedSlots": 0,
    "slots": [
      {"time": "09:00", "available": true},
      {"time": "09:30", "available": true},
      ...
    ]
  }
}
```

---

### APPOINTMENT MANAGEMENT

#### 1. Create Appointment

**Request:**
```
POST {{baseUrl}}/appointments
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "patient": "{{patientId}}",
  "doctor": "{{doctorId}}",
  "scheduledDate": "2025-10-19",
  "scheduledTime": "10:00",
  "duration": 30,
  "type": "consultation",
  "chiefComplaint": "Annual checkup and blood pressure monitoring"
}
```

**Tests Tab:**
```javascript
if (pm.response.code === 201) {
    const responseJson = pm.response.json();
    pm.environment.set("appointmentId", responseJson.data._id);
}
```

---

#### 2. List All Appointments (Staff)

**Request:**
```
GET {{baseUrl}}/appointments?page=1&limit=10
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `doctor`: {{doctorId}} (optional)
- `patient`: {{patientId}} (optional)
- `status`: scheduled (optional)
- `startDate`: 2025-10-01 (optional)
- `endDate`: 2025-10-31 (optional)

---

#### 3. Get Appointment by ID

**Request:**
```
GET {{baseUrl}}/appointments/{{appointmentId}}
Authorization: Bearer {{accessToken}}
```

---

#### 4. Update Appointment

**Request:**
```
PUT {{baseUrl}}/appointments/{{appointmentId}}
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "scheduledTime": "11:00",
  "notes": "Patient requested later time"
}
```

---

#### 5. Cancel Appointment

**Request:**
```
PATCH {{baseUrl}}/appointments/{{appointmentId}}/cancel
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "cancellationReason": "Patient requested to reschedule"
}
```

---

#### 6. Update Appointment Status

**Request:**
```
PATCH {{baseUrl}}/appointments/{{appointmentId}}/status
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "in-progress"
}
```

**Valid statuses:** `scheduled`, `in-progress`, `completed`, `cancelled`, `no-show`

---

#### 7. Get My Appointments (Patient)

**Request:**
```
GET {{baseUrl}}/appointments/my-appointments?status=scheduled
Authorization: Bearer {{accessToken}}
```

---

#### 8. Get My Schedule (Doctor)

**Request:**
```
GET {{baseUrl}}/appointments/my-schedule?date=2025-10-19
Authorization: Bearer {{accessToken}}
```

---

#### 9. Test Conflict Detection

**Request:**
```
POST {{baseUrl}}/appointments
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (overlapping with existing appointment):**
```json
{
  "patient": "{{patientId}}",
  "doctor": "{{doctorId}}",
  "scheduledDate": "2025-10-19",
  "scheduledTime": "10:15",
  "duration": 30,
  "type": "follow-up",
  "chiefComplaint": "Test conflict detection"
}
```

**Expected Response (409 Conflict):**
```json
{
  "status": "fail",
  "message": "Doctor is not available at this time slot"
}
```

---

### 👥 USER MANAGEMENT

#### 1. Register Secretary

**Request:**
```
POST {{baseUrl}}/users/register
Content-Type: application/json
```

**Body:**
```json
{
  "email": "sarah.secretary@careflow.com",
  "password": "Staff@12345",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "nationalId": "SEC12345",
  "gender": "female",
  "phone": "+212612345681",
  "role": "secretary"
}
```

---

#### 2. Register Admin

**Request:**
```
POST {{baseUrl}}/users/register
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@careflow.com",
  "password": "Admin@12345",
  "firstName": "Admin",
  "lastName": "User",
  "nationalId": "ADM12345",
  "gender": "male",
  "phone": "+212612345682",
  "role": "admin"
}
```

---

## Collection Variables & Test Scripts

### Global Test Script (Add to Collection)

1. Click on your collection
2. Go to **"Scripts"** tab
3. Select **"Post-response"**
4. Add this script:

```javascript
// Automatically save tokens from any login/register response
if (pm.response.code === 200 || pm.response.code === 201) {
    const responseJson = pm.response.json();
    
    if (responseJson.data && responseJson.data.accessToken) {
        pm.environment.set("accessToken", responseJson.data.accessToken);
        console.log("✅ Access token saved");
    }
    
    if (responseJson.data && responseJson.data.refreshToken) {
        pm.environment.set("refreshToken", responseJson.data.refreshToken);
        console.log("✅ Refresh token saved");
    }
}
```

---

## Postman Collection Structure

Organize your requests in folders:

```
📁 CareFlow EHR API
├── 📁 Health Checks
│   ├── GET Health Check
│   └── GET Readiness Check
│
├── 📁 Authentication
│   ├── POST Register Doctor
│   ├── POST Register Admin
│   ├── POST Register Secretary
│   ├── POST Login
│   └── GET User Profile
│
├── 📁 Patient Management
│   ├── POST Create Patient
│   ├── GET List Patients
│   ├── GET Patient by ID
│   ├── PUT Update Patient
│   ├── DELETE Delete Patient
│   ├── POST Add Allergy
│   ├── POST Add Medication
│   ├── GET Search Patients
│   └── GET Patient Statistics
│
├── 📁 Doctor Management
│   ├── GET List Doctors
│   ├── GET Search Doctors
│   └── GET Doctor Availability
│
├── 📁 Appointment Management
│   ├── POST Create Appointment
│   ├── GET List Appointments
│   ├── GET Appointment by ID
│   ├── PUT Update Appointment
│   ├── PATCH Cancel Appointment
│   ├── PATCH Update Status
│   ├── GET My Appointments (Patient)
│   ├── GET My Schedule (Doctor)
│   └── POST Test Conflict Detection
│
└── 📁 Error Scenarios
    ├── POST Invalid Credentials
    ├── GET Unauthorized Request
    └── POST Conflict Detection
```

---

## Common Issues & Solutions

### Issue 1: "Unauthorized" Error

**Problem:** Getting 401 Unauthorized

**Solution:**
1. Make sure you're logged in first
2. Check the `accessToken` variable is set
3. Verify the Authorization header: `Bearer {{accessToken}}`
4. Token expires in 15 minutes - login again if needed

---

### Issue 2: "You do not have permission"

**Problem:** Getting 403 Forbidden

**Solution:**
- Check your user role (admin, doctor, nurse, secretary, patient)
- Some endpoints require specific roles:
  - `DELETE /patients/:id` - Admin only
  - `GET /patients/stats` - Admin only
  - `POST /patients` - Staff only (admin, doctor, nurse, secretary)

---

### Issue 3: Field Validation Errors

**Problem:** `personalInfo.firstName is required`

**Solution:**
- Patient creation requires **nested structure**
- Use `personalInfo.firstName` not just `firstName`
- Use `contact.phone` not just `phone`

---

### Issue 4: Appointment Conflict (409)

**Problem:** "Doctor is not available at this time slot"

**Solution:**
- This is **expected behavior** for conflict detection
- Check doctor availability first: `GET /doctors/:id/availability`
- Choose a time slot marked as `"available": true`

---

## Pro Tips

### 1. Use Pre-request Scripts

Add to collection pre-request script:
```javascript
// Auto-generate dates for appointments
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
pm.environment.set("tomorrow", tomorrow.toISOString().split('T')[0]);
```

Then use `{{tomorrow}}` in your requests!

---

### 2. Chain Requests

Create a **Test Runner** that runs requests in order:
1. Register Doctor → Save doctorId
2. Create Patient → Save patientId
3. Create Appointment → Use doctorId + patientId
4. Cancel Appointment → Use appointmentId

---

### 3. Environment Switching

Create multiple environments:
- **Development** - `http://localhost:3000/api/v1`
- **Staging** - `https://staging.careflow.com/api/v1`
- **Production** - `https://api.careflow.com/api/v1`

Switch between them easily!

---

### 4. Export & Share Collection

1. Right-click on collection
2. Click **"Export"**
3. Choose **"Collection v2.1"**
4. Save as `CareFlow_API_Collection.json`
5. Share with your team!

---

## Testing Checklist

- [ ] Health check returns 200 OK
- [ ] Readiness check shows DB + Redis connected
- [ ] Can register doctor with professional info
- [ ] Can login and receive tokens
- [ ] Can create patient with nested structure
- [ ] Can list all doctors (public endpoint)
- [ ] Can check doctor availability (16 slots)
- [ ] Can create appointment successfully
- [ ] **Conflict detection rejects overlapping appointments (409)**
- [ ] Can cancel appointment and receive email
- [ ] Authorization works for protected endpoints
- [ ] Role-based access control works (403 for wrong role)

---

**Need Help?**
- Check the browser console in Postman for script errors
- Enable **"Postman Console"** (View → Show Postman Console) to see detailed logs
- Verify Docker containers are running: `docker-compose ps`
