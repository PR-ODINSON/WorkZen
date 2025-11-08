import React, { useState } from 'react'
import Table from '../../components/ui/Table'

export default function AdminPayroll() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const payrollData = [
    { id: 1, employee: 'John Doe', basic: '$5,000', allowances: '$500', deductions: '$450', net: '$5,050', status: 'Processed' },
    { id: 2, employee: 'Jane Smith', basic: '$6,000', allowances: '$600', deductions: '$540', net: '$6,060', status: 'Processed' },
    { id: 3, employee: 'Bob Wilson', basic: '$4,500', allowances: '$450', deductions: '$405', net: '$4,545', status: 'Pending' },
    { id: 4, employee: 'Alice Brown', basic: '$5,500', allowances: '$550', deductions: '$495', net: '$5,555', status: 'Pending' },
  ]

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Basic Salary', accessor: 'basic' },
    { header: 'Allowances', accessor: 'allowances' },
    { header: 'Deductions', accessor: 'deductions' },
    { header: 'Net Salary', accessor: 'net' },
    { header: 'Status', accessor: 'status' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-slate-600 mt-1">Process and manage employee payroll</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Process Payroll
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Payroll</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">$1.2M</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Processed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">235</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">13</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Average Salary</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">$5,200</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex gap-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Departments</option>
            <option value="it">IT</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Status</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <Table
        columns={columns}
        data={payrollData}
        actions={[
          { label: 'View Details', onClick: (row) => console.log('View', row) },
          { label: 'Download Slip', onClick: (row) => console.log('Download', row) },
        ]}
      />
    </div>
  )
}
