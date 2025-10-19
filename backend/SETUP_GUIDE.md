# CareFlow EHR - Complete Setup Guide

This guide will walk you through setting up the CareFlow EHR backend application step by step.

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Quick Start](./QUICKSTART.md)** - Fast setup (5 minutes)
- **[Setup Checklist](./SETUP_CHECKLIST.md)** - Verify installation
- **[Quick Fix Guide](./QUICK_FIX.md)** - Common issues
- **[API Docs](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

## Table of Contents

1. [Prerequisites Check](#1-prerequisites-check)
2. [Project Setup](#2-project-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Running with Docker](#4-running-with-docker)
5. [Running Locally](#5-running-locally)
6. [Verify Installation](#6-verify-installation)
7. [Common Issues](#7-common-issues)
8. [Next Steps](#8-next-steps)

---

## 1. Prerequisites Check

### 1.1 Install Node.js

**Required Version:** Node.js 18.x or higher

**Check if installed:**
```bash
node --version
```

**If not installed:**
- Download from [nodejs.org](https://nodejs.org/)
- Choose the LTS (Long Term Support) version
- Follow the installation wizard

### 1.2 Install Docker Desktop

**Required for containerized development**

**Check if installed:**
```bash
docker --version
docker-compose --version
```

**If not installed:**
- Download from [docker.com](https://www.docker.com/products/docker-desktop/)
- Install and start Docker Desktop
- Ensure Docker is running (check the Docker icon in your system tray)

### 1.3 Install Git

**Check if installed:**
```bash
git --version
```

**If not installed:**
- Download from [git-scm.com](https://git-scm.com/)

---

## 2. Project Setup

### 2.1 Clone the Repository

Open your terminal and run:

```bash
# Clone the repository
git clone https://github.com/YassineElHassani/CareFlow.git

# Navigate to the backend directory
cd CareFlow/backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`.

**Expected output:**
```
added XXX packages in XXs
```

---

## 3. Environment Configuration

### 3.1 Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

### 3.2 Configure Environment Variables

Open `.env` file in your editor and update the following important variables:

```env
# IMPORTANT: Change this secret key (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Database (leave as is for Docker)
MONGO_URI=mongodb://mongo:27017/careflow

# Redis (leave as is for Docker)
REDIS_HOST=redis
REDIS_PORT=6379

# Email (MailDev for development - leave as is)
EMAIL_HOST=maildev
EMAIL_PORT=1025
EMAIL_FROM=noreply@careflow.com
```

**⚠️ SECURITY WARNING:** 
- **Never commit your `.env` file to Git**
- Change `JWT_SECRET` to a strong, unique value in production
- Use strong passwords for production databases

### 3.3 Generate a Strong JWT Secret

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

Copy the output and paste it as your `JWT_SECRET` value.

---

## 4. Running with Docker (Recommended)

Docker Compose will start all required services:
- API Server
- Email Worker
- MongoDB Database
- Redis Cache/Queue
- MailDev (Email Testing)

### 4.1 Start All Services

```bash
docker-compose up
```

**Or run in background (detached mode):**
```bash
docker-compose up -d
```

### 4.2 Check Service Status

```bash
docker-compose ps
```

**Expected output:**
```
NAME                    STATUS              PORTS
careflow_app            Up                  0.0.0.0:3000->3000/tcp
careflow_worker         Up
careflow_mongo          Up                  0.0.0.0:27017->27017/tcp
careflow_redis          Up                  0.0.0.0:6379->6379/tcp
careflow_maildev        Up                  0.0.0.0:1025->1025/tcp, 0.0.0.0:1080->1080/tcp
```

### 4.3 View Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f app
docker-compose logs -f worker
docker-compose logs -f mongo
```

### 4.4 Stop Services

```bash
# Stop containers (data persists)
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

---

## 5. Running Locally (Without Docker)

### 5.1 Start MongoDB Locally

**Install MongoDB:**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)

**Start MongoDB:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows (as service)
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Update .env:**
```env
MONGO_URI=mongodb://localhost:27017/careflow
```

### 5.2 Start Redis Locally

**Install Redis:**
- macOS: `brew install redis`
- Windows: Download from [redis.io](https://redis.io/download)
- Linux: `sudo apt-get install redis-server`

**Start Redis:**
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Windows
redis-server
```

**Update .env:**
```env
REDIS_HOST=localhost
EMAIL_HOST=localhost
```

### 5.3 Start the Application

**Terminal 1 - API Server:**
```bash
npm run dev
```

**Terminal 2 - Email Worker:**
```bash
npm run worker
```

---

## 6. Verify Installation

### 6.1 Check API Health

**Open browser or use curl:**
```bash
curl http://localhost:3000/api/v1/health
```

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-12T10:30:00.000Z",
  "uptime": 5.123,
  "environment": "development",
  "version": "1.0.0"
}
```

### 6.2 Check Readiness (DB + Redis)

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
  },
  "timestamp": "2025-10-12T10:30:00.000Z"
}
```

### 6.3 Access Services

| Service        | URL                       | Description         |
|----------------|---------------------------|---------------------|
| **API**        | http://localhost:3000     | Main API endpoint   |
| **MailDev UI** | http://localhost:1080     | View test emails    |
| **MongoDB**    | mongodb://localhost:27017 | Database connection |
| **Redis**      | redis://localhost:6379    | Cache/Queue         |

### 6.4 Test Email System

1. Open MailDev UI: http://localhost:1080
2. Register a new user through the API
3. Check MailDev for the welcome email

---

## 7. Common Issues

### Issue 1: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
# Windows (PowerShell)
netstat -ano | findstr :3000

# macOS/Linux
lsof -ti:3000

# Kill the process or change PORT in .env
PORT=3001
```

### Issue 2: Docker Containers Won't Start

**Error:** `Cannot start service...`

**Solution:**
```bash
# 1. Check Docker is running
docker ps

# 2. Stop all containers
docker-compose down

# 3. Remove volumes and restart
docker-compose down -v
docker-compose up -d

# 4. Check logs
docker-compose logs
```

### Issue 3: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# 1. Verify MongoDB is running
docker-compose ps mongo

# 2. Restart MongoDB
docker-compose restart mongo

# 3. Check MongoDB logs
docker-compose logs mongo
```

### Issue 4: Authorization Failed - Empty Array

**Error:** `You do not have permission to access this resource`

**Cause:** Authorization middleware was using spread operator which created nested arrays

**Fixed:** Changed `authorize(...roles)` to `authorize(allowedRoles)` to properly handle array parameters

### Issue 5: Doctors Endpoint Returns Empty Array

**Error:** GET `/api/v1/doctors` returns `{"count": 0, "data": []}`

**Cause:** `isActive = true` default parameter caused boolean→string comparison issue

**Fixed:** Removed default parameter and only filter by `isActive` when explicitly provided

### Issue 6: AppointmentNumber Required Error

**Error:** `appointmentNumber: Path 'appointmentNumber' is required`

**Cause:** Field marked as `required: true` but should be auto-generated

**Fixed:** Removed `required: true` from schema, pre-save hook now generates it automatically

### Issue 7: Patient Field Structure

**Error:** `firstName is required` when creating patient

**Cause:** Patient model uses nested structure (`personalInfo.firstName`, not `firstName`)

**Solution:** Use correct nested structure:
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

### Issue 4: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: Permission Denied (Linux/macOS)

**Error:** `Permission denied`

**Solution:**
```bash
# Add execute permission to scripts
chmod +x scripts/*.sh

# Or run with sudo
sudo docker-compose up
```

---

## 8. Next Steps

### 8.1 Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

### 8.2 Check Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### 8.3 Explore the API

1. **Use Postman or Insomnia:**
   - Import the API collection (if available)
   - Test authentication endpoints
   - Create users, patients, appointments

2. **Check API Documentation:**
   - Read `README.md` for available endpoints
   - Review user stories for feature understanding

3. **Test User Roles:**
   - Register as different user types
   - Test role-based access control
   - Verify permissions

### 8.4 Development Workflow

```bash
# 1. Start development environment
docker-compose up -d

# 2. View logs
docker-compose logs -f app

# 3. Make code changes (hot reload is enabled)

# 4. Run tests
npm test

# 5. Commit changes
git add .
git commit -m "feat: add new feature"
git push

# 6. Stop environment
docker-compose down
```

### 8.5 Useful Commands

```bash
# Database operations
docker-compose exec mongo mongosh
> use careflow
> db.users.find()

# Redis operations
docker-compose exec redis redis-cli
> KEYS *

# Check API logs
docker-compose logs -f app

# Check worker logs
docker-compose logs -f worker

# Restart specific service
docker-compose restart app
```

---

## Setup Complete!

You're now ready to start developing with CareFlow EHR!

### Quick Reference

| Action             | Command                             |
|--------------------|-------------------------------------|
| Start all services | `docker-compose up -d`              |
| Stop all services  | `docker-compose down`               |
| View logs          | `docker-compose logs -f`            |
| Run tests          | `npm test`                          |
| Lint code          | `npm run lint`                      |
| API health check   | http://localhost:3000/api/v1/health |
| Email UI           | http://localhost:1080               |

### Getting Help

- **Documentation:** Check `README.md`
- **Issues:** Create an issue on GitHub
- **Logs:** Always check logs first: `docker-compose logs -f`

---
