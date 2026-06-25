import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { useSuperAdminStore } from '@/store/superAdminStore'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Send cookies with every request
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check if it's a superadmin route - use super admin token
    const isSuperAdminRoute = config.url?.includes('superadmin')
    
    if (isSuperAdminRoute) {
      const superAdminToken = useSuperAdminStore.getState().token
      if (superAdminToken) {
        config.headers.Authorization = `Bearer ${superAdminToken}`
      }
    } else {
      // Use regular auth token for other routes
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    const requestUrl = error.config?.url || ''
    const isSuperAdminRoute = requestUrl.includes('superadmin')
    const errorCode = error.response?.data?.code
    
    if (error.response?.status === 401) {
      // Check if store is hydrated before showing session expired
      const authStore = useAuthStore.getState()
      const superAdminStore = useSuperAdminStore.getState()
      
      if (isSuperAdminRoute) {
        // Only show session expired if user was actually logged in
        if (superAdminStore.token) {
          superAdminStore.logout()
          toast.error('Session expired. Please login again.')
          window.location.href = '/superadmin/auth/login'
        }
      } else {
        // Only show session expired if user was actually logged in
        if (authStore.token && authStore._hasHydrated) {
          authStore.logout()
          toast.error('Session expired. Please login again.')
          window.location.href = '/auth/login'
        }
      }
    } else if (error.response?.status === 403) {
      // Don't show toast for PERMISSION_DENIED errors - let components handle it silently
      if (errorCode !== 'PERMISSION_DENIED') {
        toast.error(message)
      }
    } else if (error.response?.status >= 400) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Export real APIs and mix with mocks for remaining features
export const authAPI = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  oauth: async (provider: string, token: string) => {
    const response = await api.post('/auth/oauth', { provider, token })
    return response.data
  },

  register: (userData: any) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  resendVerification: (email: string) => api.post('/auth/resend-verification', { email })
}

export const customerAPI = {
  getOrders: (params?: any) => api.get('/orders', { params }),
  createOrder: (orderData: any) => api.post('/orders', orderData),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  getOrderTracking: (id: string) => api.get(`/orders/${id}/tracking`),
  cancelOrder: (id: string) => api.post(`/orders/${id}/cancel`),
  rateOrder: (id: string, rating: any) => api.post(`/orders/${id}/rate`, rating),
  reorder: (id: string) => api.post(`/orders/${id}/reorder`),
  
  getAddresses: () => api.get('/addresses'),
  addAddress: (address: any) => api.post('/addresses', address),
  updateAddress: (id: string, address: any) => api.put(`/addresses/${id}`, address),
  deleteAddress: (id: string) => api.delete(`/addresses/${id}`),
  setDefaultAddress: (id: string) => api.put(`/addresses/${id}/set_default`),

  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: string) => api.put(`/notifications/mark_read`, { id }),
  getUnreadNotificationCount: () => api.get('/notifications/unread_count')
}

export const servicesAPI = {
  calculatePricing: (items: any[], isExpress: boolean) => api.post('/services/calculate', { items, isExpress }),
  getTimeSlots: () => api.get('/services/time_slots'),
  checkServiceAvailability: () => api.get('/services/availability'),
  getBranches: () => api.get('/services/branches')
}

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  assignOrderToBranch: (orderId: string, branchId: string) => api.post(`/admin/orders/${orderId}/assign_to_branch`, { branchId }),
  assignOrderToLogistics: (orderId: string, driverId: string) => api.post(`/admin/orders/${orderId}/assign_to_logistics`, { driverId }),
  processRefund: (orderId: string, data: any) => api.post(`/admin/orders/${orderId}/process_refund`, data),
  
  getCustomers: () => api.get('/admin/users?role=customer'),
  updateCustomerStatus: (id: string, status: any) => api.put(`/admin/users/${id}/status`, status),
  toggleVIPStatus: (id: string) => api.put(`/admin/users/${id}/toggle_vip`),
  
  getUsers: (role?: string) => api.get(`/admin/users${role ? `?role=${role}` : ''}`),
  createUser: (userData: any) => api.post('/admin/users', userData),
  updateUser: (id: string, userData: any) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
}

export const barcodeAPI = {
  scanBarcode: (barcode: string) => api.post('/admin/orders/scan_barcode', { barcode }),
  getOrderBarcode: (id: string) => api.get(`/admin/orders/${id}/barcode`),
  updateStatusViaScan: (barcode: string, newStatus: string) => api.post('/admin/orders/scan_barcode', { barcode, newStatus }),
  bulkScan: (barcodes: string[], newStatus: string) => api.post('/admin/orders/bulk_scan', { barcodes, newStatus })
}

export default api
