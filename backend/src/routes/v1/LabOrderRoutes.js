const express = require('express');
const router = express.Router();
const LabOrdersController = require('../../controllers/LabOrdersController');
const { authenticate, authorize } = require('../../middlewares/AuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: Lab Orders
 *   description: Laboratory test order and result management endpoints
 */

/**
 * @swagger
 * /api/v1/lab-orders:
 *   post:
 *     summary: Create a new lab order (doctor only)
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tests
 *               - laboratory
 *             properties:
 *               consultationId:
 *                 type: string
 *               patient:
 *                 type: string
 *               tests:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *                     category:
 *                       type: string
 *                       enum: [hematology, biochemistry, microbiology, immunology, serology, urinalysis, pathology, radiology, genetics]
 *                     priority:
 *                       type: string
 *                       enum: [routine, urgent, stat]
 *               laboratory:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *               clinicalInfo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lab order created successfully
 */
router.post('/', authenticate, authorize(['doctor']), LabOrdersController.createLabOrder);

/**
 * @swagger
 * /api/v1/lab-orders:
 *   get:
 *     summary: Get all lab orders with filters
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patient
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctor
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: laboratory
 *         schema:
 *           type: string
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
 *         description: List of lab orders
 */
router.get('/', authenticate, authorize(['admin', 'doctor', 'lab-technician']), LabOrdersController.getAllLabOrders);

/**
 * @swagger
 * /api/v1/lab-orders/{id}:
 *   get:
 *     summary: Get lab order by ID
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab order details
 *       404:
 *         description: Lab order not found
 */
router.get('/:id', authenticate, LabOrdersController.getLabOrderById);

/**
 * @swagger
 * /api/v1/lab-orders/{id}/specimen-collection:
 *   post:
 *     summary: Update specimen collection info
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specimenCollectedAt:
 *                 type: string
 *                 format: date-time
 *               specimenCollectedBy:
 *                 type: string
 *               receivedByLabAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Specimen collection updated successfully
 */
router.post('/:id/specimen-collection', authenticate, authorize(['nurse', 'lab-technician']), LabOrdersController.updateSpecimenCollection);

/**
 * @swagger
 * /api/v1/lab-orders/{id}/tests/{testIndex}/result:
 *   post:
 *     summary: Upload test result (lab technician only)
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: testIndex
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - unit
 *             properties:
 *               value:
 *                 type: string
 *               unit:
 *                 type: string
 *               referenceRange:
 *                 type: string
 *               flag:
 *                 type: string
 *                 enum: [normal, low, high, critical]
 *               interpretation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test result uploaded successfully
 */
router.post('/:id/tests/:testIndex/result', authenticate, authorize(['lab-technician']), LabOrdersController.uploadTestResult);

/**
 * @swagger
 * /api/v1/lab-orders/{id}/tests/{testIndex}/status:
 *   put:
 *     summary: Update test status
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: testIndex
 *         required: true
 *         schema:
 *           type: integer
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
 *                 enum: [ordered, specimen-collected, in-progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Test status updated successfully
 */
router.put('/:id/tests/:testIndex/status', authenticate, authorize(['lab-technician']), LabOrdersController.updateTestStatus);

/**
 * @swagger
 * /api/v1/lab-orders/{id}/finalize-report:
 *   post:
 *     summary: Finalize lab report
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: string
 *               summary:
 *                 type: string
 *               generalComments:
 *                 type: string
 *               pathologistSignature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lab report finalized successfully
 */
router.post('/:id/finalize-report', authenticate, authorize(['lab-technician']), LabOrdersController.finalizeLabReport);

/**
 * @swagger
 * /api/v1/lab-orders/{id}/cancel:
 *   post:
 *     summary: Cancel lab order
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lab order cancelled successfully
 */
router.post('/:id/cancel', authenticate, authorize(['doctor']), LabOrdersController.cancelLabOrder);

/**
 * @swagger
 * /api/v1/lab-orders/patient/{patientId}:
 *   get:
 *     summary: Get lab orders for patient
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient lab orders
 */
router.get('/patient/:patientId',authenticate, authorize(['admin', 'doctor', 'patient']), LabOrdersController.getPatientLabOrders);

/**
 * @swagger
 * /api/v1/lab-orders/doctor/{doctorId}:
 *   get:
 *     summary: Get lab orders created by doctor
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor lab orders
 */
router.get('/doctor/:doctorId', authenticate, authorize(['admin', 'doctor']), LabOrdersController.getDoctorLabOrders);

/**
 * @swagger
 * /api/v1/lab-orders/dashboard/technician:
 *   get:
 *     summary: Get lab technician dashboard
 *     tags: [Lab Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: laboratory
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab technician dashboard data
 */
router.get('/dashboard/technician', authenticate, authorize(['lab-technician']), LabOrdersController.getLabTechnicianDashboard);

module.exports = router;
