'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PublicHeader from '@/components/layout/PublicHeader'
import { Shirt, Sparkles, Award, Package, Clock, Truck, Phone, CheckCircle, Star, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BookingModal from '@/components/BookingModal'
import { SERVICES_PAGE_DATA, HOW_WE_WORK_STEPS, SERVICES_FAQ_DATA } from '@/data/dummyData'

  const services = SERVICES_PAGE_DATA
  const howWeWorkSteps = HOW_WE_WORK_STEPS
  const faqData = SERVICES_FAQ_DATA


function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden">
      <button onClick={onToggle} className={`w-full px-8 py-5 text-left flex items-center justify-between transition-colors duration-200 ${isOpen ? 'bg-teal-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
        <h4 className="text-base font-medium text-white pr-4">{question}</h4>
        <ChevronDown className={`w-5 h-5 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-8 py-6 bg-white border-x border-b border-gray-200">
          <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

function HowWeWorkSection({ isModalOpen }: { isModalOpen?: boolean }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const [stickyEnd, setStickyEnd] = useState(false)
  const [imageLeft, setImageLeft] = useState(0)
  const [imageWidth, setImageWidth] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Check if desktop (lg breakpoint = 1024px)
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    // Don't run scroll handlers when modal is open or on mobile
    if (isModalOpen || !isDesktop) return

    const updateImagePosition = () => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect()
        setImageLeft(rect.left)
        setImageWidth(rect.width)
      }
    }
    
    const handleScroll = () => {
      if (!contentRef.current || !sectionRef.current || !imageContainerRef.current) return
      if (!isSticky) updateImagePosition()
      
      const sectionRect = sectionRef.current.getBoundingClientRect()
      const headerOffset = 96
      const stickyEndPoint = 600
      if (sectionRect.top <= headerOffset && sectionRect.bottom > stickyEndPoint) {
        setIsSticky(true)
        setStickyEnd(false)
      } else if (sectionRect.bottom <= stickyEndPoint) {
        setIsSticky(false)
        setStickyEnd(true)
      } else {
        setIsSticky(false)
        setStickyEnd(false)
      }
      
      // Update active step based on scroll position
      stepsRef.current.forEach((step, index) => {
        if (step) {
          const rect = step.getBoundingClientRect()
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) setActiveStep(index)
        }
      })
    }
    
    updateImagePosition()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateImagePosition)
    handleScroll()
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', updateImagePosition) }
  }, [isSticky, isModalOpen, isDesktop])

  const getImageStyle = (): React.CSSProperties => {
    if (isSticky) return { position: 'fixed', top: '96px', left: `${imageLeft}px`, width: `${imageWidth}px`, zIndex: 30 }
    if (stickyEnd) return { position: 'absolute', bottom: '0', left: '0', width: '100%', zIndex: 30 }
    return { position: 'relative', top: '0', left: '0', width: '100%', zIndex: 30 }
  }

  // Mobile Layout - Each step with its own image
  if (!isDesktop) {
    return (
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-teal-500 font-semibold mb-2">Mudah & Praktis</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Cara Kami Bekerja</h2>
            <p className="text-gray-600 text-sm sm:text-base">Layanan laundry Anda belum pernah semudah ini. Hanya 4 langkah sederhana!</p>
          </div>
          
          <div className="space-y-8">
            {howWeWorkSteps.map((step, index) => (
              <div key={step.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Image */}
                <div className="relative h-[200px] sm:h-[250px]">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{step.id}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{step.title}</p>
                        <p className="text-gray-300 text-xs">{step.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700 text-sm">
                        <CheckCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Desktop Layout - Sticky image with scrolling content
  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-teal-500 font-semibold mb-2">Mudah & Praktis</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cara Kami Bekerja</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Layanan laundry Anda belum pernah semudah ini. Hanya 4 langkah sederhana!</p>
        </div>
        <div className="flex flex-row gap-16">
          {/* Image Container - Fixed while scrolling */}
          <div ref={imageContainerRef} className="w-1/2 relative" style={{ minHeight: '500px' }}>
            <div style={getImageStyle()}>
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {howWeWorkSteps.map((step, index) => (
                  <div key={step.id} className={`absolute inset-0 transition-opacity duration-500 ${activeStep === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{step.id}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">{step.title}</p>
                          <p className="text-gray-300 text-sm">{step.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Step indicators */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-20">
                  {howWeWorkSteps.map((_, index) => (
                    <button key={index} onClick={() => setActiveStep(index)} className={`w-3 h-10 rounded-full transition-all duration-300 ${activeStep === index ? 'bg-teal-500' : 'bg-white/50 hover:bg-white/70'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content - Steps */}
          <div ref={contentRef} className="w-1/2">
            {howWeWorkSteps.map((step, index) => (
              <div key={step.id} ref={(el) => { stepsRef.current[index] = el }} className="min-h-[400px] flex items-center py-8 first:pt-0">
                <div className="w-full">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${activeStep === index ? 'bg-teal-500' : 'bg-gray-300'}`}>
                      <span className="text-xl font-bold text-white">{step.id}</span>
                    </div>
                    <div>
                      <p className="text-teal-600 font-semibold text-sm uppercase tracking-wide">{step.subtitle}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg mb-8 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


export default function ServicesPage() {
  const { isAuthenticated } = useAuthStore()
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const router = useRouter()

  const handleBookNow = () => {
    // If not logged in, redirect to login, then come back with modal
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/services?openBooking=true')
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
        window.history.replaceState({}, '', '/services')
      }
    }
  }, [isAuthenticated])

  const handleLoginRequired = () => {
    setShowBookingModal(false)
    router.push('/auth/login?redirect=/services?openBooking=true')
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <PublicHeader />
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        onLoginRequired={handleLoginRequired}
      />
      
      <section className="relative h-[450px] overflow-hidden">
        <img
          src="/images/services_hero.png"
          alt="Layanan Pembersihan Premium KitaLaundry"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Layanan Pembersihan<br />Premium</h1>
            <p className="text-lg text-gray-200 mb-8">Layanan laundry dan dry cleaning profesional ke depan pintu Anda. Perawatan berkualitas untuk semua pakaian Anda.</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gray-800 hover:bg-gray-900 text-white" onClick={handleBookNow}>
                <Truck className="w-5 h-5 mr-2" />Jadwalkan Penjemputan Gratis
              </Button>
              <Link href="https://wa.me/6281273136685" target="_blank">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  <Phone className="w-5 h-5 mr-2" />Chat di WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HowWeWorkSection isModalOpen={showBookingModal} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-teal-500 font-semibold mb-2">Apa yang Kami Tawarkan</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Layanan Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dari laundry sehari-hari hingga dry cleaning premium, kami menawarkan solusi perawatan pakaian yang komprehensif.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-teal-200">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{service.description}</p>
                  <p className="text-sm font-bold text-teal-600 mb-3">{service.price}</p>
                  <ul className="space-y-1 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-teal-500 mr-1.5 flex-shrink-0" />{feature}
                      </li>
                    ))}
                  </ul>
                  <Button size="sm" className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm" onClick={handleBookNow}>Pesan Sekarang</Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih KitaLaundry?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Truck className="w-8 h-8 text-teal-600" /></div>
              <h3 className="font-semibold text-gray-800 mb-2">Penjemputan & Pengiriman Gratis</h3>
              <p className="text-sm text-gray-600">Layanan ke depan pintu tanpa biaya tambahan</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Clock className="w-8 h-8 text-teal-600" /></div>
              <h3 className="font-semibold text-gray-800 mb-2">Pengiriman 24-48 Jam</h3>
              <p className="text-sm text-gray-600">Waktu pengerjaan yang cepat</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="w-8 h-8 text-teal-600" /></div>
              <h3 className="font-semibold text-gray-800 mb-2">Kualitas Terjamin</h3>
              <p className="text-sm text-gray-600">Perawatan premium untuk pakaian Anda</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="w-8 h-8 text-teal-600" /></div>
              <h3 className="font-semibold text-gray-800 mb-2">Dukungan 24/7</h3>
              <p className="text-sm text-gray-600">Selalu siap membantu Anda</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Ada pertanyaan tentang layanan kami? Kami punya jawabannya.</p>
          </div>
          <div className="max-w-6xl mx-auto space-y-2">
            {faqData.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} isOpen={openFAQ === index} onToggle={() => setOpenFAQ(openFAQ === index ? null : index)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-500 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai?</h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">Jadwalkan penjemputan pertama Anda hari ini dan rasakan kemudahan layanan laundry profesional.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100" onClick={handleBookNow}>
              <Truck className="w-5 h-5 mr-2" />Pesan Sekarang
            </Button>
            <Link href="tel:+919876543210">
              <Button size="lg" className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-teal-600">
                <Phone className="w-5 h-5 mr-2" />Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
