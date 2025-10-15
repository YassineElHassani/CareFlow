const { Appointment } = require('../models');
const { AppError } = require('../middlewares/ErrorMiddleware');
const { addAppointmentReminderEmail, addAppointmentCancellationEmail } = require('../queues/EmailQueue');

const createAppointment = async (req, res, next) => {
  try {
    const { patient, doctor, scheduledDate, scheduledTime, duration, type, chiefComplaint } = req.body;

    const startAt = new Date(`${scheduledDate}T${scheduledTime}`);
    const endAt = new Date(startAt.getTime() + (duration || 30) * 60000);

    const hasConflict = await Appointment.hasConflict(doctor, startAt, endAt);

    if (hasConflict) {
      throw new AppError('Doctor is not available at this time slot', 409);
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      scheduledDate,
      scheduledTime,
      startAt,
      endAt,
      duration: duration || 30,
      type,
      chiefComplaint,
      createdBy: req.user._id,
    });

    await appointment.populate([
      { path: 'patient', select: 'personalInfo.firstName personalInfo.lastName contact.email contact.phone' },
      { path: 'doctor', select: 'profile.firstName profile.lastName email' },
    ]);

    const reminderDate = new Date(startAt.getTime() - 24 * 60 * 60 * 1000);
    if (reminderDate > new Date()) {
      await addAppointmentReminderEmail({
        to: appointment.patient.contact.email,
        patientName: `${appointment.patient.personalInfo.firstName} ${appointment.patient.personalInfo.lastName}`,
        doctorName: `${appointment.doctor.profile.firstName} ${appointment.doctor.profile.lastName}`,
        appointmentDate: scheduledDate,
        appointmentTime: scheduledTime,
        appointmentType: type,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      doctor,
      patient,
      status,
      type,
      date,
      startDate,
      endDate,
      sortBy = 'scheduledDate',
      sortOrder = 'asc',
    } = req.query;

    const query = {};
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (status) query.status = status;
    if (type) query.type = type;
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      query.scheduledDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.scheduledDate = { $gte: new Date(startDate) };
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('patient', 'personalInfo.firstName personalInfo.lastName contact.phone contact.email patientNumber')
        .populate('doctor', 'profile.firstName profile.lastName email professional.specialization')
        .populate('createdBy', 'profile.firstName profile.lastName')
        .lean(),
      Appointment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: appointments,
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

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'personalInfo contact medical.allergies medical.chronicConditions')
      .populate('doctor', 'profile professional')
      .populate('createdBy', 'profile.firstName profile.lastName')
      .populate('lastModifiedBy', 'profile.firstName profile.lastName');

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const getMyAppointments = async (req, res, next) => {
  try {
    const { Patient } = require('../models');
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      throw new AppError('Patient record not found', 404);
    }

    const { status, upcoming } = req.query;
    const query = { patient: patient._id };

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.startAt = { $gte: new Date() };
    }

    const appointments = await Appointment.find(query)
      .sort({ scheduledDate: -1 })
      .populate('doctor', 'profile.firstName profile.lastName professional.specialization')
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

const getMySchedule = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const query = { doctor: req.user._id };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .sort({ startAt: 1 })
      .populate('patient', 'personalInfo contact medical.allergies medical.chronicConditions')
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

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (req.body.scheduledDate || req.body.scheduledTime || req.body.duration) {
      const scheduledDate = req.body.scheduledDate || appointment.scheduledDate;
      const scheduledTime = req.body.scheduledTime || appointment.scheduledTime;
      const duration = req.body.duration || appointment.duration;

      const startAt = new Date(`${scheduledDate}T${scheduledTime}`);
      const endAt = new Date(startAt.getTime() + duration * 60000);

      const hasConflict = await Appointment.hasConflict(
        appointment.doctor,
        startAt,
        endAt,
        appointment._id,
      );

      if (hasConflict) {
        throw new AppError('Time slot is not available', 409);
      }

      req.body.startAt = startAt;
      req.body.endAt = endAt;
    }

    Object.assign(appointment, req.body);
    appointment.lastModifiedBy = req.user._id;
    await appointment.save();

    await appointment.populate([
      { path: 'patient', select: 'personalInfo contact' },
      { path: 'doctor', select: 'profile professional' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new AppError('Status is required', 400);
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    appointment.status = status;
    appointment.lastModifiedBy = req.user._id;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'personalInfo contact')
      .populate('doctor', 'profile');

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (appointment.status === 'cancelled') {
      throw new AppError('Appointment is already cancelled', 400);
    }

    appointment.status = 'cancelled';
    appointment.cancellation = {
      reason,
      cancelledBy: req.user._id,
      cancelledAt: new Date(),
    };
    await appointment.save();

    await addAppointmentCancellationEmail({
      to: appointment.patient.contact.email,
      patientName: `${appointment.patient.personalInfo.firstName} ${appointment.patient.personalInfo.lastName}`,
      doctorName: `${appointment.doctor.profile.firstName} ${appointment.doctor.profile.lastName}`,
      appointmentDate: appointment.scheduledDate.toISOString().split('T')[0],
      appointmentTime: appointment.scheduledTime,
      reason,
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const { doctor, date, time, duration = 30 } = req.body;

    if (!doctor || !date || !time) {
      throw new AppError('Doctor, date, and time are required', 400);
    }

    const startAt = new Date(`${date}T${time}`);
    const endAt = new Date(startAt.getTime() + duration * 60000);

    const hasConflict = await Appointment.hasConflict(doctor, startAt, endAt);

    res.status(200).json({
      success: true,
      available: !hasConflict,
      message: hasConflict ? 'Time slot is not available' : 'Time slot is available',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getMyAppointments,
  getMySchedule,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
  checkAvailability,
};
