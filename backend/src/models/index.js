const User = require('./UserModel');
const Patient = require('./PatientModel');
const Appointment = require('./AppointmentModel');
const MedicalRecord = require('./MedicalRecordModel');
const AuditLog = require('./AuditLogModel');
const Consultation = require('./ConsultationModel');
const Prescription = require('./PrescriptionModel');
const Pharmacy = require('./PharmacyModel');
const LabOrder = require('./LabOrderModel');

module.exports = {
  User,
  Patient,
  Appointment,
  MedicalRecord,
  AuditLog,
  Consultation,
  Prescription,
  Pharmacy,
  LabOrder,
};
