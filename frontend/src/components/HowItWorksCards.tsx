'use client'

import { useState, useEffect } from 'react'
import Preloader from './Preloader'
import { HOW_IT_WORKS_DATA } from '@/data/dummyData'

export default function HowItWorksCards() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<typeof HOW_IT_WORKS_DATA>([])

  useEffect(() => {
    // Simulasi pengambilan data (fetching) selama 2.5 detik
    const timer = setTimeout(() => {
      setData(HOW_IT_WORKS_DATA)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Memunculkan Preloader jika data masih dimuat
  if (loading) {
    return <Preloader />
  }

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-16">
      {data.map((item) => (
        <div key={item.id} className="text-center group">
          <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-[-28px] relative z-10 shadow-lg border-4 border-white">
            <span className="text-xl font-bold text-white">{item.id}</span>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
            <div className="h-44 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 pt-4">
              <div className="w-11 h-11 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-teal-100">
                <item.icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-800 font-medium text-sm">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
