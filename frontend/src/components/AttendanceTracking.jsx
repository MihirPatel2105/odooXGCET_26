import { useState } from 'react'

const AttendanceTracking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('daily') // daily, weekly, monthly
  const [filterDepartment, setFilterDepartment] = useState('all')

  // Mock attendance data
  const attendanceRecords = [
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      department: 'Engineering',
      checkIn: '09:15 AM',
      checkOut: '06:30 PM',
      totalHours: '8.25',
      status: 'present',
      breakTime: '1h 15m',
      overtime: '0.25h'
    },
    {
      id: 2,
      employeeName: 'Michael Chen',
      employeeId: 'EMP002',
      department: 'Marketing',
      checkIn: '09:00 AM',
      checkOut: '05:45 PM',
      totalHours: '8.00',
      status: 'present',
      breakTime: '45m',
      overtime: '0h'
    },
    {
      id: 3,
      employeeName: 'Emily Rodriguez',
      employeeId: 'EMP003',
      department: 'Sales',
      checkIn: '08:45 AM',
      checkOut: '07:15 PM',
      totalHours: '9.50',
      status: 'present',
      breakTime: '1h 30m',
      overtime: '1.5h'
    },
    {
      id: 4,
      employeeName: 'James Wilson',
      employeeId: 'EMP004',
      department: 'Operations',
      checkIn: null,
      checkOut: null,
      totalHours: '0',
      status: 'absent',
      breakTime: '0m',
      overtime: '0h'
    },
    {
      id: 5,
      employeeName: 'Lisa Thompson',
      employeeId: 'EMP005',
      department: 'Finance',
      checkIn: '09:30 AM',
      checkOut: null,
      totalHours: 'In Progress',
      status: 'present',
      breakTime: '30m',
      overtime: '0h'
    }
  ]

  const departments = ['Engineering', 'Marketing', 'Sales', 'Operations', 'Finance']
  
  const filteredRecords = attendanceRecords.filter(record => 
    filterDepartment === 'all' || record.department === filterDepartment
  )

  // Summary statistics
  const totalEmployees = attendanceRecords.length
  const presentEmployees = attendanceRecords.filter(r => r.status === 'present').length
  const absentEmployees = attendanceRecords.filter(r => r.status === 'absent').length
  const lateEmployees = attendanceRecords.filter(r => 
    r.checkIn && new Date(`2000-01-01 ${r.checkIn}`).getHours() >= 9
  ).length

  return (
    <div className="attendance-tracking">
      {/* Header */}
      <div className="page-header card">
        <div className="header-content">
          <div>
            <h1 className="page-title">Attendance Tracking</h1>
            <p className="page-subtitle">Monitor and manage employee attendance records</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📊</span>
              Generate Report
            </button>
            <button className="btn btn-primary">
              <span>⬇️</span>
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <div className="card-value">{totalEmployees}</div>
            <div className="card-label">Total Employees</div>
          </div>
        </div>
        <div className="summary-card present">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <div className="card-value">{presentEmployees}</div>
            <div className="card-label">Present Today</div>
            <div className="card-percentage">
              {((presentEmployees / totalEmployees) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="summary-card absent">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <div className="card-value">{absentEmployees}</div>
            <div className="card-label">Absent Today</div>
            <div className="card-percentage">
              {((absentEmployees / totalEmployees) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="summary-card late">
          <div className="card-icon">⏰</div>
          <div className="card-content">
            <div className="card-value">{lateEmployees}</div>
            <div className="card-label">Late Arrivals</div>
            <div className="card-percentage">
              {((lateEmployees / totalEmployees) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="controls-section card">
        <div className="controls-row">
          <div className="date-controls">
            <label className="control-label">Date</label>
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="view-controls">
            <label className="control-label">View</label>
            <div className="view-buttons">
              <button 
                className={`view-btn ${viewMode === 'daily' ? 'active' : ''}`}
                onClick={() => setViewMode('daily')}
              >
                Daily
              </button>
              <button 
                className={`view-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                onClick={() => setViewMode('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`view-btn ${viewMode === 'monthly' ? 'active' : ''}`}
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="department-filter">
            <label className="control-label">Department</label>
            <select 
              className="filter-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table card">
        <div className="table-header">
          <h2 className="table-title">Attendance Records - {selectedDate}</h2>
          <div className="table-actions">
            <button className="btn btn-ghost btn-sm">
              <span>🔄</span>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Break Time</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="table-row">
                  <td>
                    <div className="employee-info">
                      <div className="employee-name">{record.employeeName}</div>
                      <div className="employee-id">{record.employeeId}</div>
                    </div>
                  </td>
                  <td>
                    <span className="department-badge">{record.department}</span>
                  </td>
                  <td className="time-cell">
                    {record.checkIn ? (
                      <div className="time-display">
                        <span className="time">{record.checkIn}</span>
                        {new Date(`2000-01-01 ${record.checkIn}`).getHours() >= 9 && (
                          <span className="late-indicator">Late</span>
                        )}
                      </div>
                    ) : (
                      <span className="no-record">--</span>
                    )}
                  </td>
                  <td className="time-cell">
                    {record.checkOut ? (
                      <span className="time">{record.checkOut}</span>
                    ) : record.status === 'present' ? (
                      <span className="in-progress">In Progress</span>
                    ) : (
                      <span className="no-record">--</span>
                    )}
                  </td>
                  <td className="hours-cell">
                    <span className="hours">{record.totalHours}</span>
                  </td>
                  <td className="break-cell">{record.breakTime}</td>
                  <td className="overtime-cell">
                    {record.overtime !== '0h' ? (
                      <span className="overtime">{record.overtime}</span>
                    ) : (
                      <span className="no-overtime">--</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View Details">👁️</button>
                      <button className="action-btn" title="Edit Record">✏️</button>
                      <button className="action-btn" title="More Options">⋮</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3 className="empty-title">No attendance records found</h3>
            <p className="empty-message">
              No attendance data available for the selected date and filters.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats card">
        <div className="stats-header">
          <h2 className="stats-title">Today's Statistics</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Average Check-in Time</div>
            <div className="stat-value">9:12 AM</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Average Hours Worked</div>
            <div className="stat-value">8.2 hrs</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total Overtime</div>
            <div className="stat-value">1.75 hrs</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Attendance Rate</div>
            <div className="stat-value">{((presentEmployees / totalEmployees) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .attendance-tracking {
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

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .summary-card {
          background-color: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          transition: all 150ms ease;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .card-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          background-color: var(--primary-100);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-card.present .card-icon {
          background-color: var(--primary-200);
        }

        .summary-card.absent .card-icon {
          background-color: var(--primary-300);
        }

        .summary-card.late .card-icon {
          background-color: var(--primary-400);
        }

        .card-content {
          flex: 1;
        }

        .card-value {
          font-size: 1.875rem;
          font-weight: var(--font-weight-bold);
          color: var(--primary-800);
          margin-bottom: var(--spacing-xs);
        }

        .card-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-bottom: var(--spacing-xs);
        }

        .card-percentage {
          font-size: 0.75rem;
          color: var(--primary-600);
          font-weight: var(--font-weight-medium);
        }

        .controls-section {
          margin-bottom: var(--spacing-xl);
        }

        .controls-row {
          padding: var(--spacing-lg);
          display: flex;
          align-items: end;
          gap: var(--spacing-xl);
          flex-wrap: wrap;
        }

        .control-label {
          display: block;
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          color: var(--gray-700);
          margin-bottom: var(--spacing-sm);
        }

        .date-input,
        .filter-select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .view-buttons {
          display: flex;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .view-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          background-color: var(--white);
          color: var(--gray-600);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 150ms ease;
          border-right: 1px solid var(--gray-300);
        }

        .view-btn:last-child {
          border-right: none;
        }

        .view-btn:hover {
          background-color: var(--primary-50);
          color: var(--primary-700);
        }

        .view-btn.active {
          background-color: var(--primary-600);
          color: var(--white);
        }

        .attendance-table {
          margin-bottom: var(--spacing-xl);
        }

        .table-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0;
        }

        .table-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .employee-info {
          display: flex;
          flex-direction: column;
        }

        .employee-name {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          color: var(--gray-800);
        }

        .employee-id {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .department-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background-color: var(--primary-100);
          color: var(--primary-800);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
        }

        .time-cell {
          font-size: 0.875rem;
        }

        .time-display {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .time {
          color: var(--gray-700);
          font-weight: var(--font-weight-medium);
        }

        .late-indicator {
          font-size: 0.75rem;
          color: var(--primary-600);
          font-weight: var(--font-weight-medium);
        }

        .no-record {
          color: var(--gray-400);
          font-style: italic;
        }

        .in-progress {
          color: var(--primary-600);
          font-weight: var(--font-weight-medium);
          font-size: 0.75rem;
        }

        .hours-cell .hours {
          font-weight: var(--font-weight-medium);
          color: var(--gray-800);
        }

        .break-cell,
        .overtime-cell {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        .overtime {
          color: var(--primary-600);
          font-weight: var(--font-weight-medium);
        }

        .no-overtime {
          color: var(--gray-400);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-xs);
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-sm);
          background-color: var(--gray-100);
          color: var(--gray-600);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 150ms ease;
        }

        .action-btn:hover {
          background-color: var(--primary-100);
          color: var(--primary-700);
        }

        .empty-state {
          padding: var(--spacing-2xl);
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-lg);
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .empty-message {
          color: var(--gray-600);
          margin: 0;
        }

        .quick-stats {
          background-color: var(--white);
        }

        .stats-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--gray-200);
        }

        .stats-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0;
        }

        .stats-grid {
          padding: var(--spacing-lg);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }

        .stat-item {
          text-align: center;
        }

        .stat-item .stat-label {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin-bottom: var(--spacing-xs);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-item .stat-value {
          font-size: 1.25rem;
          font-weight: var(--font-weight-bold);
          color: var(--primary-700);
        }

        /* Responsive Design */
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

          .controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-lg);
          }

          .view-buttons {
            width: 100%;
          }

          .view-btn {
            flex: 1;
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .table-container {
            overflow-x: auto;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}

export default AttendanceTracking