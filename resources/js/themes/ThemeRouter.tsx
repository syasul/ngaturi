import React from 'react'
import ElegantTheme, { type ThemeProps } from './elegant/ElegantTheme'
import RusticTheme from './rustic/RusticTheme'
import ModernTheme from './modern/ModernTheme'

interface ThemeRouterProps extends ThemeProps {
  themeId: string
}

export const ThemeRouter: React.FC<ThemeRouterProps> = ({ themeId, ...props }) => {
  // Map normalized themeId to components
  const normalizedId = (themeId || 'elegant').toLowerCase()

  if (normalizedId.includes('rustic')) {
    return <RusticTheme {...props} />
  }

  if (normalizedId.includes('modern')) {
    return <ModernTheme {...props} />
  }

  // Fallback to Elegant Gold
  return <ElegantTheme {...props} />
}

export default ThemeRouter
