const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

/**
 * Attendance Service - Business logic for attendance management
 */
class AttendanceService {
  /**
   * Get all attendance records
   */
  async getAllAttendance(query = {}) {
    const { page = 1, limit = 10, employeeId, startDate, endDate } = query;
    
    const filter = {};
    if (employeeId) filter.employee = employeeId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const attendance = await Attendance.find(filter)
      .populate('employee', 'firstName lastName email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(filter);

    return {
      attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get attendance by ID
   */
  async getAttendanceById(id) {
    const attendance = await Attendance.findById(id)
      .populate('employee', 'firstName lastName email');

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return attendance;
  }

  /**
   * Create attendance record
   */
  async createAttendance(attendanceData) {
    const { employee, date } = attendanceData;

    // Verify employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      throw new Error('Employee not found');
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      employee,
      date: new Date(date),
    });

    if (existingAttendance) {
      throw new Error('Attendance record already exists for this date');
    }

    const attendance = await Attendance.create(attendanceData);
    return await this.getAttendanceById(attendance._id);
  }

  /**
   * Update attendance record
   */
  async updateAttendance(id, updateData) {
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employee', 'firstName lastName email');

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return attendance;
  }

  /**
   * Delete attendance record
   */
  async deleteAttendance(id) {
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return { message: 'Attendance record deleted successfully' };
  }
}

module.exports = new AttendanceService();
