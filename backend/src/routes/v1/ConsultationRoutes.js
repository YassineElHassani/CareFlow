const express = require('express');
const router = express.Router();
const ConsultationsController = require('../../controllers/ConsultationsController');
const AuthMiddleware = require('../../middlewares/AuthMiddleware');

// All routes require authentication
router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * tags:
 *   name: Consultations
 *   description: Medical consultation management
 */

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Create a new consultation (Doctor only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment
 *               - chiefComplaint
 *             properties:
 *               appointment:
 *                 type: string
 *                 description: Appointment ID
 *               patient:
 *                 type: string
 *                 description: Patient ID (optional, auto-filled from appointment)
 *               doctor:
 *                 type: string
 *                 description: Doctor ID (optional, auto-filled from appointment)
 *               chiefComplaint:
 *                 type: string
 *                 example: Chest pain and shortness of breath
 *               historyOfPresentIllness:
 *                 type: string
 *               vitalSigns:
 *                 type: object
 *     responses:
 *       201:
 *         description: Consultation created successfully
 *       403:
 *         description: Only doctors can create consultations
 */
router.post('/', AuthMiddleware.authorize(['doctor']), ConsultationsController.createConsultation);

/**
 * @swagger
 * /consultations:
 *   get:
 *     summary: Get all consultations with filters
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', AuthMiddleware.authorize(['admin', 'doctor', 'nurse', 'secretary']), ConsultationsController.getAllConsultations);

/**
 * @swagger
 * /consultations/my/consultations:
 *   get:
 *     summary: Get my consultations (as doctor)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my/consultations', AuthMiddleware.authorize(['doctor']), ConsultationsController.getMyConsultations);

/**
 * @swagger
 * /consultations/stats/summary:
 *   get:
 *     summary: Get consultation statistics
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats/summary', AuthMiddleware.authorize(['admin', 'doctor']), ConsultationsController.getConsultationStats);

/**
 * @swagger
 * /consultations/patient/{patientId}:
 *   get:
 *     summary: Get consultations by patient
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/patient/:patientId', AuthMiddleware.authorize(['admin', 'doctor', 'nurse', 'secretary']), ConsultationsController.getConsultationsByPatient);

/**
 * @swagger
 * /consultations/doctor/{doctorId}:
 *   get:
 *     summary: Get consultations by doctor
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/doctor/:doctorId', AuthMiddleware.authorize(['admin', 'doctor', 'secretary']), ConsultationsController.getConsultationsByDoctor);

/**
 * @swagger
 * /consultations/{id}:
 *   get:
 *     summary: Get consultation by ID
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', AuthMiddleware.authorize(['admin', 'doctor', 'nurse', 'secretary']), ConsultationsController.getConsultationById);

/**
 * @swagger
 * /consultations/{id}:
 *   put:
 *     summary: Update consultation (Doctor only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', AuthMiddleware.authorize(['doctor']), ConsultationsController.updateConsultation);

/**
 * @swagger
 * /consultations/{id}/vital-signs:
 *   post:
 *     summary: Add vital signs to consultation (Doctor or Nurse)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     description: Nurses can assist with recording vital signs, but cannot create consultations
 */
router.post('/:id/vital-signs', AuthMiddleware.authorize(['doctor', 'nurse']), ConsultationsController.addVitalSigns);

/**
 * @swagger
 * /consultations/{id}/diagnoses:
 *   post:
 *     summary: Add diagnosis to consultation (Doctor only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/diagnoses', AuthMiddleware.authorize(['doctor']), ConsultationsController.addDiagnosis);

/**
 * @swagger
 * /consultations/{id}/procedures:
 *   post:
 *     summary: Add procedure to consultation (Doctor only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/procedures', AuthMiddleware.authorize(['doctor']), ConsultationsController.addProcedure);

/**
 * @swagger
 * /consultations/{id}/complete:
 *   patch:
 *     summary: Mark consultation as completed (Doctor only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/complete', AuthMiddleware.authorize(['doctor']), ConsultationsController.completeConsultation);

/**
 * @swagger
 * /consultations/{id}:
 *   delete:
 *     summary: Delete consultation (Admin or owning doctor only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', AuthMiddleware.authorize(['admin', 'doctor']), ConsultationsController.deleteConsultation);

module.exports = router;
