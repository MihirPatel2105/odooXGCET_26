import { useState } from 'react'
import '../styles/Auth.css'

export default function SignIn({ onSignIn, onSwitchToSignUp }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [inputType, setInputType] = useState('email')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or Login ID is required'
    } else if (inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) {
      // Only validate email format if it looks like an email
      if (formData.identifier.includes('@')) {
        newErrors.identifier = 'Please enter a valid email'
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Sign In:', formData)
      onSignIn(formData)
    }
  }

  const handleIdentifierChange = (value) => {
    setFormData(prev => ({ ...prev, identifier: value }))
    // Auto-detect if it's an email or login ID
    if (value.includes('@')) {
      setInputType('email')
    } else {
      setInputType('id')
    }
    if (errors.identifier) {
      setErrors(prev => ({ ...prev, identifier: '' }))
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="60" height="60" rx="10" fill="url(#logoGradient)" />
            <text x="50" y="60" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">OG</text>
          </svg>
          <h1>OdooXGCET</h1>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>

          {/* Combined Email/Login ID Field */}
          <div className="form-group">
            <label htmlFor="identifier">Email or Login ID</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={(e) => handleIdentifierChange(e.target.value)}
              placeholder="Enter email or login ID"
              className={errors.identifier ? 'input-error' : ''}
            />
            {errors.identifier && <span className="error-message">{errors.identifier}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="form-footer">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">Sign In</button>

          {/* Sign Up Link */}
          <p className="auth-link">
            Don't have an account? <a onClick={onSwitchToSignUp} className="link-primary">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  )
}
