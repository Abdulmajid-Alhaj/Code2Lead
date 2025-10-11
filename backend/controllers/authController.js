const { validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authService = require('../services/authService');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validators for creating an admin
const validateCreateAdmin = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

// Validators for login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validators for admin-only user creation
const validateAdminCreateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['user', 'trainer'])
    .withMessage('Role must be either user or trainer'),
  
  handleValidationErrors
];

// Validator for profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage('Avatar must be a valid image URL'),
  
  body('social.github')
    .optional()
    .isURL()
    .withMessage('GitHub must be a valid URL')
    .matches(/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/)
    .withMessage('GitHub must be a valid GitHub profile URL'),
  
  body('social.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn must be a valid URL')
    .matches(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/)
    .withMessage('LinkedIn must be a valid LinkedIn profile URL'),
  
  body('social.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook must be a valid URL')
    .matches(/^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.]+$/)
    .withMessage('Facebook must be a valid Facebook profile URL'),
  
  body('social.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram must be a valid URL')
    .matches(/^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/)
    .withMessage('Instagram must be a valid Instagram profile URL'),
  
  body('studies')
    .optional()
    .isArray()
    .withMessage('Studies must be an array'),
  
  body('studies.*.institution')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Institution name must be between 1 and 200 characters'),
  
  body('studies.*.degree')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Degree must be between 1 and 200 characters'),
  
  body('studies.*.startDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid date'),
  
  body('studies.*.endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid date'),
  
  body('studies.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('publicProfile')
    .optional()
    .isBoolean()
    .withMessage('Public profile must be a boolean value'),
  
  handleValidationErrors
];

// Cookie configuration
function buildCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAgeDays = Number(process.env.COOKIE_MAX_AGE_DAYS || 7);
  const sameSiteEnv = (process.env.COOKIE_SAMESITE || (isProd ? 'None' : 'Lax'));
  const sameSite = ['Lax', 'Strict', 'None'].includes(sameSiteEnv) ? sameSiteEnv : 'Lax';
  
  return {
    httpOnly: true,
    secure: isProd || process.env.COOKIE_SECURE === 'true',
    sameSite,
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
  };
}

const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

// Create admin user
const createAdmin = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const result = await authService.createAdmin({ name, username, email, password });
    
    res.status(201).json({ 
      success: true, 
      message: 'Admin user created successfully',
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    // Set secure httpOnly cookie with JWT
    res.cookie(COOKIE_NAME, result.token, buildCookieOptions());

    res.json({ 
      success: true, 
      message: 'Login successful',
      data: { user: result.user } 
    });
  } catch (error) {
    next(error);
  }
};

// Admin creates a new user
const adminCreateUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;
    const result = await authService.adminCreateUser({ name, username, email, password, role });
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

// Get public profile by username
const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await authService.getPublicProfileByUsername(username);
    
    res.json({ 
      success: true, 
      data: profile 
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const updated = await authService.updateUserProfile(userId, req.body);
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updated 
    });
  } catch (error) {
    next(error);
  }
};

// User logout
const logout = async (req, res, next) => {
  try {
    const opts = buildCookieOptions();
    res.clearCookie(COOKIE_NAME, { ...opts, maxAge: 0 });
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const user = await authService.getUserById(userId);
    
    res.json({ 
      success: true, 
      data: user.getSafeData() 
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const result = await authService.getAllUsers(page, limit, role);
    
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate user (admin only)
const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await authService.deactivateUser(userId);
    
    res.json({ 
      success: true, 
      message: 'User deactivated successfully',
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

// Activate user (admin only)
const activateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await authService.activateUser(userId);
    
    res.json({ 
      success: true, 
      message: 'User activated successfully',
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Validation middleware
  validateCreateAdmin,
  validateLogin,
  validateAdminCreateUser,
  validateProfileUpdate,
  
  // Controller functions
  createAdmin,
  login,
  adminCreateUser,
  getPublicProfile,
  updateProfile,
  logout,
  getCurrentUser,
  getAllUsers,
  deactivateUser,
  activateUser,
};
