const Appointment = require('../models/AppointmentModel');
const Redis = require('ioredis');
const Redlock = require('redlock');

const redis = new Redis({ host: process.env.REDIS_HOST || 'localhost' });
const redlock = new Redlock([redis], { retryCount: 3, retryDelay: 200 });

async function createAppointment({ doctor, patient, startAt, endAt, notes }) {
  const lockKey = `locks:doctor:${doctor}`;
  const ttl = 5000; // ms

  const lock = await redlock.acquire([lockKey], ttl);
  try {
    const conflict = await Appointment.findOne({
      doctor,
      status: { $ne: 'canceled' },
      $and: [
        { startAt: { $lt: endAt } },
        { endAt: { $gt: startAt } },
      ],
    }).lean();

    if (conflict) {
      const err = new Error('Scheduling conflict');
      err.status = 409;
      throw err;
    }

    const appt = await Appointment.create({ doctor, patient, startAt, endAt, notes });
    return appt;
  } finally {
    await lock.release().catch(() => {});
  }
}

module.exports = { createAppointment };
