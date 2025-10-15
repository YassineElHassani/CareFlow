const { Patient } = require('../models');
const { AppError } = require('../middlewares/ErrorMiddleware');

const createPatient = async (patientData) => {
  try {
    if (patientData.personalInfo?.nationalId) {
      const existingPatient = await Patient.findOne({
        'personalInfo.nationalId': patientData.personalInfo.nationalId,
      });

      if (existingPatient) {
        throw new AppError('Patient with this national ID already exists', 409);
      }
    }

    if (patientData.contact?.email) {
      const existingEmail = await Patient.findOne({
        'contact.email': patientData.contact.email,
        isActive: true,
      });

      if (existingEmail) {
        throw new AppError('Patient with this email already exists', 409);
      }
    }

    const patient = await Patient.create(patientData);
    return patient;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new AppError(error.message, 400);
    }
    throw error;
  }
};

const getPatients = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    assignedDoctor,
    isActive,
    bloodType,
    gender,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const query = {};

  if (search) {
    query.$or = [
      { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
      { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
      { 'contact.email': { $regex: search, $options: 'i' } },
      { 'contact.phone': { $regex: search, $options: 'i' } },
      { patientNumber: { $regex: search, $options: 'i' } },
    ];
  }

  if (assignedDoctor) query.assignedDoctor = assignedDoctor;
  if (typeof isActive !== 'undefined') query.isActive = isActive;
  if (bloodType) query['personalInfo.bloodType'] = bloodType;
  if (gender) query['personalInfo.gender'] = gender;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'email role')
      .populate('assignedDoctor', 'profile.firstName profile.lastName email')
      .lean(),
    Patient.countDocuments(query),
  ]);

  return {
    patients,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getPatientById = async (patientId) => {
  const patient = await Patient.findById(patientId)
    .populate('userId', 'email role isActive')
    .populate('assignedDoctor', 'profile.firstName profile.lastName email professional.specialization')
    .populate('medical.medications.prescribedBy', 'profile.firstName profile.lastName')
    .populate('medical.immunizations.administeredBy', 'profile.firstName profile.lastName');

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  return patient;
};

const getPatientByUserId = async (userId) => {
  const patient = await Patient.findOne({ userId })
    .populate('userId', 'email role isActive')
    .populate('assignedDoctor', 'profile.firstName profile.lastName email professional.specialization');

  if (!patient) {
    throw new AppError('Patient record not found for this user', 404);
  }

  return patient;
};

const updatePatient = async (patientId, updateData) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  if (updateData.personalInfo?.nationalId && 
      updateData.personalInfo.nationalId !== patient.personalInfo.nationalId) {
    const existingPatient = await Patient.findOne({
      'personalInfo.nationalId': updateData.personalInfo.nationalId,
      _id: { $ne: patientId },
    });

    if (existingPatient) {
      throw new AppError('National ID already in use', 409);
    }
  }

  Object.assign(patient, updateData);
  await patient.save();

  return patient;
};

// Soft Delete Method 
const deletePatient = async (patientId) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  patient.isActive = false;
  await patient.save();

  return { message: 'Patient deactivated successfully' };
};

const addAllergy = async (patientId, allergyData) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  patient.medical.allergies.push(allergyData);
  await patient.save();

  return patient;
};

const addMedication = async (patientId, medicationData) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  patient.medical.medications.push(medicationData);
  await patient.save();

  return patient;
};

const addChronicCondition = async (patientId, conditionData) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  patient.medical.chronicConditions.push(conditionData);
  await patient.save();

  return patient;
};

const getPatientMedicalHistory = async (patientId) => {
  const patient = await Patient.findById(patientId)
    .select('personalInfo.firstName personalInfo.lastName medical')
    .populate('medical.medications.prescribedBy', 'profile.firstName profile.lastName')
    .populate('medical.immunizations.administeredBy', 'profile.firstName profile.lastName');

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  return {
    patientName: `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`,
    allergies: patient.medical.allergies,
    chronicConditions: patient.medical.chronicConditions,
    medications: patient.medical.medications,
    immunizations: patient.medical.immunizations,
    familyHistory: patient.medical.familyHistory,
  };
};

const searchPatients = async (searchTerm) => {
  const patients = await Patient.find({
    $or: [
      { 'personalInfo.firstName': { $regex: searchTerm, $options: 'i' } },
      { 'personalInfo.lastName': { $regex: searchTerm, $options: 'i' } },
      { patientNumber: { $regex: searchTerm, $options: 'i' } },
      { 'contact.email': { $regex: searchTerm, $options: 'i' } },
    ],
    isActive: true,
  })
    .select('patientNumber personalInfo.firstName personalInfo.lastName contact.phone contact.email personalInfo.dateOfBirth')
    .limit(20)
    .lean();

  return patients;
};

const getPatientStats = async () => {
  const [
    totalPatients,
    activePatients,
    inactivePatients,
    patientsWithAllergies,
    patientsWithChronicConditions,
  ] = await Promise.all([
    Patient.countDocuments(),
    Patient.countDocuments({ isActive: true }),
    Patient.countDocuments({ isActive: false }),
    Patient.countDocuments({ 'medical.allergies.0': { $exists: true } }),
    Patient.countDocuments({ 'medical.chronicConditions.0': { $exists: true } }),
  ]);

  return {
    totalPatients,
    activePatients,
    inactivePatients,
    patientsWithAllergies,
    patientsWithChronicConditions,
  };
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  getPatientByUserId,
  updatePatient,
  deletePatient,
  addAllergy,
  addMedication,
  addChronicCondition,
  getPatientMedicalHistory,
  searchPatients,
  getPatientStats,
};
