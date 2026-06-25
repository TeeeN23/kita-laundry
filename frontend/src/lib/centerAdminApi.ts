const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Center Admin API (previously Branch Manager)
class CenterAdminAPI {
  private getAuthHeaders() {
    // Get token from laundry-auth localStorage (zustand persist format)
    let token = null
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('laundry-auth')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          token = parsed.state?.token || parsed.token
        } catch (e) {
          console.error('Error parsing auth data:', e)
        }
      }
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async handleResponse(response: Response) {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    return data
  }

  // Dashboard
  async getDashboard() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  // Orders
  async getOrders(params?: { page?: number; limit?: number; status?: string; search?: string; priority?: string }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') searchParams.append(key, value.toString())
      })
    }
    const response = await fetch(`${API_BASE_URL}/admin/orders?${searchParams}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status, notes })
    })
    return this.handleResponse(response)
  }

  async assignStaffToOrder(orderId: string, staffId: string, estimatedTime?: string) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ staffId, estimatedTime })
    })
    return this.handleResponse(response)
  }


  // Staff
  async getStaff(params?: { page?: number; limit?: number; search?: string; typeFilter?: string; statusFilter?: string }) {
    const queryParams = new URLSearchParams({ role: 'staff' })
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.typeFilter && params.typeFilter !== 'all') queryParams.append('typeFilter', params.typeFilter)
    if (params?.statusFilter && params.statusFilter !== 'all') queryParams.append('statusFilter', params.statusFilter)

    const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams.toString()}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    
    // Transform data to match staff page requirements if needed, or it handles the raw user array
    const data = await this.handleResponse(response);
    
    if (data.success && data.data && data.data.users) {
       // Staff page expects response.data.staff
       return {
         success: true,
         data: {
           staff: data.data.users.map((u: any) => ({
             ...u,
             stats: u.stats || { ordersToday: 0, totalOrders: 0, efficiency: 100 }
           })),
           pagination: data.data.pagination
         }
       }
    }
    return data;
  }

  async toggleStaffAvailability(staffId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/staff/${staffId}/availability`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  // Analytics
  async getAnalytics(timeframe: string = '7d') {
    const response = await fetch(`${API_BASE_URL}/admin/analytics?timeframe=${timeframe}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  // Settings
  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/center-admin/settings`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async updateSettings(data: { operatingHours?: any; settings?: any }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  // Inventory
  async getInventory() {
    const response = await fetch(`${API_BASE_URL}/admin/inventory`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async addInventoryItem(data: { itemName: string; currentStock: number; minThreshold?: number; maxCapacity?: number; unit?: string; unitCost?: number; supplier?: string; expiryDate?: string }) {
    const response = await fetch(`${API_BASE_URL}/admin/inventory`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async updateInventoryStock(itemId: string, quantity: number, action: 'add' | 'consume', reason?: string) {
    const response = await fetch(`${API_BASE_URL}/admin/inventory/${itemId}/stock`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ quantity, action, reason })
    })
    return this.handleResponse(response)
  }

  async deleteInventoryItem(itemId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/inventory/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }


  // Worker Management
  async getWorkerTypes() {
    const response = await fetch(`${API_BASE_URL}/center-admin/worker-types`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async addWorker(data: { name: string; email: string; phone: string; password?: string; workerType: string }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/workers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async updateWorker(workerId: string, data: { name?: string; phone?: string; workerType?: string; isActive?: boolean }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/workers/${workerId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async deleteWorker(workerId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/workers/${workerId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  // Notifications
  async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const searchParams = new URLSearchParams()
    if (params) {
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.unreadOnly) searchParams.append('unreadOnly', 'true')
    }
    const response = await fetch(`${API_BASE_URL}/center-admin/notifications?${searchParams}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async getUnreadNotificationCount() {
    const response = await fetch(`${API_BASE_URL}/center-admin/notifications/unread-count`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async markNotificationsAsRead(notificationIds: string[]) {
    const response = await fetch(`${API_BASE_URL}/center-admin/notifications/mark-read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ notificationIds })
    })
    return this.handleResponse(response)
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/center-admin/notifications/mark-all-read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }


  // Services Management
  async getServices() {
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async createService(data: any) {
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async deleteService(serviceId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async toggleService(serviceId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/toggle`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async updateServiceSettings(serviceId: string, data: { priceMultiplier?: number; customTurnaround?: { standard?: number; express?: number }; displayName?: string; description?: string; category?: string; icon?: string }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/services/${serviceId}/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  // Service Items Management
  async getServiceItems(serviceId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/services/${serviceId}/items`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  async addServiceItem(serviceId: string, data: { name: string; category: string; basePrice: number; description?: string }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/services/${serviceId}/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async updateServiceItem(serviceId: string, itemId: string, data: { name?: string; category?: string; basePrice?: number; description?: string }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/services/${serviceId}/items/${itemId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async deleteServiceItem(serviceId: string, itemId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/services/${serviceId}/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    })
    return this.handleResponse(response)
  }
}

export const centerAdminApi = new CenterAdminAPI()
export const branchApi = centerAdminApi
