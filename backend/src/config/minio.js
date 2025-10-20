const Minio = require('minio');
const logger = require('./logger');

const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ROOT_USER || 'admin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'password',
  region: process.env.MINIO_REGION || 'us-east-1',
};

// Log configuration (without sensitive data)
logger.info('MinIO Configuration:', {
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: minioConfig.useSSL,
  region: minioConfig.region,
  accessKey: minioConfig.accessKey.substring(0, 4) + '***',
});

// Create MinIO client instance
const minioClient = new Minio.Client(minioConfig);

// Bucket names from environment
const BUCKETS = {
  DOCUMENTS: process.env.MINIO_BUCKET_DOCUMENTS || 'careflow-documents',
  LAB_REPORTS: process.env.MINIO_BUCKET_LAB_REPORTS || 'careflow-lab-reports',
  PRESCRIPTIONS: process.env.MINIO_BUCKET_PRESCRIPTIONS || 'careflow-prescriptions',
};

/**
 * Initialize MinIO buckets
 * Creates buckets if they don't exist
 */
const initializeBuckets = async () => {
  try {
    logger.info('🗄️  Initializing MinIO buckets...');

    for (const [name, bucket] of Object.entries(BUCKETS)) {
      const exists = await minioClient.bucketExists(bucket);
      
      if (!exists) {
        await minioClient.makeBucket(bucket, minioConfig.region);
        logger.info(`✅ Bucket created: ${bucket}`);
      } else {
        logger.info(`✅ Bucket exists: ${bucket}`);
      }
    }

    logger.info('✅ MinIO initialized successfully');
    return true;
  } catch (error) {
    logger.error('❌ MinIO initialization failed:', error);
    throw error;
  }
};

/**
 * Test MinIO connection
 */
const testConnection = async () => {
  try {
    const buckets = await minioClient.listBuckets();
    logger.info(`✅ MinIO connected. Found ${buckets.length} bucket(s)`);
    return true;
  } catch (error) {
    logger.error('❌ MinIO connection failed:', error);
    return false;
  }
};

/**
 * Get pre-signed URL for file download (expires in 10 minutes)
 */
const getPresignedUrl = async (bucketName, objectName, expirySeconds = 600) => {
  try {
    const url = await minioClient.presignedGetObject(
      bucketName,
      objectName,
      expirySeconds,
    );
    return url;
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    throw error;
  }
};

/**
 * Upload file to MinIO
 */
const uploadFile = async (bucketName, objectName, fileBuffer, metadata = {}) => {
  try {
    const result = await minioClient.putObject(
      bucketName,
      objectName,
      fileBuffer,
      fileBuffer.length,
      metadata,
    );
    
    logger.info(`✅ File uploaded: ${objectName} to ${bucketName}`);
    return result;
  } catch (error) {
    logger.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete file from MinIO
 */
const deleteFile = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
    logger.info(`✅ File deleted: ${objectName} from ${bucketName}`);
    return true;
  } catch (error) {
    logger.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get file metadata
 */
const getFileMetadata = async (bucketName, objectName) => {
  try {
    const stat = await minioClient.statObject(bucketName, objectName);
    return stat;
  } catch (error) {
    logger.error('Error getting file metadata:', error);
    throw error;
  }
};

module.exports = {
  minioClient,
  BUCKETS,
  initializeBuckets,
  testConnection,
  getPresignedUrl,
  uploadFile,
  deleteFile,
  getFileMetadata,
};
