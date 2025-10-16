const express = require('express');
const router = express.Router();
const PatientsController = require('../../controllers/PatientsController');
const { authenticate, authorize } = require('../../middlewares/AuthMiddleware');

const staffRoles = ['admin', 'doctor', 'nurse', 'secretary'];
const medicalStaffRoles = ['admin', 'doctor', 'nurse'];

/**
 * @swagger
 * /patients/me:
 *   get:
 *     summary: Get my patient record
 *     description: Get current patient user's patient record (Patient only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient record not found
 *       401:
 *         description: Unauthorized
 */
router.get('/me',authenticate, authorize(['patient']), PatientsController.getMyPatientRecord);
/**
 * @swagger
 * /patients/stats:
 *   get:
 *     summary: Get patient statistics
 *     description: Get patient statistics and analytics (Admin only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                     totalPatients:
 *                       type: integer
 *                       example: 150
 *                     activePatients:
 *                       type: integer
 *                       example: 120
 *                     newThisMonth:
 *                       type: integer
 *                       example: 15
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', authenticate, authorize(['admin']), PatientsController.getPatientStats);
/**
 * @swagger
 * /patients/search/{searchTerm}:
 *   get:
 *     summary: Search patients
 *     description: Search patients by name, patient number, or national ID (Staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (name, patient number, or national ID)
 *         example: Ahmed
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
 *                     $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/search/:searchTerm', authenticate, authorize(staffRoles), PatientsController.searchPatients);
/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create new patient
 *     description: Register a new patient in the system (Staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personalInfo
 *               - contact
 *             properties:
 *               personalInfo:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                   - dateOfBirth
 *                   - gender
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: Ahmed
 *                   lastName:
 *                     type: string
 *                     example: Hassan
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: 1990-05-15
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                     example: male
 *                   nationalId:
 *                     type: string
 *                     example: AB123456
 *                   bloodType:
 *                     type: string
 *                     enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *                     example: O+
 *               contact:
 *                 type: object
 *                 required:
 *                   - phone
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: +1234567890
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: patient@example.com
 *                   address:
 *                     type: object
 *               medicalInfo:
 *                 type: object
 *                 properties:
 *                   allergies:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [Penicillin]
 *                   chronicConditions:
 *                     type: array
 *                     items:
 *                       type: string
 *                   currentMedications:
 *                     type: array
 *                     items:
 *                       type: string
 *               insuranceInfo:
 *                 type: object
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize(staffRoles), PatientsController.createPatient);
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve list of all patients with pagination (Staff only)
 *     tags: [Patients]
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
 *         name: bloodType
 *         schema:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *         description: Filter by blood type
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Filter by gender
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
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
 *                     $ref: '#/components/schemas/Patient'
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
 *         description: Forbidden
 */
router.get('/', authenticate, authorize(staffRoles), PatientsController.getPatients);
/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     description: Get detailed information about a specific patient (Staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *         example: 60d5ec49f1b2c72b8c8e4f1b
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', authenticate, authorize(staffRoles), PatientsController.getPatientById);
/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient
 *     description: Update patient information (Staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personalInfo:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   bloodType:
 *                     type: string
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               medicalInfo:
 *                 type: object
 *               insuranceInfo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticate, authorize(staffRoles), PatientsController.updatePatient);
/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     description: Permanently delete a patient record (Admin only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/:id', authenticate, authorize(['admin']), PatientsController.deletePatient);
/**
 * @swagger
 * /patients/{id}/medical-history:
 *   get:
 *     summary: Get patient medical history
 *     description: Get complete medical history for a patient (Medical staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Medical history retrieved successfully
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
 *                     patient:
 *                       $ref: '#/components/schemas/Patient'
 *                     medicalRecords:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Medical staff access required
 */
router.get('/:id/medical-history', authenticate, authorize(medicalStaffRoles), PatientsController.getPatientMedicalHistory);
/**
 * @swagger
 * /patients/{id}/allergies:
 *   post:
 *     summary: Add allergy to patient
 *     description: Add a new allergy to patient's medical information (Medical staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allergy
 *             properties:
 *               allergy:
 *                 type: string
 *                 example: Penicillin
 *     responses:
 *       200:
 *         description: Allergy added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:id/allergies', authenticate, authorize(medicalStaffRoles), PatientsController.addAllergy);
/**
 * @swagger
 * /patients/{id}/medications:
 *   post:
 *     summary: Add medication to patient
 *     description: Add current medication to patient's medical information (Medical staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medication
 *             properties:
 *               medication:
 *                 type: string
 *                 example: Metformin 500mg
 *     responses:
 *       200:
 *         description: Medication added successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:id/medications', authenticate, authorize(medicalStaffRoles), PatientsController.addMedication);
/**
 * @swagger
 * /patients/{id}/conditions:
 *   post:
 *     summary: Add chronic condition to patient
 *     description: Add chronic condition to patient's medical information (Medical staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - condition
 *             properties:
 *               condition:
 *                 type: string
 *                 example: Diabetes Type 2
 *     responses:
 *       200:
 *         description: Chronic condition added successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:id/conditions', authenticate, authorize(medicalStaffRoles), PatientsController.addChronicCondition);
/**
 * @swagger
 * /patients/user/{userId}:
 *   get:
 *     summary: Get patient by user ID
 *     description: Get patient record associated with a specific user ID (Staff only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 60d5ec49f1b2c72b8c8e4f1a
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found for this user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/user/:userId', authenticate, authorize(staffRoles), PatientsController.getPatientByUserId);

module.exports = router;
