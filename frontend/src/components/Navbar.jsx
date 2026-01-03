import { useState } from 'react'

const Navbar = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      id: 1,
      message: 'New employee Sarah Johnson has been added',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      message: 'Monthly payroll report is ready for review',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      message: 'System maintenance scheduled for this weekend',
      time: '3 hours ago',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="navbar">
      <div className="navbar-content">
        {/* Search Bar */}
        <div className="navbar-search">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search employees, documents, reports..."
              className="search-input"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-btn" title="Add New Employee">
              <span className="action-icon">👤➕</span>
            </button>
            <button className="action-btn" title="Generate Report">
              <span className="action-icon">📋</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="notification-dropdown">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <span className="notification-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="dropdown-menu notification-menu">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notifications</h3>
                  <button className="mark-all-read">Mark all read</button>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                    >
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {!notification.read && <div className="notification-dot"></div>}
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-btn">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-dropdown">
            <button
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <span className="avatar-text">{user.avatar}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <span className="dropdown-arrow">⌄</span>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="dropdown-header">
                  <div className="user-profile">
                    <div className="user-avatar large">
                      <span className="avatar-text">{user.avatar}</span>
                    </div>
                    <div className="user-details">
                      <h4 className="user-name">{user.name}</h4>
                      <p className="user-role">{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="menu-items">
                  <button className="menu-item">
                    <span className="menu-icon">👤</span>
                    Profile Settings
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">🔒</span>
                    Change Password
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">🌙</span>
                    Dark Mode
                  </button>
                  <hr className="menu-divider" />
                  <button className="menu-item">
                    <span className="menu-icon">ℹ️</span>
                    Help & Support
                  </button>
                  <button className="menu-item logout">
                    <span className="menu-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          background-color: var(--white);
          border-bottom: 1px solid var(--gray-200);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-content {
          height: 100%;
          padding: 0 var(--spacing-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-search {
          flex: 1;
          max-width: 500px;
          margin-right: var(--spacing-xl);
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
          font-size: 0.875rem;
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 2.5rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background-color: var(--gray-50);
          transition: all 150ms ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-500);
          background-color: var(--white);
          box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.1);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .quick-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-right: var(--spacing-md);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: var(--radius-md);
          background-color: var(--gray-100);
          color: var(--primary-600);
          cursor: pointer;
          transition: all 150ms ease;
        }

        .action-btn:hover {
          background-color: var(--primary-100);
          color: var(--primary-800);
        }

        .action-icon {
          font-size: 1rem;
        }

        .notification-dropdown,
        .user-dropdown {
          position: relative;
        }

        .notification-btn,
        .user-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm);
          border: none;
          border-radius: var(--radius-md);
          background: none;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .notification-btn {
          position: relative;
          width: 40px;
          height: 40px;
          justify-content: center;
        }

        .notification-btn:hover,
        .user-btn:hover {
          background-color: var(--gray-100);
        }

        .notification-icon {
          font-size: 1.125rem;
          color: var(--primary-600);
        }

        .notification-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 18px;
          height: 18px;
          background-color: var(--primary-600);
          color: var(--white);
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary-600);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-medium);
          font-size: 0.875rem;
        }

        .user-avatar.large {
          width: 40px;
          height: 40px;
          font-size: 1rem;
        }

        .avatar-text {
          line-height: 1;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          color: var(--gray-700);
          line-height: 1.2;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--gray-500);
          line-height: 1.2;
        }

        .dropdown-arrow {
          color: var(--gray-400);
          font-size: 0.75rem;
          margin-left: var(--spacing-xs);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 280px;
          background-color: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 200;
          margin-top: var(--spacing-xs);
        }

        .notification-menu {
          width: 350px;
        }

        .dropdown-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-title {
          font-size: 1rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0;
        }

        .mark-all-read {
          background: none;
          border: none;
          color: var(--primary-600);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .mark-all-read:hover {
          color: var(--primary-800);
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--gray-100);
          transition: all 150ms ease;
        }

        .notification-item:hover {
          background-color: var(--gray-50);
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-unread {
          background-color: var(--primary-50);
        }

        .notification-content {
          flex: 1;
        }

        .notification-message {
          font-size: 0.875rem;
          color: var(--gray-700);
          margin: 0 0 var(--spacing-xs) 0;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .notification-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary-600);
          border-radius: 50%;
          margin-top: 6px;
        }

        .dropdown-footer {
          padding: var(--spacing-md) var(--spacing-lg);
          border-top: 1px solid var(--gray-200);
        }

        .view-all-btn {
          width: 100%;
          padding: var(--spacing-sm);
          background: none;
          border: none;
          color: var(--primary-600);
          font-size: 0.875rem;
          cursor: pointer;
          border-radius: var(--radius-md);
        }

        .view-all-btn:hover {
          background-color: var(--primary-50);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .user-details h4 {
          font-size: 0.875rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0;
        }

        .user-details p {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin: 0;
        }

        .menu-items {
          padding: var(--spacing-sm) 0;
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-lg);
          background: none;
          border: none;
          color: var(--gray-700);
          font-size: 0.875rem;
          text-align: left;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .menu-item:hover {
          background-color: var(--gray-50);
        }

        .menu-item.logout {
          color: var(--primary-600);
        }

        .menu-item.logout:hover {
          background-color: var(--primary-50);
        }

        .menu-icon {
          font-size: 1rem;
          width: 20px;
        }

        .menu-divider {
          border: none;
          border-top: 1px solid var(--gray-200);
          margin: var(--spacing-sm) 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar-content {
            padding: 0 var(--spacing-md);
          }

          .navbar-search {
            display: none;
          }

          .quick-actions {
            display: none;
          }

          .dropdown-menu {
            right: -10px;
            width: calc(100vw - 20px);
            max-width: 320px;
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar