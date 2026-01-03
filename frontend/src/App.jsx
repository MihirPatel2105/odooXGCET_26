import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import EmployeeManagement from './components/EmployeeManagement'
import AttendanceTracking from './components/AttendanceTracking'
import PayrollSystem from './components/PayrollSystem'
import Reports from './components/Reports'
import Settings from './components/Settings'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [activeTab, setActiveTab] = useState('employees') // For navbar tabs
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPage, setAuthPage] = useState('signin')
  const [user, setUser] = useState({
    name: 'John Smith',
    role: 'HR Manager',
    avatar: 'JS'
  })

  // Handle tab changes from navbar
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Map tab to view
    if (tab === 'employees') {
      setActiveView('dashboard') // Show employee dashboard
    } else if (tab === 'attendance') {
      setActiveView('attendance')
    } else if (tab === 'timeoff') {
      setActiveView('attendance') // Can show time off in attendance view
    }
  }

  const renderActiveView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'employees':
        return <EmployeeManagement />
      case 'attendance':
        return <AttendanceTracking />
      case 'payroll':
        return <PayrollSystem />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  const handleSignIn = (credentials) => {
    console.log('User signed in:', credentials)
    setUser({
      name: 'John Smith',
      role: 'HR Manager',
      avatar: 'JS'
    })
    setIsAuthenticated(true)
  }

  const handleSignUp = (formData) => {
    console.log('User signed up:', formData)
    setUser({
      name: formData.name,
      role: 'Employee',
      avatar: formData.name.split(' ').map(n => n[0]).join('')
    })
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthPage('signin')
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

  return (
    <div className="app">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
      <div className="main-content">
        <Navbar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          onLogout={handleLogout}
        />
        <div className="content-area">
          {renderActiveView()}
        </div>
      </div>
    </div>
  )
}

export default App
