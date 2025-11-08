import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Get user info from localStorage (if stored during login)
  const userEmail = localStorage.getItem('userEmail') || 'Admin'
  const userName = localStorage.getItem('userName') || 'Admin User'

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    navigate('/profile')
  }

  return (
    <header className="h-16 bg-white shadow-md fixed top-0 right-0 left-60 z-30 flex items-center justify-between px-6">
      {/* Left side - Title */}
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          WorkZen <span className="text-indigo-600">HRMS</span>
        </h2>
      </div>

      {/* Right side - Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Profile Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors"
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
          </button>

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
