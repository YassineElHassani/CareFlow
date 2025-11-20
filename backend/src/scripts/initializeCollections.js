const mongoose = require('mongoose');
const logger = require('../config/logger');
require('dotenv').config();

// Import all models to ensure they're registered
const {
  User,
  Patient,
  Appointment,
  MedicalRecord,
  AuditLog,
  Consultation,
  Prescription,
  Pharmacy,
  LabOrder,
} = require('../models');

const initializeCollections = async () => {
  try {
    // Connect to database
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/careflow';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ MongoDB connected');

    // Get all registered models
    const models = [
      { name: 'User', model: User },
      { name: 'Patient', model: Patient },
      { name: 'Appointment', model: Appointment },
      { name: 'MedicalRecord', model: MedicalRecord },
      { name: 'AuditLog', model: AuditLog },
      { name: 'Consultation', model: Consultation },
      { name: 'Prescription', model: Prescription },
      { name: 'Pharmacy', model: Pharmacy },
      { name: 'LabOrder', model: LabOrder },
    ];

    logger.info('🔄 Initializing collections and indexes...\n');

    for (const { name, model } of models) {
      try {
        // Create collection if it doesn't exist
        const collectionName = model.collection.name;
        const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
        
        if (collections.length === 0) {
          await mongoose.connection.db.createCollection(collectionName);
          logger.info(`✅ Created collection: ${collectionName}`);
        } else {
          logger.info(`ℹ️  Collection already exists: ${collectionName}`);
        }

        // Sync indexes (create/update indexes defined in the model)
        await model.syncIndexes();
        logger.info(`✅ Synced indexes for: ${collectionName}`);

        // Show collection stats
        const stats = await mongoose.connection.db.collection(collectionName).stats();
        logger.info(`   Documents: ${stats.count}, Size: ${(stats.size / 1024).toFixed(2)} KB\n`);

      } catch (error) {
        logger.error(`❌ Error initializing ${name}:`, error.message);
      }
    }

    // List all collections
    const allCollections = await mongoose.connection.db.listCollections().toArray();
    logger.info('\n📋 All collections in database:');
    allCollections.forEach((col) => {
      logger.info(`   - ${col.name}`);
    });

    logger.info('\n✅ Collection initialization complete!');

  } catch (error) {
    logger.error('❌ Error during collection initialization:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('✅ Database connection closed');
    process.exit(0);
  }
};

// Run the initialization
initializeCollections();
