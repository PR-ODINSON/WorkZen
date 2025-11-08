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
    if (employeeId) filter.empId = employeeId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const attendance = await Attendance.find(filter)
      .populate('empId', 'name email employeeId')
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
      .populate('empId', 'name email employeeId');

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    return attendance;
  }

  /**
   * Create attendance record
   */
  async createAttendance(attendanceData) {
    const { empId, date } = attendanceData;

    // Verify employee exists
    const employeeExists = await Employee.findById(empId);
    if (!employeeExists) {
      throw new Error('Employee not found');
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      empId,
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
    ).populate('empId', 'name email employeeId');

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

  /**
   * Get today's attendance for an employee
   */
  async getTodayAttendance(empId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      empId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('empId', 'name email employeeId');

    return attendance;
  }

  /**
   * Employee check-in
   */
  async checkIn(empId) {
    // Check if employee exists
    const employee = await Employee.findById(empId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if already checked in today
    const existingAttendance = await this.getTodayAttendance(empId);
    
    if (existingAttendance) {
      if (existingAttendance.checkIn) {
        throw new Error('You have already checked in today');
      }
      // Update existing record with check-in
      existingAttendance.checkIn = new Date();
      existingAttendance.status = 'present';
      await existingAttendance.save();
      return existingAttendance;
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      empId,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });

    return await this.getTodayAttendance(empId);
  }

  /**
   * Employee check-out
   */
  async checkOut(empId) {
    const attendance = await this.getTodayAttendance(empId);
    
    if (!attendance) {
      throw new Error('No check-in record found for today');
    }

    if (!attendance.checkIn) {
      throw new Error('You must check in before checking out');
    }

    if (attendance.checkOut) {
      throw new Error('You have already checked out today');
    }

    attendance.checkOut = new Date();
    await attendance.save();

    return attendance;
  }
}

module.exports = new AttendanceService();
