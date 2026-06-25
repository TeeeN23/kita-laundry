'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  width?: 'fit-content' | '100%'
  delay?: number
}

export default function Reveal({ children, width = '100%', delay = 0 }: RevealProps) {
  const ref = useRef(null)
  // Trigger once when scrolled into view
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} style={{ position: 'relative', width, overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
