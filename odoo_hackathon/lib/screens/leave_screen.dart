import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:file_picker/file_picker.dart';
import '../utils/constants.dart';
import '../services/auth_service.dart';
import '../screens/dashboard_screen.dart'; // <- added import
import 'package:go_router/go_router.dart';


class LeaveScreen extends StatefulWidget {
  const LeaveScreen({super.key});

  @override
  State<LeaveScreen> createState() => _LeaveScreenState();
}

class _LeaveScreenState extends State<LeaveScreen> {
  final _authService = AuthService();
  bool _isLoading = false;
  bool _isSubmitting = false;

  List<dynamic> _leaveRequests = [];
  Map<String, dynamic>? _leaveBalance;

  String _leaveType = 'Paid time Off';
  DateTime? _startDate;
  DateTime? _endDate;
  int _numberOfDays = 0;
  File? _selectedFile;
  final _formKey = GlobalKey<FormState>();
  bool _showModal = false;

  @override
  void initState() {
    super.initState();
    _fetchLeaveData();
  }

  Future<void> _fetchLeaveData() async {
    setState(() => _isLoading = true);
    try {
      final token = await _authService.getToken();
      if (token == null || token.isEmpty) {
        Fluttertoast.showToast(msg: 'Session expired or not logged in. Please login again.');
        await _authService.logout();
        setState(() => _isLoading = false);
        return;
      }

      final year = DateTime.now().year;

      final reqRes = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/leaves/my-requests?year=$year'),
        headers: {'Authorization': 'Bearer $token'},
      );
      final balRes = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/leaves/balance'),
        headers: {'Authorization': 'Bearer $token'},
      );

      print('🟦 List resp status: ${reqRes.statusCode} resp: ${reqRes.body}');
      print('🟨 Balance resp status: ${balRes.statusCode} resp: ${balRes.body}');

      if ((reqRes.statusCode == 401 || reqRes.statusCode == 403) ||
          (balRes.statusCode == 401 || balRes.statusCode == 403)) {
        Fluttertoast.showToast(msg: 'Session expired. Please log in again.');
        await _authService.logout();
        setState(() => _isLoading = false);
        return;
      }

      if (reqRes.statusCode == 200 && balRes.statusCode == 200) {
        final decodedReq = json.decode(reqRes.body);
        final decodedBal = json.decode(balRes.body);

        setState(() {
          _leaveRequests = decodedReq['leaves'] ?? decodedReq['data']?['leaves'] ?? [];
          _leaveBalance = decodedBal['balance'] ?? decodedBal['data']?['balance'] ?? {};
        });

        print('✅ Leave list count: ${_leaveRequests.length}');
        print('✅ Leave balance: $_leaveBalance');
      } else {
        Fluttertoast.showToast(msg: 'Failed to fetch leave data');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error: ${e.toString()}');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
      withData: true,
    );
    if (result != null && result.files.single.bytes != null) {
      final file = File(result.files.single.path!);
      if (file.lengthSync() > 5 * 1024 * 1024) {
        Fluttertoast.showToast(msg: 'File must be less than 5MB');
        return;
      }
      setState(() => _selectedFile = file);
    }
  }

  int _calculateDays() {
    if (_startDate == null || _endDate == null) return 0;
    return _endDate!.difference(_startDate!).inDays + 1;
  }

  bool _validateForm() {
    if (_startDate == null || _endDate == null) {
      Fluttertoast.showToast(msg: 'Please select both dates');
      return false;
    }
    if (_endDate!.isBefore(_startDate!)) {
      Fluttertoast.showToast(msg: 'End date must be after start date');
      return false;
    }

    final days = _calculateDays();

    if (_leaveBalance != null) {
      final typeKey = _leaveType == 'Paid time Off' ? 'paidTimeOff' : 'sickTimeOff';
      final available = _leaveBalance![typeKey]?['available'] ?? 0;
      if (days > available) {
        Fluttertoast.showToast(msg: 'Insufficient balance. Available: $available days');
        return false;
      }
    }

    if (_leaveType == 'Sick time off' && _selectedFile == null) {
      Fluttertoast.showToast(msg: 'Medical certificate is required for sick leave');
      return false;
    }

    return true;
  }

  Future<void> _submitLeave() async {
    if (!_validateForm()) return;

    setState(() => _isSubmitting = true);
    final token = await _authService.getToken();

    if (token == null || token.isEmpty) {
      Fluttertoast.showToast(msg: 'Session expired. Please log in again.');
      await _authService.logout();
      setState(() => _isSubmitting = false);
      return;
    }

    final rawBase = AppConstants.baseUrl.trim().replaceAll(RegExp(r'\s+'), '');
    final sanitizedBase = rawBase.replaceAll(RegExp(r'/$'), '');
    final url = Uri.parse('$sanitizedBase/api/leaves');

    print('➡️ Submitting leave request to: $url');
    print('➡️ Leave Type: $_leaveType');
    print('➡️ Start Date: $_startDate');
    print('➡️ End Date: $_endDate');
    print('➡️ File attached: ${_selectedFile != null}');

    try {
      String? fakeAttachment;
      if (_selectedFile != null) {
        fakeAttachment = _selectedFile!.path.split('/').last;
        print('📎 Sending filename only: $fakeAttachment');
      }

      final body = {
        'leaveType': _leaveType,
        'startDate': _startDate!.toIso8601String(),
        'endDate': _endDate!.toIso8601String(),
        'numberOfDays': _calculateDays(),
        'attachment': fakeAttachment ?? '',
      };

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      print('⬅️ Response (${response.statusCode}): ${response.body}');
      final responseBody = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (responseBody['success'] == true) {
          Fluttertoast.showToast(msg: '✅ Leave request submitted successfully');
          setState(() {
            _showModal = false;
            _startDate = null;
            _endDate = null;
            _selectedFile = null;
            _numberOfDays = 0;
          });
          await _fetchLeaveData();
        } else {
          Fluttertoast.showToast(
            msg: responseBody['message'] ?? 'Failed to submit leave request',
          );
        }
      } else {
        Fluttertoast.showToast(
          msg: responseBody['message'] ??
              'Error ${response.statusCode}: Failed to submit request',
        );
      }
    } catch (e) {
      print('💥 Exception while submitting leave: $e');
      Fluttertoast.showToast(msg: 'Error submitting leave request');
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  Future<void> _cancelLeave(String id) async {
    final confirm = await showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Cancel Leave?'),
        content: const Text('Are you sure you want to cancel this leave request?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('No')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Yes')),
        ],
      ),
    );

    if (confirm != true) return;

    final token = await _authService.getToken();
    if (token == null || token.isEmpty) {
      Fluttertoast.showToast(msg: 'Session expired. Please log in again.');
      await _authService.logout();
      return;
    }

    try {
      final res = await http.delete(
        Uri.parse('${AppConstants.baseUrl}/api/leaves/$id'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final body = json.decode(res.body);
      if (res.statusCode == 200 && body['success'] == true) {
        Fluttertoast.showToast(msg: 'Leave cancelled successfully');
        await _fetchLeaveData();
      } else {
        Fluttertoast.showToast(msg: body['message'] ?? 'Failed to cancel');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error cancelling leave');
    }
  }

  Widget _buildLeaveCard(String title, Color color, Map<String, dynamic>? data) {
    final available = data?['available'] ?? 0;
    final total = data?['total'] ?? 0;
    final used = data?['used'] ?? 0;

    return Card(
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('$available Days Available',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text('Total: $total • Used: $used'),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Time Off'),
        leading: IconButton(
  icon: const Icon(Icons.arrow_back_ios_new),
  onPressed: () {
    if (_showModal) {
      // If modal is open, close it first
      setState(() => _showModal = false);
    } else {
      // Navigate directly to dashboard using GoRouter
      context.go('/dashboard');
    }
  },
),

        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchLeaveData,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => setState(() => _showModal = true),
        icon: const Icon(Icons.add),
        label: const Text('New'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchLeaveData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    if (_leaveBalance != null && _leaveBalance!.isNotEmpty) ...[
                      Row(
                        children: [
                          Expanded(
                              child: _buildLeaveCard('Paid Time Off', Colors.blue,
                                  _leaveBalance!['paidTimeOff'])),
                          const SizedBox(width: 12),
                          Expanded(
                              child: _buildLeaveCard('Sick Time Off', Colors.red,
                                  _leaveBalance!['sickTimeOff'])),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ] else
                      const Center(child: Text('No balance data available')),
                    if (_leaveRequests.isEmpty)
                      const Center(child: Text('No leave requests found')),
                    ..._leaveRequests.map((req) {
                      final statusColor = {
                        'pending': Colors.orange,
                        'approved': Colors.green,
                        'rejected': Colors.red,
                      }[req['status']] ?? Colors.grey;
                      return Card(
                        child: ListTile(
                          title: Text(req['leaveType']),
                          subtitle: Text(
                            '${DateFormat('dd MMM').format(DateTime.parse(req['startDate']))} - '
                            '${DateFormat('dd MMM yyyy').format(DateTime.parse(req['endDate']))}',
                          ),
                          trailing: req['status'] == 'pending'
                              ? TextButton(
                                  onPressed: () => _cancelLeave(req['_id']),
                                  child: const Text('Cancel',
                                      style: TextStyle(color: Colors.red)),
                                )
                              : Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: statusColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    req['status'].toUpperCase(),
                                    style: TextStyle(
                                        color: statusColor,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),
      bottomSheet: _showModal
          ? Container(
              color: Colors.white,
              padding: const EdgeInsets.all(16),
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('New Time Off Request',
                              style:
                                  TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => setState(() => _showModal = false),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: _leaveType,
                        items: const [
                          DropdownMenuItem(
                              value: 'Paid time Off', child: Text('Paid time Off')),
                          DropdownMenuItem(
                              value: 'Sick time off', child: Text('Sick time off')),
                        ],
                        onChanged: (v) => setState(() => _leaveType = v!),
                        decoration:
                            const InputDecoration(labelText: 'Time off type'),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: ListTile(
                              title: const Text('Start Date'),
                              subtitle: Text(_startDate == null
                                  ? 'Select'
                                  : DateFormat('MMM d, yyyy')
                                      .format(_startDate!)),
                              onTap: () async {
                                final picked = await showDatePicker(
                                  context: context,
                                  initialDate: DateTime.now(),
                                  firstDate: DateTime.now(),
                                  lastDate: DateTime.now()
                                      .add(const Duration(days: 365)),
                                );
                                if (picked != null) {
                                  setState(() {
                                    _startDate = picked;
                                    if (_endDate != null &&
                                        _endDate!.isBefore(picked)) {
                                      _endDate = null;
                                    }
                                  });
                                }
                              },
                            ),
                          ),
                          Expanded(
                            child: ListTile(
                              title: const Text('End Date'),
                              subtitle: Text(_endDate == null
                                  ? 'Select'
                                  : DateFormat('MMM d, yyyy')
                                      .format(_endDate!)),
                              onTap: () async {
                                if (_startDate == null) {
                                  Fluttertoast.showToast(
                                      msg: 'Select start date first');
                                  return;
                                }
                                final picked = await showDatePicker(
                                  context: context,
                                  initialDate: _startDate!,
                                  firstDate: _startDate!,
                                  lastDate: DateTime.now()
                                      .add(const Duration(days: 365)),
                                );
                                if (picked != null)
                                  setState(() => _endDate = picked);
                              },
                            ),
                          ),
                        ],
                      ),
                      if (_startDate != null && _endDate != null)
                        Text('Total Days: ${_calculateDays()}',
                            style: const TextStyle(color: Colors.blue)),
                      const SizedBox(height: 8),
                      if (_leaveType == 'Sick time off')
                        Column(
                          children: [
                            ElevatedButton.icon(
                              onPressed: _pickFile,
                              icon: const Icon(Icons.upload_file),
                              label: Text(_selectedFile == null
                                  ? 'Upload Medical Certificate'
                                  : _selectedFile!.path.split('/').last),
                            ),
                            const SizedBox(height: 8),
                          ],
                        ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _isSubmitting ? null : _submitLeave,
                        child: _isSubmitting
                            ? const SizedBox(
                                height: 18,
                                width: 18,
                                child:
                                    CircularProgressIndicator(strokeWidth: 2),
                              )
                            : const Text('Submit Request'),
                      ),
                    ],
                  ),
                ),
              ),
            )
          : null,
    );
  }
}
