import api from '../utils/api';

// Authentication APIs
export const authService = {
    // Admin Authentication
    adminLogin: (credentials) => api.post('/admin-auth/login', credentials),
    adminRegister: (data) => api.post('/admin-auth/register', data),
    adminLogout: () => api.post('/admin-auth/logout'),
    
    // Student Authentication
    studentLogin: (credentials) => api.post('/student-auth/login', credentials),
    studentRegister: (data) => api.post('/student-auth/register', data),
    studentLogout: () => api.post('/student-auth/logout'),
};

// Student Management APIs
export const studentService = {
    // Get all students
    getAllStudents: () => api.get('/students'),
    
    // Get single student
    getStudent: (id) => api.get(`/students/${id}`),
    
    // Create new student
    createStudent: (data) => api.post('/students', data),
    
    // Update student
    updateStudent: (id, data) => api.put(`/students/${id}`, data),
    
    // Delete student
    deleteStudent: (id) => api.delete(`/students/${id}`),
    
    // Get students by batch
    getStudentsByBatch: (batchId) => api.get(`/students/batch/${batchId}`),
};

// Result Management APIs
export const resultService = {
    // Get all results
    getAllResults: () => api.get('/results'),
    
    // Get single result
    getResult: (id) => api.get(`/results/${id}`),
    
    // Create new result
    createResult: (data) => api.post('/results', data),
    
    // Update result
    updateResult: (id, data) => api.put(`/results/${id}`, data),
    
    // Delete result
    deleteResult: (id) => api.delete(`/results/${id}`),
    
    // Get results by student
    getResultsByStudent: (studentId) => api.get(`/results/student/${studentId}`),
    
    // Get results by batch
    getResultsByBatch: (batchId) => api.get(`/results/batch/${batchId}`),
    
    // Get student's own results
    getStudentResults: () => api.get('/results/student'),
};

// Batch Management APIs
export const batchService = {
    // Get all batches
    getAllBatches: () => api.get('/batches'),
    
    // Get single batch
    getBatch: (id) => api.get(`/batches/${id}`),
    
    // Create new batch
    createBatch: (data) => api.post('/batches', data),
    
    // Update batch
    updateBatch: (id, data) => api.put(`/batches/${id}`, data),
    
    // Delete batch
    deleteBatch: (id) => api.delete(`/batches/${id}`),
};

// Subject Management APIs
export const subjectService = {
    // Get all subjects
    getAllSubjects: () => api.get('/subjects'),
    
    // Get single subject
    getSubject: (id) => api.get(`/subjects/${id}`),
    
    // Create new subject
    createSubject: (data) => api.post('/subjects', data),
    
    // Update subject
    updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
    
    // Delete subject
    deleteSubject: (id) => api.delete(`/subjects/${id}`),
};

// Dashboard APIs
export const dashboardService = {
    // Get admin dashboard stats
    getAdminDashboardStats: () => api.get('/dashboard/admin'),
    
    // Get student dashboard stats
    getStudentDashboardStats: () => api.get('/dashboard/student'),
};

// Profile Management APIs
export const profileService = {
    // Get profile
    getProfile: () => api.get('/profile'),
    
    // Update profile
    updateProfile: (data) => api.put('/profile', data),
    
    // Change password
    changePassword: (data) => api.put('/profile/password', data),
};

// Export all services
export default {
    authService,
    studentService,
    resultService,
    batchService,
    subjectService,
    dashboardService,
    profileService
}; 