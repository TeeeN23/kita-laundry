'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, Shield, Truck, Clock, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  
  const redirectUrl = searchParams.get('redirect')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.login(formData)
      const { token, user } = response.data.data

      setAuth(user, token)
      toast.success('Login berhasil!')

      if (redirectUrl && user.role === 'customer') {
        setTimeout(() => {
          router.push(redirectUrl)
        }, 100)
        return
      }

      const roleRoutes = {
        customer: '/',
        admin: '/admin/dashboard',
        center_admin: '/center-admin/dashboard',
        support_agent: '/support/dashboard',
        superadmin: '/superadmin/dashboard',
      }

      const redirectPath = roleRoutes[user.role as keyof typeof roleRoutes] || '/'
      setTimeout(() => {
        router.push(redirectPath)
      }, 100)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login gagal'
      
      if (error.response?.data?.requiresEmailVerification) {
        toast.error('Silakan verifikasi alamat email Anda sebelum masuk')
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
        return
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Back Button - Fixed Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm text-teal-600 hover:text-teal-700 hover:bg-white transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="min-h-screen flex items-center justify-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-center px-12 xl:px-16">
          {/* Logo & Brand */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>KitaLaundry</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Selamat Datang Kembali!
            </h1>
            <p className="text-xl text-gray-600" style={{ fontSize: '15px' }}>
              Layanan laundry premium ke depan pintu Anda. Masuk untuk mengelola pesanan dan nikmati laundry tanpa repot.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Penjemputan & Pengiriman Gratis</h3>
                <p className="text-gray-600 text-sm">Kami menjemput dan mengantarkan pakaian Anda langsung ke depan pintu</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Selesai 24-48 Jam</h3>
                <p className="text-gray-600 text-sm">Layanan cepat dengan opsi ekspres tersedia</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Kualitas Terjamin</h3>
                <p className="text-gray-600 text-sm">Perawatan profesional untuk semua jenis kain</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Lacak Pesanan Real-time</h3>
                <p className="text-gray-600 text-sm">Pantau status pesanan dari penjemputan hingga pengiriman</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-800">KitaLaundry</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Selamat Datang Kembali!</h2>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Masuk</h2>
                <p className="text-gray-600 mt-1" style={{ fontSize: '15px' }}>Akses dasbor Anda</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Masukkan email Anda"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Masukkan kata sandi Anda"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Ingat saya
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-teal-600 hover:text-teal-500 font-medium">
                    Lupa kata sandi?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sedang masuk...
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600" style={{ fontSize: '15px' }}>
                  Belum punya akun?{' '}
                  <Link href="/auth/register" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
