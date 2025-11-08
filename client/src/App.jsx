import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import TimeOff from './pages/TimeOff'
import Payroll from './pages/Payroll'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import MyProfile from './pages/MyProfile'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'

// Layout component for authenticated pages
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex bg-slate-50">
    {/* Sidebar - Fixed left */}
    <Sidebar />
    
    {/* Main content area */}
    <div className="flex-1 ml-60">
      {/* Navbar - Fixed top */}
      <Navbar />
      
      {/* Page content with top margin for navbar */}
      <main className="mt-16 p-6">
        {children}
      </main>
    </div>
  </div>
)

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Root redirect to employees */}
      <Route path="/" element={<Navigate to="/employees" replace />} />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Employees />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Attendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timeoff"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TimeOff />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Payroll />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
