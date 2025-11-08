const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

/**
 * Leave/TimeOff Service - Business logic for leave management
 */
class LeaveService {
  /**
   * Get all leave requests
   */
  async getAllLeaves(query = {}) {
    const { page = 1, limit = 10, employeeId, status, leaveType } = query;
    
    const filter = {};
    if (employeeId) filter.employee = employeeId;
    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const skip = (page - 1) * limit;
    const leaves = await Leave.find(filter)
      .populate('employee', 'firstName lastName email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Leave.countDocuments(filter);

    return {
      leaves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get leave by ID
   */
  async getLeaveById(id) {
    const leave = await Leave.findById(id)
      .populate('employee', 'firstName lastName email');

    if (!leave) {
      throw new Error('Leave request not found');
    }

    return leave;
  }

  /**
   * Create leave request
   */
  async createLeave(leaveData) {
    const { employee } = leaveData;

    // Verify employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      throw new Error('Employee not found');
    }

    const leave = await Leave.create({
      ...leaveData,
      status: 'pending',
    });

    return await this.getLeaveById(leave._id);
  }

  /**
   * Update leave request
   */
  async updateLeave(id, updateData) {
    const leave = await Leave.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employee', 'firstName lastName email');

    if (!leave) {
      throw new Error('Leave request not found');
    }

    return leave;
  }

  /**
   * Approve or reject leave
   */
  async updateLeaveStatus(id, status, remarks = '') {
    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be approved or rejected');
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    ).populate('employee', 'firstName lastName email');

    if (!leave) {
      throw new Error('Leave request not found');
    }

    return leave;
  }

  /**
   * Delete leave request
   */
  async deleteLeave(id) {
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    return { message: 'Leave request deleted successfully' };
  }
}

module.exports = new LeaveService();
