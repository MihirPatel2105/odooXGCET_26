import { useState } from 'react'

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState('thisMonth')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock reports data
  const reports = [
    {
      id: 1,
      title: 'Monthly Attendance Summary',
      description: 'Comprehensive attendance report for all employees',
      category: 'attendance',
      lastGenerated: '2026-01-03T08:30:00Z',
      format: 'PDF',
      size: '2.4 MB',
      status: 'ready',
      icon: '📊'
    },
    {
      id: 2,
      title: 'Payroll Analysis Report',
      description: 'Detailed payroll breakdown by department and employee',
      category: 'payroll',
      lastGenerated: '2026-01-01T14:15:00Z',
      format: 'Excel',
      size: '1.8 MB',
      status: 'ready',
      icon: '💰'
    },
    {
      id: 3,
      title: 'Employee Performance Review',
      description: 'Quarterly performance metrics and evaluations',
      category: 'performance',
      lastGenerated: '2025-12-28T16:45:00Z',
      format: 'PDF',
      size: '3.2 MB',
      status: 'ready',
      icon: '📈'
    },
    {
      id: 4,
      title: 'Leave Balance Report',
      description: 'Current leave balances for all employees',
      category: 'leave',
      lastGenerated: null,
      format: 'PDF',
      size: null,
      status: 'pending',
      icon: '🏖️'
    },
    {
      id: 5,
      title: 'Compliance Audit Report',
      description: 'HR compliance and regulatory audit findings',
      category: 'compliance',
      lastGenerated: '2025-12-15T09:20:00Z',
      format: 'PDF',
      size: '5.1 MB',
      status: 'ready',
      icon: '📋'
    },
    {
      id: 6,
      title: 'Department Headcount Analysis',
      description: 'Staff distribution and growth analysis by department',
      category: 'analytics',
      lastGenerated: '2026-01-02T11:30:00Z',
      format: 'Excel',
      size: '1.2 MB',
      status: 'ready',
      icon: '👥'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Reports', count: reports.length },
    { id: 'attendance', label: 'Attendance', count: reports.filter(r => r.category === 'attendance').length },
    { id: 'payroll', label: 'Payroll', count: reports.filter(r => r.category === 'payroll').length },
    { id: 'performance', label: 'Performance', count: reports.filter(r => r.category === 'performance').length },
    { id: 'leave', label: 'Leave Management', count: reports.filter(r => r.category === 'leave').length },
    { id: 'compliance', label: 'Compliance', count: reports.filter(r => r.category === 'compliance').length },
    { id: 'analytics', label: 'Analytics', count: reports.filter(r => r.category === 'analytics').length }
  ]

  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'Not generated'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (size) => {
    if (!size) return '--'
    return size
  }

  return (
    <div className="reports">
      {/* Header */}
      <div className="page-header card">
        <div className="header-content">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Generate and manage HR reports and business insights</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>⚙️</span>
              Report Settings
            </button>
            <button className="btn btn-primary">
              <span>📊</span>
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{reports.length}</div>
            <div className="stat-label">Total Reports</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{reports.filter(r => r.status === 'ready').length}</div>
            <div className="stat-label">Ready to Download</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{reports.filter(r => r.status === 'pending').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="reports-layout">
        {/* Sidebar */}
        <div className="reports-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-label">{category.label}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span className="action-icon">📊</span>
                <span className="action-text">Attendance Report</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">💰</span>
                <span className="action-text">Payroll Summary</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📈</span>
                <span className="action-text">Performance Metrics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="reports-main">
          {/* Search and Filters */}
          <div className="search-section card">
            <div className="search-controls">
              <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search reports by title or description..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="date-filter"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="reports-grid">
            {filteredReports.map(report => (
              <div key={report.id} className="report-card card">
                <div className="report-header">
                  <div className="report-icon">{report.icon}</div>
                  <div className="report-status">
                    <span className={`status-indicator status-${report.status}`}>
                      {report.status === 'ready' ? '●' : '○'}
                    </span>
                  </div>
                </div>
                
                <div className="report-content">
                  <h3 className="report-title">{report.title}</h3>
                  <p className="report-description">{report.description}</p>
                  
                  <div className="report-meta">
                    <div className="meta-item">
                      <span className="meta-label">Last Generated:</span>
                      <span className="meta-value">{formatDate(report.lastGenerated)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Format:</span>
                      <span className="meta-value">{report.format}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Size:</span>
                      <span className="meta-value">{formatFileSize(report.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="report-actions">
                  {report.status === 'ready' ? (
                    <>
                      <button className="btn btn-primary btn-sm">
                        <span>⬇️</span>
                        Download
                      </button>
                      <button className="btn btn-secondary btn-sm">
                        <span>👁️</span>
                        Preview
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <span>🔄</span>
                        Regenerate
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary btn-sm" disabled>
                        <span>⏳</span>
                        Generating...
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <span>❌</span>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="empty-state card">
              <div className="empty-icon">📊</div>
              <h3 className="empty-title">No reports found</h3>
              <p className="empty-message">
                No reports match your current search criteria. Try adjusting your filters or create a new report.
              </p>
              <button className="btn btn-primary">
                <span>📊</span>
                Create New Report
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .reports {
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

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          background-color: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
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

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--primary-800);
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        .reports-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--spacing-xl);
        }

        .reports-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .sidebar-section {
          background-color: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
        }

        .sidebar-title {
          font-size: 1rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-md) 0;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          border-radius: var(--radius-md);
          background: none;
          color: var(--gray-700);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 150ms ease;
          text-align: left;
        }

        .category-item:hover {
          background-color: var(--primary-50);
          color: var(--primary-700);
        }

        .category-item.active {
          background-color: var(--primary-600);
          color: var(--white);
        }

        .category-label {
          flex: 1;
        }

        .category-count {
          background-color: var(--primary-200);
          color: var(--primary-800);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
        }

        .category-item.active .category-count {
          background-color: var(--primary-300);
          color: var(--primary-900);
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-md);
          background-color: var(--white);
          color: var(--gray-700);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 150ms ease;
          text-align: left;
        }

        .quick-action-btn:hover {
          background-color: var(--primary-50);
          border-color: var(--primary-200);
          color: var(--primary-700);
        }

        .action-icon {
          font-size: 1rem;
        }

        .action-text {
          flex: 1;
        }

        .reports-main {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .search-section {
          padding: var(--spacing-lg);
        }

        .search-controls {
          display: flex;
          gap: var(--spacing-md);
        }

        .search-input-container {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 2.5rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .date-filter {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          min-width: 150px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-lg);
        }

        .report-card {
          padding: var(--spacing-lg);
          transition: all 150ms ease;
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .report-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .report-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          background-color: var(--primary-100);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-status {
          display: flex;
          align-items: center;
        }

        .status-indicator {
          font-size: 1rem;
        }

        .status-indicator.status-ready {
          color: var(--primary-600);
        }

        .status-indicator.status-pending {
          color: var(--primary-400);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .report-content {
          margin-bottom: var(--spacing-lg);
        }

        .report-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .report-description {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0 0 var(--spacing-md) 0;
          line-height: 1.5;
        }

        .report-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .meta-value {
          font-size: 0.75rem;
          color: var(--gray-700);
          font-weight: var(--font-weight-medium);
        }

        .report-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .empty-state {
          padding: var(--spacing-2xl);
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .empty-message {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0 0 var(--spacing-lg) 0;
          line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .reports-layout {
            grid-template-columns: 1fr;
          }

          .reports-sidebar {
            order: 1;
          }

          .reports-main {
            order: 0;
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

          .stats-section {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .search-controls {
            flex-direction: column;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .category-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--spacing-sm);
          }

          .report-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default Reports