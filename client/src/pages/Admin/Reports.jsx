import React from 'react'
import {
  FaFileAlt,
  FaChartBar,
  FaCalendarAlt,
  FaUsers,
  FaMoneyCheckAlt,
  FaDownload,
  FaFileInvoice,
} from 'react-icons/fa'

export default function Reports() {
  const reportTypes = [
    { name: 'Attendance Report', icon: <FaChartBar />, description: 'View attendance statistics and trends' },
    { name: 'Payroll Report', icon: <FaMoneyCheckAlt />, description: 'Monthly payroll summaries and breakdowns' },
    { name: 'Leave Report', icon: <FaCalendarAlt />, description: 'Leave requests and approval history' },
    { name: 'Employee Report', icon: <FaUsers />, description: 'Employee demographics and statistics' },
  ]

  const recentReports = [
    { title: 'November Attendance Report', date: 'Nov 7, 2025' },
    { title: 'October Payroll Report', date: 'Nov 1, 2025' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-3xl space-y-8">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl p-6">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaFileInvoice className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Reports</h1>
              <p className="text-blue-100">Generate and view HR analytics and insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Report Type Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <div
            key={index}
            className="group bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 hover:-translate-y-1"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{report.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-all text-sm shadow-md">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Reports Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaFileAlt className="text-blue-500" /> Recent Reports
        </h2>

        <div className="space-y-4">
          {recentReports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white border border-blue-100 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div>
                <p className="font-medium text-gray-800">{report.title}</p>
                <p className="text-xs text-gray-500">Generated on {report.date}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium shadow-sm">
                <FaDownload className="text-blue-600" /> Download
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
