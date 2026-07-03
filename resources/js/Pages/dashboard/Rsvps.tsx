import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  TrendingUp,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { toast } from 'sonner'

export const Rsvps: React.FC = () => {
  const [guests, setGuests] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ total: 0, attending: 0, declined: 0, tentative: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const loadData = async () => {
    try {
      const statsRes = await api.get('/guests/stats')
      if (statsRes.data.status === 'success') {
        setStats(statsRes.data.stats)
      }

      const guestsRes = await api.get('/guests')
      if (guestsRes.data.status === 'success') {
        setGuests(guestsRes.data.guests)
      }
    } catch (err) {
      toast.error('Gagal memuat respon kehadiran.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await api.put(`/guests/${id}`, {
        isMessageVisible: !currentVisible,
      })
      if (res.data.status === 'success') {
        setGuests((prev) =>
          prev.map((g) => (g.id === id ? { ...g, isMessageVisible: !currentVisible } : g))
        )
        toast.success(
          !currentVisible
            ? 'Ucapan tamu sekarang terlihat publik.'
            : 'Ucapan tamu disembunyikan dari publik.'
        )
      }
    } catch (err) {
      toast.error('Gagal memperbarui status moderasi.')
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Hapus pesan ucapan tamu ini?')) return
    try {
      const res = await api.put(`/guests/${id}`, {
        message: null,
      })
      if (res.data.status === 'success') {
        setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, message: null } : g)))
        toast.success('Pesan ucapan berhasil dihapus.')
      }
    } catch (err) {
      toast.error('Gagal menghapus pesan.')
    }
  }

  // Filter and Search Wishes
  const wishesList = guests.filter((g) => g.message !== null && g.message.trim() !== '')
  
  const filteredWishes = wishesList.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'visible') return matchesSearch && w.isMessageVisible
    if (filterStatus === 'hidden') return matchesSearch && !w.isMessageVisible
    return matchesSearch
  })

  // Chart Data preparation
  const chartData = [
    { name: 'Hadir', jumlah: stats.attending, fill: '#16A34A' },
    { name: 'Absen', jumlah: stats.declined, fill: '#EF4444' },
    { name: 'Ragu', jumlah: stats.tentative, fill: '#F59E0B' },
    { name: 'Belum Respon', jumlah: stats.pending, fill: '#9CA3AF' },
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat analisis kehadiran...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand/35 pb-4">
        <h2 className="text-3xl font-serif font-bold text-charcoal">RSVP & Ucapan Tamu</h2>
        <p className="text-sm text-charcoal/60 mt-1">
          Pantau statistik kehadiran secara real-time dan kelola ucapan manis dari keluarga dan kerabat Anda.
        </p>
      </div>

      {/* Grid: Chart and Stat Numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Numbers */}
        <Card className="lg:col-span-1 p-6 border border-sand/40 bg-white shadow-sm flex flex-col justify-between rounded-3xl">
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal">Detail Konfirmasi</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex flex-col justify-between">
                <CheckCircle className="text-green-600" size={20} />
                <div className="mt-4">
                  <p className="text-2xl font-bold text-green-700">{stats.attending}</p>
                  <p className="text-xs text-green-600/80 font-medium">Hadir</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col justify-between">
                <XCircle className="text-red-500" size={20} />
                <div className="mt-4">
                  <p className="text-2xl font-bold text-red-700">{stats.declined}</p>
                  <p className="text-xs text-red-500/80 font-medium">Absen</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col justify-between">
                <HelpCircle className="text-amber-500" size={20} />
                <div className="mt-4">
                  <p className="text-2xl font-bold text-amber-700">{stats.tentative}</p>
                  <p className="text-xs text-amber-600/80 font-medium">Ragu-ragu</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col justify-between">
                <Clock className="text-gray-500" size={20} />
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
                  <p className="text-xs text-gray-600/80 font-medium">Belum Respon</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-sand/35 pt-4 mt-6 text-center text-xs text-charcoal/60">
            Total Target Tamu: <span className="font-bold text-charcoal">{stats.total} Orang</span>
          </div>
        </Card>

        {/* Recharts chart */}
        <Card className="lg:col-span-2 p-6 border border-sand/40 bg-white shadow-sm rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal mb-4 flex items-center gap-1.5">
              <TrendingUp className="text-gold-500" size={20} />
              <span>Grafik Respon Kehadiran</span>
            </h3>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(235, 230, 222, 0.2)' }} />
                  <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Wishes Moderation Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-charcoal flex items-center gap-2">
          <MessageSquare className="text-gold-500" size={22} />
          <span>Moderasi Ucapan Tamu</span>
        </h3>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-sand/45 rounded-3xl p-4 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Cari kata kunci ucapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-sand rounded-2xl text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 text-xs text-charcoal/60 shrink-0">
              <Filter size={14} />
              <span>Tampilkan:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-sand bg-white text-xs px-3 py-1.5 rounded-xl outline-none"
            >
              <option value="all">Semua Ucapan</option>
              <option value="visible">Hanya Terlihat</option>
              <option value="hidden">Hanya Tersembunyi</option>
            </select>
          </div>
        </div>

        {/* Wishes List */}
        {filteredWishes.length === 0 ? (
          <div className="bg-white border border-sand/40 rounded-3xl p-12 text-center text-charcoal/40 text-sm">
            <MessageSquare className="mx-auto text-charcoal/20 mb-3" size={32} />
            <p>Tidak ada pesan ucapan yang sesuai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWishes.map((wish) => (
              <Card
                key={wish.id}
                className={`p-5 bg-white border flex flex-col justify-between rounded-2xl shadow-sm ${
                  wish.isMessageVisible ? 'border-sand/40' : 'border-red-300 bg-red-50/10'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-charcoal">{wish.name}</p>
                      <span className="text-[10px] text-charcoal/40">
                        {new Date(wish.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <Badge
                      variant={
                        wish.rsvpStatus === 'attending' || wish.rsvpStatus === 'hadir'
                          ? 'success'
                          : wish.rsvpStatus === 'declined' || wish.rsvpStatus === 'tidak hadir'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {wish.rsvpStatus}
                    </Badge>
                  </div>

                  <p className="text-sm text-charcoal/80 mt-3 italic bg-cream/10 p-3 rounded-xl border border-sand/20">
                    "{wish.message}"
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-sand/20">
                  <Button
                    variant={wish.isMessageVisible ? 'outline' : 'primary'}
                    size="sm"
                    className="flex items-center gap-1.5 py-1 text-xs"
                    onClick={() => handleToggleVisibility(wish.id, wish.isMessageVisible)}
                  >
                    {wish.isMessageVisible ? (
                      <>
                        <EyeOff size={14} />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>Tampilkan</span>
                      </>
                    )}
                  </Button>

                  <button
                    onClick={() => handleDeleteMessage(wish.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rsvps
