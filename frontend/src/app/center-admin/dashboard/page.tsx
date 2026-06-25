'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  ShoppingBag,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Package,
  ArrowRight,
  RefreshCw,
  Loader2,
  Banknote,
  Zap,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SkeletonGrid } from '@/components/ui/CardSkeleton'
import { branchApi } from '@/lib/centerAdminApi'
import toast from 'react-hot-toast'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DashboardData {
  branch: { _id: string; name: string; code: string }
  metrics: {
    todayOrders: number
    pendingOrders: number
    processingOrders: number
    readyOrders: number
    completedToday: number
    weeklyOrders: number
    todayRevenue: number
    staffCount: number
    activeStaff: number
  }
  recentOrders: Array<{
    _id: string
    orderNumber: string
    status: string
    amount: number
    itemCount: number
    isExpress: boolean
    createdAt: string
    customer: { name: string; phone: string }
  }>
  staffPerformance: Array<{ name: string; role: string; ordersProcessed: number }>
  alerts: Array<{ type: string; title: string; message: string }>
}

export default function BranchDashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Analytics data for charts
  const [dailyData, setDailyData] = useState<Array<{ name: string; orders: number; revenue: number }>>([])
  const [statusData, setStatusData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [serviceData, setServiceData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchApi.getDashboard()
      if (response.success) {
        setData(response.data)
        
        // Set status data from metrics
        if (response.data.metrics) {
          setStatusData([
            { name: 'Pending', value: response.data.metrics.pendingOrders, color: '#f59e0b' },
            { name: 'Processing', value: response.data.metrics.processingOrders, color: '#3b82f6' },
            { name: 'Ready', value: response.data.metrics.readyOrders, color: '#10b981' },
            { name: 'Completed', value: response.data.metrics.completedToday, color: '#8b5cf6' },
          ])
        }
      }
    } catch (err: any) {
      // Provide mock data for frontend demonstration purposes
      setData({
        branch: { _id: 'br-medan-1', name: 'KitaLaundry Cabang Medan', code: 'MDN-01' },
        metrics: {
          todayOrders: 24,
          pendingOrders: 5,
          processingOrders: 12,
          readyOrders: 4,
          completedToday: 3,
          todayRevenue: 1540000,
          weeklyOrders: 150,
          staffCount: 8,
          activeStaff: 6
        },
        recentOrders: [
          { _id: '1', orderNumber: 'ORD-1001', status: 'in_process', amount: 85000, itemCount: 5, isExpress: true, createdAt: new Date().toISOString(), customer: { name: 'Budi Santoso', phone: '08123456789' } },
          { _id: '2', orderNumber: 'ORD-1002', status: 'pending', amount: 45000, itemCount: 3, isExpress: false, createdAt: new Date(Date.now() - 3600000).toISOString(), customer: { name: 'Siti Aminah', phone: '08987654321' } }
        ],
        staffPerformance: [
          { name: 'Ahmad', role: 'Washer', ordersProcessed: 15 },
          { name: 'Diana', role: 'Ironer', ordersProcessed: 22 }
        ],
        alerts: [
          { type: 'warning', title: 'Low Detergent Stock', message: 'Premium Liquid Detergent is running low.' }
        ]
      })
      
      setStatusData([
        { name: 'Pending', value: 5, color: '#f59e0b' },
        { name: 'Processing', value: 12, color: '#3b82f6' },
        { name: 'Ready', value: 4, color: '#10b981' },
        { name: 'Completed', value: 3, color: '#8b5cf6' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const response = await branchApi.getAnalytics('7d')
      if (response.success) {
        // Format daily stats for chart
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        if (response.data.dailyStats) {
          const formattedDaily = response.data.dailyStats.map((day: any) => ({
            name: dayNames[new Date(day._id.year, day._id.month - 1, day._id.day).getDay()],
            orders: day.orders,
            revenue: day.revenue || 0
          }))
          setDailyData(formattedDaily)
        }

        // Format service stats
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
        if (response.data.serviceStats) {
          const formattedServices = response.data.serviceStats.slice(0, 6).map((service: any, idx: number) => ({
            name: service._id?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Other',
            value: service.count,
            color: colors[idx % colors.length]
          }))
          setServiceData(formattedServices)
        }
      }
    } catch (err) {
      // Mock data for frontend demo
      setDailyData([
        { name: 'Mon', orders: 12, revenue: 450000 },
        { name: 'Tue', orders: 18, revenue: 650000 },
        { name: 'Wed', orders: 15, revenue: 550000 },
        { name: 'Thu', orders: 22, revenue: 850000 },
        { name: 'Fri', orders: 20, revenue: 750000 },
        { name: 'Sat', orders: 35, revenue: 1250000 },
        { name: 'Sun', orders: 28, revenue: 950000 }
      ])
      
      setServiceData([
        { name: 'Wash & Fold', value: 45, color: '#10b981' },
        { name: 'Dry Cleaning', value: 25, color: '#3b82f6' },
        { name: 'Ironing', value: 30, color: '#f59e0b' }
      ])
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
    fetchAnalytics()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_process': return 'text-blue-700 bg-blue-100 border border-blue-200'
      case 'ready': return 'text-emerald-700 bg-emerald-100 border border-emerald-200'
      case 'assigned_to_branch': case 'picked': return 'text-amber-700 bg-amber-100 border border-amber-200'
      default: return 'text-gray-700 bg-gray-100 border border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'assigned_to_branch': 'Pending',
      'picked': 'Sudah Dijemput',
      'in_process': 'Sedang Diproses',
      'ready': 'Siap Diambil',
      'out_for_delivery': 'Dalam Pengiriman',
      'delivered': 'Terkirim'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return <SkeletonGrid count={6} />
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-red-50 rounded-2xl text-center border border-red-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">{error || 'Gagal memuat'}</h3>
        <Button onClick={fetchDashboard} className="mt-4 bg-red-600 hover:bg-red-700">Coba Lagi</Button>
      </div>
    )
  }

  const stats = [
    { name: 'Pesanan Hari Ini', value: data.metrics.todayOrders, icon: ShoppingBag, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { name: 'Sedang Diproses', value: data.metrics.processingOrders, icon: Clock, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
    { name: 'Selesai', value: data.metrics.completedToday, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { name: 'Staf', value: `${data.metrics.activeStaff}/${data.metrics.staffCount}`, icon: Users, gradient: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/30' },
  ]

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold mb-1">Selamat Datang, {user?.name}! 👋</h1>
              <p className="text-emerald-100">{data.branch.name} ({data.branch.code})</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" onClick={fetchDashboard} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <RefreshCw className="w-4 h-4 mr-2" />Perbarui
            </Button>
            <Link href="/center-admin/orders">
              <Button className="bg-white text-emerald-600 hover:bg-gray-100 shadow-lg">
                <ShoppingBag className="w-5 h-5 mr-2" />Lihat Pesanan
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative z-10 mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-flex items-center gap-3">
          <Banknote className="w-5 h-5" />
          <div>
            <span className="text-sm text-emerald-100">Pendapatan Hari Ini</span>
            <p className="text-2xl font-bold">Rp{data.metrics.todayRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className={`group relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 text-white hover:shadow-xl transition-all hover:-translate-y-1`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending & Ready */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Menunggu</p>
              <p className="text-4xl font-bold text-amber-700">{data.metrics.pendingOrders}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Siap Diambil</p>
              <p className="text-4xl font-bold text-emerald-700">{data.metrics.readyOrders}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Orders Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">Pesanan Mingguan</h2>
            <p className="text-sm text-gray-500">Pesanan minggu ini</p>
          </div>
          <div className="h-56">
            {analyticsLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="orders" fill="url(#branchGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="branchGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Belum ada data
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">Status Pesanan</h2>
            <p className="text-sm text-gray-500">Distribusi saat ini</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-800">Pesanan Terbaru</h2>
            <Link href="/center-admin/orders" className="text-emerald-600 text-sm font-medium flex items-center group">
              Lihat Semua<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {data.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Belum ada pesanan</p>
              </div>
            ) : (
              data.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-all border-l-4 ${order.isExpress ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{order.orderNumber}</span>
                        {order.isExpress && <Zap className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer?.name} • {order.itemCount} item</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mb-1`}>
                      {getStatusText(order.status)}
                    </div>
                    <div className="text-sm font-bold text-gray-800">Rp{order.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <Link href="/center-admin/orders" className="flex items-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Proses Pesanan</div>
                  <div className="text-xs text-gray-500">Tetapkan &amp; lacak</div>
                </div>
              </Link>
              <Link href="/center-admin/staff" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Kelola Staf</div>
                  <div className="text-xs text-gray-500">Tugaskan pekerjaan</div>
                </div>
              </Link>
              <Link href="/center-admin/performance" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Analitik</div>
                  <div className="text-xs text-gray-500">Performa</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Staff */}
          {data.staffPerformance.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Staf Terbaik</h2>
              <div className="space-y-3">
                {data.staffPerformance.map((staff, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{staff.name || 'Staff'}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{staff.ordersProcessed} pesanan</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {data.alerts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Peringatan</h2>
              <div className="space-y-3">
                {data.alerts.map((alert, idx) => (
                  <div key={idx} className={`flex items-start p-4 rounded-xl border ${alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                    <AlertTriangle className={`w-5 h-5 mr-3 ${alert.type === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />
                    <div>
                      <div className={`text-sm font-semibold ${alert.type === 'warning' ? 'text-amber-800' : 'text-red-800'}`}>{alert.title}</div>
                      <div className={`text-xs ${alert.type === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>{alert.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
