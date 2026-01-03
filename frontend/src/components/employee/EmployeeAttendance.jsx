import { useState, useEffect } from 'react'
import { attendanceAPI } from '../../services/api'
import '../../components/AttendanceTracking.css'

const EmployeeAttendance = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState('monthly')
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    totalHours: 0
  })

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate, selectedView])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      
      // Get current month and year for employee's own attendance
      const month = selectedDate.getMonth() + 1
      const year = selectedDate.getFullYear()
      const response = await attendanceAPI.getSelf(month, year)
      
      console.log('Attendance API response:', response)
      
      if (response.success) {
        const filtered = filterByView(response.attendance || [])
        console.log('Filtered attendance records:', filtered)
        setAttendanceRecords(filtered)
        calculateStats(filtered)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching attendance:', err)
      setError(err.message)
      setAttendanceRecords([])
    } finally {
      setLoading(false)
    }
  }

  const filterByView = (records) => {
    const now = new Date()
    return records.filter(record => {
      const recordDate = new Date(record.date)
      
      if (selectedView === 'weekly') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return recordDate >= weekAgo && recordDate <= now
      } else if (selectedView === 'monthly') {
        return recordDate.getMonth() === now.getMonth() && 
               recordDate.getFullYear() === now.getFullYear()
      }
      return true
    })
  }

  const calculateStats = (records) => {
    const stats = {
      totalDays: records.length,
      present: records.filter(r => r.status === 'PRESENT').length,
      absent: records.filter(r => r.status === 'ABSENT').length,
      totalHours: records.reduce((sum, r) => {
        if (r.checkIn && r.checkOut) {
          const hours = (new Date(r.checkOut) - new Date(r.checkIn)) / (1000 * 60 * 60)
          return sum + hours
        }
        return sum
      }, 0)
    }
    setStats(stats)
  }

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate)
    if (selectedView === 'daily') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (selectedView === 'weekly') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setSelectedDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    if (selectedView === 'daily') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (selectedView === 'weekly') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
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
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    } catch (error) {
      return '-'
    }
  }

  const calculateExtraHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '00:00'
    try {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return '00:00'
      
      const diff = checkOutDate - checkInDate
      const totalHours = diff / (1000 * 60 * 60)
      const standardHours = 8
      const extraHours = Math.max(0, totalHours - standardHours)
      const hours = Math.floor(extraHours)
      const minutes = Math.floor((extraHours % 1) * 60)
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    } catch (error) {
      return '00:00'
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    try {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      if (isNaN(date.getTime())) return '-'
      return date.toLocaleDateString('en-US', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      return '-'
    }
  }

  const getViewLabel = () => {
    if (selectedView === 'daily') {
      return formatDate(selectedDate)
    } else if (selectedView === 'weekly') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(weekStart.getDate() - 7)
      return `${formatDate(weekStart)} - ${formatDate(selectedDate)}`
    } else {
      return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="attendance-tracking">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading attendance records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="attendance-tracking">
      {/* Header Section */}
      <div className="attendance-header">
        <h2 className="attendance-title">My Attendance</h2>
      </div>

      {/* Stats Cards */}
      {selectedView !== 'daily' && (
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Total Days</p>
              <p className="stat-value">{stats.totalDays}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Present</p>
              <p className="stat-value">{stats.present}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Absent</p>
              <p className="stat-value">{stats.absent}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Total Hours</p>
              <p className="stat-value">{Math.round(stats.totalHours)}h</p>
            </div>
          </div>
        </div>
      )}

      {/* Date Navigation */}
      <div className="date-navigation">
        <button className="nav-btn" onClick={handlePreviousDay}>
          ←
        </button>
        <button className="nav-btn" onClick={handleNextDay}>
          →
        </button>
        <div className="date-selector">
          <button className="date-dropdown">
            Date ∨
          </button>
          <input
            type="date"
            className="date-input-hidden"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
        <div className="view-buttons">
          <button 
            className={`day-btn ${selectedView === 'daily' ? 'active' : ''}`}
            onClick={() => setSelectedView('daily')}
          >
            Day
          </button>
          <button 
            className={`day-btn ${selectedView === 'weekly' ? 'active' : ''}`}
            onClick={() => setSelectedView('weekly')}
          >
            Week
          </button>
          <button 
            className={`day-btn ${selectedView === 'monthly' ? 'active' : ''}`}
            onClick={() => setSelectedView('monthly')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Date Display */}
      <div className="current-date">
        {getViewLabel()}
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-container">
        {error && (
          <div className="error-message">
            <p>Error loading attendance: {error}</p>
          </div>
        )}

        {attendanceRecords.length === 0 ? (
          <div className="empty-state">
            <p>No attendance records found for this period</p>
          </div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{formatDate(record.date)}</td>
                  <td className="time-cell">{formatTime(record.checkIn)}</td>
                  <td className="time-cell">{formatTime(record.checkOut)}</td>
                  <td className="hours-cell">{calculateWorkHours(record.checkIn, record.checkOut)}</td>
                  <td className="hours-cell">{calculateExtraHours(record.checkIn, record.checkOut)}</td>
                  <td>
                    <span className={`status-badge-attendance ${record.status?.toLowerCase() || 'present'}`}>
                      {record.status || 'PRESENT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default EmployeeAttendance
