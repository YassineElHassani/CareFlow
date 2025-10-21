const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  refreshToken: { type: String, select: false },

  role: {
    type: String,
    enum: {
      values: ['admin', 'doctor', 'nurse', 'secretary', 'patient', 'pharmacist', 'lab-technician'],
      message: '{VALUE} is not a valid role',
    },
    default: 'patient',
    required: true,
  },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },

  profile: {
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
      required() {
        return this.role !== 'patient';
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    dateOfBirth: { type: Date },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Morocco' },
    },
  },

  professional: {
    // Doctor-specific fields
    licenseNumber: { type: String, sparse: true },
    specialization: [{ type: String }],
    department: { type: String },
    qualifications: [{ type: String }],
    yearsOfExperience: { type: Number, min: 0 },
    
    // Pharmacist-specific fields
    pharmacyLicense: {
      type: String,
      sparse: true,
      description: 'Pharmacy license number for pharmacists',
    },
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pharmacy',
      description: 'Assigned pharmacy for pharmacist',
    },
    
    // Lab Technician-specific fields
    labLicense: {
      type: String,
      sparse: true,
      description: 'Laboratory license number for lab technicians',
    },
    laboratory: {
      type: String,
      description: 'Assigned laboratory name',
    },
    labSpecialization: {
      type: String,
      description: 'Laboratory specialization (e.g., Hematology, Microbiology)',
    },
  },

  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  suspensionReason: { type: String },
  suspendedAt: { type: Date },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ 'professional.specialization': 1 });

UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 },
  });
};

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
