import { MOCK_ADMIN_DASHBOARD, MOCK_ORDERS, MOCK_STAFF, MOCK_WORKER_TYPES, MOCK_INVENTORY, MOCK_ADMIN_SERVICES, MOCK_SERVICE_ITEMS, MOCK_SETTINGS, MOCK_ANALYTICS } from '@/data/dummyData'

export class MockCenterAdminAPI {
  async getDashboard() {
    return {
      success: true,
      data: MOCK_ADMIN_DASHBOARD
    };
  }

  async getOrders(params?: any) {
    return {
      success: true,
      data: {
        orders: MOCK_ORDERS,
        pagination: { total: 4, page: 1, limit: 10, totalPages: 1 }
      }
    };
  }
  async updateOrderStatus() { return { success: true }; }
  async assignStaffToOrder() { return { success: true }; }

  async getStaff() {
    return {
      success: true,
      data: { workers: MOCK_STAFF }
    };
  }
  async toggleStaffAvailability() { return { success: true }; }
  async getWorkerTypes() {
    return {
      success: true,
      data: { workerTypes: MOCK_WORKER_TYPES }
    };
  }
  async addWorker() { return { success: true }; }
  async updateWorker() { return { success: true }; }
  async deleteWorker() { return { success: true }; }

  async getAnalytics() {
    return {
      success: true,
      data: MOCK_ANALYTICS
    };
  }

  async getSettings() {
    return {
      success: true,
      data: MOCK_SETTINGS
    };
  }
  async updateSettings() { return { success: true }; }

  async getInventory() {
    return {
      success: true,
      data: { inventory: MOCK_INVENTORY }
    };
  }
  async addInventoryItem() { return { success: true }; }
  async updateInventoryStock() { return { success: true }; }
  async deleteInventoryItem() { return { success: true }; }

  async getNotifications() { return { success: true, data: { notifications: [] } }; }
  async getUnreadNotificationCount() { return { success: true, data: { unreadCount: 0 } }; }
  async markNotificationsAsRead() { return { success: true }; }
  async markAllNotificationsAsRead() { return { success: true }; }

  async getServices() {
    return {
      success: true,
      data: { services: MOCK_ADMIN_SERVICES }
    };
  }
  async createService() { return { success: true }; }
  async deleteService() { return { success: true }; }
  async toggleService() { return { success: true }; }
  async updateServiceSettings() { return { success: true }; }

  async getServiceItems() {
    return {
      success: true,
      data: { items: MOCK_SERVICE_ITEMS }
    };
  }
  async addServiceItem() { return { success: true }; }
  async updateServiceItem() { return { success: true }; }
  async deleteServiceItem() { return { success: true }; }
}
