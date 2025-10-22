const Prescription = require('../models/PrescriptionModel');
const Consultation = require('../models/ConsultationModel');
const Pharmacy = require('../models/PharmacyModel');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const crypto = require('crypto');

class PrescriptionService {
  async createPrescription(data, userId) {
    try {
      const consultation = await Consultation.findById(data.consultation)
        .populate('patient')
        .populate('doctor');

      if (!consultation) {
        throw new ApiError(404, 'Consultation not found');
      }

      const prescriptionData = {
        ...data,
        patient: data.patient || consultation.patient._id,
        doctor: data.doctor || consultation.doctor._id,
        createdBy: userId,
      };

      const prescription = await Prescription.create(prescriptionData);

      logger.info(`Prescription created: ${prescription.prescriptionNumber}`);

      return await Prescription.findById(prescription._id)
        .populate('patient', 'personalInfo contact patientNumber')
        .populate('doctor', 'profile professional')
        .populate('consultation')
        .populate('pharmacy')
        .populate('createdBy', 'profile');
    } catch (error) {
      logger.error('Error creating prescription:', error);
      throw error;
    }
  }

  async getPrescriptionById(prescriptionId) {
    try {
      const prescription = await Prescription.findById(prescriptionId)
        .populate('patient', 'personalInfo contact patientNumber')
        .populate('doctor', 'profile professional')
        .populate('consultation')
        .populate('pharmacy')
        .populate('createdBy', 'profile')
        .populate('dispensedBy', 'profile');

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      return prescription;
    } catch (error) {
      logger.error('Error fetching prescription:', error);
      throw error;
    }
  }

  async getAllPrescriptions(filters = {}, options = {}) {
    try {
      const {
        patient,
        doctor,
        pharmacy,
        status,
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
      if (pharmacy) query.pharmacy = pharmacy;
      if (status) query.status = status;

      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      if (search) {
        query.$or = [
          { prescriptionNumber: new RegExp(search, 'i') },
          { diagnosis: new RegExp(search, 'i') },
          { 'medications.name': new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;

      const [prescriptions, total] = await Promise.all([
        Prescription.find(query)
          .populate('patient', 'personalInfo patientNumber')
          .populate('doctor', 'profile professional')
          .populate('pharmacy', 'name address contact')
          .sort(sortBy)
          .skip(skip)
          .limit(limit),
        Prescription.countDocuments(query),
      ]);

      return {
        prescriptions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching prescriptions:', error);
      throw error;
    }
  }

  async updatePrescription(prescriptionId, updateData, userId) {
    try {
      const prescription = await Prescription.findById(prescriptionId);

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      if (prescription.status !== 'draft') {
        throw new ApiError(400, 'Only draft prescriptions can be updated');
      }

      // Only the creating doctor can update
      if (prescription.createdBy.toString() !== userId) {
        throw new ApiError(403, 'Not authorized to update this prescription');
      }

      updateData.lastModifiedBy = userId;

      const updatedPrescription = await Prescription.findByIdAndUpdate(
        prescriptionId,
        updateData,
        { new: true, runValidators: true },
      )
        .populate('patient', 'personalInfo patientNumber')
        .populate('doctor', 'profile professional')
        .populate('pharmacy');

      logger.info(`Prescription updated: ${updatedPrescription.prescriptionNumber}`);

      return updatedPrescription;
    } catch (error) {
      logger.error('Error updating prescription:', error);
      throw error;
    }
  }

  async signPrescription(prescriptionId, userId) {
    try {
      const prescription = await Prescription.findById(prescriptionId);

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      if (prescription.status !== 'draft') {
        throw new ApiError(400, 'Only draft prescriptions can be signed');
      }

      if (prescription.doctor.toString() !== userId) {
        throw new ApiError(403, 'Only the prescribing doctor can sign this prescription');
      }

      // Generate digital signature
      const signatureData = `${prescription.prescriptionNumber}-${userId}-${Date.now()}`;
      const digitalSignature = crypto.createHash('sha256').update(signatureData).digest('hex');

      prescription.status = 'signed';
      prescription.signedAt = new Date();
      prescription.signedBy = userId;
      prescription.digitalSignature = digitalSignature;
      prescription.lastModifiedBy = userId;

      await prescription.save();

      logger.info(`Prescription signed: ${prescription.prescriptionNumber}`);

      return await this.getPrescriptionById(prescriptionId);
    } catch (error) {
      logger.error('Error signing prescription:', error);
      throw error;
    }
  }

  async sendToPharmacy(prescriptionId, pharmacyId, userId) {
    try {
      const prescription = await Prescription.findById(prescriptionId);

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      if (prescription.status !== 'signed') {
        throw new ApiError(400, 'Only signed prescriptions can be sent to pharmacy');
      }

      // Verify pharmacy exists
      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        throw new ApiError(404, 'Pharmacy not found');
      }

      if (!pharmacy.isActive) {
        throw new ApiError(400, 'Pharmacy is not active');
      }

      prescription.pharmacy = pharmacyId;
      prescription.status = 'sent';
      prescription.sentToPharmacyAt = new Date();
      prescription.lastModifiedBy = userId;

      await prescription.save();

      logger.info(`Prescription sent to pharmacy: ${prescription.prescriptionNumber}`);

      return await this.getPrescriptionById(prescriptionId);
    } catch (error) {
      logger.error('Error sending prescription to pharmacy:', error);
      throw error;
    }
  }

  async cancelPrescription(prescriptionId, reason, userId) {
    try {
      const prescription = await Prescription.findById(prescriptionId);

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      if (['dispensed', 'cancelled'].includes(prescription.status)) {
        throw new ApiError(400, `Prescription is already ${prescription.status}`);
      }

      prescription.status = 'cancelled';
      prescription.cancellationReason = reason;
      prescription.cancelledAt = new Date();
      prescription.cancelledBy = userId;
      prescription.lastModifiedBy = userId;

      await prescription.save();

      logger.info(`Prescription cancelled: ${prescription.prescriptionNumber}`);

      return await this.getPrescriptionById(prescriptionId);
    } catch (error) {
      logger.error('Error cancelling prescription:', error);
      throw error;
    }
  }

  async renewPrescription(prescriptionId, userId) {
    try {
      const originalPrescription = await Prescription.findById(prescriptionId);

      if (!originalPrescription) {
        throw new ApiError(404, 'Original prescription not found');
      }

      if (originalPrescription.doctor.toString() !== userId) {
        throw new ApiError(403, 'Only the original prescribing doctor can renew this prescription');
      }

      const renewalData = {
        consultation: originalPrescription.consultation,
        patient: originalPrescription.patient,
        doctor: originalPrescription.doctor,
        medications: originalPrescription.medications.map(med => ({
          ...med.toObject(),
          isDispensed: false,
          dispensedAt: null,
          dispensedQuantity: null,
        })),
        diagnosis: originalPrescription.diagnosis,
        notes: `Renewal of ${originalPrescription.prescriptionNumber}`,
        isRenewal: true,
        originalPrescription: prescriptionId,
        createdBy: userId,
      };

      const renewedPrescription = await this.createPrescription(renewalData, userId);

      logger.info(`Prescription renewed: ${renewedPrescription.prescriptionNumber}`);

      return renewedPrescription;
    } catch (error) {
      logger.error('Error renewing prescription:', error);
      throw error;
    }
  }
}

module.exports = new PrescriptionService();
