# CareFlow EHR - Step-by-Step Setup Checklist

Print this page and check off each step as you complete it!

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed instructions
- **[Quick Start](./QUICKSTART.md)** - Fast setup
- **[Quick Fix Guide](./QUICK_FIX.md)** - Troubleshooting
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

## ✅ Phase 1: Prerequisites Installation

### Step 1.1: Node.js
- [ ] Download Node.js 18+ from https://nodejs.org/
- [ ] Run the installer
- [ ] Verify installation: `node --version` (should show v18.x.x or higher)
- [ ] Verify npm: `npm --version`

### Step 1.2: Docker Desktop
- [ ] Download Docker Desktop from https://www.docker.com/products/docker-desktop/
- [ ] Install and launch Docker Desktop
- [ ] Wait for Docker to start (whale icon in system tray should be steady)
- [ ] Verify: `docker --version`
- [ ] Verify: `docker-compose --version`

### Step 1.3: Git
- [ ] Download Git from https://git-scm.com/
- [ ] Install with default settings
- [ ] Verify: `git --version`

---

## ✅ Phase 2: Project Setup

### Step 2.1: Get the Code
Open your terminal/command prompt:

```bash
# Navigate to your projects folder
cd ~/Desktop/Projects  # or wherever you keep projects

# Clone the repository
git clone https://github.com/YassineElHassani/CareFlow.git

# Navigate to backend folder
cd CareFlow/backend
```

- [ ] Repository cloned successfully
- [ ] Inside `CareFlow/backend` directory

### Step 2.2: Install Dependencies

```bash
npm install
```

- [ ] All packages installed (should see "added XXX packages")
- [ ] No errors during installation

---

## ✅ Phase 3: Configuration

### Step 3.1: Create Environment File

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

- [ ] `.env` file created

### Step 3.2: Configure JWT Secret

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] Copy the generated string
- [ ] Open `.env` file in your editor
- [ ] Find the line: `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars`
- [ ] Replace with your generated secret
- [ ] Save the file

### Step 3.3: Review Other Settings

Open `.env` and verify these settings (leave as-is for Docker):

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://mongo:27017/careflow
REDIS_HOST=redis
EMAIL_HOST=maildev
```

- [ ] All settings reviewed
- [ ] File saved

---

## ✅ Phase 4: Launch with Docker

### Step 4.1: Start Docker Desktop
- [ ] Docker Desktop is running (check system tray icon)
- [ ] Docker icon shows "Docker Desktop is running"

### Step 4.2: Start All Services

```bash
docker-compose up
```

**First time?** This will:
- Download required Docker images (may take 5-10 minutes)
- Build the application image
- Start all services

- [ ] Command running without errors
- [ ] See logs streaming in terminal

### Step 4.3: Wait for Services

Watch the terminal for these messages:
```
careflow_mongo | Waiting for connections on port 27017
careflow_redis | Ready to accept connections
careflow_app | CareFlow API listening on port 3000
careflow_worker | Email worker started
```

- [ ] MongoDB ready
- [ ] Redis ready
- [ ] API server started
- [ ] Worker started

**Tip:** Keep this terminal open to see live logs!

---

## ✅ Phase 5: Verify Installation

### Step 5.1: Check API Health

**Option A - Browser:**
- [ ] Open browser
- [ ] Go to: http://localhost:3000/api/v1/health
- [ ] Should see JSON response with status "OK"

**Option B - Command Line:**
```bash
# Open a NEW terminal window
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-12T...",
  "uptime": 5.123,
  "environment": "development",
  "version": "1.0.0"
}
```

- [ ] API responding correctly

### Step 5.2: Check Readiness Endpoint

```bash
curl http://localhost:3000/api/v1/ready
```

Expected response:
```json
{
  "status": "ready",
  "checks": {
    "database": "connected",
    "redis": "connected"
  }
}
```

- [ ] Database connected
- [ ] Redis connected

### Step 5.3: Check MailDev UI

- [ ] Open browser to: http://localhost:1080
- [ ] Should see MailDev interface (empty inbox is normal)

### Step 5.4: Check All Services

In a new terminal:

```bash
docker-compose ps
```

Should show:
```
NAME                 STATUS         PORTS
careflow_app         Up             0.0.0.0:3000->3000/tcp
careflow_worker      Up
careflow_mongo       Up             0.0.0.0:27017->27017/tcp
careflow_redis       Up             0.0.0.0:6379->6379/tcp
careflow_maildev     Up             0.0.0.0:1025->1025/tcp, 0.0.0.0:1080->1080/tcp
```

- [ ] All services showing "Up"

---

## ✅ Phase 6: Test the API

### Step 6.1: Register a Test User

Create a file `test-register.json`:
```json
{
  "email": "doctor@careflow.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "doctor"
}
```

Send request:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d @test-register.json
```

- [ ] Received 201 Created response
- [ ] Response includes access token
- [ ] Check MailDev (http://localhost:1080) for welcome email

### Step 6.2: Login

Create `test-login.json`:
```json
{
  "email": "doctor@careflow.com",
  "password": "SecurePass123!"
}
```

Send request:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d @test-login.json
```

- [ ] Received 200 OK response
- [ ] Response includes accessToken and refreshToken

---

## ✅ Phase 7: Development Workflow

### Step 7.1: View Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f app
docker-compose logs -f worker
```

- [ ] Can view logs in real-time

### Step 7.2: Stop Services

**Option 1 - Keep data (recommended):**
```bash
docker-compose down
```

**Option 2 - Clean everything (removes database):**
```bash
docker-compose down -v
```

- [ ] Services stopped successfully

### Step 7.3: Restart Services

```bash
docker-compose up -d
```

**Note:** `-d` runs in detached mode (background)

- [ ] Services restarted
- [ ] Can still access API

---

## ✅ Phase 8: Run Tests

### Step 8.1: Run All Tests

```bash
npm test
```

- [ ] Tests running
- [ ] All tests passing (or check failures)

### Step 8.2: Run Specific Tests

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage report
npm run test:coverage
```

- [ ] Tests executed successfully

### Step 8.3: Check Code Quality

```bash
# Check for linting issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

- [ ] No linting errors

---

## ✅ Phase 9: Explore the Project

### Step 9.1: Project Structure
- [ ] Read `PROJECT_STRUCTURE.md` for architecture overview
- [ ] Explore `src/` folder structure
- [ ] Check `src/models/` for data schemas
- [ ] Review `src/routes/` for API endpoints

### Step 9.2: Documentation
- [ ] Read `README.md` for full documentation
- [ ] Check `CONTRIBUTING.md` if you plan to contribute
- [ ] Review `.env.example` for all configuration options

### Step 9.3: Database Exploration

**MongoDB Shell:**
```bash
docker-compose exec mongo mongosh
```

Then in mongo shell:
```javascript
use careflow
db.users.find().pretty()
```

- [ ] Can access MongoDB
- [ ] See registered users

**Redis CLI:**
```bash
docker-compose exec redis redis-cli
```

Then in redis:
```
KEYS *
```

- [ ] Can access Redis

---

## SUCCESS! Setup Complete!

### You should now have:

✅ Node.js 18+ installed  
✅ Docker Desktop running  
✅ Project cloned and configured  
✅ All services running (API, Worker, MongoDB, Redis, MailDev)  
✅ API responding at http://localhost:3000  
✅ MailDev UI at http://localhost:1080  
✅ Tests passing  
✅ User registered and logged in  

### Your Development Environment:

| What             | Where                               |
|------------------|-------------------------------------|
| **API Endpoint** | http://localhost:3000/api           |
| **Health Check** | http://localhost:3000/api/v1/health |
| **Email UI**     | http://localhost:1080               |
| **MongoDB**      | mongodb://localhost:27017           |
| **Redis**        | redis://localhost:6379              |
| **Code**         | `CareFlow/backend/src/`             |
| **Tests**        | `CareFlow/backend/src/tests/`       |
| **Logs**         | `docker-compose logs -f`            |

### Next Steps:

1. **Start coding!** Make changes to `src/` files
2. **Hot reload** is enabled - changes apply automatically
3. **Write tests** for new features
4. **Check documentation** for API endpoints
5. **Commit your code** following conventional commits

### Quick Commands Reference:

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f app

# Run tests
npm test

# Check code
npm run lint

# Access database
docker-compose exec mongo mongosh
```

---

## Troubleshooting

If something went wrong, check these common issues:

### Docker won't start
- [ ] Docker Desktop is running
- [ ] No port conflicts (3000, 27017, 6379, 1080, 1025)
- [ ] Try: `docker-compose down -v` then `docker-compose up`

### API not responding
- [ ] Check logs: `docker-compose logs app`
- [ ] Verify .env file exists and has correct settings
- [ ] Try: `docker-compose restart app`

### Database connection failed
- [ ] Check MongoDB: `docker-compose logs mongo`
- [ ] Try: `docker-compose restart mongo`
- [ ] Verify MONGO_URI in .env

### Tests failing
- [ ] Ensure services are running
- [ ] Check .env.test settings
- [ ] Review test logs for specific errors

### Need help?
- Check `SETUP_GUIDE.md` for detailed instructions
- Review logs: `docker-compose logs -f`
- Create an issue on GitHub with logs and error messages

---

Save this checklist for future reference when setting up on a new machine.
