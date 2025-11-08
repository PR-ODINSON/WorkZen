import React, { useState, useEffect } from 'react'
import Table from '../../components/ui/Table'
import { FaCalendarCheck, FaUserClock, FaUserTimes, FaUserCheck } from 'react-icons/fa'
import attendanceService from '../../services/attendanceService'

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAttendance, setMarkingAttendance] = useState(false)
  const [userAttendanceStatus, setUserAttendanceStatus] = useState(null)
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
    fetchUserAttendanceStatus()
  }, [filters])

  const fetchUserAttendanceStatus = async () => {
    try {
      const response = await attendanceService.getTodayUserStatus()
      setUserAttendanceStatus(response.data?.attendance || null)
    } catch (error) {
      console.error('Error fetching user attendance status:', error)
      setUserAttendanceStatus(null)
    }
  }

  const handleMarkAttendance = async () => {
    setMarkingAttendance(true)
    try {
      const response = await attendanceService.markUserAttendance()
      setUserAttendanceStatus(response.data?.attendance || null)
      alert('✅ Attendance marked successfully!')
      fetchAttendanceData() // Refresh the table
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert(error.response?.data?.message || 'Failed to mark attendance. Please try again.')
    } finally {
      setMarkingAttendance(false)
    }
  }

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      const response = await attendanceService.getAll({
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: 100
      })
      
      if (response.success && response.data?.attendance) {
        const formattedData = response.data.attendance.map((record) => {
          const workHours = calculateWorkHours(record.checkIn, record.checkOut)
          const extraHours = calculateExtraHours(record.checkIn, record.checkOut, workHours)
          
          return {
            id: record._id,
            employee: record.empId?.name || record.userId?.name || 'Unknown',
            employeeId: record.empId?.employeeId || record.userId?.email || 'N/A',
            role: record.userId?.role || 'Employee',
            date: new Date(record.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
            checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
            status: record.status || 'present',
            workHours,
            extraHours
          }
        })
        
        setAttendanceData(formattedData)
        
        // Calculate stats
        const present = formattedData.filter(r => r.status === 'present' && r.checkIn !== '-').length
        const absent = formattedData.filter(r => r.status === 'absent' || r.checkIn === '-').length
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
    if (!checkIn || !checkOut) return '00:00'
    const diff = new Date(checkOut) - new Date(checkIn)
    const hours = Math.floor(diff / 1000 / 60 / 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const calculateExtraHours = (checkIn, checkOut, workHours) => {
    if (!checkIn || !checkOut) return '00:00'
    
    // Parse work hours
    const [hours, minutes] = workHours.split(':').map(Number)
    const totalWorkMinutes = hours * 60 + minutes
    const totalWorkHours = totalWorkMinutes / 60
    
    // If work hours <= 8, no extra hours
    if (totalWorkHours <= 8) return '00:00'
    
    // Calculate extra hours as (checkout time - 5:00 PM)
    const checkOutDate = new Date(checkOut)
    const endOfDay = new Date(checkOut)
    endOfDay.setHours(17, 0, 0, 0) // 5:00 PM
    
    if (checkOutDate <= endOfDay) return '00:00'
    
    const extraMs = checkOutDate - endOfDay
    const extraHours = Math.floor(extraMs / 1000 / 60 / 60)
    const extraMinutes = Math.floor((extraMs / 1000 / 60) % 60)
    
    return `${String(extraHours).padStart(2, '0')}:${String(extraMinutes).padStart(2, '0')}`
  }

  const isLate = (checkInTime) => {
    // Assuming work starts at 9:00 AM
    const checkIn = new Date(`2000-01-01 ${checkInTime}`)
    const startTime = new Date('2000-01-01 09:00 AM')
    return checkIn > startTime
  }

  const getCurrentDateInfo = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    const now = new Date()
    const dayName = days[now.getDay()]
    const date = now.getDate()
    const month = months[now.getMonth()]
    const year = now.getFullYear()
    
    return { dayName, date, month, year }
  }

  const dateInfo = getCurrentDateInfo()

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    { header: 'Work Hours', accessor: 'workHours' },
    { header: 'Extra Hours', accessor: 'extraHours' },
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
    <div className="min-h-screen rounded-3xl space-y-8">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl p-6">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaCalendarCheck className="text-white text-3xl" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold mb-1">Attendance</h1>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <span className="font-semibold">{dateInfo.date} {dateInfo.month} {dateInfo.year}</span>
                  <span className="mx-2">•</span>
                  <span>{dateInfo.dayName}</span>
                </div>
              </div>
              <p className="text-blue-100">Track and manage employee attendance records</p>
            </div>
          </div>
          <button 
            onClick={handleMarkAttendance}
            disabled={markingAttendance || (userAttendanceStatus && userAttendanceStatus.checkIn)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md transition-all ${
              userAttendanceStatus && userAttendanceStatus.checkIn
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-white text-blue-700 hover:bg-blue-50'
            } ${markingAttendance ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaUserCheck /> 
            {userAttendanceStatus && userAttendanceStatus.checkIn 
              ? 'Attendance Marked' 
              : markingAttendance 
              ? 'Marking...' 
              : 'Mark Attendance'}
          </button>
        </div>
      </section>

      {/* Date Filter */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUserClock className="text-blue-500" /> Daily Attendance Overview
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading attendance data...</div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No attendance data available</div>
        ) : (
          <Table columns={columns} data={attendanceData} />
        )}
      </section>
    </div>
  )
}
