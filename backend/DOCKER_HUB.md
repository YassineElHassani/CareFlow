# CareFlow Docker Hub Images

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Quick Start](./QUICKSTART.md)** - Fast setup
- **[Setup Summary](./SETUP_SUMMARY.md)** - Environment configuration
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - Test endpoints
- **[Project Overview](./PROJECT_OVERVIEW.md)** - Architecture

---

## Published Images

The CareFlow application has been published to Docker Hub with Swagger API documentation integrated.

### Available Images

| Image                              | Tag      | Size  | Description                            |
|------------------------------------|----------|-------|----------------------------------------|
| `yassineelhassani/careflow-app`    | `latest` | 396MB | Main API application with Swagger docs |
| `yassineelhassani/careflow-app`    | `v1.0.0` | 396MB | Version 1.0.0 - Stable release         |
| `yassineelhassani/careflow-worker` | `latest` | 396MB | Background worker for email processing |
| `yassineelhassani/careflow-worker` | `v1.0.0` | 396MB | Version 1.0.0 - Stable release         |

### Docker Hub URLs

- **App Image:** https://hub.docker.com/r/yassineelhassani/careflow-app
- **Worker Image:** https://hub.docker.com/r/yassineelhassani/careflow-worker

## Quick Start

### Pull Images

```bash
# Pull latest versions
docker pull yassineelhassani/careflow-app:latest
docker pull yassineelhassani/careflow-worker:latest

# Or pull specific version
docker pull yassineelhassani/careflow-app:v1.0.0
docker pull yassineelhassani/careflow-worker:v1.0.0
```

### Run Containers

#### Option 1: Using Docker Compose (Recommended)

Update your `docker-compose.yml` to use the published images:

```yaml
services:
  app:
    image: yassineelhassani/careflow-app:v1.0.0
    # ... rest of configuration

  worker:
    image: yassineelhassani/careflow-worker:v1.0.0
    # ... rest of configuration
```

Then run:
```bash
docker compose up -d
```

#### Option 2: Run Manually

```bash
# Start MongoDB
docker run -d --name careflow_mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=careflow \
  mongo:6.0

# Start Redis
docker run -d --name careflow_redis \
  -p 6379:6379 \
  redis:7-alpine

# Start MailDev (email testing)
docker run -d --name careflow_maildev \
  -p 1080:1080 -p 1025:1025 \
  maildev/maildev

# Start App
docker run -d --name careflow_app \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e MONGODB_URI=mongodb://careflow_mongo:27017/careflow \
  -e REDIS_HOST=careflow_redis \
  --link careflow_mongo \
  --link careflow_redis \
  yassineelhassani/careflow-app:v1.0.0

# Start Worker
docker run -d --name careflow_worker \
  -e NODE_ENV=development \
  -e MONGODB_URI=mongodb://careflow_mongo:27017/careflow \
  -e REDIS_HOST=careflow_redis \
  --link careflow_mongo \
  --link careflow_redis \
  yassineelhassani/careflow-worker:v1.0.0
```

## What's Included

### v1.0.0 Features

✅ **Complete EHR System**
- User authentication & authorization (JWT)
- Patient management with auto-generated numbers (P-2025-XXXXX)
- Doctor profiles and availability
- Appointment scheduling with conflict detection
- Medical records management

✅ **Swagger API Documentation**
- Interactive API documentation at `/api-docs`
- 39 fully documented endpoints
- Request/response schemas with examples
- Authentication testing built-in
- OpenAPI 3.0 specification

✅ **Background Processing**
- Email worker using BullMQ and Redis
- Welcome emails
- Appointment confirmations and reminders
- Cancellation notifications

✅ **Health Monitoring**
- Liveness check: `/api/v1/health`
- Readiness check: `/api/v1/ready` (MongoDB + Redis)
- Docker health checks configured

✅ **Production Ready**
- Error handling middleware
- Request logging (Morgan)
- Security headers (Helmet)
- CORS enabled
- Environment-based configuration

## Environment Variables

### Required Variables

```bash
# Node Environment
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://mongo:27017/careflow

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Secrets
JWT_ACCESS_SECRET=your-access-token-secret-key-here
JWT_REFRESH_SECRET=your-refresh-token-secret-key-here

# Email (SMTP)
SMTP_HOST=maildev
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=CareFlow <noreply@careflow.com>
```

### Optional Variables

```bash
# Port (default: 3000)
PORT=3000

# JWT Expiration
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

## Endpoints Overview

### Health Endpoints
- `GET /api/v1/health` - Liveness check
- `GET /api/v1/ready` - Readiness check
- `GET /api/v1/` - API information

### Documentation
- `GET /api-docs` - Swagger UI
- `GET /api-docs.json` - OpenAPI JSON spec

### Authentication (6 endpoints)
- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `POST /api/v1/users/refresh-token`
- `POST /api/v1/users/logout`
- `POST /api/v1/users/forgot-password`
- `POST /api/v1/users/reset-password`

### Users (9 endpoints)
- Profile management
- Admin user management
- Suspend/reactivate accounts

### Doctors (5 endpoints)
- List and search doctors
- Check availability
- View appointments

### Patients (13 endpoints)
- CRUD operations
- Medical history
- Allergies, medications, conditions

### Appointments (10 endpoints)
- Schedule and manage appointments
- Conflict detection
- Status updates
- Cancellations

## Version History

### v1.0.0 (October 19, 2025)
- ✅ Initial stable release
- ✅ Complete EHR functionality
- ✅ Swagger API documentation integrated
- ✅ All 39 endpoints documented
- ✅ Email worker with 6 email types
- ✅ Health monitoring endpoints
- ✅ Production-ready setup

## Updating Images

### For Maintainers

```bash
# Build new images
docker compose build

# Tag with new version
docker tag backend-app:latest yassineelhassani/careflow-app:v1.0.1
docker tag backend-worker:latest yassineelhassani/careflow-worker:v1.0.1

# Update latest tags
docker tag backend-app:latest yassineelhassani/careflow-app:latest
docker tag backend-worker:latest yassineelhassani/careflow-worker:latest

# Push to Docker Hub
docker push yassineelhassani/careflow-app:v1.0.1
docker push yassineelhassani/careflow-app:latest
docker push yassineelhassani/careflow-worker:v1.0.1
docker push yassineelhassani/careflow-worker:latest
```

## Documentation Links

- **Swagger UI:** http://localhost:3000/api-docs (when running)
- **Project README:** [README.md](./README.md)
- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Swagger Documentation:** [SWAGGER_DOCUMENTATION.md](./SWAGGER_DOCUMENTATION.md)
- **Postman Guide:** [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)

## Contributing

To contribute to the Docker images:

1. Make changes to the application
2. Test locally with `docker compose up`
3. Build new images with `docker compose build`
4. Tag with appropriate version
5. Push to Docker Hub
6. Update this documentation

## Notes

- Images are based on `node:18-alpine` for minimal size
- Development mode includes nodemon for auto-reload
- Health checks ensure container readiness
- Both images share the same codebase but run different entry points
- Worker runs `npm run worker` (BullMQ processor)
- App runs `npm run dev` (Express API server)

## Support

For issues or questions:
- Check the logs: `docker logs careflow_app`
- Verify health: `curl http://localhost:3000/api/v1/health`
- Check readiness: `curl http://localhost:3000/api/v1/ready`
- View Swagger docs: http://localhost:3000/api-docs

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Maintainer:** Yassine El Hassani
