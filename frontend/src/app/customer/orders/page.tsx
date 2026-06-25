'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/Pagination'
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Eye,
  RotateCcw,
  Star,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'

const ITEMS_PER_PAGE = 8

const statusConfig: Record<string, { color: string; icon: any; text: string }> = {
  placed: { color: 'text-blue-600 bg-blue-50', icon: Package, text: 'Ditempatkan' },
  assigned_to_branch: { color: 'text-indigo-600 bg-indigo-50', icon: Package, text: 'Ditetapkan' },
  assigned_to_logistics_pickup: { color: 'text-cyan-600 bg-cyan-50', icon: Truck, text: 'Penjemputan Dijadwalkan' },
  picked: { color: 'text-yellow-600 bg-yellow-50', icon: Truck, text: 'Sudah Dijemput' },
  in_process: { color: 'text-orange-600 bg-orange-50', icon: Clock, text: 'Sedang Diproses' },
  ready: { color: 'text-purple-600 bg-purple-50', icon: CheckCircle, text: 'Siap Diambil' },
  assigned_to_logistics_delivery: { color: 'text-teal-600 bg-teal-50', icon: Truck, text: 'Dalam Pengiriman' },
  out_for_delivery: { color: 'text-teal-600 bg-teal-50', icon: Truck, text: 'Dalam Pengiriman' },
  delivered: { color: 'text-green-600 bg-green-50', icon: CheckCircle, text: 'Terkirim' },
  cancelled: { color: 'text-red-600 bg-red-50', icon: AlertCircle, text: 'Dibatalkan' },
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const { orders, pagination, loading, fetchOrders } = useOrders()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    fetchOrders({ 
      page: currentPage, 
      limit: ITEMS_PER_PAGE, 
      search: searchTerm, 
      status: statusFilter 
    })
  }, [fetchOrders, currentPage, searchTerm, statusFilter])

  const paginatedOrders = orders
  const totalPages = pagination.totalPages || 1
  const totalItems = pagination.totalItems || 0

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status]
    return config ? config.icon : Package
  }

  const getStatusColor = (status: string) => {
    const config = statusConfig[status]
    return config ? config.color : 'text-gray-600 bg-gray-50'
  }

  const getStatusText = (status: string) => {
    const config = statusConfig[status]
    return config ? config.text : status
  }

  const canCancel = (status: string) => {
    return ['placed', 'assigned_to_branch', 'assigned_to_logistics_pickup'].includes(status)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tombol Kembali */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pesanan Saya</h1>
            <p className="text-gray-600">Lacak dan kelola pesanan laundry Anda</p>
          </div>
          <Link href="/customer/orders/new">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Pesanan Baru
            </Button>
          </Link>
        </div>

        {/* Pencarian dan Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nomor pesanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Status</option>
              <option value="placed">Ditempatkan</option>
              <option value="picked">Sudah Dijemput</option>
              <option value="in_process">Sedang Diproses</option>
              <option value="ready">Siap Diambil</option>
              <option value="delivered">Terkirim</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* Daftar Pesanan */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada pesanan ditemukan</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Coba sesuaikan pencarian atau filter Anda' 
                : 'Mulai dengan membuat pesanan pertama Anda'
              }
            </p>
            <Link href="/customer/orders/new">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Buat Pesanan
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{order.orderNumber}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            {order.items?.length || 0} item
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-800">
                        Rp{order.pricing?.total || 0}
                      </span>
                      <div className="flex gap-2">
                        <Link href={`/customer/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Lihat
                          </Button>
                        </Link>
                        {order.status === 'delivered' && !order.rating?.score && (
                          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <Star className="w-4 h-4 mr-1" />
                            Nilai
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <Pagination
                  current={currentPage}
                  pages={totalPages}
                  total={totalItems}
                  limit={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                  itemName="pesanan"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
