# CareFlow EHR - Project Structure

Detailed explanation of the project architecture and folder structure.

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Project Overview](./PROJECT_OVERVIEW.md)** - Architecture details
- **[Database Design](./DATABASE_DESIGN.md)** - Schema and models
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Test endpoints

---

## Architecture Overview

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────────────────────────┐
│         Express.js API              │
│  ┌────────────────────────────┐     │
│  │    Middlewares Layer       │     │
│  │  - Auth, Validation, etc.  │     │
│  └────────┬───────────────────┘     │
│           ▼                         │
│  ┌────────────────────────────┐     │
│  │    Controllers Layer       │     │
│  │  - Request/Response Logic  │     │
│  └────────┬───────────────────┘     │
│           ▼                         │
│  ┌────────────────────────────┐     │
│  │    Services Layer          │     │
│  │  - Business Logic          │     │
│  └────┬───────────────┬───────┘     │
│       │               │             │
│       ▼               ▼             │
│  ┌───────────┐  ┌─────────┐         │
│  │ MongoDB   │  │  Redis  │         │
│  │(Mongoose) │  │ (Queue) │         │
│  └───────────┘  └────┬────┘         │
│                      │              │
└──────────────────────┼──────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Email Worker  │
              │   (BullMQ)     │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │  Email Server  │
              │  (Nodemailer)  │
              └────────────────┘
```

## Directory Structure

```
backend/
│
├── src/                         # Source code
│   │
│   ├── config/                  # Configuration files
│   │   ├── database.js          # MongoDB connection setup
│   │   ├── redis.js             # Redis client configuration
│   │   └── logger.js            # Winston logger configuration
│   │
│   ├── controllers/             # Request handlers (HTTP layer)
│   │   ├── AuthController.js    # Authentication endpoints
│   │   ├── UsersController.js   # User management endpoints
│   │   ├── PatientsController.js # Patient management endpoints (13 methods)
│   │   ├── AppointmentsController.js # Appointment endpoints (10 methods)
│   │   ├── DoctorsController.js  # Doctor management endpoints (5 methods)
│   │   └── [RECOMMENDED] AdminController.js # Admin-only operations (future)
│   │
│   ├── models/                  # Database schemas (Data layer)
│   │   ├── UserModel.js         # User schema & methods
│   │   ├── PatientModel.js      # Patient schema & methods
│   │   ├── AppointmentModel.js  # Appointment schema & methods
│   │   ├── MedicalRecordModel.js # Medical records
│   │   └── AuditLogModel.js     # Audit trail
│   │
│   ├── services/                # Business logic (Service layer)
│   │   ├── AuthService.js       # Auth logic, token generation
│   │   ├── UserService.js       # User operations
│   │   ├── PatientService.js    # Patient CRUD & medical history (12 methods)
│   │   └── AppointmentService.js # Appointment logic, conflict checking
│   │
│   ├── middlewares/             # Express middlewares
│   │   ├── AuthMiddleware.js    # JWT verification, role checking
│   │   ├── ValidateMiddleware.js # Request validation (Joi)
│   │   └── ErrorMiddleware.js   # Centralized error handling
│   │
│   ├── routes/                  # API routes definition
│   │   └── v1/
│   │       ├── Routes.js        # Main routes aggregator
│   │       └── HealthRoutes.js  # Health check routes
│   │
│   ├── queues/                  # Background job processing
│   │   ├── EmailQueue.js        # Email queue setup (BullMQ)
│   │   └── WorkerEmail.js       # Email worker process
│   │
│   ├── utils/                   # Utility functions
│   │   ├── jwt.js               # JWT helpers
│   │   └── DateHelpers.js       # Date formatting utilities
│   │
│   ├── tests/                   # Test files
│   │   ├── unit/                # Unit tests
│   │   │   ├── services/        # Service layer tests
│   │   │   ├── models/          # Model validation tests
│   │   │   └── utils/           # Utility function tests
│   │   └── integration/         # Integration tests
│   │       ├── auth.test.js     # Auth endpoints tests
│   │       ├── users.test.js    # User endpoints tests
│   │       ├── patients.test.js # Patient endpoints tests
│   │       └── appointments.test.js # Appointment tests
│   │
│   ├── app.js                   # Express app configuration
│   └── index.js                 # Application entry point
│
├── scripts/                     # Utility scripts
│   ├── setup.sh                 # Initial setup script
│   └── start-worker.sh          # Worker startup script
│
├── logs/                        # Application logs (gitignored)
│
├── .env.example                 # Environment variables template
├── .env                         # Environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── .eslintrc.js                 # ESLint configuration
├── docker-compose.yml           # Docker services definition
├── Dockerfile                   # Docker image definition
├── Makefile                     # Common tasks shortcuts
├── package.json                 # NPM dependencies & scripts
├── README.md                    # Main documentation
├── SETUP_GUIDE.md               # Detailed setup instructions
├── QUICKSTART.md                # Quick start guide
└── PROJECT_STRUCTURE.md         # This file
```

## Layer Responsibilities

### 1. Routes Layer (`routes/`)
**Purpose:** Define API endpoints and map them to controllers

**Responsibilities:**
- Define URL patterns
- Group related endpoints
- Apply route-specific middlewares

**Example:**
```javascript
router.post('/auth/register', validate(registerSchema), AuthController.register);
router.get('/users/:id', authenticate, UsersController.getById);
```

### 2. Controllers Layer (`controllers/`)
**Purpose:** Handle HTTP requests and responses

**Responsibilities:**
- Extract data from requests (body, params, query)
- Call appropriate service methods
- Format and send responses
- Handle HTTP status codes

**Example:**
```javascript
async register(req, res) {
  const userData = req.body;
  const result = await AuthService.register(userData);
  res.status(201).json(result);
}
```

### 3. Services Layer (`services/`)
**Purpose:** Implement business logic

**Responsibilities:**
- Core application logic
- Data validation and transformation
- Interaction with models
- Transaction management
- External service calls

**Example:**
```javascript
async checkAppointmentConflict(practitionerId, dateTime, duration) {
  // Business logic to check for conflicts
  const existingAppointments = await Appointment.find({...});
  return hasConflict;
}
```

### 4. Models Layer (`models/`)
**Purpose:** Define data structure and database interactions

**Responsibilities:**
- Mongoose schemas
- Data validation rules
- Instance and static methods
- Pre/post hooks
- Virtuals and indexes

**Example:**
```javascript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'doctor', 'nurse', 'patient'] }
});
```

### 5. Middlewares Layer (`middlewares/`)
**Purpose:** Process requests before reaching controllers

**Responsibilities:**
- Authentication verification
- Authorization (role-based access)
- Request validation
- Error handling
- Logging

**Example:**
```javascript
async authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
}
```

## Authentication Flow

```
1. User Registration
   ┌──────────┐
   │  Client  │
   └────┬─────┘
        │ POST /api/v1/users/register
        ▼
   ┌──────────────────┐
   │  Validation MW   │ → Validate input (Joi)
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │ AuthController   │ → Extract request data
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │  AuthService     │ → Hash password, create user
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │  UserModel       │ → Save to database
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │  EmailQueue      │ → Queue welcome email
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │  Response        │ → Return JWT tokens
   └──────────────────┘

2. Protected Route Access
   ┌──────────┐
   │  Client  │
   └────┬─────┘
        │ GET /api/v1/users (with JWT token)
        ▼
   ┌──────────────────┐
   │   Auth MW        │ → Verify JWT token
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │  Authorize MW    │ → Check user role
   └────┬─────────────┘
        ▼
   ┌──────────────────┐
   │ UsersController  │ → Process request
   └──────────────────┘
```

## Appointment Conflict Prevention

```
1. Create Appointment Request
   │
   ▼
2. Validate Input
   │
   ▼
3. Check Practitioner Exists
   │
   ▼
4. Calculate Time Range
   │   (start time + duration)
   │
   ▼
5. Query Overlapping Appointments
   │   - Same practitioner
   │   - Time overlap check
   │   - Status: scheduled/in-progress
   │
   ▼
6. Conflict Found? ──YES──> Return 409 Conflict
   │
   NO
   │
   ▼
7. Create Appointment
   │
   ▼
8. Queue Reminder Email
   │
   ▼
9. Return 201 Created
```

## Background Job Processing

```
API Server                    Redis Queue              Worker Process
    │                             │                          │
    │ 1. Create appointment       │                          │
    ├──────────────────────────►  │                          │
    │                             │                          │
    │ 2. Add email job to queue   │                          │
    ├──────────────────────────►  │                          │
    │                             │                          │
    │                             │  3. Poll for jobs        │
    │                             │ ◄────────────────────────┤
    │                             │                          │
    │                             │  4. Get job              │
    │                             ├─────────────────────────►│
    │                             │                          │
    │                             │            5. Process job│
    │                             │            (Send email)  │
    │                             │                          │
    │                             │  6. Mark as complete     │
    │                             │ ◄────────────────────────┤
    │                             │                          │
```

## Testing Strategy

### Unit Tests
**Location:** `src/tests/unit/`

**What to test:**
- Service methods in isolation
- Utility functions
- Validation schemas
- Model methods

**Example:**
```javascript
describe('AppointmentService', () => {
  it('should detect time conflict', async () => {
    const hasConflict = await AppointmentService.checkConflict(...);
    expect(hasConflict).to.be.true;
  });
});
```

### Integration Tests
**Location:** `src/tests/integration/`

**What to test:**
- Complete API flows
- Authentication & authorization
- Database operations
- Error handling

**Example:**
```javascript
describe('POST /api/v1/users/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users/register')
      .send(userData);
    expect(res.status).to.equal(201);
  });
});
```

## Key Dependencies

| Package          | Purpose          | Layer        |
|------------------|------------------|--------------|
| **express**      | Web framework    | Routes       |
| **mongoose**     | MongoDB ODM      | Models       |
| **jsonwebtoken** | JWT auth         | Auth         |
| **bcryptjs**     | Password hashing | Auth         |
| **joi**          | Validation       | Middleware   |
| **bullmq**       | Job queues       | Queue        |
| **ioredis**      | Redis client     | Queue        |
| **winston**      | Logging          | Config       |
| **nodemailer**   | Email sending    | Queue        |
| **helmet**       | Security headers | Middleware   |
| **cors**         | CORS handling    | Middleware   |
| **mocha/chai**   | Testing          | Tests        |

## Request Flow Example

**Creating an Appointment:**

```
1. Client Request
   POST /api/v1/appointments
   Body: { patientId, practitionerId, dateTime, duration }

2. Middleware Stack
   ├─ helmet (security headers)
   ├─ cors (cross-origin)
   ├─ express.json (parse body)
   ├─ morgan (logging)
   ├─ authenticate (verify JWT)
   ├─ authorize(['doctor', 'nurse', 'secretary'])
   └─ validate(appointmentSchema)

3. Controller
   AppointmentsController.create
   ├─ Extract req.body
   └─ Call AppointmentService.create()

4. Service Layer
   AppointmentService.create
   ├─ Validate practitioner exists
   ├─ Validate patient exists
   ├─ Check for conflicts
   ├─ Create appointment
   └─ Queue reminder email

5. Model Layer
   AppointmentModel.save()
   ├─ Validate schema
   ├─ Run pre-save hooks
   └─ Save to MongoDB

6. Queue
   EmailQueue.add('reminder', {...})
   └─ Add job to Redis

7. Response
   res.status(201).json({ appointment })
```

## Security Layers

1. **Helmet** - Security headers
2. **CORS** - Cross-origin protection
3. **JWT** - Authentication
4. **RBAC** - Role-based access control
5. **Input Validation** - Joi schemas
6. **Password Hashing** - bcrypt
7. **Rate Limiting** - (To be implemented)
8. **SQL Injection** - MongoDB safe by default
9. **XSS Protection** - Express XSS sanitization

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: Enum ['admin', 'doctor', 'nurse', 'patient', 'secretary'],
  isActive: Boolean,
  refreshTokens: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: Enum,
  email: String,
  phone: String,
  address: Object,
  insurance: Object,
  allergies: [String],
  medicalHistory: [Object],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: Patient),
  practitioner: ObjectId (ref: User),
  dateTime: Date,
  duration: Number (minutes),
  status: Enum ['scheduled', 'completed', 'canceled', 'no-show'],
  reason: String,
  notes: String,
  reminderSent: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Best Practices

### Implemented Best Practices

1. **Separation of Concerns**: Each layer has a single responsibility
   - Controllers handle HTTP → Services handle business logic → Models handle data
   
2. **DRY Principle**: Reusable services and utilities
   - Centralized Redis config used by EmailQueue and Worker
   - Shared JWT utilities across auth flows

3. **Error Handling**: Centralized error middleware
   - AppError class for operational errors
   - MongoDB/JWT error transformers
   - Separate dev/prod error responses

4. **Validation**: Input validation at multiple levels
   - Mongoose schema validation
   - Joi request validation (middleware)
   - Business logic validation (services)

5. **Security**: Authentication and authorization on all routes
   - JWT access + refresh tokens
   - Role-based access control (RBAC)
   - bcrypt password hashing

6. **Logging**: Comprehensive logging for debugging
   - Winston for application logs
   - Morgan for HTTP request logs
   - Worker logs for background jobs

7. **Testing**: Tested core features
   - Doctor management (list, search, availability)
   - Patient management (CRUD, medical history)
   - Appointment management (create, cancel, conflict detection)
   - Email system (6 emails sent successfully)

8. **Documentation**: Comprehensive documentation
   - 8 markdown files (README, QUICKSTART, SETUP_GUIDE, etc.)
   - API endpoint documentation
   - Architecture diagrams
   - Troubleshooting guides

9. **Environment Variables**: Configuration via .env
   - Separate configs for local and Docker
   - Secure JWT secret generation

10. **Git Practices**: Meaningful commits, .gitignore

### Recommended Improvements

> **⚠️ Create AdminController for Better Organization**
>
> **Current Issue:** Admin operations (delete user, delete appointment) are mixed with regular operations in feature controllers.
>
> **Recommendation:**
> - Create `src/controllers/AdminController.js`
> - Create `src/routes/v1/AdminRoutes.js`  
> - Move admin-only methods: `deleteUser()`, `deleteAppointment()`, `suspendUser()`
> - Use admin namespace: `/api/v1/admin/users/:id`, `/api/v1/admin/appointments/:id`
>
> **Benefits:**
> - Clear separation of concerns
> - Single authorization point (all routes require admin role)
> - Easier to add admin features (statistics, reports, backup)
> - Better API documentation structure
> - Follows industry best practices

---

**Understanding this structure will help you navigate and extend the codebase effectively!**
