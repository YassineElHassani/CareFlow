const mongoose = require('mongoose');
const Appointment = require('../models/AppointmentModel');
const Patient = require('../models/PatientModel');
const User = require('../models/UserModel');
const logger = require('../config/logger');
require('dotenv').config();

const seedAppointments = async () => {
  try {
    // Connect to database
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/careflow';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ MongoDB connected');

    // Find required entities
    const patient = await Patient.findOne({ patientNumber: 'P-2025-00001' });
    if (!patient) {
      throw new Error('Patient not found. Please run seed:patients first.');
    }

    const doctor = await User.findOne({ email: 'doctor1@careflow.com' });
    if (!doctor) {
      throw new Error('Doctor not found. Please run seed:users first.');
    }

    // Clear existing appointments
    await Appointment.deleteMany({});
    logger.info('🗑️  Cleared existing appointments');

    // Create sample appointments
    const appointments = [
      {
        patient: patient._id,
        doctor: doctor._id,
        type: 'routine_checkup',
        status: 'scheduled',
        scheduledDate: new Date('2025-11-25'),
        scheduledTime: '10:00',
        startAt: new Date('2025-11-25T10:00:00'),
        endAt: new Date('2025-11-25T10:30:00'),
        duration: 30,
        chiefComplaint: 'Regular health checkup',
        notes: 'Annual checkup - review current medications',
      },
      {
        patient: patient._id,
        doctor: doctor._id,
        type: 'follow_up',
        status: 'scheduled',
        scheduledDate: new Date('2025-12-05'),
        scheduledTime: '14:00',
        startAt: new Date('2025-12-05T14:00:00'),
        endAt: new Date('2025-12-05T14:30:00'),
        duration: 30,
        chiefComplaint: 'Follow-up for asthma management',
        notes: 'Review inhaler usage and lung function',
      },
      {
        patient: patient._id,
        doctor: doctor._id,
        type: 'consultation',
        status: 'completed',
        scheduledDate: new Date('2025-10-15'),
        scheduledTime: '09:00',
        startAt: new Date('2025-10-15T09:00:00'),
        endAt: new Date('2025-10-15T09:30:00'),
        duration: 30,
        chiefComplaint: 'Respiratory symptoms',
        diagnosis: 'Mild asthma exacerbation',
        prescription: 'Albuterol inhaler - 2 puffs every 4 hours as needed',
        notes: 'Patient reported shortness of breath',
      },
      {
        patient: patient._id,
        doctor: doctor._id,
        type: 'emergency',
        status: 'cancelled',
        scheduledDate: new Date('2025-11-10'),
        scheduledTime: '16:00',
        startAt: new Date('2025-11-10T16:00:00'),
        endAt: new Date('2025-11-10T16:30:00'),
        duration: 30,
        chiefComplaint: 'Severe allergic reaction',
        cancellation: {
          reason: 'Patient recovered before appointment',
          cancelledAt: new Date('2025-11-10T15:30:00'),
        },
        notes: 'Patient had allergic reaction to food - recovered at home',
      },
    ];

    const createdAppointments = [];
    for (const aptData of appointments) {
      const apt = await Appointment.create(aptData);
      createdAppointments.push(apt);
    }
    
    logger.info(`✅ ${createdAppointments.length} appointments created successfully`);

    logger.info('\n═══════════════════════════════════════════════════════════');
    logger.info('              APPOINTMENTS CREATED');
    logger.info('═══════════════════════════════════════════════════════════\n');

    for (const apt of createdAppointments) {
      logger.info(`📅 ${apt.type.toUpperCase()}`);
      logger.info(`   Status: ${apt.status}`);
      logger.info(`   Date: ${apt.scheduledDate.toISOString().split('T')[0]}`);
      logger.info(`   Time: ${apt.scheduledTime}`);
      logger.info(`   Chief Complaint: ${apt.chiefComplaint}`);
      logger.info('');
    }

    logger.info('═══════════════════════════════════════════════════════════\n');

    // Summary
    const statusCount = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    logger.info('📊 Summary by Status:');
    statusCount.forEach(s => {
      logger.info(`   ${s._id}: ${s.count}`);
    });

  } catch (error) {
    logger.error('❌ Error seeding appointments:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedAppointments();
