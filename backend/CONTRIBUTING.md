# Contributing to CareFlow EHR

Thank you for your interest in contributing to CareFlow! This document provides guidelines for contributing to the project.

---

## Documentation Links

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - All documentation
- **[README](./README.md)** - Project overview
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Code organization
- **[Database Design](./DATABASE_DESIGN.md)** - Schema guidelines
- **[API Documentation](./SWAGGER_DOCUMENTATION.md)** - API endpoints
- **[Setup Guide](./SETUP_GUIDE.md)** - Development setup

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/CareFlow.git
   cd CareFlow/backend
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/YassineElHassani/CareFlow.git
   ```
4. **Create a branch** for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d
```

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add/update tests
- Update documentation

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration

# Run with coverage
npm run test:coverage
```

### 4. Lint Your Code

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### 5. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines)

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Sync with Upstream

```bash
git fetch upstream
git rebase upstream/main
```

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill in the PR template
- Wait for review

## Coding Standards

### JavaScript Style Guide

We follow a combination of Airbnb JavaScript Style Guide and our custom rules.

#### General Rules

1. **Use ES6+ syntax**
   ```javascript
   // Good
   const user = { name, email };
   const users = [...oldUsers, newUser];

   // Bad
   var user = { name: name, email: email };
   var users = oldUsers.concat([newUser]);
   ```

2. **Use async/await over promises**
   ```javascript
   // Good
   async function getUser(id) {
     const user = await User.findById(id);
     return user;
   }

   // Avoid
   function getUser(id) {
     return User.findById(id).then(user => user);
   }
   ```

3. **Use meaningful variable names**
   ```javascript
   // Good
   const appointmentsByPractitioner = appointments.filter(apt => apt.practitionerId === id);

   // Bad
   const data = appointments.filter(a => a.pid === id);
   ```

4. **Keep functions small and focused**
   ```javascript
   // Good - Single responsibility
   function validateEmail(email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }

   function createUser(userData) {
     if (!validateEmail(userData.email)) {
       throw new Error('Invalid email');
     }
     return User.create(userData);
   }
   ```

#### File Structure

```javascript
// 1. Node.js built-in modules
const path = require('path');

// 2. Third-party modules
const express = require('express');
const jwt = require('jsonwebtoken');

// 3. Internal modules
const User = require('../models/UserModel');
const AuthService = require('../services/AuthService');
const logger = require('../config/logger');

// 4. Constants
const ROLES = ['admin', 'doctor', 'nurse', 'patient'];

// 5. Functions/Classes
class AuthController {
  async login(req, res) {
    // Implementation
  }
}

// 6. Exports
module.exports = AuthController;
```

### Error Handling

**Always handle errors properly:**

```javascript
// Good
try {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
} catch (error) {
  logger.error('Error fetching user:', error);
  throw error;
}

// Bad - Silent failure
const user = await User.findById(id).catch(() => null);
```

### Comments

**Add comments for complex logic:**

```javascript
// Good
/**
 * Checks if a practitioner has conflicting appointments
 * @param {string} practitionerId - The practitioner's ID
 * @param {Date} startTime - Appointment start time
 * @param {number} duration - Duration in minutes
 * @returns {Promise<boolean>} True if conflict exists
 */
async function checkAppointmentConflict(practitionerId, startTime, duration) {
  // Calculate end time based on duration
  const endTime = new Date(startTime.getTime() + duration * 60000);
  
  // Query for overlapping appointments
  const conflicts = await Appointment.find({
    practitioner: practitionerId,
    status: { $in: ['scheduled', 'in-progress'] },
    $or: [
      { dateTime: { $gte: startTime, $lt: endTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
    ],
  });
  
  return conflicts.length > 0;
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
# New feature
git commit -m "feat(appointments): add conflict detection"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Tests
git commit -m "test(users): add unit tests for UserService"

# Refactoring
git commit -m "refactor(controllers): extract validation logic"
```

### Good Commit Messages

```
✅ feat(appointments): implement automatic conflict checking
✅ fix(auth): prevent multiple simultaneous logins
✅ docs(api): add endpoint documentation for patients
✅ test(integration): add tests for appointment endpoints
```

### Bad Commit Messages

```
❌ updated files
❌ fix bug
❌ changes
❌ WIP
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No linting errors

### PR Title Format

Use the same format as commit messages:

```
feat(appointments): add email reminder functionality
fix(users): resolve password reset bug
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added
- [ ] All tests pass
```

### Review Process

1. **Automated checks** must pass (linting, tests)
2. **At least one approval** from maintainers
3. **All comments resolved**
4. **Up to date** with main branch

## Testing Guidelines

### Unit Tests

**Location:** `src/tests/unit/`

**What to test:**
- Individual functions
- Service methods
- Utility functions
- Model methods

**Example:**
```javascript
const { expect } = require('chai');
const AppointmentService = require('../../services/AppointmentService');

describe('AppointmentService', () => {
  describe('checkConflict', () => {
    it('should detect overlapping appointments', async () => {
      const hasConflict = await AppointmentService.checkConflict(
        'practitionerId',
        new Date('2025-10-12T10:00:00'),
        30
      );
      expect(hasConflict).to.be.true;
    });
  });
});
```

### Integration Tests

**Location:** `src/tests/integration/`

**What to test:**
- API endpoints
- Complete workflows
- Database operations

**Example:**
```javascript
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

describe('POST /api/v1/appointments', () => {
  it('should create a new appointment', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(appointmentData);
      
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('appointment');
  });
});
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **90%+ for business logic**
- **100% for critical paths**

```bash
# Check coverage
npm run test:coverage
```

## Documentation

### Code Documentation

**Use JSDoc for functions:**

```javascript
/**
 * Creates a new appointment with conflict checking
 * @param {Object} appointmentData - The appointment data
 * @param {string} appointmentData.patientId - Patient ID
 * @param {string} appointmentData.practitionerId - Practitioner ID
 * @param {Date} appointmentData.dateTime - Appointment date/time
 * @param {number} appointmentData.duration - Duration in minutes
 * @returns {Promise<Object>} Created appointment
 * @throws {ConflictError} If time slot is already booked
 */
async function createAppointment(appointmentData) {
  // Implementation
}
```

### API Documentation

Update `README.md` when adding new endpoints:

```markdown
#### Appointments
- `POST /api/v1/appointments` - Create new appointment
  - **Auth required:** Yes
  - **Roles:** doctor, nurse, secretary
  - **Body:**
    ```json
    {
      "patientId": "string",
      "practitionerId": "string",
      "dateTime": "ISO 8601 date",
      "duration": 30
    }
    ```
  - **Response:** 201 Created
```

## Bug Reports

### Before Reporting

1. Check existing issues
2. Try to reproduce
3. Gather information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Environment:**
- OS: [e.g., Windows 11]
- Node version: [e.g., 18.17.0]
- Docker version: [e.g., 20.10.0]

**Logs**
```
Paste relevant logs
```

**Additional context**
Any other relevant information
```

## Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Screenshots, mockups, etc.
```

## Areas to Contribute

### Good First Issues

- Documentation improvements
- Test coverage
- Bug fixes
- Code refactoring

### Advanced Contributions

- New features
- Performance optimizations
- Security improvements
- Architecture enhancements

## Getting Help

- **Questions:** Open a discussion on GitHub
- **Bugs:** Create an issue
- **Security:** Email security@careflow.com
- **Chat:** Join our Discord (link in README)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to CareFlow!
