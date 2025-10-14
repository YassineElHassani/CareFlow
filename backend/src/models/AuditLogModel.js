const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },

  action: {
    type: String,
    enum: [
      'create',
      'read',
      'update',
      'delete',
      'login',
      'logout',
      'export',
      'print',
      'download',
      'failed_login',
    ],
    required: true,
  },
  resource: {
    type: String,
    enum: [
      'user',
      'patient',
      'appointment',
      'medical_record',
      'prescription',
      'lab_result',
      'system',
    ],
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  description: {
    type: String,
    trim: true,
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },

  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  location: {
    country: String,
    city: String,
  },

  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },

  reason: {
    type: String,
    trim: true,
  },

  success: {
    type: Boolean,
    default: true,
  },
  errorMessage: {
    type: String,
  },
  statusCode: {
    type: Number,
  },

  requestMethod: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
  requestUrl: {
    type: String,
  },
  responseTime: {
    type: Number,
  },

  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },

}, {
  timestamps: false,
  capped: { size: 104857600, max: 100000 },
});

AuditLogSchema.index({ user: 1, timestamp: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });

AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

AuditLogSchema.statics.logAction = async function(data) {
  try {
    const log = new this({
      user: data.userId,
      userEmail: data.userEmail,
      userRole: data.userRole,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      description: data.description,
      changes: data.changes,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      reason: data.reason,
      success: data.success !== undefined ? data.success : true,
      errorMessage: data.errorMessage,
      statusCode: data.statusCode,
      requestMethod: data.requestMethod,
      requestUrl: data.requestUrl,
      responseTime: data.responseTime,
      severity: data.severity || 'low',
    });

    await log.save();
    return log;
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      const logger = require('../config/logger');
      logger.error('Audit log error:', error);
    }
    return null;
  }
};

AuditLogSchema.statics.getUserActivity = async function(userId, options = {}) {
  const { limit = 50, skip = 0, startDate, endDate } = options;

  const query = { user: userId };

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  return await this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .select('-userAgent -ipAddress');
};

AuditLogSchema.statics.getResourceHistory = async function(resource, resourceId, options = {}) {
  const { limit = 50 } = options;

  return await this.find({
    resource,
    resourceId,
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user', 'profile.firstName profile.lastName email role');
};

AuditLogSchema.statics.getFailedLogins = async function(options = {}) {
  const { startDate, limit = 100 } = options;

  const query = {
    action: 'failed_login',
    success: false,
  };

  if (startDate) {
    query.timestamp = { $gte: new Date(startDate) };
  }

  return await this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit);
};

AuditLogSchema.statics.getSuspiciousActivity = async function(timeWindowMinutes = 30) {
  const startTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

  return await this.aggregate([
    {
      $match: {
        action: 'failed_login',
        success: false,
        timestamp: { $gte: startTime },
      },
    },
    {
      $group: {
        _id: '$ipAddress',
        count: { $sum: 1 },
        attempts: { $push: { user: '$userEmail', timestamp: '$timestamp' } },
      },
    },
    {
      $match: {
        count: { $gte: 5 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

module.exports = mongoose.model('AuditLog', AuditLogSchema);
