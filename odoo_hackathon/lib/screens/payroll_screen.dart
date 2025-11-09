import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../models/payroll.dart';
import '../models/employee.dart';
import '../services/storage_service.dart';
import '../services/auth_service.dart';
import 'payslip_detail_screen.dart';

class PayrollScreen extends StatefulWidget {
  const PayrollScreen({super.key});

  @override
  State<PayrollScreen> createState() => _PayrollScreenState();
}

class _PayrollScreenState extends State<PayrollScreen> {
  final _authService = AuthService();
  final _storageService = StorageService();
  List<Payroll> _payrollList = [];
  Employee? _currentEmployee;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadPayrollData();
  }

  Future<void> _loadPayrollData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final employee = await _authService.getCurrentEmployee();
      if (employee != null) {
        _currentEmployee = employee;
        final payrollList = await _storageService.getPayroll(employee.id);
        
        setState(() {
          _payrollList = payrollList;
        });
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Failed to load payroll data',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _viewPayslip(Payroll payroll) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => PayslipDetailScreen(
          payroll: payroll,
          employee: _currentEmployee,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payroll'),
        automaticallyImplyLeading: false,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadPayrollData,
              child: _payrollList.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.receipt_long,
                            size: 64,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No payroll records available',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Payroll slips will appear here once generated',
                            style: TextStyle(
                              color: Colors.grey[500],
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _payrollList.length,
                      itemBuilder: (context, index) {
                        final payroll = _payrollList[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(16),
                            leading: CircleAvatar(
                              backgroundColor:
                                  Theme.of(context).colorScheme.primary,
                              child: const Icon(
                                Icons.receipt_long,
                                color: Colors.white,
                              ),
                            ),
                            title: Text(
                              DateFormat('MMMM yyyy').format(payroll.month),
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 8),
                                Text(
                                  'Pay Period: ${DateFormat('dd MMM').format(payroll.payPeriodStart)} - ${DateFormat('dd MMM, yyyy').format(payroll.payPeriodEnd)}',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Net Pay: ₹${NumberFormat('#,##0.00').format(payroll.netPay)}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green[700],
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.visibility),
                                  onPressed: () => _viewPayslip(payroll),
                                  tooltip: 'View Payslip',
                                ),
                                IconButton(
                                  icon: const Icon(Icons.print),
                                  onPressed: () {
                                    _viewPayslip(payroll);
                                    // Print will be handled in the detail screen
                                  },
                                  tooltip: 'Print',
                                ),
                              ],
                            ),
                            onTap: () => _viewPayslip(payroll),
                          ),
                        );
                      },
                    ),
            ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 3,
        onDestinationSelected: (index) {
          switch (index) {
            case 0:
              context.go('/dashboard');
              break;
            case 1:
              context.go('/attendance');
              break;
            case 2:
              context.go('/leave');
              break;
            case 3:
              // Already on payroll
              break;
            case 4:
              context.go('/profile');
              break;
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_today),
            label: 'Attendance',
          ),
          NavigationDestination(
            icon: Icon(Icons.beach_access),
            label: 'Leave',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Payroll',
          ),
          NavigationDestination(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
