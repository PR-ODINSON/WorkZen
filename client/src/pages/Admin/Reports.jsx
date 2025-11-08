import React from 'react'

export default function AdminReports() {
  const reports = [
    { title: 'Employee Directory', description: 'Complete list of all employees', icon: '👥', color: 'indigo' },
    { title: 'Attendance Summary', description: 'Monthly attendance report', icon: '📅', color: 'green' },
    { title: 'Leave Report', description: 'Leave balances and history', icon: '🏖️', color: 'yellow' },
    { title: 'Payroll Report', description: 'Salary disbursement details', icon: '💰', color: 'blue' },
    { title: 'Department Analysis', description: 'Department-wise metrics', icon: '🏢', color: 'purple' },
    { title: 'Performance Review', description: 'Employee performance data', icon: '⭐', color: 'pink' },
  ]

  const colorClasses = {
    indigo: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50',
    green: 'border-green-200 hover:border-green-500 hover:bg-green-50',
    yellow: 'border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50',
    blue: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50',
    purple: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50',
    pink: 'border-pink-200 hover:border-pink-500 hover:bg-pink-50',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-600 mt-1">Generate and download various reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 border-2 ${colorClasses[report.color]} transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{report.icon}</span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {report.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Generate Report →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recently Generated</h2>
        <div className="space-y-3">
          {[
            { name: 'Attendance_January_2024.pdf', date: '2024-01-15', size: '2.4 MB' },
            { name: 'Payroll_December_2023.pdf', date: '2024-01-01', size: '3.1 MB' },
            { name: 'Employee_Directory_2024.xlsx', date: '2024-01-10', size: '1.8 MB' },
          ].map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {file.date} • {file.size}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
