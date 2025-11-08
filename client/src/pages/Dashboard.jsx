import React from 'react'
import Card from '../components/ui/Card'

export default function Dashboard() {
  // Dummy statistics data
  const stats = [
    {
      title: 'Total Employees',
      value: '248',
      icon: '👥',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Attendance Rate',
      value: '94.5%',
      icon: '📅',
      trend: 'up',
      trendValue: '+2.3%',
    },
    {
      title: 'Active Leaves',
      value: '18',
      icon: '🏖️',
      trend: 'down',
      trendValue: '-5%',
    },
    {
      title: 'Payrolls Processed',
      value: '248',
      icon: '💰',
      trend: 'up',
      trendValue: '+100%',
    },
  ]

  // Recent activities dummy data
  const recentActivities = [
    { id: 1, action: 'New employee onboarded', name: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Leave approved', name: 'Jane Smith', time: '3 hours ago' },
    { id: 3, action: 'Payroll processed', name: 'HR Department', time: '5 hours ago' },
    { id: 4, action: 'Attendance marked', name: 'All Employees', time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
          />
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Attendance Overview
          </h2>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-center">
              <span className="text-6xl">📊</span>
              <p className="text-slate-500 mt-2">Chart will be displayed here</p>
              <p className="text-xs text-slate-400 mt-1">
                Integration with Recharts coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 mt-2 bg-indigo-600 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-600">{activity.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View All Activities →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all">
            <span className="text-3xl">➕</span>
            <span className="text-sm font-medium text-slate-700">Add Employee</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all">
            <span className="text-3xl">📋</span>
            <span className="text-sm font-medium text-slate-700">Mark Attendance</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all">
            <span className="text-3xl">💼</span>
            <span className="text-sm font-medium text-slate-700">Process Payroll</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all">
            <span className="text-3xl">📊</span>
            <span className="text-sm font-medium text-slate-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}
