import React, { useState } from 'react'
import { FaUserCircle, FaKey, FaBriefcase, FaLock, FaRegIdBadge } from 'react-icons/fa'

export default function MyProfile() {
  const userName = localStorage.getItem('userName') || 'Admin User'
  const userEmail = localStorage.getItem('userEmail') || 'admin@workzen.com'

  const [activeTab, setActiveTab] = useState('resume')
  const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js', 'MongoDB'])
  const [certifications, setCertifications] = useState(['AWS Certified', 'PMP Certified'])
  const [newSkill, setNewSkill] = useState('')
  const [newCertification, setNewCertification] = useState('')

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()])
      setNewCertification('')
    }
  }

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 rounded-3xl space-y-8">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl p-6 mb-6">
        <div className="relative z-10 flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
            <FaUserCircle className="text-white text-4xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">My Profile</h1>
            <p className="text-blue-100">Manage your personal, professional, and security details</p>
          </div>
        </div>
      </section>

      {/* Profile Info */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-blue-100 p-8">
        <div className="flex items-start gap-6 mb-8 border-b border-blue-100 pb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center text-4xl text-blue-700 font-bold">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{userName}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">Login ID</p>
                <p>{userEmail}</p>
              </div>
              <div>
                <p className="text-gray-500">Company</p>
                <p>WorkZen Pvt. Ltd.</p>
              </div>
              <div>
                <p className="text-gray-500">Department</p>
                <p>Administration</p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p>Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 border-b border-blue-100 mb-8">
          {[
            { key: 'resume', label: 'Resume', icon: <FaBriefcase /> },
            { key: 'private', label: 'Private Info', icon: <FaRegIdBadge /> },
            { key: 'salary', label: 'Salary Info', icon: <FaKey /> },
            { key: 'security', label: 'Security', icon: <FaLock /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">About Me</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  I am a passionate software engineer who loves building products that make work
                  smarter. I enjoy solving complex problems and contributing to high-impact projects.
                </p>

                <h4 className="mt-6 font-semibold text-blue-700">What I Love About My Job</h4>
                <p className="text-gray-600 text-sm mt-2">
                  Building systems that empower teams to do their best work while learning something
                  new every day.
                </p>

                <h4 className="mt-6 font-semibold text-blue-700">Hobbies & Interests</h4>
                <p className="text-gray-600 text-sm mt-2">Coding, Reading, and Astronomy 🌌</p>
              </div>
            </div>

            {/* Right Sidebar - Skills and Certifications */}
            <div className="col-span-5 space-y-6">
              {/* Skills */}
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Skills</h3>
                <div className="space-y-2 mb-4">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded border border-blue-100"
                    >
                      <span className="text-sm text-gray-700">{skill}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-600 font-bold text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill..."
                    className="flex-1 bg-white border border-blue-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded hover:opacity-90 text-sm shadow-md"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Certifications</h3>
                <div className="space-y-2 mb-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded border border-blue-100"
                    >
                      <span className="text-sm text-gray-700">{cert}</span>
                      <button
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-600 font-bold text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    placeholder="Add certification..."
                    className="flex-1 bg-white border border-blue-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addCertification}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded hover:opacity-90 text-sm shadow-md"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Private Info, Salary, Security Tabs */}
        {activeTab !== 'resume' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm text-gray-600">
            <p>
              {activeTab === 'private'
                ? 'Private Information management section coming soon.'
                : activeTab === 'salary'
                ? 'Salary and payroll breakdown tools available here.'
                : 'Security settings and password update tools will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
