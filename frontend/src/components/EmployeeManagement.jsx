import { useState } from 'react'

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState([])

  // Mock employee data
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'active',
      joinDate: '2023-03-15',
      phone: '+1 (555) 123-4567',
      manager: 'John Smith',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Marketing',
      position: 'Marketing Specialist',
      status: 'active',
      joinDate: '2024-01-22',
      phone: '+1 (555) 234-5678',
      manager: 'Lisa Wong',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      department: 'Sales',
      position: 'Sales Manager',
      status: 'active',
      joinDate: '2022-11-08',
      phone: '+1 (555) 345-6789',
      manager: 'David Brown',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      department: 'Operations',
      position: 'Operations Coordinator',
      status: 'inactive',
      joinDate: '2023-07-12',
      phone: '+1 (555) 456-7890',
      manager: 'Anna Davis',
      avatar: 'JW'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'active',
      joinDate: '2024-02-03',
      phone: '+1 (555) 567-8901',
      manager: 'Robert Kim',
      avatar: 'LT'
    }
  ]

  const departments = ['Engineering', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR']
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id))
    }
  }

  return (
    <div className="employee-management">
      {/* Header */}
      <div className="page-header card">
        <div className="header-content">
          <div>
            <h1 className="page-title">Employee Management</h1>
            <p className="page-subtitle">Manage your organization's workforce efficiently</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>📊</span>
              Export Data
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddEmployee(true)}
            >
              <span>👤➕</span>
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-value">{employees.length}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{employees.filter(e => e.status === 'active').length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{departments.length}</div>
          <div className="stat-label">Departments</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">23</div>
          <div className="stat-label">New This Month</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section card">
        <div className="filters-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search employees by name or email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
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

            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {selectedEmployees.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
            </span>
            <div className="bulk-buttons">
              <button className="btn btn-sm btn-secondary">Export Selected</button>
              <button className="btn btn-sm btn-secondary">Update Status</button>
              <button className="btn btn-sm btn-secondary">Send Message</button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="employees-table card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id} className="table-row">
                  <td>
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleSelectEmployee(employee.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-cell">
                      <div className="employee-avatar">
                        <span>{employee.avatar}</span>
                      </div>
                      <div className="employee-info">
                        <div className="employee-name">{employee.name}</div>
                        <div className="employee-email">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="department-badge">{employee.department}</span>
                  </td>
                  <td className="position-cell">{employee.position}</td>
                  <td>
                    <span className={`status-badge status-${employee.status}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </td>
                  <td className="manager-cell">{employee.manager}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View Profile">👁️</button>
                      <button className="action-btn" title="Edit Employee">✏️</button>
                      <button className="action-btn" title="More Options">⋮</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">No employees found</h3>
            <p className="empty-message">
              Try adjusting your search criteria or add new employees to get started.
            </p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Employee</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddEmployee(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <form className="employee-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-input" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select className="form-select" required>
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position *</label>
                    <input type="text" className="form-input" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Join Date *</label>
                    <input type="date" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Manager</label>
                    <select className="form-select">
                      <option value="">Select Manager</option>
                      <option value="john-smith">John Smith</option>
                      <option value="lisa-wong">Lisa Wong</option>
                      <option value="david-brown">David Brown</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddEmployee(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">Add Employee</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .employee-management {
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

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-item {
          background-color: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: var(--font-weight-bold);
          color: var(--primary-700);
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: var(--font-weight-medium);
        }

        .filters-section {
          margin-bottom: var(--spacing-xl);
        }

        .filters-row {
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
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

        .filter-controls {
          display: flex;
          gap: var(--spacing-md);
        }

        .filter-select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          min-width: 150px;
        }

        .bulk-actions {
          padding: var(--spacing-md) var(--spacing-lg);
          background-color: var(--primary-50);
          border-top: 1px solid var(--primary-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .selected-count {
          font-size: 0.875rem;
          color: var(--primary-700);
          font-weight: var(--font-weight-medium);
        }

        .bulk-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }

        .employees-table {
          overflow: hidden;
        }

        .table-checkbox {
          accent-color: var(--primary-600);
        }

        .table-row:hover {
          background-color: var(--primary-50);
        }

        .employee-cell {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .employee-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-600);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-weight-medium);
          font-size: 0.875rem;
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

        .employee-email {
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

        .position-cell,
        .date-cell,
        .manager-cell {
          font-size: 0.875rem;
          color: var(--gray-700);
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
          max-width: 600px;
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

        .employee-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
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

          .filters-row {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-md);
          }

          .search-container {
            max-width: none;
          }

          .filter-controls {
            flex-wrap: wrap;
          }

          .bulk-actions {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-md);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .table-container {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default EmployeeManagement