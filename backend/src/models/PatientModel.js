const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },

  patientNumber: {
    type: String,
    unique: true,
  },

  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    nationalId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
    },
    ssn: { type: String },
  },

  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Morocco' },
    },
  },

  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
  },

  insurance: {
    provider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    groupNumber: { type: String, trim: true },
    validFrom: Date,
    validUntil: Date,
    isPrimary: { type: Boolean, default: true },
  },

  medical: {
    allergies: [{
      allergen: { type: String, required: true },
      reaction: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'moderate',
      },
      recordedDate: { type: Date, default: Date.now },
    }],

    chronicConditions: [{
      condition: { type: String, required: true },
      diagnosedDate: Date,
      status: {
        type: String,
        enum: ['active', 'resolved', 'managed'],
        default: 'active',
      },
    }],

    medications: [{
      name: { type: String, required: true },
      dosage: String,
      frequency: String,
      startDate: { type: Date, default: Date.now },
      endDate: Date,
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    }],

    immunizations: [{
      vaccine: { type: String, required: true },
      date: { type: Date, required: true },
      administeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      nextDueDate: Date,
      batchNumber: String,
    }],

    familyHistory: [{
      relation: String,
      condition: String,
      ageOfOnset: Number,
      notes: String,
    }],
  },

  preferences: {
    preferredLanguage: { type: String, default: 'en' },
    preferredDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    communicationMethod: {
      type: String,
      enum: ['email', 'sms', 'phone', 'mail'],
      default: 'email',
    },
  },

  consents: {
    dataSharing: {
      agreed: { type: Boolean, default: false },
      date: Date,
    },
    treatmentConsent: {
      agreed: { type: Boolean, default: false },
      date: Date,
    },
    researchParticipation: {
      agreed: { type: Boolean, default: false },
      date: Date,
    },
  },

  isActive: { type: Boolean, default: true },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  notes: { type: String },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

PatientSchema.index({ patientNumber: 1 }, { unique: true });
PatientSchema.index({ userId: 1 }, { sparse: true, unique: true });
PatientSchema.index({ 'personalInfo.nationalId': 1 }, { sparse: true, unique: true });
PatientSchema.index({ 'contact.email': 1 }, { sparse: true });
PatientSchema.index({ 'contact.phone': 1 });
PatientSchema.index({ assignedDoctor: 1 });
PatientSchema.index({ isActive: 1 });
PatientSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });

PatientSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

PatientSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

PatientSchema.pre('save', async function(next) {
  if (this.isNew && !this.patientNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Patient').countDocuments();
    this.patientNumber = `P-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

PatientSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  if (obj.personalInfo.ssn) {
    obj.personalInfo.ssn = '***-**-' + obj.personalInfo.ssn.slice(-4);
  }
  return obj;
};

module.exports = mongoose.model('Patient', PatientSchema);
