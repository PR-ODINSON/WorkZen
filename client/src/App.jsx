import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/layout/ProtectedRoute'
import RoleProtectedRoute from './components/layout/RoleProtectedRoute'
import Navbar from './components/layout/Navbar'

// Admin imports
import * as Admin from './pages/Admin'

// Employee imports
import * as Employee from './pages/Employee'

// HR imports
import * as HR from './pages/HR'

// Payroll Officer imports
import * as PayrollOfficer from './pages/PayrollOfficer'

// Layout component for authenticated pages
const DashboardLayout = ({ children, Sidebar }) => (
  <div className="min-h-screen flex bg-slate-50">
    <Sidebar />
    <div className="flex-1 ml-60">
      <Navbar />
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
      
      {/* Root redirect based on role */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.Dashboard />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.Employees />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.Attendance />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timeoff"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.TimeOff />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.Payroll />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.Reports />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout Sidebar={Admin.Sidebar}>
                <Admin.MyProfile />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout Sidebar={Employee.Sidebar}>
                <Employee.Dashboard />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout Sidebar={Employee.Sidebar}>
                <Employee.Attendance />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/timeoff"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout Sidebar={Employee.Sidebar}>
                <Employee.TimeOff />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/payroll"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout Sidebar={Employee.Sidebar}>
                <Employee.Payroll />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/reports"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout Sidebar={Employee.Sidebar}>
                <Employee.Reports />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Employee']}>
              <DashboardLayout Sidebar={Employee.Sidebar}>
                <Employee.MyProfile />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* HR Routes */}
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HR']}>
              <DashboardLayout Sidebar={HR.Sidebar}>
                <HR.Dashboard />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HR']}>
              <DashboardLayout Sidebar={HR.Sidebar}>
                <HR.Employees />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/attendance"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HR']}>
              <DashboardLayout Sidebar={HR.Sidebar}>
                <HR.Attendance />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/timeoff"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HR']}>
              <DashboardLayout Sidebar={HR.Sidebar}>
                <HR.TimeOff />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/reports"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HR']}>
              <DashboardLayout Sidebar={HR.Sidebar}>
                <HR.Reports />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/profile"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['HR']}>
              <DashboardLayout Sidebar={HR.Sidebar}>
                <HR.MyProfile />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Payroll Officer Routes */}
      <Route
        path="/payroll/dashboard"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.Dashboard />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/employees"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.Employees />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/attendance"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.Attendance />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/timeoff"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.TimeOff />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/payroll"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.Payroll />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/reports"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.Reports />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/profile"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['PayrollOfficer']}>
              <DashboardLayout Sidebar={PayrollOfficer.Sidebar}>
                <PayrollOfficer.MyProfile />
              </DashboardLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Legacy routes redirect */}
      <Route path="/employees" element={<Navigate to="/admin/employees" replace />} />
      <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
      <Route path="/timeoff" element={<Navigate to="/admin/timeoff" replace />} />
      <Route path="/payroll" element={<Navigate to="/admin/payroll" replace />} />
      <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
      <Route path="/settings" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
