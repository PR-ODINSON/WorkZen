import React, { useState } from 'react'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'

export default function AdminTimeOff() {
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const leaveRequests = [
    { id: 1, employee: 'John Doe', type: 'Sick Leave', from: '2024-01-15', to: '2024-01-17', days: 3, status: 'Pending' },
    { id: 2, employee: 'Jane Smith', type: 'Vacation', from: '2024-01-20', to: '2024-01-27', days: 7, status: 'Approved' },
    { id: 3, employee: 'Bob Wilson', type: 'Personal', from: '2024-01-18', to: '2024-01-18', days: 1, status: 'Rejected' },
    { id: 4, employee: 'Alice Brown', type: 'Vacation', from: '2024-02-01', to: '2024-02-10', days: 10, status: 'Pending' },
  ]

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Leave Type', accessor: 'type' },
    { header: 'From', accessor: 'from' },
    { header: 'To', accessor: 'to' },
    { header: 'Days', accessor: 'days' },
    { header: 'Status', accessor: 'status' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Time Off Management</h1>
          <p className="text-slate-600 mt-1">Review and approve leave requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Apply Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">18</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">45</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">5</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">On Leave Today</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">8</p>
            </div>
            <span className="text-4xl">🏖️</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Leave Types</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation</option>
            <option value="personal">Personal</option>
          </select>
          <input
            type="text"
            placeholder="Search employee..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Leave Requests Table */}
      <Table
        columns={columns}
        data={leaveRequests}
        actions={[
          { label: 'Approve', onClick: (row) => console.log('Approve', row) },
          { label: 'Reject', onClick: (row) => console.log('Reject', row) },
        ]}
      />

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Apply for Leave"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Leave Type
            </label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select leave type</option>
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter reason for leave"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
