class PayrollEarning {
  final String name;
  final double rate;
  final double amount;

  PayrollEarning({
    required this.name,
    required this.rate,
    required this.amount,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'rate': rate,
      'amount': amount,
    };
  }

  factory PayrollEarning.fromJson(Map<String, dynamic> json) {
    return PayrollEarning(
      name: json['name'] ?? '',
      rate: json['rate']?.toDouble() ?? 0.0,
      amount: json['amount']?.toDouble() ?? 0.0,
    );
  }
}

class PayrollDeduction {
  final String name;
  final double rate;
  final double amount;

  PayrollDeduction({
    required this.name,
    required this.rate,
    required this.amount,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'rate': rate,
      'amount': amount,
    };
  }

  factory PayrollDeduction.fromJson(Map<String, dynamic> json) {
    return PayrollDeduction(
      name: json['name'] ?? '',
      rate: json['rate']?.toDouble() ?? 0.0,
      amount: json['amount']?.toDouble() ?? 0.0,
    );
  }
}

class Payroll {
  final String id;
  final String employeeId;
  final DateTime month;
  final DateTime payDate;
  final DateTime payPeriodStart;
  final DateTime payPeriodEnd;
  
  // Employee details
  final String employeeName;
  final String employeeCode;
  final String department;
  final String location;
  final DateTime dateOfJoining;
  final String pan;
  final String uan;
  final String bankAccountNumber;
  
  // Worked days
  final int attendanceDays;
  final int totalDays;
  
  // Earnings breakdown
  final List<PayrollEarning> earnings;
  
  // Deductions breakdown
  final List<PayrollDeduction> deductions;
  
  // Totals
  final double grossEarnings;
  final double totalDeductions;
  final double netPay;
  
  final bool isGenerated;
  final String? payslipUrl;

  Payroll({
    required this.id,
    required this.employeeId,
    required this.month,
    required this.payDate,
    required this.payPeriodStart,
    required this.payPeriodEnd,
    required this.employeeName,
    required this.employeeCode,
    required this.department,
    required this.location,
    required this.dateOfJoining,
    required this.pan,
    required this.uan,
    required this.bankAccountNumber,
    required this.attendanceDays,
    required this.totalDays,
    required this.earnings,
    required this.deductions,
    required this.grossEarnings,
    required this.totalDeductions,
    required this.netPay,
    this.isGenerated = false,
    this.payslipUrl,
  });

  // Legacy fields for backward compatibility
  double get basicPay => earnings.firstWhere(
    (e) => e.name == 'Basic Salary',
    orElse: () => PayrollEarning(name: 'Basic Salary', rate: 0, amount: 0),
  ).amount;
  
  double get allowances => grossEarnings - basicPay;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeId': employeeId,
      'month': month.toIso8601String(),
      'payDate': payDate.toIso8601String(),
      'payPeriodStart': payPeriodStart.toIso8601String(),
      'payPeriodEnd': payPeriodEnd.toIso8601String(),
      'employeeName': employeeName,
      'employeeCode': employeeCode,
      'department': department,
      'location': location,
      'dateOfJoining': dateOfJoining.toIso8601String(),
      'pan': pan,
      'uan': uan,
      'bankAccountNumber': bankAccountNumber,
      'attendanceDays': attendanceDays,
      'totalDays': totalDays,
      'earnings': earnings.map((e) => e.toJson()).toList(),
      'deductions': deductions.map((d) => d.toJson()).toList(),
      'grossEarnings': grossEarnings,
      'totalDeductions': totalDeductions,
      'netPay': netPay,
      'isGenerated': isGenerated,
      'payslipUrl': payslipUrl,
    };
  }

  factory Payroll.fromJson(Map<String, dynamic> json) {
    return Payroll(
      id: json['id'] ?? '',
      employeeId: json['employeeId'] ?? '',
      month: DateTime.parse(json['month'] ?? DateTime.now().toIso8601String()),
      payDate: json['payDate'] != null
          ? DateTime.parse(json['payDate'])
          : DateTime.now(),
      payPeriodStart: json['payPeriodStart'] != null
          ? DateTime.parse(json['payPeriodStart'])
          : DateTime.now(),
      payPeriodEnd: json['payPeriodEnd'] != null
          ? DateTime.parse(json['payPeriodEnd'])
          : DateTime.now(),
      employeeName: json['employeeName'] ?? '',
      employeeCode: json['employeeCode'] ?? '',
      department: json['department'] ?? '',
      location: json['location'] ?? '',
      dateOfJoining: json['dateOfJoining'] != null
          ? DateTime.parse(json['dateOfJoining'])
          : DateTime.now(),
      pan: json['pan'] ?? '',
      uan: json['uan'] ?? '',
      bankAccountNumber: json['bankAccountNumber'] ?? '',
      attendanceDays: json['attendanceDays'] ?? 0,
      totalDays: json['totalDays'] ?? 0,
      earnings: (json['earnings'] as List<dynamic>?)
              ?.map((e) => PayrollEarning.fromJson(e))
              .toList() ??
          [],
      deductions: (json['deductions'] as List<dynamic>?)
              ?.map((d) => PayrollDeduction.fromJson(d))
              .toList() ??
          [],
      grossEarnings: json['grossEarnings']?.toDouble() ?? 0.0,
      totalDeductions: json['totalDeductions']?.toDouble() ?? 0.0,
      netPay: json['netPay']?.toDouble() ?? 0.0,
      isGenerated: json['isGenerated'] ?? false,
      payslipUrl: json['payslipUrl'],
    );
  }
}

