import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      console.log('Login response:', response)
      const { user, token } = response
      
      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      console.log('User set:', user)
      console.log('Redirecting to:', user.role)
      
      // Redirect based on role
      redirectBasedOnRole(user.role)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const redirectBasedOnRole = (role) => {
    const roleRoutes = {
      'admin': '/admin/employees',
      'Admin': '/admin/employees',
      'hr': '/hr/employees',
      'HR': '/hr/employees',
      'payroll': '/payroll/employees',
      'payrollofficer': '/payroll/employees',
      'Payroll Officer': '/payroll/employees',
      'employee': '/employee/attendance',
      'Employee': '/employee/attendance',
    }
    
    const route = roleRoutes[role] || '/employee/attendance'
    navigate(route)
  }

  const hasRole = (allowedRoles) => {
    if (!user) return false
    return allowedRoles.includes(user.role.toLowerCase())
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
