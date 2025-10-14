const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token not found.',
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found. Invalid token.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been deactivated.',
      });
    }

    if (user.isLocked) {
      return res.status(423).json({
        status: 'error',
        message: 'Your account is locked due to too many failed login attempts.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token.',
    });
  }
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource.',
        requiredRole: roles,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

const authorizeOwner = (req, res, next) => {
  const { role, _id } = req.user;

  if (role === 'admin') {
    return next();
  }

  if (role === 'patient') {
    const resourceId = req.params.id || req.params.patientId;

    if (resourceId && resourceId !== _id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only access your own data.',
      });
    }
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwner,
};
