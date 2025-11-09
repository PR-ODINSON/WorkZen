import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/employee.dart';
import '../models/attendance.dart';
import '../models/leave_request.dart';
import '../models/payroll.dart';

class StorageService {
  static const String _keyEmployees = 'employees';
  static const String _keyAttendance = 'attendance';
  static const String _keyLeaveRequests = 'leave_requests';
  static const String _keyPayroll = 'payroll';
  static const String _keyAuthToken = 'auth_token';


  /// Save JWT token after successful login
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyAuthToken, token);
  }

  /// Retrieve saved JWT token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyAuthToken);
  }

  /// Clear stored JWT token (used on logout)
  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyAuthToken);
  }
  
  // Initialize mock employees on first run
  Future<void> _initializeMockEmployees() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey(_keyEmployees)) {
      final mockEmployees = [
        Employee(
          id: '1',
          name: 'John Doe',
          email: 'john.doe@workzen.com',
          employeeId: 'EMP001',
          department: 'Engineering',
          designation: 'Software Developer',
          phone: '+1234567890',
          address: '123 Main St, City, State',
          dateOfJoining: DateTime(2023, 1, 15),
        ),
        Employee(
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@workzen.com',
          employeeId: 'EMP002',
          department: 'Design',
          designation: 'UI/UX Designer',
          phone: '+1234567891',
          address: '456 Oak Ave, City, State',
          dateOfJoining: DateTime(2023, 2, 1),
        ),
        Employee(
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@workzen.com',
          employeeId: 'EMP003',
          department: 'Marketing',
          designation: 'Marketing Manager',
          phone: '+1234567892',
          address: '789 Pine Rd, City, State',
          dateOfJoining: DateTime(2022, 11, 20),
        ),
      ];
      await _saveEmployees(mockEmployees);
    }
  }

  Future<List<Employee>> _loadEmployees() async {
    final prefs = await SharedPreferences.getInstance();
    final employeesJson = prefs.getString(_keyEmployees);
    if (employeesJson != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(employeesJson);
        return jsonList.map((json) => Employee.fromJson(json)).toList();
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  Future<void> _saveEmployees(List<Employee> employees) async {
    final prefs = await SharedPreferences.getInstance();
    final employeesJson = jsonEncode(employees.map((e) => e.toJson()).toList());
    await prefs.setString(_keyEmployees, employeesJson);
  }

  Future<List<Attendance>> _loadAttendance() async {
    final prefs = await SharedPreferences.getInstance();
    final attendanceJson = prefs.getString(_keyAttendance);
    if (attendanceJson != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(attendanceJson);
        return jsonList.map((json) => Attendance.fromJson(json)).toList();
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  Future<void> _saveAttendance(List<Attendance> attendance) async {
    final prefs = await SharedPreferences.getInstance();
    final attendanceJson = jsonEncode(attendance.map((a) => a.toJson()).toList());
    await prefs.setString(_keyAttendance, attendanceJson);
  }

  Future<List<LeaveRequest>> _loadLeaveRequests() async {
    final prefs = await SharedPreferences.getInstance();
    final leaveRequestsJson = prefs.getString(_keyLeaveRequests);
    if (leaveRequestsJson != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(leaveRequestsJson);
        return jsonList.map((json) => LeaveRequest.fromJson(json)).toList();
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  Future<void> _saveLeaveRequests(List<LeaveRequest> leaveRequests) async {
    final prefs = await SharedPreferences.getInstance();
    final leaveRequestsJson = jsonEncode(leaveRequests.map((l) => l.toJson()).toList());
    await prefs.setString(_keyLeaveRequests, leaveRequestsJson);
  }

  Future<List<Employee>> getEmployees() async {
    await _initializeMockEmployees();
    return _loadEmployees();
  }

  Future<Employee?> getEmployeeById(String id) async {
    final employees = await getEmployees();
    try {
      return employees.firstWhere((e) => e.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<List<Employee>> searchEmployees(String query) async {
    final employees = await getEmployees();
    if (query.isEmpty) return employees;
    return employees.where((employee) {
      return employee.name.toLowerCase().contains(query.toLowerCase()) ||
          employee.department.toLowerCase().contains(query.toLowerCase()) ||
          employee.employeeId.toLowerCase().contains(query.toLowerCase());
    }).toList();
  }

  Future<List<Attendance>> getAttendance(String employeeId) async {
    final attendance = await _loadAttendance();
    return attendance.where((a) => a.employeeId == employeeId).toList();
  }

  Future<void> markAttendance(Attendance attendance) async {
    final allAttendance = await _loadAttendance();
    // Remove existing attendance for the same day
    allAttendance.removeWhere((a) =>
        a.employeeId == attendance.employeeId &&
        a.date.year == attendance.date.year &&
        a.date.month == attendance.date.month &&
        a.date.day == attendance.date.day);
    allAttendance.add(attendance);
    await _saveAttendance(allAttendance);
  }

  Future<List<LeaveRequest>> getLeaveRequests(String employeeId) async {
    final leaveRequests = await _loadLeaveRequests();
    return leaveRequests.where((l) => l.employeeId == employeeId).toList();
  }

  Future<void> addLeaveRequest(LeaveRequest leaveRequest) async {
    final leaveRequests = await _loadLeaveRequests();
    leaveRequests.add(leaveRequest);
    await _saveLeaveRequests(leaveRequests);
  }

  Future<List<Payroll>> getPayroll(String employeeId) async {
    final prefs = await SharedPreferences.getInstance();
    final payrollJson = prefs.getString(_keyPayroll);
    
    if (payrollJson != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(payrollJson);
        final payrolls = jsonList.map((json) => Payroll.fromJson(json)).toList();
        return payrolls.where((p) => p.employeeId == employeeId).toList();
      } catch (e) {
        return [];
      }
    }
    
    // Generate sample payroll data for current month
    final employee = await getEmployeeById(employeeId);
    if (employee != null) {
      final now = DateTime.now();
      final monthStart = DateTime(now.year, now.month, 1);
      final monthEnd = DateTime(now.year, now.month + 1, 0);
      final payDate = DateTime(now.year, now.month, 5); // Pay on 5th of next month
      
      final earnings = [
        PayrollEarning(name: 'Basic Salary', rate: 100, amount: 25000.0),
        PayrollEarning(name: 'House Rent Allowance', rate: 100, amount: 12500.0),
        PayrollEarning(name: 'Standard Allowance', rate: 100, amount: 4167.0),
        PayrollEarning(name: 'Performance Bonus', rate: 100, amount: 2082.50),
        PayrollEarning(name: 'Leave Travel Allowance', rate: 100, amount: 2082.50),
        PayrollEarning(name: 'Fixed Allowance', rate: 100, amount: 4168.0),
      ];
      
      final deductions = [
        PayrollDeduction(name: 'PF Employee', rate: 100, amount: 3000.0),
        PayrollDeduction(name: 'PF Employer', rate: 100, amount: 3000.0),
        PayrollDeduction(name: 'Professional Tax', rate: 100, amount: 200.0),
        PayrollDeduction(name: 'TDS Deduction', rate: 100, amount: 0.0),
      ];
      
      final grossEarnings = earnings.fold(0.0, (sum, e) => sum + e.amount);
      final totalDeductions = deductions.fold(0.0, (sum, d) => sum + d.amount);
      final netPay = grossEarnings - totalDeductions;
      
      final samplePayroll = Payroll(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        employeeId: employeeId,
        month: monthStart,
        payDate: payDate,
        payPeriodStart: monthStart,
        payPeriodEnd: monthEnd,
        employeeName: employee.name,
        employeeCode: employee.employeeId,
        department: employee.department,
        location: employee.address.split(',').first,
        dateOfJoining: employee.dateOfJoining,
        pan: 'DIBxxxxx3',
        uan: '23423423423',
        bankAccountNumber: '23423423432',
        attendanceDays: 20,
        totalDays: 22,
        earnings: earnings,
        deductions: deductions,
        grossEarnings: grossEarnings,
        totalDeductions: totalDeductions,
        netPay: netPay,
        isGenerated: true,
      );
      
      final payrolls = [samplePayroll];
      await _savePayroll(payrolls);
      return payrolls;
    }
    
    return [];
  }

  Future<void> _savePayroll(List<Payroll> payrolls) async {
    final prefs = await SharedPreferences.getInstance();
    final payrollJson = jsonEncode(payrolls.map((p) => p.toJson()).toList());
    await prefs.setString(_keyPayroll, payrollJson);
  }

  Future<void> updateEmployee(Employee employee) async {
    final employees = await _loadEmployees();
    final index = employees.indexWhere((e) => e.id == employee.id);
    if (index != -1) {
      employees[index] = employee;
      await _saveEmployees(employees);
    }
  }
}

