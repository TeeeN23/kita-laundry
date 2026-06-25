'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

export interface AddressData {
  display_name: string
  address: {
    road?: string
    village?: string
    suburb?: string
    city_district?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (data: AddressData) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export function AddressAutocomplete({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Ketik nama jalan atau gedung...", 
  className = "",
  required = false
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<AddressData[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const skipSearchRef = useRef(false)

  // Sync external value
  useEffect(() => {
    if (value !== query) {
      setQuery(value)
    }
  }, [value])

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Skip search if it was triggered by a selection
      if (skipSearchRef.current) {
        skipSearchRef.current = false
        return
      }

      if (query.trim().length > 3) {
        setLoading(true)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=id&limit=5`, {
            headers: {
              'Accept-Language': 'id'
            }
          })
          const data = await res.json()
          setResults(data || [])
          setShowDropdown(true)
        } catch (error) {
          console.error("Geocoding error:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (item: AddressData) => {
    // Determine a clean address line 1
    const parts = []
    if (item.address.road) parts.push(item.address.road)
    if (item.address.village || item.address.suburb) parts.push(item.address.village || item.address.suburb)
    
    let cleanAddress = parts.join(', ')
    if (!cleanAddress) {
      // Fallback to the first two parts of display_name
      cleanAddress = item.display_name.split(',').slice(0, 2).join(', ')
    }

    setQuery(cleanAddress)
    skipSearchRef.current = true
    onChange(cleanAddress)
    setShowDropdown(false)
    onSelect(item)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            skipSearchRef.current = false
            setQuery(e.target.value)
            onChange(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true)
          }}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
          required={required}
        />
        <div className="absolute right-3 top-2.5 text-gray-400">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {results.map((item, index) => (
              <li 
                key={index}
                className="px-4 py-2 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-0"
                onClick={() => handleSelect(item)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {item.address.road || item.display_name.split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {item.display_name}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
