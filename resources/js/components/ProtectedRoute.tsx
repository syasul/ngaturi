import { Heart } from 'lucide-react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false,
}) => {
    const { user, accessToken, isInitializing } = useAuthStore();
    const location = useLocation();

    // Premium loading screen
    if (isInitializing) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream">
                <div className="relative flex flex-col items-center">
                    {/* Pulsing hearts logo */}
                    <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
                        <Heart className="absolute h-16 w-16 animate-ping fill-gold-200 text-gold-200 opacity-25" />
                        <Heart className="absolute h-14 w-14 animate-pulse fill-gold-500 text-gold-500" />
                    </div>
                    <h2 className="animate-pulse font-sans text-2xl font-semibold tracking-wider text-gold-600">
                        Ngaturi
                    </h2>
                    <p className="mt-2 font-sans text-xs uppercase tracking-widest text-charcoal/50">
                        Memuat Sesi...
                    </p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!accessToken || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to home if admin role is required but user is not admin
    if (requireAdmin && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
