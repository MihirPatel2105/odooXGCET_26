import { useState, useEffect } from 'react'
import { attendanceAPI, leaveAPI } from '../../services/api'
import './EmployeeStyles.css'

const EmployeeDashboard = ({ user }) => {
  const [showCheckInOut, setShowCheckInOut] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState('')
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [recentAttendance, setRecentAttendance] = useState([])
  const [leaveBalance, setLeaveBalance] = useState({
    paid: 12,
    sick: 10,
    unpaid: 5
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data on mount and when component becomes visible
  useEffect(() => {
    fetchDashboardData()
    
    // Also set up an interval to refresh status every 30 seconds
    const intervalId = setInterval(() => {
      checkTodayAttendance()
    }, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        checkTodayAttendance(),
        fetchRecentAttendance(),
        fetchLeaveBalance()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaveBalance = async () => {
    try {
      const response = await leaveAPI.getBalance()
      if (response.success && response.balance) {
        setLeaveBalance({
          paid: response.balance.paidLeave || 0,
          sick: response.balance.sickLeave || 0,
          unpaid: response.balance.unpaidLeave || 0
        })
      }
    } catch (error) {
      console.error('Error fetching leave balance:', error)
      // Keep default values if API fails
    }
  }

  const checkTodayAttendance = async () => {
    try {
      const today = new Date()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      const response = await attendanceAPI.getSelf(month, year)
      
      if (response.success && response.attendance && response.attendance.length > 0) {
        // Find today's attendance
        const todayStr = today.toISOString().split('T')[0]
        const todayRecord = response.attendance.find(att => {
          const attDate = new Date(att.date).toISOString().split('T')[0]
          return attDate === todayStr
        })
        
        if (todayRecord) {
          console.log('Today\'s attendance record:', todayRecord)
          setTodayAttendance(todayRecord)
          // Check if checked in but NOT checked out yet
          if (todayRecord.checkIn && !todayRecord.checkOut) {
            console.log('Setting checked in: true')
            setIsCheckedIn(true)
            const checkInDate = new Date(todayRecord.checkIn)
            const timeString = checkInDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
            setCheckInTime(timeString)
          } else if (todayRecord.checkIn && todayRecord.checkOut) {
            // Already checked out - show completed status
            console.log('Already checked out')
            setIsCheckedIn(false)
            setCheckInTime('')
          }
        } else {
          console.log('No attendance record for today')
          setIsCheckedIn(false)
          setCheckInTime('')
        }
      } else {
        console.log('No attendance data')
        setIsCheckedIn(false)
        setCheckInTime('')
      }
    } catch (error) {
      console.error('Error checking attendance:', error)
    }
  }

  const fetchRecentAttendance = async () => {
    try {
      const today = new Date()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      const response = await attendanceAPI.getSelf(month, year)
      
      console.log('Dashboard - Attendance response:', response)
      
      if (response.success && response.attendance) {
        // Sort by date descending and get last 7 days
        const sorted = response.attendance
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7)
        console.log('Dashboard - Recent attendance records:', sorted)
        setRecentAttendance(sorted)
      }
    } catch (error) {
      console.error('Error fetching recent attendance:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      const response = await attendanceAPI.checkIn()
      if (response.success) {
        setIsCheckedIn(true)
        const now = new Date()
        setCheckInTime(now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }))
        setShowCheckInOut(false)
        await checkTodayAttendance()
        alert(response.message || 'Check-in successful!')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      alert(error.message || 'Failed to check in. Please try again.')
    }
  }

  const handleCheckOut = async () => {
    try {
      const response = await attendanceAPI.checkOut()
      if (response.success) {
        setIsCheckedIn(false)
        setCheckInTime('')
        setShowCheckInOut(false)
        await checkTodayAttendance()
        alert(response.message || 'Check-out successful!')
      }
    } catch (error) {
      console.error('Error checking out:', error)
      alert(error.message || 'Failed to check out. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    } catch (error) {
      return '-'
    }
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-'
    try {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return '-'
      
      const diff = checkOutDate - checkInDate
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m`
    } catch (error) {
      return '-'
    }
  }

  if (loading) {
    return (
      <div className="employee-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="employee-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, {user?.name || 'Employee'}!</h1>
          <p className="welcome-subtitle">Here's your overview for today</p>
        </div>
        <div className="attendance-action">
          {!isCheckedIn ? (
            <button 
              className="btn-check-in"
              onClick={handleCheckIn}
            >
              <span className="check-icon">→</span>
              Check In
            </button>
          ) : (
            <div className="checked-in-status">
              <div className="status-badge">
                <span className="status-dot"></span>
                Checked In at {checkInTime}
              </div>
              <button 
                className="btn-check-out"
                onClick={handleCheckOut}
              >
                Check Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-content">
            <p className="stat-label">Days Present</p>
            <p className="stat-value">{recentAttendance.length}</p>
            <p className="stat-subtitle">This month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div className="stat-content">
            <p className="stat-label">On Time</p>
            <p className="stat-value">{recentAttendance.filter(a => a.status === 'PRESENT').length}</p>
            <p className="stat-subtitle">Last 7 days</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🏖️</div>
          <div className="stat-content">
            <p className="stat-label">Leave Balance</p>
            <p className="stat-value">{leaveBalance.paid}</p>
            <p className="stat-subtitle">Paid days available</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">⏱️</div>
          <div className="stat-content">
            <p className="stat-label">Work Hours</p>
            <p className="stat-value">
              {todayAttendance && todayAttendance.checkIn 
                ? calculateWorkHours(todayAttendance.checkIn, todayAttendance.checkOut || new Date())
                : '0h 0m'}
            </p>
            <p className="stat-subtitle">Today</p>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Attendance</h2>
        </div>
        <div className="card">
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>{formatDate(record.date)}</td>
                      <td>{formatTime(record.checkIn)}</td>
                      <td>{formatTime(record.checkOut)}</td>
                      <td>{calculateWorkHours(record.checkIn, record.checkOut)}</td>
                      <td>
                        <span className={`status-badge ${record.status?.toLowerCase()}`}>
                          {record.status || 'PRESENT'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>Request Leave</h3>
            <p>Apply for time off</p>
          </div>
          <div className="action-card">
            <div className="action-icon">💰</div>
            <h3>View Payslip</h3>
            <p>Check salary details</p>
          </div>
          <div className="action-card">
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>View your information</p>
          </div>
          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Reports</h3>
            <p>Access your reports</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
