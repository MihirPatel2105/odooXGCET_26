import { useState, useEffect } from 'react'
import { employeeAPI, attendanceAPI } from '../services/api'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showCheckInOut, setShowCheckInOut] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState('')
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkingAttendance, setCheckingAttendance] = useState(false)

  useEffect(() => {
    fetchEmployees()
    checkTodayAttendance()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeeAPI.getAll()
      if (response.success && response.employees) {
        // Transform backend data to match component structure
        const transformedEmployees = response.employees.map((emp, index) => ({
          id: emp._id,
          name: emp.fullName || 'N/A',
          employeeCode: emp.employeeCode || 'N/A',
          department: emp.department || 'N/A',
          position: emp.designation || 'N/A',
          email: emp.userId?.email || 'N/A',
          phone: emp.phone || 'N/A',
          joiningDate: emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
          address: emp.address || 'N/A',
          profileImage: emp.profileImage || null,
          avatar: (emp.fullName || 'NA').split(' ').map(n => n[0]).join('').toUpperCase(),
          status: emp.status === 'ACTIVE' ? 'present' : 'absent',
          color: getRandomColor(index)
        }))
        setEmployees(transformedEmployees)
      } else {
        setEmployees([])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError(err.message)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await attendanceAPI.getByDate(today)
      if (response.success && response.attendance) {
        const userAttendance = response.attendance[0]
        if (userAttendance && userAttendance.checkIn) {
          setIsCheckedIn(true)
          const checkInDate = new Date(userAttendance.checkIn)
          const timeString = checkInDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
          setCheckInTime(timeString)
        }
      }
    } catch (err) {
      console.error('Error checking attendance:', err)
    }
  }

  const getRandomColor = (index) => {
    const colors = [
      '#4ade80', '#fb923c', '#60a5fa', '#34d399', '#a78bfa',
      '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'
    ]
    return colors[index % colors.length]
  }

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
  const handleCheckIn = async () => {
    try {
      setCheckingAttendance(true)
      const response = await attendanceAPI.checkIn()
      
      if (response.success) {
        const now = new Date()
        const timeString = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
        setCheckInTime(timeString)
        setIsCheckedIn(true)
        setShowCheckInOut(false)
        alert('Check-in successful!')
      } else {
        alert(response.message || 'Check-in failed')
      }
    } catch (error) {
      console.error('Check-in error:', error)
      alert('Check-in failed. Please try again.')
    } finally {
      setCheckingAttendance(false)
    }
  }

  // Handle Check Out
  const handleCheckOut = async () => {
    try {
      setCheckingAttendance(true)
      const response = await attendanceAPI.checkOut()
      
      if (response.success) {
        setIsCheckedIn(false)
        setCheckInTime('')
        setShowCheckInOut(false)
        alert('Check-out successful!')
      } else {
        alert(response.message || 'Check-out failed')
      }
    } catch (error) {
      console.error('Check-out error:', error)
      alert('Check-out failed. Please try again.')
    } finally {
      setCheckingAttendance(false)
    }
  }

  return (
    <div className="employee-dashboard">
      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <p className="error-message">❌ Error: {error}</p>
          <button className="btn btn-primary" onClick={fetchEmployees}>
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
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
                disabled={checkingAttendance}
              >
                {checkingAttendance ? 'Processing...' : 'Check In →'}
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
                disabled={checkingAttendance}
              >
                {checkingAttendance ? 'Processing...' : 'Check Out →'}
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
                  <p className="employee-code">ID: {selectedEmployee.employeeCode}</p>
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

              <div className="employee-details-grid">
                <div className="employee-detail-section">
                  <h4>Contact Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">📧 Email</span>
                    <span className="detail-value">{selectedEmployee.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📱 Phone</span>
                    <span className="detail-value">{selectedEmployee.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Address</span>
                    <span className="detail-value">{selectedEmployee.address}</span>
                  </div>
                </div>

                <div className="employee-detail-section">
                  <h4>Employment Details</h4>
                  <div className="detail-row">
                    <span className="detail-label">� Employee Code</span>
                    <span className="detail-value">{selectedEmployee.employeeCode}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏢 Department</span>
                    <span className="detail-value">{selectedEmployee.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💼 Position</span>
                    <span className="detail-value">{selectedEmployee.position}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📅 Joining Date</span>
                    <span className="detail-value">{selectedEmployee.joiningDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">✅ Status</span>
                    <span className="detail-value">{selectedEmployee.status === 'present' ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              <div className="modal-note">
                <strong>ℹ️ Note:</strong> This is a view-only mode. To edit employee information, 
                please navigate to the Employee Management section.
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}

export default Dashboard