const User = require('../models/UserModel');

const getUsers = async (filters = {}) => {
  const query = {};

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === 'true';
  }

  query.isDeleted = filters.includeDeleted === 'true' ? { $in: [true, false] } : false;

  if (filters.search) {
    query.$or = [
      { email: { $regex: filters.search, $options: 'i' } },
      { 'profile.firstName': { $regex: filters.search, $options: 'i' } },
      { 'profile.lastName': { $regex: filters.search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('-refreshToken -password')
    .sort({ createdAt: -1 })
    .lean();

  return users;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select('-refreshToken -password')
    .lean();

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (updateData.profile) {
    Object.keys(updateData.profile).forEach((key) => {
      if (user.profile[key] !== undefined) {
        user.profile[key] = updateData.profile[key];
      }
    });
  }

  await user.save();

  return user.toObject({ getters: true });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.refreshToken = undefined; // Invalidate all sessions
  await user.save();

  return { message: 'Password changed successfully' };
};

const suspendUser = async (userId, reason) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('User is already suspended');
    error.statusCode = 400;
    throw error;
  }

  user.isActive = false;
  user.suspensionReason = reason;
  user.suspendedAt = new Date();
  user.refreshToken = undefined; // Logout user
  
  await user.save();

  return { message: 'User suspended successfully' };
};

const reactivateUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isActive) {
    const error = new Error('User is already active');
    error.statusCode = 400;
    throw error;
  }

  user.isActive = true;
  user.suspensionReason = undefined;
  user.suspendedAt = undefined;
  
  await user.save();

  return { message: 'User reactivated successfully' };
};

// Soft delete method
const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isDeleted) {
    const error = new Error('User is already deleted');
    error.statusCode = 400;
    throw error;
  }

  user.isDeleted = true;
  user.deletedAt = new Date();
  user.isActive = false;
  user.refreshToken = undefined; // Logout user
  
  await user.save();

  return { message: 'User deleted successfully' };
};

const getDoctors = async (filters = {}) => {
  const query = {
    role: 'doctor',
    isActive: true,
    isDeleted: false,
  };

  if (filters.specialization) {
    query['professional.specialization'] = filters.specialization;
  }

  if (filters.department) {
    query['professional.department'] = filters.department;
  }

  const doctors = await User.find(query)
    .select('email profile professional')
    .sort({ 'profile.lastName': 1 })
    .lean();

  return doctors;
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  suspendUser,
  reactivateUser,
  deleteUser,
  getDoctors,
};
