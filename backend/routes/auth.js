const express = require('express');
const {
  validateCreateAdmin,
  createAdmin,
  validateLogin,
  login,
  validateAdminCreateUser,
  adminCreateUser,
  validateProfileUpdate,
  getPublicProfile,
  updateProfile,
  logout,
  getCurrentUser,
  getAllUsers,
  deactivateUser,
  activateUser,
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
// POST /api/auth/admin - Create an admin user (first-time setup)
router.post('/admin', validateCreateAdmin, createAdmin);

// POST /api/auth/login - User login
router.post('/login', validateLogin, login);

// GET /api/auth/profile/:username - Get public profile by username
router.get('/profile/:username', getPublicProfile);

// GET /api/auth/me 
router.get('/me', authenticate, getCurrentUser);

// PUT /api/auth/profile - Update own profile
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);

// POST /api/auth/logout - User logout
router.post('/logout', authenticate, logout);

// Admin-only routes
// POST /api/auth/users - Create a new user (admin only)
router.post('/users', authenticate, authorize('admin'), validateAdminCreateUser, adminCreateUser);

// GET /api/auth/users - Get all users (admin only)
router.get('/users', authenticate, authorize('admin'), getAllUsers);

// PUT /api/auth/users/:userId/deactivate - Deactivate user (admin only)
router.put('/users/:userId/deactivate', authenticate, authorize('admin'), deactivateUser);

// PUT /api/auth/users/:userId/activate - Activate user (admin only)
router.put('/users/:userId/activate', authenticate, authorize('admin'), activateUser);

module.exports = router;



