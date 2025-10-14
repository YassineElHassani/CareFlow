const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required'],
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required'],
  },

  recordNumber: {
    type: String,
    unique: true,
    required: true,
  },

  recordType: {
    type: String,
    enum: [
      'consultation',
      'lab_result',
      'imaging',
      'prescription',
      'procedure',
      'discharge',
      'referral',
    ],
    required: true,
  },

  visitDate: {
    type: Date,
    required: [true, 'Visit date is required'],
    default: Date.now,
  },
  department: {
    type: String,
    trim: true,
  },

  vitalSigns: {
    temperature: {
      value: Number,
      unit: { type: String, default: 'C' },
    }, // Celsius
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    heartRate: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: {
      value: Number,
      unit: { type: String, default: 'kg' },
    },
    height: {
      value: Number,
      unit: { type: String, default: 'cm' },
    },
    bmi: Number,
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },

  // (Patient's complaint)
  subjective: {
    chiefComplaint: {
      type: String,
      trim: true,
    },
    historyOfPresentIllness: {
      type: String,
      trim: true,
    },
    symptoms: [{ type: String }],
    duration: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
    },
  },

  // (Doctor's findings)
  objective: {
    physicalExamination: {
      type: String,
      trim: true,
    },
    findings: [{ type: String }],
    laboratoryResults: String,
    imagingResults: String,
  },

  // (Diagnosis)
  assessment: {
    diagnosis: [{
      code: String,
      description: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['primary', 'secondary', 'differential'],
        default: 'primary',
      },
      status: {
        type: String,
        enum: ['confirmed', 'suspected', 'ruled_out'],
        default: 'confirmed',
      },
    }],
    differentialDiagnosis: [{ type: String }],
  },

  // (Treatment)
  plan: {
    prescriptions: [{
      medication: {
        type: String,
        required: true,
      },
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
      refills: {
        type: Number,
        default: 0,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: Date,
    }],

    procedures: [{
      name: {
        type: String,
        required: true,
      },
      description: String,
      scheduledDate: Date,
      completedDate: Date,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      outcome: String,
    }],

    referrals: [{
      specialty: String,
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: String,
      urgency: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine',
      },
      status: {
        type: String,
        enum: ['pending', 'scheduled', 'completed', 'cancelled'],
        default: 'pending',
      },
    }],

    // Lab Tests
    labTests: [{
      testName: {
        type: String,
        required: true,
      },
      testCode: String,
      ordered: {
        type: Boolean,
        default: true,
      },
      orderedDate: {
        type: Date,
        default: Date.now,
      },
      completedDate: Date,
      results: String,
      attachments: [{ type: String }],
      abnormalFlag: Boolean,
    }],

    followUp: {
      required: {
        type: Boolean,
        default: false,
      },
      date: Date,
      duration: String,
      instructions: String,
    },
  },

  attachments: [{
    name: String,
    type: {
      type: String,
      enum: ['image', 'pdf', 'lab_report', 'scan', 'other'],
    },
    url: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],

  clinicalNotes: {
    type: String,
    trim: true,
  },
  privateNotes: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    enum: ['draft', 'final', 'amended', 'archived'],
    default: 'draft',
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  signedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  signedAt: Date,

  billing: {
    totalCost: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    insuranceCovered: Number,
    patientResponsibility: Number,
    billingCodes: [{ type: String }],
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

MedicalRecordSchema.index({ patient: 1, visitDate: -1 });
MedicalRecordSchema.index({ doctor: 1 });
MedicalRecordSchema.index({ appointment: 1 });
MedicalRecordSchema.index({ recordNumber: 1 }, { unique: true });
MedicalRecordSchema.index({ recordType: 1 });
MedicalRecordSchema.index({ status: 1 });
MedicalRecordSchema.index({ visitDate: -1 });

MedicalRecordSchema.virtual('isSigned').get(function() {
  return !!(this.signedBy && this.signedAt);
});

MedicalRecordSchema.virtual('canEdit').get(function() {
  return !this.isLocked && this.status !== 'archived';
});

MedicalRecordSchema.pre('save', async function(next) {
  if (this.isNew && !this.recordNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('MedicalRecord').countDocuments();
    this.recordNumber = `MR-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

MedicalRecordSchema.pre('save', function(next) {
  if (
    this.vitalSigns?.height?.value &&
    this.vitalSigns?.weight?.value
  ) {
    const heightInMeters = this.vitalSigns.height.value / 100;
    const weightInKg = this.vitalSigns.weight.value;
    this.vitalSigns.bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
  }
  next();
});

MedicalRecordSchema.pre('save', function(next) {
  if (this.isModified('signedBy') && this.signedBy) {
    this.isLocked = true;
    this.status = 'final';
    if (!this.signedAt) {
      this.signedAt = new Date();
    }
  }
  next();
});

MedicalRecordSchema.methods.sign = async function(doctorId) {
  if (this.isLocked) {
    throw new Error('Record is already signed and locked');
  }
  this.signedBy = doctorId;
  this.signedAt = new Date();
  this.isLocked = true;
  this.status = 'final';
  return await this.save();
};

MedicalRecordSchema.methods.amend = async function(_amendments, _doctorId) {
  if (!this.isSigned) {
    throw new Error('Only signed records can be amended');
  }
  this.status = 'amended';
  this.isLocked = false;
  return await this.save();
};

MedicalRecordSchema.statics.getPatientHistory = async function(patientId, options = {}) {
  const { limit = 10, skip = 0, recordType } = options;

  const query = { patient: patientId };
  if (recordType) {
    query.recordType = recordType;
  }

  return await this.find(query)
    .sort({ visitDate: -1 })
    .limit(limit)
    .skip(skip)
    .populate('doctor', 'profile.firstName profile.lastName professional.specialization')
    .populate('appointment', 'appointmentNumber scheduledDate');
};

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
