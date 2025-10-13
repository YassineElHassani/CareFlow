const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
logger.stream = {
  write: (message) => logger.info(message.trim()),
};
module.exports = logger;
