const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`CareFlow API listening on port ${PORT}`);
  logger.info(`API Health: http://localhost:${PORT}/api/v1/health`);
  logger.info(`API Docs: http://localhost:${PORT}/api/v1`);
});
