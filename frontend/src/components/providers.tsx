'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { AutoLogoutProvider } from './AutoLogoutProvider'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { GoogleOAuthProvider } from '@react-oauth/google'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }))

  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id'

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
        <QueryClientProvider client={queryClient}>
        <AutoLogoutProvider>
          {children}
        </AutoLogoutProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
              padding: '12px 20px',
            },
            success: {
              style: {
                background: '#10b981',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
          }}
          />
        </QueryClientProvider>
      </GoogleReCaptchaProvider>
    </GoogleOAuthProvider>
  )
}
