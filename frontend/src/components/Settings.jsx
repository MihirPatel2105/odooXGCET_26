import { useState } from 'react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Dayflow+ Technologies',
      companyEmail: 'hr@dayflowplus.com',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Business Ave, Suite 100, New York, NY 10001',
      timeZone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'English'
    },
    attendance: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workStartTime: '09:00',
      workEndTime: '17:00',
      breakDuration: '60',
      allowEarlyCheckIn: '30',
      allowLateCheckOut: '60',
      requireLocationCheck: true,
      autoClockOut: true
    },
    payroll: {
      payrollFrequency: 'monthly',
      payrollDay: '1',
      overtimeRate: '1.5',
      taxCalculation: 'automatic',
      currencySymbol: '$',
      minimumWage: '15.00',
      defaultDeductions: '5.0',
      bonusCalculation: 'performance'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      attendanceAlerts: true,
      payrollNotifications: true,
      leaveRequestNotifications: true,
      reportReadyNotifications: true,
      maintenanceNotifications: true
    },
    security: {
      passwordExpiry: '90',
      sessionTimeout: '60',
      twoFactorAuth: false,
      loginAttempts: '3',
      dataBackup: 'daily',
      encryptionLevel: 'AES-256',
      auditLogging: true,
      ipWhitelisting: false
    }
  })

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'attendance', label: 'Attendance', icon: '🕐' },
    { id: 'payroll', label: 'Payroll', icon: '💰' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ]

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    // Simulate API call
    setShowSaveConfirmation(true)
    setTimeout(() => {
      setShowSaveConfirmation(false)
    }, 3000)
  }

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2 className="section-title">General Settings</h2>
        <p className="section-description">Configure basic company information and system preferences</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-input"
            value={settings.general.companyName}
            onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Email</label>
          <input
            type="email"
            className="form-input"
            value={settings.general.companyEmail}
            onChange={(e) => handleSettingChange('general', 'companyEmail', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Phone</label>
          <input
            type="tel"
            className="form-input"
            value={settings.general.companyPhone}
            onChange={(e) => handleSettingChange('general', 'companyPhone', e.target.value)}
          />
        </div>

        <div className="form-group span-2">
          <label className="form-label">Company Address</label>
          <textarea
            className="form-textarea"
            rows="3"
            value={settings.general.companyAddress}
            onChange={(e) => handleSettingChange('general', 'companyAddress', e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Time Zone</label>
          <select
            className="form-select"
            value={settings.general.timeZone}
            onChange={(e) => handleSettingChange('general', 'timeZone', e.target.value)}
          >
            <option value="America/New_York">Eastern Time (EST/EDT)</option>
            <option value="America/Chicago">Central Time (CST/CDT)</option>
            <option value="America/Denver">Mountain Time (MST/MDT)</option>
            <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date Format</label>
          <select
            className="form-select"
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            className="form-select"
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            className="form-select"
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAttendanceSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2 className="section-title">Attendance Settings</h2>
        <p className="section-description">Configure attendance tracking and working hours</p>
      </div>

      <div className="form-grid">
        <div className="form-group span-2">
          <label className="form-label">Working Days</label>
          <div className="checkbox-group">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <label key={day} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.attendance.workingDays.includes(day)}
                  onChange={(e) => {
                    const workingDays = e.target.checked
                      ? [...settings.attendance.workingDays, day]
                      : settings.attendance.workingDays.filter(d => d !== day)
                    handleSettingChange('attendance', 'workingDays', workingDays)
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Work Start Time</label>
          <input
            type="time"
            className="form-input"
            value={settings.attendance.workStartTime}
            onChange={(e) => handleSettingChange('attendance', 'workStartTime', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Work End Time</label>
          <input
            type="time"
            className="form-input"
            value={settings.attendance.workEndTime}
            onChange={(e) => handleSettingChange('attendance', 'workEndTime', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Break Duration (minutes)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            max="180"
            value={settings.attendance.breakDuration}
            onChange={(e) => handleSettingChange('attendance', 'breakDuration', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Allow Early Check-in (minutes)</label>
          <input
            type="number"
            className="form-input"
            min="0"
            max="120"
            value={settings.attendance.allowEarlyCheckIn}
            onChange={(e) => handleSettingChange('attendance', 'allowEarlyCheckIn', e.target.value)}
          />
        </div>

        <div className="form-group span-2">
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.attendance.requireLocationCheck}
                onChange={(e) => handleSettingChange('attendance', 'requireLocationCheck', e.target.checked)}
              />
              <span className="toggle-text">Require location verification for check-in/out</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.attendance.autoClockOut}
                onChange={(e) => handleSettingChange('attendance', 'autoClockOut', e.target.checked)}
              />
              <span className="toggle-text">Automatically clock out employees at end of day</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2 className="section-title">Notification Settings</h2>
        <p className="section-description">Manage notification preferences and alerts</p>
      </div>

      <div className="notification-categories">
        <div className="category-section">
          <h3 className="category-title">Delivery Methods</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              />
              <span className="toggle-text">Email Notifications</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
              />
              <span className="toggle-text">SMS Notifications</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
              />
              <span className="toggle-text">Push Notifications</span>
            </label>
          </div>
        </div>

        <div className="category-section">
          <h3 className="category-title">Alert Types</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.attendanceAlerts}
                onChange={(e) => handleSettingChange('notifications', 'attendanceAlerts', e.target.checked)}
              />
              <span className="toggle-text">Attendance Alerts</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.payrollNotifications}
                onChange={(e) => handleSettingChange('notifications', 'payrollNotifications', e.target.checked)}
              />
              <span className="toggle-text">Payroll Notifications</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.leaveRequestNotifications}
                onChange={(e) => handleSettingChange('notifications', 'leaveRequestNotifications', e.target.checked)}
              />
              <span className="toggle-text">Leave Request Notifications</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.reportReadyNotifications}
                onChange={(e) => handleSettingChange('notifications', 'reportReadyNotifications', e.target.checked)}
              />
              <span className="toggle-text">Report Ready Notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'attendance':
        return renderAttendanceSettings()
      case 'notifications':
        return renderNotificationsSettings()
      default:
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2 className="section-title">Coming Soon</h2>
              <p className="section-description">
                {tabs.find(tab => tab.id === activeTab)?.label} settings will be available in a future update.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="settings">
      {/* Header */}
      <div className="page-header card">
        <div className="header-content">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Configure system settings and preferences</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>🔄</span>
              Reset to Defaults
            </button>
            <button className="btn btn-primary" onClick={handleSaveSettings}>
              <span>💾</span>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div className="save-notification">
          <div className="notification-content">
            <span className="notification-icon">✅</span>
            <span className="notification-text">Settings saved successfully!</span>
          </div>
        </div>
      )}

      {/* Settings Layout */}
      <div className="settings-layout">
        {/* Tabs Navigation */}
        <div className="settings-sidebar">
          <div className="tabs-container">
            <h3 className="tabs-title">Settings Categories</h3>
            <div className="tabs-list">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          <div className="content-card card">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings {
          padding: 0;
        }

        .page-header {
          margin-bottom: var(--spacing-xl);
        }

        .header-content {
          padding: var(--spacing-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: var(--font-weight-bold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .page-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .save-notification {
          position: fixed;
          top: var(--spacing-xl);
          right: var(--spacing-xl);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .notification-content {
          background-color: var(--primary-600);
          color: var(--white);
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .notification-icon {
          font-size: 1.125rem;
        }

        .notification-text {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--spacing-xl);
        }

        .settings-sidebar {
          background-color: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          height: fit-content;
          position: sticky;
          top: var(--spacing-xl);
        }

        .tabs-title {
          font-size: 1rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-md) 0;
        }

        .tabs-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border: none;
          border-radius: var(--radius-md);
          background: none;
          color: var(--gray-700);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 150ms ease;
          text-align: left;
          width: 100%;
        }

        .tab-item:hover {
          background-color: var(--primary-50);
          color: var(--primary-700);
        }

        .tab-item.active {
          background-color: var(--primary-600);
          color: var(--white);
        }

        .tab-icon {
          font-size: 1.125rem;
          width: 24px;
        }

        .tab-label {
          flex: 1;
        }

        .settings-content {
          min-height: 500px;
        }

        .content-card {
          padding: var(--spacing-xl);
        }

        .settings-section {
          max-width: none;
        }

        .section-header {
          margin-bottom: var(--spacing-xl);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .section-description {
          font-size: 1rem;
          color: var(--gray-600);
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .form-group.span-2 {
          grid-column: 1 / -1;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-md);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.875rem;
          color: var(--gray-700);
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          accent-color: var(--primary-600);
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          font-size: 0.875rem;
          color: var(--gray-700);
          cursor: pointer;
        }

        .toggle-label input[type="checkbox"] {
          accent-color: var(--primary-600);
          transform: scale(1.1);
        }

        .toggle-text {
          flex: 1;
        }

        .notification-categories {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
        }

        .category-section {
          padding: var(--spacing-lg);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background-color: var(--gray-50);
        }

        .category-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-lg) 0;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            position: static;
            order: 1;
          }

          .settings-content {
            order: 0;
          }

          .tabs-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: var(--spacing-sm);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-lg);
          }

          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .notification-categories {
            grid-template-columns: 1fr;
          }

          .checkbox-group {
            grid-template-columns: 1fr;
          }

          .save-notification {
            right: var(--spacing-md);
            left: var(--spacing-md);
          }

          .notification-content {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default Settings