import React, { useState, useEffect } from 'react'
import EmployeeCard from '../../components/ui/EmployeeCard'
import Modal from '../../components/ui/Modal'
import EmployeeForm from '../../components/forms/EmployeeForm'
import api from '../../api'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/employees')
      if (response.data.success) {
        setEmployees(response.data.employees || [])
      }
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError(err.response?.data?.message || 'Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee)
    setIsViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setIsFormModalOpen(true)
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setIsFormModalOpen(true)
    setIsViewModalOpen(false)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingEmployee(null)
  }

  const handleSubmitEmployee = async (formData) => {
    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await api.put(`/admin/employees/${editingEmployee._id}`, formData)
        if (response.data.success) {
          await fetchEmployees()
          handleCloseFormModal()
          alert('Employee updated successfully!')
        }
      } else {
        // Create new employee - backend will create both user and employee
        const response = await api.post('/admin/employees', formData)
        if (response.data.success) {
          await fetchEmployees()
          handleCloseFormModal()
          alert(`Employee added successfully! Default password: Welcome@123`)
        }
      }
    } catch (err) {
      console.error('Error saving employee:', err)
      alert(err.response?.data?.message || 'Failed to save employee')
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await api.delete(`/admin/employees/${employeeId}`)
        if (response.data.success) {
          await fetchEmployees()
          handleCloseViewModal()
          alert('Employee deleted successfully!')
        }
      } catch (err) {
        console.error('Error deleting employee:', err)
        alert(err.response?.data?.message || 'Failed to delete employee')
      }
    }
  }

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter
    const matchesStatus = !statusFilter || employee.status === statusFilter
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: employees.length,
    present: employees.filter(e => e.status === 'Present').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    absent: employees.filter(e => e.status === 'Absent').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading employees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-600 mt-1">Manage employee records and information</p>
        </div>
        <button 
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
        >
          <span>➕</span>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Total Employees</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Present Today</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.present}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
          <p className="text-sm text-slate-600">On Leave</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.onLeave}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Absent</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.absent}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-slate-200">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Employees Found</h3>
          <p className="text-slate-600 mb-4">
            {employees.length === 0 
              ? "Get started by adding your first employee"
              : "Try adjusting your search or filters"
            }
          </p>
          {employees.length === 0 && (
            <button
              onClick={handleAddEmployee}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add First Employee
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              onClick={handleEmployeeClick}
            />
          ))}
        </div>
      )}

      {/* Employee Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Employee Details"
        footer={
          <>
            <button
              onClick={handleCloseViewModal}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => handleEditEmployee(selectedEmployee)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Employee
            </button>
            <button 
              onClick={() => handleDeleteEmployee(selectedEmployee._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {selectedEmployee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-slate-600">{selectedEmployee.designation}</p>
                <p className="text-xs text-slate-500">{selectedEmployee.employeeId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-800">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-800">{selectedEmployee.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Department</p>
                <p className="font-medium text-slate-800">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEmployee.status === 'Present'
                      ? 'bg-green-100 text-green-800'
                      : selectedEmployee.status === 'On Leave'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedEmployee.status}
                </span>
              </div>
              {selectedEmployee.manager && (
                <div>
                  <p className="text-sm text-slate-600">Manager</p>
                  <p className="font-medium text-slate-800">{selectedEmployee.manager}</p>
                </div>
              )}
              {selectedEmployee.location && (
                <div>
                  <p className="text-sm text-slate-600">Location</p>
                  <p className="font-medium text-slate-800">{selectedEmployee.location}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Employee Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      >
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSubmitEmployee}
          onCancel={handleCloseFormModal}
        />
      </Modal>
    </div>
  )
}
