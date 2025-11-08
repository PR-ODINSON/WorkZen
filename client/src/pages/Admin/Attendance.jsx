import React from 'react'
import Table from '../../components/ui/Table'
import { FaCalendarCheck, FaUserClock, FaUserTimes, FaUserCheck } from 'react-icons/fa'

export default function Attendance() {
  const attendanceData = [
    { id: 1, employee: 'John Doe', date: '2025-11-08', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present' },
    { id: 2, employee: 'Jane Smith', date: '2025-11-08', checkIn: '09:15 AM', checkOut: '06:10 PM', status: 'Present' },
    { id: 3, employee: 'Mike Johnson', date: '2025-11-08', checkIn: '-', checkOut: '-', status: 'Absent' },
    { id: 4, employee: 'Sarah Williams', date: '2025-11-08', checkIn: '09:30 AM', checkOut: '06:00 PM', status: 'Late' },
  ]

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Present'
              ? 'bg-green-100 text-green-800'
              : value === 'Late'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-3xl space-y-8">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl p-6">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaCalendarCheck className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Attendance</h1>
              <p className="text-blue-100">Track and manage employee attendance records</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow-md hover:bg-blue-50 transition-all">
            <FaUserCheck /> Mark Attendance
          </button>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <FaUserCheck className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-3xl font-bold text-green-600 mt-1">3</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <FaUserTimes className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Absent Today</p>
            <p className="text-3xl font-bold text-red-600 mt-1">1</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <FaUserClock className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Late Arrivals</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">1</p>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUserClock className="text-blue-500" /> Daily Attendance Overview
        </h2>
        <Table columns={columns} data={attendanceData} />
      </section>
    </div>
  )
}
