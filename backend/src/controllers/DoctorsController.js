const { User, Appointment } = require('../models');
const { AppError } = require('../middlewares/ErrorMiddleware');

const getDoctors = async (req, res, next) => {
  try {
    const { specialization, isActive, page = 1, limit = 20 } = req.query;

    const query = { role: 'doctor' };

    if (specialization) {
      query['professional.specialization'] = { $regex: specialization, $options: 'i' };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      User.find(query)
        .select('profile professional email')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
    }).select('profile professional email isActive');

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const searchDoctors = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      throw new AppError('Search query is required', 400);
    }

    const doctors = await User.find({
      role: 'doctor',
      isActive: true,
      $or: [
        { 'profile.firstName': { $regex: q, $options: 'i' } },
        { 'profile.lastName': { $regex: q, $options: 'i' } },
        { 'professional.specialization': { $regex: q, $options: 'i' } },
        { 'professional.department': { $regex: q, $options: 'i' } },
      ],
    })
      .select('profile professional email')
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      throw new AppError('Date is required', 400);
    }

    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
      isActive: true,
    });

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Define working hours (9 AM - 5 PM)
    const workStart = 9;
    const workEnd = 17;
    const slotDuration = 30; // minutes

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: req.params.id,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] },
    })
      .select('startAt endAt')
      .lean();

    const allSlots = [];
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        if (slotEnd.getHours() <= workEnd) {
          allSlots.push({
            start: slotStart,
            end: slotEnd,
            time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
          });
        }
      }
    }

    // Check which slots are available
    const availableSlots = allSlots.filter((slot) => {
      const hasConflict = bookedAppointments.some((appointment) => {
        return (
          (slot.start >= appointment.startAt && slot.start < appointment.endAt) ||
          (slot.end > appointment.startAt && slot.end <= appointment.endAt) ||
          (slot.start <= appointment.startAt && slot.end >= appointment.endAt)
        );
      });

      return !hasConflict && slot.start > new Date();
    });

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor._id,
          name: `${doctor.profile.firstName} ${doctor.profile.lastName}`,
          specialization: doctor.professional.specialization,
        },
        date,
        workingHours: {
          start: `${workStart}:00`,
          end: `${workEnd}:00`,
        },
        totalSlots: allSlots.length,
        availableSlots: availableSlots.length,
        bookedSlots: allSlots.length - availableSlots.length,
        slots: availableSlots.map((slot) => ({
          time: slot.time,
          available: true,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorAppointments = async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;

    if (req.user.role === 'doctor' && req.user._id.toString() !== req.params.id) {
      throw new AppError('You can only view your own appointments', 403);
    }

    const query = { doctor: req.params.id };

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.scheduledDate = { $gte: new Date(startDate) };
    }

    const appointments = await Appointment.find(query)
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .populate('patient', 'personalInfo contact patientNumber')
      .lean();

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  searchDoctors,
  getDoctorAvailability,
  getDoctorAppointments,
};
