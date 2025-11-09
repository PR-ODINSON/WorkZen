import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';
import '../models/employee.dart';
import '../models/payroll.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _selectedTab = 0;
  bool _isEditing = false;

  final aboutCtrl = TextEditingController(text: "I am a passionate software developer...");
  final loveCtrl = TextEditingController(text: "Creating meaningful apps that help people.");
  final hobbiesCtrl = TextEditingController(text: "Music, Reading, and Hiking.");
  final skillsCtrl = TextEditingController(text: "Flutter, Firebase, Dart, and UI/UX Design.");
  final certCtrl = TextEditingController(text: "Certified Flutter Developer - 2025");

  // Async-loaded tab data
  Future<Employee?>? _employeeFuture;
  Future<List<Payroll>>? _payrollFuture;

  @override
  void initState() {
    super.initState();
    final auth = AuthService();
    _employeeFuture = auth.getCurrentEmployee();
    _employeeFuture!.then((emp) {
      if (emp != null) {
        _payrollFuture = StorageService().getPayroll(emp.id);
        setState(() {});
      }
    });
  }

  void _switchTab(int index) => setState(() => _selectedTab = index);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () {
            // Use GoRouter context.go or context.pop for best practice
            if (Navigator.canPop(context)) {
              Navigator.of(context).pop();
            } else {
              if (mounted) {
                context.go('/dashboard');
              }
            }
          },
        ),
        title: const Text(
          'My Profile',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.close : Icons.edit, color: Colors.black87),
            onPressed: () => setState(() => _isEditing = !_isEditing),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _buildHeader(),
          const SizedBox(height: 20),
          _buildTabs(),
          const Divider(),
          const SizedBox(height: 10),
          Expanded(child: _buildTabContent()),
        ]),
      ),
    );
  }

  // ────────────────────────────────────────────
  Widget _buildHeader() {
    return Card(
      color: Colors.white,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(18.0),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth > 650;
            return isWide
                ? Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Stack(children: [
                        const CircleAvatar(
                          radius: 52,
                          backgroundColor: Colors.blueAccent,
                          child: Icon(Icons.person, size: 60, color: Colors.white),
                        ),
                        Positioned(
                          bottom: 2,
                          right: 2,
                          child: CircleAvatar(
                            radius: 18,
                            backgroundColor: Colors.white,
                            child: Icon(Icons.edit, color: Colors.blueAccent, size: 18),
                          ),
                        ),
                      ]),
                      const SizedBox(width: 32),
                      Expanded(
                        flex: 2,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "My Name",
                              style: TextStyle(
                                  color: Colors.black87,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            _infoRow("Job Position", "Software Developer"),
                            _infoRow("Email", "myemail@example.com"),
                            _infoRow("Mobile", "+91 9876543210"),
                          ],
                        ),
                      ),
                      const SizedBox(width: 32),
                      Expanded(
                        flex: 2,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _infoRow("Company", "WorkZen Technologies"),
                            _infoRow("Department", "Engineering"),
                            _infoRow("Manager", "Rahul Sharma"),
                            _infoRow("Location", "Bangalore"),
                          ],
                        ),
                      ),
                    ],
                  )
                : Column(
                    children: [
                      const CircleAvatar(
                        radius: 52,
                        backgroundColor: Colors.blueAccent,
                        child: Icon(Icons.person, size: 60, color: Colors.white),
                      ),
                      const SizedBox(height: 16),
                      _textSection("My Name", [
                        _infoRow("Job Position", "Software Developer"),
                        _infoRow("Email", "myemail@example.com"),
                        _infoRow("Mobile", "+91 9876543210"),
                      ]),
                      const SizedBox(height: 12),
                      _textSection("Company Details", [
                        _infoRow("Company", "WorkZen Technologies"),
                        _infoRow("Department", "Engineering"),
                        _infoRow("Manager", "Rahul Sharma"),
                        _infoRow("Location", "Bangalore"),
                      ]),
                    ],
                  );
          },
        ),
      ),
    );
  }

  Widget _textSection(String title, List<Widget> children) {
    return Card(
      color: Colors.white,
      margin: EdgeInsets.zero,
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title,
              style: const TextStyle(
                  color: Colors.blueAccent,
                  fontWeight: FontWeight.bold,
                  fontSize: 16)),
          const SizedBox(height: 6),
          ...children,
        ]),
      ),
    );
  }

  Widget _infoRow(String label, String value) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Row(
          children: [
            SizedBox(
                width: 110,
                child: Text(
                  "$label:",
                  style: const TextStyle(
                      color: Colors.black54, fontWeight: FontWeight.w600),
                )),
            Expanded(
                child: Text(value,
                    style: const TextStyle(
                        color: Colors.black87, fontWeight: FontWeight.w500))),
          ],
        ),
      );

  // ────────────────────────────────────────────
  Widget _buildTabs() {
    const tabs = ['Resume', 'Private Info', 'Salary Info', 'Security'];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: List.generate(tabs.length, (i) {
          final selected = _selectedTab == i;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => _switchTab(i),
              borderRadius: BorderRadius.circular(6),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: selected ? Colors.blueAccent : Colors.transparent,
                  border: Border.all(
                    color: selected ? Colors.blueAccent : Colors.black26,
                    width: selected ? 1.3 : 1,
                  ),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  tabs[i],
                  style: TextStyle(
                    color: selected ? Colors.white : Colors.black87,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  // ────────────────────────────────────────────
  Widget _buildTabContent() {
    switch (_selectedTab) {
      case 0:
        return _resumeTab();
      case 1:
        return _privateInfoTab();
      case 2:
        return _salaryInfoTab();
      case 3:
        return _securityTab();
      default:
        return const SizedBox();
    }
  }

  // ────────────────────────────────────────────
  Widget _resumeTab() {
    return SingleChildScrollView(
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        _editableSection("About Me", aboutCtrl),
        _editableSection("What I Love About My Job", loveCtrl),
        _editableSection("My Interests & Hobbies", hobbiesCtrl),
        _editableSection("Skills", skillsCtrl),
        _editableSection("Certifications", certCtrl),
        const SizedBox(height: 20),
        if (_isEditing)
          Row(
            children: [
              OutlinedButton(
                  onPressed: () => setState(() => _isEditing = false),
                  child: const Text("Cancel")),
              const SizedBox(width: 12),
              ElevatedButton(
                  onPressed: () => setState(() => _isEditing = false),
                  child: const Text("Save")),
            ],
          ),
      ]),
    );
  }

  Widget _editableSection(String title, TextEditingController ctrl) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(title,
              style: const TextStyle(
                  color: Colors.blueAccent,
                  fontWeight: FontWeight.bold,
                  fontSize: 16)),
          IconButton(
            icon: Icon(_isEditing ? Icons.check : Icons.edit, color: Colors.black54),
            onPressed: () => setState(() => _isEditing = !_isEditing),
          ),
        ]),
        TextField(
          controller: ctrl,
          enabled: _isEditing,
          maxLines: null,
          style: const TextStyle(color: Colors.black),
          decoration: InputDecoration(
            hintText: "Enter $title...",
            hintStyle: const TextStyle(color: Colors.black45),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
          ),
        ),
      ]),
    );
  }

  // ────────────────────────────────────────────
  Widget _privateInfoTab() {
    // Use FutureBuilder to load employee data
    return FutureBuilder<Employee?>(
      future: _employeeFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        final emp = snapshot.data;
        if (emp == null) {
          return const Center(child: Text('No employee data found'));
        }
        final dateFormat = DateFormat('dd/MM/yyyy');
        return SingleChildScrollView(
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(
              flex: 2,
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                _infoBox("Date of Birth", dateFormat.format(emp.dateOfJoining)),
                _infoBox("Residing Address", emp.address),
                _infoBox("Nationality", "Indian"),
                _infoBox("Personal Email", emp.email),
                _infoBox("Gender", "Male"),
                _infoBox("Marital Status", "Single"),
                _infoBox("Date of Joining", dateFormat.format(emp.dateOfJoining)),
              ]),
            ),
            const SizedBox(width: 40),
            Expanded(
              flex: 1,
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text("Bank Details",
                    style: TextStyle(
                        color: Colors.blueAccent,
                        fontWeight: FontWeight.bold,
                        fontSize: 16)),
                const SizedBox(height: 12),
                _infoBox("Account Number", "**** 1234"),
                _infoBox("Bank Name", "HDFC Bank"),
                _infoBox("IFSC Code", "HDFC0001234"),
                _infoBox("PAN No", "ABCDE1234F"),
                _infoBox("UAN No", "100234567890"),
                _infoBox("Emp Code", emp.employeeId),
              ]),
            ),
          ]),
        );
      },
    );
  }

  Widget _infoBox(String label, String value) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label,
              style: const TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: Colors.black12),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(value, style: const TextStyle(color: Colors.black87)),
          ),
        ]),
      );

  // ────────────────────────────────────────────
  Widget _salaryInfoTab() {
    // Use FutureBuilder to load payroll data
    return FutureBuilder<Employee?>(
      future: _employeeFuture,
      builder: (context, empSnap) {
        if (empSnap.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        final emp = empSnap.data;
        if (emp == null) return const Center(child: Text('No employee!'));
        final payrollFuture = _payrollFuture ?? StorageService().getPayroll(emp.id);
        return FutureBuilder<List<Payroll>>(
          future: payrollFuture,
          builder: (context, snap) {
            if (snap.connectionState != ConnectionState.done) {
              return const Center(child: CircularProgressIndicator());
            }
            final payrolls = snap.data;
            if (payrolls == null || payrolls.isEmpty) {
              return const Center(child: Text('No payroll data available.'));
            }
            final payroll = payrolls.first;
            // show current month's payroll only
            return SingleChildScrollView(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                _salaryRow("Month", DateFormat('MMMM yyyy').format(payroll.month)),
                _salaryRow("Yearly Wage", '₹${(payroll.grossEarnings * 12).toStringAsFixed(0)}'),
                _salaryRow("Working Days", payroll.attendanceDays.toString()),
                _salaryRow("Break Time", "1 hour"),
                const SizedBox(height: 14),
                const Text("Salary Components",
                    style: TextStyle(
                        color: Colors.blueAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 10),
                ...payroll.earnings.map((e) => _componentRow(e.name, '₹${e.amount.toStringAsFixed(0)}')).toList(),
                ...payroll.deductions.map((d) => _componentRow(d.name, '-₹${d.amount.toStringAsFixed(0)}')).toList(),
                const Divider(),
                _salaryRow("Net Pay", '₹${payroll.netPay.toStringAsFixed(0)}'),
              ]),
            );
          },
        );
      },
    );
  }

  Widget _salaryRow(String label, String value) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(children: [
          SizedBox(
              width: 180,
              child: Text(label,
                  style: const TextStyle(color: Colors.black54, fontWeight: FontWeight.w600))),
          Expanded(
              child: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.black12),
                      borderRadius: BorderRadius.circular(6)),
                  child: Text(value, style: const TextStyle(color: Colors.black87)))),
        ]),
      );

  Widget _componentRow(String name, String value) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(color: Colors.black87)),
              Text(value, style: const TextStyle(color: Colors.black87)),
            ]),
      );

  // ────────────────────────────────────────────
  Widget _securityTab() {
    // This is a placeholder that could use provider/api hooks/state in future
    bool twoFactorEnabled = false; // Dummy for now
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      ElevatedButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.lock),
          label: const Text("Change Password")),
      const SizedBox(height: 14),
      SwitchListTile(
        title: const Text("Enable Two-Factor Authentication",
            style: TextStyle(color: Colors.black87)),
        value: twoFactorEnabled,
        onChanged: (v) {
          // TODO: integrate with backend/provider
          setState(() { /* twoFactorEnabled = v; */ });
        },
      ),
      const SizedBox(height: 14),
      ElevatedButton.icon(
        style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
        onPressed: () {},
        icon: const Icon(Icons.logout),
        label: const Text("Logout"),
      ),
    ]);
  }
}
