import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'rustic' | 'cream' | 'gray' | 'success' | 'warning' | 'danger' | 'neutral'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
}) => {
  const baseStyle =
    'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider font-poppins'

  const variants = {
    gold: 'bg-gold-50 text-gold-600 border border-gold-200',
    rustic: 'bg-rustic-50 text-rustic-600 border border-rustic-200',
    cream: 'bg-cream text-gold-600 border border-sand',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    success: 'bg-green-50 text-green-600 border border-green-200',
    warning: 'bg-amber-50 text-amber-600 border border-amber-200',
    danger: 'bg-red-50 text-red-600 border border-red-200',
    neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
  }

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
