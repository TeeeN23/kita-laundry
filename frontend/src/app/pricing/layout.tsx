import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | KitaLaundry',
  description: 'Transparent and affordable pricing for all your laundry needs. Check our detailed price list for men, women, kids, and household items.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
