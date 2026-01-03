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

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved'
      case 'rejected':
        return 'status-rejected'
      case 'pending':
        return 'status-pending'
      default:
        return ''
    }
  }

  // Calculate statistics
  const stats = {
    total: timeOffRequests.length,
    pending: timeOffRequests.filter(r => r.status === 'pending').length,
    approved: timeOffRequests.filter(r => r.status === 'approved').length,
    rejected: timeOffRequests.filter(r => r.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="time-off">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading leave requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="time-off">
      {/* Header */}
      <div className="time-off-header">
        <div className="header-left">
          <h2 className="page-title">My Time Off Requests</h2>
          <p className="page-subtitle">Manage your leave applications</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowNewModal(true)}
        >
          + New Request
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
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
      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="table-container">
          {error && (
            <div className="error-message">
              <p>Error loading requests: {error}</p>
            </div>
          )}

          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <p>No leave requests found</p>
            </div>
          ) : (
            <table className="data-table">
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
                      <span className={`status-badge ${getStatusClass(request.status)}`}>
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
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Leave Request</h3>
              <button 
                className="modal-close"
                onClick={() => setShowNewModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Leave Type *</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  required
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    min={formData.startDate}
                    required
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="days-info">
                  Total Days: {calculateDays(formData.startDate, formData.endDate)}
                </div>
              )}

              <div className="form-group">
                <label>Reason *</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Explain why you need this leave..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
