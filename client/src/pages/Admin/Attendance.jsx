import React, { useState, useEffect } from 'react'
import Table from '../../components/ui/Table'
import attendanceService from '../../services/attendanceService'

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0
  })
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchAttendanceData()
  }, [filters])

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      const response = await attendanceService.getAll({
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: 100
      })
      
      if (response.success && response.data?.attendance) {
        const formattedData = response.data.attendance.map((record) => ({
          id: record._id,
          employee: record.empId?.name || 'Unknown',
          employeeId: record.empId?.employeeId || 'N/A',
          date: new Date(record.date).toLocaleDateString(),
          checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
          checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
          status: record.status || 'present',
          workHours: calculateWorkHours(record.checkIn, record.checkOut)
        }))
        
        setAttendanceData(formattedData)
        
        // Calculate stats
        const present = formattedData.filter(r => r.status === 'present').length
        const absent = formattedData.filter(r => r.status === 'absent').length
        const late = formattedData.filter(r => r.checkIn !== '-' && isLate(r.checkIn)).length
        
        setStats({ present, absent, late })
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-'
    const diff = new Date(checkOut) - new Date(checkIn)
    const hours = Math.floor(diff / 1000 / 60 / 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    return `${hours}h ${minutes}m`
  }

  const isLate = (checkInTime) => {
    // Assuming work starts at 9:00 AM
    const checkIn = new Date(`2000-01-01 ${checkInTime}`)
    const startTime = new Date('2000-01-01 09:00 AM')
    return checkIn > startTime
  }

  const columns = [
    { header: 'Employee ID', accessor: 'employeeId' },
    { header: 'Employee', accessor: 'employee' },
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    { header: 'Work Hours', accessor: 'workHours' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'present'
              ? 'bg-green-100 text-green-800'
              : value === 'leave'
              ? 'bg-yellow-100 text-yellow-800'
              : value === 'absent'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
          <p className="text-slate-600 mt-1">Track employee attendance records</p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-slate-200">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={fetchAttendanceData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <p className="text-sm text-slate-600">Present Today</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.present}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <p className="text-sm text-slate-600">Absent Today</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <p className="text-sm text-slate-600">Late Arrivals</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.late}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <Table columns={columns} data={attendanceData} />
      )}
    </div>
  )
}
