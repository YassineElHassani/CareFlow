const User = require('../models/UserModel');
const { generateTokens } = require('../utils/jwt');
const EmailQueue = require('../queues/EmailQueue');

const register = async (userData) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName, 
    role, 
    phone,
    dateOfBirth,
    gender,
    address,
    nationalId,
    professionalInfo,
  } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    email,
    password,
    role: role || 'patient',
    profile: {
      firstName,
      lastName,
      nationalId,
      phone,
      dateOfBirth,
      gender,
      address: address || {},
    },
    professional: (role === 'doctor' || role === 'nurse') ? professionalInfo : undefined,
  });

  const tokens = generateTokens(user);

  await EmailQueue.addWelcomeEmail({
    to: user.email,
    firstName: user.profile.firstName,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      role: user.role,
    },
    ...tokens,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.isSuspended) {
    const error = new Error('Account is suspended');
    error.statusCode = 403;
    throw error;
  }

  if (user.isDeleted) {
    const error = new Error('Account not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isLocked) {
    const error = new Error('Account is locked due to too many failed login attempts. Please try again later.');
    error.statusCode = 423;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    await user.incLoginAttempts();
    
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.loginAttempts > 0) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  user.lastLogin = new Date();
  await user.save();

  const tokens = generateTokens(user);
  
  return {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      role: user.role,
      avatar: user.profile.avatar,
    },
    ...tokens,
  };
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    return { message: 'If the email exists, a reset link will be sent' };
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save();

  await EmailQueue.addPasswordResetEmail({
    to: user.email,
    firstName: user.profile.firstName,
    resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
  });

  return { message: 'Password reset email sent' };
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return { message: 'Password reset successful' };
};

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
};
