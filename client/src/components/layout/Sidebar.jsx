import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const links = [
    { label: 'Dashboard', to: '/dashboard', icon: '📊' },
    { label: 'Employees', to: '/employees', icon: '👥' },
    { label: 'Attendance', to: '/attendance', icon: '📅' },
    { label: 'Time Off', to: '/timeoff', icon: '🏖️' },
    { label: 'Payroll', to: '/payroll', icon: '💰' },
    { label: 'Reports', to: '/reports', icon: '📈' },
    { label: 'Settings', to: '/settings', icon: '⚙️' },
  ]

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-60'
      } bg-slate-900 text-white min-h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-indigo-400">WorkZen</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white transition-colors"
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
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            WorkZen HRMS v1.0
          </p>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
