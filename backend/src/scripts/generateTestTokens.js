const mongoose = require('mongoose');
const User = require('../models/UserModel');
const { generateAccessToken } = require('../utils/jwt');
const logger = require('../config/logger');
require('dotenv').config();

const generateTestTokens = async () => {
  try {
    // Connect to database
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/careflow';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ MongoDB connected\n');

    // Find all test users
    const testUsers = [
      'admin@careflow.com',
      'doctor1@careflow.com',
      'doctor2@careflow.com',
      'nurse1@careflow.com',
      'secretary1@careflow.com',
      'pharmacist1@careflow.com',
      'labtech1@careflow.com',
      'patient1@careflow.com',
    ];

    logger.info('═══════════════════════════════════════════════════════════');
    logger.info('                   TEST USER TOKENS');
    logger.info('═══════════════════════════════════════════════════════════\n');

    for (const email of testUsers) {
      const user = await User.findOne({ email });
      if (user) {
        const token = generateAccessToken(user);
        logger.info(`🔹 ${user.role.toUpperCase()}: ${user.profile.firstName} ${user.profile.lastName}`);
        logger.info(`   Email: ${email}`);
        logger.info(`   User ID: ${user._id}`);
        logger.info(`   Token: ${token}`);
        logger.info('');
      }
    }

    logger.info('═══════════════════════════════════════════════════════════\n');
    logger.info('💡 Use these tokens in your Postman Authorization header:');
    logger.info('   Authorization: Bearer <token>\n');

  } catch (error) {
    logger.error('❌ Error generating tokens:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('✅ Database connection closed');
    process.exit(0);
  }
};

// Run the script
generateTestTokens();
