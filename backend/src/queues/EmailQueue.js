const { Queue } = require('bullmq');
const redis = require('../config/redis');
const logger = require('../config/logger');

const emailQueue = new Queue('emailQueue', {
  connection: redis,
});

emailQueue.on('error', (err) => {
  logger.error('Email queue error:', err);
});

const addWelcomeEmail = async ({ to, firstName, role }) => {
  try {
    await emailQueue.add('welcome-email', {
      to,
      subject: 'Welcome to CareFlow EHR',
      text: `Hello ${firstName}, welcome to CareFlow! Your account as ${role} has been created successfully.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Welcome to CareFlow EHR!</h2>
          <p>Hello <strong>${firstName}</strong>,</p>
          <p>Your account as <strong>${role}</strong> has been created successfully.</p>
          <p>You can now log in to access your dashboard and start using CareFlow.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
               style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Login to Dashboard
            </a>
          </div>
          <p style="color: #7f8c8d; font-size: 12px; margin-top: 40px;">
            If you didn't create this account, please contact support immediately.
          </p>
        </div>
      `,
    });
    logger.info(`Welcome email queued for ${to}`);
  } catch (error) {
    logger.error('Failed to queue welcome email:', error);
    throw error;
  }
};

const addPasswordResetEmail = async ({ to, firstName, resetUrl }) => {
  try {
    await emailQueue.add('password-reset-email', {
      to,
      subject: 'Password Reset Request - CareFlow EHR',
      text: `Hello ${firstName}, you requested a password reset. Use this link to reset your password: ${resetUrl}. This link expires in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>Hello <strong>${firstName}</strong>,</p>
          <p>We received a request to reset your password for your CareFlow account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </div>
          <p style="color: #7f8c8d; font-size: 14px;">
            Or copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #3498db;">${resetUrl}</a>
          </p>
          <p style="color: #e74c3c; font-size: 14px; margin-top: 20px;">
            This link will expire in 1 hour.
          </p>
          <p style="color: #7f8c8d; font-size: 12px; margin-top: 40px;">
            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      `,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    logger.info(`📧 Password reset email queued for ${to}`);
  } catch (error) {
    logger.error('Failed to queue password reset email:', error);
    throw error;
  }
};

const addAppointmentReminderEmail = async ({ to, patientName, doctorName, appointmentDate, appointmentTime, appointmentType }) => {
  try {
    await emailQueue.add('appointment-reminder-email', {
      to,
      subject: 'Appointment Reminder - CareFlow EHR',
      text: `Hello ${patientName}, this is a reminder about your ${appointmentType} appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Appointment Reminder</h2>
          <p>Hello <strong>${patientName}</strong>,</p>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          <div style="background-color: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Type:</strong> ${appointmentType}</p>
            <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
          </div>
          <p style="color: #27ae60; font-weight: bold;">
            ✓ Please arrive 15 minutes early for check-in.
          </p>
          <p style="color: #7f8c8d; font-size: 12px; margin-top: 40px;">
            If you need to reschedule or cancel, please contact us as soon as possible.
          </p>
        </div>
      `,
    }, {
      // Schedule for 24 hours before appointment
      delay: 0, // Calculated by the scheduler
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
    logger.info(`📧 Appointment reminder email queued for ${to}`);
  } catch (error) {
    logger.error('Failed to queue appointment reminder email:', error);
    throw error;
  }
};

const addAppointmentCancellationEmail = async ({ to, patientName, doctorName, appointmentDate, appointmentTime, reason }) => {
  try {
    await emailQueue.add('appointment-cancellation-email', {
      to,
      subject: 'Appointment Cancelled - CareFlow EHR',
      text: `Hello ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} at ${appointmentTime} has been cancelled. Reason: ${reason || 'Not specified'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Appointment Cancelled</h2>
          <p>Hello <strong>${patientName}</strong>,</p>
          <p>Your appointment has been cancelled:</p>
          <div style="background-color: #fadbd8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
            ${reason ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
          </div>
          <p>If you'd like to reschedule, please contact us or book a new appointment through your patient portal.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/appointments" 
               style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Book New Appointment
            </a>
          </div>
        </div>
      `,
    });
    logger.info(`📧 Appointment cancellation email queued for ${to}`);
  } catch (error) {
    logger.error('Failed to queue appointment cancellation email:', error);
    throw error;
  }
};

module.exports = {
  emailQueue,
  addWelcomeEmail,
  addPasswordResetEmail,
  addAppointmentReminderEmail,
  addAppointmentCancellationEmail,
};

