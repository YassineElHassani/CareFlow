const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { User, Patient, AuditLog } = require('../models');

exports.registerPatient = async (req, res) => {
  try {
    const { email, password, profile, personalInfo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered',
      });
    }

    if (personalInfo?.nationalId) {
      const existingPatient = await Patient.findOne({
        'personalInfo.nationalId': personalInfo.nationalId,
      });
      if (existingPatient) {
        return res.status(409).json({
          status: 'error',
          message: 'National ID already registered',
        });
      }
    }

    const user = await User.create({
      email,
      password,
      role: 'patient',
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        address: profile.address,
      },
    });

    const patient = await Patient.create({
      userId: user._id,
      personalInfo: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        nationalId: personalInfo?.nationalId,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        bloodType: personalInfo?.bloodType,
      },
      contact: {
        phone: profile.phone,
        email,
        address: profile.address,
      },
    });

    await AuditLog.logAction({
      userId: user._id,
      userEmail: user.email,
      userRole: 'patient',
      action: 'register',
      resource: 'patient',
      resourceId: patient._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      severity: 'low',
      success: true,
    });

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        patient: {
          id: patient._id,
          patientNumber: patient.patientNumber,
          fullName: patient.fullName,
        },
        tokens,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    if (user.isLocked) {
      await AuditLog.logAction({
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: 'failed_login',
        resource: 'user',
        resourceId: user._id,
        metadata: { reason: 'account_locked' },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: false,
        severity: 'medium',
      });

      return res.status(423).json({
        status: 'error',
        message: 'Account is locked due to too many failed login attempts. Please try again later.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Account is deactivated. Please contact support.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();

      await AuditLog.logAction({
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
        action: 'failed_login',
        resource: 'user',
        resourceId: user._id,
        metadata: { reason: 'invalid_password' },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: false,
        severity: 'medium',
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    await user.resetLoginAttempts();

    let patientData = null;
    if (user.role === 'patient') {
      patientData = await Patient.findOne({ userId: user._id });
    }

    await AuditLog.logAction({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'login',
      resource: 'user',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: true,
      severity: 'low',
    });

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        patient: patientData ? {
          id: patientData._id,
          patientNumber: patientData.patientNumber,
          fullName: patientData.fullName,
        } : null,
        tokens,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Account is deactivated',
      });
    }

    const tokens = generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      status: 'success',
      data: {
        tokens,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired refresh token',
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let patientData = null;
    if (user.role === 'patient') {
      patientData = await Patient.findOne({ userId: user._id });
    }

    res.json({
      status: 'success',
      data: {
        user,
        patient: patientData,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.refreshToken = null;
    await user.save();

    await AuditLog.logAction({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'logout',
      resource: 'user',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: true,
      severity: 'low',
    });

    res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    await AuditLog.logAction({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      action: 'change_password',
      resource: 'user',
      resourceId: user._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: true,
      severity: 'medium',
    });

    res.json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

