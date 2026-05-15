import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | KitaLaundry',
  description: 'Create a new KitaLaundry account to enjoy premium laundry services, free pickup, and special discounts.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
