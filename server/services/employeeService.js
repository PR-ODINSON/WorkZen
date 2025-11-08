const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authService = require('./authService');

/**
 * Employee Service - Business logic for employee management
 */
class EmployeeService {
  /**
   * Get all employees with pagination and filters
   */
  async getAllEmployees(query = {}) {
    const { page = 1, limit = 10, search, department, designation } = query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (designation) filter.designation = designation;

    const skip = (page - 1) * limit;
    const employees = await Employee.find(filter)
      .populate('department', 'name')
      .populate('designation', 'title')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(filter);

    return {
      employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id) {
    const employee = await Employee.findById(id)
      .populate('userId', 'name email role loginId');

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData) {
    const { email, password, name, role, joiningDate, ...otherData } = employeeData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Welcome@123', salt);

    // Determine joining year from joiningDate or use current year
    const joiningYear = joiningDate 
      ? new Date(joiningDate).getFullYear() 
      : new Date().getFullYear();

    // Generate Login ID using authService method
    const loginId = await authService.generateLoginId(name, joiningYear);

    // Create user account with specified role or default to Employee
    const user = await User.create({
      name: name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      loginId,
      joiningYear,
    });

    // Create employee record
    const employee = await Employee.create({
      userId: user._id,
      name,
      email,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      ...otherData,
    });

    return await this.getEmployeeById(employee._id);
  }

  /**
   * Update employee
   */
  async updateEmployee(id, updateData) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Update employee
    Object.assign(employee, updateData);
    await employee.save();

    // Update user if email or name changed
    if (updateData.email || updateData.firstName || updateData.lastName) {
      const user = await User.findById(employee.user);
      if (user) {
        if (updateData.email) user.email = updateData.email;
        if (updateData.firstName || updateData.lastName) {
          user.name = `${updateData.firstName || employee.firstName} ${updateData.lastName || employee.lastName}`;
        }
        await user.save();
      }
    }

    return await this.getEmployeeById(id);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Delete associated user
    if (employee.user) {
      await User.findByIdAndDelete(employee.user);
    }

    // Delete employee
    await Employee.findByIdAndDelete(id);

    return { message: 'Employee deleted successfully' };
  }
}

module.exports = new EmployeeService();
