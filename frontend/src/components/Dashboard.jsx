import { useState } from 'react'

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('thisMonth')

  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Employees',
      value: '1,247',
      change: '+12',
      changeType: 'increase',
      icon: '👥'
    },
    {
      title: 'Present Today',
      value: '1,156',
      change: '92.7%',
      changeType: 'positive',
      icon: '✅'
    },
    {
      title: 'On Leave',
      value: '91',
      change: '7.3%',
      changeType: 'neutral',
      icon: '🏖️'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-5',
      changeType: 'improvement',
      icon: '⏳'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'employee_added',
      message: 'Sarah Johnson joined as Senior Developer',
      time: '2 hours ago',
      department: 'Engineering'
    },
    {
      id: 2,
      type: 'leave_approved',
      message: 'John Smith\'s vacation request approved',
      time: '4 hours ago',
      department: 'Marketing'
    },
    {
      id: 3,
      type: 'payroll_processed',
      message: 'Monthly payroll for December processed',
      time: '1 day ago',
      department: 'Finance'
    },
    {
      id: 4,
      type: 'training_completed',
      message: 'Lisa Wong completed Security Training',
      time: '2 days ago',
      department: 'Operations'
    }
  ]

  const attendanceData = [
    { month: 'Aug', attendance: 94.2 },
    { month: 'Sep', attendance: 96.1 },
    { month: 'Oct', attendance: 92.8 },
    { month: 'Nov', attendance: 95.3 },
    { month: 'Dec', attendance: 93.7 },
    { month: 'Jan', attendance: 97.1 }
  ]

  const topDepartments = [
    { name: 'Engineering', employees: 324, attendance: 96.5 },
    { name: 'Sales', employees: 187, attendance: 94.2 },
    { name: 'Marketing', employees: 143, attendance: 95.8 },
    { name: 'Operations', employees: 298, attendance: 92.1 },
    { name: 'Finance', employees: 89, attendance: 98.3 }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'All Hands Meeting',
      date: '2026-01-08',
      time: '10:00 AM',
      attendees: 45
    },
    {
      id: 2,
      title: 'Quarterly Performance Review',
      date: '2026-01-15',
      time: '2:00 PM',
      attendees: 120
    },
    {
      id: 3,
      title: 'New Employee Orientation',
      date: '2026-01-22',
      time: '9:00 AM',
      attendees: 12
    }
  ]

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening at your organization today.</p>
          </div>
          <div className="header-actions">
            <select 
              className="date-selector"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisQuarter">This Quarter</option>
            </select>
            <button className="btn btn-primary">
              <span>📊</span>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className="card-content">
              <div className="stat-header">
                <div className="stat-icon">{stat.icon}</div>
                <div className={`stat-change ${stat.changeType}`}>
                  {stat.change}
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Attendance Chart */}
        <div className="chart-card card">
          <div className="card-header">
            <h2 className="card-title">Attendance Overview</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color primary"></div>
                Monthly Average
              </span>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <div className="chart-bars">
                {attendanceData.map((data, index) => (
                  <div key={index} className="bar-item">
                    <div 
                      className="bar" 
                      style={{ height: `${data.attendance}%` }}
                      title={`${data.month}: ${data.attendance}%`}
                    ></div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="activity-card card">
          <div className="card-header">
            <h2 className="card-title">Recent Activities</h2>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="card-content">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <div className="activity-meta">
                      <span className="activity-time">{activity.time}</span>
                      <span className="activity-department">{activity.department}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="department-card card">
          <div className="card-header">
            <h2 className="card-title">Department Performance</h2>
            <p className="card-subtitle">Attendance rates by department</p>
          </div>
          <div className="card-content">
            <div className="department-list">
              {topDepartments.map((dept, index) => (
                <div key={index} className="department-item">
                  <div className="department-info">
                    <h4 className="department-name">{dept.name}</h4>
                    <p className="department-count">{dept.employees} employees</p>
                  </div>
                  <div className="department-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${dept.attendance}%` }}
                      ></div>
                    </div>
                    <span className="progress-value">{dept.attendance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="events-card card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Events</h2>
            <button className="btn btn-ghost btn-sm">
              <span>📅</span>
              Calendar
            </button>
          </div>
          <div className="card-content">
            <div className="events-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date">
                    <span className="event-day">{new Date(event.date).getDate()}</span>
                    <span className="event-month">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-time">{event.time}</p>
                    <p className="event-attendees">{event.attendees} attendees</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 0;
        }

        .dashboard-header {
          background-color: var(--white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--gray-200);
          margin-bottom: var(--spacing-xl);
        }

        .header-content {
          padding: var(--spacing-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashboard-title {
          font-size: 1.875rem;
          font-weight: var(--font-weight-bold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .dashboard-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .date-selector {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          background-color: var(--white);
          color: var(--gray-700);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          transition: all 150ms ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .stat-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          background-color: var(--primary-100);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-change {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
        }

        .stat-change.increase {
          background-color: var(--primary-200);
          color: var(--primary-800);
        }

        .stat-change.positive {
          background-color: var(--primary-300);
          color: var(--primary-900);
        }

        .stat-change.neutral {
          background-color: var(--gray-200);
          color: var(--gray-700);
        }

        .stat-change.improvement {
          background-color: var(--primary-400);
          color: var(--white);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: var(--font-weight-bold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .stat-title {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-template-rows: auto auto;
          gap: var(--spacing-xl);
        }

        .chart-card {
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .activity-card {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
        }

        .department-card {
          grid-column: 1 / 2;
          grid-row: 2 / 3;
        }

        .events-card {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
          display: none;
        }

        .chart-legend {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.75rem;
          color: var(--gray-600);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-color.primary {
          background-color: var(--primary-600);
        }

        .chart-container {
          height: 200px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-lg);
          height: 100%;
          width: 100%;
          max-width: 400px;
        }

        .bar-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .bar {
          width: 100%;
          max-width: 32px;
          background-color: var(--primary-600);
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          min-height: 20px;
          transition: all 150ms ease;
        }

        .bar:hover {
          background-color: var(--primary-700);
        }

        .bar-label {
          margin-top: var(--spacing-sm);
          font-size: 0.75rem;
          color: var(--gray-600);
          font-weight: var(--font-weight-medium);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .activity-item {
          padding: var(--spacing-md);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-md);
          background-color: var(--gray-50);
          transition: all 150ms ease;
        }

        .activity-item:hover {
          background-color: var(--primary-50);
          border-color: var(--primary-200);
        }

        .activity-message {
          font-size: 0.875rem;
          color: var(--gray-700);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .activity-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .activity-department {
          font-size: 0.75rem;
          color: var(--primary-600);
          font-weight: var(--font-weight-medium);
        }

        .department-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .department-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .department-info {
          flex: 1;
        }

        .department-name {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .department-count {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin: 0;
        }

        .department-progress {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          min-width: 150px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background-color: var(--gray-200);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: var(--primary-600);
          border-radius: var(--radius-sm);
          transition: width 300ms ease;
        }

        .progress-value {
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
          color: var(--primary-700);
          min-width: 35px;
          text-align: right;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .event-item {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-md);
          transition: all 150ms ease;
        }

        .event-item:hover {
          background-color: var(--primary-50);
          border-color: var(--primary-200);
        }

        .event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-sm);
          background-color: var(--primary-600);
          color: var(--white);
          border-radius: var(--radius-md);
          min-width: 50px;
        }

        .event-day {
          font-size: 1.125rem;
          font-weight: var(--font-weight-bold);
          line-height: 1;
        }

        .event-month {
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .event-details {
          flex: 1;
        }

        .event-title {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .event-time,
        .event-attendees {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }

          .chart-card,
          .activity-card,
          .department-card,
          .events-card {
            grid-column: 1 / 2;
            grid-row: auto;
          }

          .events-card {
            display: block;
          }
        }

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

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .chart-bars {
            gap: var(--spacing-md);
          }

          .department-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .department-progress {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard