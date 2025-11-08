const payrollService = require('../../services/payrollService');
const { success, error } = require('../../utils/response');

/**
 * Payroll Controller - Handles HTTP requests for payroll management
 * Business logic is in payrollService
 */

exports.list = async (req, res) => {
  try {
    const result = await payrollService.getAllPayrolls(req.query);
    return success(res, result);
  } catch (err) {
    console.error('List payroll error:', err);
    return error(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const payroll = await payrollService.createPayroll(req.body);
    return success(res, { payroll }, 201);
  } catch (err) {
    console.error('Create payroll error:', err);
    return error(res, err.message, 400);
  }
};

exports.get = async (req, res) => {
  try {
    const payroll = await payrollService.getPayrollById(req.params.id);
    return success(res, { payroll });
  } catch (err) {
    console.error('Get payroll error:', err);
    return error(res, err.message, 404);
  }
};

exports.update = async (req, res) => {
  try {
    const payroll = await payrollService.updatePayroll(req.params.id, req.body);
    return success(res, { payroll });
  } catch (err) {
    console.error('Update payroll error:', err);
    return error(res, err.message, 400);
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await payrollService.deletePayroll(req.params.id);
    return success(res, result);
  } catch (err) {
    console.error('Delete payroll error:', err);
    return error(res, err.message, 404);
  }
};

// Payrun endpoints
exports.listPayruns = async (req, res) => {
  try {
    const result = await payrollService.getAllPayruns(req.query);
    return success(res, result);
  } catch (err) {
    console.error('List payruns error:', err);
    return error(res, err.message);
  }
};

exports.createPayrun = async (req, res) => {
  try {
    const payrun = await payrollService.createPayrun(req.body);
    return success(res, { payrun }, 201);
  } catch (err) {
    console.error('Create payrun error:', err);
    return error(res, err.message, 400);
  }
};

exports.updatePayrunStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payrun = await payrollService.updatePayrunStatus(req.params.id, status);
    return success(res, { payrun });
  } catch (err) {
    console.error('Update payrun status error:', err);
    return error(res, err.message, 400);
  }
};
