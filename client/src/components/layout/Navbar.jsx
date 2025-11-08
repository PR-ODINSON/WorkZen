import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import attendanceService from '../../services/attendanceService'

const Navbar = () => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState(null)
  const [userAttendanceStatus, setUserAttendanceStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Get user info from stored user object
  let userName = 'User'
  let userEmail = 'user@example.com'
  let userRole = 'Employee'
  
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userName = user.name || 'User'
      userEmail = user.email || 'user@example.com'
      userRole = user.role || 'Employee'
    }
  } catch (error) {
    console.error('Error parsing user data:', error)
  }

  // Fetch today's attendance status
  useEffect(() => {
    if (userRole === 'Employee') {
      fetchTodayStatus()
    } else {
      // For Admin, HR, PayrollOfficer
      fetchUserAttendanceStatus()
    }

    // Listen for attendance updates
    const handleAttendanceUpdate = () => {
      if (userRole === 'Employee') {
        fetchTodayStatus()
      } else {
        fetchUserAttendanceStatus()
      }
    }

    window.addEventListener('attendanceUpdated', handleAttendanceUpdate)
    
    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate)
    }
  }, [userRole])

  const fetchTodayStatus = async () => {
    try {
      const response = await attendanceService.getTodayStatus()
      setAttendanceStatus(response.data?.attendance || null)
    } catch (error) {
      console.error('Error fetching attendance status:', error)
      setAttendanceStatus(null)
    }
  }

  const fetchUserAttendanceStatus = async () => {
    try {
      console.log('Fetching user attendance status...')
      const response = await attendanceService.getTodayUserStatus()
      console.log('User attendance status response:', response)
      
      const attendance = response.data?.attendance || response.attendance
      setUserAttendanceStatus(attendance)
      console.log('Set userAttendanceStatus to:', attendance)
    } catch (error) {
      console.error('Error fetching user attendance status:', error)
      setUserAttendanceStatus(null)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const response = await attendanceService.checkIn()
      console.log('Check-in response:', response)
      
      const attendance = response.data?.attendance || response.attendance
      console.log('Extracted attendance:', attendance)
      
      setAttendanceStatus(attendance)
      alert('✅ Checked in successfully!')
      
      // Notify other components about attendance update
      window.dispatchEvent(new Event('attendanceUpdated'))
    } catch (error) {
      console.error('Check-in error:', error)
      alert(error.response?.data?.message || 'Failed to check in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setLoading(true)
    try {
      const response = await attendanceService.checkOut()
      console.log('Check-out response:', response)
      
      const attendance = response.data?.attendance || response.attendance
      console.log('Extracted attendance:', attendance)
      
      setAttendanceStatus(attendance)
      alert('✅ Checked out successfully!')
      
      // Notify other components about attendance update
      window.dispatchEvent(new Event('attendanceUpdated'))
    } catch (error) {
      console.error('Check-out error:', error)
      alert(error.response?.data?.message || 'Failed to check out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserCheckIn = async () => {
    setLoading(true)
    try {
      console.log('Marking user attendance...')
      const response = await attendanceService.markUserAttendance()
      console.log('Attendance response:', response)
      
      const attendance = response.data?.attendance || response.attendance
      console.log('Extracted attendance:', attendance)
      
      // Force state update
      setUserAttendanceStatus(null)
      setTimeout(() => {
        setUserAttendanceStatus(attendance)
        console.log('Updated userAttendanceStatus:', attendance)
      }, 0)
      
      alert('✅ Attendance marked successfully!')
      
      // Re-fetch to ensure we have the latest data
      setTimeout(() => {
        fetchUserAttendanceStatus()
      }, 100)
      
      // Notify other components about attendance update
      window.dispatchEvent(new Event('attendanceUpdated'))
    } catch (error) {
      console.error('User check-in error:', error)
      alert(error.response?.data?.message || 'Failed to mark attendance. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserCheckOut = async () => {
    setLoading(true)
    try {
      console.log('Checking out user...')
      const response = await attendanceService.checkOutUser()
      console.log('Check-out response:', response)
      
      const attendance = response.data?.attendance || response.attendance
      console.log('Extracted attendance:', attendance)
      
      // Force state update
      setUserAttendanceStatus(null)
      setTimeout(() => {
        setUserAttendanceStatus(attendance)
        console.log('Updated userAttendanceStatus:', attendance)
      }, 0)
      
      alert('✅ Checked out successfully!')
      
      // Re-fetch to ensure we have the latest data
      setTimeout(() => {
        fetchUserAttendanceStatus()
      }, 100)
      
      // Notify other components about attendance update
      window.dispatchEvent(new Event('attendanceUpdated'))
    } catch (error) {
      console.error('User check-out error:', error)
      alert(error.response?.data?.message || 'Failed to check out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Remove legacy keys if they exist
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    navigate('/profile')
  }

  const formatTime = (dateString) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Debug logging
  console.log('Navbar render - userRole:', userRole)
  console.log('Navbar render - userAttendanceStatus:', userAttendanceStatus)
  console.log('Navbar render - has checkIn:', userAttendanceStatus?.checkIn)

  return (
    <header className=" bg-white fixed top-0 right-0 left-0 z-30 flex items-center  w-full justify-between px-6 py-2">
      {/* Left side - Title */}
      <div className="flex items-center">
      </div>

      {/* Right side - Attendance & Profile */}
      <div className="flex items-center gap-4">
        {/* Check-in/Check-out Buttons (Only for Employees) */}
        {userRole === 'Employee' && (
          <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
            {/* Check-in Button - Only show if not checked in */}
            {!attendanceStatus?.checkIn && (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-green-600 text-white hover:bg-green-700 active:scale-95 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Check In</span>
              </button>
            )}

            {/* Check-in Status - Show if checked in but not checked out */}
            {attendanceStatus?.checkIn && !attendanceStatus?.checkOut && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>In: {formatTime(attendanceStatus.checkIn)}</span>
              </div>
            )}

            {/* Check-out Button - Only show if checked in and not checked out */}
            {attendanceStatus?.checkIn && !attendanceStatus?.checkOut && (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-red-600 text-white hover:bg-red-700 active:scale-95 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Check Out</span>
              </button>
            )}

            {/* Both Check-in and Check-out completed */}
            {attendanceStatus?.checkIn && attendanceStatus?.checkOut && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>In: {formatTime(attendanceStatus.checkIn)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Out: {formatTime(attendanceStatus.checkOut)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Check In Button and Status Indicator for Admin, HR, PayrollOfficer */}
        {(userRole === 'Admin' || userRole === 'HR' || userRole === 'PayrollOfficer') && (
          <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
            {/* Check In Button - Show if not checked in */}
            {!userAttendanceStatus?.checkIn && (
              <button
                onClick={handleUserCheckIn}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-95 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Check In</span>
              </button>
            )}

            {/* Check Out Button - Show if checked in but not checked out */}
            {userAttendanceStatus?.checkIn && !userAttendanceStatus?.checkOut && (
              <button
                onClick={handleUserCheckOut}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-red-600 text-white hover:bg-red-700 active:scale-95 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Check Out</span>
              </button>
            )}

            {/* Both checked in and out - Show status */}
            {userAttendanceStatus?.checkIn && userAttendanceStatus?.checkOut && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>In: {formatTime(userAttendanceStatus.checkIn)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-medium text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Out: {formatTime(userAttendanceStatus.checkOut)}</span>
                </div>
              </div>
            )}

            {/* Attendance Status Indicator - Red/Green Dot */}
            <div 
              className={`w-6 h-6 rounded-full ${
                userAttendanceStatus?.checkIn ? 'bg-green-500' : 'bg-red-500'
              }`} 
              title={
                userAttendanceStatus?.checkIn 
                  ? 'Checked in' 
                  : 'Not checked in'
              }
            ></div>
          </div>
        )}

        {/* Profile Button */}
        <div className="relative" ref={dropdownRef}>
          <div
            
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            {/* Avatar Circle */}
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">{userEmail}</p>
            </div>
            <svg
              className={`w-4 h-4 text-slate-600 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <span>👤</span>
                <span>My Profile</span>
              </button>
              <hr className="my-1 border-slate-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
