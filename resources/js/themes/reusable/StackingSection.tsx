import React, { useRef } from 'react'
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion'

export interface StackingSectionProps {
  id: string
  zIndex: number
  bg: string
  pattern?: string
  roundedVal?: string
  borderTop?: string
  boxShadow?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export const StackingSection: React.FC<StackingSectionProps> = ({
  id,
  zIndex,
  bg,
  pattern,
  roundedVal = '2.5rem',
  borderTop,
  boxShadow,
  className = '',
  style = {},
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Track global scroll velocity
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 250, mass: 0.4 })

  // Map velocity to dynamic transforms (skew and elastic scale) for scroll feedback
  const skewY = useTransform(smoothVelocity, [-3000, 3000], [-1.5, 1.5])
  const scaleY = useTransform(smoothVelocity, [-3000, 3000], [0.99, 1.01])

  // Map progress to card-stacking depth transforms (scaling down & dimming overlay)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacityOverlay = useTransform(scrollYProgress, [0, 0.85], [0, 0.6])

  return (
    <div
      ref={containerRef}
      data-section-id={id}
      className={`relative overflow-hidden w-full flex flex-col justify-center items-center ${className}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex,
        minHeight: '100dvh',
        height: '100dvh',
        background: bg,
        backgroundImage: pattern || 'none',
        borderRadius: roundedVal,
        borderTop,
        boxShadow,
        ...style
      }}
    >
      <motion.div
        className="w-full h-full flex flex-col justify-center items-center relative overflow-y-auto overflow-x-hidden py-10 px-4"
        style={{
          scale,
          skewY,
          scaleY,
          transformOrigin: 'center center'
        }}
      >
        <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center relative z-10 my-auto">
          {children}
        </div>
        
        {/* Dimming overlay when card gets stacked underneath */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none z-[99]"
          style={{ opacity: opacityOverlay }}
        />
      </motion.div>
    </div>
  )
}

export default StackingSection
