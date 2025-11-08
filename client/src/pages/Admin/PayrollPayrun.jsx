import React from 'react'
import { FaMoneyCheckAlt } from 'react-icons/fa'

export default function PayrollPayrun() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
        <FaMoneyCheckAlt className="text-6xl text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-slate-800 mb-2">Payrun Management</h3>
        <p className="text-slate-600">This feature will be implemented next.</p>
        <p className="text-sm text-slate-500 mt-2">
          Here you'll be able to create and manage payroll runs for employees.
        </p>
      </div>
    </div>
  )
}
