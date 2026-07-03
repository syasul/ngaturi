import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { Heart } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, accessToken, isInitializing } = useAuthStore()
  const location = useLocation()

  // Premium loading screen
  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-cream z-50">
        <div className="relative flex flex-col items-center">
          {/* Pulsing hearts logo */}
          <div className="relative flex items-center justify-center w-24 h-24 mb-4">
            <Heart className="absolute fill-gold-200 text-gold-200 w-16 h-16 animate-ping opacity-25" />
            <Heart className="absolute fill-gold-500 text-gold-500 w-14 h-14 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-gold-600 tracking-wider animate-pulse">
            Ngaturi
          </h2>
          <p className="font-sans text-xs text-charcoal/50 mt-2 tracking-widest uppercase">
            Memuat Sesi...
          </p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to home if admin role is required but user is not admin
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
