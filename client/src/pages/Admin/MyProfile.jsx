import React, { useState, useEffect } from 'react'
import { FaUserCircle, FaKey, FaBriefcase, FaLock, FaRegIdBadge } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'

export default function MyProfile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('resume')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [certifications, setCertifications] = useState([])
  const [about, setAbout] = useState('')
  const [editingAbout, setEditingAbout] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/profile')
      if (response.data.success && response.data.profile) {
        const profileData = response.data.profile
        setProfile(profileData)
        setSkills(profileData.skills || [])
        setCertifications(profileData.certifications || [])
        setAbout(profileData.about || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const saveResume = async () => {
    try {
      setSaving(true)
      const response = await api.put('/profile/resume', {
        skills,
        certifications,
        about
      })
      if (response.data.success) {
        showSuccess('Resume updated successfully!')
        setProfile(response.data.profile)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()]
      setSkills(updatedSkills)
      setNewSkill('')
      await saveResumeField('skills', updatedSkills)
    }
  }

  const addCertification = async () => {
    if (newCertification.trim()) {
      const updatedCertifications = [...certifications, newCertification.trim()]
      setCertifications(updatedCertifications)
      setNewCertification('')
      await saveResumeField('certifications', updatedCertifications)
    }
  }

  const removeSkill = async (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    setSkills(updatedSkills)
    await saveResumeField('skills', updatedSkills)
  }

  const removeCertification = async (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index)
    setCertifications(updatedCertifications)
    await saveResumeField('certifications', updatedCertifications)
  }

  const saveResumeField = async (field, value) => {
    try {
      const updateData = { skills, certifications, about }
      updateData[field] = value
      const response = await api.put('/profile/resume', updateData)
      if (response.data.success) {
        showSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`)
      }
    } catch (error) {
      console.error('Error updating:', error)
    }
  }

  const saveAbout = async () => {
    await saveResumeField('about', about)
    setEditingAbout(false)
  }

  return (
    <div className="rounded-3xl space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative">
          {successMessage}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-blue-100 p-8">
          <div className="text-center text-gray-600">Loading profile...</div>
        </div>
      ) : (
        <>
          {/* Profile Info */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-start gap-6 mb-8 border-b border-blue-100 pb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                  <div className="w-28 h-28 rounded-full bg-white/90 flex items-center justify-center text-4xl text-blue-700 font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.name || 'Admin User'}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="text-gray-500">Login ID</p>
                    <p>{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p>Odoo India</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p>Administration</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p>{user?.location || 'India'}</p>
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-700">About Me</h3>
                  {!editingAbout ? (
                    <button
                      onClick={() => setEditingAbout(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={saveAbout}
                        disabled={saving}
                        className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAbout(profile?.about || '')
                          setEditingAbout(false)
                        }}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                {editingAbout ? (
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about yourself, what you love about your job, your hobbies and interests..."
                    className="w-full h-64 bg-white border border-blue-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {about || 'Click "Edit" to add information about yourself.'}
                  </div>
                )}
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
        </>
      )}
    </div>
  )
}
