import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & Support | KitaLaundry',
  description: 'Need help? Browse our FAQ, track your order, request refunds, or contact KitaLaundry 24/7 support team for immediate assistance.',
}

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
