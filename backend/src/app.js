require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/ErrorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CareFlow API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Mount all routes with v1 prefix
app.use('/api/v1', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
