const express = require('express');
const router = express.Router();
const PharmacyController = require('../../controllers/PharmacyController');
const { authenticate, authorize } = require('../../middlewares/AuthMiddleware');

/**
 * @swagger
 * tags:
 *   name: Pharmacies
 *   description: Pharmacy management and prescription dispensing endpoints
 */

/**
 * @swagger
 * /api/v1/pharmacies:
 *   post:
 *     summary: Create a new pharmacy (admin only)
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - licenseNumber
 *               - contact
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *     responses:
 *       201:
 *         description: Pharmacy created successfully
 */
router.post('/', authenticate, authorize(['admin']), PharmacyController.createPharmacy);

/**
 * @swagger
 * /api/v1/pharmacies:
 *   get:
 *     summary: Get all pharmacies (public)
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: is24Hours
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
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
 *         description: List of pharmacies
 */
router.get('/', PharmacyController.getAllPharmacies);

/**
 * @swagger
 * /api/v1/pharmacies/{id}:
 *   get:
 *     summary: Get pharmacy by ID
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pharmacy details
 *       404:
 *         description: Pharmacy not found
 */
router.get('/:id', PharmacyController.getPharmacyById);

/**
 * @swagger
 * /api/v1/pharmacies/{id}:
 *   put:
 *     summary: Update pharmacy (admin only)
 *     tags: [Pharmacies]
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
 *         description: Pharmacy updated successfully
 */
router.put('/:id', authenticate, authorize(['admin']), PharmacyController.updatePharmacy);

/**
 * @swagger
 * /api/v1/pharmacies/{id}:
 *   delete:
 *     summary: Delete pharmacy (admin only)
 *     tags: [Pharmacies]
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
 *         description: Pharmacy deleted successfully
 *       400:
 *         description: Cannot delete pharmacy with active prescriptions
 */
router.delete('/:id', authenticate, authorize(['admin']), PharmacyController.deletePharmacy);

/**
 * @swagger
 * /api/v1/pharmacies/{id}/prescriptions:
 *   get:
 *     summary: Get prescriptions for pharmacy (pharmacist view)
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
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
 *         description: Pharmacy prescriptions
 */
router.get('/:id/prescriptions', authenticate, authorize(['admin', 'pharmacist']), PharmacyController.getPharmacyPrescriptions);

/**
 * @swagger
 * /api/v1/pharmacies/prescriptions/{prescriptionId}/dispense:
 *   post:
 *     summary: Dispense medication (pharmacist only)
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
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
 *               - medicationIndex
 *               - dispensedQuantity
 *             properties:
 *               medicationIndex:
 *                 type: number
 *               dispensedQuantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Medication dispensed successfully
 */
router.post('/prescriptions/:prescriptionId/dispense', authenticate, authorize(['pharmacist']), PharmacyController.dispenseMedication);

/**
 * @swagger
 * /api/v1/pharmacies/prescriptions/{prescriptionId}/mark-unavailable:
 *   post:
 *     summary: Mark medication as unavailable (pharmacist only)
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prescriptionId
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
 *               - medicationIndex
 *               - reason
 *             properties:
 *               medicationIndex:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medication marked as unavailable
 */
router.post('/prescriptions/:prescriptionId/mark-unavailable', authenticate, authorize(['pharmacist']), PharmacyController.markMedicationUnavailable);

module.exports = router;
