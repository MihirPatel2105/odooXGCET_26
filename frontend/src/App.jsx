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

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [activeTab, setActiveTab] = useState('employees') // For navbar tabs
  const [user] = useState({
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

  return (
    <div className="app">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="main-content">
        <Navbar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
        />
        <div className="content-area">
          {renderActiveView()}
        </div>
      </div>
    </div>
  )
}

export default App
