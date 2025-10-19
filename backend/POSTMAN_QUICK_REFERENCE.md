# CareFlow API - Quick Reference Card

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Postman Guide](./POSTMAN_GUIDE.md)** - Complete Postman guide
- **[Swagger Documentation](./SWAGGER_DOCUMENTATION.md)** - Interactive API docs
- **[Database Design](./DATABASE_DESIGN.md)** - Data models
- **[Setup Guide](./SETUP_GUIDE.md)** - Installation

---

## Quick Import to Postman

1. **Open Postman** → Click **"Import"**
2. **Drag & Drop** the file: `CareFlow_Postman_Collection.json`
3. **Create Environment**:
   - Name: `CareFlow - Development`
   - Add variable: `baseUrl` = `http://localhost:3000/api/v1`
4. **Select the environment** (top-right dropdown)
5. **Start testing!**

---

## Quick Start Testing (5 Steps)

### Step 1: Check Health
```
GET {{baseUrl}}/health
```
Expected: `200 OK` - API is running

---

### Step 2: Register Doctor
```
POST {{baseUrl}}/users/register
```
**Body:**
```json
{
  "email": "doctor@careflow.com",
  "password": "Doctor@123",
  "firstName": "John",
  "lastName": "Doe",
  "nationalId": "DOC12345",
  "gender": "male",
  "phone": "+212612345678",
  "role": "doctor",
  "specialization": ["Cardiology"]
}
```
→ Saves `accessToken` and `doctorId` automatically

---

### Step 3: Create Patient
```
POST {{baseUrl}}/patients
Headers: Authorization: Bearer {{accessToken}}
```
**Body:**
```json
{
  "personalInfo": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "nationalId": "PAT123",
    "gender": "male",
    "dateOfBirth": "1985-03-20",
    "bloodType": "A+"
  },
  "contact": {
    "phone": "+212612345690",
    "email": "ahmed@email.com"
  }
}
```
→ Saves `patientId` automatically

---

### Step 4: Check Doctor Availability
```
GET {{baseUrl}}/doctors/{{doctorId}}/availability?date=2025-10-19
```
→ Returns 16 available 30-minute slots (9:00 AM - 5:00 PM)

---

### Step 5: Create Appointment
```
POST {{baseUrl}}/appointments
Headers: Authorization: Bearer {{accessToken}}
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
  "chiefComplaint": "Annual checkup"
}
```
→ Creates appointment, sends reminder email

---

## Essential Endpoints Cheat Sheet

### Authentication (No Auth)
| Method | Endpoint          | Body Required                                  |
|--------|-------------------|------------------------------------------------|
| `POST` | `/users/register` | email, password, firstName, lastName, role     |
| `POST` | `/users/login`    | email, password                                |

### Patients (Requires Auth)
| Method | Endpoint                 | Access |
|--------|--------------------------|--------|
| `POST` | `/patients`              | Staff  |
| `GET`  | `/patients`              | Staff  |
| `GET`  | `/patients/:id`          | Staff  |
| `GET`  | `/patients/search/:term` | Staff  |

### Doctors (Public)
| Method | Endpoint                                    | Access |
|--------|---------------------------------------------|--------|
| `GET`  | `/doctors`                                  | Public |
| `GET`  | `/doctors/search?q=cardiology`              | Public |
| `GET`  | `/doctors/:id/availability?date=YYYY-MM-DD` | Public |

### Appointments (Requires Auth)
| Method  | Endpoint                        | Access          |
|---------|---------------------------------|-----------------|
| `POST`  | `/appointments`                 | Staff + Patient |
| `GET`   | `/appointments`                 | Staff           |
| `GET`   | `/appointments/:id`             | Staff           |
| `PATCH` | `/appointments/:id/cancel`      | Staff           |
| `GET`   | `/appointments/my-appointments` | Patient         |
| `GET`   | `/appointments/my-schedule`     | Doctor          |

---

## Authorization Header

All protected endpoints require:
```
Authorization: Bearer {{accessToken}}
```

Postman automatically uses `{{accessToken}}` from environment variables.

---

## Test Scripts (Auto-save tokens)

Add to **Collection → Scripts → Post-response**:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const json = pm.response.json();
    
    if (json.data?.accessToken) {
        pm.environment.set("accessToken", json.data.accessToken);
    }
    if (json.data?.refreshToken) {
        pm.environment.set("refreshToken", json.data.refreshToken);
    }
    if (json.data?._id) {
        pm.environment.set("lastCreatedId", json.data._id);
    }
}
```

---

## Environment Variables

| Variable                           | Description       | Example                              |
|------------------------------------|-------------------|--------------------------------------|
| `baseUrl`                          | API base URL      | `http://localhost:3000/api/v1`       |
| `accessToken`                      | JWT access token  | (auto-saved from login)              |
| `refreshToken`                     | JWT refresh token | (auto-saved from login)              |
| `userId`                           | Current user ID   | (auto-saved from register)           |
| `doctorId`                         | Doctor ID         | (auto-saved from doctor register)    |
| `patientId`                        | Patient ID        | (auto-saved from create patient)     |
| `appointmentId`                    | Appointment ID    | (auto-saved from create appointment) |

---

## Common Error Codes

| Code  | Status          | Meaning                  | Solution                    |
|-------|-----------------|--------------------------|-----------------------------|
| `200` | ✅ OK           | Success                  |              -              |
| `201` | ✅ Created      | Resource created         |              -              |
| `400` | ❌ Bad Request  | Invalid data             | Check request body format   |
| `401` | ❌ Unauthorized | Not logged in            | Login first, check token    |
| `403` | ❌ Forbidden    | Wrong role               | Check user role permissions |
| `404` | ❌ Not Found    | Resource not found       | Check ID exists             |
| `409` | ⚠️ Conflict     | **Appointment conflict** | Choose different time slot  |
| `500` | ❌ Server Error | Server issue             | Check server logs           |

---

## Patient Data Structure (IMPORTANT!)

**❌ WRONG (will fail):**
```json
{
  "firstName": "Ahmed",
  "phone": "+212..."
}
```

**✅ CORRECT (nested structure):**
```json
{
  "personalInfo": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "gender": "male",
    "dateOfBirth": "1985-03-20"
  },
  "contact": {
    "phone": "+212612345690",
    "email": "ahmed@email.com"
  }
}
```

---

## Test Scenarios

### ✅ Positive Tests

1. **Create valid appointment** → 201 Created
2. **List all doctors** → 200 OK with 2 doctors
3. **Check availability** → 16 available slots
4. **Cancel appointment** → 200 OK + email sent

### ⚠️ Negative Tests

1. **Create overlapping appointment** → 409 Conflict ✅
2. **Access without token** → 401 Unauthorized
3. **Wrong role** → 403 Forbidden
4. **Invalid field** → 400 Bad Request

---

## Testing Workflow

```
1. Register Doctor
   ↓
2. Login (get token)
   ↓
3. Create Patient
   ↓
4. Check Doctor Availability
   ↓
5. Create Appointment
   ↓
6. Test Conflict Detection
   ↓
7. Cancel Appointment
   ↓
8. Verify Email in MailDev (http://localhost:1080)
```

---

## Pro Tips

### Tip 1: Use Collection Runner
Run all requests in order automatically:
1. Click collection → **"Run"**
2. Select requests to run
3. Click **"Run CareFlow EHR API"**

### Tip 2: Generate Sample Data
Pre-request script:
```javascript
pm.environment.set("randomEmail", `user${Date.now()}@careflow.com`);
```

### Tip 3: Save Responses
Right-click response → **"Save Response"** → Save as example for documentation

### Tip 4: Monitor API
Postman can monitor your API and alert you if endpoints fail!

---

## Email Testing

After creating/cancelling appointments:
1. Open **MailDev UI**: http://localhost:1080
2. Check for emails:
   - Welcome emails (on register)
   - Appointment reminders (24h before)
   - Cancellation notices

---

## Debugging

### Check Postman Console
- **View** → **Show Postman Console**
- See all requests/responses
- View script logs (`console.log()`)

### Check Docker Logs
```bash
docker-compose logs -f app
docker-compose logs -f worker
```

### Common Fixes
- Token expired? → Login again
- 404 Not Found? → Check URL spelling
- 403 Forbidden? → Check user role
- Can't connect? → `docker-compose ps` to verify services

---

**Questions?** Check `POSTMAN_GUIDE.md` for full documentation.

