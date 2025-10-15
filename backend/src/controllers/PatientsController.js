const PatientService = require('../services/PatientService');

const createPatient = async (req, res, next) => {
  try {
    const patientData = req.body;
    
    patientData.createdBy = req.user._id;

    const patient = await PatientService.createPatient(patientData);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      assignedDoctor: req.query.assignedDoctor,
      isActive: req.query.isActive,
      bloodType: req.query.bloodType,
      gender: req.query.gender,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const result = await PatientService.getPatients(filters);

    res.status(200).json({
      success: true,
      data: result.patients,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await PatientService.getPatientById(req.params.id);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientByUserId = async (req, res, next) => {
  try {
    const patient = await PatientService.getPatientByUserId(req.params.userId);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const getMyPatientRecord = async (req, res, next) => {
  try {
    const patient = await PatientService.getPatientByUserId(req.user._id);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const patient = await PatientService.updatePatient(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const result = await PatientService.deletePatient(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const addAllergy = async (req, res, next) => {
  try {
    const patient = await PatientService.addAllergy(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Allergy added successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const addMedication = async (req, res, next) => {
  try {
    req.body.prescribedBy = req.user._id;

    const patient = await PatientService.addMedication(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Medication added successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const addChronicCondition = async (req, res, next) => {
  try {
    const patient = await PatientService.addChronicCondition(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Chronic condition added successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientMedicalHistory = async (req, res, next) => {
  try {
    const history = await PatientService.getPatientMedicalHistory(req.params.id);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

const searchPatients = async (req, res, next) => {
  try {
    const patients = await PatientService.searchPatients(req.params.searchTerm);

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientStats = async (req, res, next) => {
  try {
    const stats = await PatientService.getPatientStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  getPatientByUserId,
  getMyPatientRecord,
  updatePatient,
  deletePatient,
  addAllergy,
  addMedication,
  addChronicCondition,
  getPatientMedicalHistory,
  searchPatients,
  getPatientStats,
};
