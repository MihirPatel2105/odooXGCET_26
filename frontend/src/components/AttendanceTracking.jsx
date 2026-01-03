import { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/api'
import './AttendanceTracking.css'

const AttendanceTracking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await attendanceAPI.getByDate(dateStr)
      setAttendanceRecords(response.attendance || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching attendance:', err)
      setError(err.message)
      setAttendanceRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatWorkHours = (workHours) => {
    if (!workHours && workHours !== 0) return '-'
    const hours = Math.floor(workHours)
    const minutes = Math.round((workHours % 1) * 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const formatExtraHours = (extraHours) => {
    if (!extraHours && extraHours !== 0) return '00:00'
    const hours = Math.floor(extraHours)
    const minutes = Math.round((extraHours % 1) * 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-'
    const diff = new Date(checkOut) - new Date(checkIn)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const filteredRecords = attendanceRecords.filter(record => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      record.employeeId?.fullName?.toLowerCase().includes(searchLower) ||
      record.employeeId?.employeeCode?.toLowerCase().includes(searchLower) ||
      record.employeeId?.department?.toLowerCase().includes(searchLower)
    )
  })

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
        <h2 className="attendance-title">Attendance</h2>
        <input
          type="text"
          className="attendance-search"
          placeholder="Searchbar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
        <button className="day-btn">Day</button>
      </div>

      {/* Date Display */}
      <div className="current-date">
        {formatDate(selectedDate)}
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-container">
        {error && (
          <div className="error-message">
            <p>Error loading attendance: {error}</p>
          </div>
        )}

        {!error && filteredRecords.length === 0 && (
          <div className="empty-state">
            <p>No attendance records found for this date</p>
          </div>
        )}

        {!error && filteredRecords.length > 0 && (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Emp</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record._id}>
                  <td className="employee-cell">
                    <div className="employee-info">
                      <span className="employee-name">
                        {record.employeeId?.fullName || '[Employee]'}
                      </span>
                      <span className="employee-code">
                        {record.employeeId?.employeeCode || ''}
                      </span>
                    </div>
                  </td>
                  <td>{formatTime(record.checkIn)}</td>
                  <td>{formatTime(record.checkOut)}</td>
                  <td>{record.workHours ? formatWorkHours(record.workHours) : calculateWorkHours(record.checkIn, record.checkOut)}</td>
                  <td>{record.extraHours ? formatExtraHours(record.extraHours) : '00:00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AttendanceTracking
