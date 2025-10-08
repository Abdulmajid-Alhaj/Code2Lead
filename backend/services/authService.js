// services/authService.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utility functions
function normalizeUsername(u) {
  return (u || '').toString().trim().toLowerCase();
}

function normalizeEmail(e) {
  return (e || '').toString().trim().toLowerCase();
}

function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    issuer: 'code2lead-api',
    audience: 'code2lead-client'
  });
}

// Create admin user
async function createAdmin({ name, username, email, password }) {
  try {
    const uname = normalizeUsername(username);
    const mail = normalizeEmail(email);

    // Check for existing users
    const existingByEmail = await User.findByEmail(mail);
    if (existingByEmail) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const existingByUsername = await User.findByUsername(uname);
    if (existingByUsername) {
      const error = new Error('Username already in use');
      error.statusCode = 409;
      error.code = 'USERNAME_EXISTS';
      throw error;
    }

    // Create admin user
    const adminUser = new User({ 
      name, 
      username: uname, 
      email: mail, 
      password, 
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    
    return adminUser.getSafeData();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Validation failed');
      validationError.statusCode = 400;
      validationError.code = 'VALIDATION_ERROR';
      validationError.details = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      throw validationError;
    }
    throw error;
  }
}

// User login with security features
async function login({ email, password }) {
  try {
    const mail = normalizeEmail(email);
    const user = await User.findByEmail(mail);
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const error = new Error('Account is temporarily locked due to too many failed login attempts');
      error.statusCode = 423;
      error.code = 'ACCOUNT_LOCKED';
      throw error;
    }

    // Check if account is active
    if (!user.isActive) {
      const error = new Error('Account is deactivated');
      error.statusCode = 403;
      error.code = 'ACCOUNT_DEACTIVATED';
      throw error;
    }

    // Verify password
    const match = await user.comparePassword(password);
    if (!match) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate JWT token
    const token = generateJWT({ 
      id: user._id, 
      role: user.role,
      email: user.email,
      username: user.username
    });

    return {
      token,
      user: user.getSafeData()
    };
  } catch (error) {
    throw error;
  }
}

// Admin creates a new user
async function adminCreateUser({ name, username, email, password, role = 'user' }) {
  try {
    const uname = normalizeUsername(username);
    const mail = normalizeEmail(email);

    // Check for existing users
    const existingByEmail = await User.findByEmail(mail);
    if (existingByEmail) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const existingByUsername = await User.findByUsername(uname);
    if (existingByUsername) {
      const error = new Error('Username already in use');
      error.statusCode = 409;
      error.code = 'USERNAME_EXISTS';
      throw error;
    }

    // Create new user
    const newUser = new User({ 
      name, 
      username: uname, 
      email: mail, 
      password, 
      role,
      isActive: true
    });

    await newUser.save();
    
    return newUser.getSafeData();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Validation failed');
      validationError.statusCode = 400;
      validationError.code = 'VALIDATION_ERROR';
      validationError.details = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      throw validationError;
    }
    throw error;
  }
}

// Get public profile by username
async function getPublicProfileByUsername(username) {
  try {
    const uname = normalizeUsername(username);
    const user = await User.findByUsername(uname);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Check if profile is public
    if (!user.publicProfile) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user.getPublicProfile();
  } catch (error) {
    throw error;
  }
}

// Update user profile
async function updateUserProfile(userId, profileData) {
  try {
    // Only allow specific fields to be updated
    const allowedFields = ['name', 'bio', 'social', 'studies', 'publicProfile', 'avatar'];
    const allowed = {};
    
    allowedFields.forEach(field => {
      if (profileData[field] !== undefined) {
        allowed[field] = profileData[field];
      }
    });

    // Validate studies array if provided
    if (allowed.studies && Array.isArray(allowed.studies)) {
      allowed.studies = allowed.studies.map(study => ({
        institution: study.institution || '',
        degree: study.degree || '',
        startDate: study.startDate ? new Date(study.startDate) : undefined,
        endDate: study.endDate ? new Date(study.endDate) : undefined,
        description: study.description || ''
      }));
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      allowed, 
      { new: true, runValidators: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user.getSafeData();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Validation failed');
      validationError.statusCode = 400;
      validationError.code = 'VALIDATION_ERROR';
      validationError.details = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      throw validationError;
    }
    throw error;
  }
}

// Get user by ID (for internal use)
async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

// Get all users (admin only)
async function getAllUsers(page = 1, limit = 10, role = null) {
  try {
    const query = {};
    if (role) {
      query.role = role;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-password -loginAttempts -lockUntil'
    };

    const users = await User.paginate(query, options);
    return users;
  } catch (error) {
    throw error;
  }
}

// Deactivate user account
async function deactivateUser(userId) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user.getSafeData();
  } catch (error) {
    throw error;
  }
}

// Activate user account
async function activateUser(userId) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user.getSafeData();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createAdmin,
  login,
  adminCreateUser,
  getPublicProfileByUsername,
  updateUserProfile,
  getUserById,
  getAllUsers,
  deactivateUser,
  activateUser,
};
