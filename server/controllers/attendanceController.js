const attendanceService = require('../services/attendanceService');
const { success, error } = require('../utils/response');

/**
 * Employee Attendance Controller - Handles employee check-in/check-out
 */

/**
 * Get today's attendance status for the logged-in employee
 */
exports.getTodayStatus = async (req, res) => {
  try {
    const empId = req.user.empId; // Get employee ID from verified token
    
    if (!empId) {
      return error(res, 'Employee profile not found', 404);
    }

    const attendance = await attendanceService.getTodayAttendance(empId);
    return success(res, { attendance });
  } catch (err) {
    console.error('Get today attendance error:', err);
    return error(res, err.message);
  }
};

/**
 * Employee check-in
 */
exports.checkIn = async (req, res) => {
  try {
    const empId = req.user.empId; // Get employee ID from verified token
    const userId = req.user.id; // Get user ID from verified token
    
    console.log('Check-in request from user:', req.user);
    console.log('Employee ID:', empId);
    console.log('User ID:', userId);
    
    if (!empId) {
      return error(res, 'Employee profile not found. Please contact admin to create your employee profile.', 404);
    }

    const attendance = await attendanceService.checkIn(empId, userId);
    return success(res, { 
      message: 'Checked in successfully',
      attendance 
    }, 201);
  } catch (err) {
    console.error('Check-in error:', err);
    return error(res, err.message, 400);
  }
};

/**
 * Employee check-out
 */
exports.checkOut = async (req, res) => {
  try {
    const empId = req.user.empId; // Get employee ID from verified token
    
    if (!empId) {
      return error(res, 'Employee profile not found', 404);
    }

    const attendance = await attendanceService.checkOut(empId);
    return success(res, { 
      message: 'Checked out successfully',
      attendance 
    });
  } catch (err) {
    console.error('Check-out error:', err);
    return error(res, err.message, 400);
  }
};

/**
 * Get my attendance records (employee's own records)
 */
exports.getMyAttendance = async (req, res) => {
  try {
    const empId = req.user.empId; // Get employee ID from verified token
    
    if (!empId) {
      return error(res, 'Employee profile not found', 404);
    }

    const result = await attendanceService.getEmployeeAttendance(empId, req.query);
    return success(res, result);
  } catch (err) {
    console.error('Get my attendance error:', err);
    return error(res, err.message);
  }
};
