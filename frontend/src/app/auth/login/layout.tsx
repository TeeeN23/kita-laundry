import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | KitaLaundry',
  description: 'Log in to your KitaLaundry account to manage orders, track delivery, and book new services quickly.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
