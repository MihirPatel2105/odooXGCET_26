import { useState } from 'react'

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'employees',
      label: 'Employee Management',
      icon: '👥',
      path: '/employees'
    },
    {
      id: 'attendance',
      label: 'Attendance Tracking',
      icon: '🕐',
      path: '/attendance'
    },
    {
      id: 'payroll',
      label: 'Payroll System',
      icon: '💰',
      path: '/payroll'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: '📈',
      path: '/reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings'
    }
  ]

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">💼</span>
            {!isCollapsed && (
              <div className="logo-text">
                <h1 className="logo-title">Dayflow+</h1>
                <p className="logo-subtitle">HRMS</p>
              </div>
            )}
          </div>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeView === item.id ? 'nav-link-active' : ''}`}
                onClick={() => setActiveView(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-version">
          {!isCollapsed && (
            <>
              <p className="version-text">Version 2.1.0</p>
              <p className="company-text">© 2026 Dayflow+</p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          background-color: var(--primary-800);
          color: var(--white);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--primary-700);
          transition: width 200ms ease;
          z-index: 1000;
        }

        .sidebar-collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--primary-700);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-container {
          flex: 1;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.25rem;
          font-weight: var(--font-weight-bold);
          margin: 0;
          color: var(--white);
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: var(--primary-300);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--primary-300);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: all 150ms ease;
        }

        .sidebar-toggle:hover {
          background-color: var(--primary-700);
          color: var(--white);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--spacing-lg) 0;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin-bottom: var(--spacing-xs);
        }

        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          background: none;
          border: none;
          color: var(--primary-200);
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          text-align: left;
          cursor: pointer;
          transition: all 150ms ease;
          text-decoration: none;
        }

        .nav-link:hover {
          background-color: var(--primary-700);
          color: var(--white);
        }

        .nav-link-active {
          background-color: var(--primary-600);
          color: var(--white);
          border-right: 3px solid var(--primary-300);
        }

        .nav-icon {
          font-size: 1rem;
          width: 20px;
          text-align: center;
        }

        .nav-label {
          flex: 1;
        }

        .sidebar-footer {
          padding: var(--spacing-lg);
          border-top: 1px solid var(--primary-700);
        }

        .version-text,
        .company-text {
          font-size: 0.75rem;
          color: var(--primary-400);
          margin: 0;
          text-align: center;
        }

        .company-text {
          margin-top: var(--spacing-xs);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Sidebar