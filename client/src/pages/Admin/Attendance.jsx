import React, { useState, useEffect } from 'react'
import Table from '../../components/ui/Table'
import { FaCalendarCheck, FaUserClock, FaUserTimes, FaUserCheck } from 'react-icons/fa'

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
