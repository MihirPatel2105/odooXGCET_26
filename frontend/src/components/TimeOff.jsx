import { useState } from 'react'

const TimeOff = ({ userRole = 'HR Manager' }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showNewModal, setShowNewModal] = useState(false)

  // Check if user is admin or HR officer
  const canApprove = userRole === 'HR Manager' || userRole === 'Admin'

  // Mock time off requests data
  const [timeOffRequests, setTimeOffRequests] = useState([
    {
      id: 1,
      employeeName: 'Attractive Walrus',
      startDate: '28/10/2025',
      endDate: '28/10/2025',
      timeOffType: 'Paid time Off',
      status: 'pending',
      days: 1
    },
    {
      id: 2,
      employeeName: 'Pleased Zebra',
      startDate: '15/01/2026',
      endDate: '20/01/2026',
      timeOffType: 'Sick time Off',
      status: 'approved',
      days: 6
    },
    {
      id: 3,
      employeeName: 'Calm Dove',
      startDate: '05/02/2026',
      endDate: '07/02/2026',
      timeOffType: 'Paid time Off',
      status: 'pending',
      days: 3
    },
    {
      id: 4,
      employeeName: 'Green Nightingale',
      startDate: '12/02/2026',
      endDate: '14/02/2026',
      timeOffType: 'Paid time Off',
      status: 'rejected',
      days: 3
    },
    {
      id: 5,
      employeeName: 'Jenilor',
      startDate: '20/03/2026',
      endDate: '22/03/2026',
      timeOffType: 'Sick time Off',
      status: 'approved',
      days: 3
    }
  ])

  // Filter requests
  const filteredRequests = timeOffRequests.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.timeOffType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || req.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  // Handle approve
  const handleApprove = (id) => {
    setTimeOffRequests(requests =>
      requests.map(req => req.id === id ? { ...req, status: 'approved' } : req)
    )
  }

  // Handle reject
  const handleReject = (id) => {
    setTimeOffRequests(requests =>
      requests.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
    )
  }

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
    </div>
  )
}

export default TimeOff
