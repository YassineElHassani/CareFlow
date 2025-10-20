const app = require('./app');
const logger = require('./config/logger');
const connectDB = require('./config/database');
const redis = require('./config/redis');
const { initializeBuckets, testConnection } = require('./config/minio');

const PORT = process.env.PORT || 3000;

// We'll create a single server instance and handle errors/graceful shutdowns
let server; // holds the HTTP server instance

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('✅ MongoDB connected successfully');

    // Test Redis connection
    await redis.ping();
    logger.info('✅ Redis connected successfully');

    // Initialize MinIO
    await testConnection();
    await initializeBuckets();
    logger.info('✅ MinIO connected and initialized');

    // Start Express server and keep a reference for graceful shutdown
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📚 API Health: http://localhost:${PORT}/api/v1/health`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info('🗄️  MinIO Console: http://localhost:9001');
      logger.info('📧 MailDev UI: http://localhost:1080');
    });

    // Handle server 'error' events (e.g., EADDRINUSE)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Please free the port or change PORT.`);
        process.exit(1);
      }
      logger.error('Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Attempt graceful shutdown
  if (server) {
    server.close(() => {
      logger.info('Server closed due to unhandled rejection');
      process.exit(1);
    });
    // Force exit if not closed in 5 seconds
    setTimeout(() => process.exit(1), 5000).unref();
  } else {
    process.exit(1);
  }
});

// Gracefully handle termination signals
const shutdown = async () => {
  logger.info('Received shutdown signal, closing gracefully...');
  try {
    if (server) await new Promise((resolve) => server.close(resolve));
    // Close DB connection
    try { await require('./config/database').close?.(); } catch (e) { /* ignore */ }
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
