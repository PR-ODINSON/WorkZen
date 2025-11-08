const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
      .populate('department', 'name')
      .populate('designation', 'title')
      .populate('user', 'name email role');

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData) {
    const { email, password, firstName, lastName, ...otherData } = employeeData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Welcome@123', salt);

    // Create user account
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: 'employee',
    });

    // Create employee record
    const employee = await Employee.create({
      user: user._id,
      firstName,
      lastName,
      email,
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
