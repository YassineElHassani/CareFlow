const User = require('./UserModel');
const Patient = require('./PatientModel');
const Appointment = require('./AppointmentModel');
const MedicalRecord = require('./MedicalRecordModel');
const AuditLog = require('./AuditLogModel');

module.exports = {
  User,
  Patient,
  Appointment,
  MedicalRecord,
  AuditLog,
};
