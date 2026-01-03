import { useState } from 'react'
import './App.css'
import { authAPI } from './services/api'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import EmployeeManagement from './components/EmployeeManagement'
import AttendanceTracking from './components/AttendanceTracking'
import TimeOff from './components/TimeOff'
import PayrollSystem from './components/PayrollSystem'
import Reports from './components/Reports'
import Settings from './components/Settings'
import Profile from './components/Profile'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
// Employee Portal Components
import EmployeeNavbar from './components/employee/EmployeeNavbar'
import EmployeeDashboard from './components/employee/EmployeeDashboard'
import EmployeeAttendance from './components/employee/EmployeeAttendance'
import EmployeeTimeOff from './components/employee/EmployeeTimeOff'
import EmployeePayroll from './components/employee/EmployeePayroll'
import EmployeeProfile from './components/employee/EmployeeProfile'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [activeTab, setActiveTab] = useState('employees') // For navbar tabs
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPage, setAuthPage] = useState('signin')
  const [user, setUser] = useState(null)

  // Handle tab changes from navbar
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Map tab to view
    if (tab === 'employees') {
      setActiveView('dashboard') // Show employee dashboard
    } else if (tab === 'attendance') {
      setActiveView('attendance')
    } else if (tab === 'timeoff') {
      setActiveView('timeoff') // Show time off view
    }
  }

  // Render view based on user role
  const renderActiveView = () => {
    const isEmployee = user?.role === 'EMPLOYEE'
    
    if (isEmployee) {
      // Employee Portal Views - Only Dashboard, Attendance, Time Off, and Profile
      switch(activeView) {
        case 'dashboard':
          return <EmployeeDashboard user={user} />
        case 'attendance':
          return <EmployeeAttendance user={user} />
        case 'timeoff':
          return <EmployeeTimeOff user={user} />
        case 'profile':
          return <EmployeeProfile user={user} />
        default:
          return <EmployeeDashboard user={user} />
      }
    } else {
      // Admin Portal Views
      switch(activeView) {
        case 'dashboard':
          return <Dashboard />
        case 'employees':
          return <EmployeeManagement />
        case 'attendance':
          return <AttendanceTracking />
        case 'timeoff':
          return <TimeOff userRole={user.role} />
        case 'payroll':
          return <PayrollSystem />
        case 'reports':
          return <Reports />
        case 'settings':
          return <Settings />
        case 'profile':
          return <Profile user={user} />
        default:
          return <Dashboard />
      }
    }
  }

  const handleSignIn = async (credentials) => {
    try {
      // Format credentials for backend
      const loginData = {
        loginIdOrEmail: credentials.identifier,
        password: credentials.password
      }

      const response = await authAPI.signIn(loginData)
      if (response.success && response.user) {
        // Get name from employee or user data
        const userName = response.employee?.fullName || response.user.email.split('@')[0]
        const userData = {
          name: userName,
          role: response.user.role,
          email: response.user.email,
          loginId: response.user.loginId,
          companyName: response.user.companyId?.name || 'Company',
          avatar: userName.split(' ').map(n => n[0]).join('').toUpperCase(),
          createdAt: response.user.createdAt
        }
        setUser(userData)
        setIsAuthenticated(true)
        // Store token and user data
        if (response.token) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } else {
        alert(response.message || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Sign in failed. Please check your credentials.')
    }
  }

  const handleSignUp = async (formData) => {
    try {
      // Generate loginId from name and company
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts[nameParts.length - 1] || ''
      const companyCode = formData.companyName.toUpperCase().replace(/\s+/g, '_').substring(0, 2)
      const year = new Date().getFullYear()
      const loginId = `${companyCode}${firstName.substring(0, 2).toUpperCase()}${lastName.substring(0, 2).toUpperCase()}${year}001`

      // Format data for backend
      const signupData = {
        companyName: formData.companyName,
        companyCode: formData.companyName.toUpperCase().replace(/\s+/g, '_'), // Generate code from name
        logo: formData.photo ? await convertToBase64(formData.photo) : '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        loginId: loginId
      }

      const response = await authAPI.signUp(signupData)
      if (response.success) {
        // Backend returns data.user and data.token
        const userData = response.data?.user || response.user
        const employeeData = response.data?.employee || response.employee
        const token = response.data?.token || response.token
        
        if (userData) {
          const userName = employeeData?.fullName || formData.name
          setUser({
            name: userName,
            role: userData.role || 'Admin',
            avatar: userName.split(' ').map(n => n[0]).join('').toUpperCase()
          })
          setIsAuthenticated(true)
          // Store token if provided
          if (token) {
            localStorage.setItem('token', token)
          }
        } else {
          alert(response.message || 'Registration failed')
        }
      } else {
        alert(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      alert('Sign up failed. Please try again.')
    }
  }

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setAuthPage('signin')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        {authPage === 'signin' ? (
          <SignIn 
            onSignIn={handleSignIn} 
            onSwitchToSignUp={() => setAuthPage('signup')}
          />
        ) : (
          <SignUp 
            onSignUp={handleSignUp}
            onSwitchToSignIn={() => setAuthPage('signin')}
          />
        )}
      </div>
    )
  }

  // Check if user is employee
  const isEmployee = user?.role === 'EMPLOYEE'

  return (
    <div className="app">
      {isEmployee ? (
        <EmployeeNavbar 
          user={user}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />
      ) : (
        <Navbar 
          user={user} 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />
      )}
      <div className="content-area">
        {renderActiveView()}
      </div>
    </div>
  )

  return (
    <div className="app">
      <Navbar 
        user={user} 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <div className="content-area">
        {renderActiveView()}
      </div>
    </div>
  )
};

export default App
