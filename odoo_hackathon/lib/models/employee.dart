class Employee {
  final String id;
  final String name;
  final String email;
  final String employeeId;
  final String department;
  final String designation;
  final String phone;
  final String address;
  final DateTime dateOfJoining;
  final String profileImage;
  final String role;

  Employee({
    required this.id,
    required this.name,
    required this.email,
    required this.employeeId,
    required this.department,
    required this.designation,
    required this.phone,
    required this.address,
    required this.dateOfJoining,
    this.profileImage = '',
    this.role = 'Employee',
  });

  Employee copyWith({
    String? id,
    String? name,
    String? email,
    String? employeeId,
    String? department,
    String? designation,
    String? phone,
    String? address,
    DateTime? dateOfJoining,
    String? profileImage,
    String? role,
  }) {
    return Employee(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      employeeId: employeeId ?? this.employeeId,
      department: department ?? this.department,
      designation: designation ?? this.designation,
      phone: phone ?? this.phone,
      address: address ?? this.address,
      dateOfJoining: dateOfJoining ?? this.dateOfJoining,
      profileImage: profileImage ?? this.profileImage,
      role: role ?? this.role,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'employeeId': employeeId,
      'department': department,
      'designation': designation,
      'phone': phone,
      'address': address,
      'dateOfJoining': dateOfJoining.toIso8601String(),
      'profileImage': profileImage,
      'role': role,
    };
  }

 factory Employee.fromJson(Map<String, dynamic> json) {
  DateTime parsedDate;
  try {
    parsedDate = DateTime.parse(json['dateOfJoining'] ?? '');
  } catch (_) {
    parsedDate = DateTime.now();
  }

  return Employee(
    id: json['id']?.toString() ?? '',
    name: json['name'] ?? '',
    email: json['email'] ?? '',
    employeeId: json['employeeId'] ?? '',
    department: json['department'] ?? '',
    designation: json['designation'] ?? '',
    phone: json['phone'] ?? '',
    address: json['address'] ?? '',
    dateOfJoining: parsedDate,
    profileImage: json['profileImage'] ?? '',
    role: json['role'] ?? 'Employee',
  );
}

}

