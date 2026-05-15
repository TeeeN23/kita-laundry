'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, ArrowLeft, CheckCircle, Shield, Truck, Clock, Star } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Kata sandi tidak cocok')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Kata sandi harus minimal 8 karakter')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/
    if (!passwordRegex.test(formData.password)) {
      toast.error('Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus')
      return
    }

    setIsLoading(true)

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      toast.success('Pendaftaran berhasil! Silakan cek email Anda untuk memverifikasi akun.')
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Pendaftaran gagal'
      toast.error(errorMessage)
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(err.message)
        })
      }
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

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' }
    if (password.length < 6) return { strength: 25, text: 'Lemah', color: 'bg-red-500' }
    if (password.length < 8) return { strength: 50, text: 'Cukup', color: 'bg-yellow-500' }
    if (password.length < 12) return { strength: 75, text: 'Baik', color: 'bg-blue-500' }
    return { strength: 100, text: 'Kuat', color: 'bg-green-500' }
  }

  const strength = passwordStrength(formData.password)

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
              Bergabung dengan KitaLaundry
            </h1>
            <p className="text-xl text-gray-600" style={{ fontSize: '15px' }}>
              Buat akun Anda dan rasakan layanan laundry premium. Ribuan pelanggan puas mempercayai kami untuk pakaian mereka.
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
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>10.000+ Pelanggan Puas</h3>
                <p className="text-gray-600 text-sm">Dipercaya oleh ribuan orang di seluruh kota</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-gray-800">KitaLaundry</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Buat Akun</h2>
            </div>

            {/* Register Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Buat Akun</h2>
                <p className="text-gray-600 mt-1" style={{ fontSize: '15px' }}>Bergabung bersama ribuan pelanggan puas</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="off"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                      autoComplete="new-email"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Masukkan email Anda"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="off"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Masukkan nomor telepon 10 digit"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                      required
                      autoComplete="new-password"
                      className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Min 8 karakter"
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
                  {formData.password && (
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Kekuatan kata sandi</span>
                        <span className={`font-medium ${strength.strength >= 75 ? 'text-green-600' : strength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {strength.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Konfirmasi kata sandi Anda"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="mt-1 flex items-center">
                      {formData.password === formData.confirmPassword ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Kata sandi cocok
                        </div>
                      ) : (
                        <div className="text-red-600 text-xs">
                          Kata sandi tidak cocok
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-start pt-2">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    Saya setuju dengan{' '}
                    <Link href="#" className="text-teal-600 hover:text-teal-500">
                      Syarat Layanan
                    </Link>{' '}
                    dan{' '}
                    <Link href="#" className="text-teal-600 hover:text-teal-500">
                      Kebijakan Privasi
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Membuat akun...
                    </div>
                  ) : (
                    'Buat Akun'
                  )}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-gray-600" style={{ fontSize: '15px' }}>
                  Sudah punya akun?{' '}
                  <Link href="/auth/login" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                    Masuk di sini
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
