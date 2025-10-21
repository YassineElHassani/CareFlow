const ConsultationService = require('../services/ConsultationService');
const logger = require('../config/logger');

class ConsultationsController {
  async createConsultation(req, res, next) {
    try {
      const userId = req.user._id;
      const consultation = await ConsultationService.createConsultation(req.body, userId);

      res.status(201).json({
        status: 'success',
        message: 'Consultation created successfully',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in createConsultation:', error);
      next(error);
    }
  }

  async getAllConsultations(req, res, next) {
    try {
      const filters = {
        patient: req.query.patient,
        doctor: req.query.doctor,
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        search: req.query.search,
      };

      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        sortBy: req.query.sortBy || '-consultationDate',
      };

      const result = await ConsultationService.getAllConsultations(filters, options);

      res.status(200).json({
        status: 'success',
        results: result.consultations.length,
        data: {
          consultations: result.consultations,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      logger.error('Error in getAllConsultations:', error);
      next(error);
    }
  }

  async getConsultationById(req, res, next) {
    try {
      const consultation = await ConsultationService.getConsultationById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in getConsultationById:', error);
      next(error);
    }
  }

  async getConsultationsByPatient(req, res, next) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        sortBy: req.query.sortBy || '-consultationDate',
      };

      const result = await ConsultationService.getConsultationsByPatient(
        req.params.patientId,
        options,
      );

      res.status(200).json({
        status: 'success',
        results: result.consultations.length,
        data: {
          consultations: result.consultations,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      logger.error('Error in getConsultationsByPatient:', error);
      next(error);
    }
  }

  async getConsultationsByDoctor(req, res, next) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        sortBy: req.query.sortBy || '-consultationDate',
      };

      const result = await ConsultationService.getConsultationsByDoctor(
        req.params.doctorId,
        options,
      );

      res.status(200).json({
        status: 'success',
        results: result.consultations.length,
        data: {
          consultations: result.consultations,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      logger.error('Error in getConsultationsByDoctor:', error);
      next(error);
    }
  }

  async getMyConsultations(req, res, next) {
    try {
      const doctorId = req.user._id;

      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        sortBy: req.query.sortBy || '-consultationDate',
      };

      const result = await ConsultationService.getConsultationsByDoctor(
        doctorId,
        options,
      );

      res.status(200).json({
        status: 'success',
        results: result.consultations.length,
        data: {
          consultations: result.consultations,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      logger.error('Error in getMyConsultations:', error);
      next(error);
    }
  }

  async updateConsultation(req, res, next) {
    try {
      const userId = req.user._id;
      const consultation = await ConsultationService.updateConsultation(
        req.params.id,
        req.body,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Consultation updated successfully',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in updateConsultation:', error);
      next(error);
    }
  }

  async addVitalSigns(req, res, next) {
    try {
      const userId = req.user._id;
      const consultation = await ConsultationService.addVitalSigns(
        req.params.id,
        req.body,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Vital signs added successfully',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in addVitalSigns:', error);
      next(error);
    }
  }

  async addDiagnosis(req, res, next) {
    try {
      const userId = req.user._id;
      const consultation = await ConsultationService.addDiagnosis(
        req.params.id,
        req.body,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Diagnosis added successfully',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in addDiagnosis:', error);
      next(error);
    }
  }

  async addProcedure(req, res, next) {
    try {
      const userId = req.user._id;
      const consultation = await ConsultationService.addProcedure(
        req.params.id,
        req.body,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Procedure added successfully',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in addProcedure:', error);
      next(error);
    }
  }

  async completeConsultation(req, res, next) {
    try {
      const userId = req.user._id;
      const consultation = await ConsultationService.completeConsultation(
        req.params.id,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Consultation completed successfully',
        data: { consultation },
      });
    } catch (error) {
      logger.error('Error in completeConsultation:', error);
      next(error);
    }
  }

  async deleteConsultation(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await ConsultationService.deleteConsultation(
        req.params.id,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      logger.error('Error in deleteConsultation:', error);
      next(error);
    }
  }

  async getConsultationStats(req, res, next) {
    try {
      const filters = {
        doctor: req.query.doctor,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };

      const stats = await ConsultationService.getConsultationStats(filters);

      res.status(200).json({
        status: 'success',
        data: { stats },
      });
    } catch (error) {
      logger.error('Error in getConsultationStats:', error);
      next(error);
    }
  }
}

module.exports = new ConsultationsController();
