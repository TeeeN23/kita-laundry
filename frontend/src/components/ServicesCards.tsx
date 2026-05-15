'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SkeletonGrid } from '@/components/ui/CardSkeleton'
import { SERVICES_DATA } from '@/data/dummyData'

export default function ServicesCards({ onBookNow }: { onBookNow: () => void }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<typeof SERVICES_DATA>([])

  useEffect(() => {
    // Simulasi pengambilan data selama 2.5 detik
    const timer = setTimeout(() => {
      setData(SERVICES_DATA)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-4 mb-12">
         <SkeletonGrid count={8} columns={4} />
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-12">
      {data.map((service) => (
        <div key={service.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 text-center">
          <div className="mb-4">
            <service.icon className="w-12 h-12 text-gray-700 mx-auto stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">{service.title}</h3>
          <p className="text-gray-600 text-sm mb-4 min-h-[40px] whitespace-pre-line">
            {service.description}
          </p>
          <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white px-6" onClick={onBookNow}>
            Pesan Sekarang
          </Button>
        </div>
      ))}
    </div>
  )
}
