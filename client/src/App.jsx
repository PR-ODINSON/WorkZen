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

const Layout = ({ children }) => (
  <div className="min-h-screen flex">
    <Sidebar />
    <div className="flex-1 p-4">
      <Navbar />
      {children}
    </div>
  </div>
)

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Layout><Employees/></Layout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance/></Layout></ProtectedRoute>} />
      <Route path="/timeoff" element={<ProtectedRoute><Layout><TimeOff/></Layout></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Layout><Payroll/></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Layout><Reports/></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings/></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><MyProfile/></Layout></ProtectedRoute>} />
    </Routes>
  )
}
