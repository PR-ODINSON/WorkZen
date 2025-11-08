import React, { useState, useEffect } from 'react'
import attendanceService from '../../services/attendanceService'

export default function EmployeeAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [stats, setStats] = useState({
    present: 0,
    leaves: 0,
    totalWorkingDays: 0
  })

  useEffect(() => {
    fetchAttendanceData()
    
    // Listen for attendance updates from navbar
    const handleAttendanceUpdate = () => {
      fetchAttendanceData()
    }
    
    window.addEventListener('attendanceUpdated', handleAttendanceUpdate)
    
    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate)
    }
  }, [currentMonth])

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      // Get today's attendance
      const todayResponse = await attendanceService.getTodayStatus()
      console.log('Today attendance response:', todayResponse)
      setTodayAttendance(todayResponse.data?.attendance || null)

      // Get all attendance for current month (my records only)
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59)
      
      console.log('Fetching attendance for:', {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      })
      
      const response = await attendanceService.getMyRecords({
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
        limit: 100
      })

      console.log('Attendance response:', response)

      if (response.success && response.data?.attendance) {
        const records = response.data.attendance
        console.log('Attendance records:', records)
        setAttendanceRecords(records)
        
        // Calculate stats
        const presentCount = records.filter(r => r.status === 'present' || r.checkIn).length
        const leaveCount = records.filter(r => r.status === 'leave').length
        const workingDays = getWorkingDaysInMonth(currentMonth)
        
        console.log('Stats:', { presentCount, leaveCount, workingDays })
        
        setStats({
          present: presentCount,
          leaves: leaveCount,
          totalWorkingDays: workingDays
        })
      } else {
        console.log('No attendance data in response')
        setAttendanceRecords([])
        setStats({
          present: 0,
          leaves: 0,
          totalWorkingDays: getWorkingDaysInMonth(currentMonth)
        })
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      console.error('Error response:', error.response?.data)
      setAttendanceRecords([])
      setStats({
        present: 0,
        leaves: 0,
        totalWorkingDays: getWorkingDaysInMonth(currentMonth)
      })
    } finally {
      setLoading(false)
    }
  }

  const getWorkingDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let workingDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      const dayOfWeek = currentDate.getDay()
      // Exclude Sundays (0)
      if (dayOfWeek !== 0) {
        workingDays++
      }
    }
    return workingDays
  }

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-'
    const diff = new Date(checkOut) - new Date(checkIn)
    const hours = Math.floor(diff / 1000 / 60 / 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const calculateExtraHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-'
    const diff = new Date(checkOut) - new Date(checkIn)
    const totalHours = diff / 1000 / 60 / 60
    const extraHours = Math.max(0, totalHours - 9) // Assuming 9 hours is standard
    const hours = Math.floor(extraHours)
    const minutes = Math.floor((extraHours % 1) * 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1))
    setShowMonthPicker(false)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonthName = monthNamesShort[currentMonth.getMonth()]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
          <p className="text-slate-600 mt-1">Track your attendance records</p>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="w-10 h-10 border-2 border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextMonth}
              className="w-10 h-10 border-2 border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Month Dropdown */}
            <div className="ml-2 relative">
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="px-4 py-2 border-2 border-slate-300 rounded-lg min-w-[100px] text-center hover:bg-slate-50 transition-colors"
              >
                {currentMonthName} ▼
              </button>
              
              {/* Month Picker Dropdown */}
              {showMonthPicker && (
                <div className="absolute top-full mt-2 left-0 bg-white border-2 border-slate-300 rounded-lg shadow-lg z-50 grid grid-cols-3 gap-2 p-3 min-w-[300px]">
                  {monthNamesShort.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        index === currentMonth.getMonth()
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 border-2 border-slate-300 rounded-lg">
              <span className="text-slate-600">Count of days present: </span>
              <span className="font-semibold">{stats.present}</span>
            </div>
            <div className="px-4 py-2 border-2 border-slate-300 rounded-lg">
              <span className="text-slate-600">Leaves count: </span>
              <span className="font-semibold">{stats.leaves}</span>
            </div>
            <div className="px-4 py-2 border-2 border-slate-300 rounded-lg">
              <span className="text-slate-600">Total working days: </span>
              <span className="font-semibold">{stats.totalWorkingDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Month Display */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
        <div className="text-center text-lg font-medium text-slate-700">
          {currentMonth.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check In</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check Out</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Work Hours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Extra hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No attendance records found for this month
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{formatTime(record.checkIn)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{formatTime(record.checkOut)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {calculateWorkHours(record.checkIn, record.checkOut)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {calculateExtraHours(record.checkIn, record.checkOut)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
