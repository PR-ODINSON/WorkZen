import React, { useState, useEffect } from 'react'
import Table from '../../components/ui/Table'
import {
  FaUmbrellaBeach,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaFilter,
} from 'react-icons/fa'
import leaveService from '../../services/leaveService'

export default function TimeOff() {
  const [leaveData, setLeaveData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    leaveType: '',
    status: '',
  })
  const [stats, setStats] = useState({
    paidTimeOff: 24,
    sickTimeOff: 7,
  })

  useEffect(() => {
    fetchLeaveData()
  }, [filters])

  const fetchLeaveData = async () => {
    setLoading(true)
    try {
      console.log('Fetching leave data with filters:', filters)
      
      const params = {
        limit: 100
      }
      
      if (filters.leaveType) params.leaveType = filters.leaveType
      if (filters.status) params.status = filters.status
      
      const response = await leaveService.getAll(params)
      
      console.log('Leave API response:', response)
      
      if (response && response.leaves) {
        console.log('Leave records:', response.leaves)
        
        const formattedData = response.leaves.map((record) => {
          const startDate = new Date(record.startDate)
          const endDate = new Date(record.endDate)
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
          
          return {
            id: record._id,
            employee: record.empId?.name || 'Unknown',
            employeeId: record.empId?.employeeId || 'N/A',
            leaveType: record.leaveType || 'N/A',
            startDate: startDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            endDate: endDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            days,
            status: record.status || 'pending',
            reason: record.reason || ''
          }
        })
        
        console.log('Formatted leave data:', formattedData)
        setLeaveData(formattedData)
      } else {
        console.log('No leave data in response')
        setLeaveData([])
      }
    } catch (error) {
      console.error('Error fetching leave data:', error)
      setLeaveData([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await leaveService.updateStatus(id, 'approved')
      alert('✅ Leave request approved!')
      fetchLeaveData()
    } catch (error) {
      console.error('Error approving leave:', error)
      alert(error.response?.data?.message || 'Failed to approve leave request')
    }
  }

  const handleReject = async (id) => {
    try {
      await leaveService.updateStatus(id, 'rejected')
      alert('❌ Leave request rejected!')
      fetchLeaveData()
    } catch (error) {
      console.error('Error rejecting leave:', error)
      alert(error.response?.data?.message || 'Failed to reject leave request')
    }
  }

  const columns = [
    { header: 'Employee Name', accessor: 'employee' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Days', accessor: 'days' },
    { 
      header: 'Time Off Type', 
      accessor: 'leaveType',
      render: (value) => (
        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
          value === 'Paid time Off' 
            ? 'bg-blue-100 text-blue-700'
            : value === 'Sick time off'
            ? 'bg-orange-100 text-orange-700'
            : value === 'Unpaid'
            ? 'bg-gray-100 text-gray-700'
            : 'bg-purple-100 text-purple-700'
        }`}>
          {value}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === 'approved'
              ? 'bg-green-100 text-green-800'
              : value === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' ? (
            <>
              <button
                onClick={() => handleApprove(value)}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                title="Approve"
              >
                <FaCheckCircle className="text-lg" />
              </button>
              <button
                onClick={() => handleReject(value)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Reject"
              >
                <FaTimesCircle className="text-lg" />
              </button>
            </>
          ) : (
            <span className="text-gray-400 text-sm">
              {row.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen rounded-3xl space-y-8">
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
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Filters:</label>
          </div>
          
          <select
            value={filters.leaveType}
            onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Time Off Types</option>
            <option value="Paid time Off">Paid time Off</option>
            <option value="Sick time off">Sick time off</option>
            <option value="Unpaid">Unpaid</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          {(filters.leaveType || filters.status) && (
            <button
              onClick={() => setFilters({ leaveType: '', status: '' })}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUmbrellaBeach className="text-blue-500" /> Leave Requests Overview
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading leave requests...</div>
        ) : leaveData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No leave requests found</div>
        ) : (
          <Table columns={columns} data={leaveData} />
        )}
      </section>
    </div>
  )
}
