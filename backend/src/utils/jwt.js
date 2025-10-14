const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
    issuer: 'careflow-api',
    audience: 'careflow-app',
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
    issuer: 'careflow-api',
    audience: 'careflow-app',
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'careflow-api',
      audience: 'careflow-app',
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'careflow-api',
      audience: 'careflow-app',
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

const generateTokens = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
};
