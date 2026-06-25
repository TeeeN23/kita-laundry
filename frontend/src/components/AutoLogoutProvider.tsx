'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

// Waktu timeout: 30 menit
const TIMEOUT_MS = 30 * 60 * 1000

export function AutoLogoutProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Rute yang diabaikan dari auto-logout (misal halaman publik)
  const isPublicRoute = ['/', '/auth/login', '/auth/register'].includes(pathname)

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Hanya jalankan timer jika user sedang login dan bukan di rute publik
    if (isAuthenticated && !isPublicRoute) {
      timerRef.current = setTimeout(() => {
        logout()
        toast('Sesi Anda telah berakhir karena tidak ada aktivitas.', {
          icon: '💤',
        })
        router.push('/auth/login')
      }, TIMEOUT_MS)
    }
  }

  useEffect(() => {
    // Jalankan timer saat pertama kali dimuat
    resetTimer()

    // Daftar event yang dianggap sebagai aktivitas pengguna
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']

    const handleActivity = () => {
      resetTimer()
    }

    // Pasang listener jika user login
    if (isAuthenticated) {
      events.forEach(event => {
        window.addEventListener(event, handleActivity)
      })
    }

    // Bersihkan listener saat unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, pathname])

  return <>{children}</>
}
