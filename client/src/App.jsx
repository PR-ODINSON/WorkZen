import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion' // Assuming Framer Motion is installed for advanced animations
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/layout/ProtectedRoute'
import RoleProtectedRoute from './components/layout/RoleProtectedRoute'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { SidebarProvider, useSidebar } from './context/SidebarContext'

// Admin imports
import * as Admin from './pages/Admin'

// Employee imports
import * as Employee from './pages/Employee'

// HR imports
import * as HR from './pages/HR'

// Payroll Officer imports
import * as PayrollOfficer from './pages/PayrollOfficer'

// Wrapper component that provides SidebarProvider
const SidebarLayout = ({ children, Sidebar: SidebarComponent = Sidebar }) => (
  <SidebarProvider>
    <DashboardLayout Sidebar={SidebarComponent}>
      {children}
    </DashboardLayout>
  </SidebarProvider>
)

// Layout component for authenticated pages
const DashboardLayout = ({ children, Sidebar: SidebarComponent = Sidebar }) => {
  const { isCollapsed } = useSidebar()
  
  // Calculate margin based on sidebar state
  // Admin sidebar: expanded = 16rem (256px), collapsed = 5rem (80px)
  // Default sidebar: expanded = 20rem (320px), collapsed = 5rem (80px)
  const marginLeft = isCollapsed ? 'ml-20' : 'ml-64' // 5rem when collapsed, 16rem when expanded
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Sidebar - Dynamic based on role */}
      <SidebarComponent />
      
      {/* Main content area - Responsive margin */}
      <div className={`flex-1 ${marginLeft} transition-all duration-300 relative z-10`}>
      {/* Navbar - Fixed top */}
      <Navbar />
      
      {/* Page content with top margin for navbar */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-16 p-6"
      >
        {children}
      </motion.main>
    </div>

    <style>{`
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      `}</style>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Root redirect based on role */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.Employees />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.Attendance />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timeoff"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.TimeOff />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.Payroll />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.Reports />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.MyProfile />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <SidebarLayout Sidebar={Admin.Sidebar}>
                <Admin.Settings />
              </SidebarLayout>
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
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
      <Route path="/settings" element={<Navigate to="/admin/employees" replace />} />
      <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}