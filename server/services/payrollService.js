const Payroll = require('../models/Payroll');
const Payrun = require('../models/Payrun');
const Employee = require('../models/Employee');

/**
 * Payroll Service - Business logic for payroll management
 */
class PayrollService {
  /**
   * Get all payroll records
   */
  async getAllPayrolls(query = {}) {
    const { page = 1, limit = 10, employeeId, payrunId, month, year } = query;
    
    const filter = {};
    if (employeeId) filter.employee = employeeId;
    if (payrunId) filter.payrun = payrunId;
    if (month) filter.month = month;
    if (year) filter.year = year;

    const skip = (page - 1) * limit;
    const payrolls = await Payroll.find(filter)
      .populate('employee', 'firstName lastName email')
      .populate('payrun', 'name status')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Payroll.countDocuments(filter);

    return {
      payrolls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get payroll by ID
   */
  async getPayrollById(id) {
    const payroll = await Payroll.findById(id)
      .populate('employee', 'firstName lastName email')
      .populate('payrun', 'name status');

    if (!payroll) {
      throw new Error('Payroll record not found');
    }

    return payroll;
  }

  /**
   * Create payroll record
   */
  async createPayroll(payrollData) {
    const { employee, payrun } = payrollData;

    // Verify employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      throw new Error('Employee not found');
    }

    // Verify payrun exists if provided
    if (payrun) {
      const payrunExists = await Payrun.findById(payrun);
      if (!payrunExists) {
        throw new Error('Payrun not found');
      }
    }

    const payroll = await Payroll.create(payrollData);
    return await this.getPayrollById(payroll._id);
  }

  /**
   * Update payroll record
   */
  async updatePayroll(id, updateData) {
    const payroll = await Payroll.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('employee', 'firstName lastName email')
      .populate('payrun', 'name status');

    if (!payroll) {
      throw new Error('Payroll record not found');
    }

    return payroll;
  }

  /**
   * Delete payroll record
   */
  async deletePayroll(id) {
    const payroll = await Payroll.findByIdAndDelete(id);
    if (!payroll) {
      throw new Error('Payroll record not found');
    }

    return { message: 'Payroll record deleted successfully' };
  }

  /**
   * Get all payruns
   */
  async getAllPayruns(query = {}) {
    const { page = 1, limit = 10, status } = query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const payruns = await Payrun.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Payrun.countDocuments(filter);

    return {
      payruns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create payrun
   */
  async createPayrun(payrunData) {
    const payrun = await Payrun.create(payrunData);
    return payrun;
  }

  /**
   * Update payrun status
   */
  async updatePayrunStatus(id, status) {
    const validStatuses = ['draft', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const payrun = await Payrun.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payrun) {
      throw new Error('Payrun not found');
    }

    return payrun;
  }
}

module.exports = new PayrollService();
