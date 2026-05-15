import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services | KitaLaundry',
  description: 'Explore KitaLaundry premium services including Wash & Fold, Dry Cleaning, Steam Press, and more. Experience top-notch garment care in Medan.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
