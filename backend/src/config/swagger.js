const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareFlow EHR API',
      version: '1.0.0',
      description: 'Electronic Health Record (EHR) system for clinics and medical practices',
      contact: {
        name: 'CareFlow Support',
        email: 'support@careflow.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.careflow.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'role'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '60d5ec49f1b2c72b8c8e4f1a',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'doctor@careflow.com',
            },
            role: {
              type: 'string',
              enum: ['admin', 'doctor', 'nurse', 'patient', 'secretary'],
              description: 'User role',
              example: 'doctor',
            },
            profile: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  example: 'John',
                },
                lastName: {
                  type: 'string',
                  example: 'Doe',
                },
                phone: {
                  type: 'string',
                  example: '+1234567890',
                },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '1985-06-15',
                },
                gender: {
                  type: 'string',
                  enum: ['male', 'female', 'other'],
                  example: 'male',
                },
              },
            },
            professional: {
              type: 'object',
              properties: {
                licenseNumber: {
                  type: 'string',
                  example: 'MD-12345',
                },
                specialization: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: ['Cardiology', 'Internal Medicine'],
                },
                department: {
                  type: 'string',
                  example: 'Cardiology',
                },
              },
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Patient: {
          type: 'object',
          required: ['personalInfo', 'contact'],
          properties: {
            _id: {
              type: 'string',
              example: '60d5ec49f1b2c72b8c8e4f1b',
            },
            patientNumber: {
              type: 'string',
              example: 'P-2025-00001',
              description: 'Auto-generated patient number',
            },
            personalInfo: {
              type: 'object',
              required: ['firstName', 'lastName', 'dateOfBirth', 'gender'],
              properties: {
                firstName: {
                  type: 'string',
                  example: 'Ahmed',
                },
                lastName: {
                  type: 'string',
                  example: 'Hassan',
                },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '1990-05-15',
                },
                gender: {
                  type: 'string',
                  enum: ['male', 'female', 'other'],
                  example: 'male',
                },
                nationalId: {
                  type: 'string',
                  example: 'AB123456',
                },
                bloodType: {
                  type: 'string',
                  enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                  example: 'O+',
                },
              },
            },
            contact: {
              type: 'object',
              required: ['phone'],
              properties: {
                phone: {
                  type: 'string',
                  example: '+1234567890',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'patient@example.com',
                },
                address: {
                  type: 'object',
                  properties: {
                    street: { type: 'string', example: '123 Main St' },
                    city: { type: 'string', example: 'New York' },
                    state: { type: 'string', example: 'NY' },
                    zipCode: { type: 'string', example: '10001' },
                    country: { type: 'string', example: 'USA' },
                  },
                },
              },
            },
            medicalInfo: {
              type: 'object',
              properties: {
                allergies: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Penicillin', 'Peanuts'],
                },
                chronicConditions: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Diabetes', 'Hypertension'],
                },
                currentMedications: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Metformin 500mg'],
                },
              },
            },
            insuranceInfo: {
              type: 'object',
              properties: {
                provider: { type: 'string', example: 'Blue Cross' },
                policyNumber: { type: 'string', example: 'BC-123456' },
                groupNumber: { type: 'string', example: 'GRP-789' },
              },
            },
          },
        },
        Appointment: {
          type: 'object',
          required: ['patient', 'doctor', 'scheduledDate', 'scheduledTime'],
          properties: {
            _id: {
              type: 'string',
              example: '60d5ec49f1b2c72b8c8e4f1c',
            },
            appointmentNumber: {
              type: 'string',
              example: 'APT-2025-00001',
              description: 'Auto-generated appointment number',
            },
            patient: {
              type: 'string',
              description: 'Patient ID',
              example: '60d5ec49f1b2c72b8c8e4f1b',
            },
            doctor: {
              type: 'string',
              description: 'Doctor ID',
              example: '60d5ec49f1b2c72b8c8e4f1a',
            },
            scheduledDate: {
              type: 'string',
              format: 'date',
              example: '2025-10-20',
            },
            scheduledTime: {
              type: 'string',
              pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
              example: '10:00',
            },
            duration: {
              type: 'number',
              default: 30,
              example: 30,
              description: 'Duration in minutes',
            },
            type: {
              type: 'string',
              enum: ['consultation', 'follow-up', 'emergency', 'checkup'],
              example: 'consultation',
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
              default: 'scheduled',
            },
            chiefComplaint: {
              type: 'string',
              example: 'Chest pain',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'fail',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            statusCode: {
              type: 'number',
              example: 400,
            },
            stack: {
              type: 'string',
              description: 'Stack trace (development only)',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Patients',
        description: 'Patient management operations',
      },
      {
        name: 'Doctors',
        description: 'Doctor information and availability',
      },
      {
        name: 'Appointments',
        description: 'Appointment scheduling and management',
      },
    ],
  },
  apis: [
    './src/routes/v1/*.js',
    './src/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
