import { useState, useEffect } from 'react'
import { leaveAPI } from '../services/api'

const TimeOff = ({ userRole = 'HR Manager' }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showNewModal, setShowNewModal] = useState(false)
  const [timeOffRequests, setTimeOffRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is admin or HR officer
  const canApprove = userRole === 'HR Manager' || userRole === 'Admin' || userRole === 'ADMIN'

  useEffect(() => {
    fetchTimeOffRequests()
  }, [])

  const fetchTimeOffRequests = async () => {
    try {
      setLoading(true)
      const response = await leaveAPI.getAll()
      if (response.success && response.leaves) {
        // Transform backend data to match component structure
        const transformedRequests = response.leaves.map(leave => ({
          id: leave._id,
          employeeName: leave.employeeId?.fullName || 'Unknown',
          startDate: new Date(leave.startDate).toLocaleDateString('en-GB'),
          endDate: new Date(leave.endDate).toLocaleDateString('en-GB'),
          timeOffType: leave.leaveType === 'SICK' ? 'Sick time Off' : 'Paid time Off',
          status: leave.status.toLowerCase(),
          days: leave.totalDays || 1
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

  // Handle approve
  const handleApprove = async (id) => {
    try {
      const response = await leaveAPI.approve(id)
      if (response.success) {
        setTimeOffRequests(requests =>
          requests.map(req => req.id === id ? { ...req, status: 'approved' } : req)
        )
      }
    } catch (err) {
      console.error('Error approving request:', err)
      alert('Failed to approve request')
    }
  }

  // Handle reject
  const handleReject = async (id) => {
    try {
      const response = await leaveAPI.reject(id)
      if (response.success) {
        setTimeOffRequests(requests =>
          requests.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
        )
      }
    } catch (err) {
      console.error('Error rejecting request:', err)
      alert('Failed to reject request')
    }
  }

  // Filter requests
  const filteredRequests = timeOffRequests.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.timeOffType.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="timeoff-container">
      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading time off requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <p className="error-message">❌ Error: {error}</p>
          <button className="btn btn-primary" onClick={fetchTimeOffRequests}>
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Info Note */}
          <div className="timeoff-info-note">
        <div className="note-header">
          <h3 className="note-title">Note</h3>
          <span className="note-author">Milan Sinha</span>
        </div>
        <div className="note-content">
          <p className="note-author-name">Aditya Chauhan</p>
          <p className="note-text">
            Employees can view only their own time off records, while Admins and HR Officers 
            can view time off records & approve/reject them for all employees
          </p>
        </div>
      </div>

      {/* Header Section */}
      <div className="timeoff-header">
        <div className="timeoff-header-left">
          <h2 className="timeoff-title">Time Off</h2>
          <p className="timeoff-subtitle">Allocation</p>
        </div>
        {canApprove && (
          <div className="timeoff-actions-note">
            <span className="actions-label">Reject & Approve buttons</span>
            <span className="actions-sublabel">For Admin & HR Officer</span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="timeoff-toolbar">
        <button className="btn-new-timeoff" onClick={() => setShowNewModal(true)}>
          NEW
        </button>
        <div className="timeoff-search-container">
          <input
            type="text"
            placeholder="Searchbar"
            className="timeoff-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Allocation Cards */}
      <div className="allocation-cards">
        <div className="allocation-card paid-time-off">
          <h3 className="allocation-title">Paid time Off</h3>
          <p className="allocation-days">24 Days Available</p>
        </div>
        <div className="allocation-card sick-time-off">
          <h3 className="allocation-title">Sick time Off</h3>
          <p className="allocation-days">07 Days Available</p>
        </div>
      </div>

      {/* Time Off Table */}
      <div className="timeoff-table-container">
        <table className="timeoff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time off Type</th>
              <th>Status</th>
              {canApprove && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.employeeName}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>
                  <span className={`timeoff-type ${request.timeOffType === 'Paid time Off' ? 'paid-type' : 'sick-type'}`}>
                    {request.timeOffType}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                {canApprove && (
                  <td>
                    <div className="action-buttons">
                      {request.status === 'pending' && (
                        <>
                          <button
                            className="btn-action btn-reject"
                            onClick={() => handleReject(request.id)}
                            title="Reject"
                          >
                            ✕
                          </button>
                          <button
                            className="btn-action btn-approve"
                            onClick={() => handleApprove(request.id)}
                            title="Approve"
                          >
                            ✓
                          </button>
                        </>
                      )}
                      {request.status !== 'pending' && (
                        <span className="action-completed">
                          {request.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                        </span>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="no-results">
            <p>No time off requests found</p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )
}

export default TimeOff
