const PharmacyService = require('../services/PharmacyService');
const ApiError = require('../utils/ApiError');

class PharmacyController {
  async createPharmacy(req, res, next) {
    try {
      const pharmacy = await PharmacyService.createPharmacy(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Pharmacy created successfully',
        data: pharmacy,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPharmacyById(req, res, next) {
    try {
      const pharmacy = await PharmacyService.getPharmacyById(req.params.id);

      res.status(200).json({
        success: true,
        data: pharmacy,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPharmacies(req, res, next) {
    try {
      const filters = {
        city: req.query.city,
        isActive: req.query.isActive === 'true',
        is24Hours: req.query.is24Hours === 'true',
        search: req.query.search,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'name',
      };

      const result = await PharmacyService.getAllPharmacies(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePharmacy(req, res, next) {
    try {
      const pharmacy = await PharmacyService.updatePharmacy(
        req.params.id,
        req.body,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Pharmacy updated successfully',
        data: pharmacy,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePharmacy(req, res, next) {
    try {
      const result = await PharmacyService.deletePharmacy(req.params.id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPharmacyPrescriptions(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || '-sentToPharmacyAt',
      };

      const result = await PharmacyService.getPharmacyPrescriptions(
        req.params.id,
        filters,
        options,
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async dispenseMedication(req, res, next) {
    try {
      const { medicationIndex, dispensedQuantity } = req.body;

      if (typeof medicationIndex !== 'number') {
        throw new ApiError(400, 'Medication index is required');
      }

      if (!dispensedQuantity) {
        throw new ApiError(400, 'Dispensed quantity is required');
      }

      const prescription = await PharmacyService.dispenseMedication(
        req.params.prescriptionId,
        medicationIndex,
        dispensedQuantity,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Medication dispensed successfully',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }

  async markMedicationUnavailable(req, res, next) {
    try {
      const { medicationIndex, reason } = req.body;

      if (typeof medicationIndex !== 'number') {
        throw new ApiError(400, 'Medication index is required');
      }

      if (!reason) {
        throw new ApiError(400, 'Reason is required');
      }

      const prescription = await PharmacyService.markMedicationUnavailable(
        req.params.prescriptionId,
        medicationIndex,
        reason,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Medication marked as unavailable',
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PharmacyController();
