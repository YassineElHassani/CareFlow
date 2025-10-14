const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required'],
  },

  appointmentNumber: {
    type: String,
    unique: true,
  },

  type: {
    type: String,
    enum: [
      'consultation',
      'follow_up',
      'emergency',
      'routine_checkup',
      'lab_test',
      'imaging',
      'vaccination',
    ],
    default: 'consultation',
  },

  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
  }, // Format: '14:30'
  startAt: {
    type: Date,
    required: [true, 'Start time is required'],
  },
  endAt: {
    type: Date,
    required: [true, 'End time is required'],
  },
  duration: {
    type: Number,
    default: 30,
  },

  status: {
    type: String,
    enum: [
      'scheduled',
      'confirmed',
      'checked_in',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
      'rescheduled',
    ],
    default: 'scheduled',
  },

  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'not_applicable'],
    },
  },

  chiefComplaint: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  diagnosis: {
    type: String,
    trim: true,
  },
  prescription: {
    type: String,
    trim: true,
  },

  followUpRequired: {
    type: Boolean,
    default: false,
  },
  followUpDate: Date,
  nextAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },

  notifications: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending'],
      default: 'pending',
    },
    message: String,
  }],

  payment: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'waived'],
      default: 'pending',
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'bank_transfer'],
    },
    transactionId: String,
    paidAt: Date,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

AppointmentSchema.index({ patient: 1, scheduledDate: 1 });
AppointmentSchema.index({ doctor: 1, scheduledDate: 1 });
AppointmentSchema.index({ doctor: 1, startAt: 1, endAt: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ appointmentNumber: 1 }, { unique: true });
AppointmentSchema.index({ scheduledDate: 1, status: 1 });

AppointmentSchema.virtual('isPast').get(function() {
  return this.endAt < new Date();
});

AppointmentSchema.virtual('isToday').get(function() {
  const today = new Date();
  const schedDate = new Date(this.scheduledDate);
  return (
    schedDate.getDate() === today.getDate() &&
    schedDate.getMonth() === today.getMonth() &&
    schedDate.getFullYear() === today.getFullYear()
  );
});

AppointmentSchema.virtual('timeSlot').get(function() {
  const start = new Date(this.startAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const end = new Date(this.endAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${start} - ${end}`;
});

AppointmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.appointmentNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Appointment').countDocuments();
    this.appointmentNumber = `APT-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

AppointmentSchema.pre('save', function(next) {
  if (this.startAt && this.endAt && !this.duration) {
    const durationMs = this.endAt - this.startAt;
    this.duration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
  }
  next();
});

AppointmentSchema.statics.hasConflict = async function(doctorId, startAt, endAt, excludeAppointmentId = null) {
  const query = {
    doctor: doctorId,
    status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
    $or: [
      { startAt: { $lte: startAt }, endAt: { $gt: startAt } },
      { startAt: { $lt: endAt }, endAt: { $gte: endAt } },
      { startAt: { $gte: startAt }, endAt: { $lte: endAt } },
    ],
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

AppointmentSchema.statics.getAvailableSlots = async function(doctorId, date, _slotDuration = 30) {
  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // Work starts at 9 AM

  const endOfDay = new Date(date);
  endOfDay.setHours(17, 0, 0, 0); // Work ends at 5 PM

  const bookedAppointments = await this.find({
    doctor: doctorId,
    scheduledDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
  }).sort({ startAt: 1 });

  return bookedAppointments;
};

module.exports = mongoose.model('Appointment', AppointmentSchema);
