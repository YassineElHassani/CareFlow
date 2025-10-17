require('dotenv').config();
const { Worker } = require('bullmq');
const redis = require('../config/redis');
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost',
  port: process.env.EMAIL_PORT || 1025,
  secure: false,
  auth: process.env.EMAIL_USER ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  } : undefined,
});

const emailWorker = new Worker('emailQueue', async (job) => {
  try {
    const { to, subject, text, html } = job.data;
    
    logger.info(`Sending email to ${to}: ${subject}`);
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@careflow.com',
      to,
      subject,
      text,
      html,
    });
    
    logger.info(`Email sent successfully to ${to}`);
    
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
}, {
  connection: redis,
});

emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed:`, err.message);
});

logger.info('Email worker started and waiting for jobs...');

module.exports = emailWorker;

