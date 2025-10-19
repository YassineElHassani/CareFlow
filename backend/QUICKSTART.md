# Quick Start - CareFlow EHR

Get up and running in 5 minutes!

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Detailed Setup Guide](./SETUP_GUIDE.md)** - Step-by-step instructions
- **[Setup Checklist](./SETUP_CHECKLIST.md)** - Verify your installation
- **[API Docs](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed

## Setup Steps

### 1. Clone & Install

```bash
git clone https://github.com/YassineElHassani/CareFlow.git
cd CareFlow/backend
npm install
```

### 2. Configure Environment

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

**⚠️ Important:** Open `.env` and change `JWT_SECRET` to a secure value (min 32 chars)

```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start with Docker

```bash
docker-compose up -d
```

### 4. Verify It's Working

**Check API Health:**
```bash
curl http://localhost:3000/api/v1/health
```

**Open MailDev (Email Testing):**
```
http://localhost:1080
```

## 🎉 Done!

Your API is running at: **http://localhost:3000**

## What's Running?

| Service | Port | Description |
|---------|------|-------------|
| API | 3000 | Main REST API |
| MailDev | 1080 | Email testing UI |
| MongoDB | 27017 | Database |
| Redis | 6379 | Queue & Cache |

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Run tests
npm test

# Access MongoDB shell
docker-compose exec mongo mongosh
```

## Test the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@careflow.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "nationalId": "DOC12345",
    "gender": "male",
    "phone": "+212612345678",
    "address": {
      "city": "Casablanca",
      "country": "Morocco"
    },
    "role": "doctor",
    "specialization": ["General Medicine"],
    "yearsOfExperience": 10
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@careflow.com",
    "password": "SecurePass123!"
  }'
```

### Create a Patient (Save the token from login)

```bash
curl -X POST http://localhost:3000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
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
        "city": "Rabat",
        "country": "Morocco"
      }
    }
  }'
```

### List All Doctors

```bash
curl http://localhost:3000/api/v1/doctors
```

### Check Doctor Availability

```bash
# Replace DOCTOR_ID with actual doctor ID from above
curl "http://localhost:3000/api/v1/doctors/DOCTOR_ID/availability?date=2025-10-18"
```

## Need Help?

- Full Setup Guide: `SETUP_GUIDE.md`
- Complete Documentation: `README.md`
- Issues: Check `docker-compose logs -f`

## Common Issues

**Port already in use?**
```bash
# Change port in .env
PORT=3001
```

**Docker not starting?**
```bash
# Clean restart
docker-compose down -v
docker-compose up -d
```

**Can't connect to database?**
```bash
# Check services
docker-compose ps

# Restart MongoDB
docker-compose restart mongo
```

---
