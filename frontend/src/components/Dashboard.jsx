import { useState } from 'react'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showCheckInOut, setShowCheckInOut] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState('')

  // Mock employee data with status indicators
  const employees = [
    {
      id: 1,
      name: 'Attractive Walrus',
      department: 'Engineering',
      position: 'Senior Developer',
      email: 'a.walrus@company.com',
      phone: '+1 234-567-8901',
      avatar: 'AW',
      status: 'present',
      color: '#4ade80'
    },
    {
      id: 2,
      name: 'Pleased Zebra',
      department: 'Marketing',
      position: 'Marketing Manager',
      email: 'p.zebra@company.com',
      phone: '+1 234-567-8902',
      avatar: 'PZ',
      status: 'present',
      color: '#fb923c'
    },
    {
      id: 3,
      name: 'Calm Dove',
      department: 'HR',
      position: 'HR Specialist',
      email: 'c.dove@company.com',
      phone: '+1 234-567-8903',
      avatar: 'CD',
      status: 'present',
      color: '#60a5fa'
    },
    {
      id: 4,
      name: 'Green Nightingale',
      department: 'Finance',
      position: 'Financial Analyst',
      email: 'g.nightingale@company.com',
      phone: '+1 234-567-8904',
      avatar: 'GN',
      status: 'present',
      color: '#34d399'
    },
    {
      id: 5,
      name: 'Jenilor',
      department: 'Engineering',
      position: 'Full Stack Developer',
      email: 'jenilor@company.com',
      phone: '+1 234-567-8905',
      avatar: 'JE',
      status: 'present',
      color: '#a78bfa'
    },
    {
      id: 6,
      name: 'Green Rhinoceros',
      department: 'Sales',
      position: 'Sales Executive',
      email: 'g.rhinoceros@company.com',
      phone: '+1 234-567-8906',
      avatar: 'GR',
      status: 'present',
      color: '#22c55e'
    },
    {
      id: 7,
      name: 'Striking Antelope',
      department: 'Operations',
      position: 'Operations Manager',
      email: 's.antelope@company.com',
      phone: '+1 234-567-8907',
      avatar: 'SA',
      status: 'present',
      color: '#f59e0b'
    },
    {
      id: 8,
      name: 'Swift Eagle',
      department: 'Engineering',
      position: 'DevOps Engineer',
      email: 's.eagle@company.com',
      phone: '+1 234-567-8908',
      avatar: 'SE',
      status: 'on-leave',
      color: '#3b82f6'
    },
    {
      id: 9,
      name: 'Bright Falcon',
      department: 'Marketing',
      position: 'Content Writer',
      email: 'b.falcon@company.com',
      phone: '+1 234-567-8909',
      avatar: 'BF',
      status: 'absent',
      color: '#ef4444'
    }
  ]

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get status icon and color
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'present':
        return { icon: '●', color: '#22c55e', tooltip: 'Employee is present in the office' }
      case 'on-leave':
        return { icon: '✈', color: '#3b82f6', tooltip: 'Employee is on leave' }
      case 'absent':
        return { icon: '●', color: '#eab308', tooltip: 'Employee is absent (has not applied time off)' }
      default:
        return { icon: '●', color: '#9ca3af', tooltip: 'Status unknown' }
    }
  }

  // Handle employee card click
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee)
  }

  // Close employee detail modal
  const closeEmployeeDetail = () => {
    setSelectedEmployee(null)
  }

  // Handle Check In
  const handleCheckIn = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    setCheckInTime(timeString)
    setIsCheckedIn(true)
    setShowCheckInOut(false)
  }

  // Handle Check Out
  const handleCheckOut = () => {
    setIsCheckedIn(false)
    setCheckInTime('')
    setShowCheckInOut(false)
  }

  return (
    <div className="employee-dashboard">
      {/* Header with Search and New Button */}
      <div className="employee-dashboard-header">
        <button className="btn-new">NEW</button>
        
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search..."
            className="employee-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Employee Grid */}
      <div className="employee-grid">
        {filteredEmployees.map((employee) => {
          const statusInfo = getStatusIndicator(employee.status)
          return (
            <div
              key={employee.id}
              className="employee-card"
              onClick={() => handleEmployeeClick(employee)}
              title="Click to view employee details"
            >
              <div className="employee-card-content">
                {/* Avatar */}
                <div 
                  className="employee-avatar"
                  style={{ backgroundColor: employee.color }}
                >
                  {employee.avatar}
                </div>

                {/* Employee Name */}
                <div className="employee-name">{employee.name}</div>

                {/* Status Indicator */}
                <div 
                  className="employee-status-indicator"
                  style={{ color: statusInfo.color }}
                  title={statusInfo.tooltip}
                >
                  {statusInfo.icon}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Check In/Out Floating Button */}
      <button 
        className="check-inout-fab"
        onClick={() => setShowCheckInOut(!showCheckInOut)}
        title="Check In/Out"
      >
        <span className="fab-icon">✓</span>
      </button>

      {/* Check In/Out Panel */}
      {showCheckInOut && (
        <div className="check-inout-panel">
          <h3 className="panel-title">Attendance</h3>
          
          {!isCheckedIn ? (
            <div className="check-in-section">
              <button 
                className="btn-check-in"
                onClick={handleCheckIn}
              >
                Check In →
              </button>
            </div>
          ) : (
            <div className="check-out-section">
              <div className="check-time">
                <span className="time-label">Since</span>
                <span className="time-value">{checkInTime}</span>
              </div>
              <button 
                className="btn-check-out"
                onClick={handleCheckOut}
              >
                Check Out →
              </button>
            </div>
          )}

          <p className="panel-note">
            Employees can mark their attendance using the Check In/Check Out system, 
            and users can view their attendance records through the Attendance module.
          </p>
        </div>
      )}

      {/* Employee Detail Modal (View-Only) */}
      {selectedEmployee && (
        <div className="modal-overlay" onClick={closeEmployeeDetail}>
          <div className="modal-content employee-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Employee Information</h2>
              <button className="modal-close" onClick={closeEmployeeDetail}>✕</button>
            </div>

            <div className="modal-body">
              <div className="employee-detail-header">
                <div 
                  className="employee-detail-avatar"
                  style={{ backgroundColor: selectedEmployee.color }}
                >
                  {selectedEmployee.avatar}
                </div>
                <div className="employee-detail-info">
                  <h3>{selectedEmployee.name}</h3>
                  <p className="employee-position">{selectedEmployee.position}</p>
                  <div className="employee-status-badge">
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusIndicator(selectedEmployee.status).color }}
                    ></span>
                    <span className="status-text">
                      {selectedEmployee.status === 'present' ? 'Present' :
                       selectedEmployee.status === 'on-leave' ? 'On Leave' : 'Absent'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="employee-detail-section">
                <h4>Contact Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedEmployee.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedEmployee.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedEmployee.department}</span>
                </div>
              </div>

              <div className="modal-note">
                <strong>Note:</strong> This is a view-only mode. To edit employee information, 
                please navigate to the Employee Management section.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
