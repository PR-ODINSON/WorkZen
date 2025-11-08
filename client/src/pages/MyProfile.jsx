import React from 'react'

export default function MyProfile() {
  const userName = localStorage.getItem('userName') || 'Admin User'
  const userEmail = localStorage.getItem('userEmail') || 'admin@workzen.com'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-600 mt-1">View and manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="text-center">
            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{userName}</h2>
            <p className="text-sm text-slate-600">{userEmail}</p>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Personal Information</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={userName}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 1234567890"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  defaultValue="Administration"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Save Changes
              </button>
              <button className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
