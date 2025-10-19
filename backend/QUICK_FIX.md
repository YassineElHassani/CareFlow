# Quick Fix Guide - CareFlow Setup

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup
- **[Setup Checklist](./SETUP_CHECKLIST.md)** - Verify installation
- **[Quick Start](./QUICKSTART.md)** - Fast setup
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

## What Has Been Fixed & Tested

### 1. **Core Features Implementation** ✅
- PatientService.js (12 methods) - TESTED
- PatientsController.js (13 methods) - TESTED
- PatientRoutes.js - Complete with RBAC
- AppointmentsController.js (10 methods) - TESTED
- AppointmentRoutes.js - Complete
- DoctorsController.js (5 methods) - TESTED
- DoctorRoutes.js - Complete

### 2. **Bugs Fixed During Testing** ✅

**Bug #1: DoctorsController Empty Results**
- **Issue:** GET `/api/v1/doctors` returned empty array despite 2 doctors in database
- **Cause:** `isActive = true` default parameter caused `true === 'true'` comparison to fail
- **Fix:** Removed default parameter, only filter by isActive when explicitly provided
- **Status:** FIXED - Now returns 2 doctors correctly

**Bug #2: Authorization Middleware Array Issue** ✅
- **Issue:** All routes returned "You do not have permission to access this resource"
- **Cause:** `authorize(...roles)` created nested arrays: `[['admin', 'doctor']]`
- **Fix:** Changed to `authorize(allowedRoles)` accepting single array parameter
- **Status:** FIXED - Authorization working for all roles

**Bug #3: AppointmentNumber Required Error** ✅
- **Issue:** `appointmentNumber: Path 'appointmentNumber' is required`
- **Cause:** Field marked as `required: true` but should be auto-generated
- **Fix:** Removed `required: true`, pre-save hook generates it automatically
- **Status:** FIXED - Auto-generates APT-2025-00001, APT-2025-00002, etc.

### 3. **Testing Results** ✅

**Doctor Management:**
- List all doctors: 2 doctors found
- Search by specialization: "cardiology" found Dr. Smith
- Get availability: 16 slots (9:00-16:30), 30-minute intervals
- Availability updates: 15 slots after booking 10:00 appointment

**Patient Management:** 
- Create patient with nested structure (personalInfo, contact)
- List all patients: 2 patients
- Get patient by ID: Full details returned
- Auto-generated patient numbers: P-2025-00001, P-2025-00002

**Appointment Management:**
- Create appointment: APT-2025-00001 created
- **Conflict detection working:** Rejected overlapping 10:15 appointment (HTTP 409)
- Cancel appointment: Status changed, email sent
- Email reminders: Sent 24h before appointment
- Cancellation emails: Sent on cancel

**Email System:**
- Emails processed successfully:
  - Welcome emails
  - Appointment reminder
  - Cancellation notice

---

## Choose Your Setup Method

### **Method 1: Docker (RECOMMENDED - Easiest)**

Everything works out of the box!

#### Steps:
```bash
# Start all services
docker-compose up

# Or in background
docker-compose up -d
```

**What it starts:**
- ✅ API Server (http://localhost:3000)
- ✅ Email Worker
- ✅ MongoDB
- ✅ Redis
- ✅ MailDev UI (http://localhost:1080)

**Environment:** Uses `.env.docker` automatically

---

### **Method 2: Local Development**

Run directly on your machine (requires MongoDB & Redis installed).

#### Prerequisites:
1. **MongoDB** - Must be running on `localhost:27017`
2. **Redis** - Must be running on `localhost:6379`

#### Install MongoDB:
**Windows:**
```powershell
# Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb

# Start service:
net start MongoDB
```

#### Install Redis:
**Windows (use WSL2):**
```bash
# In WSL2:
sudo apt-get install redis-server
sudo service redis-server start
```

**Or use Docker for just these services:**
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:6.0

# Start Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Start MailDev
docker run -d -p 1080:1080 -p 1025:1025 --name maildev maildev/maildev
```

#### Then run your app:
```bash
# Terminal 1: API Server
npm run dev

# Terminal 2: Email Worker
npm run worker
```

**Environment:** Uses `.env` (already configured for localhost)

---

## Test Your Setup

### 1. Check API Health
```bash
curl http://localhost:3000/api/v1/health
```

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-13T...",
  "uptime": 5.123,
  "environment": "development"
}
```

### 2. Check Readiness (DB + Redis)
```bash
curl http://localhost:3000/api/v1/ready
```

**Expected response:**
```json
{
  "status": "ready",
  "checks": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 3. Check MailDev
Open browser: http://localhost:1080

---

## Troubleshooting

### "Cannot connect to MongoDB"
**Error:** `MongooseServerSelectionError: getaddrinfo ENOTFOUND mongo`

**Solution:**
- **If using Docker:** Make sure all services are running (`docker-compose ps`)
- **If running locally:** Check MongoDB is running on localhost:27017

### "Redis connection failed"
**Error:** `ECONNREFUSED 127.0.0.1:6379`

**Solution:**
- **If using Docker:** Restart redis container
- **If running locally:** Start Redis service

### "nodemon not found" (in Docker)
This means node_modules aren't installed in the container.

**Solution:**
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### "BullMQ: maxRetriesPerRequest must be null"
**FIXED!** - This is now handled in the Redis config.

---

## File Changes Made

### 1. `src/config/redis.js`
- Added `maxRetriesPerRequest: null` (required for BullMQ)
- Added connection event handlers
- Added retry strategy

### 2. `src/queues/EmailQueue.js`
- Now uses centralized Redis config
- Added error handling

### 3. `src/queues/WorkerEmail.js`
- Complete rewrite with proper logging
- Uses centralized Redis config
- Better error handling
- Shows job progress

### 4. `src/config/database.js`
- Added try-catch error handling
- Added connection event handlers
- Better error messages

### 5. `.env`
- Configured for **local development** (localhost)

### 6. `.env.docker` (NEW)
- Configured for **Docker** (service names)

### 7. `docker-compose.yml`
- Updated to use `.env.docker`

---

## Recommended: Use Docker

**Why?**
- No need to install MongoDB/Redis locally
- Everything works immediately
- Consistent environment
- Easy to clean up (`docker-compose down -v`)

**Just run:**
```bash
docker-compose up
```

**Access:**
- API: http://localhost:3000
- MailDev: http://localhost:1080

**Done!** 🎉

---

## Quick Commands

### Docker
```bash
# Start everything
docker-compose up

# Stop everything
docker-compose down

# Rebuild if needed
docker-compose build --no-cache

# View logs
docker-compose logs -f app
docker-compose logs -f worker

# Check status
docker-compose ps
```

### Local
```bash
# Start API
npm run dev

# Start Worker (in another terminal)
npm run worker

# Run tests
npm test

# Check code quality
npm run lint
```

---

## Success Checklist

- [ ] Docker is running (check system tray icon)
- [ ] Run `docker-compose up`
- [ ] See "✅ MongoDB connected successfully" in logs
- [ ] See "✅ Redis connected successfully" in logs  
- [ ] See "info: CareFlow API listening on port 3000"
- [ ] See "📧 Email worker started and waiting for jobs..."
- [ ] Can access http://localhost:3000/api/v1/health
- [ ] Can access http://localhost:1080 (MailDev)

---

**Last Updated:** October 17, 2025
