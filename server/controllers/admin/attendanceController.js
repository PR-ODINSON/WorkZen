const attendanceService = require('../../services/attendanceService');
const { success, error } = require('../../utils/response');

/**
 * Attendance Controller - Handles HTTP requests for attendance management
 * Business logic is in attendanceService
 */

exports.list = async (req, res) => {
  try {
    const result = await attendanceService.getAllAttendance(req.query);
    return success(res, result);
  } catch (err) {
    console.error('List attendance error:', err);
    return error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const attendance = await attendanceService.createAttendance(req.body);
    return success(res, { attendance }, 201);
  } catch (err) {
    console.error('Create attendance error:', err);
    return error(res, err.message, 400);
  }
};

exports.get = async (req, res) => {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.id);
    return success(res, { attendance });
  } catch (err) {
    console.error('Get attendance error:', err);
    return error(res, err.message, 404);
  }
};

exports.update = async (req, res) => {
  try {
    const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
    return success(res, { attendance });
  } catch (err) {
    console.error('Update attendance error:', err);
    return error(res, err.message, 400);
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await attendanceService.deleteAttendance(req.params.id);
    return success(res, result);
  } catch (err) {
    console.error('Delete attendance error:', err);
    return error(res, err.message, 404);
  }
};
