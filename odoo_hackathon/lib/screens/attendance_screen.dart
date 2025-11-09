import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';
import '../models/attendance.dart';
import '../services/storage_service.dart';
import '../services/auth_service.dart';
import '../utils/constants.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final _storageService = StorageService();
  final _authService = AuthService();
  DateTime _focusedDay = DateTime.now();
  DateTime _selectedDay = DateTime.now();
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime? _checkInTime;
  DateTime? _checkOutTime;
  String _attendanceStatus = AppConstants.attendanceAbsent;
  bool _isLoading = false;
  
  int _daysPresent = 0;
  int _daysAbsent = 0;
  int _daysOnLeave = 0;
  int _lateArrivals = 0;
  
  final Map<DateTime, List<Attendance>> _attendanceMap = {};
  final List<Attendance> _attendanceList = [];

  @override
  void initState() {
    super.initState();
    _loadAttendanceData();
    _checkTodayAttendance();
  }

  Future<void> _loadAttendanceData() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final employee = await _authService.getCurrentEmployee();
      if (employee != null) {
        final attendanceList = await _storageService.getAttendance(employee.id);
        
        // Build attendance map for calendar
        final Map<DateTime, List<Attendance>> attendanceMap = {};
        for (var attendance in attendanceList) {
          final date = DateTime(
            attendance.date.year,
            attendance.date.month,
            attendance.date.day,
          );
          attendanceMap[date] = [attendance];
        }
        
        // Calculate stats
        final now = DateTime.now();
        final currentMonth = DateTime(now.year, now.month);
        final attendanceThisMonth = attendanceList.where((a) {
          return a.date.isAfter(currentMonth.subtract(const Duration(days: 1))) &&
                 a.date.isBefore(DateTime(now.year, now.month + 1));
        }).toList();
        
        setState(() {
          _attendanceMap.addAll(attendanceMap);
          _attendanceList.clear();
          _attendanceList.addAll(attendanceList);
          _daysPresent = attendanceThisMonth.where((a) => a.status == AppConstants.attendancePresent).length;
          _daysAbsent = attendanceThisMonth.where((a) => a.status == AppConstants.attendanceAbsent).length;
          _daysOnLeave = attendanceThisMonth.where((a) => a.status == AppConstants.attendanceOnLeave).length;
          _lateArrivals = attendanceThisMonth.where((a) => a.isLate).length;
        });
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Failed to load attendance data',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _checkTodayAttendance() async {
    final employee = await _authService.getCurrentEmployee();
    if (employee != null) {
      final today = DateTime.now();
      final todayDate = DateTime(today.year, today.month, today.day);
      
      final attendanceList = await _storageService.getAttendance(employee.id);
      try {
        final todayAttendance = attendanceList.firstWhere(
          (a) {
            final aDate = DateTime(a.date.year, a.date.month, a.date.day);
            return aDate == todayDate;
          },
        );
        
        setState(() {
          _checkInTime = todayAttendance.checkIn;
          _checkOutTime = todayAttendance.checkOut;
          _attendanceStatus = todayAttendance.status;
        });
      } catch (e) {
        // No attendance record for today
        setState(() {
          _checkInTime = null;
          _checkOutTime = null;
          _attendanceStatus = AppConstants.attendanceAbsent;
        });
      }
    }
  }

  Future<void> _handleCheckIn() async {
    final employee = await _authService.getCurrentEmployee();
    if (employee == null) return;
    
    setState(() {
      _isLoading = true;
    });
    
    try {
      final now = DateTime.now();
      final checkInTime = DateTime(now.year, now.month, now.day, now.hour, now.minute);
      
      // Check if late (assuming work starts at 9 AM)
      final workStartTime = DateTime(now.year, now.month, now.day, 9, 0);
      final isLate = checkInTime.isAfter(workStartTime);
      
      final attendance = Attendance(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        employeeId: employee.id,
        date: DateTime(now.year, now.month, now.day),
        checkIn: checkInTime,
        status: isLate ? AppConstants.attendanceLate : AppConstants.attendancePresent,
        isLate: isLate,
      );
      
      await _storageService.markAttendance(attendance);
      
      setState(() {
        _checkInTime = checkInTime;
        _attendanceStatus = attendance.status;
        final date = DateTime(now.year, now.month, now.day);
        _attendanceMap[date] = [attendance];
      });
      
      Fluttertoast.showToast(
        msg: isLate ? 'Checked in (Late)' : 'Checked in successfully',
        backgroundColor: isLate ? Colors.orange : Colors.green,
        textColor: Colors.white,
      );
      
      await _loadAttendanceData();
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Failed to check in',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _handleCheckOut() async {
    final employee = await _authService.getCurrentEmployee();
    if (employee == null) return;
    
    if (_checkInTime == null) {
      Fluttertoast.showToast(
        msg: 'Please check in first',
        backgroundColor: Colors.orange,
        textColor: Colors.white,
      );
      return;
    }
    
    setState(() {
      _isLoading = true;
    });
    
    try {
      final now = DateTime.now();
      final checkOutTime = DateTime(now.year, now.month, now.day, now.hour, now.minute);
      final todayDate = DateTime(now.year, now.month, now.day);
      
      // Find existing attendance or create new
      final attendanceList = await _storageService.getAttendance(employee.id);
      Attendance? existingAttendance;
      try {
        existingAttendance = attendanceList.firstWhere(
          (a) {
            final aDate = DateTime(a.date.year, a.date.month, a.date.day);
            return aDate == todayDate;
          },
        );
      } catch (e) {
        // No existing attendance for today
      }
      
      final updatedAttendance = Attendance(
        id: existingAttendance?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        employeeId: employee.id,
        date: todayDate,
        checkIn: _checkInTime ?? existingAttendance?.checkIn,
        checkOut: checkOutTime,
        status: _attendanceStatus,
        isLate: existingAttendance?.isLate ?? false,
      );
      
      await _storageService.markAttendance(updatedAttendance);
      
      setState(() {
        _checkOutTime = checkOutTime;
        final date = DateTime(now.year, now.month, now.day);
        _attendanceMap[date] = [updatedAttendance];
      });
      
      Fluttertoast.showToast(
        msg: 'Checked out successfully',
        backgroundColor: Colors.green,
        textColor: Colors.white,
      );
      
      await _loadAttendanceData();
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Failed to check out',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  List<Attendance> _getEventsForDay(DateTime day) {
    final date = DateTime(day.year, day.month, day.day);
    return _attendanceMap[date] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
        automaticallyImplyLeading: false,
      ),
      body: _isLoading && _attendanceList.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAttendanceData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Mark Attendance Card
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Text(
                              DateFormat('EEEE, MMMM d, yyyy').format(DateTime.now()),
                              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              DateFormat('hh:mm a').format(DateTime.now()),
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                    color: Colors.grey[600],
                                  ),
                            ),
                            const SizedBox(height: 24),
                            // Status Badge
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusColor(_attendanceStatus).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: _getStatusColor(_attendanceStatus),
                                  width: 2,
                                ),
                              ),
                              child: Text(
                                _attendanceStatus,
                                style: TextStyle(
                                  color: _getStatusColor(_attendanceStatus),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                            // Check In/Out Times
                            if (_checkInTime != null)
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  Column(
                                    children: [
                                      const Text(
                                        'Check In',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        DateFormat('hh:mm a').format(_checkInTime!),
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (_checkOutTime != null)
                                    Column(
                                      children: [
                                        const Text(
                                          'Check Out',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          DateFormat('hh:mm a').format(_checkOutTime!),
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                ],
                              ),
                            const SizedBox(height: 24),
                            // Check In/Out Buttons
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: _checkInTime == null && !_isLoading
                                        ? _handleCheckIn
                                        : null,
                                    icon: const Icon(Icons.login),
                                    label: const Text('Check In'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.green,
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: _checkInTime != null &&
                                            _checkOutTime == null &&
                                            !_isLoading
                                        ? _handleCheckOut
                                        : null,
                                    icon: const Icon(Icons.logout),
                                    label: const Text('Check Out'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue,
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Summary Stats
                    Text(
                      'Summary',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 12),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 2,
                      children: [
                        _StatCard(
                          title: 'Days Present',
                          value: _daysPresent.toString(),
                          color: Colors.green,
                        ),
                        _StatCard(
                          title: 'Days Absent',
                          value: _daysAbsent.toString(),
                          color: Colors.red,
                        ),
                        _StatCard(
                          title: 'On Leave',
                          value: _daysOnLeave.toString(),
                          color: Colors.orange,
                        ),
                        _StatCard(
                          title: 'Late Arrivals',
                          value: _lateArrivals.toString(),
                          color: Colors.amber,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    // Calendar
                    Text(
                      'Attendance Calendar',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 12),
                    Card(
                      child: TableCalendar<Attendance>(
                        firstDay: DateTime.utc(2020, 1, 1),
                        lastDay: DateTime.utc(2030, 12, 31),
                        focusedDay: _focusedDay,
                        selectedDayPredicate: (day) {
                          return isSameDay(_selectedDay, day);
                        },
                        calendarFormat: _calendarFormat,
                        eventLoader: _getEventsForDay,
                        startingDayOfWeek: StartingDayOfWeek.monday,
                        calendarStyle: const CalendarStyle(
                          outsideDaysVisible: false,
                          todayDecoration: BoxDecoration(
                            color: Colors.blue,
                            shape: BoxShape.circle,
                          ),
                          selectedDecoration: BoxDecoration(
                            color: Colors.deepPurple,
                            shape: BoxShape.circle,
                          ),
                          markerDecoration: BoxDecoration(
                            color: Colors.green,
                            shape: BoxShape.circle,
                          ),
                        ),
                        headerStyle: HeaderStyle(
                          formatButtonVisible: true,
                          titleCentered: true,
                          formatButtonShowsNext: false,
                          formatButtonDecoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primary,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          formatButtonTextStyle: const TextStyle(
                            color: Colors.white,
                          ),
                        ),
                        onDaySelected: (selectedDay, focusedDay) {
                          setState(() {
                            _selectedDay = selectedDay;
                            _focusedDay = focusedDay;
                          });
                        },
                        onFormatChanged: (format) {
                          setState(() {
                            _calendarFormat = format;
                          });
                        },
                        onPageChanged: (focusedDay) {
                          _focusedDay = focusedDay;
                        },
                        calendarBuilders: CalendarBuilders(
                          markerBuilder: (context, date, events) {
                            if (events.isNotEmpty) {
                              final attendance = events.first as Attendance;
                              return Container(
                                margin: const EdgeInsets.only(bottom: 4),
                                alignment: Alignment.bottomCenter,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: _getStatusColor(attendance.status),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              );
                            }
                            return null;
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 1,
        onDestinationSelected: (index) {
          switch (index) {
            case 0:
              context.go('/dashboard');
              break;
            case 1:
              // Already on attendance
              break;
            case 2:
              context.go('/leave');
              break;
            case 3:
              context.go('/payroll');
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

  Color _getStatusColor(String status) {
    switch (status) {
      case AppConstants.attendancePresent:
        return Colors.green;
      case AppConstants.attendanceAbsent:
        return Colors.red;
      case AppConstants.attendanceLate:
        return Colors.orange;
      case AppConstants.attendanceOnLeave:
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

