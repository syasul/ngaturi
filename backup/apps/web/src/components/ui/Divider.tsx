import React from 'react'

interface DividerProps {
  className?: string
  text?: string
}

export const Divider: React.FC<DividerProps> = ({ className = '', text }) => {
  if (text) {
    return (
      <div className={`flex items-center my-6 ${className}`}>
        <div className="flex-grow border-t border-gray-200/60"></div>
        <span className="px-4 text-xs font-semibold uppercase tracking-wider text-gold-500 font-poppins">
          {text}
        </span>
        <div className="flex-grow border-t border-gray-200/60"></div>
      </div>
    )
  }
  return <div className={`border-t border-gray-100 my-6 ${className}`} />
}

export default Divider
