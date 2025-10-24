const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    description: 'Test code (e.g., CBC, BMP, HbA1c)',
  },
  name: {
    type: String,
    required: true,
    description: 'Test name',
  },
  category: {
    type: String,
    enum: ['hematology', 'biochemistry', 'microbiology', 'immunology', 'serology', 'urinalysis', 'pathology', 'radiology', 'genetics', 'other'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine',
  },
  status: {
    type: String,
    enum: ['pending', 'collected', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  specimenType: {
    type: String,
    description: 'e.g., Blood, Urine, Saliva, Tissue',
  },
  notes: String,
  results: {
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    referenceRange: String,
    flag: {
      type: String,
      enum: ['normal', 'low', 'high', 'critical'],
    },
    performedAt: Date,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    interpretation: String,
  },
}, { _id: true });

const labOrderSchema = new mongoose.Schema({
  labOrderNumber: {
    type: String,
    unique: true,
    description: 'Auto-generated lab order number (LAB-YYYY-XXXXX)',
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
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
  tests: {
    type: [testSchema],
    validate: [arrayMinLength, 'At least one test is required'],
  },
  clinicalIndication: {
    type: String,
    required: true,
    description: 'Reason for ordering tests',
  },
  diagnosis: {
    type: String,
    description: 'Provisional or confirmed diagnosis',
  },
  priority: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine',
  },
  status: {
    type: String,
    enum: ['ordered', 'specimen-collected', 'in-progress', 'partially-completed', 'completed', 'cancelled'],
    default: 'ordered',
    required: true,
    index: true,
  },
  laboratory: {
    name: {
      type: String,
      required: true,
    },
    address: String,
    phone: String,
    email: String,
  },
  specimenCollectedAt: {
    type: Date,
    description: 'Date and time specimen was collected',
  },
  specimenCollectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receivedByLabAt: {
    type: Date,
    description: 'Date and time lab received the specimen',
  },
  completedAt: {
    type: Date,
    description: 'Date when all tests completed',
  },
  report: {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      description: 'Reference to uploaded PDF report',
    },
    summary: String,
    generalComments: String,
    pathologistSignature: String,
    reportedAt: Date,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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

// Validation function
function arrayMinLength(val) {
  return val.length > 0;
}

// Auto-generate lab order number
labOrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.labOrderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('LabOrder').countDocuments({
      labOrderNumber: new RegExp(`^LAB-${year}-`),
    });
    this.labOrderNumber = `LAB-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Update overall status based on test statuses
labOrderSchema.pre('save', function(next) {
  if (this.tests && this.tests.length > 0) {
    const statuses = this.tests.map(t => t.status);
    const allCompleted = statuses.every(s => s === 'completed');
    const someCompleted = statuses.some(s => s === 'completed');
    const allCancelled = statuses.every(s => s === 'cancelled');
    
    if (allCompleted) {
      this.status = 'completed';
      if (!this.completedAt) {
        this.completedAt = new Date();
      }
    } else if (allCancelled) {
      this.status = 'cancelled';
    } else if (someCompleted) {
      this.status = 'partially-completed';
    }
  }
  next();
});

labOrderSchema.index({ patient: 1, createdAt: -1 });
labOrderSchema.index({ doctor: 1, createdAt: -1 });
labOrderSchema.index({ status: 1, priority: 1 });
labOrderSchema.index({ 'laboratory.name': 1 });

labOrderSchema.virtual('completionProgress').get(function() {
  if (!this.tests || this.tests.length === 0) return 0;
  const completed = this.tests.filter(t => t.status === 'completed').length;
  return Math.round((completed / this.tests.length) * 100);
});

labOrderSchema.virtual('hasCriticalResults').get(function() {
  if (!this.tests) return false;
  return this.tests.some(t => t.results && t.results.flag === 'critical');
});

labOrderSchema.virtual('abnormalResultsCount').get(function() {
  if (!this.tests) return 0;
  return this.tests.filter(t => 
    t.results && t.results.flag && t.results.flag !== 'normal',
  ).length;
});

const LabOrder = mongoose.model('LabOrder', labOrderSchema);

module.exports = LabOrder;
