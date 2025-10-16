const express = require('express');
const router = express.Router();
const AppointmentsController = require('../../controllers/AppointmentsController');
const { authenticate, authorize } = require('../../middlewares/AuthMiddleware');

const staffRoles = ['admin', 'doctor', 'nurse', 'secretary'];
const allRoles = ['admin', 'doctor', 'nurse', 'secretary', 'patient'];

/**
 * @swagger
 * /appointments/my-appointments:
 *   get:
 *     summary: Get my appointments
 *     description: Get all appointments for the current patient user (Patient only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, in-progress, completed, cancelled, no-show]
 *         description: Filter by appointment status
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments from this date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments until this date
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
 *         description: Appointments retrieved successfully
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
 *         description: Forbidden - Patient access required
 */
router.get('/my-appointments', authenticate, authorize(['patient']), AppointmentsController.getMyAppointments);
/**
 * @swagger
 * /appointments/my-schedule:
 *   get:
 *     summary: Get my schedule
 *     description: Get all appointments scheduled with the current doctor (Doctor only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date
 *         example: 2025-10-20
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
 *         description: Schedule retrieved successfully
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
 *         description: Forbidden - Doctor access required
 */
router.get('/my-schedule', authenticate, authorize(['doctor']), AppointmentsController.getMySchedule);
/**
 * @swagger
 * /appointments/check-availability:
 *   post:
 *     summary: Check appointment availability
 *     description: Check if a specific time slot is available for booking
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - scheduledDate
 *               - scheduledTime
 *             properties:
 *               doctor:
 *                 type: string
 *                 description: Doctor user ID
 *                 example: 60d5ec49f1b2c72b8c8e4f1a
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-20
 *               scheduledTime:
 *                 type: string
 *                 pattern: ^([01]\d|2[0-3]):([0-5]\d)$
 *                 example: "10:00"
 *               duration:
 *                 type: integer
 *                 default: 30
 *                 example: 30
 *     responses:
 *       200:
 *         description: Availability check result
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
 *                     available:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/check-availability', authenticate, AppointmentsController.checkAvailability);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create new appointment
 *     description: Schedule a new appointment (All authenticated users)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient
 *               - doctor
 *               - scheduledDate
 *               - scheduledTime
 *             properties:
 *               patient:
 *                 type: string
 *                 description: Patient ID
 *                 example: 60d5ec49f1b2c72b8c8e4f1b
 *               doctor:
 *                 type: string
 *                 description: Doctor user ID
 *                 example: 60d5ec49f1b2c72b8c8e4f1a
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-20
 *               scheduledTime:
 *                 type: string
 *                 pattern: ^([01]\d|2[0-3]):([0-5]\d)$
 *                 example: "10:00"
 *               duration:
 *                 type: integer
 *                 default: 30
 *                 example: 30
 *               type:
 *                 type: string
 *                 enum: [consultation, follow-up, emergency, checkup]
 *                 example: consultation
 *               chiefComplaint:
 *                 type: string
 *                 example: Chest pain and shortness of breath
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Conflict - Time slot already booked
 *       401:
 *         description: Unauthorized
 */
// CRUD Routes
router.post('/', authenticate, authorize(allRoles), AppointmentsController.createAppointment);
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Retrieve list of all appointments with filtering options (Staff only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, in-progress, completed, cancelled, no-show]
 *         description: Filter by status
 *       - in: query
 *         name: doctor
 *         schema:
 *           type: string
 *         description: Filter by doctor ID
 *       - in: query
 *         name: patient
 *         schema:
 *           type: string
 *         description: Filter by patient ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [consultation, follow-up, emergency, checkup]
 *         description: Filter by appointment type
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
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
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Staff access required
 */
router.get('/', authenticate, authorize(staffRoles), AppointmentsController.getAppointments);
/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     description: Get detailed information about a specific appointment (All authenticated users)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: 60d5ec49f1b2c72b8c8e4f1c
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, authorize(allRoles), AppointmentsController.getAppointmentById);
/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update appointment
 *     description: Update appointment details (Staff only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-21
 *               scheduledTime:
 *                 type: string
 *                 example: "11:00"
 *               duration:
 *                 type: integer
 *                 example: 30
 *               type:
 *                 type: string
 *                 enum: [consultation, follow-up, emergency, checkup]
 *               chiefComplaint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       400:
 *         description: Validation error
 *       409:
 *         description: Conflict - New time slot already booked
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticate, authorize(staffRoles), AppointmentsController.updateAppointment);
/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     description: Update the status of an appointment (Staff only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, confirmed, in-progress, completed, cancelled, no-show]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/status', authenticate, authorize(staffRoles), AppointmentsController.updateAppointmentStatus);
/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel appointment
 *     description: Cancel an appointment (All authenticated users can cancel their own appointments)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Patient not available
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
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
 *                   example: Appointment cancelled successfully
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       400:
 *         description: Appointment already cancelled or completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to cancel this appointment
 */
router.patch('/:id/cancel', authenticate, authorize(allRoles), AppointmentsController.cancelAppointment);
/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete appointment
 *     description: Permanently delete an appointment (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
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
 *                   example: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/:id', authenticate, authorize(['admin']), AppointmentsController.deleteAppointment);

module.exports = router;
