import React, { useState } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Heart,
  Palette,
  Image as ImageIcon,
  Users,
  MessageSquare,
  QrCode,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  User as UserIcon,
} from 'lucide-react'
import { toast } from 'sonner'

export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { props, url } = usePage()
  const user = (props.auth as any)?.user
  const pathname = url.split('?')[0]
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => {
        toast.success('Berhasil keluar.')
      }
    })
  }

  const menuItems = [
    { name: 'Dasbor', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Data Pernikahan', path: '/dashboard/wedding-data', icon: Heart },
    { name: 'Pilih Tema', path: '/dashboard/themes', icon: Palette },
    { name: 'Galeri & Media', path: '/dashboard/gallery', icon: ImageIcon },
    { name: 'Daftar Tamu', path: '/dashboard/guests', icon: Users },
    { name: 'RSVP & Ucapan', path: '/dashboard/rsvp', icon: MessageSquare },
    { name: 'Kehadiran QR', path: '/dashboard/checkin', icon: QrCode },
    { name: 'Billing & Paket', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Pengaturan', path: '/dashboard/settings', icon: Settings },
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-cream/35 flex font-sans text-charcoal">
      {/* 1. Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-sand/65 transition-all duration-300 z-20 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sand/40">
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Heart className="fill-gold-500 text-gold-500 animate-pulse" size={20} />
              <span className="font-serif text-xl font-bold text-gold-600 tracking-wide">Ngaturi</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <div className="mx-auto">
              <Heart className="fill-gold-500 text-gold-500" size={22} />
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-lg hover:bg-cream/40 text-charcoal/60 transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-700 font-semibold border-l-4 border-gold-500'
                    : 'text-charcoal/70 hover:bg-cream/30 hover:text-gold-600'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-gold-600' : 'text-charcoal/50'} />
                {!isSidebarCollapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-sand/40">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span className="text-sm font-semibold">Keluar</span>}
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
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-40 md:hidden flex flex-col shadow-2xl"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-sand/40">
                <Link href="/" className="flex items-center gap-2">
                  <Heart className="fill-gold-500 text-gold-500" size={20} />
                  <span className="font-serif text-xl font-bold text-gold-600">Ngaturi</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-cream/40 text-charcoal/60"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gold-500/10 text-gold-700 font-semibold border-l-4 border-gold-500'
                          : 'text-charcoal/70 hover:bg-cream/30 hover:text-gold-600'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-gold-600' : 'text-charcoal/50'} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-sand/40">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-semibold">Keluar</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-sand/40 flex items-center justify-between px-4 md:px-6 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-charcoal/70 hover:bg-cream/30 md:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-serif font-bold text-charcoal hidden sm:block">
              Panel Kelola Mempelai
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-charcoal/60 hover:bg-cream/30 hover:text-gold-600 transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-sand shadow-2xl rounded-2xl p-4 z-30"
                    >
                      <h3 className="font-serif font-bold text-sm text-charcoal mb-2 border-b border-sand/35 pb-2">
                        Notifikasi Terbaru
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        <div className="text-xs text-charcoal/80 border-b border-sand/20 pb-2">
                          <p className="font-semibold text-gold-600">Sistem Autentikasi</p>
                          <p className="text-charcoal/60 mt-0.5">Selamat datang di Panel Ngaturi! Silakan selesaikan onboarding Anda.</p>
                        </div>
                        <div className="text-xs text-charcoal/80">
                          <p className="font-semibold text-gold-600">Upgrade Sukses</p>
                          <p className="text-charcoal/60 mt-0.5">Lengkapi data pernikahan untuk preview undangan.</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / Info */}
            <div className="flex items-center gap-2.5 border-l border-sand/40 pl-4">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-charcoal leading-none">
                  {user?.name}
                </p>
                <p className="text-[10px] text-charcoal/50 mt-1 uppercase font-semibold tracking-wide">
                  {user?.role}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-600 font-bold flex items-center justify-center text-sm shadow-inner">
                {user?.name ? getInitials(user.name) : <UserIcon size={16} />}
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
  )
}

export default DashboardLayout
