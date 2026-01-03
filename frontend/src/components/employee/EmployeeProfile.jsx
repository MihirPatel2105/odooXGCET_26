import { useState, useEffect } from 'react'
import { employeeAPI } from '../../services/api'
import './EmployeeStyles.css'

const EmployeeProfile = ({ user }) => {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      
      const response = await employeeAPI.getSelf()
      if (response.success && response.employee) {
        const empData = response.employee
        setProfileData({
          type: 'employee',
          id: empData._id,
          employeeCode: empData.employeeCode,
          fullName: empData.fullName,
          email: empData.email || user?.email,
          phone: empData.phone,
          address: empData.address,
          designation: empData.designation,
          department: empData.department,
          dateOfJoining: empData.dateOfJoining,
          status: empData.status,
          profileImage: empData.profileImage,
          avatar: (empData.fullName || 'NA').split(' ').map(n => n[0]).join('').toUpperCase(),
          loginId: user?.loginId || empData.email || 'N/A',
          companyName: 'My Company',
          manager: 'HR Manager',
          location: 'Office Location',
          role: 'Employee',
          about: 'Employee profile information - Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          whatILove: 'Passionate about work and team collaboration - Lorem Ipsum is simply dummy text.',
          interests: 'Professional development and learning - Lorem Ipsum is simply dummy text.',
          skills: empData.skills || ['Communication', 'Teamwork', 'Problem Solving', 'Time Management'],
          createdAt: empData.createdAt
        })
        setEditedData(empData)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to load profile data')
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
      <div className="emp-profile-container">
        <div className="emp-profile-loading-state">
          <div className="emp-profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="emp-profile-container">
        <div className="emp-profile-error-state">
          <p className="emp-error-message">⚠️ {error}</p>
          <button className="emp-profile-btn-primary" onClick={fetchProfileData}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const data = isEditing ? editedData : profileData

  return (
    <div className="emp-profile-container">
      {/* Profile Header Section */}
      <div className="emp-profile-header-section">
        <div className="emp-profile-header-label">
          Profile - Employee
        </div>
        
        {/* Profile Card - Top Section */}
        <div className="emp-profile-top-card">
          <div className="emp-profile-avatar-wrapper">
            <div className="emp-profile-avatar-large">
              {data?.avatar}
            </div>
            <div className="emp-profile-role-badge">{data?.role || 'EMP'}</div>
          </div>

          <div className="emp-profile-details-grid">
            <div className="emp-profile-detail-row">
              <div className="emp-profile-detail-col">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="emp-profile-input-edit"
                  />
                ) : (
                  <span className="emp-profile-value">{data?.fullName || 'N/A'}</span>
                )}
              </div>
              <div className="emp-profile-detail-col">
                <label>Login ID</label>
                <span className="emp-profile-value">{data?.loginId || 'N/A'}</span>
              </div>
            </div>

            <div className="emp-profile-detail-row">
              <div className="emp-profile-detail-col">
                <label>Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="emp-profile-input-edit"
                  />
                ) : (
                  <span className="emp-profile-value">{data?.companyName || 'N/A'}</span>
                )}
              </div>
              <div className="emp-profile-detail-col">
                <label>Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="emp-profile-input-edit"
                  />
                ) : (
                  <span className="emp-profile-value">{data?.department || 'N/A'}</span>
                )}
              </div>
            </div>

            <div className="emp-profile-detail-row">
              <div className="emp-profile-detail-col">
                <label>Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.designation || ''}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="emp-profile-input-edit"
                  />
                ) : (
                  <span className="emp-profile-value">{data?.designation || 'N/A'}</span>
                )}
              </div>
              <div className="emp-profile-detail-col">
                <label>Manager</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.manager || ''}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    className="emp-profile-input-edit"
                  />
                ) : (
                  <span className="emp-profile-value">{data?.manager || 'N/A'}</span>
                )}
              </div>
            </div>

            <div className="emp-profile-detail-row">
              <div className="emp-profile-detail-col">
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={data?.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="emp-profile-input-edit"
                  />
                ) : (
                  <span className="emp-profile-value">{data?.location || 'N/A'}</span>
                )}
              </div>
              <div className="emp-profile-detail-col">
                <label>Status</label>
                <span className={`emp-profile-status-badge ${data?.status === 'ACTIVE' ? 'emp-status-active' : 'emp-status-inactive'}`}>
                  {data?.status || 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Controls */}
          <div className="emp-profile-edit-controls-top">
            {!isEditing ? (
              <button className="emp-profile-btn-edit" onClick={handleEditToggle}>
                <span>✏️</span> Edit Profile
              </button>
            ) : (
              <>
                <button className="emp-profile-btn-save" onClick={handleSave}>
                  <span>💾</span> Save Changes
                </button>
                <button className="emp-profile-btn-cancel" onClick={handleCancel}>
                  <span>✖️</span> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="emp-profile-tabs-section">
        <div className="emp-profile-tabs">
          <button 
            className={`emp-profile-tab ${activeTab === 'resume' ? 'emp-profile-tab-active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <span className="emp-tab-icon">📋</span>
            Resume
          </button>
          <button 
            className={`emp-profile-tab ${activeTab === 'private' ? 'emp-profile-tab-active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            <span className="emp-tab-icon">🔒</span>
            Private Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="emp-profile-tab-content">
          {activeTab === 'resume' && (
            <div className="emp-tab-content-grid">
              <div className="emp-tab-content-left">
                <div className="emp-content-section">
                  <h3>About</h3>
                  {isEditing ? (
                    <textarea
                      value={data?.about || ''}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      className="emp-profile-textarea-edit"
                      rows="5"
                    />
                  ) : (
                    <p>{data?.about || 'No information available'}</p>
                  )}
                </div>

                <div className="emp-content-section">
                  <h3>What I love about my job</h3>
                  {isEditing ? (
                    <textarea
                      value={data?.whatILove || ''}
                      onChange={(e) => handleInputChange('whatILove', e.target.value)}
                      className="emp-profile-textarea-edit"
                      rows="5"
                    />
                  ) : (
                    <p>{data?.whatILove || 'No information available'}</p>
                  )}
                </div>

                <div className="emp-content-section">
                  <h3>My interests and hobbies</h3>
                  {isEditing ? (
                    <textarea
                      value={data?.interests || ''}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      className="emp-profile-textarea-edit"
                      rows="5"
                    />
                  ) : (
                    <p>{data?.interests || 'No information available'}</p>
                  )}
                </div>
              </div>

              <div className="emp-tab-content-right">
                <div className="emp-content-section emp-skills-section">
                  <div className="emp-skills-header">
                    <h3>Skills</h3>
                    {isEditing && (
                      <button onClick={handleSkillAdd} className="emp-btn-add-skill">
                        + Add Skill
                      </button>
                    )}
                  </div>
                  <div className="emp-skills-list">
                    {(data?.skills || []).map((skill, index) => (
                      <div key={index} className="emp-skill-item">
                        <span>{skill}</span>
                        {isEditing && (
                          <button 
                            onClick={() => handleSkillRemove(index)}
                            className="emp-skill-remove"
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
            <div className="emp-tab-content-single">
              <div className="emp-content-section">
                <h3>Private Information</h3>
                
                <div className="emp-form-grid">
                  <div className="emp-form-group">
                    <label>Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={data?.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="emp-profile-input-edit"
                      />
                    ) : (
                      <p className="emp-form-value">{data?.email || 'N/A'}</p>
                    )}
                  </div>

                  <div className="emp-form-group">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={data?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="emp-profile-input-edit"
                      />
                    ) : (
                      <p className="emp-form-value">{data?.phone || 'N/A'}</p>
                    )}
                  </div>

                  <div className="emp-form-group emp-form-group-full">
                    <label>Address</label>
                    {isEditing ? (
                      <textarea
                        value={data?.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="emp-profile-textarea-edit"
                        rows="3"
                      />
                    ) : (
                      <p className="emp-form-value">{data?.address || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile
