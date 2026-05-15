import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Portal | KitaLaundry',
  description: 'Quick access directory to all features and pages in KitaLaundry project.',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
