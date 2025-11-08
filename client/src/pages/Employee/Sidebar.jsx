import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const EmployeeSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const links = [
    { label: 'My Attendance', to: '/employee/attendance', icon: '📅' },
    { label: 'Time Off', to: '/employee/timeoff', icon: '🏖️' },
    { label: 'Payslips', to: '/employee/payroll', icon: '💰' },
    { label: 'Reports', to: '/employee/reports', icon: '📈' },
    { label: 'My Profile', to: '/employee/profile', icon: '👤' },
  ]

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-60'
      } bg-purple-900 text-white min-h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-purple-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-purple-300">WorkZen</h1>
              <p className="text-xs text-purple-400 mt-1">Employee Portal</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-purple-400 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map(({ label, to, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-purple-800 hover:text-white'
                  }`
                }
                title={isCollapsed ? label : ''}
              >
                <span className="text-xl">{icon}</span>
                {!isCollapsed && <span className="font-medium">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-purple-700">
          <p className="text-xs text-purple-500 text-center">
            WorkZen Employee v1.0
          </p>
        </div>
      )}
    </aside>
  )
}

export default EmployeeSidebar
