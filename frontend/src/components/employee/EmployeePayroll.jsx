import { useState, useEffect } from 'react'
import { salaryAPI } from '../../services/api'
import './EmployeeStyles.css'

const EmployeePayroll = ({ user }) => {
  const [salaryDetails, setSalaryDetails] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('2026-01')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSalaryDetails()
  }, [])

  const fetchSalaryDetails = async () => {
    try {
      setLoading(true)
      const response = await salaryAPI.getMySalary()
      if (response.success && response.salary) {
        setSalaryDetails(response.salary)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching salary:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const calculateNetPay = () => {
    if (!salaryDetails) return 0
    
    const basic = salaryDetails.components?.basicAmount || 0
    const hra = salaryDetails.components?.hraAmount || 0
    const allowances = salaryDetails.components?.allowances || {}
    const totalAllowances = (allowances.standardAllowance || 0) + 
                           (allowances.performanceBonus || 0) + 
                           (allowances.leaveEncashment || 0)
    
    const pfContribution = salaryDetails.deductions?.pfContribution || 0
    
    return basic + hra + totalAllowances - pfContribution
  }

  if (loading) {
    return (
      <div className="payroll-system">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading salary details...</p>
        </div>
      </div>
    )
  }

  if (error || !salaryDetails) {
    return (
      <div className="payroll-system">
        <div className="page-header card">
          <h1 className="page-title">My Payroll</h1>
        </div>
        <div className="card">
          <div className="empty-state">
            <p>No salary information available. Please contact HR.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payroll-system">
      {/* Header */}
      <div className="page-header card">
        <div className="header-content">
          <div>
            <h1 className="page-title">My Payroll</h1>
            <p className="page-subtitle">View your salary details and payslips</p>
          </div>
          <div className="period-selector">
            <label>Period:</label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-input"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <p className="summary-label">Net Pay</p>
            <p className="summary-value">{formatCurrency(calculateNetPay())}</p>
            <p className="summary-subtitle">This month</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <p className="summary-label">Basic Salary</p>
            <p className="summary-value">{formatCurrency(salaryDetails.components?.basicAmount)}</p>
            <p className="summary-subtitle">Monthly base</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">➕</div>
          <div className="summary-content">
            <p className="summary-label">Total Allowances</p>
            <p className="summary-value">
              {formatCurrency(
                (salaryDetails.components?.allowances?.standardAllowance || 0) +
                (salaryDetails.components?.allowances?.performanceBonus || 0) +
                (salaryDetails.components?.allowances?.leaveEncashment || 0)
              )}
            </p>
            <p className="summary-subtitle">Additional earnings</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">➖</div>
          <div className="summary-content">
            <p className="summary-label">Deductions</p>
            <p className="summary-value">{formatCurrency(salaryDetails.deductions?.pfContribution)}</p>
            <p className="summary-subtitle">PF & taxes</p>
          </div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Salary Breakdown</h2>
        </div>
        <div className="salary-breakdown">
          <div className="breakdown-section">
            <h3 className="breakdown-title">Earnings</h3>
            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="item-label">Basic Salary</span>
                <span className="item-value">{formatCurrency(salaryDetails.components?.basicAmount)}</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">HRA ({salaryDetails.components?.hraPercentage}%)</span>
                <span className="item-value">{formatCurrency(salaryDetails.components?.hraAmount)}</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Standard Allowance</span>
                <span className="item-value">
                  {formatCurrency(salaryDetails.components?.allowances?.standardAllowance)}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Performance Bonus</span>
                <span className="item-value">
                  {formatCurrency(salaryDetails.components?.allowances?.performanceBonus)}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Leave Encashment</span>
                <span className="item-value">
                  {formatCurrency(salaryDetails.components?.allowances?.leaveEncashment)}
                </span>
              </div>
            </div>
            <div className="breakdown-total">
              <span className="total-label">Total Earnings</span>
              <span className="total-value">
                {formatCurrency(
                  (salaryDetails.components?.basicAmount || 0) +
                  (salaryDetails.components?.hraAmount || 0) +
                  (salaryDetails.components?.allowances?.standardAllowance || 0) +
                  (salaryDetails.components?.allowances?.performanceBonus || 0) +
                  (salaryDetails.components?.allowances?.leaveEncashment || 0)
                )}
              </span>
            </div>
          </div>

          <div className="breakdown-section">
            <h3 className="breakdown-title">Deductions</h3>
            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="item-label">PF Contribution ({salaryDetails.deductions?.pfPercentage}%)</span>
                <span className="item-value negative">
                  -{formatCurrency(salaryDetails.deductions?.pfContribution)}
                </span>
              </div>
            </div>
            <div className="breakdown-total">
              <span className="total-label">Total Deductions</span>
              <span className="total-value negative">
                -{formatCurrency(salaryDetails.deductions?.pfContribution)}
              </span>
            </div>
          </div>
        </div>

        <div className="net-pay-section">
          <div className="net-pay-card">
            <span className="net-pay-label">Net Pay (Take Home)</span>
            <span className="net-pay-amount">{formatCurrency(calculateNetPay())}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Additional Information</h2>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Wage Type</span>
            <span className="info-value">{salaryDetails.wageType}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Working Days/Week</span>
            <span className="info-value">{salaryDetails.workingDaysPerWeek} days</span>
          </div>
          <div className="info-item">
            <span className="info-label">Annual Wage</span>
            <span className="info-value">
              {formatCurrency(salaryDetails.wageType === 'YEARLY' ? salaryDetails.wage : salaryDetails.wage * 12)}
            </span>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="card">
        <div className="download-section">
          <div className="download-content">
            <h3>Download Payslip</h3>
            <p>Get a detailed PDF payslip for your records</p>
          </div>
          <button className="btn-primary">
            📄 Download Payslip
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeePayroll
