import React, { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'

interface Theme {
  id: string
  name: string
  thumbnailUrl: string | null
  isActive: boolean
  packageLevel: 'BASIC' | 'PREMIUM'
  usersCount: number
}

export const AdminThemes: React.FC = () => {
  const [themesList, setThemesList] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  // Drawer / Form state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [slugId, setSlugId] = useState('') // theme id (e.g. rustic)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [packageLevel, setPackageLevel] = useState<'BASIC' | 'PREMIUM'>('BASIC')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchThemes = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/themes')
      setThemesList(response.data.themes)
    } catch (err: any) {
      toast.error('Gagal memuat katalog tema.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThemes()
  }, [])

  const openAddDrawer = () => {
    setEditMode(false)
    setSelectedThemeId(null)
    setName('')
    setSlugId('')
    setThumbnailUrl('')
    setPackageLevel('BASIC')
    setIsActive(true)
    setDrawerOpen(true)
  }

  const openEditDrawer = (theme: Theme) => {
    setEditMode(true)
    setSelectedThemeId(theme.id)
    setName(theme.name)
    setSlugId(theme.id)
    setThumbnailUrl(theme.thumbnailUrl || '')
    setPackageLevel(theme.packageLevel)
    setIsActive(theme.isActive)
    setDrawerOpen(true)
  }

  // Handle Thumbnail File Upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const loadingToast = toast.loading('Mengunggah gambar thumbnail...')
    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.dismiss(loadingToast)
      toast.success('Thumbnail berhasil diunggah!')
      setThumbnailUrl(response.data.url)
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error('Gagal mengunggah thumbnail.')
    }
  }

  // Submit Add/Edit Theme Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slugId) {
      toast.error('Nama dan Slug ID tema wajib diisi.')
      return
    }

    setSaving(true)
    const payload = {
      id: slugId,
      name,
      thumbnailUrl,
      packageLevel,
      isActive,
    }

    try {
      if (editMode && selectedThemeId) {
        await api.put(`/admin/themes/${selectedThemeId}`, payload)
        toast.success('Tema berhasil diperbarui!')
      } else {
        await api.post('/admin/themes', payload)
        toast.success('Tema baru berhasil ditambahkan!')
      }
      setDrawerOpen(false)
      fetchThemes()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan tema.')
    } finally {
      setSaving(false)
    }
  }

  // Toggle Theme Activation
  const handleToggleActive = async (theme: Theme) => {
    const nextStatus = !theme.isActive
    try {
      await api.put(`/admin/themes/${theme.id}`, {
        name: theme.name,
        thumbnailUrl: theme.thumbnailUrl,
        packageLevel: theme.packageLevel,
        isActive: nextStatus,
      })
      toast.success(`Tema ${theme.name} berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}!`)
      fetchThemes()
    } catch (err: any) {
      toast.error('Gagal memperbarui status tema.')
    }
  }

  // Delete Theme
  const handleDeleteTheme = async (theme: Theme) => {
    if (theme.usersCount > 0) {
      toast.error('Gagal menghapus: Tema masih aktif digunakan oleh customer.')
      return
    }

    if (!window.confirm(`Hapus tema "${theme.name}" secara permanen?`)) return

    try {
      await api.delete(`/admin/themes/${theme.id}`)
      toast.success('Tema berhasil dihapus.')
      fetchThemes()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus tema.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Katalog Tema</h1>
          <p className="text-sm text-slate-400">Kelola katalog design layout dan package restriction tema</p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Tema</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themesList.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group relative"
            >
              {/* Thumbnail Area */}
              <div className="aspect-[4/3] bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                {t.thumbnailUrl ? (
                  <img
                    src={t.thumbnailUrl.startsWith('/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${t.thumbnailUrl}` : t.thumbnailUrl}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                  />
                ) : (
                  <div className="text-slate-700 flex flex-col items-center gap-2">
                    <ImageIcon size={48} />
                    <span className="text-xs">No Thumbnail</span>
                  </div>
                )}
                
                {/* Package Level Badge */}
                <span
                  className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase shadow-lg ${
                    t.packageLevel === 'PREMIUM'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-850 text-slate-300 border border-slate-700'
                  }`}
                >
                  {t.packageLevel}
                </span>

                {/* Users Count Badge */}
                <span className="absolute bottom-4 right-4 px-2.5 py-0.5 rounded-full font-semibold text-[10px] bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-xs">
                  {t.usersCount} Pengguna
                </span>
              </div>

              {/* Title & Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{t.name}</h3>
                  <p className="text-xs font-mono text-slate-500">ID: {t.id}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
                  {/* Status Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(t)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        t.isActive ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                          t.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-slate-400">{t.isActive ? 'Aktif' : 'Draft'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditDrawer(t)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                      title="Edit Tema"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTheme(t)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
                      title="Hapus Tema"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Drawer for Theme Form */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl relative">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <h3 className="text-base font-serif font-bold text-white">
                {editMode ? 'Edit Tema Undangan' : 'Tambah Tema Baru'}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Slug ID (non-editable in editMode) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Slug ID / Unique Key
                  </label>
                  <input
                    type="text"
                    value={slugId}
                    disabled={editMode}
                    onChange={(e) => setSlugId(e.target.value)}
                    placeholder="e.g. elegant-gold, rustic-blossom"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 disabled:bg-slate-900/50"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Hanya karakter huruf kecil, angka, dan garis penghubung (-). Tidak bisa diubah setelah dibuat.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Nama Tema
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elegant Gold"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Package Level */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tingkat Paket
                  </label>
                  <select
                    value={packageLevel}
                    onChange={(e) => setPackageLevel(e.target.value as any)}
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="BASIC">BASIC (Standard)</option>
                    <option value="PREMIUM">PREMIUM (Exclusive)</option>
                  </select>
                </div>

                {/* Thumbnail Upload & Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Thumbnail Tema
                  </label>
                  
                  {/* File input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />

                  {/* Manual URL input */}
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar eksternal..."
                    className="block w-full px-4 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />

                  {thumbnailUrl && (
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2 relative">
                      <img
                        src={thumbnailUrl.startsWith('/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${thumbnailUrl}` : thumbnailUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-300">Tampilkan ke Katalog</span>
                    <span className="block text-[10px] text-slate-500">Tampilkan pilihan tema di onboarding user</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      isActive ? 'bg-amber-500' : 'bg-slate-850'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                        isActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/20 flex gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Tema'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="py-2.5 bg-slate-950 border-slate-800 text-xs text-slate-400"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminThemes
