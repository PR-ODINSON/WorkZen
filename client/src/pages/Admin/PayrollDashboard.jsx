import React, { useState, useEffect } from 'react'
import {
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUsers,
  FaChartBar,
} from 'react-icons/fa'
import payrollService from '../../services/payrollService'

export default function PayrollDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    warnings: {
      employeesWithoutBank: [],
      employeesWithoutManager: []
    },
    payruns: [],
    monthlyStats: [],
    totalEmployees: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await payrollService.getDashboard()
      console.log('Dashboard API response:', response)
      if (response.success && response.data) {
        setDashboardData(response.data)
      } else {
        console.warn('No data in response:', response)
      }
    } catch (error) {
      console.error('Error fetching payroll dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(d => d[key] || 0), 1)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const { warnings = { employeesWithoutBank: [], employeesWithoutManager: [] }, payruns = [], monthlyStats = [] } = dashboardData || {}
  const hasWarnings = warnings.employeesWithoutBank.length > 0 || warnings.employeesWithoutManager.length > 0

  return (
    <div className="space-y-6">
      {/* Warnings Section */}
      {hasWarnings && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-400 text-2xl mt-1 mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Warnings</h3>
              
              {warnings.employeesWithoutBank.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    {warnings.employeesWithoutBank.length} Employee{warnings.employeesWithoutBank.length !== 1 ? 's' : ''} without Bank A/c
                  </h4>
                  <div className="space-y-1">
                    {warnings.employeesWithoutBank.map(emp => (
                      <div key={emp.id} className="text-sm text-yellow-700">
                        • {emp.name} ({emp.employeeId}) - {emp.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {warnings.employeesWithoutManager.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">
                    {warnings.employeesWithoutManager.length} Employee{warnings.employeesWithoutManager.length !== 1 ? 's' : ''} without Manager
                  </h4>
                  <div className="space-y-1">
                    {warnings.employeesWithoutManager.map(emp => (
                      <div key={emp.id} className="text-sm text-yellow-700">
                        • {emp.name} ({emp.employeeId}) - {emp.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payrun List */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FaMoneyBillWave className="text-blue-600" /> Payrun
        </h3>
        
        {payruns.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No payruns created yet</p>
        ) : (
          <div className="space-y-3">
            {payruns.slice(0, 10).map(payrun => (
              <div 
                key={payrun.id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FaMoneyBillWave className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{payrun.displayName}</p>
                    <p className="text-sm text-slate-500">
                      {payrun.status === 'draft' && '📝 Draft'}
                      {payrun.status === 'processed' && '✅ Processed'}
                      {payrun.status === 'paid' && '💰 Paid'}
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employer Cost Chart */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Employer Cost</h3>
            <div className="flex items-center gap-4">
              <button className="text-sm text-slate-600 hover:text-slate-800">Annually</button>
              <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Monthly</button>
            </div>
          </div>
          
          {monthlyStats.length > 0 ? (
            <div className="space-y-4">
              {monthlyStats.map((stat, index) => {
                const maxCost = getMaxValue(monthlyStats, 'employerCost')
                const heightPercent = maxCost > 0 ? (stat.employerCost / maxCost) * 100 : 0
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-slate-600 font-medium">
                      {stat.month}
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-12 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${heightPercent}%` }}
                        >
                          {heightPercent > 20 && (
                            <span className="text-white text-sm font-semibold">
                              {formatCurrency(stat.employerCost)}
                            </span>
                          )}
                        </div>
                      </div>
                      {heightPercent <= 20 && stat.employerCost > 0 && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-700 text-sm font-semibold">
                          {formatCurrency(stat.employerCost)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No payroll data available</p>
          )}
        </div>

        {/* Employee Count Chart */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Employee Count</h3>
            <div className="flex items-center gap-4">
              <button className="text-sm text-slate-600 hover:text-slate-800">Annually</button>
              <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Monthly</button>
            </div>
          </div>
          
          {monthlyStats.length > 0 ? (
            <div className="space-y-4">
              {monthlyStats.map((stat, index) => {
                const maxCount = getMaxValue(monthlyStats, 'employeeCount')
                const heightPercent = maxCount > 0 ? (stat.employeeCount / maxCount) * 100 : 0
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-slate-600 font-medium">
                      {stat.month}
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-12 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${heightPercent}%` }}
                        >
                          {heightPercent > 20 && (
                            <span className="text-white text-sm font-semibold">
                              {stat.employeeCount}
                            </span>
                          )}
                        </div>
                      </div>
                      {heightPercent <= 20 && stat.employeeCount > 0 && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-700 text-sm font-semibold">
                          {stat.employeeCount}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No payroll data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
