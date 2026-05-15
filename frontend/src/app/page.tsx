'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TESTIMONIALS_DATA } from '@/data/dummyData'
import { 
  MapPin, 
  Shirt, 
  Sparkles, 
  Truck, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Headphones,
  Star,
  ArrowRight,
  Shield,
  Zap,
  Award,
  Users,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  Package,
  Bell,
  Menu,
  X
} from 'lucide-react'
import { useState, useEffect, useRef, Suspense } from 'react'
import React from 'react'
import Preloader from '@/components/Preloader'
import { useAuthStore } from '@/store/authStore'
import { useHomepageStats } from '@/hooks/useStats'
import BookingModal from '@/components/BookingModal'
import HowItWorksCards from '@/components/HowItWorksCards'
import ServicesCards from '@/components/ServicesCards'
import { useRouter } from 'next/navigation'

// Hero Carousel Component
function HeroCarousel({
  isAuthenticated,
  user,
  onBookNow,
}: {
  isAuthenticated: boolean
  user: any
  onBookNow: () => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [isAnimating, setIsAnimating] = useState(false)

  const slides: Array<{
    id: number
    title: string
    subtitle: string
    description: string
    features: Array<{ icon: any; text: string }>
    image: string
    video?: string
    discount: string
    primaryButton: { text: string; icon: any; action: string }
    secondaryButton: { text: string; icon: any; href: string }
  }> = [
    {
      id: 1,
      title: isAuthenticated
        ? `Selamat datang kembali, ${user?.name}!`
        : 'Selamat Datang di KitaLaundry',
      subtitle: "Layanan Laundry #1 di Medan",
      description: isAuthenticated
        ? "Siap menjadwalkan jemput laundry Anda berikutnya? Kami hadir untuk mempermudah hidup Anda!"
        : 'Melayani lebih dari 20+ Kota dengan 20+ Gerai di seluruh Indonesia.',
      features: [
        { icon: Clock, text: 'Jadwalkan Hari Pengambilan' },
        { icon: Truck, text: 'Pengiriman 24-48 Jam' },
        { icon: CreditCard, text: 'Opsi Pembayaran Mudah' },
        { icon: Headphones, text: 'Dukungan Pelanggan Terdedikasi' },
      ],
      image: '/images/hero-laundry.jpg',
      discount: '20%',
      primaryButton: { text: 'Pesan Sekarang', icon: Truck, action: 'book' },
      secondaryButton: { text: 'Chat di WhatsApp', icon: Phone, href: '#' },
    },
    {
      id: 2,
      title: 'Dry Cleaning Premium',
      subtitle: 'Perawatan Profesional untuk Pakaian Anda',
      description:
        'Layanan dry cleaning ahli dengan teknologi canggih dan solusi ramah lingkungan.',
      features: [
        { icon: Shield, text: '100% Aman & Terjamin' },
        { icon: Sparkles, text: 'Perawatan Kualitas Premium' },
        { icon: Award, text: 'Profesional Bersertifikat' },
        { icon: Star, text: 'Layanan Bintang 5' },
      ],
      image: '/images/hero-slide-2.jpg',
      discount: '15%',
      primaryButton: { text: 'Pesan Dry Cleaning', icon: Sparkles, action: 'book' },
      secondaryButton: { text: 'Lihat Layanan', icon: ArrowRight, href: '#services' },
    },
  ]

  const nextSlide = () => {
    if (isAnimating) return
    setSlideDirection('right')
    setIsAnimating(true)
    setPreviousSlide(currentSlide)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setSlideDirection('left')
    setIsAnimating(true)
    setPreviousSlide(currentSlide)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const currentSlideData = slides[currentSlide]
  const previousSlideData = slides[previousSlide]

  return (
    <div
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows - Only visible on hover */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-500 hover:bg-gray-600 rounded-lg p-3 shadow-lg transition-all duration-300 hover:scale-110 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-500 hover:bg-gray-600 rounded-lg p-3 shadow-lg transition-all duration-300 hover:scale-110 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slides Container */}
      <div className="relative">
        {/* Previous Slide (exits) */}
        {isAnimating && (
          <div
            className={`absolute inset-0 z-10 ${
              slideDirection === 'right'
                ? 'animate-[slideOutLeft_0.6s_ease-in-out_forwards]'
                : 'animate-[slideOutRight_0.6s_ease-in-out_forwards]'
            }`}
          >
            <div className="grid lg:grid-cols-2 gap-4 items-center">
              <div className="px-4 lg:pl-16">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {previousSlideData.title}
                </h1>
                <p className="text-lg font-medium text-gray-800 mb-6">{previousSlideData.description}</p>
                <div className="space-y-3 mb-8">
                  {previousSlideData.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-6">
                    <Truck className="w-5 h-5 mr-2" />
                    {previousSlideData.primaryButton.text}
                  </Button>
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-6">
                    <Phone className="w-5 h-5 mr-2" />
                    Chat di WhatsApp
                  </Button>
                </div>
              </div>
              <div className="relative flex justify-center items-end overflow-visible">
                {previousSlideData.video ? (
                  <video
                    src={previousSlideData.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-auto max-h-[520px] object-contain object-bottom"
                    style={{ 
                      filter: 'hue-rotate(-50deg) saturate(0.8)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                ) : (
                  <img
                    src={previousSlideData.image}
                    alt={previousSlideData.title}
                    className="w-auto max-h-[500px] object-contain object-bottom"
                    style={{ 
                      mixBlendMode: 'multiply'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Slide (enters) */}
        <div
          className={`relative z-20 ${
            isAnimating
              ? slideDirection === 'right'
                ? 'animate-[slideInRight_0.6s_ease-in-out_forwards]'
                : 'animate-[slideInLeft_0.6s_ease-in-out_forwards]'
              : ''
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-4 items-center">
            <div className="px-4 lg:pl-16">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-lg font-medium text-gray-800 mb-6">{currentSlideData.description}</p>
              <div className="space-y-3 mb-8">
                {currentSlideData.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6"
                  onClick={onBookNow}
                >
                  <Truck className="w-5 h-5 mr-2" />
                  {currentSlideData.primaryButton.text}
                </Button>
                <Link href="https://wa.me/919876543210" target="_blank">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-6">
                    <Phone className="w-5 h-5 mr-2" />
                    Chat di WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center items-end overflow-visible">
              {currentSlideData.video ? (
                <video
                  src={currentSlideData.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-auto max-h-[520px] object-contain object-bottom"
                  style={{ 
                    filter: 'hue-rotate(-50deg) saturate(0.8)',
                    mixBlendMode: 'multiply'
                  }}
                />
              ) : (
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-auto max-h-[500px] object-contain object-bottom"
                  style={{ 
                    mixBlendMode: 'multiply'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Testimonials Carousel Component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonials = TESTIMONIALS_DATA

  // Create extended array for infinite scroll effect
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  // Infinite scroll
  const nextSlide = () => {
    setCurrentIndex(prev => prev + 1)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => prev - 1)
  }

  // Reset position for seamless loop
  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      setTimeout(() => {
        setCurrentIndex(0)
      }, 500)
    }
    if (currentIndex < 0) {
      setTimeout(() => {
        setCurrentIndex(testimonials.length - 1)
      }, 500)
    }
  }, [currentIndex, testimonials.length])

  // Responsive: 1 item on mobile, 2 on tablet, 4 on desktop
  const getSlideWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 100 // mobile: 1 item
      if (window.innerWidth < 1024) return 50 // tablet: 2 items
      return 25 // desktop: 4 items
    }
    return 25
  }

  const [slideWidth, setSlideWidth] = useState(25)

  useEffect(() => {
    const handleResize = () => {
      setSlideWidth(getSlideWidth())
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all hover:border-teal-500 hover:text-teal-500"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all hover:border-teal-500 hover:text-teal-500"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Testimonials Container */}
      <div className="overflow-hidden mx-6 sm:mx-8">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${(currentIndex + testimonials.length) * slideWidth}%)`,
          }}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <div 
              key={`${testimonial.id}-${index}`} 
              className="flex-shrink-0 px-2"
              style={{ width: `${slideWidth}%` }}
            >
              <div className="bg-white rounded-xl p-6 text-center h-full">
                {/* Quote Icon */}
                <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-base mb-4 leading-relaxed">
                  {testimonial.review}
                </p>

                {/* Name */}
                <p className="font-bold text-gray-800 text-lg">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore()
  const { stats, loading: statsLoading, error: statsError } = useHomepageStats()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const router = useRouter()

  const handleBookNow = () => {
    // If not logged in, redirect to login, then come back to home with modal
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/?openBooking=true')
      return
    }
    setShowBookingModal(true)
  }

  // Check URL params to auto-open booking modal after login
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('openBooking') === 'true' && isAuthenticated) {
        setShowBookingModal(true)
        // Clean up URL
        window.history.replaceState({}, '', '/')
      }
    }
  }, [isAuthenticated])

  const handleLoginRequired = () => {
    setShowBookingModal(false)
    router.push('/auth/login?redirect=/?openBooking=true')
  }

  const handleGalleryVisible = (visible: boolean) => {
    setIsDarkTheme(visible)
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        onLoginRequired={handleLoginRequired}
      />
      {/* Navigation - Fixed */}
      <nav className={`shadow-sm border-b fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold transition-colors duration-500 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>KitaLaundry</span>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden p-2 rounded-lg transition-colors duration-500 ${isDarkTheme ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`}>Beranda</Link>
              <Link href="/services" className={`transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`}>Layanan</Link>
              <Link href="/pricing" className={`transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`}>Harga</Link>
              <Link href="/help" className={`transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`}>Bantuan</Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Dashboard Button */}
                  <Link href="/customer/dashboard">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                      <User className="w-4 h-4 mr-2" />
                      Dasbor
                    </Button>
                  </Link>
                  <div className="relative group">
                    <button className={`flex items-center space-x-2 py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-700 hover:text-teal-500'}`}>
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <Link href="/customer/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4 mr-3" />
                          Dasbor
                        </Link>
                        <Link href="/customer/orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                          <ShoppingBag className="w-4 h-4 mr-3" />
                          Pesanan Saya
                        </Link>
                        <Link href="/customer/addresses" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                          <MapPin className="w-4 h-4 mr-3" />
                          Alamat
                        </Link>
                        <Link href="/customer/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4 mr-3" />
                          Profil
                        </Link>
                        <hr className="my-2" />
                        <button 
                          onClick={() => {
                            useAuthStore.getState().logout()
                            window.location.href = '/'
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button variant="outline" className={`transition-colors duration-500 ${isDarkTheme ? 'border-teal-400 text-teal-400 hover:bg-teal-400/10' : 'border-teal-500 text-teal-600 hover:bg-teal-50'}`}>
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden border-t mt-4 pt-4 pb-2 transition-colors duration-500 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col space-y-3">
                <Link href="/" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
                <Link href="/services" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Layanan</Link>
                <Link href="/pricing" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Harga</Link>
                <Link href="/help" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Bantuan</Link>
                
                {isAuthenticated ? (
                  <>
                    <hr className={`my-2 transition-colors duration-500 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
                    <Link href="/customer/dashboard" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Dasbor</Link>
                    <Link href="/customer/orders" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Pesanan Saya</Link>
                    <Link href="/customer/profile" className={`py-2 transition-colors duration-500 ${isDarkTheme ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-500'}`} onClick={() => setMobileMenuOpen(false)}>Profil</Link>
                    <button 
                      onClick={() => {
                        useAuthStore.getState().logout()
                        setMobileMenuOpen(false)
                        window.location.href = '/'
                      }}
                      className="text-left text-red-600 hover:text-red-700 py-2"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className={`w-full transition-colors duration-500 ${isDarkTheme ? 'border-teal-400 text-teal-400 hover:bg-teal-400/10' : 'border-teal-500 text-teal-600 hover:bg-teal-50'}`}>
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                        Daftar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative bg-blue-100 pt-24 pb-0 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <HeroCarousel isAuthenticated={isAuthenticated} user={user} onBookNow={handleBookNow} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-500 font-semibold mb-2">Langsung ke Pintu Rumah Anda</p>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Kami Jemput, Cuci, dan Antarkan<br />
              Laundry &amp; Dry Cleaning Anda
            </h2>
            <p className="text-gray-800 font-semibold max-w-3xl mx-auto">
              Di KitaLaundry, kami menawarkan pengalaman laundry dan dry cleaning yang mulus sesuai 
              gaya hidup Anda yang sibuk. Dari penjemputan hingga pengiriman, setiap langkah ditangani 
              dengan profesionalisme dan penuh perhatian.
            </p>
          </div>

          <HowItWorksCards />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - Features with Icons */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Mengapa Memilih Kami?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">Penjemputan & Pengiriman Cepat</span>
                </div>
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">Harga Terjangkau</span>
                </div>
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">Solusi Cuci Ramah Lingkungan</span>
                </div>
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">Lacak Pesanan Real-Time</span>
                </div>
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">Dukungan Pelanggan Terdedikasi</span>
                </div>
              </div>
            </div>

            {/* Right - CTA Card with Video Background */}
            <div className="relative rounded-2xl overflow-hidden min-h-[450px]">
              {/* Video Background */}
              <img
                src="/images/premium_laundry_bg.png"
                alt="Premium Laundry Service"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-800/90"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Siap Merasakan Layanan Laundry Premium?</h3>
                
                <p className="text-gray-200 text-lg mb-4">
                  Bergabung bersama 50.000+ pelanggan puas yang mempercayakan kebutuhan laundry mereka kepada KitaLaundry setiap hari.
                </p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0" />
                    Penjemputan & pengiriman gratis ke depan pintu
                  </li>
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0" />
                    Waktu pengerjaan 24-48 jam
                  </li>
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0" />
                    Garansi kepuasan 100%
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAuthenticated ? (
                    <Button 
                      size="lg" 
                      className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto shadow-lg"
                      onClick={handleBookNow}
                    >
                      <Truck className="w-5 h-5 mr-2" />
                      Pesan Sekarang
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto shadow-lg"
                      onClick={handleBookNow}
                    >
                      <Truck className="w-5 h-5 mr-2" />
                      Jadwalkan Penjemputan Gratis
                    </Button>
                  )}
                  <Link href="https://wa.me/919876543210" target="_blank">
                    <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto shadow-lg">
                      <Phone className="w-5 h-5 mr-2" />
                      Chat di WhatsApp
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-500 font-semibold mb-2">Layanan Laundry dan Dry Clean Premium di Medan</p>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kualitas Bersih dengan Harga Hemat!</h2>
            <p className="text-gray-800 font-semibold max-w-4xl mx-auto">
              Di KitaLaundry, kami merawat semua kebutuhan pakaian Anda — dari pakaian sehari-hari hingga setelan formal kantor — memastikan 
              setiap helai dicuci dengan perawatan ahli. Layanan kami melampaui pakaian, menawarkan cuci sepatu, cuci gorden, 
              cuci karpet, dan lainnya untuk solusi perawatan rumah yang lengkap.
            </p>
          </div>

          <ServicesCards onBookNow={handleBookNow} />

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button 
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={handleBookNow}
                >
                  <Truck className="w-5 h-5 mr-2" />
                  Book New Order
                </Button>
              ) : (
                <Button 
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={handleBookNow}
                >
                  <Truck className="w-5 h-5 mr-2" />
                  Schedule Free Pickup
                </Button>
              )}
              <Link href="https://wa.me/919876543210" target="_blank">
                <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
                  Chat di WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-cyan-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-teal-500 font-semibold mb-2">Layanan Dry Clean dan Laundry Terbaik di Medan</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Apa yang Pelanggan Kami Katakan...</h2>
          </div>

          <Suspense fallback={<Preloader />}>
            <TestimonialsCarousel />
          </Suspense>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 animate-pulse bg-white/20 rounded h-12 w-20 mx-auto"></div>
                  <div className="text-teal-100 animate-pulse bg-white/10 rounded h-4 w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : statsError ? (
            <div className="text-center text-white">
              <p className="text-lg mb-4">Unable to load latest statistics</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-teal-100">Pelanggan Puas</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">20+</div>
                  <div className="text-teal-100">Kota Terlayani</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">1M+</div>
                  <div className="text-teal-100">Pesanan Selesai</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">4.9</div>
                  <div className="text-teal-100">Rating Rata-rata</div>
                </div>
              </div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.totalCustomers.toLocaleString()}+
                </div>
                <div className="text-teal-100">Happy Customers</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.totalCities}+
                </div>
                <div className="text-teal-100">Cities Covered</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.completedOrders.toLocaleString()}+
                </div>
                <div className="text-teal-100">Orders Completed</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.overview.averageRating}
                </div>
                <div className="text-teal-100">Average Rating</div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Siap Merasakan Perawatan Premium?</h2>
          <p className="text-xl text-gray-800 font-semibold mb-8 max-w-2xl mx-auto">
            Bergabunglah bersama ribuan pelanggan puas yang mempercayakan laundry dan dry cleaning mereka kepada KitaLaundry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/customer/orders/new">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Truck className="w-5 h-5 mr-2" />
                  Book New Order
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login?redirect=/customer/orders/new">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Truck className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
              </Link>
            )}
            <Link href="tel:+919876543210">
              <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50">
                <Phone className="w-5 h-5 mr-2" />
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">KitaLaundry</span>
              </div>
              <p className="text-gray-400 mb-4">Layanan laundry dan dry cleaning premium ke depan pintu Anda di seluruh Medan.</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Wash & Fold</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Dry Cleaning</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Shoe Cleaning</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Curtain Cleaning</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Karir</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kontak</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pusat Bantuan</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Info Kontak</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@kitalaundry.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Tersedia di {stats ? `${stats.overview.totalCities}+` : '20+'} Kota</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KitaLaundry. Hak cipta dilindungi. | Kebijakan Privasi | Syarat Layanan</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
