import React, { useState } from 'react'
import Table from '../components/ui/Table'

export default function Employees() {
  // Dummy employee data
  const [employees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@workzen.com',
      department: 'Engineering',
      designation: 'Senior Developer',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@workzen.com',
      department: 'HR',
      designation: 'HR Manager',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@workzen.com',
      department: 'Sales',
      designation: 'Sales Executive',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@workzen.com',
      department: 'Marketing',
      designation: 'Marketing Lead',
      status: 'Active',
    },
  ])

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-600 mt-1">Manage employee records and information</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
          <span>➕</span>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>HR</option>
            <option>Sales</option>
            <option>Marketing</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <Table columns={columns} data={employees} />

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-slate-200">
        <p className="text-sm text-slate-600">
          Showing <span className="font-medium">1-4</span> of{' '}
          <span className="font-medium">4</span> employees
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">1</button>
          <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
