const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  open: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    description: 'Opening time in HH:MM format',
  },
  close: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    description: 'Closing time in HH:MM format',
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const pharmacistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
}, { _id: false });

const inventoryItemSchema = new mongoose.Schema({
  medicationName: {
    type: String,
    required: true,
  },
  genericName: String,
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    default: 'units',
  },
  expiryDate: Date,
  lastRestocked: Date,
}, { _id: false });

const pharmacySchema = new mongoose.Schema({
  pharmacyNumber: {
    type: String,
    unique: true,
    description: 'Auto-generated pharmacy number (PH-YYYY-XXXXX)',
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    description: 'Official pharmacy license number',
  },
  contact: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    fax: String,
    website: String,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'Morocco',
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  operatingHours: [operatingHoursSchema],
  is24Hours: {
    type: Boolean,
    default: false,
  },
  pharmacist: pharmacistSchema,
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    description: 'Pharmacists assigned to this pharmacy',
  }],
  services: [{
    type: String,
    enum: ['prescription-dispensing', 'delivery', 'consultation', 'vaccination', 'blood-pressure-monitoring', 'diabetes-care', 'compounding'],
  }],
  inventory: [inventoryItemSchema],
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: String,
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

// Auto-generate pharmacy number
pharmacySchema.pre('save', async function(next) {
  if (this.isNew && !this.pharmacyNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Pharmacy').countDocuments({
      pharmacyNumber: new RegExp(`^PH-${year}-`),
    });
    this.pharmacyNumber = `PH-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

pharmacySchema.index({ name: 'text' });
pharmacySchema.index({ 'address.city': 1, isActive: 1 });
pharmacySchema.index({ licenseNumber: 1 });

pharmacySchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.postalCode}, ${this.address.country}`;
});

pharmacySchema.methods.isOpenAt = function(datetime = new Date()) {
  if (this.is24Hours) return true;
  
  const dayOfWeek = datetime.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const hours = this.operatingHours.find(h => h.day === dayOfWeek);
  
  if (!hours || hours.isClosed) return false;
  
  const currentTime = datetime.toTimeString().slice(0, 5); // HH:MM
  return currentTime >= hours.open && currentTime <= hours.close;
};

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

module.exports = Pharmacy;
