import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  Users,
  Heart,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { toast } from 'sonner'

interface KPI {
  totalRevenueMonth: number
  totalUsers: number
  liveWeddings: number
  pendingOrders: number
}

interface AnalyticsData {
  kpis: KPI
  dailyRevenue: Array<{ date: string; amount: number }>
  weeklyUsers: Array<{ week: string; count: number }>
  packageDistribution: Array<{ name: string; value: number }>
  recentTransactions: Array<{
    id: string
    userName: string
    userEmail: string
    packageName: string
    amount: number
    status: string
    paymentMethod: string
    createdAt: string
  }>
  expiringWeddings: Array<{
    id: string
    slug: string
    expiredAt: string
    userName: string
    userEmail: string
  }>
}

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6']

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics')
        setData(response.data.analytics)
      } catch (err: any) {
        toast.error('Gagal mengambil data analytics.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Data tidak tersedia.</p>
      </div>
    )
  }

  const { kpis, dailyRevenue, weeklyUsers, packageDistribution, recentTransactions, expiringWeddings } = data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Overview Analytics</h1>
        <p className="text-sm text-slate-400">Kinerja operasional dan performa keuangan Ngaturi</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue Bulan Ini</p>
            <h3 className="text-2xl font-bold text-white mt-1.5">{formatCurrency(kpis.totalRevenueMonth)}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer</p>
            <h3 className="text-2xl font-bold text-white mt-1.5">{kpis.totalUsers}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Undangan Live</p>
            <h3 className="text-2xl font-bold text-white mt-1.5">{kpis.liveWeddings}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Heart size={24} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Pending</p>
            <h3 className="text-2xl font-bold text-white mt-1.5">{kpis.pendingOrders}</h3>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Revenue Harian (30 Hari Terakhir)</h3>
            <p className="text-xs text-slate-500">Omset harian berdasarkan pembayaran lunas</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Sales Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Distribusi Paket Terjual</h3>
            <p className="text-xs text-slate-500">Perbandingan jumlah paket BASIC vs PREMIUM</p>
          </div>
          <div className="h-60 flex items-center justify-center">
            {packageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {packageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500">Belum ada paket terjual</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Users Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-1">
          <div>
            <h3 className="text-sm font-semibold text-white">Registrasi User Baru (4 Minggu Terakhir)</h3>
            <p className="text-xs text-slate-500">Perkembangan registrasi customer baru per minggu</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyUsers}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiring Weddings List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={16} />
                <span>Undangan Expire Dalam 7 Hari</span>
              </h3>
              <p className="text-xs text-slate-500">Undangan berbayar yang akan dinonaktifkan sistem</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2.5">Slug Undangan</th>
                  <th className="py-2.5">User Pemilik</th>
                  <th className="py-2.5">Tanggal Kadaluwarsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {expiringWeddings.length > 0 ? (
                  expiringWeddings.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/25">
                      <td className="py-3 font-semibold text-slate-200">/u/{w.slug}</td>
                      <td className="py-3 text-slate-400">
                        <div>{w.userName}</div>
                        <div className="text-[10px] text-slate-500">{w.userEmail}</div>
                      </td>
                      <td className="py-3 text-amber-500 font-semibold">
                        {w.expiredAt ? new Date(w.expiredAt).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      Tidak ada undangan yang segera kedaluwarsa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">5 Transaksi Terbaru</h3>
            <p className="text-xs text-slate-500">Pembayaran dan log tagihan invoice terbaru</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1"
          >
            <span>Semua Transaksi</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="py-3">Invoice</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Paket</th>
                <th className="py-3">Jumlah</th>
                <th className="py-3">Metode</th>
                <th className="py-3">Status</th>
                <th className="py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-800/25">
                  <td className="py-3.5 font-semibold text-slate-300">INV-{trx.id.substring(0, 8).toUpperCase()}</td>
                  <td className="py-3.5">
                    <div className="text-slate-200">{trx.userName}</div>
                    <div className="text-[10px] text-slate-500">{trx.userEmail}</div>
                  </td>
                  <td className="py-3.5">
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                      {trx.packageName}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-white">{formatCurrency(trx.amount)}</td>
                  <td className="py-3.5 text-slate-400">{trx.paymentMethod || 'Web'}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        trx.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : trx.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500">
                    {new Date(trx.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
