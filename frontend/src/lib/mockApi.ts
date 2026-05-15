import { MOCK_ORDERS, MOCK_ADDRESSES } from '@/data/dummyData'

export const mockCustomerAPI = {
  getOrders: () => Promise.resolve({ data: { success: true, data: { orders: MOCK_ORDERS } } }),
  createOrder: () => Promise.resolve({ data: { success: true, data: { order: { _id: 'new1' } } } }),
  getOrder: (id: string) => Promise.resolve({ data: { success: true, data: { order: { ...MOCK_ORDERS[0], _id: id } } } }),
  getOrderTracking: () => Promise.resolve({ data: { success: true, data: { tracking: [{ status: 'placed', date: new Date().toISOString() }, { status: 'in_process', date: new Date().toISOString() }] } } }),
  cancelOrder: () => Promise.resolve({ data: { success: true } }),
  rateOrder: () => Promise.resolve({ data: { success: true } }),
  reorder: () => Promise.resolve({ data: { success: true } }),

  getAddresses: () => Promise.resolve({ data: { success: true, data: { addresses: MOCK_ADDRESSES } } }),
  addAddress: () => Promise.resolve({ data: { success: true } }),
  updateAddress: () => Promise.resolve({ data: { success: true } }),
  deleteAddress: () => Promise.resolve({ data: { success: true } }),
  setDefaultAddress: () => Promise.resolve({ data: { success: true } }),

  getNotifications: () => Promise.resolve({ data: { success: true, data: { notifications: [] } } }),
  markNotificationRead: () => Promise.resolve({ data: { success: true } })
};

export const mockServicesAPI = {
  calculatePricing: () => Promise.resolve({ data: { success: true, data: { subtotal: 50000, tax: 5000, total: 55000 } } }),
  getTimeSlots: () => Promise.resolve({ data: { success: true, data: { timeSlots: ['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00'] } } }),
  checkServiceAvailability: () => Promise.resolve({ data: { success: true, data: { available: true } } })
};

export const mockAdminAPI = {
  getOrders: () => Promise.resolve({ data: { success: true, data: { orders: [] } } }),
  assignOrderToBranch: () => Promise.resolve({ data: { success: true } }),
  assignOrderToLogistics: () => Promise.resolve({ data: { success: true } }),
  processRefund: () => Promise.resolve({ data: { success: true } }),
  getCustomers: () => Promise.resolve({ data: { success: true, data: { customers: [] } } }),
  updateCustomerStatus: () => Promise.resolve({ data: { success: true } }),
  toggleVIPStatus: () => Promise.resolve({ data: { success: true } }),
};

export const mockAuthAPI = {
  login: (credentials: { email: string; password: string }) =>
    Promise.resolve({
      data: {
        success: true,
        data: {
          token: 'demo-token',
          user: {
            _id: 'demo-user-001',
            name: 'Demo Customer',
            email: credentials.email,
            phone: '08123456789',
            role: 'customer' as const,
            isActive: true,
          },
        },
      },
    }),
  register: () => Promise.resolve({ data: { success: true } }),
  verifyEmail: () => Promise.resolve({ data: { success: true } }),
  resendVerification: () => Promise.resolve({ data: { success: true } }),
  getProfile: () => Promise.resolve({ data: { success: true, data: { user: { name: 'Demo Customer', email: 'customer@demo.com', phone: '08123456789' } } } }),
};

export const mockBarcodeAPI = {
  scanBarcode: () => Promise.resolve({ data: { success: true } }),
  getOrderBarcode: () => Promise.resolve({ data: { success: true } }),
  updateStatusViaScan: () => Promise.resolve({ data: { success: true } }),
  bulkScan: () => Promise.resolve({ data: { success: true } }),
};
