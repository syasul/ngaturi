import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  Globe,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { toast } from 'sonner'

export const Overview: React.FC = () => {
  const navigate = useNavigate()
  const [wedding, setWedding] = useState<any>(null)
  const [stats, setStats] = useState<any>({ total: 0, attending: 0, declined: 0, tentative: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // 1. Fetch wedding and stats
  useEffect(() => {
    const initOverview = async () => {
      try {
        const res = await api.get('/weddings/me')
        if (res.data.status === 'success') {
          if (!res.data.wedding) {
            // No wedding found -> Go to onboarding
            navigate('/dashboard/onboarding')
            return
          }
          setWedding(res.data.wedding)

          // Fetch guest stats
          const statsRes = await api.get('/guests/stats')
          if (statsRes.data.status === 'success') {
            setStats(statsRes.data.stats)
          }
        }
      } catch (err) {
        console.error('Error loading overview data:', err)
        toast.error('Gagal memuat ringkasan dasbor.')
      } finally {
        setLoading(false)
      }
    }

    initOverview()
  }, [navigate])

  // 2. Countdown logic
  useEffect(() => {
    if (!wedding?.data?.schedule?.akad?.date) return

    const weddingDateStr = wedding.data.schedule.akad.date
    const targetDate = new Date(weddingDateStr).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [wedding])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat data dasbor...</p>
      </div>
    )
  }

  const weddingDateFormatted = wedding?.data?.schedule?.akad?.date
    ? new Date(wedding.data.schedule.akad.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Belum diisi'

  const previewUrl = `${window.location.origin}/u/${wedding?.slug}`

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome & Quick actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-charcoal">
            Selamat Datang, {wedding?.data?.groom?.name || 'Mempelai'} & {wedding?.data?.bride?.name || 'Mempelai'}
          </h2>
          <p className="text-sm text-charcoal/60 mt-1">
            Pantau dan kelola seluruh informasi undangan digital pernikahan Anda di satu tempat.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="md" className="flex items-center gap-2">
              <ExternalLink size={16} />
              <span>Lihat Undangan</span>
            </Button>
          </a>
          <Link to="/dashboard/wedding-data">
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <span>Edit Data</span>
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status card */}
        <Card className="p-6 border border-sand/40 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-gold-500/10 text-gold-600 rounded-xl">
                <Globe size={20} />
              </div>
              <Badge variant={wedding?.status === 'published' ? 'success' : 'warning'}>
                {wedding?.status === 'published' ? 'Aktif / Published' : 'Draft'}
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-charcoal/60 mt-4 uppercase tracking-wider">
              Status Undangan
            </h4>
            <p className="text-lg font-bold text-charcoal mt-1 truncate">
              ngaturi.id/u/{wedding?.slug}
            </p>
          </div>
          <div className="border-t border-sand/30 pt-4 mt-6 flex justify-between items-center text-xs text-charcoal/60">
            <span>Paket: <span className="font-semibold text-gold-600">{wedding?.package?.packageName}</span></span>
            <span>Berakhir: {wedding?.expiredAt ? new Date(wedding.expiredAt).toLocaleDateString('id-ID') : '-'}</span>
          </div>
        </Card>

        {/* Countdown card */}
        <Card className="p-6 border border-sand/40 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-2.5 bg-gold-500/10 text-gold-600 rounded-xl w-fit">
              <Clock size={20} />
            </div>
            <h4 className="text-sm font-semibold text-charcoal/60 mt-4 uppercase tracking-wider">
              Hitung Mundur Hari H
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center mt-2">
              <div className="bg-cream/40 p-2 rounded-lg">
                <p className="text-xl font-bold text-gold-600">{timeLeft.days}</p>
                <p className="text-[10px] text-charcoal/50">Hari</p>
              </div>
              <div className="bg-cream/40 p-2 rounded-lg">
                <p className="text-xl font-bold text-gold-600">{timeLeft.hours}</p>
                <p className="text-[10px] text-charcoal/50">Jam</p>
              </div>
              <div className="bg-cream/40 p-2 rounded-lg">
                <p className="text-xl font-bold text-gold-600">{timeLeft.minutes}</p>
                <p className="text-[10px] text-charcoal/50">Menit</p>
              </div>
              <div className="bg-cream/40 p-2 rounded-lg">
                <p className="text-xl font-bold text-gold-600">{timeLeft.seconds}</p>
                <p className="text-[10px] text-charcoal/50">Detik</p>
              </div>
            </div>
          </div>
          <div className="border-t border-sand/30 pt-4 mt-6 text-xs text-charcoal/60 flex items-center gap-1.5 truncate">
            <Calendar size={14} />
            <span className="truncate">{weddingDateFormatted}</span>
          </div>
        </Card>

        {/* Guest Summary Card */}
        <Card className="p-6 border border-sand/40 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-2.5 bg-gold-500/10 text-gold-600 rounded-xl w-fit">
              <Users size={20} />
            </div>
            <h4 className="text-sm font-semibold text-charcoal/60 mt-4 uppercase tracking-wider">
              Total Undangan Tamu
            </h4>
            <p className="text-3xl font-serif font-bold text-charcoal mt-1">
              {stats.total} <span className="text-sm font-normal text-charcoal/50">Tamu terdaftar</span>
            </p>
          </div>
          <div className="border-t border-sand/30 pt-4 mt-6 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="font-bold text-green-600">{stats.attending}</p>
              <p className="text-[10px] text-charcoal/50">Hadir</p>
            </div>
            <div>
              <p className="font-bold text-red-500">{stats.declined}</p>
              <p className="text-[10px] text-charcoal/50">Absen</p>
            </div>
            <div>
              <p className="font-bold text-gold-600">{stats.tentative}</p>
              <p className="text-[10px] text-charcoal/50">Ragu</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: RSVP Details & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RSVP Ringkasan */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-serif font-bold text-charcoal flex items-center gap-2">
            <TrendingUp size={20} className="text-gold-500" />
            <span>Ringkasan Respon Kehadiran</span>
          </h3>

          <div className="bg-white border border-sand/40 rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Donut chart stats mockup */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#F3F0EC"
                    strokeWidth="3.2"
                  />
                  {/* Attending Segment */}
                  {stats.total > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="3.2"
                      strokeDasharray={`${(stats.attending / stats.total) * 100} ${100 - (stats.attending / stats.total) * 100}`}
                      strokeDashoffset="0"
                    />
                  )}
                  {/* Declined Segment */}
                  {stats.total > 0 && (
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3.2"
                      strokeDasharray={`${(stats.declined / stats.total) * 100} ${100 - (stats.declined / stats.total) * 100}`}
                      strokeDashoffset={`-${(stats.attending / stats.total) * 100}`}
                    />
                  )}
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-bold text-charcoal">
                    {stats.total > 0 ? Math.round(((stats.attending + stats.declined + stats.tentative) / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-[9px] text-charcoal/50 uppercase tracking-wide">Respon</p>
                </div>
              </div>
            </div>

            {/* Stats Labels */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-sand/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-600 rounded-full" />
                  <span className="text-charcoal/70">Hadir</span>
                </div>
                <span className="font-bold">{stats.attending}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-sand/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-charcoal/70">Tidak Hadir</span>
                </div>
                <span className="font-bold">{stats.declined}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-sand/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gold-500 rounded-full" />
                  <span className="text-charcoal/70">Ragu-ragu</span>
                </div>
                <span className="font-bold">{stats.tentative}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-charcoal/70">Belum Respon</span>
                </div>
                <span className="font-bold">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Steps / Checklist */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-charcoal">Checklist Persiapan</h3>
          <div className="bg-white border border-sand/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={!!wedding?.package?.packageName} readOnly className="mt-1 accent-gold-500" />
              <div>
                <p className="font-semibold text-charcoal">Pilih Paket & Bayar</p>
                <p className="text-xs text-charcoal/50 mt-0.5">Aktifkan limit tamu dan fitur premium.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={!!wedding?.themeId} readOnly className="mt-1 accent-gold-500" />
              <div>
                <p className="font-semibold text-charcoal">Pilih Tema Undangan</p>
                <p className="text-xs text-charcoal/50 mt-0.5">Pilih template desain sesuai keinginan.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={!!wedding?.data?.groom?.name} readOnly className="mt-1 accent-gold-500" />
              <div>
                <p className="font-semibold text-charcoal">Isi Data Mempelai & Jadwal</p>
                <p className="text-xs text-charcoal/50 mt-0.5">Lengkapi data akad, resepsi, dan biodata.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={stats.total > 0} readOnly className="mt-1 accent-gold-500" />
              <div>
                <p className="font-semibold text-charcoal">Daftarkan Tamu Undangan</p>
                <p className="text-xs text-charcoal/50 mt-0.5">Input atau import tamu untuk membagikan link.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
