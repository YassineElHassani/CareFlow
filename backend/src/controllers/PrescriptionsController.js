const PrescriptionService = require('../services/PrescriptionService');
const ApiError = require('../utils/ApiError');

class PrescriptionsController {
  async createPrescription(req, res, next) {
    try {
      const prescription = await PrescriptionService.createPrescription(
        req.body,
        req.user._id,
      );

      res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPrescriptionById(req, res, next) {
    try {
      const prescription = await PrescriptionService.getPrescriptionById(req.params.id);

      res.status(200).json({
        success: true,
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPrescriptions(req, res, next) {
    try {
      const filters = {
        patient: req.query.patient,
        doctor: req.query.doctor,
        pharmacy: req.query.pharmacy,
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || '-createdAt',
      };

      const result = await PrescriptionService.getAllPrescriptions(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePrescription(req, res, next) {
    try {
      const prescription = await PrescriptionService.updatePrescription(
        req.params.id,
        req.body,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Prescription updated successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async signPrescription(req, res, next) {
    try {
      const prescription = await PrescriptionService.signPrescription(
        req.params.id,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Prescription signed successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendToPharmacy(req, res, next) {
    try {
      const { pharmacyId } = req.body;

      if (!pharmacyId) {
        throw new ApiError(400, 'Pharmacy ID is required');
      }

      const prescription = await PrescriptionService.sendToPharmacy(
        req.params.id,
        pharmacyId,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Prescription sent to pharmacy successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelPrescription(req, res, next) {
    try {
      const { reason } = req.body;

      if (!reason) {
        throw new ApiError(400, 'Cancellation reason is required');
      }

      const prescription = await PrescriptionService.cancelPrescription(
        req.params.id,
        reason,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Prescription cancelled successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async renewPrescription(req, res, next) {
    try {
      const prescription = await PrescriptionService.renewPrescription(
        req.params.id,
        req.user._id,
      );

      res.status(201).json({
        success: true,
        message: 'Prescription renewed successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPatientPrescriptions(req, res, next) {
    try {
      // If patient, can only view own prescriptions
      if (req.user.role === 'patient' && req.user._id.toString() !== req.params.patientId) {
        throw new ApiError(403, 'You can only view your own prescriptions');
      }

      const filters = {
        patient: req.params.patientId,
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || '-createdAt',
      };

      const result = await PrescriptionService.getAllPrescriptions(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get prescriptions created by a doctor
   * GET /api/v1/prescriptions/doctor/:doctorId
   */
  async getDoctorPrescriptions(req, res, next) {
    try {
      // If doctor, can only view own prescriptions
      if (req.user.role === 'doctor' && req.user._id.toString() !== req.params.doctorId) {
        throw new ApiError(403, 'You can only view your own prescriptions');
      }

      const filters = {
        doctor: req.params.doctorId,
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || '-createdAt',
      };

      const result = await PrescriptionService.getAllPrescriptions(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrescriptionsController();
