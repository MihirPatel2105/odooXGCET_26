import { useState } from 'react'

const Navbar = ({ user, activeTab, setActiveTab, setActiveView, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCheckInOut, setShowCheckInOut] = useState(false)
  const [userStatus, setUserStatus] = useState('checked-in') // 'checked-in', 'on-leave', 'absent'
  const [checkInTime, setCheckInTime] = useState('09:00AM')

  // Get status icon and color based on user status
  const getStatusIndicator = () => {
    switch (userStatus) {
      case 'checked-in':
        return { icon: '●', color: '#22c55e', label: 'Checked In' }
      case 'on-leave':
        return { icon: '✈', color: '#3b82f6', label: 'On Leave' }
      case 'absent':
        return { icon: '●', color: '#eab308', label: 'Absent' }
      default:
        return { icon: '●', color: '#9ca3af', label: 'Unknown' }
    }
  }

  const statusInfo = getStatusIndicator()

  const handleCheckIn = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    setCheckInTime(timeString)
    setUserStatus('checked-in')
  }

  const handleCheckOut = () => {
    setUserStatus('absent')
  }

  return (
    <header className="navbar-new">
      <div className="navbar-container">
        {/* Company Logo */}
        <div className="navbar-logo">
          <div className="company-logo">
            <span className="logo-text">Company Logo</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-tabs">
          <button 
            className={`nav-tab ${activeTab === 'employees' ? 'nav-tab-active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button 
            className={`nav-tab ${activeTab === 'attendance' ? 'nav-tab-active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`nav-tab ${activeTab === 'timeoff' ? 'nav-tab-active' : ''}`}
            onClick={() => setActiveTab('timeoff')}
          >
            Time Off
          </button>
        </nav>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Check In/Out Button with Status */}
          <div className="checkin-dropdown">
            <button
              className="checkin-btn"
              onClick={() => setShowCheckInOut(!showCheckInOut)}
              title="Check In/Out"
            >
              <span 
                className="status-indicator"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.icon}
              </span>
              <span className="checkin-label">Check In/Out</span>
            </button>

            {showCheckInOut && (
              <div className="dropdown-menu checkin-menu">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Attendance</h3>
                  <button 
                    className="dropdown-close"
                    onClick={() => setShowCheckInOut(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="checkin-status">
                  <div className="status-row">
                    <span className="status-label">Current Status:</span>
                    <div className="status-value">
                      <span 
                        className="status-dot"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.icon}
                      </span>
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {userStatus === 'checked-in' && (
                    <div className="status-row">
                      <span className="status-label">Since:</span>
                      <span className="status-time">{checkInTime}</span>
                    </div>
                  )}
                </div>

                <div className="checkin-actions">
                  {userStatus !== 'checked-in' ? (
                    <button 
                      className="btn-checkin-action btn-checkin-green"
                      onClick={handleCheckIn}
                    >
                      Check In →
                    </button>
                  ) : (
                    <button 
                      className="btn-checkin-action btn-checkout-primary"
                      onClick={handleCheckOut}
                    >
                      Check Out →
                    </button>
                  )}
                </div>

                <div className="checkin-legend">
                  <p className="legend-title">Status Indicators:</p>
                  <div className="legend-items">
                    <div className="legend-item">
                      <span style={{ color: '#22c55e' }}>●</span>
                      <span>Checked In (Present)</span>
                    </div>
                    <div className="legend-item">
                      <span style={{ color: '#3b82f6' }}>✈</span>
                      <span>On Leave</span>
                    </div>
                    <div className="legend-item">
                      <span style={{ color: '#eab308' }}>●</span>
                      <span>Absent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="user-dropdown">
            <button
              className="user-btn-new"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="User Profile"
            >
              <div className="user-avatar-new">
                {user?.avatar || 'JS'}
              </div>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="user-menu-header">
                  <div className="user-avatar-large">
                    {user?.avatar || 'JS'}
                  </div>
                  <div className="user-info">
                    <h4 className="user-name">{user?.name || 'John Smith'}</h4>
                    <p className="user-role">{user?.role || 'HR Manager'}</p>
                  </div>
                </div>

                <div className="menu-divider"></div>

                <div className="menu-items">
                  <button className="menu-item" onClick={() => { setActiveView('profile'); setShowUserMenu(false); }}>
                    <span className="menu-icon">👤</span>
                    <span>My Profile</span>
                  </button>
                  <button className="menu-item" onClick={() => { setActiveView('changePassword'); setShowUserMenu(false); }}>
                    <span className="menu-icon">🔒</span>
                    <span>Change Password</span>
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">🌙</span>
                    <span>Dark Mode</span>
                  </button>
                  <hr className="menu-divider" />
                  <button className="menu-item">
                    <span className="menu-icon">ℹ️</span>
                    <span>Help & Support</span>
                  </button>
                  <button className="menu-item menu-item-logout" onClick={onLogout}>
                    <span className="menu-icon">🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;
