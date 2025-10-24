const LabOrderService = require('../services/LabOrderService');
const ApiError = require('../utils/ApiError');

class LabOrdersController {
  /**
   * Create lab order (doctor only)
   * POST /api/v1/lab-orders
   */
  async createLabOrder(req, res, next) {
    try {
      const labOrder = await LabOrderService.createLabOrder(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Lab order created successfully',
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab order by ID
   * GET /api/v1/lab-orders/:id
   */
  async getLabOrderById(req, res, next) {
    try {
      const labOrder = await LabOrderService.getLabOrderById(req.params.id);

      res.status(200).json({
        success: true,
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all lab orders (with filters)
   * GET /api/v1/lab-orders
   */
  async getAllLabOrders(req, res, next) {
    try {
      const filters = {
        patient: req.query.patient,
        doctor: req.query.doctor,
        status: req.query.status,
        priority: req.query.priority,
        laboratory: req.query.laboratory,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search,
      };

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || '-createdAt',
      };

      const result = await LabOrderService.getAllLabOrders(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update specimen collection
   * POST /api/v1/lab-orders/:id/specimen-collection
   */
  async updateSpecimenCollection(req, res, next) {
    try {
      const labOrder = await LabOrderService.updateSpecimenCollection(
        req.params.id,
        req.body,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Specimen collection updated successfully',
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload test result (lab technician only)
   * POST /api/v1/lab-orders/:id/tests/:testIndex/result
   */
  async uploadTestResult(req, res, next) {
    try {
      const testIndex = parseInt(req.params.testIndex);

      if (isNaN(testIndex)) {
        throw new ApiError(400, 'Invalid test index');
      }

      const labOrder = await LabOrderService.uploadTestResult(
        req.params.id,
        testIndex,
        req.body,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Test result uploaded successfully',
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update test status
   * PUT /api/v1/lab-orders/:id/tests/:testIndex/status
   */
  async updateTestStatus(req, res, next) {
    try {
      const testIndex = parseInt(req.params.testIndex);

      if (isNaN(testIndex)) {
        throw new ApiError(400, 'Invalid test index');
      }

      const { status } = req.body;

      if (!status) {
        throw new ApiError(400, 'Status is required');
      }

      const labOrder = await LabOrderService.updateTestStatus(
        req.params.id,
        testIndex,
        status,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Test status updated successfully',
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Finalize lab report
   * POST /api/v1/lab-orders/:id/finalize-report
   */
  async finalizeLabReport(req, res, next) {
    try {
      const labOrder = await LabOrderService.finalizeLabReport(
        req.params.id,
        req.body,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Lab report finalized successfully',
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel lab order
   * POST /api/v1/lab-orders/:id/cancel
   */
  async cancelLabOrder(req, res, next) {
    try {
      const { reason } = req.body;

      if (!reason) {
        throw new ApiError(400, 'Cancellation reason is required');
      }

      const labOrder = await LabOrderService.cancelLabOrder(
        req.params.id,
        reason,
        req.user._id,
      );

      res.status(200).json({
        success: true,
        message: 'Lab order cancelled successfully',
        data: labOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab orders for patient
   * GET /api/v1/lab-orders/patient/:patientId
   */
  async getPatientLabOrders(req, res, next) {
    try {
      // If patient, can only view own lab orders
      if (req.user.role === 'patient' && req.user._id.toString() !== req.params.patientId) {
        throw new ApiError(403, 'You can only view your own lab orders');
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

      const result = await LabOrderService.getAllLabOrders(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab orders created by doctor
   * GET /api/v1/lab-orders/doctor/:doctorId
   */
  async getDoctorLabOrders(req, res, next) {
    try {
      // If doctor, can only view own lab orders
      if (req.user.role === 'doctor' && req.user._id.toString() !== req.params.doctorId) {
        throw new ApiError(403, 'You can only view your own lab orders');
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

      const result = await LabOrderService.getAllLabOrders(filters, options);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab technician dashboard
   * GET /api/v1/lab-orders/dashboard/technician
   */
  async getLabTechnicianDashboard(req, res, next) {
    try {
      const filters = {
        laboratory: req.query.laboratory,
        category: req.query.category,
        priority: req.query.priority,
      };

      const result = await LabOrderService.getLabTechnicianDashboard(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LabOrdersController();
