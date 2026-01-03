import { useState } from 'react'
import { employeeAPI } from '../services/api'
import './AddEmployeeForm.css'

const AddEmployeeForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    designation: '',
    dateOfJoining: new Date().toISOString().split('T')[0], // Default to today
    department: '',
    phone: '',
    address: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required'
    }

    // Date validation
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Joining date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await employeeAPI.create(formData)
      
      if (response.success) {
        alert('Employee created successfully!')
        onSuccess() // Refresh employee list
        onClose() // Close modal
      } else {
        alert(response.message || 'Failed to create employee')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Failed to create employee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-employee-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Employee</h2>
          <button className="modal-close" onClick={onClose} type="button">✕</button>
        </div>

        <form className="add-employee-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">👤 Full Name <span className="required">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.fullName ? 'input-error' : ''}
                autoFocus
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">📧 Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@company.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="designation">💼 Designation <span className="required">*</span></label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Software Engineer"
                className={errors.designation ? 'input-error' : ''}
              />
              {errors.designation && <span className="error-message">{errors.designation}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department">🏢 Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Engineering"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfJoining">📅 Joining Date <span className="required">*</span></label>
              <input
                type="date"
                id="dateOfJoining"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className={errors.dateOfJoining ? 'input-error' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfJoining && <span className="error-message">{errors.dateOfJoining}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">📱 Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">📍 Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street Address, City, State, ZIP Code"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              ✕ Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Creating...' : '✓ Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployeeForm
