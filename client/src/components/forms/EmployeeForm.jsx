import React, { useState, useEffect } from 'react'
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaBuilding,
  FaHeartbeat,
  FaUserShield,
  FaRupeeSign
} from 'react-icons/fa'

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    designation: '',
    salary: '',
    joiningDate: '',
    dateOfBirth: '',
    gender: '',
    status: 'Present',
    emergencyContact: '',
    bloodGroup: '',
    manager: '',
    location: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        department: employee.department || '',
        designation: employee.designation || '',
        salary: employee.salary || '',
        joiningDate: employee.joiningDate?.split('T')[0] || '',
        dateOfBirth: employee.dateOfBirth?.split('T')[0] || '',
        gender: employee.gender || '',
        status: employee.status || 'Present',
        emergencyContact: employee.emergencyContact || '',
        bloodGroup: employee.bloodGroup || '',
        manager: employee.manager || '',
        location: employee.location || ''
      })
    }
  }, [employee])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.designation) newErrors.designation = 'Designation is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-blue-100 space-y-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      <p className="text-center text-slate-500 text-sm mb-6">
        Fill out the employee details carefully
      </p>

      {/* Personal Info Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FaUser className="text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="form-label">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@workzen.com"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="form-input"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="form-label">Date of Birth</label>
            <div className="flex items-center">
              <FaCalendarAlt className="text-indigo-500 mr-2" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="form-label">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-input">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="form-label">Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-input">
              <option value="">Select</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              rows="2"
              className="form-input resize-none"
            ></textarea>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="form-label">Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="+91 9000000000"
              className="form-input"
            />
          </div>
        </div>
      </section>

      {/* Employment Info */}
      <section className="pt-6 border-t border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <FaBriefcase className="text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Employment Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Department */}
          <div>
            <label className="form-label">Department <span className="text-red-500">*</span></label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-input ${errors.department ? 'border-red-500' : ''}`}
            >
              <option value="">Select Department</option>
              {['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Design'].map((dep) => (
                <option key={dep}>{dep}</option>
              ))}
            </select>
            {errors.department && <p className="error-text">{errors.department}</p>}
          </div>

          {/* Designation */}
          <div>
            <label className="form-label">Designation <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Senior Developer"
              className={`form-input ${errors.designation ? 'border-red-500' : ''}`}
            />
            {errors.designation && <p className="error-text">{errors.designation}</p>}
          </div>

          {/* Joining Date */}
          <div>
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="form-label">Salary (₹)</label>
            <div className="flex items-center">
              <FaRupeeSign className="text-indigo-500 mr-2" />
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50000"
                className="form-input"
              />
            </div>
          </div>

          {/* Manager */}
          <div>
            <label className="form-label">Manager</label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              placeholder="Manager Name"
              className="form-input"
            />
          </div>

          {/* Location */}
          <div>
            <label className="form-label">Location</label>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-indigo-500 mr-2" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mumbai, India"
                className="form-input"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              <option>Present</option>
              <option>On Leave</option>
              <option>Absent</option>
            </select>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-blue-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          {employee ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  )
}

/* --- Tailwind helper classes (apply in index.css or globals.css) ---
.form-label {
  @apply block text-sm font-medium text-slate-700 mb-2;
}
.form-input {
  @apply w-full px-4 py-2.5 border border-blue-100 rounded-lg shadow-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all;
}
.error-text {
  @apply text-xs text-red-500 mt-1;
}
*/
