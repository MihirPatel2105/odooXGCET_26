import { useState, useEffect } from 'react'
import { authAPI, employeeAPI } from '../services/api'
import './Profile.css'

const Profile = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('resume')
  const [editedData, setEditedData] = useState({})

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const token = localStorage.getItem('token')
      
      if (userData.role === 'ADMIN' || userData.role === 'HR') {
        setProfileData({
          type: 'admin',
          fullName: userData.name || 'Admin User',
          email: userData.email || 'admin@company.com',
          phone: '+1 234 567 8900',
          role: userData.role || 'ADMIN',
          loginId: userData.loginId || userData.email || 'N/A',
          companyName: 'My Company',
          department: 'Management',
          designation: 'Chief Administrator',
          manager: 'CEO',
          location: 'Head Office',
          address: '123 Business Street, City, State 12345',
          avatar: (userData.name || 'AD').split(' ').map(n => n[0]).join('').toUpperCase(),
          createdAt: userData.createdAt || new Date().toISOString(),
          status: 'ACTIVE',
          about: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
          whatILove: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
          interests: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
          skills: ['Leadership', 'Management', 'Strategic Planning', 'Team Building', 'Communication'],
          monthlyWage: 50000,
          yearlyWage: 600000,
          workingDays: 5,
          breakTime: '1 hr',
          salary: {
            basic: { amount: 25000, percentage: 52.00 },
            hra: { amount: 12500, percentage: 50.00 },
            standardAllowance: { amount: 7187.50, percentage: 28.75 },
            performanceBonus: { amount: 2092.50, percentage: 8.33 },
            leaveTravelAllowance: { amount: 2092.50, percentage: 8.33 },
            foodAllowance: { amount: 2917.50, percentage: 11.67 }
          },
          providentFund: {
            employee: 30000,
            employer: 30000,
            percentage: 12.00
          },
          taxDeductions: {
            professionalTax: 200.00
          }
        })
      } else {
        const response = await employeeAPI.getAll()
        if (response.success && response.employees) {
          const currentEmployee = response.employees.find(emp => 
            emp.userId?.email === userData.email
          )
          
          if (currentEmployee) {
            setProfileData({
              type: 'employee',
              id: currentEmployee._id,
              employeeCode: currentEmployee.employeeCode,
              fullName: currentEmployee.fullName,
              email: currentEmployee.userId?.email,
              phone: currentEmployee.phone,
              address: currentEmployee.address,
              designation: currentEmployee.designation,
              department: currentEmployee.department,
              dateOfJoining: currentEmployee.dateOfJoining,
              status: currentEmployee.status,
              profileImage: currentEmployee.profileImage,
              avatar: (currentEmployee.fullName || 'NA').split(' ').map(n => n[0]).join('').toUpperCase(),
              loginId: currentEmployee.userId?.email || 'N/A',
              companyName: 'My Company',
              manager: 'HR Manager',
              location: 'Office Location',
              role: 'Employee',
              about: 'Employee profile information - Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
              whatILove: 'Passionate about work and team collaboration - Lorem Ipsum is simply dummy text.',
              interests: 'Professional development and learning - Lorem Ipsum is simply dummy text.',
              skills: currentEmployee.skills || ['Communication', 'Teamwork', 'Problem Solving', 'Time Management'],
              createdAt: currentEmployee.createdAt
            })
          }
        }
      }
      
      setEditedData(profileData)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedData({ ...profileData })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    setProfileData({ ...editedData })
    setIsEditing(false)
    // TODO: Add API call to save data
  }

  const handleCancel = () => {
    setEditedData({ ...profileData })
    setIsEditing(false)
  }

  const handleSkillAdd = () => {
    const newSkill = prompt('Enter new skill:')
    if (newSkill && newSkill.trim()) {
      const updatedSkills = [...(editedData.skills || []), newSkill.trim()]
      setEditedData(prev => ({ ...prev, skills: updatedSkills }))
    }
  }

  const handleSkillRemove = (index) => {
    const updatedSkills = editedData.skills.filter((_, i) => i !== index)
    setEditedData(prev => ({ ...prev, skills: updatedSkills }))
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading-state">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error-state">
          <p className="error-message">⚠️ {error}</p>
          <button className="profile-btn-primary" onClick={fetchProfileData}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const data = isEditing ? editedData : profileData

  return (
    <div className="profile-container">
      {/* Profile Header Section */}
      <div className="profile-header-section">
        <div className="profile-header-label">
          Profile - {profileData?.type === 'admin' ? 'Administrator' : 'Employee'}
        </div>
        
        {/* Profile Card - Top Section */}
        <div className="profile-top-card">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-large">
              {data?.avatar}
            </div>
            <div className="profile-role-badge">{data?.role || 'EMP'}</div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-row">
              <div className="profile-detail-col">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="profile-input-edit"
                  />
                ) : (
                  <span className="profile-value">{data?.fullName || 'N/A'}</span>
                )}
              </div>
              <div className="profile-detail-col">
                <label>Login ID</label>
                <span className="profile-value">{data?.loginId || 'N/A'}</span>
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-col">
                <label>Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="profile-input-edit"
                  />
                ) : (
                  <span className="profile-value">{data?.companyName || 'N/A'}</span>
                )}
              </div>
              <div className="profile-detail-col">
                <label>Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="profile-input-edit"
                  />
                ) : (
                  <span className="profile-value">{data?.department || 'N/A'}</span>
                )}
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-col">
                <label>Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.designation || ''}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="profile-input-edit"
                  />
                ) : (
                  <span className="profile-value">{data?.designation || 'N/A'}</span>
                )}
              </div>
              <div className="profile-detail-col">
                <label>Manager</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.manager || ''}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    className="profile-input-edit"
                  />
                ) : (
                  <span className="profile-value">{data?.manager || 'N/A'}</span>
                )}
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="profile-detail-col">
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="profile-input-edit"
                  />
                ) : (
                  <span className="profile-value">{data?.location || 'N/A'}</span>
                )}
              </div>
              <div className="profile-detail-col">
                <label>Status</label>
                <span className={`profile-status-badge ${data?.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                  {data?.status || 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Controls */}
          <div className="profile-edit-controls-top">
            {!isEditing ? (
              <button className="profile-btn-edit" onClick={handleEditToggle}>
                <span>✏️</span> Edit Profile
              </button>
            ) : (
              <>
                <button className="profile-btn-save" onClick={handleSave}>
                  <span>💾</span> Save Changes
                </button>
                <button className="profile-btn-cancel" onClick={handleCancel}>
                  <span>✖️</span> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="profile-tabs-section">
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'resume' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <span className="tab-icon">📋</span>
            Resume
          </button>
          <button 
            className={`profile-tab ${activeTab === 'private' ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            <span className="tab-icon">🔒</span>
            Private Info
          </button>
          {profileData?.type === 'admin' && (
            <button 
              className={`profile-tab ${activeTab === 'salary' ? 'profile-tab-active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              <span className="tab-icon">💰</span>
              Salary Info
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content">
          {activeTab === 'resume' && (
            <div className="tab-content-grid">
              <div className="tab-content-left">
                <div className="content-section">
                  <h3>About</h3>
                  {isEditing ? (
                    <textarea
                      value={data?.about || ''}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      className="profile-textarea-edit"
                      rows="5"
                    />
                  ) : (
                    <p>{data?.about || 'No information available'}</p>
                  )}
                </div>

                <div className="content-section">
                  <h3>What I love about my job</h3>
                  {isEditing ? (
                    <textarea
                      value={data?.whatILove || ''}
                      onChange={(e) => handleInputChange('whatILove', e.target.value)}
                      className="profile-textarea-edit"
                      rows="5"
                    />
                  ) : (
                    <p>{data?.whatILove || 'No information available'}</p>
                  )}
                </div>

                <div className="content-section">
                  <h3>My interests and hobbies</h3>
                  {isEditing ? (
                    <textarea
                      value={data?.interests || ''}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      className="profile-textarea-edit"
                      rows="5"
                    />
                  ) : (
                    <p>{data?.interests || 'No information available'}</p>
                  )}
                </div>
              </div>

              <div className="tab-content-right">
                <div className="content-section skills-section">
                  <div className="skills-header">
                    <h3>Skills</h3>
                    {isEditing && (
                      <button onClick={handleSkillAdd} className="btn-add-skill">
                        + Add Skill
                      </button>
                    )}
                  </div>
                  <div className="skills-list">
                    {(data?.skills || []).map((skill, index) => (
                      <div key={index} className="skill-item">
                        <span>{skill}</span>
                        {isEditing && (
                          <button 
                            onClick={() => handleSkillRemove(index)}
                            className="skill-remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'private' && (
            <div className="tab-content-single">
              <div className="content-section">
                <h3>Private Information</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={data?.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="profile-input-edit"
                      />
                    ) : (
                      <p className="form-value">{data?.email || 'N/A'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={data?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="profile-input-edit"
                      />
                    ) : (
                      <p className="form-value">{data?.phone || 'N/A'}</p>
                    )}
                  </div>

                  <div className="form-group form-group-full">
                    <label>Address</label>
                    {isEditing ? (
                      <textarea
                        value={data?.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="profile-textarea-edit"
                        rows="3"
                      />
                    ) : (
                      <p className="form-value">{data?.address || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && profileData?.type === 'admin' && (
            <div className="tab-content-single salary-tab">
              <div className="salary-warning">
                <span className="warning-icon">⚠️</span>
                <strong>Salary Info tab should only be visible to Admin</strong>
              </div>

              <div className="salary-summary">
                <div className="salary-card">
                  <label>Monthly Wage</label>
                  <div className="salary-amount">
                    ₹{data?.monthlyWage?.toLocaleString() || '50,000'}
                    <span className="salary-period">/ Month</span>
                  </div>
                </div>
                <div className="salary-card">
                  <label>Yearly Wage</label>
                  <div className="salary-amount">
                    ₹{data?.yearlyWage?.toLocaleString() || '6,00,000'}
                    <span className="salary-period">/ Yearly</span>
                  </div>
                </div>
                <div className="salary-card">
                  <label>Working Days</label>
                  <div className="salary-amount">
                    {data?.workingDays || '5'}
                    <span className="salary-period">days/week</span>
                  </div>
                </div>
                <div className="salary-card">
                  <label>Break Time</label>
                  <div className="salary-amount">
                    {data?.breakTime || '1 hr'}
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h3>Salary Calculator</h3>
                <div className="salary-breakdown">
                  <div className="salary-item">
                    <div className="salary-item-header">
                      <span className="salary-label">Basic Salary</span>
                      <div className="salary-values">
                        <span className="salary-amt">₹{data?.salary?.basic?.amount?.toLocaleString() || '25,000'}</span>
                        <span className="salary-pct">{data?.salary?.basic?.percentage || '52.00'}%</span>
                      </div>
                    </div>
                    <p className="salary-desc">Note: Basic Salary from company must comprise is based on Basic Salary</p>
                  </div>

                  <div className="salary-item">
                    <div className="salary-item-header">
                      <span className="salary-label">House Rent Allowance</span>
                      <div className="salary-values">
                        <span className="salary-amt">₹{data?.salary?.hra?.amount?.toLocaleString() || '12,500'}</span>
                        <span className="salary-pct">{data?.salary?.hra?.percentage || '50.00'}%</span>
                      </div>
                    </div>
                    <p className="salary-desc">HRA provided to employees 50% of the basic salary</p>
                  </div>

                  <div className="salary-item">
                    <div className="salary-item-header">
                      <span className="salary-label">Standard Allowance</span>
                      <div className="salary-values">
                        <span className="salary-amt">₹{data?.salary?.standardAllowance?.amount?.toLocaleString() || '7,187.50'}</span>
                        <span className="salary-pct">{data?.salary?.standardAllowance?.percentage || '28.75'}%</span>
                      </div>
                    </div>
                    <p className="salary-desc">As a predetermined amount defined by company as part of their salary</p>
                  </div>

                  <div className="salary-item">
                    <div className="salary-item-header">
                      <span className="salary-label">Performance Bonus</span>
                      <div className="salary-values">
                        <span className="salary-amt">₹{data?.salary?.performanceBonus?.amount?.toLocaleString() || '2,092.50'}</span>
                        <span className="salary-pct">{data?.salary?.performanceBonus?.percentage || '8.33'}%</span>
                      </div>
                    </div>
                    <p className="salary-desc">Variable amount paid during payroll. The value defined by the company</p>
                  </div>

                  <div className="salary-item">
                    <div className="salary-item-header">
                      <span className="salary-label">Leave Travel Allowance</span>
                      <div className="salary-values">
                        <span className="salary-amt">₹{data?.salary?.leaveTravelAllowance?.amount?.toLocaleString() || '2,092.50'}</span>
                        <span className="salary-pct">{data?.salary?.leaveTravelAllowance?.percentage || '8.33'}%</span>
                      </div>
                    </div>
                    <p className="salary-desc">LTA is paid by the company to employees to cover their travel expenses calculated as 8.33% of basic salary</p>
                  </div>

                  <div className="salary-item">
                    <div className="salary-item-header">
                      <span className="salary-label">Food Allowance</span>
                      <div className="salary-values">
                        <span className="salary-amt">₹{data?.salary?.foodAllowance?.amount?.toLocaleString() || '2,917.50'}</span>
                        <span className="salary-pct">{data?.salary?.foodAllowance?.percentage || '11.67'}%</span>
                      </div>
                    </div>
                    <p className="salary-desc">Food allowances portion of the employees meal as per calculating all salary components</p>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h3>Provident Fund (PF) Contribution</h3>
                <div className="pf-grid">
                  <div className="pf-card">
                    <label>Employee Contribution</label>
                    <div className="pf-amount">
                      ₹{data?.providentFund?.employee?.toLocaleString() || '30,000'}
                      <span className="pf-pct">{data?.providentFund?.percentage || '12.00'}%</span>
                    </div>
                  </div>
                  <div className="pf-card">
                    <label>Employer Contribution</label>
                    <div className="pf-amount">
                      ₹{data?.providentFund?.employer?.toLocaleString() || '30,000'}
                      <span className="pf-pct">{data?.providentFund?.percentage || '12.00'}%</span>
                    </div>
                  </div>
                </div>
                <p className="pf-note">Note: for the basic salary in the Provident Fund</p>
              </div>

              <div className="content-section">
                <h3>Tax Deductions</h3>
                <div className="tax-item">
                  <span className="tax-label">Professional Tax</span>
                  <span className="tax-amount">₹{data?.taxDeductions?.professionalTax?.toLocaleString() || '200.00'} / month</span>
                </div>
                <p className="tax-note">Professional Tax deducted from the Gross salary</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
