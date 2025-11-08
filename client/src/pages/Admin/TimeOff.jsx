import React from 'react'
import Table from '../../components/ui/Table'
import {
  FaUmbrellaBeach,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
} from 'react-icons/fa'

export default function TimeOff() {
  const leaveData = [
    { id: 1, employee: 'John Doe', type: 'Sick Leave', startDate: '2025-11-10', endDate: '2025-11-12', days: 3, status: 'Pending' },
    { id: 2, employee: 'Jane Smith', type: 'Vacation', startDate: '2025-11-15', endDate: '2025-11-20', days: 6, status: 'Approved' },
    { id: 3, employee: 'Mike Johnson', type: 'Personal', startDate: '2025-11-09', endDate: '2025-11-09', days: 1, status: 'Rejected' },
  ]

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Leave Type', accessor: 'type' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Days', accessor: 'days' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Approved'
              ? 'bg-green-100 text-green-800'
              : value === 'Pending'
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
              <FaUmbrellaBeach className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Time Off</h1>
              <p className="text-blue-100">Manage and review employee leave requests</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow-md hover:bg-blue-50 transition-all">
            <FaPlus /> Request Leave
          </button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <FaHourglassHalf className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">1</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-1">1</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <FaTimesCircle className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-1">1</p>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUmbrellaBeach className="text-blue-500" /> Leave Requests Overview
        </h2>
        <Table columns={columns} data={leaveData} />
      </section>
    </div>
  )
}
