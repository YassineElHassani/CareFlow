const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
  bloodPressure: {
    systolic: {
      type: Number,
      min: 0,
      max: 300,
    },
    diastolic: {
      type: Number,
      min: 0,
      max: 200,
    },
  },
  heartRate: {
    type: Number,
    min: 0,
    max: 300,
    description: 'Beats per minute',
  },
  temperature: {
    value: {
      type: Number,
      min: 0,
      max: 50,
    },
    unit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius',
    },
  },
  weight: {
    value: {
      type: Number,
      min: 0,
      max: 500,
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
  },
  height: {
    value: {
      type: Number,
      min: 0,
      max: 300,
    },
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm',
    },
  },
  bmi: {
    type: Number,
    min: 0,
    max: 100,
  },
  respiratoryRate: {
    type: Number,
    min: 0,
    max: 100,
    description: 'Breaths per minute',
  },
  oxygenSaturation: {
    type: Number,
    min: 0,
    max: 100,
    description: 'SpO2 percentage',
  },
}, { _id: false });

const procedureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  performedAt: {
    type: Date,
    default: Date.now,
  },
  notes: String,
}, { _id: false });

const diagnosisSchema = new mongoose.Schema({
  code: {
    type: String,
    description: 'ICD-10 or other diagnostic code',
  },
  name: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'critical'],
  },
  notes: String,
}, { _id: false });

const consultationSchema = new mongoose.Schema({
  consultationNumber: {
    type: String,
    unique: true,
    description: 'Auto-generated consultation number (CONS-YYYY-XXXXX)',
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
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
  consultationDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  chiefComplaint: {
    type: String,
    required: true,
    description: 'Main reason for visit',
  },
  historyOfPresentIllness: {
    type: String,
    description: 'Detailed history of current symptoms',
  },
  vitalSigns: vitalSignsSchema,
  physicalExamination: {
    general: String,
    cardiovascular: String,
    respiratory: String,
    gastrointestinal: String,
    neurological: String,
    musculoskeletal: String,
    skin: String,
    other: String,
  },
  diagnoses: [diagnosisSchema],
  procedures: [procedureSchema],
  treatmentPlan: {
    type: String,
    description: 'Recommended treatment and care plan',
  },
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  }],
  labOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabOrder',
  }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  }],
  followUp: {
    required: {
      type: Boolean,
      default: false,
    },
    recommendedDate: Date,
    instructions: String,
  },
  notes: {
    type: String,
    description: 'Additional clinical notes',
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'cancelled'],
    default: 'in-progress',
    index: true,
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
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

consultationSchema.pre('save', async function(next) {
  if (this.isNew && !this.consultationNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Consultation').countDocuments({
      consultationNumber: new RegExp(`^CONS-${year}-`),
    });
    this.consultationNumber = `CONS-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

consultationSchema.pre('save', function(next) {
  if (this.vitalSigns && this.vitalSigns.weight && this.vitalSigns.height) {
    const weightKg = this.vitalSigns.weight.unit === 'lbs' 
      ? this.vitalSigns.weight.value * 0.453592 
      : this.vitalSigns.weight.value;
    
    const heightM = this.vitalSigns.height.unit === 'inches' 
      ? this.vitalSigns.height.value * 0.0254 
      : this.vitalSigns.height.value / 100;
    
    this.vitalSigns.bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(2));
  }
  next();
});

consultationSchema.index({ patient: 1, consultationDate: -1 });
consultationSchema.index({ doctor: 1, consultationDate: -1 });
consultationSchema.index({ appointment: 1 });
consultationSchema.index({ status: 1, consultationDate: -1 });

consultationSchema.virtual('bmiCategory').get(function() {
  if (!this.vitalSigns || !this.vitalSigns.bmi) return null;
  
  const bmi = this.vitalSigns.bmi;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
});

consultationSchema.virtual('bloodPressureCategory').get(function() {
  if (!this.vitalSigns || !this.vitalSigns.bloodPressure) return null;
  
  const { systolic, diastolic } = this.vitalSigns.bloodPressure;
  if (!systolic || !diastolic) return null;
  
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'Hypertension Stage 1';
  if (systolic < 180 || diastolic < 120) return 'Hypertension Stage 2';
  return 'Hypertensive Crisis';
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
