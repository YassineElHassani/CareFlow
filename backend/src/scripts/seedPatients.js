const mongoose = require('mongoose');
const Patient = require('../models/PatientModel');
const User = require('../models/UserModel');
const logger = require('../config/logger');
require('dotenv').config();

const seedPatients = async () => {
  try {
    // Connect to database
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/careflow';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ MongoDB connected');

    // Find the patient user
    const patientUser = await User.findOne({ email: 'patient1@careflow.com' });
    if (!patientUser) {
      throw new Error('Patient user not found. Please run seed:users first.');
    }

    // Find a doctor to assign
    const doctor = await User.findOne({ role: 'doctor' });

    // Clear existing patients
    await Patient.deleteMany({});
    logger.info('🗑️  Cleared existing patients');

    // Create patient record
    const patientData = {
      userId: patientUser._id,
      personalInfo: {
        firstName: 'Youssef',
        lastName: 'Idrissi',
        nationalId: 'PAT-2025-001',
        dateOfBirth: new Date('1990-03-15'),
        gender: 'male',
        bloodType: 'A+',
        maritalStatus: 'single',
      },
      contact: {
        phone: '+212-600-000-010',
        email: 'patient1@careflow.com',
        address: {
          street: '25 Patient Avenue',
          city: 'Casablanca',
          state: 'Casablanca-Settat',
          zipCode: '20000',
          country: 'Morocco',
        },
      },
      emergencyContact: {
        name: 'Fatima Idrissi',
        relationship: 'Sister',
        phone: '+212-600-000-099',
        email: 'fatima.idrissi@example.com',
      },
      insurance: {
        provider: 'CNSS Morocco',
        policyNumber: 'INS-2025-001',
        groupNumber: 'GRP-001',
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        isPrimary: true,
      },
      medical: {
        allergies: [
          {
            allergen: 'Penicillin',
            reaction: 'Skin rash',
            severity: 'moderate',
            recordedDate: new Date('2020-05-10'),
          },
        ],
        chronicConditions: [
          {
            condition: 'Asthma',
            diagnosedDate: new Date('2015-07-20'),
            status: 'managed',
          },
        ],
        medications: [],
        immunizations: [
          {
            vaccine: 'COVID-19',
            date: new Date('2024-01-15'),
            nextDueDate: new Date('2025-01-15'),
            batchNumber: 'VAC-COVID-2024-001',
          },
        ],
        familyHistory: [
          {
            relation: 'Father',
            condition: 'Diabetes Type 2',
            ageOfOnset: 55,
            notes: 'Managed with medication',
          },
        ],
      },
      preferences: {
        preferredLanguage: 'en',
        preferredDoctor: doctor ? doctor._id : null,
        communicationMethod: 'email',
      },
      consents: {
        dataSharing: {
          agreed: true,
          date: new Date(),
        },
        treatmentConsent: {
          agreed: true,
          date: new Date(),
        },
        researchParticipation: {
          agreed: false,
          date: new Date(),
        },
      },
      isActive: true,
      assignedDoctor: doctor ? doctor._id : null,
      notes: 'Regular patient, good compliance with treatment plans.',
    };

    const patient = await Patient.create(patientData);
    logger.info('✅ Patient record created successfully');

    logger.info('\n═══════════════════════════════════════════════════════════');
    logger.info('                 PATIENT RECORD CREATED');
    logger.info('═══════════════════════════════════════════════════════════\n');
    logger.info(`Patient Number: ${patient.patientNumber}`);
    logger.info(`Name: ${patient.fullName}`);
    logger.info(`Email: ${patient.contact.email}`);
    logger.info(`Phone: ${patient.contact.phone}`);
    logger.info(`Blood Type: ${patient.personalInfo.bloodType}`);
    logger.info(`Age: ${patient.age} years`);
    logger.info(`User ID: ${patient.userId}`);
    if (doctor) {
      logger.info(`Assigned Doctor: Dr. ${doctor.profile.firstName} ${doctor.profile.lastName}`);
    }
    logger.info('\n═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    logger.error('❌ Error seeding patients:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('✅ Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedPatients();
