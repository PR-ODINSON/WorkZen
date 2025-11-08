import React, { useState } from 'react'
import Table from '../../components/ui/Table'

export default function AdminAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const attendanceData = [
    { id: 1, employee: 'John Doe', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9.0' },
    { id: 2, employee: 'Jane Smith', checkIn: '09:15 AM', checkOut: '06:15 PM', status: 'Present', hours: '9.0' },
    { id: 3, employee: 'Bob Wilson', checkIn: '-', checkOut: '-', status: 'Absent', hours: '0.0' },
    { id: 4, employee: 'Alice Brown', checkIn: '10:00 AM', checkOut: '04:00 PM', status: 'Half Day', hours: '6.0' },
  ]

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    { header: 'Hours', accessor: 'hours' },
    { header: 'Status', accessor: 'status' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Attendance Management</h1>
          <p className="text-slate-600 mt-1">Monitor and manage employee attendance</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Mark Attendance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600 mt-1">235</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600 mt-1">13</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">8</p>
            </div>
            <span className="text-4xl">🏖️</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">94.5%</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <Table columns={columns} data={attendanceData} />
    </div>
  )
}
