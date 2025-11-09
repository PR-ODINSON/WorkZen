class AppConstants {
  static const String appName = 'WorkZen';
  static const String appTagline = 'Simplifying Workforce Management';

  // 🔗 Backend
  static const String baseUrl = 'https://773f363fd2ff.ngrok-free.app';

  // ✅ Add this so attendance_service.dart can use it directly
  static String get apiBaseUrl => '$baseUrl/api';

  // ✅ Token (to be updated after login by AuthService)
  static String userToken = '';

  // 🎨 Colors
  static const int primaryColorValue = 0xFF2196F3;
  static const int secondaryColorValue = 0xFF03A9F4;
  static const int accentColorValue = 0xFF00BCD4;

  // 🏖 Leave Types
  static const List<String> leaveTypes = [
    'Paid Time-off',
    'Sick',
    'Unpaid Time-off',
  ];

  // 📋 Leave Status
  static const String leaveStatusPending = 'Pending';
  static const String leaveStatusApproved = 'Approved';
  static const String leaveStatusRejected = 'Rejected';

  // 🕒 Attendance Status
  static const String attendancePresent = 'Present';
  static const String attendanceAbsent = 'Absent';
  static const String attendanceLate = 'Late';
  static const String attendanceOnLeave = 'On Leave';
}
