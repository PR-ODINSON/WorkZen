import React, { useState } from 'react'
import Table from '../../components/ui/Table'
import {
  FaMoneyCheckAlt,
  FaWallet,
  FaUsers,
  FaFileInvoiceDollar,
  FaPlayCircle,
  FaThList,
  FaThLarge,
  FaRegMoneyBillAlt,
} from 'react-icons/fa'

export default function Payroll() {
  const [viewMode, setViewMode] = useState('list') // list | card

  const payrollData = [
    {
      id: 1,
      employee: 'John Doe',
      month: 'November 2025',
      basic: '$5,000',
      allowances: '$1,000',
      deductions: '$500',
      net: '$5,500',
    },
    {
      id: 2,
      employee: 'Jane Smith',
      month: 'November 2025',
      basic: '$6,000',
      allowances: '$1,200',
      deductions: '$600',
      net: '$6,600',
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      month: 'November 2025',
      basic: '$4,500',
      allowances: '$900',
      deductions: '$450',
      net: '$4,950',
    },
  ]

  const columns = [
    { header: 'Employee', accessor: 'employee' },
    { header: 'Month', accessor: 'month' },
    { header: 'Basic Salary', accessor: 'basic' },
    { header: 'Allowances', accessor: 'allowances' },
    { header: 'Deductions', accessor: 'deductions' },
    {
      header: 'Net Salary',
      accessor: 'net',
      render: (value) => <span className="font-semibold text-green-600">{value}</span>,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-3xl space-y-8">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl p-6">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaMoneyCheckAlt className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Payroll</h1>
              <p className="text-blue-100">Manage salaries and payroll operations</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow-md hover:bg-blue-50 transition-all">
            <FaPlayCircle /> Process Payroll
          </button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FaWallet className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Processed</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">$17,050</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <FaUsers className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Employees Paid</p>
            <p className="text-3xl font-bold text-green-600 mt-1">3</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <FaFileInvoiceDollar className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Payslips</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">0</p>
          </div>
        </div>
      </section>

      {/* Payroll Summary Section */}
      <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-lg p-6 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaMoneyCheckAlt className="text-blue-500" /> Payroll Summary
          </h2>

          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <FaThList /> List
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'card'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <FaThLarge /> Card
            </button>
          </div>
        </div>

        {/* Conditional View */}
        {viewMode === 'list' ? (
          <Table columns={columns} data={payrollData} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {payrollData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all p-6 cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                      <FaRegMoneyBillAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.employee}</h3>
                      <p className="text-sm text-gray-500">{item.month}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">{item.net}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-700 border-t border-blue-100 pt-3">
                  <p>
                    <span className="font-medium text-gray-800">Basic:</span> {item.basic}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Allowances:</span> {item.allowances}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Deductions:</span> {item.deductions}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-md">
                    Download Payslip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
