import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    Music,
    Package,
    Palette,
    Settings as SettingsIcon,
    Shield,
    User as UserIcon,
    Users,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/auth';

export const AdminDashboardLayout: React.FC = () => {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 1. Guard check
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            toast.error('Akses ditolak: Silakan masuk sebagai Administrator.');
            navigate('/admin/login', { replace: true });
        }
    }, [user, navigate]);

    // 2. Strict session timeout: 2 hours idle
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') return;

        let timeoutId: any;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            // 2 hours = 7200000 ms
            timeoutId = setTimeout(() => {
                clearAuth();
                toast.warning(
                    'Sesi Administrator kedaluwarsa karena tidak ada aktivitas selama 2 jam.',
                );
                navigate('/admin/login', { replace: true });
            }, 7200000);
        };

        // Register active event listeners
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [user, clearAuth, navigate]);

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    const handleLogout = () => {
        clearAuth();
        toast.success('Berhasil keluar dari panel Administrator.');
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Kelola User', path: '/admin/users', icon: Users },
        { name: 'Order & Transaksi', path: '/admin/orders', icon: CreditCard },
        { name: 'Katalog Tema', path: '/admin/themes', icon: Palette },
        { name: 'Paket Layanan', path: '/admin/packages', icon: Package },
        { name: 'Pustaka Musik', path: '/admin/music', icon: Music },
        { name: 'Laporan Keuangan', path: '/admin/finance', icon: BarChart3 },
        {
            name: 'Pengaturan Sistem',
            path: '/admin/settings',
            icon: SettingsIcon,
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
            {/* Sidebar for Desktop */}
            <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
                {/* Header / Branding */}
                <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-6">
                    <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-1.5 text-amber-500">
                        <Shield size={20} />
                    </div>
                    <span className="font-sans text-lg font-bold tracking-wider text-amber-500">
                        Ngaturi Admin
                    </span>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer info & Logout */}
                <div className="border-t border-slate-800 p-4">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-amber-500">
                            <UserIcon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-200">
                                {user.name}
                            </p>
                            <p className="truncate text-[10px] text-slate-500">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={18} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Drawer Sidebar */}
            {sidebarOpen && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex bg-slate-950/80 lg:hidden">
                    <div className="relative flex w-64 max-w-xs flex-col border-r border-slate-800 bg-slate-900">
                        <div className="absolute right-0 top-0 -mr-12 pt-4">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-6">
                            <Shield className="text-amber-500" size={24} />
                            <span className="font-sans text-lg font-bold tracking-wider text-amber-500">
                                Ngaturi Admin
                            </span>
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                                            isActive
                                                ? 'bg-amber-500 text-slate-950 shadow-md'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="border-t border-slate-800 p-4">
                            <button
                                onClick={handleLogout}
                                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                            >
                                <LogOut size={18} />
                                <span>Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Workspace */}
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                {/* Header bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-900 bg-slate-900/50 px-6 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="-ml-2 p-2 text-slate-400 hover:text-white lg:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="rounded-full border border-slate-700/50 bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Mode: Production Admin
                        </span>
                    </div>

                    <div className="text-sm font-semibold text-amber-500">
                        {user.name}
                    </div>
                </header>

                {/* Content body */}
                <main className="flex-1 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
