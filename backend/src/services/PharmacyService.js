const Prescription = require('../models/PrescriptionModel');
const Pharmacy = require('../models/PharmacyModel');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

class PharmacyService {
  async createPharmacy(data, userId) {
    try {
      const pharmacyData = {
        ...data,
        createdBy: userId,
      };

      const pharmacy = await Pharmacy.create(pharmacyData);

      logger.info(`Pharmacy created: ${pharmacy.pharmacyNumber}`);

      return pharmacy;
    } catch (error) {
      logger.error('Error creating pharmacy:', error);
      throw error;
    }
  }

  async getPharmacyById(pharmacyId) {
    try {
      const pharmacy = await Pharmacy.findById(pharmacyId)
        .populate('assignedUsers', 'profile professional')
        .populate('createdBy', 'profile');

      if (!pharmacy) {
        throw new ApiError(404, 'Pharmacy not found');
      }

      return pharmacy;
    } catch (error) {
      logger.error('Error fetching pharmacy:', error);
      throw error;
    }
  }

  async getAllPharmacies(filters = {}, options = {}) {
    try {
      const {
        city,
        isActive,
        is24Hours,
        search,
      } = filters;

      const {
        page = 1,
        limit = 10,
        sortBy = 'name',
      } = options;

      const query = {};

      if (city) query['address.city'] = new RegExp(city, 'i');
      if (typeof isActive !== 'undefined') query.isActive = isActive;
      if (typeof is24Hours !== 'undefined') query.is24Hours = is24Hours;

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { pharmacyNumber: new RegExp(search, 'i') },
          { licenseNumber: new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;

      const [pharmacies, total] = await Promise.all([
        Pharmacy.find(query)
          .sort(sortBy)
          .skip(skip)
          .limit(limit),
        Pharmacy.countDocuments(query),
      ]);

      return {
        pharmacies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching pharmacies:', error);
      throw error;
    }
  }

  async updatePharmacy(pharmacyId, updateData, userId) {
    try {
      const pharmacy = await Pharmacy.findById(pharmacyId);

      if (!pharmacy) {
        throw new ApiError(404, 'Pharmacy not found');
      }

      updateData.lastModifiedBy = userId;

      const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
        pharmacyId,
        updateData,
        { new: true, runValidators: true },
      );

      logger.info(`Pharmacy updated: ${updatedPharmacy.pharmacyNumber}`);

      return updatedPharmacy;
    } catch (error) {
      logger.error('Error updating pharmacy:', error);
      throw error;
    }
  }

  async getPharmacyPrescriptions(pharmacyId, filters = {}, options = {}) {
    try {
      const pharmacy = await Pharmacy.findById(pharmacyId);

      if (!pharmacy) {
        throw new ApiError(404, 'Pharmacy not found');
      }

      const {
        status,
        dateFrom,
        dateTo,
      } = filters;

      const {
        page = 1,
        limit = 10,
        sortBy = '-sentToPharmacyAt',
      } = options;

      const query = { pharmacy: pharmacyId };

      if (status) query.status = status;

      if (dateFrom || dateTo) {
        query.sentToPharmacyAt = {};
        if (dateFrom) query.sentToPharmacyAt.$gte = new Date(dateFrom);
        if (dateTo) query.sentToPharmacyAt.$lte = new Date(dateTo);
      }

      const skip = (page - 1) * limit;

      const [prescriptions, total] = await Promise.all([
        Prescription.find(query)
          .populate('patient', 'personalInfo patientNumber contact')
          .populate('doctor', 'profile professional')
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
      logger.error('Error fetching pharmacy prescriptions:', error);
      throw error;
    }
  }

  async dispenseMedication(prescriptionId, medicationIndex, dispensedQuantity, pharmacistId) {
    try {
      const prescription = await Prescription.findById(prescriptionId);

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      if (!['sent', 'partially-dispensed'].includes(prescription.status)) {
        throw new ApiError(400, 'Prescription is not available for dispensing');
      }

      if (medicationIndex >= prescription.medications.length) {
        throw new ApiError(400, 'Invalid medication index');
      }

      const medication = prescription.medications[medicationIndex];

      if (medication.isDispensed) {
        throw new ApiError(400, 'Medication already dispensed');
      }

      // Mark medication as dispensed
      medication.isDispensed = true;
      medication.dispensedAt = new Date();
      medication.dispensedQuantity = dispensedQuantity;

      // Check if all medications dispensed
      const allDispensed = prescription.medications.every(m => m.isDispensed);

      if (allDispensed) {
        prescription.status = 'dispensed';
        prescription.dispensedAt = new Date();
        prescription.dispensedBy = pharmacistId;
      } else {
        prescription.status = 'partially-dispensed';
      }

      prescription.lastModifiedBy = pharmacistId;

      await prescription.save();

      logger.info(`Medication dispensed for prescription: ${prescription.prescriptionNumber}`);

      return await Prescription.findById(prescriptionId)
        .populate('patient', 'personalInfo contact')
        .populate('doctor', 'profile professional')
        .populate('pharmacy');
    } catch (error) {
      logger.error('Error dispensing medication:', error);
      throw error;
    }
  }

  async markMedicationUnavailable(prescriptionId, medicationIndex, reason, pharmacistId) {
    try {
      const prescription = await Prescription.findById(prescriptionId);

      if (!prescription) {
        throw new ApiError(404, 'Prescription not found');
      }

      if (medicationIndex >= prescription.medications.length) {
        throw new ApiError(400, 'Invalid medication index');
      }

      const medication = prescription.medications[medicationIndex];
      medication.instructions = `UNAVAILABLE: ${reason}. ${medication.instructions || ''}`;

      prescription.lastModifiedBy = pharmacistId;

      await prescription.save();

      logger.info(`Medication marked unavailable for prescription: ${prescription.prescriptionNumber}`);

      return await Prescription.findById(prescriptionId)
        .populate('patient', 'personalInfo contact')
        .populate('doctor', 'profile professional')
        .populate('pharmacy');
    } catch (error) {
      logger.error('Error marking medication unavailable:', error);
      throw error;
    }
  }

  async deletePharmacy(pharmacyId) {
    try {
      const pharmacy = await Pharmacy.findById(pharmacyId);

      if (!pharmacy) {
        throw new ApiError(404, 'Pharmacy not found');
      }

      // Check if pharmacy has active prescriptions
      const activePrescriptions = await Prescription.countDocuments({
        pharmacy: pharmacyId,
        status: { $in: ['sent', 'partially-dispensed'] },
      });

      if (activePrescriptions > 0) {
        throw new ApiError(400, 'Cannot delete pharmacy with active prescriptions');
      }

      await Pharmacy.findByIdAndDelete(pharmacyId);

      logger.info(`Pharmacy deleted: ${pharmacy.pharmacyNumber}`);

      return { message: 'Pharmacy deleted successfully' };
    } catch (error) {
      logger.error('Error deleting pharmacy:', error);
      throw error;
    }
  }
}

module.exports = new PharmacyService();
