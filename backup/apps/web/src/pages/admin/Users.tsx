import React, { useEffect, useState } from 'react'
import {
  Search,
  Download,
  UserCheck,
  UserX,
  KeyRound,
  Trash2,
  Eye,
  X,
  Loader2,
  Calendar,
} from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED'
  createdAt: string
}

interface UserDetail extends User {
  orders: Array<{
    id: string
    packageName: string
    amount: number
    status: string
    paymentMethod: string
    createdAt: string
  }>
  wedding: {
    id: string
    slug: string
    status: string
    expiredAt: string | null
    createdAt: string
  } | null
}

export const AdminUsers: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  
  // Password Reset state
  const [resettingPassword, setResettingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/users', {
        params: {
          search,
          role: roleFilter,
          status: statusFilter,
        },
      })
      setUsersList(response.data.users)
    } catch (err: any) {
      toast.error('Gagal memuat daftar user.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, statusFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  // View User Details
  const viewUserDetails = async (id: string) => {
    setSelectedUserId(id)
    setLoadingDetail(true)
    setResettingPassword(false)
    setNewPassword('')
    try {
      const response = await api.get(`/admin/users/${id}`)
      setUserDetail(response.data)
    } catch (err: any) {
      toast.error('Gagal mengambil detail user.')
      setSelectedUserId(null)
    } finally {
      setLoadingDetail(false)
    }
  }

  // Toggle User Status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
    const loadingToast = toast.loading('Mengubah status user...')
    try {
      await api.put(`/admin/users/${id}/status`, { status: nextStatus })
      toast.dismiss(loadingToast)
      toast.success(`User berhasil ${nextStatus === 'ACTIVE' ? 'diaktifkan' : 'diblokir'}!`)
      fetchUsers()
      if (userDetail && userDetail.id === id) {
        setUserDetail({ ...userDetail, status: nextStatus as any })
      }
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error('Gagal mengubah status user.')
    }
  }

  // Force Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || newPassword.length < 6) return
    const loadingToast = toast.loading('Mereset password user...')
    try {
      await api.put(`/admin/users/${selectedUserId}/reset-password`, { password: newPassword })
      toast.dismiss(loadingToast)
      toast.success('Password user berhasil direset!')
      setResettingPassword(false)
      setNewPassword('')
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error(err.response?.data?.message || 'Gagal mereset password.')
    }
  }

  // Delete User Account
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus akun user ini secara permanen? Seluruh data undangan, foto, tamu, dan rsvp akan terhapus.')) return
    const loadingToast = toast.loading('Menghapus user...')
    try {
      await api.delete(`/admin/users/${id}`)
      toast.dismiss(loadingToast)
      toast.success('User berhasil dihapus.')
      setSelectedUserId(null)
      setUserDetail(null)
      fetchUsers()
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error('Gagal menghapus user.')
    }
  }

  // Export User List to CSV
  const handleExportCSV = () => {
    if (usersList.length === 0) return
    const headers = 'ID,Nama,Email,Role,Status,Tanggal Terdaftar\n'
    const rows = usersList
      .map(
        (u) =>
          `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${new Date(
            u.createdAt
          ).toLocaleDateString('id-ID')}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `daftar-user-ngaturi-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Kelola User</h1>
          <p className="text-sm text-slate-400">Kelola credentials, status, dan data customer Ngaturi</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
        >
          <Download size={16} />
          <span>Export ke CSV</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative rounded-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari user berdasarkan nama atau email..."
              className="block w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
            >
              <option value="all">Semua Role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING">PENDING</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 bg-slate-950/20">
                  <th className="py-4 px-6 font-semibold">Nama</th>
                  <th className="py-4 px-6 font-semibold">Email</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Terdaftar</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {usersList.length > 0 ? (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/10">
                      <td className="py-4 px-6 font-semibold text-slate-200">{u.name}</td>
                      <td className="py-4 px-6 text-slate-400">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : u.status === 'PENDING'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => viewUserDetails(u.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer"
                          title="Detail User"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300'
                          }`}
                          title={u.status === 'ACTIVE' ? 'Blokir User' : 'Aktifkan User'}
                        >
                          {u.status === 'ACTIVE' ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
                          title="Hapus Akun"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      User tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Slide-Over / Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl relative">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <h3 className="text-base font-serif font-bold text-white">Detail Profile Customer</h3>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-amber-500" size={24} />
                </div>
              ) : (
                userDetail && (
                  <>
                    {/* User Card */}
                    <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{userDetail.name}</h4>
                        <p className="text-xs text-slate-500">{userDetail.email}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500 block">Status Akun</span>
                          <span
                            className={`font-semibold ${
                              userDetail.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {userDetail.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Role</span>
                          <span className="font-semibold text-slate-300">{userDetail.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Wedding Invitation */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Undangan Digital</h4>
                      {userDetail.wedding ? (
                        <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">/u/{userDetail.wedding.slug}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                userDetail.wedding.status === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {userDetail.wedding.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar size={14} />
                            <span>
                              Expire:{' '}
                              {userDetail.wedding.expiredAt
                                ? new Date(userDetail.wedding.expiredAt).toLocaleDateString('id-ID', {
                                    dateStyle: 'medium',
                                  })
                                : 'Draft (Belum lunas)'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">User belum membuat undangan.</p>
                      )}
                    </div>

                    {/* Invoice History */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Riwayat Pembayaran</h4>
                      {userDetail.orders.length > 0 ? (
                        <div className="space-y-2">
                          {userDetail.orders.map((o) => (
                            <div
                              key={o.id}
                              className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-semibold text-slate-200">INV-{o.id.substring(0, 8).toUpperCase()}</p>
                                <p className="text-[10px] text-slate-500">
                                  {new Date(o.createdAt).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-white">
                                  {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                  }).format(o.amount)}
                                </p>
                                <span
                                  className={`text-[9px] font-bold ${
                                    o.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Belum ada transaksi.</p>
                      )}
                    </div>

                    {/* Reset Password Form */}
                    <div className="border-t border-slate-800 pt-6 space-y-3">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi Keamanan</h4>
                      {!resettingPassword ? (
                        <Button
                          onClick={() => setResettingPassword(true)}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-950 hover:bg-slate-800 border-slate-800 text-xs font-bold text-slate-300"
                        >
                          <KeyRound size={14} />
                          <span>Reset Password Customer</span>
                        </Button>
                      ) : (
                        <form onSubmit={handleResetPassword} className="space-y-3">
                          <div>
                            <input
                              type="text"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Masukkan password baru (min 6 karakter)..."
                              className="block w-full px-4 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              disabled={newPassword.length < 6}
                              className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                            >
                              Simpan Password Baru
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setResettingPassword(false)}
                              className="py-2 bg-slate-950 border-slate-800 text-xs text-slate-400"
                            >
                              Batal
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
