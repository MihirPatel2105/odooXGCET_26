import { useState } from 'react'
import './EmployeeStyles.css'

const EmployeeNavbar = ({ user, company, activeView, setActiveView, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '🕐' },
    { id: 'timeoff', label: 'Time Off', icon: '🏖️' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <div className="brand-logo">
            <span className="logo-icon">📋</span>
            <span className="logo-text">{company?.companyName || 'Dayflow+'}</span>
          </div>
          <span className="brand-subtitle">Employee Portal</span>
        </div>

        {/* Navigation Items */}
        <div className="navbar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {/* User Profile */}
          <div className="profile-section">
            <button 
              className="profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.avatar || user?.name?.substring(0, 2).toUpperCase() || 'EE'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'Employee'}</span>
                <span className="profile-role">{user?.role || 'Employee'}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar large">
                    {user?.avatar || user?.name?.substring(0, 2).toUpperCase() || 'EE'}
                  </div>
                  <div className="profile-details">
                    <p className="profile-menu-name">{user?.name || 'Employee'}</p>
                    <p className="profile-menu-email">{user?.email || ''}</p>
                    <p className="profile-menu-id">ID: {user?.loginId || ''}</p>
                  </div>
                </div>
                <div className="profile-menu-divider"></div>
                <button 
                  className="profile-menu-item"
                  onClick={() => { setActiveView('changePassword'); setShowProfileMenu(false); }}
                >
                  <span className="menu-icon">🔒</span>
                  Change Password
                </button>
                <button 
                  className="profile-menu-item danger"
                  onClick={onLogout}
                >
                  <span className="menu-icon">🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default EmployeeNavbar
