import React, { useState } from 'react'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                ✏️
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{userName}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Login ID</p>
                <p className="text-slate-800">{userEmail}</p>
              </div>
              <div>
                <p className="text-slate-500">Company</p>
                <p className="text-slate-800">Company Name</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="text-slate-800">{userEmail}</p>
              </div>
              <div>
                <p className="text-slate-500">Department</p>
                <p className="text-slate-800">Administration</p>
              </div>
              <div>
                <p className="text-slate-500">Mobile</p>
                <p className="text-slate-800">+91 1234567890</p>
              </div>
              <div>
                <p className="text-slate-500">Manager</p>
                <p className="text-slate-800">CEO</p>
              </div>
              <div>
                <p className="text-slate-500"></p>
                <p className="text-slate-800"></p>
              </div>
              <div>
                <p className="text-slate-500">Location</p>
                <p className="text-slate-800">Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'resume'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Resume
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'private'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Private Info
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'salary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Salary Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Security
          </button>
        </div>

        {activeTab === 'resume' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 space-y-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <h4 className="font-semibold text-slate-800 mb-2">What I love about my job</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <h4 className="font-semibold text-slate-800 mb-2">My interests and hobbies</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>

            <div className="col-span-5 space-y-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Skills</h3>
                <div className="space-y-2 mb-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-200">
                      <span className="text-sm text-slate-700">{skill}</span>
                      <button onClick={() => removeSkill(index)} className="text-red-500 hover:text-red-600 font-bold text-lg">×</button>
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
                    className="flex-1 bg-white border border-slate-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button onClick={addSkill} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                    + Add Skills
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Certification</h3>
                <div className="space-y-2 mb-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-200">
                      <span className="text-sm text-slate-700">{cert}</span>
                      <button onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-600 font-bold text-lg">×</button>
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
                    className="flex-1 bg-white border border-slate-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button onClick={addCertification} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                    + Add Skills
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <label className="text-sm text-slate-600 mb-2 block">Month Wage</label>
                <div className="flex items-baseline gap-2">
                  <input type="text" defaultValue="50000" className="text-2xl font-semibold text-slate-800 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:border-indigo-600" />
                  <span className="text-slate-600">/ Month</span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <label className="text-sm text-slate-600 mb-2 block">No of working days in a week:</label>
                <input type="text" className="text-lg font-semibold text-slate-800 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:border-indigo-600 w-full" />
              </div>

              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <label className="text-sm text-slate-600 mb-2 block">Yearly wage</label>
                <div className="flex items-baseline gap-2">
                  <input type="text" defaultValue="600000" className="text-2xl font-semibold text-slate-800 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:border-indigo-600" />
                  <span className="text-slate-600">/ Yearly</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <label className="text-sm text-slate-600 mb-2 block">Break Time:</label>
                <div className="flex items-baseline gap-2">
                  <input type="text" className="text-lg font-semibold text-slate-800 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:border-indigo-600" />
                  <span className="text-slate-600">/hrs</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Salary Components</h3>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">Basic Salary</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="25000.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="50.00" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Define Basic salary from company cost compute it based on monthly wages</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">House Rent Allowance</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="12500.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="50.00" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">HRA provided to employees 50% of the basic salary</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">Standard Allowance</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="4167.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="16.67" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">A standard allowance is a predetermined, fixed amount provided to employee as part of their salary</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">Performance Bonus</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="2082.50" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="8.33" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">Leave Travel Allowance</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="2082.50" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="8.33" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">LTA is provided to employees to cover their travel expenses, and calculated as a % of the basic salary</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-800">Fixed Allowance</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="2918.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="11.67" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Fixed allowance portion of wages is determined after calculating all salary components</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Provident Fund (PF) Contribution</h3>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-slate-800">Employee</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                          <input type="text" defaultValue="3000.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                          <span className="text-sm text-slate-600">₹ / month</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <input type="text" defaultValue="12.00" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                          <span className="text-sm text-slate-600">%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">PF is calculated based on the basic salary</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-slate-800">Employer</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-1">
                          <input type="text" defaultValue="3000.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                          <span className="text-sm text-slate-600">₹ / month</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <input type="text" defaultValue="12.00" className="w-16 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                          <span className="text-sm text-slate-600">%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">PF is calculated based on the basic salary</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Tax Deductions</h3>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-slate-800">Professional Tax</h4>
                      <div className="flex items-baseline gap-1">
                        <input type="text" defaultValue="200.00" className="w-24 text-right border-b border-slate-300 bg-transparent focus:outline-none" />
                        <span className="text-sm text-slate-600">₹ / month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Professional Tax deducted from the Gross salary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'private' && (
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Private Information</h3>
            <p className="text-slate-600">Private information content will be displayed here.</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Security Settings</h3>
            <p className="text-slate-600">Security settings content will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
