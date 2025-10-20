const Consultation = require('../models/ConsultationModel');
const Appointment = require('../models/AppointmentModel');
const Patient = require('../models/PatientModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

class ConsultationService {
  async createConsultation(data, userId) {
    try {
      const appointment = await Appointment.findById(data.appointment)
        .populate('patient')
        .populate('doctor');

      if (!appointment) {
        throw new ApiError(404, 'Appointment not found');
      }

      const existingConsultation = await Consultation.findOne({ 
        appointment: data.appointment,
      });

      if (existingConsultation) {
        throw new ApiError(409, 'Consultation already exists for this appointment');
      }

      const consultationData = {
        ...data,
        patient: data.patient || appointment.patient._id,
        doctor: data.doctor || appointment.doctor._id,
        createdBy: userId,
      };

      const consultation = await Consultation.create(consultationData);

      if (appointment.status === 'scheduled' || appointment.status === 'confirmed') {
        appointment.status = 'in-progress';
        await appointment.save();
      }

      logger.info(`Consultation created: ${consultation.consultationNumber}`);

      return await Consultation.findById(consultation._id)
        .populate('patient', 'personalInfo contact patientNumber')
        .populate('doctor', 'profile professional')
        .populate('appointment')
        .populate('createdBy', 'profile');
    } catch (error) {
      logger.error('Error creating consultation:', error);
      throw error;
    }
  }

  async getConsultationById(consultationId) {
    try {
      const consultation = await Consultation.findById(consultationId)
        .populate('patient', 'personalInfo contact patientNumber medicalInfo')
        .populate('doctor', 'profile professional')
        .populate('appointment')
        .populate('createdBy', 'profile')
        .populate('lastModifiedBy', 'profile')
        .populate('labOrders')
        .populate('prescriptions')
        .populate('documents');

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      return consultation;
    } catch (error) {
      logger.error('Error fetching consultation:', error);
      throw error;
    }
  }

  async getAllConsultations(filters = {}, options = {}) {
    try {
      const {
        patient,
        doctor,
        status,
        dateFrom,
        dateTo,
        search,
      } = filters;

      const {
        page = 1,
        limit = 10,
        sortBy = '-consultationDate',
      } = options;

      const query = {};

      if (patient) query.patient = patient;
      if (doctor) query.doctor = doctor;
      if (status) query.status = status;

      if (dateFrom || dateTo) {
        query.consultationDate = {};
        if (dateFrom) query.consultationDate.$gte = new Date(dateFrom);
        if (dateTo) query.consultationDate.$lte = new Date(dateTo);
      }

      if (search) {
        query.$or = [
          { consultationNumber: new RegExp(search, 'i') },
          { chiefComplaint: new RegExp(search, 'i') },
          { 'diagnoses.name': new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;

      const [consultations, total] = await Promise.all([
        Consultation.find(query)
          .populate('patient', 'personalInfo patientNumber')
          .populate('doctor', 'profile professional')
          .populate('appointment', 'appointmentNumber scheduledDate scheduledTime')
          .sort(sortBy)
          .skip(skip)
          .limit(limit),
        Consultation.countDocuments(query),
      ]);

      return {
        consultations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching consultations:', error);
      throw error;
    }
  }

  async getConsultationsByPatient(patientId, options = {}) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new ApiError(404, 'Patient not found');
      }

      return await this.getAllConsultations({ patient: patientId }, options);
    } catch (error) {
      logger.error('Error fetching patient consultations:', error);
      throw error;
    }
  }

  async getConsultationsByDoctor(doctorId, options = {}) {
    try {
      const doctor = await User.findById(doctorId);
      if (!doctor || doctor.role !== 'doctor') {
        throw new ApiError(404, 'Doctor not found');
      }

      return await this.getAllConsultations({ doctor: doctorId }, options);
    } catch (error) {
      logger.error('Error fetching doctor consultations:', error);
      throw error;
    }
  }

  async updateConsultation(consultationId, updateData, userId) {
    try {
      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      // Only the creating doctor or same doctor can update
      if (consultation.doctor.toString() !== userId && consultation.createdBy.toString() !== userId) {
        throw new ApiError(403, 'Not authorized to update this consultation');
      }

      updateData.lastModifiedBy = userId;

      const updatedConsultation = await Consultation.findByIdAndUpdate(
        consultationId,
        updateData,
        { new: true, runValidators: true },
      )
        .populate('patient', 'personalInfo contact patientNumber')
        .populate('doctor', 'profile professional')
        .populate('appointment')
        .populate('lastModifiedBy', 'profile');

      logger.info(`Consultation updated: ${updatedConsultation.consultationNumber}`);

      return updatedConsultation;
    } catch (error) {
      logger.error('Error updating consultation:', error);
      throw error;
    }
  }

  async addVitalSigns(consultationId, vitalSigns, userId) {
    try {
      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      consultation.vitalSigns = {
        ...consultation.vitalSigns,
        ...vitalSigns,
      };
      consultation.lastModifiedBy = userId;

      await consultation.save();

      logger.info(`Vital signs added to consultation: ${consultation.consultationNumber}`);

      return await this.getConsultationById(consultationId);
    } catch (error) {
      logger.error('Error adding vital signs:', error);
      throw error;
    }
  }

  async addDiagnosis(consultationId, diagnosis, userId) {
    try {
      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      consultation.diagnoses.push(diagnosis);
      consultation.lastModifiedBy = userId;

      await consultation.save();

      logger.info(`Diagnosis added to consultation: ${consultation.consultationNumber}`);

      return await this.getConsultationById(consultationId);
    } catch (error) {
      logger.error('Error adding diagnosis:', error);
      throw error;
    }
  }

  async addProcedure(consultationId, procedure, userId) {
    try {
      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      consultation.procedures.push(procedure);
      consultation.lastModifiedBy = userId;

      await consultation.save();

      logger.info(`Procedure added to consultation: ${consultation.consultationNumber}`);

      return await this.getConsultationById(consultationId);
    } catch (error) {
      logger.error('Error adding procedure:', error);
      throw error;
    }
  }

  async completeConsultation(consultationId, userId) {
    try {
      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      if (consultation.status === 'completed') {
        throw new ApiError(400, 'Consultation is already completed');
      }

      consultation.status = 'completed';
      consultation.lastModifiedBy = userId;

      await consultation.save();

      await Appointment.findByIdAndUpdate(consultation.appointment, {
        status: 'completed',
      });

      logger.info(`Consultation completed: ${consultation.consultationNumber}`);

      return await this.getConsultationById(consultationId);
    } catch (error) {
      logger.error('Error completing consultation:', error);
      throw error;
    }
  }

  async deleteConsultation(consultationId, userId) {
    try {
      const consultation = await Consultation.findById(consultationId);

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      // Only admin or the creating doctor can delete
      const user = await User.findById(userId);
      if (user.role !== 'admin' && consultation.createdBy.toString() !== userId) {
        throw new ApiError(403, 'Not authorized to delete this consultation');
      }

      await Consultation.findByIdAndDelete(consultationId);

      logger.info(`Consultation deleted: ${consultation.consultationNumber}`);

      return { message: 'Consultation deleted successfully' };
    } catch (error) {
      logger.error('Error deleting consultation:', error);
      throw error;
    }
  }

  async getConsultationStats(filters = {}) {
    try {
      const { doctor, dateFrom, dateTo } = filters;

      const matchStage = {};
      if (doctor) matchStage.doctor = mongoose.Types.ObjectId(doctor);
      if (dateFrom || dateTo) {
        matchStage.consultationDate = {};
        if (dateFrom) matchStage.consultationDate.$gte = new Date(dateFrom);
        if (dateTo) matchStage.consultationDate.$lte = new Date(dateTo);
      }

      const stats = await Consultation.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
            },
          },
        },
      ]);

      return stats[0] || {
        total: 0,
        completed: 0,
        inProgress: 0,
        cancelled: 0,
      };
    } catch (error) {
      logger.error('Error fetching consultation stats:', error);
      throw error;
    }
  }
}

module.exports = new ConsultationService();
