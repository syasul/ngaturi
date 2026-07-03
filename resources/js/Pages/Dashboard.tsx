import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  LogOut,
  User as UserIcon,
  Shield,
  Activity,
  Heart,
  Home,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Button from '../components/ui/Button'

export const Dashboard: React.FC = () => {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await api.post('/auth/logout')
      clearAuth()
      toast.success('Berhasil keluar.')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth() // Clear client session anyway
      navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col relative overflow-hidden">
      {/* Premium background abstract elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rustic-100 rounded-full blur-3xl opacity-30 -translate-x-1/3 translate-y-1/3" />

      {/* Header / Nav Dashboard */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sand py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="fill-gold-500 text-gold-500 animate-pulse" size={22} />
            <span className="font-serif text-xl sm:text-2xl font-bold text-gold-600 tracking-wide">Ngaturi</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-charcoal/20 text-charcoal hover:bg-cream"
            >
              <Home size={15} />
              <span className="hidden sm:inline">Landing Page</span>
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 flex items-center gap-1.5"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10">
              <Sparkles size={300} />
            </div>
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-100 font-semibold font-poppins">
                Dasbor Pengguna
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide">
                Selamat Datang, {user?.name}!
              </h1>
              <p className="text-sm sm:text-base text-gold-50/90 max-w-xl font-poppins">
                Kelola pesanan, katalog undangan, dan buat momen pernikahan impian Anda menjadi kenyataan melalui platform kami.
              </p>
            </div>
          </div>

          {/* User Info Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Detail Card */}
            <div className="bg-white rounded-3xl p-6 border border-sand shadow-sm space-y-6 md:col-span-2">
              <div className="flex items-center gap-3 border-b border-sand pb-4">
                <UserIcon className="text-gold-500" size={24} />
                <h3 className="font-serif text-lg font-bold text-charcoal">Detail Profil</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-poppins">
                <div>
                  <span className="text-xs text-charcoal/50 block mb-0.5">NAMA LENGKAP</span>
                  <span className="text-sm font-semibold text-charcoal">{user?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 block mb-0.5">ALAMAT EMAIL</span>
                  <span className="text-sm font-semibold text-charcoal">{user?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 block mb-0.5">ROLE AKSES</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="text-gold-500" size={14} />
                    <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-charcoal/50 block mb-0.5">STATUS AKUN</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Activity className="text-green-500" size={14} />
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      {user?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-sand shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-sand pb-4">
                <Sparkles className="text-gold-500" size={20} />
                <h3 className="font-serif text-lg font-bold text-charcoal">Tindakan Cepat</h3>
              </div>
              <div className="space-y-3 font-poppins text-sm">
                <button className="w-full flex items-center justify-between p-3 border border-sand hover:border-gold-300 rounded-2xl text-left hover:bg-gold-50/20 transition-all cursor-pointer">
                  <span>Buat Undangan Baru</span>
                  <ChevronRight size={16} className="text-gold-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-sand hover:border-gold-300 rounded-2xl text-left hover:bg-gold-50/20 transition-all cursor-pointer">
                  <span>Pilih Tema Undangan</span>
                  <ChevronRight size={16} className="text-gold-500" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-sand hover:border-gold-300 rounded-2xl text-left hover:bg-gold-50/20 transition-all cursor-pointer">
                  <span>Riwayat Pembelian</span>
                  <ChevronRight size={16} className="text-gold-500" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-sand text-center text-xs text-charcoal/40 font-poppins">
        © 2026 Ngaturi. Hak Cipta Dilindungi.
      </footer>
    </div>
  )
}

export default Dashboard
