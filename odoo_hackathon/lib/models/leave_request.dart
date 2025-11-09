class LeaveRequest {
  final String id;
  final String employeeId;
  final String leaveType; // Casual, Sick, Unpaid
  final DateTime fromDate;
  final DateTime toDate;
  final String reason;
  final String status; // Pending, Approved, Rejected
  final DateTime appliedDate;
  final String? remarks;

  LeaveRequest({
    required this.id,
    required this.employeeId,
    required this.leaveType,
    required this.fromDate,
    required this.toDate,
    required this.reason,
    this.status = 'Pending',
    required this.appliedDate,
    this.remarks,
  });

  int get days {
    return toDate.difference(fromDate).inDays + 1;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeId': employeeId,
      'leaveType': leaveType,
      'fromDate': fromDate.toIso8601String(),
      'toDate': toDate.toIso8601String(),
      'reason': reason,
      'status': status,
      'appliedDate': appliedDate.toIso8601String(),
      'remarks': remarks,
    };
  }

  factory LeaveRequest.fromJson(Map<String, dynamic> json) {
    return LeaveRequest(
      id: json['id'] ?? '',
      employeeId: json['employeeId'] ?? '',
      leaveType: json['leaveType'] ?? '',
      fromDate: DateTime.parse(json['fromDate'] ?? DateTime.now().toIso8601String()),
      toDate: DateTime.parse(json['toDate'] ?? DateTime.now().toIso8601String()),
      reason: json['reason'] ?? '',
      status: json['status'] ?? 'Pending',
      appliedDate: DateTime.parse(json['appliedDate'] ?? DateTime.now().toIso8601String()),
      remarks: json['remarks'],
    );
  }
}

