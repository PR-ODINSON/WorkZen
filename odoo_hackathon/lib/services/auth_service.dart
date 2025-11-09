import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/employee.dart';
import '../utils/constants.dart'; // for baseUrl

class AuthService {
  static const String _keyIsLoggedIn = 'is_logged_in';
  static const String _keyEmployee = 'employee';
  static const String _keyToken = 'auth_token';

  /// Login Function - Connects to backend endpoint and saves token + user
  Future<bool> login(String email, String password, {bool rememberMe = false}) async {
    try {
      final url = Uri.parse('${AppConstants.baseUrl}/api/auth/login');
      print('🔹 Sending POST request to: $url');

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      print('🔹 Response Status: ${response.statusCode}');
      print('🔹 Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data['success'] == true) {
          final prefs = await SharedPreferences.getInstance();

          // ✅ Extract token safely (handle multiple formats)
          final token = data['token'] ??
                        data['data']?['token'] ??
                        data['access_token'] ??
                        data['jwt'] ??
                        '';

          if (token.isNotEmpty) {
            await prefs.setString(_keyToken, token);
            print('🔐 Token saved to SharedPreferences: $token');
          } else {
            print('⚠️ No token found in login response');
          }

          // ✅ Parse and save employee details
          Map<String, dynamic>? empJson;
          if (data['employee'] != null && data['employee'] is Map<String, dynamic>) {
            empJson = data['employee'];
          } else if (data['data']?['employee'] != null &&
                     data['data']['employee'] is Map<String, dynamic>) {
            empJson = data['data']['employee'];
          }

          final employee = empJson != null
              ? Employee.fromJson(empJson)
              : Employee(
                  id: data['id']?.toString() ?? '0',
                  name: data['name'] ?? 'User',
                  email: email,
                  employeeId: '',
                  department: '',
                  designation: '',
                  phone: '',
                  address: '',
                  dateOfJoining: DateTime.now(),
                  profileImage: '',
                  role: data['role'] ?? 'Employee',
                );

          await _saveEmployee(employee);
          await _setLoggedIn(true);

          print('✅ Login successful for ${employee.name}');
          return true;
        } else {
          print('❌ Login failed: ${data['message'] ?? 'Unknown error'}');
          return false;
        }
      } else {
        String errorMsg = 'Server error: ${response.statusCode}';
        if (response.body.isNotEmpty) {
          try {
            final body = jsonDecode(response.body);
            if (body['message'] != null) errorMsg = body['message'];
          } catch (_) {
            print('⚠️ Non-JSON error body: ${response.body}');
          }
        }
        print('❌ $errorMsg');
        return false;
      }
    } catch (e) {
      print('💥 Login exception: $e');
      return false;
    }
  }

  /// Logout user and clear all saved data
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyIsLoggedIn);
    await prefs.remove(_keyEmployee);
    await prefs.remove(_keyToken);
    print('👋 User logged out and local data cleared');
  }

  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyIsLoggedIn) ?? false;
  }

  /// Get saved employee info
  Future<Employee?> getCurrentEmployee() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(_keyIsLoggedIn) ?? false;

    if (isLoggedIn) {
      final employeeJson = prefs.getString(_keyEmployee);
      if (employeeJson != null) {
        try {
          final Map<String, dynamic> json = jsonDecode(employeeJson);
          return Employee.fromJson(json);
        } catch (e) {
          print('⚠️ Error parsing saved employee JSON: $e');
        }
      }
    }
    return null;
  }

  /// Get saved JWT token for authorized API calls
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_keyToken);
    print('🔍 getToken() returning: $token');
    return token;
  }

  /// Common headers for authorized requests
  Future<Map<String, String>> getAuthHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  // --- Internal Helpers ---
  Future<void> _setLoggedIn(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyIsLoggedIn, value);
  }

  Future<void> _saveEmployee(Employee employee) async {
    final prefs = await SharedPreferences.getInstance();
    final employeeJson = jsonEncode(employee.toJson());
    await prefs.setString(_keyEmployee, employeeJson);
  }
}
