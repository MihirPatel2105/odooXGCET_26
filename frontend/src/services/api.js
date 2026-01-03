// API Configuration
const API_BASE_URL = '/api' // Using Vite proxy

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      // Use the backend error message if available
      throw new Error(data.message || `API call failed: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Auth APIs
export const authAPI = {
  signIn: (credentials) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  signUp: (userData) => 
    apiCall('/company/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: () => 
    apiCall('/auth/logout', {
      method: 'POST',
    }),
}

// Employee APIs
export const employeeAPI = {
  // Employee endpoint
  getSelf: () => apiCall('/employees/self/profile'),
  
  // Admin endpoints
  getAll: () => apiCall('/employees'),
  
  getById: (id) => apiCall(`/employees/${id}`),
  
  create: (employeeData) => 
    apiCall('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    }),
  
  update: (id, employeeData) => 
    apiCall(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    }),
  
  delete: (id) => 
    apiCall(`/employees/${id}`, {
      method: 'DELETE',
    }),
}

// Attendance APIs
export const attendanceAPI = {
  // Employee endpoints
  checkIn: () => 
    apiCall('/attendance/check-in', {
      method: 'POST',
    }),
  
  checkOut: () => 
    apiCall('/attendance/check-out', {
      method: 'POST',
    }),
  
  getSelf: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return apiCall(`/attendance/self${params.toString() ? '?' + params.toString() : ''}`);
  },
  
  // Admin endpoints
  getByEmployee: (employeeId) => 
    apiCall(`/attendance/employee/${employeeId}`),
  
  getByDate: (date) => 
    apiCall(`/attendance/date/${date}`),
  
  getAll: () => apiCall('/attendance/all'),
  
  getToday: () => apiCall('/attendance/today'),
}

// Leave/Time Off APIs
export const leaveAPI = {
  // Employee endpoints
  getSelf: () => apiCall('/leaves/self'),
  
  getBalance: () => apiCall('/leaves/balance'),
  
  create: (leaveData) => 
    apiCall('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    }),
  
  // Admin endpoints
  getAll: () => apiCall('/leaves'),
  
  getByEmployee: (employeeId) => 
    apiCall(`/leaves/employee/${employeeId}`),
  
  approve: (leaveId) => 
    apiCall(`/leaves/${leaveId}/approve`, {
      method: 'PUT',
    }),
  
  reject: (leaveId, adminComment) => 
    apiCall(`/leaves/${leaveId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ adminComment }),
    }),
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  
  getRecentActivity: () => apiCall('/dashboard/activity'),
}

// Company APIs
export const companyAPI = {
  register: (companyData) => 
    apiCall('/company/register', {
      method: 'POST',
      body: JSON.stringify(companyData),
    }),
  
  getDetails: () => apiCall('/company'),
  
  getProfile: () => apiCall('/company/profile'),
  
  update: (companyData) => 
    apiCall('/company/profile', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    }),
}

// Profile APIs
export const profileAPI = {
  getProfile: () => apiCall('/profile'),
  
  update: (profileData) => 
    apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  
  changePassword: (passwordData) => 
    apiCall('/profile/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
}

// Salary/Payroll APIs
export const salaryAPI = {
  // Employee endpoint
  getMySalary: () => apiCall('/salaries/self'),
  
  // Admin endpoints
  getAll: () => apiCall('/salaries'),
  
  getById: (id) => apiCall(`/salaries/${id}`),
  
  create: (salaryData) => 
    apiCall('/salaries', {
      method: 'POST',
      body: JSON.stringify(salaryData),
    }),
  
  update: (id, salaryData) => 
    apiCall(`/salaries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(salaryData),
    }),
  
  delete: (id) => 
    apiCall(`/salaries/${id}`, {
      method: 'DELETE',
    }),
}

export default {
  authAPI,
  employeeAPI,
  attendanceAPI,
  leaveAPI,
  dashboardAPI,
  companyAPI,
  profileAPI,
  salaryAPI,
}
