import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaUmbrellaBeach,
  FaMoneyCheckAlt,
  FaChartLine,
  FaCog,
  FaWarehouse
} from 'react-icons/fa'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const links = [
    { label: 'Dashboard', to: '/dashboard', icon: <FaHome /> },
    { label: 'Employees', to: '/employees', icon: <FaUsers /> },
    { label: 'Attendance', to: '/attendance', icon: <FaCalendarAlt /> },
    { label: 'Time Off', to: '/timeoff', icon: <FaUmbrellaBeach /> },
    { label: 'Payroll', to: '/payroll', icon: <FaMoneyCheckAlt /> },
    { label: 'Reports', to: '/reports', icon: <FaChartLine /> },
    { label: 'Settings', to: '/settings', icon: <FaCog /> },
  ]

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' },
  }

  const textVariants = {
    expanded: { opacity: 1, width: 'auto' },
    collapsed: { opacity: 0, width: 0 },
  }

  return (
    <motion.aside
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-gradient-to-b from-white via-emerald-50 to-green-50 text-gray-800 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40 shadow-xl border-r border-emerald-100 overflow-hidden"
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 border-b border-emerald-100 relative z-10 flex items-center justify-between"
      >
        <motion.div
          className="flex items-center gap-3 overflow-hidden"
          variants={textVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md"
          >
            <FaWarehouse className="text-white text-xl" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-1"
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent"
                >
                  WorkZen
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs text-emerald-600"
                >
                  HRMS
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Collapse Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-emerald-600 hover:text-emerald-800 transition-colors ml-auto p-2 rounded-lg hover:bg-emerald-100"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </motion.button>
      </motion.div>

      {/* Navigation Links */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 p-4 relative z-10"
      >
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delay: 0.3 }}
          className="space-y-2"
        >
          {links.map(({ label, to, icon }, index) => (
            <motion.li
              key={to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink to={to}>
                {({ isActive }) => (
                  <div
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-[1.02]'
                        : 'text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md'
                    }`}
                  >
                    <motion.span
                      className={`text-lg flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {icon}
                    </motion.span>

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="font-semibold text-sm whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {!isActive && (
                      <motion.div
                        className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </motion.nav>

      {/* Footer */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border-t border-emerald-100 relative z-10 bg-emerald-50"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-emerald-600 text-center font-medium"
            >
              WorkZen HRMS v1.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}

export default Sidebar
