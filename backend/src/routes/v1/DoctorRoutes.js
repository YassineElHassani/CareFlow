const express = require('express');
const router = express.Router();
const DoctorsController = require('../../controllers/DoctorsController');
const { authenticate, authorize } = require('../../middlewares/AuthMiddleware');

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Get list of all active doctors (Public endpoint)
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter by specialization
 *         example: Cardiology
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         description: Bad request
 */
router.get('/', DoctorsController.getDoctors);
/**
 * @swagger
 * /doctors/search:
 *   get:
 *     summary: Search doctors
 *     description: Search doctors by name or specialization (Public endpoint)
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (name or specialization)
 *         example: cardio
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing search query
 */
router.get('/search', DoctorsController.searchDoctors);
/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     description: Get detailed information about a specific doctor (Public endpoint)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor user ID
 *         example: 60d5ec49f1b2c72b8c8e4f1a
 *     responses:
 *       200:
 *         description: Doctor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Doctor not found
 */
router.get('/:id', DoctorsController.getDoctorById);
/**
 * @swagger
 * /doctors/{id}/availability:
 *   get:
 *     summary: Get doctor availability
 *     description: Get available time slots for a specific doctor on a given date (Public endpoint)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor user ID
 *         example: 60d5ec49f1b2c72b8c8e4f1a
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check availability
 *         example: 2025-10-20
 *     responses:
 *       200:
 *         description: Available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctor:
 *                       $ref: '#/components/schemas/User'
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2025-10-20
 *                     availableSlots:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["09:00", "09:30", "10:00", "10:30"]
 *                     totalSlots:
 *                       type: integer
 *                       example: 16
 *       400:
 *         description: Missing date parameter
 *       404:
 *         description: Doctor not found
 */
router.get('/:id/availability', DoctorsController.getDoctorAvailability);
/**
 * @swagger
 * /doctors/{id}/appointments:
 *   get:
 *     summary: Get doctor's appointments
 *     description: Get all appointments for a specific doctor (Admin/Doctor only)
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor user ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, in-progress, completed, cancelled, no-show]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Doctor's appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Doctor not found
 */
router.get('/:id/appointments', authenticate, authorize(['admin', 'doctor']), DoctorsController.getDoctorAppointments);

module.exports = router;
