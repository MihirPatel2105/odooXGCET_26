import { useState } from 'react'

const PayrollSystem = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-01')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showProcessModal, setShowProcessModal] = useState(false)

  // Mock payroll data
  const payrollRecords = [
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP001',
      department: 'Engineering',
      baseSalary: 85000,
      overtime: 250.00,
      bonuses: 500.00,
      deductions: 1200.00,
      netPay: 84550.00,
      status: 'processed',
      processedDate: '2026-01-01'
    },
    {
      id: 2,
      employeeName: 'Michael Chen',
      employeeId: 'EMP002',
      department: 'Marketing',
      baseSalary: 65000,
      overtime: 0.00,
      bonuses: 200.00,
      deductions: 950.00,
      netPay: 64250.00,
      status: 'processed',
      processedDate: '2026-01-01'
    },
    {
      id: 3,
      employeeName: 'Emily Rodriguez',
      employeeId: 'EMP003',
      department: 'Sales',
      baseSalary: 75000,
      overtime: 375.00,
      bonuses: 1000.00,
      deductions: 1100.00,
      netPay: 75275.00,
      status: 'pending',
      processedDate: null
    },
    {
      id: 4,
      employeeName: 'James Wilson',
      employeeId: 'EMP004',
      department: 'Operations',
      baseSalary: 58000,
      overtime: 150.00,
      bonuses: 0.00,
      deductions: 850.00,
      netPay: 57300.00,
      status: 'pending',
      processedDate: null
    },
    {
      id: 5,
      employeeName: 'Lisa Thompson',
      employeeId: 'EMP005',
      department: 'Finance',
      baseSalary: 72000,
      overtime: 200.00,
      bonuses: 300.00,
      deductions: 1050.00,
      netPay: 71450.00,
      status: 'processed',
      processedDate: '2026-01-01'
    }
  ]

  const filteredRecords = payrollRecords.filter(record => 
    filterStatus === 'all' || record.status === filterStatus
  )

  // Summary calculations
  const totalEmployees = payrollRecords.length
  const processedCount = payrollRecords.filter(r => r.status === 'processed').length
  const pendingCount = payrollRecords.filter(r => r.status === 'pending').length
  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netPay, 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="payroll-system">
      {/* Header */}
      <div className="page-header card">
        <div className="header-content">
          <div>
            <h1 className="page-title">Payroll System</h1>
            <p className="page-subtitle">Manage employee compensation and payroll processing</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📊</span>
              Generate Reports
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowProcessModal(true)}
            >
              <span>⚡</span>
              Process Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(totalPayroll)}</div>
            <div className="card-label">Total Payroll</div>
            <div className="card-subtitle">January 2026</div>
          </div>
        </div>
        <div className="summary-card processed">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <div className="card-value">{processedCount}</div>
            <div className="card-label">Processed</div>
            <div className="card-percentage">
              {((processedCount / totalEmployees) * 100).toFixed(1)}% Complete
            </div>
          </div>
        </div>
        <div className="summary-card pending">
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <div className="card-value">{pendingCount}</div>
            <div className="card-label">Pending</div>
            <div className="card-percentage">
              {((pendingCount / totalEmployees) * 100).toFixed(1)}% Remaining
            </div>
          </div>
        </div>
        <div className="summary-card average">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(totalPayroll / totalEmployees)}</div>
            <div className="card-label">Average Salary</div>
            <div className="card-subtitle">Per employee</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section card">
        <div className="controls-row">
          <div className="period-control">
            <label className="control-label">Pay Period</label>
            <input
              type="month"
              className="period-input"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
          </div>

          <div className="status-filter">
            <label className="control-label">Status Filter</label>
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="control-actions">
            <button className="btn btn-ghost btn-sm">
              <span>📤</span>
              Export Payslips
            </button>
            <button className="btn btn-ghost btn-sm">
              <span>📧</span>
              Send Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="payroll-table card">
        <div className="table-header">
          <h2 className="table-title">Payroll Records - {selectedPeriod}</h2>
          <div className="table-stats">
            <span className="stat-chip processed">
              {processedCount} Processed
            </span>
            <span className="stat-chip pending">
              {pendingCount} Pending
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Base Salary</th>
                <th>Overtime</th>
                <th>Bonuses</th>
                <th>Deductions</th>
                <th>Net Pay</th>
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
                  <td className="currency-cell">
                    {formatCurrency(record.baseSalary)}
                  </td>
                  <td className="currency-cell overtime">
                    {record.overtime > 0 ? formatCurrency(record.overtime) : '--'}
                  </td>
                  <td className="currency-cell bonus">
                    {record.bonuses > 0 ? formatCurrency(record.bonuses) : '--'}
                  </td>
                  <td className="currency-cell deduction">
                    {formatCurrency(record.deductions)}
                  </td>
                  <td className="currency-cell net-pay">
                    <div className="net-pay-container">
                      <span className="net-amount">{formatCurrency(record.netPay)}</span>
                      {record.status === 'processed' && (
                        <span className="processed-date">
                          Processed: {new Date(record.processedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View Payslip">📄</button>
                      <button className="action-btn" title="Edit Record">✏️</button>
                      <button className="action-btn" title="Send Payslip">📧</button>
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
            <div className="empty-icon">💰</div>
            <h3 className="empty-title">No payroll records found</h3>
            <p className="empty-message">
              No payroll data available for the selected period and filters.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <div className="action-card card">
          <div className="action-header">
            <div className="action-icon">📋</div>
            <h3 className="action-title">Bulk Actions</h3>
          </div>
          <div className="action-content">
            <p className="action-description">Perform actions on multiple payroll records</p>
            <div className="action-buttons">
              <button className="btn btn-secondary btn-sm">Process Selected</button>
              <button className="btn btn-secondary btn-sm">Export Selected</button>
            </div>
          </div>
        </div>

        <div className="action-card card">
          <div className="action-header">
            <div className="action-icon">📊</div>
            <h3 className="action-title">Payroll Analytics</h3>
          </div>
          <div className="action-content">
            <p className="action-description">View detailed payroll statistics and trends</p>
            <div className="action-buttons">
              <button className="btn btn-secondary btn-sm">View Analytics</button>
              <button className="btn btn-secondary btn-sm">Generate Report</button>
            </div>
          </div>
        </div>

        <div className="action-card card">
          <div className="action-header">
            <div className="action-icon">⚙️</div>
            <h3 className="action-title">Payroll Settings</h3>
          </div>
          <div className="action-content">
            <p className="action-description">Configure payroll rules and deductions</p>
            <div className="action-buttons">
              <button className="btn btn-secondary btn-sm">Tax Settings</button>
              <button className="btn btn-secondary btn-sm">Deduction Rules</button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Payroll Modal */}
      {showProcessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Process Payroll</h2>
              <button 
                className="modal-close"
                onClick={() => setShowProcessModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="process-summary">
                <div className="summary-item">
                  <span className="summary-label">Pay Period:</span>
                  <span className="summary-value">{selectedPeriod}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Employees to Process:</span>
                  <span className="summary-value">{pendingCount}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Amount:</span>
                  <span className="summary-value">
                    {formatCurrency(payrollRecords
                      .filter(r => r.status === 'pending')
                      .reduce((sum, record) => sum + record.netPay, 0)
                    )}
                  </span>
                </div>
              </div>
              
              <div className="process-options">
                <label className="option-label">
                  <input type="checkbox" defaultChecked />
                  Send payslip notifications
                </label>
                <label className="option-label">
                  <input type="checkbox" defaultChecked />
                  Generate tax reports
                </label>
                <label className="option-label">
                  <input type="checkbox" />
                  Create bank transfer file
                </label>
              </div>

              <div className="process-warning">
                <div className="warning-icon">⚠️</div>
                <p className="warning-text">
                  This action will process payroll for {pendingCount} employees. 
                  Please review all records carefully before proceeding.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowProcessModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                <span>⚡</span>
                Process Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .payroll-system {
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
          gap: var(--spacing-lg);
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

        .summary-card.processed .card-icon {
          background-color: var(--primary-200);
        }

        .summary-card.pending .card-icon {
          background-color: var(--primary-300);
        }

        .summary-card.average .card-icon {
          background-color: var(--primary-400);
        }

        .card-content {
          flex: 1;
        }

        .card-value {
          font-size: 1.75rem;
          font-weight: var(--font-weight-bold);
          color: var(--primary-800);
          margin-bottom: var(--spacing-xs);
        }

        .card-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-bottom: var(--spacing-xs);
        }

        .card-subtitle,
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

        .period-input,
        .filter-select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .control-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-left: auto;
        }

        .payroll-table {
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

        .table-stats {
          display: flex;
          gap: var(--spacing-sm);
        }

        .stat-chip {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
        }

        .stat-chip.processed {
          background-color: var(--primary-200);
          color: var(--primary-800);
        }

        .stat-chip.pending {
          background-color: var(--primary-300);
          color: var(--primary-900);
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

        .currency-cell {
          font-size: 0.875rem;
          font-weight: var(--font-weight-medium);
          text-align: right;
        }

        .currency-cell.overtime {
          color: var(--primary-600);
        }

        .currency-cell.bonus {
          color: var(--primary-700);
        }

        .currency-cell.deduction {
          color: var(--primary-500);
        }

        .currency-cell.net-pay {
          font-weight: var(--font-weight-semibold);
        }

        .net-pay-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .net-amount {
          color: var(--primary-800);
        }

        .processed-date {
          font-size: 0.75rem;
          color: var(--gray-500);
          font-weight: var(--font-weight-normal);
          margin-top: var(--spacing-xs);
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

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .action-card {
          padding: var(--spacing-lg);
        }

        .action-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .action-icon {
          font-size: 1.5rem;
          width: 48px;
          height: 48px;
          background-color: var(--primary-100);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0;
        }

        .action-description {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0 0 var(--spacing-lg) 0;
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
        }

        .modal {
          background-color: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: var(--font-weight-semibold);
          color: var(--gray-800);
          margin: 0;
        }

        .modal-close {
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
        }

        .modal-close:hover {
          background-color: var(--gray-200);
        }

        .modal-content {
          padding: var(--spacing-lg);
          flex: 1;
          overflow-y: auto;
        }

        .process-summary {
          margin-bottom: var(--spacing-lg);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--gray-100);
        }

        .summary-item:last-child {
          border-bottom: none;
          font-weight: var(--font-weight-semibold);
        }

        .summary-label {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        .summary-value {
          font-size: 0.875rem;
          color: var(--gray-800);
          font-weight: var(--font-weight-medium);
        }

        .process-options {
          margin-bottom: var(--spacing-lg);
        }

        .option-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.875rem;
          color: var(--gray-700);
          margin-bottom: var(--spacing-sm);
          cursor: pointer;
        }

        .option-label input {
          accent-color: var(--primary-600);
        }

        .process-warning {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background-color: var(--primary-100);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--primary-600);
        }

        .warning-icon {
          font-size: 1.25rem;
        }

        .warning-text {
          font-size: 0.875rem;
          color: var(--primary-800);
          margin: 0;
        }

        .modal-footer {
          padding: var(--spacing-lg);
          border-top: 1px solid var(--gray-200);
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
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

          .control-actions {
            margin-left: 0;
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .table-container {
            overflow-x: auto;
          }

          .action-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  )
}

export default PayrollSystem