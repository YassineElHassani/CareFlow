# CareFlow EHR - Frontend Application

> A modern, full-featured Electronic Health Record (EHR) system built with React, TypeScript, and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

### Core Functionality

- 🔐 **Authentication** - Secure login, registration, password reset (JWT-based)
- 👥 **User Management** - Role-based access control (Admin, Doctor, Nurse, Patient, Pharmacist, Lab Tech)
- 📋 **Patient Management** - Complete medical records, history, allergies
- 📅 **Appointment Scheduling** - Calendar view, conflict detection, availability checking
- 🏥 **Consultations** - Clinical documentation, vital signs, diagnoses, procedures
- 💊 **Prescriptions** - E-prescribing, pharmacy integration, medication tracking
- 🔬 **Lab Orders** - Test ordering, results management, report viewing
- 💉 **Pharmacy Module** - Dispensing workflow, inventory tracking
- 📄 **Document Management** - Upload, view, categorize medical documents

### Technical Features

- ✅ 100% TypeScript - Full type safety
- ✅ 86+ API endpoints integrated
- ✅ Responsive design - Mobile, tablet, desktop
- ✅ Role-based routing & permissions
- ✅ Optimistic updates with React Query
- ✅ Offline detection & error handling
- ✅ Form validation with React Hook Form
- ✅ Modern UI with Tailwind CSS
- ✅ Atomic design component architecture

## 🛠️ Tech Stack

### Core

- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool & dev server

### State & Data

- **Redux Toolkit** - Global state management
- **React Query** (TanStack Query) - Server state & caching
- **Redux Persist** - Persist Redux state

### Routing & Forms

- **React Router v7** - Client-side routing
- **React Hook Form** - Form management
- **Yup / Zod** - Schema validation

### Styling & UI

- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icon library

### API & Utils

- **Axios** - HTTP client

### Development

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Testing Library** - Component testing

## Quick Start

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend URL
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Development

```bash
# Start development server
npm run dev
# → http://localhost:5173

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Testing
npm test
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

All backend endpoints are accessible through typed service modules:

```typescript
import { authService, patientsService, appointmentsService } from '@/services';

// Authentication
const { user, accessToken } = await authService.login({
  email: 'doctor@careflow.com',
  password: 'Doctor@123',
});

// Fetch patients
const { patients, pagination } = await patientsService.getPatients({
  page: 1,
  limit: 10,
  gender: 'male',
});

// Create appointment
const appointment = await appointmentsService.createAppointment({
  patient: patientId,
  doctor: doctorId,
  scheduledDate: '2025-10-30',
  scheduledTime: '10:00',
  duration: 30,
  type: 'consultation',
});
```

## API Coverage: 100% ✅

| Module             | Endpoints | Status      |
| ------------------ | --------- | ----------- |
| Authentication     | 10        | ✅ Complete |
| User Management    | 7         | ✅ Complete |
| Patient Management | 12        | ✅ Complete |
| Doctor Management  | 5         | ✅ Complete |
| Appointments       | 10        | ✅ Complete |
| Consultations      | 13        | ✅ Complete |
| Prescriptions      | 10        | ✅ Complete |
| Pharmacies         | 8         | ✅ Complete |
| Lab Orders         | 11        | ✅ Complete |
| **Total**          | **86**    | **✅ 100%** |
