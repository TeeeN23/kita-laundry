'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp,
  RefreshCw,
  Loader2,
  Package,
  Banknote,
  Users,
  Clock,
  Calendar,
  Download
} from 'lucide-react'
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
  Legend,
  LineChart,
  Line
} from 'recharts'

interface AnalyticsData {
  branch: { name: string; code: string }
  timeframe: string
  totals: {
    totalOrders: number
    totalRevenue: number
    avgOrderValue: number
  }
  dailyStats: Array<{
    _id: { year: number; month: number; day: number }
    orders: number
    revenue: number
  }>
  serviceStats: Array<{
    _id: string
    count: number
    revenue: number
  }>
  statusDistribution: Array<{
    _id: string
    count: number
  }>
  staffPerformance: Array<{
    name: string
    ordersProcessed: number
    revenue: number
  }>
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export default function BranchPerformancePage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7d')
  const [revenueChartType, setRevenueChartType] = useState<'bar' | 'line'>('bar')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await branchApi.getAnalytics(timeframe)
      if (response.success) {
        setData(response.data)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'placed': 'Ditempatkan',
      'assigned_to_branch': 'Menunggu',
      'picked': 'Sudah Dijemput',
      'in_process': 'Sedang Diproses',
      'ready': 'Siap Diambil',
      'out_for_delivery': 'Dalam Pengiriman',
      'delivered': 'Terkirim',
      'cancelled': 'Dibatalkan'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'placed': 'bg-gray-500',
      'assigned_to_branch': 'bg-orange-500',
      'picked': 'bg-yellow-500',
      'in_process': 'bg-blue-500',
      'ready': 'bg-green-500',
      'out_for_delivery': 'bg-purple-500',
      'delivered': 'bg-emerald-500',
      'cancelled': 'bg-red-500'
    }
    return colorMap[status] || 'bg-gray-500'
  }


  const handleExport = () => {
    if (!data) return
    
    const csvContent = [
      ['Branch Performance Report'],
      [`Branch: ${data.branch.name} (${data.branch.code})`],
      [`Timeframe: ${timeframe}`],
      [''],
      ['Summary'],
      ['Total Orders', data.totals.totalOrders],
      ['Total Revenue', `Rp${data.totals.totalRevenue}`],
      ['Avg Order Value', `Rp${Math.round(data.totals.avgOrderValue)}`],
      [''],
      ['Daily Stats'],
      ['Date', 'Orders', 'Revenue'],
      ...data.dailyStats.map(d => [
        `${d._id.day}/${d._id.month}/${d._id.year}`,
        d.orders,
        `Rp${d.revenue}`
      ]),
      [''],
      ['Service Breakdown'],
      ['Service', 'Count', 'Revenue'],
      ...data.serviceStats.map(s => [s._id || 'Unknown', s.count, `Rp${s.revenue}`]),
      [''],
      ['Staff Performance'],
      ['Name', 'Orders', 'Revenue'],
      ...data.staffPerformance.map(s => [s.name, s.ordersProcessed, `Rp${s.revenue}`])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `branch-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Analitik berhasil diekspor')
  }

  // Transform data for charts
  const dailyChartData = data?.dailyStats.map(d => ({
    date: `${d._id.day}/${d._id.month}`,
    orders: d.orders,
    revenue: d.revenue
  })) || []

  const serviceChartData = data?.serviceStats.map(s => ({
    name: s._id?.replace(/_/g, ' ') || 'Unknown',
    value: s.count,
    revenue: s.revenue
  })) || []

  const statusChartData = data?.statusDistribution.map(s => ({
    name: getStatusText(s._id),
    value: s.count
  })) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 bg-red-50 rounded-xl text-center">
        <p className="text-red-600">Gagal memuat analitik</p>
        <Button onClick={fetchAnalytics} className="mt-4">Coba Lagi</Button>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analitik Performa</h1>
          <p className="text-gray-600">{data.branch.name} ({data.branch.code})</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="24h">24 Jam Terakhir</option>
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
          </select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Perbarui
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Pesanan</p>
              <p className="text-3xl font-bold">{data.totals.totalOrders}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Pendapatan</p>
              <p className="text-3xl font-bold">Rp{data.totals.totalRevenue.toLocaleString()}</p>
            </div>
            <Banknote className="w-12 h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Rata-rata Nilai Pesanan</p>
              <p className="text-3xl font-bold">Rp{Math.round(data.totals.avgOrderValue).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Pesanan Harian
          </h2>
          {dailyChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [Number(value), 'Pesanan']}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Service Breakdown Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
            Perincian Layanan
          </h2>
          {serviceChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                  >
                    {serviceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name, props: any) => [
                      `${value} pesanan (Rp${props.payload.revenue.toLocaleString()})`,
                      props.payload.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>


      {/* Status Distribution & Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Distribusi Status Pesanan
          </h2>
          {statusChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Staff Performance Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Performa Staf
          </h2>
          {data.staffPerformance.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data staf
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data.staffPerformance.slice(0, 5)} 
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      name === 'ordersProcessed' ? Number(value) : `Rp${Number(value).toLocaleString()}`,
                      name === 'ordersProcessed' ? 'Pesanan' : 'Pendapatan'
                    ]}
                  />
                  <Bar dataKey="ordersProcessed" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>


      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Tren Pendapatan
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setRevenueChartType('bar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                revenueChartType === 'bar' 
                  ? 'bg-white text-green-600 shadow-sm font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setRevenueChartType('line')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                revenueChartType === 'line' 
                  ? 'bg-white text-green-600 shadow-sm font-medium' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Curve
            </button>
          </div>
        </div>
        {dailyChartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Belum ada data
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {revenueChartType === 'bar' ? (
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `Rp${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`Rp${Number(value).toLocaleString()}`, 'Pendapatan']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `Rp${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`Rp${Number(value).toLocaleString()}`, 'Pendapatan']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Wawasan Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Layanan Terpopuler</p>
            <p className="text-lg font-bold text-gray-800 capitalize">
              {data.serviceStats[0]?._id?.replace(/_/g, ' ') || 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Performa Terbaik</p>
            <p className="text-lg font-bold text-gray-800">
              {data.staffPerformance[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Tingkat Penyelesaian</p>
            <p className="text-lg font-bold text-green-600">
              {data.totals.totalOrders > 0 
                ? Math.round((data.statusDistribution.find(s => s._id === 'delivered')?.count || 0) / data.totals.totalOrders * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
