import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  Users,
  CreditCard,
  Palette,
  Package,
  Music,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth'
import { toast } from 'sonner'

export const AdminDashboardLayout: React.FC = () => {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 1. Guard check
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      toast.error('Akses ditolak: Silakan masuk sebagai Administrator.')
      navigate('/admin/login', { replace: true })
    }
  }, [user, navigate])

  // 2. Strict session timeout: 2 hours idle
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return

    let timeoutId: any

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      // 2 hours = 7200000 ms
      timeoutId = setTimeout(() => {
        clearAuth()
        toast.warning('Sesi Administrator kedaluwarsa karena tidak ada aktivitas selama 2 jam.')
        navigate('/admin/login', { replace: true })
      }, 7200000)
    }

    // Register active event listeners
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)
    window.addEventListener('click', resetTimer)
    window.addEventListener('scroll', resetTimer)

    resetTimer()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      window.removeEventListener('click', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [user, clearAuth, navigate])

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  const handleLogout = () => {
    clearAuth()
    toast.success('Berhasil keluar dari panel Administrator.')
    navigate('/admin/login')
  }

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Kelola User', path: '/admin/users', icon: Users },
    { name: 'Order & Transaksi', path: '/admin/orders', icon: CreditCard },
    { name: 'Katalog Tema', path: '/admin/themes', icon: Palette },
    { name: 'Paket Layanan', path: '/admin/packages', icon: Package },
    { name: 'Pustaka Musik', path: '/admin/music', icon: Music },
    { name: 'Laporan Keuangan', path: '/admin/finance', icon: BarChart3 },
    { name: 'Pengaturan Sistem', path: '/admin/settings', icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900 shrink-0">
        {/* Header / Branding */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/35 text-amber-500 rounded-lg">
            <Shield size={20} />
          </div>
          <span className="font-serif text-lg font-bold text-amber-500 tracking-wider">
            Ngaturi Admin
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 border border-slate-700">
              <UserIcon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-xs">
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 border-r border-slate-800">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
              <Shield className="text-amber-500" size={24} />
              <span className="font-serif text-lg font-bold text-amber-500 tracking-wider">
                Ngaturi Admin
              </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
              >
                <LogOut size={18} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header bar */}
        <header className="h-16 border-b border-slate-900 bg-slate-900/50 flex items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800 border border-slate-700/50 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
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
  )
}

export default AdminDashboardLayout
