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

  /**
   * Get payroll dashboard data
   */
  async getPayrollDashboard() {
    // Get all employees
    const allEmployees = await Employee.find({});
    
    // Find employees without bank account
    const employeesWithoutBank = allEmployees.filter(emp => 
      !emp.bankAccountNumber || !emp.bankName
    );
    
    // Find employees without manager
    const employeesWithoutManager = allEmployees.filter(emp => 
      !emp.manager || emp.manager.trim() === ''
    );
    
    // Get recent payruns (last 6 months for chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentPayruns = await Payrun.find({
      createdAt: { $gte: sixMonthsAgo }
    }).sort({ year: 1, month: 1 });
    
    // Calculate employer cost and employee count per month
    const monthlyData = {};
    const currentDate = new Date();
    
    // Initialize last 3 months
    for (let i = 2; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      monthlyData[monthKey] = {
        month: monthName,
        employerCost: 0,
        employeeCount: 0,
        year: date.getFullYear(),
        monthNum: date.getMonth() + 1
      };
    }
    
    // Populate with actual payrun data
    for (const payrun of recentPayruns) {
      const monthKey = `${payrun.year}-${payrun.month}`;
      if (monthlyData[monthKey]) {
        // Get payroll records for this payrun
        const payrolls = await Payroll.find({ 
          month: payrun.month,
          year: payrun.year
        }).populate('empId');
        
        monthlyData[monthKey].employeeCount = payrolls.length;
        monthlyData[monthKey].employerCost = payrolls.reduce((sum, p) => {
          return sum + (p.gross || 0);
        }, 0);
      }
    }
    
    const monthlyStats = Object.values(monthlyData);
    
    return {
      warnings: {
        employeesWithoutBank: employeesWithoutBank.map(emp => ({
          id: emp._id,
          name: emp.name,
          employeeId: emp.employeeId,
          email: emp.email
        })),
        employeesWithoutManager: employeesWithoutManager.map(emp => ({
          id: emp._id,
          name: emp.name,
          employeeId: emp.employeeId,
          email: emp.email
        }))
      },
      payruns: recentPayruns.map(pr => ({
        id: pr._id,
        month: pr.month,
        year: pr.year,
        status: pr.status,
        displayName: `Payrun for ${new Date(pr.year, pr.month - 1).toLocaleString('default', { month: 'short', year: 'numeric' })}`
      })),
      monthlyStats,
      totalEmployees: allEmployees.length
    };
  }
}

module.exports = new PayrollService();
