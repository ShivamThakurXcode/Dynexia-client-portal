import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  googleAuth: (token) => api.post("/auth/google", { token }),
  logout: () => {
    localStorage.removeItem("token")
    return api.get("/auth/logout")
  },
  getCurrentUser: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/updatedetails", userData),
  updatePassword: (passwordData) => api.put("/auth/updatepassword", passwordData),
  forgotPassword: (email) => api.post("/auth/forgotpassword", { email }),
  resetPassword: (resetToken, password) => api.put(`/auth/resetpassword/${resetToken}`, { password }),
}

// Project services
export const projectService = {
  getProjects: (params) => api.get("/projects", { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post("/projects", projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
}

// Document services
export const documentService = {
  getDocuments: (params) => api.get("/documents", { params }),
  getDocument: (id) => api.get(`/documents/${id}`),
  uploadDocument: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    return api.post("/documents", formData, config)
  },
  deleteDocument: (id) => api.delete(`/documents/${id}`),
}

// Message services
export const messageService = {
  getMessages: (params) => api.get("/messages", { params }),
  sendMessage: (messageData) => api.post("/messages", messageData),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
}

// Invoice services
export const invoiceService = {
  getInvoices: (params) => api.get("/invoices", { params }),
  getInvoice: (id) => api.get(`/invoices/${id}`),
  createInvoice: (invoiceData) => api.post("/invoices", invoiceData),
  updateInvoiceStatus: (id, status) => api.put(`/invoices/${id}/status`, { status }),
  deleteInvoice: (id) => api.delete(`/invoices/${id}`),
}

// Onboarding services
export const onboardingService = {
  getOnboardingData: () => api.get("/onboarding"),
  submitOnboarding: (onboardingData) => api.post("/onboarding", onboardingData),
  updateOnboarding: (onboardingData) => api.put("/onboarding", onboardingData),
}

export default api
