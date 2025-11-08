import React from 'react'
import Table from '../../components/ui/Table'
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'

export default function HR_Attendance() {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 p-6 space-y-8">
      {/* 🌿 Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 shadow-xl">
        {/* Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-16 right-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-20 w-32 h-32 bg-green-200/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Attendance</h1>
            <p className="text-green-100 text-sm">Track and manage employee attendance</p>
          </div>
          <button className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/30 hover:scale-105 border border-white/30 shadow-md">
            Mark Attendance
          </button>
        </div>
      </section>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Present */}
        <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-green-100 text-green-700 shadow-sm">
              <FaCheckCircle className="text-lg" />
            </div>
            <p className="text-sm font-medium text-gray-700">Present Today</p>
          </div>
          <p className="text-3xl font-bold text-green-600">3</p>
        </div>

        {/* Absent */}
        <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-red-100 text-red-700 shadow-sm">
              <FaTimesCircle className="text-lg" />
            </div>
            <p className="text-sm font-medium text-gray-700">Absent Today</p>
          </div>
          <p className="text-3xl font-bold text-red-600">1</p>
        </div>

        {/* Late Arrivals */}
        <div className="group bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700 shadow-sm">
              <FaClock className="text-lg" />
            </div>
            <p className="text-sm font-medium text-gray-700">Late Arrivals</p>
          </div>
          <p className="text-3xl font-bold text-yellow-600">1</p>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">
        <Table columns={columns} data={attendanceData} />
      </div>
    </div>
  )
}
