const authService = require('../services/authService');
const { success, error } = require('../utils/response');

/**
 * Auth Controller - Handles HTTP requests for authentication
 * Business logic is in authService
 */

// Register User (First user becomes admin)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return error(res, 'Missing required fields', 400);
    }

    const result = await authService.register({ name, email, password });
    return success(res, result, 201);
  } catch (err) {
    console.error('Register error:', err);
    return error(res, err.message, 400);
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return error(res, 'Missing required fields', 400);
    }

    const result = await authService.login({ email, password });
    return success(res, result);
  } catch (err) {
    console.error('Login error:', err);
    return error(res, err.message, 401);
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return success(res, { user });
  } catch (err) {
    console.error('Get profile error:', err);
    return error(res, err.message, 404);
  }
};
