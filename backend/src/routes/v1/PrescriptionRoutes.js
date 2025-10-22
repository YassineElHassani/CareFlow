const express = require('express');
const router = express.Router();
const PrescriptionsController = require('../../controllers/PrescriptionsController');
const { authenticate, authorize } = require('../../middlewares/AuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription management endpoints
 */

/**
 * @swagger
 * /api/v1/prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultationId
 *               - medications
 *             properties:
 *               consultationId:
 *                 type: string
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     genericName:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     route:
 *                       type: string
 *                       enum: [oral, IV, IM, SC, topical, inhalation, rectal, vaginal, sublingual, transdermal, ophthalmic, otic]
 *                     frequency:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     refills:
 *                       type: number
 *                     instructions:
 *                       type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize(['doctor']), PrescriptionsController.createPrescription);

/**
 * @swagger
 * /api/v1/prescriptions:
 *   get:
 *     summary: Get all prescriptions with filters
 *     tags: [Prescriptions]
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
 *         name: pharmacy
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, signed, sent, partially-dispensed, dispensed, cancelled, expired]
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
 *         description: List of prescriptions
 */
router.get('/', authenticate, authorize(['admin', 'doctor', 'pharmacist']), PrescriptionsController.getAllPrescriptions);

/**
 * @swagger
 * /api/v1/prescriptions/{id}:
 *   get:
 *     summary: Get prescription by ID
 *     tags: [Prescriptions]
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
 *         description: Prescription details
 *       404:
 *         description: Prescription not found
 */
router.get('/:id', authenticate, PrescriptionsController.getPrescriptionById);

/**
 * @swagger
 * /api/v1/prescriptions/{id}:
 *   put:
 *     summary: Update prescription (only draft status)
 *     tags: [Prescriptions]
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
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *       400:
 *         description: Cannot update non-draft prescription
 */
router.put('/:id', authenticate, authorize(['doctor']), PrescriptionsController.updatePrescription);

/**
 * @swagger
 * /api/v1/prescriptions/{id}/sign:
 *   post:
 *     summary: Sign prescription (doctor only)
 *     tags: [Prescriptions]
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
 *         description: Prescription signed successfully
 *       400:
 *         description: Prescription already signed or invalid status
 */
router.post('/:id/sign', authenticate, authorize(['doctor']), PrescriptionsController.signPrescription);

/**
 * @swagger
 * /api/v1/prescriptions/{id}/send-to-pharmacy:
 *   post:
 *     summary: Send prescription to pharmacy
 *     tags: [Prescriptions]
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
 *               - pharmacyId
 *             properties:
 *               pharmacyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prescription sent to pharmacy successfully
 */
router.post('/:id/send-to-pharmacy', authenticate, authorize(['doctor']), PrescriptionsController.sendToPharmacy);

/**
 * @swagger
 * /api/v1/prescriptions/{id}/cancel:
 *   post:
 *     summary: Cancel prescription
 *     tags: [Prescriptions]
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
 *         description: Prescription cancelled successfully
 */
router.post('/:id/cancel', authenticate, authorize(['doctor']), PrescriptionsController.cancelPrescription);

/**
 * @swagger
 * /api/v1/prescriptions/{id}/renew:
 *   post:
 *     summary: Renew prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Prescription renewed successfully
 */
router.post('/:id/renew', authenticate, authorize(['doctor']), PrescriptionsController.renewPrescription);

/**
 * @swagger
 * /api/v1/prescriptions/patient/{patientId}:
 *   get:
 *     summary: Get prescriptions for a patient
 *     tags: [Prescriptions]
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
 *         description: Patient prescriptions
 */
router.get('/patient/:patientId', authenticate, authorize(['admin', 'doctor', 'patient']), PrescriptionsController.getPatientPrescriptions);

/**
 * @swagger
 * /api/v1/prescriptions/doctor/{doctorId}:
 *   get:
 *     summary: Get prescriptions created by doctor
 *     tags: [Prescriptions]
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
 *         description: Doctor prescriptions
 */
router.get('/doctor/:doctorId', authenticate, authorize(['admin', 'doctor']), PrescriptionsController.getDoctorPrescriptions);

module.exports = router;
