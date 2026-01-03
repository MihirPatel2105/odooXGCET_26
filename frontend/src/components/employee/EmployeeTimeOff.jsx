import { useState, useEffect } from 'react'
import { leaveAPI } from '../../services/api'
import './EmployeeStyles.css'

const EmployeeTimeOff = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showNewModal, setShowNewModal] = useState(false)
  const [timeOffRequests, setTimeOffRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    leaveType: 'PAID',
    startDate: '',
    endDate: '',
    reason: ''
  })

  useEffect(() => {
    fetchMyTimeOffRequests()
  }, [])

  const fetchMyTimeOffRequests = async () => {
    try {
      setLoading(true)
      const response = await leaveAPI.getSelf()
      if (response.success && response.leaves) {
        // Transform and show only employee's own requests
        const transformedRequests = response.leaves.map(leave => ({
          id: leave._id,
          startDate: new Date(leave.fromDate).toLocaleDateString('en-GB'),
          endDate: new Date(leave.toDate).toLocaleDateString('en-GB'),
          timeOffType: leave.leaveType === 'SICK' ? 'Sick Leave' : 
                       leave.leaveType === 'PAID' ? 'Paid Leave' : 'Unpaid Leave',
          leaveType: leave.leaveType,
          reason: leave.reason || 'No reason provided',
          status: leave.status.toLowerCase(),
          days: leave.totalDays || 1,
          adminComment: leave.adminComment || ''
        }))
        setTimeOffRequests(transformedRequests)
      } else {
        setTimeOffRequests([])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching time off requests:', err)
      setError(err.message)
      setTimeOffRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const requestData = {
        leaveType: formData.leaveType,
        fromDate: formData.startDate,
        toDate: formData.endDate,
        reason: formData.reason
      }

      const response = await leaveAPI.create(requestData)
      if (response.success) {
        alert('Leave request submitted successfully!')
        setShowNewModal(false)
        setFormData({
          leaveType: 'PAID',
          startDate: '',
          endDate: '',
          reason: ''
        })
        fetchMyTimeOffRequests()
      }
    } catch (err) {
      console.error('Error submitting request:', err)
      alert('Failed to submit leave request')
    }
  }

  const calculateDays = (start, end) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  // Filter requests
  const filteredRequests = timeOffRequests.filter(req => {
    const matchesSearch = req.timeOffType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.reason.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || req.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  // Calculate statistics
  const stats = {
    total: timeOffRequests.length,
    pending: timeOffRequests.filter(r => r.status === 'pending').length,
    approved: timeOffRequests.filter(r => r.status === 'approved').length,
    rejected: timeOffRequests.filter(r => r.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="attendance-tracking">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading leave requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="attendance-tracking">
      {/* Header */}
      <div className="attendance-header">
        <h2 className="attendance-title">My Time Off Requests</h2>
        <button 
          className="btn-check-in"
          onClick={() => setShowNewModal(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          + New Request
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Total Requests</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Approved</p>
            <p className="stat-value" style={{ color: '#22c55e' }}>{stats.approved}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <p className="stat-label">Rejected</p>
            <p className="stat-value" style={{ color: '#ef4444' }}>{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="date-navigation" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '0.75rem 1rem', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '0.95rem'
          }}
        />
        <div className="view-buttons">
          <button 
            className={`day-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
          <button 
            className={`day-btn ${selectedFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`day-btn ${selectedFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`day-btn ${selectedFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="attendance-table-container">
        {error && (
          <div className="error-message" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fee', color: '#c00', borderRadius: '8px' }}>
            <p>Error loading requests: {error}</p>
          </div>
        )}

        {filteredRequests.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <p>No leave requests found</p>
          </div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <span className="leave-type-badge">
                      {request.timeOffType}
                    </span>
                  </td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.days} days</td>
                  <td className="reason-cell">{request.reason}</td>
                  <td>
                    <span className={`status-badge-attendance ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="comment-cell">
                    {request.adminComment || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="leave-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="leave-modal-header">
              <div className="modal-title-section">
                <div className="modal-icon">📝</div>
                <div>
                  <h3 className="modal-title-main">Request Time Off</h3>
                  <p className="modal-subtitle">Submit your leave request for approval</p>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setShowNewModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="leave-form">
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Leave Type</span>
                  <span className="required-mark">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    value={formData.leaveType}
                    onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                    required
                  >
                    <option value="PAID">🌴 Paid Leave</option>
                    <option value="SICK">🏥 Sick Leave</option>
                    <option value="UNPAID">📋 Unpaid Leave</option>
                  </select>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">Start Date</span>
                    <span className="required-mark">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>
                    <input
                      type="date"
                      className="form-input with-icon"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <label className="form-label">
                    <span className="label-text">End Date</span>
                    <span className="required-mark">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>
                    <input
                      type="date"
                      className="form-input with-icon"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="duration-display">
                  <div className="duration-icon">⏱️</div>
                  <div className="duration-text">
                    <span className="duration-label">Duration:</span>
                    <span className="duration-value">{calculateDays(formData.startDate, formData.endDate)} days</span>
                  </div>
                </div>
              )}

              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Reason for Leave</span>
                  <span className="required-mark">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Please provide a detailed reason for your leave request..."
                  rows="4"
                  required
                  maxLength={500}
                />
                <div className="char-count">
                  {formData.reason.length}/500 characters
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <span>✓</span>
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeTimeOff
