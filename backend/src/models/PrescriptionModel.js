const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    description: 'Medication name',
  },
  genericName: {
    type: String,
    description: 'Generic/scientific name',
  },
  dosage: {
    type: String,
    required: true,
    description: 'e.g., 500mg, 10ml',
  },
  route: {
    type: String,
    enum: ['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhalation', 'rectal', 'sublingual', 'transdermal', 'ophthalmic', 'otic', 'nasal'],
    required: true,
    description: 'Route of administration',
  },
  frequency: {
    type: String,
    required: true,
    description: 'e.g., 3 times daily, every 8 hours, once daily',
  },
  duration: {
    type: String,
    required: true,
    description: 'e.g., 7 days, 2 weeks, 1 month',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    description: 'Total quantity to dispense',
  },
  refills: {
    type: Number,
    default: 0,
    min: 0,
    max: 12,
    description: 'Number of refills allowed',
  },
  instructions: {
    type: String,
    description: 'Special instructions (e.g., take with food, avoid alcohol)',
  },
  isDispensed: {
    type: Boolean,
    default: false,
  },
  dispensedAt: Date,
  dispensedQuantity: Number,
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    unique: true,
    description: 'Auto-generated prescription number (RX-YYYY-XXXXX)',
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true,
    index: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    index: true,
    description: 'Assigned pharmacy for dispensing',
  },
  medications: {
    type: [medicationSchema],
    validate: [arrayMinLength, 'At least one medication is required'],
  },
  diagnosis: {
    type: String,
    required: true,
    description: 'Primary diagnosis for prescription',
  },
  notes: {
    type: String,
    description: 'Additional notes for pharmacist',
  },
  status: {
    type: String,
    enum: ['draft', 'signed', 'sent', 'partially-dispensed', 'dispensed', 'cancelled', 'expired'],
    default: 'draft',
    required: true,
    index: true,
  },
  signedAt: {
    type: Date,
    description: 'Date when prescription was digitally signed',
  },
  signedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    description: 'Doctor who signed the prescription',
  },
  digitalSignature: {
    type: String,
    description: 'Digital signature hash',
  },
  sentToPharmacyAt: {
    type: Date,
    description: 'Date when sent to pharmacy',
  },
  dispensedAt: {
    type: Date,
    description: 'Date when fully dispensed',
  },
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    description: 'Pharmacist who dispensed medications',
  },
  expiresAt: {
    type: Date,
    description: 'Prescription expiry date (typically 30 days from creation)',
  },
  isRenewal: {
    type: Boolean,
    default: false,
  },
  originalPrescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    description: 'Reference to original prescription if this is a renewal',
  },
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

function arrayMinLength(val) {
  return val.length > 0;
}

// Auto-generate prescription number
prescriptionSchema.pre('save', async function(next) {
  if (this.isNew && !this.prescriptionNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Prescription').countDocuments({
      prescriptionNumber: new RegExp(`^RX-${year}-`),
    });
    this.prescriptionNumber = `RX-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Set expiry date on creation (30 days)
prescriptionSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ pharmacy: 1, status: 1 });
prescriptionSchema.index({ status: 1, expiresAt: 1 });

prescriptionSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

prescriptionSchema.virtual('dispensingProgress').get(function() {
  if (!this.medications || this.medications.length === 0) return 0;
  const dispensed = this.medications.filter(m => m.isDispensed).length;
  return Math.round((dispensed / this.medications.length) * 100);
});

prescriptionSchema.virtual('totalMedications').get(function() {
  return this.medications ? this.medications.length : 0;
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
