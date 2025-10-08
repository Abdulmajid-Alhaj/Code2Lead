const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

// Authentication middleware
function authenticate(req, res, next) {
  try {
    // Extract token from Authorization header or cookie
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieToken = req.cookies ? req.cookies[COOKIE_NAME] : null;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'code2lead-api',
      audience: 'code2lead-client'
    });

    // Attach user info to request
    req.user = { 
      id: payload.id, 
      role: payload.role,
      email: payload.email,
      username: payload.username
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  }
}

// Authorization middleware
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
}

// Optional authentication middleware (doesn't fail if no token)
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieToken = req.cookies ? req.cookies[COOKIE_NAME] : null;
    const token = bearerToken || cookieToken;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'code2lead-api',
        audience: 'code2lead-client'
      });
      
      req.user = { 
        id: payload.id, 
        role: payload.role,
        email: payload.email,
        username: payload.username
      };
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
}

// Check if user is admin
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
}

// Check if user is trainer or admin
function isTrainerOrAdmin(req, res, next) {
  if (!req.user || !['trainer', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Trainer or admin access required',
      code: 'TRAINER_OR_ADMIN_REQUIRED'
    });
  }
  next();
}

module.exports = { 
  authenticate, 
  authorize, 
  optionalAuth, 
  isAdmin, 
  isTrainerOrAdmin 
};
