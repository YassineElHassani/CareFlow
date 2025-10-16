const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const redis = require('../config/redis');

// Import v1 routes
const userRoutes = require('./v1/UserRoutes');
const patientRoutes = require('./v1/PatientRoutes');
const appointmentRoutes = require('./v1/AppointmentRoutes');
const doctorRoutes = require('./v1/DoctorRoutes');

// Mount routes with prefixes
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctors', doctorRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint (liveness)
 *     description: Simple endpoint to check if the API service is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: CareFlow API is running
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// Health check (simple liveness check)
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'CareFlow API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /ready:
 *   get:
 *     summary: Readiness check endpoint
 *     description: Checks if the API and all dependencies (MongoDB, Redis) are ready to serve traffic
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ready
 *                 checks:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: connected
 *                     redis:
 *                       type: string
 *                       example: connected
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Service is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: not ready
 *                 checks:
 *                   type: object
 *                 error:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
// Readiness check (checks dependencies: DB + Redis)
router.get('/ready', async (req, res) => {
  try {
    const checks = {
      database: 'disconnected',
      redis: 'disconnected',
    };

    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      checks.database = 'connected';
    }

    // Check Redis connection
    try {
      await redis.ping();
      checks.redis = 'connected';
    } catch (error) {
      checks.redis = 'disconnected';
    }

    const allHealthy = checks.database === 'connected' && checks.redis === 'connected';

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'ready' : 'not ready',
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information endpoint
 *     description: Returns API welcome message and available endpoints
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to CareFlow API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       example: /api/v1/health
 *                     ready:
 *                       type: string
 *                       example: /api/v1/ready
 *                     users:
 *                       type: string
 *                       example: /api/v1/users
 *                     patients:
 *                       type: string
 *                       example: /api/v1/patients
 *                     appointments:
 *                       type: string
 *                       example: /api/v1/appointments
 *                     doctors:
 *                       type: string
 *                       example: /api/v1/doctors
 */
// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CareFlow API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      ready: '/api/v1/ready',
      users: '/api/v1/users',
      patients: '/api/v1/patients',
      appointments: '/api/v1/appointments',
      doctors: '/api/v1/doctors',
    },
  });
});

module.exports = router;
