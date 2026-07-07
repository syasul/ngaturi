import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    CreditCard,
    Heart,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Palette,
    QrCode,
    Settings,
    User as UserIcon,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const { props, url } = usePage();
    const user = (props.auth as any)?.user;
    const pathname = url.split('?')[0];

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        router.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    toast.success('Berhasil keluar.');
                },
            },
        );
    };

    const menuItems = [
        { name: 'Dasboard', path: '/dashboard', icon: LayoutDashboard },
        {
            name: 'Data Pernikahan',
            path: '/dashboard/wedding-data',
            icon: Heart,
        },
        { name: 'Pilih Tema', path: '/dashboard/themes', icon: Palette },
        { name: 'Galeri & Media', path: '/dashboard/gallery', icon: ImageIcon },
        { name: 'Daftar Tamu', path: '/dashboard/guests', icon: Users },
        { name: 'RSVP & Ucapan', path: '/dashboard/rsvp', icon: MessageSquare },
        { name: 'Kehadiran QR', path: '/dashboard/checkin', icon: QrCode },
        {
            name: 'Billing & Paket',
            path: '/dashboard/billing',
            icon: CreditCard,
        },
        { name: 'Pengaturan', path: '/dashboard/settings', icon: Settings },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="flex min-h-screen bg-cream/35 font-sans text-charcoal">
            {/* 1. Sidebar - Desktop */}
            <aside
                className={`z-20 hidden flex-col border-r border-sand/65 bg-white transition-all duration-300 md:flex ${
                    isSidebarCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                {/* Brand Logo */}
                <div
                    className={`flex h-16 items-center border-b border-sand/40 ${
                        isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
                    }`}
                >
                    <Link href="/" className="flex items-center">
                        {isSidebarCollapsed ? (
                            <img
                                src="/assets/logo-mark.png"
                                alt="Ngaturi Logo"
                                className="h-8 w-auto object-contain"
                            />
                        ) : (
                            <img
                                src="/assets/logo-full.png"
                                alt="Ngaturi Logo"
                                className="h-8 w-auto object-contain"
                            />
                        )}
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center rounded-xl transition-all ${
                                    isSidebarCollapsed
                                        ? 'justify-center p-2.5'
                                        : 'gap-3 border-l-4 px-3 py-2.5'
                                } ${
                                    isActive
                                        ? 'border-gold-500 bg-gold-500/10 font-semibold text-gold-700'
                                        : 'border-transparent text-charcoal/70 hover:bg-cream/30 hover:text-gold-600'
                                }`}
                                title={item.name}
                            >
                                <Icon
                                    size={18}
                                    className={
                                        isActive
                                            ? 'text-gold-600'
                                            : 'text-charcoal/50'
                                    }
                                />
                                {!isSidebarCollapsed && (
                                    <span className="text-sm">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Logout Button */}
                <div className="border-t border-sand/40 p-4">
                    <button
                        onClick={handleLogout}
                        className={`flex w-full items-center rounded-xl text-red-600 transition-colors hover:bg-red-50 ${
                            isSidebarCollapsed
                                ? 'justify-center p-2.5'
                                : 'gap-3 px-3 py-2.5'
                        }`}
                        title="Keluar"
                    >
                        <LogOut size={18} />
                        {!isSidebarCollapsed && (
                            <span className="text-sm font-semibold">
                                Keluar
                            </span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Trigger / Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-30 bg-black md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-2xl md:hidden"
                        >
                            <div className="flex h-16 items-center justify-between border-b border-sand/40 px-4">
                                <Link href="/" className="flex items-center">
                                    <img
                                        src="/assets/logo-full.png"
                                        alt="Ngaturi Logo"
                                        className="h-8 w-auto object-contain"
                                    />
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-lg p-1 text-charcoal/60 hover:bg-cream/40"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.path;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                                                isActive
                                                    ? 'border-l-4 border-gold-500 bg-gold-500/10 font-semibold text-gold-700'
                                                    : 'text-charcoal/70 hover:bg-cream/30 hover:text-gold-600'
                                            }`}
                                        >
                                            <Icon
                                                size={18}
                                                className={
                                                    isActive
                                                        ? 'text-gold-600'
                                                        : 'text-charcoal/50'
                                                }
                                            />
                                            <span className="text-sm">
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="border-t border-sand/40 p-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    <span className="text-sm font-semibold">
                                        Keluar
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top Header */}
                <header className="z-10 flex h-16 items-center justify-between border-b border-sand/40 bg-white px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="-ml-2 rounded-lg p-2 text-charcoal/70 hover:bg-cream/30 md:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        {/* Desktop Sidebar Toggle */}
                        <button
                            onClick={() =>
                                setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                            className="-ml-2 hidden rounded-lg p-2 text-charcoal/70 transition-colors hover:bg-cream/30 md:flex"
                            title={
                                isSidebarCollapsed
                                    ? 'Expand Sidebar'
                                    : 'Collapse Sidebar'
                            }
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="hidden font-sans text-lg font-bold text-charcoal sm:block">
                            Panel Kelola Mempelai
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                                className="relative rounded-xl p-2 text-charcoal/60 transition-colors hover:bg-cream/30 hover:text-gold-600"
                            >
                                <Bell size={20} />
                                <span className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-gold-500" />
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold-500" />
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() =>
                                                setShowNotifications(false)
                                            }
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-sand bg-white p-4 shadow-2xl"
                                        >
                                            <h3 className="mb-2 border-b border-sand/35 pb-2 font-sans text-sm font-bold text-charcoal">
                                                Notifikasi Terbaru
                                            </h3>
                                            <div className="max-h-60 space-y-3 overflow-y-auto">
                                                <div className="border-b border-sand/20 pb-2 text-xs text-charcoal/80">
                                                    <p className="font-semibold text-gold-600">
                                                        Sistem Autentikasi
                                                    </p>
                                                    <p className="mt-0.5 text-charcoal/60">
                                                        Selamat datang di Panel
                                                        Ngaturi! Silakan
                                                        selesaikan onboarding
                                                        Anda.
                                                    </p>
                                                </div>
                                                <div className="text-xs text-charcoal/80">
                                                    <p className="font-semibold text-gold-600">
                                                        Upgrade Sukses
                                                    </p>
                                                    <p className="mt-0.5 text-charcoal/60">
                                                        Lengkapi data pernikahan
                                                        untuk preview undangan.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Avatar / Info */}
                        <div className="flex items-center gap-2.5 border-l border-sand/40 pl-4">
                            <div className="hidden text-right lg:block">
                                <p className="text-sm font-semibold leading-none text-charcoal">
                                    {user?.name}
                                </p>
                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal/50">
                                    {user?.role}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/10 text-sm font-bold text-gold-600 shadow-inner">
                                {user?.name ? (
                                    getInitials(user.name)
                                ) : (
                                    <UserIcon size={16} />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Outlet */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
