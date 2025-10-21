const mongoose = require('mongoose');
const User = require('../models/UserModel');
const logger = require('../config/logger');
require('dotenv').config();

const users = [
  // Admin
  {
    email: 'admin@careflow.com',
    password: 'Admin@123456',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'System',
      lastName: 'Administrator',
      nationalId: 'ADM-2025-001',
      title: 'System Admin',
      gender: 'male',
      phone: '+212-600-000-001',
      address: {
        street: '1 Admin Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
  },

  // Doctors
  {
    email: 'doctor1@careflow.com',
    password: 'Doctor@123456',
    role: 'doctor',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Mohammed',
      lastName: 'Alami',
      nationalId: 'DOC-2025-001',
      title: 'Dr.',
      gender: 'male',
      phone: '+212-600-000-002',
      dateOfBirth: '1980-05-15',
      address: {
        street: '10 Medical Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'MD-2025-001',
      specialization: ['Cardiology', 'Internal Medicine'],
      department: 'Cardiology',
      qualifications: ['MD', 'FACC'],
      yearsOfExperience: 15,
    },
  },
  {
    email: 'doctor2@careflow.com',
    password: 'Doctor@123456',
    role: 'doctor',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Fatima',
      lastName: 'Zahra',
      nationalId: 'DOC-2025-002',
      title: 'Dr.',
      gender: 'female',
      phone: '+212-600-000-003',
      dateOfBirth: '1985-08-20',
      address: {
        street: '15 Health Avenue',
        city: 'Rabat',
        state: 'Rabat-Salé-Kénitra',
        zipCode: '10000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'MD-2025-002',
      specialization: ['Pediatrics'],
      department: 'Pediatrics',
      qualifications: ['MD', 'Board Certified Pediatrician'],
      yearsOfExperience: 10,
    },
  },

  // Nurses
  {
    email: 'nurse1@careflow.com',
    password: 'Nurse@123456',
    role: 'nurse',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Amina',
      lastName: 'Rachid',
      nationalId: 'NUR-2025-001',
      title: 'RN',
      gender: 'female',
      phone: '+212-600-000-004',
      dateOfBirth: '1990-03-10',
      address: {
        street: '20 Care Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'RN-2025-001',
      specialization: ['Emergency Nursing'],
      department: 'Emergency',
      qualifications: ['BSN', 'ACLS'],
      yearsOfExperience: 8,
    },
  },

  // Secretary
  {
    email: 'secretary1@careflow.com',
    password: 'Secretary@123456',
    role: 'secretary',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Laila',
      lastName: 'Mansouri',
      nationalId: 'SEC-2025-001',
      gender: 'female',
      phone: '+212-600-000-005',
      dateOfBirth: '1992-07-25',
      address: {
        street: '5 Reception Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
    professional: {
      department: 'Administration',
      yearsOfExperience: 5,
    },
  },

  // Pharmacists
  {
    email: 'pharmacist1@careflow.com',
    password: 'Pharmacist@123456',
    role: 'pharmacist',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Ahmed',
      lastName: 'Bennani',
      nationalId: 'PHA-2025-001',
      title: 'PharmD',
      gender: 'male',
      phone: '+212-600-111-001',
      dateOfBirth: '1985-06-20',
      address: {
        street: '15 Pharmacy Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'RPH-2025-001',
      pharmacyLicense: 'PH-20250001',
      specialization: ['Clinical Pharmacy'],
      department: 'Pharmacy',
      qualifications: ['PharmD', 'Clinical Pharmacist Certification'],
      yearsOfExperience: 10,
    },
  },
  {
    email: 'pharmacist2@careflow.com',
    password: 'Pharmacist@123456',
    role: 'pharmacist',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Salma',
      lastName: 'El Amrani',
      nationalId: 'PHA-2025-002',
      title: 'PharmD',
      gender: 'female',
      phone: '+212-600-111-002',
      dateOfBirth: '1990-09-12',
      address: {
        street: '20 Health Avenue',
        city: 'Rabat',
        state: 'Rabat-Salé-Kénitra',
        zipCode: '10000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'RPH-2025-002',
      pharmacyLicense: 'PH-20250002',
      specialization: ['Hospital Pharmacy'],
      department: 'Pharmacy',
      qualifications: ['PharmD', 'Hospital Pharmacy Specialist'],
      yearsOfExperience: 7,
    },
  },

  // Laboratory Technicians
  {
    email: 'labtech1@careflow.com',
    password: 'LabTech@123456',
    role: 'lab-technician',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Omar',
      lastName: 'Khalil',
      nationalId: 'LAB-2025-001',
      title: 'MLT',
      gender: 'male',
      phone: '+212-600-222-001',
      dateOfBirth: '1988-03-15',
      address: {
        street: '30 Medical Lab Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'LT-2025-001',
      labLicense: 'LAB-20250001',
      laboratory: 'CareFlow Central Laboratory',
      labSpecialization: 'Hematology',
      department: 'Laboratory',
      qualifications: ['BSc Medical Laboratory Science', 'ASCP Certified'],
      yearsOfExperience: 8,
    },
  },
  {
    email: 'labtech2@careflow.com',
    password: 'LabTech@123456',
    role: 'lab-technician',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Nadia',
      lastName: 'Mansouri',
      nationalId: 'LAB-2025-002',
      title: 'MLT',
      gender: 'female',
      phone: '+212-600-222-002',
      dateOfBirth: '1992-11-08',
      address: {
        street: '45 Science Park',
        city: 'Rabat',
        state: 'Rabat-Salé-Kénitra',
        zipCode: '10000',
        country: 'Morocco',
      },
    },
    professional: {
      licenseNumber: 'LT-2025-002',
      labLicense: 'LAB-20250002',
      laboratory: 'CareFlow Diagnostic Center',
      labSpecialization: 'Microbiology',
      department: 'Laboratory',
      qualifications: ['BSc Medical Laboratory Technology', 'Clinical Microbiology Certification'],
      yearsOfExperience: 6,
    },
  },

  // Sample Patient
  {
    email: 'patient1@careflow.com',
    password: 'Patient@123456',
    role: 'patient',
    isActive: true,
    isEmailVerified: true,
    profile: {
      firstName: 'Youssef',
      lastName: 'Idrissi',
      gender: 'male',
      phone: '+212-600-333-001',
      dateOfBirth: '1995-12-05',
      address: {
        street: '100 Patient Street',
        city: 'Casablanca',
        state: 'Casablanca-Settat',
        zipCode: '20000',
        country: 'Morocco',
      },
    },
  },
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/careflow';
    await mongoose.connect(mongoUri);
    logger.info('✅ MongoDB connected');

    // Clear existing users
    await User.deleteMany({});
    logger.info('🗑️  Cleared existing users');

    // Create users one by one to trigger pre-save hooks
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save(); // This will trigger the pre-save hook to hash password
      createdUsers.push(user);
    }
    
    logger.info(`✅ ${createdUsers.length} users seeded successfully`);

    // Display credentials
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('                    TEST CREDENTIALS                         ');
    console.log('═══════════════════════════════════════════════════════════\n');

    const roleGroups = {
      admin: [],
      doctor: [],
      nurse: [],
      secretary: [],
      pharmacist: [],
      'lab-technician': [],
      patient: [],
    };

    users.forEach(user => {
      roleGroups[user.role].push(user);
    });

    Object.entries(roleGroups).forEach(([role, userList]) => {
      if (userList.length > 0) {
        console.log(`\n🔹 ${role.toUpperCase().replace('-', ' ')}:`);
        console.log('─────────────────────────────────────────────────────────');
        userList.forEach(user => {
          console.log(`  Name: ${user.profile.firstName} ${user.profile.lastName}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Password: ${user.password}`);
          if (user.professional?.specialization) {
            console.log(`  Specialization: ${user.professional.specialization.join(', ')}`);
          }
          if (user.professional?.labSpecialization) {
            console.log(`  Lab Specialization: ${user.professional.labSpecialization}`);
          }
          console.log('─────────────────────────────────────────────────────────');
        });
      }
    });

    console.log('\n═══════════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    logger.info('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers();
