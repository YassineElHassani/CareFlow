const LabOrder = require('../models/LabOrderModel');
const Consultation = require('../models/ConsultationModel');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

class LabOrderService {
  async createLabOrder(data, doctorId) {
    try {
      const { consultationId, tests, ...otherData } = data;

      if (consultationId) {
        const consultation = await Consultation.findById(consultationId);
        if (!consultation) {
          throw new ApiError(404, 'Consultation not found');
        }

        otherData.patient = consultation.patient;
        otherData.doctor = consultation.doctor;
      } else {
        if (!otherData.patient || !doctorId) {
          throw new ApiError(400, 'Patient and doctor are required');
        }
        otherData.doctor = doctorId;
      }

      const labOrderData = {
        consultation: consultationId,
        tests: tests.map(test => ({
          ...test,
          status: 'ordered',
          orderedAt: new Date(),
        })),
        ...otherData,
        createdBy: doctorId,
      };

      const labOrder = await LabOrder.create(labOrderData);

      logger.info(`Lab order created: ${labOrder.labOrderNumber} by doctor ${doctorId}`);

      return await LabOrder.findById(labOrder._id)
        .populate('patient', 'personalInfo patientNumber contact')
        .populate('doctor', 'profile professional')
        .populate('consultation');
    } catch (error) {
      logger.error('Error creating lab order:', error);
      throw error;
    }
  }

  async getLabOrderById(labOrderId) {
    try {
      const labOrder = await LabOrder.findById(labOrderId)
        .populate('patient', 'personalInfo patientNumber contact')
        .populate('doctor', 'profile professional')
        .populate('consultation')
        .populate('report.documentId');

      if (!labOrder) {
        throw new ApiError(404, 'Lab order not found');
      }

      return labOrder;
    } catch (error) {
      logger.error('Error fetching lab order:', error);
      throw error;
    }
  }

  async getAllLabOrders(filters = {}, options = {}) {
    try {
      const {
        patient,
        doctor,
        status,
        priority,
        laboratory,
        dateFrom,
        dateTo,
        search,
      } = filters;

      const {
        page = 1,
        limit = 10,
        sortBy = '-createdAt',
      } = options;

      const query = {};

      if (patient) query.patient = patient;
      if (doctor) query.doctor = doctor;
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (laboratory) query['laboratory.name'] = new RegExp(laboratory, 'i');

      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      if (search) {
        query.$or = [
          { labOrderNumber: new RegExp(search, 'i') },
          { 'tests.name': new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;

      const [labOrders, total] = await Promise.all([
        LabOrder.find(query)
          .populate('patient', 'personalInfo patientNumber')
          .populate('doctor', 'profile professional')
          .sort(sortBy)
          .skip(skip)
          .limit(limit),
        LabOrder.countDocuments(query),
      ]);

      return {
        labOrders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching lab orders:', error);
      throw error;
    }
  }

  async updateSpecimenCollection(labOrderId, collectionData, userId) {
    try {
      const labOrder = await LabOrder.findById(labOrderId);

      if (!labOrder) {
        throw new ApiError(404, 'Lab order not found');
      }

      if (labOrder.status !== 'ordered') {
        throw new ApiError(400, 'Specimen already collected');
      }

      labOrder.specimenCollectedAt = collectionData.specimenCollectedAt || new Date();
      labOrder.specimenCollectedBy = collectionData.specimenCollectedBy || userId;
      labOrder.receivedByLabAt = collectionData.receivedByLabAt;
      labOrder.status = 'specimen-collected';
      labOrder.lastModifiedBy = userId;

      await labOrder.save();

      logger.info(`Specimen collected for lab order: ${labOrder.labOrderNumber}`);

      return await LabOrder.findById(labOrderId)
        .populate('patient', 'personalInfo contact')
        .populate('doctor', 'profile professional');
    } catch (error) {
      logger.error('Error updating specimen collection:', error);
      throw error;
    }
  }

  async uploadTestResult(labOrderId, testIndex, resultData, technicianId) {
    try {
      const labOrder = await LabOrder.findById(labOrderId);

      if (!labOrder) {
        throw new ApiError(404, 'Lab order not found');
      }

      if (!['specimen-collected', 'in-progress', 'partially-completed'].includes(labOrder.status)) {
        throw new ApiError(400, 'Lab order is not ready for results');
      }

      if (testIndex >= labOrder.tests.length) {
        throw new ApiError(400, 'Invalid test index');
      }

      const test = labOrder.tests[testIndex];

      test.result = {
        value: resultData.value,
        unit: resultData.unit,
        referenceRange: resultData.referenceRange,
        flag: resultData.flag || 'normal',
        performedAt: new Date(),
        performedBy: technicianId,
        interpretation: resultData.interpretation,
      };

      test.status = 'completed';
      test.completedAt = new Date();

      labOrder.lastModifiedBy = technicianId;

      await labOrder.save();

      logger.info(`Test result uploaded for lab order: ${labOrder.labOrderNumber}, test: ${test.name}`);

      return await LabOrder.findById(labOrderId)
        .populate('patient', 'personalInfo contact')
        .populate('doctor', 'profile professional');
    } catch (error) {
      logger.error('Error uploading test result:', error);
      throw error;
    }
  }

  async updateTestStatus(labOrderId, testIndex, status, userId) {
    try {
      const labOrder = await LabOrder.findById(labOrderId);

      if (!labOrder) {
        throw new ApiError(404, 'Lab order not found');
      }

      if (testIndex >= labOrder.tests.length) {
        throw new ApiError(400, 'Invalid test index');
      }

      const test = labOrder.tests[testIndex];
      test.status = status;

      if (status === 'in-progress') {
        test.startedAt = new Date();
      } else if (status === 'completed') {
        test.completedAt = new Date();
      }

      labOrder.lastModifiedBy = userId;

      await labOrder.save();

      logger.info(`Test status updated for lab order: ${labOrder.labOrderNumber}`);

      return await LabOrder.findById(labOrderId)
        .populate('patient', 'personalInfo')
        .populate('doctor', 'profile professional');
    } catch (error) {
      logger.error('Error updating test status:', error);
      throw error;
    }
  }

  async finalizeLabReport(labOrderId, reportData, reviewerId) {
    try {
      const labOrder = await LabOrder.findById(labOrderId);

      if (!labOrder) {
        throw new ApiError(404, 'Lab order not found');
      }

      if (labOrder.status !== 'completed') {
        throw new ApiError(400, 'Not all tests are completed');
      }

      labOrder.report = {
        documentId: reportData.documentId,
        summary: reportData.summary,
        generalComments: reportData.generalComments,
        pathologistSignature: reportData.pathologistSignature,
        reportedAt: new Date(),
      };

      // Mark all tests as reviewed
      labOrder.tests.forEach(test => {
        if (test.result) {
          test.result.reviewedAt = new Date();
          test.result.reviewedBy = reviewerId;
        }
      });

      labOrder.lastModifiedBy = reviewerId;

      await labOrder.save();

      logger.info(`Lab report finalized for lab order: ${labOrder.labOrderNumber}`);

      return await LabOrder.findById(labOrderId)
        .populate('patient', 'personalInfo contact')
        .populate('doctor', 'profile professional')
        .populate('report.documentId');
    } catch (error) {
      logger.error('Error finalizing lab report:', error);
      throw error;
    }
  }

  async cancelLabOrder(labOrderId, reason, userId) {
    try {
      const labOrder = await LabOrder.findById(labOrderId);

      if (!labOrder) {
        throw new ApiError(404, 'Lab order not found');
      }

      if (labOrder.status === 'completed') {
        throw new ApiError(400, 'Cannot cancel completed lab order');
      }

      if (labOrder.status === 'cancelled') {
        throw new ApiError(400, 'Lab order already cancelled');
      }

      labOrder.status = 'cancelled';
      labOrder.cancelledAt = new Date();
      labOrder.cancellationReason = reason;
      labOrder.lastModifiedBy = userId;

      await labOrder.save();

      logger.info(`Lab order cancelled: ${labOrder.labOrderNumber}`);

      return labOrder;
    } catch (error) {
      logger.error('Error cancelling lab order:', error);
      throw error;
    }
  }

  async getLabTechnicianDashboard(filters = {}) {
    try {
      const { laboratory, category, priority } = filters;

      const query = {
        status: { $in: ['specimen-collected', 'in-progress', 'partially-completed'] },
      };

      if (laboratory) query['laboratory.name'] = laboratory;
      if (category) query['tests.category'] = category;
      if (priority) query.priority = priority;

      const [pending, inProgress, urgent] = await Promise.all([
        LabOrder.countDocuments({ ...query, status: 'specimen-collected' }),
        LabOrder.countDocuments({ ...query, status: { $in: ['in-progress', 'partially-completed'] } }),
        LabOrder.countDocuments({ ...query, priority: 'stat' }),
      ]);

      const recentOrders = await LabOrder.find(query)
        .populate('patient', 'personalInfo patientNumber')
        .populate('doctor', 'profile professional')
        .sort({ priority: 1, createdAt: 1 })
        .limit(20);

      return {
        statistics: {
          pending,
          inProgress,
          urgent,
        },
        recentOrders,
      };
    } catch (error) {
      logger.error('Error fetching lab technician dashboard:', error);
      throw error;
    }
  }
}

module.exports = new LabOrderService();
