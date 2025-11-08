import React from 'react'

export default function EmployeeProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-600 mt-1">View your employee information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
        <p className="text-center text-slate-500">Employee profile view - Read only access</p>
      </div>
    </div>
  )
}
