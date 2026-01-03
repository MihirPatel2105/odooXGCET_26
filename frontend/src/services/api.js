// API Configuration
const API_BASE_URL = '/api' // Using Vite proxy

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return await response.json()
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
  checkIn: (employeeId) => 
    apiCall('/attendance/checkin', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    }),
  
  checkOut: (employeeId) => 
    apiCall('/attendance/checkout', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    }),
  
  getByEmployee: (employeeId) => 
    apiCall(`/attendance/employee/${employeeId}`),
  
  getAll: () => apiCall('/attendance'),
}

// Leave/Time Off APIs
export const leaveAPI = {
  getAll: () => apiCall('/leaves'),
  
  getByEmployee: (employeeId) => 
    apiCall(`/leaves/employee/${employeeId}`),
  
  create: (leaveData) => 
    apiCall('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    }),
  
  approve: (leaveId) => 
    apiCall(`/leaves/${leaveId}/approve`, {
      method: 'PUT',
    }),
  
  reject: (leaveId) => 
    apiCall(`/leaves/${leaveId}/reject`, {
      method: 'PUT',
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

export default {
  authAPI,
  employeeAPI,
  attendanceAPI,
  leaveAPI,
  dashboardAPI,
  companyAPI,
  profileAPI,
}
