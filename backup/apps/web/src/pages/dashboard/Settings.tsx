import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Globe,
  Music,
  Lock,
  Loader2,
  CheckCircle,
  XCircle,
  Volume2,
  Eye,
  ArrowRight,
} from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { toast } from 'sonner'

export const Settings: React.FC = () => {
  const [wedding, setWedding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savingSlug, setSavingSlug] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [uploadingMusic, setUploadingMusic] = useState(false)

  // Slug check states
  const [slugInput, setSlugInput] = useState('')
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)

  const loadWedding = async () => {
    try {
      const res = await api.get('/weddings/me')
      if (res.data.status === 'success' && res.data.wedding) {
        const w = res.data.wedding
        setWedding(w)
        setSlugInput(w.slug)
      }
    } catch (err) {
      toast.error('Gagal memuat pengaturan undangan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWedding()
  }, [])

  // Check Slug availability
  const checkSlugAvailability = async () => {
    if (!slugInput.trim() || slugInput.toLowerCase() === wedding?.slug) {
      setIsSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      const res = await api.get(`/weddings/check-slug/${slugInput}`)
      if (res.data.status === 'success') {
        setIsSlugAvailable(res.data.available)
      }
    } catch (err) {
      setIsSlugAvailable(false)
    } finally {
      setCheckingSlug(false)
    }
  }

  // Update slug
  const handleUpdateSlug = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slugInput.trim() || slugInput.toLowerCase() === wedding?.slug) return

    setSavingSlug(true)
    try {
      const res = await api.put('/weddings/me/slug', { slug: slugInput })
      if (res.data.status === 'success') {
        setWedding((prev: any) => ({ ...prev, slug: res.data.wedding.slug }))
        setIsSlugAvailable(null)
        toast.success('URL Undangan berhasil diubah!')
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengubah URL Undangan.'
      toast.error(msg)
    } finally {
      setSavingSlug(false)
    }
  }

  // Toggle Publish / Draft status
  const handleTogglePublish = async () => {
    const targetStatus = wedding?.status === 'published' ? 'draft' : 'published'
    setSavingStatus(true)
    try {
      const res = await api.put('/weddings/me/status', { status: targetStatus })
      if (res.data.status === 'success') {
        setWedding((prev: any) => ({ ...prev, status: targetStatus }))
        toast.success(
          targetStatus === 'published'
            ? 'Undangan berhasil diterbitkan dan aktif!'
            : 'Undangan diubah ke draft (tidak dapat diakses publik).'
        )
      }
    } catch (err) {
      toast.error('Gagal memperbarui status publikasi.')
    } finally {
      setSavingStatus(false)
    }
  }

  // Handle Music Upload
  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const userPkg = wedding?.package?.packageName || 'BASIC'
    if (userPkg !== 'PREMIUM') {
      toast.error('Fitur backsound audio musik kustom hanya tersedia untuk paket PREMIUM.')
      return
    }

    setUploadingMusic(true)
    const toastId = toast.loading('Mengunggah file musik...')
    const data = new FormData()
    data.append('file', file)

    try {
      const res = await api.post('/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.status === 'success') {
        // Save music URL inside wedding.data
        const updatedData = {
          ...wedding.data,
          musicUrl: res.data.url,
        }

        const saveRes = await api.put('/weddings/me', { data: updatedData })
        if (saveRes.data.status === 'success') {
          setWedding((prev: any) => ({ ...prev, data: updatedData }))
          toast.success('Backsound audio berhasil diunggah!', { id: toastId })
        }
      }
    } catch (err) {
      toast.error('Gagal mengunggah file musik.', { id: toastId })
    } finally {
      setUploadingMusic(false)
    }
  }

  // Handle Delete Music
  const handleDeleteMusic = async () => {
    if (!window.confirm('Hapus backsound musik undangan?')) return
    try {
      const updatedData = {
        ...wedding.data,
        musicUrl: null,
      }
      const res = await api.put('/weddings/me', { data: updatedData })
      if (res.data.status === 'success') {
        setWedding((prev: any) => ({ ...prev, data: updatedData }))
        toast.success('Backsound musik berhasil dihapus.')
      }
    } catch (err) {
      toast.error('Gagal menghapus musik.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat data pengaturan...</p>
      </div>
    )
  }

  const userPkg = wedding?.package?.packageName || 'BASIC'
  const isPremium = userPkg === 'PREMIUM'
  const invitationUrl = `${window.location.origin}/u/${wedding?.slug}`

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="border-b border-sand/35 pb-4">
        <h2 className="text-3xl font-serif font-bold text-charcoal">Pengaturan Undangan</h2>
        <p className="text-sm text-charcoal/60 mt-1">
          Kelola tautan slug URL kustom, status penerbitan undangan, dan backsound audio musik.
        </p>
      </div>

      {/* 1. Status Publikasi Panel */}
      <Card className="p-6 border border-sand/45 bg-white shadow-sm rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
          <Eye className="text-gold-500" size={18} />
          <span>Status Publikasi</span>
        </h3>
        <p className="text-xs text-charcoal/60 leading-relaxed">
          Aktifkan status publikasi agar tamu undangan dapat melihat undangan Anda. Jika diubah menjadi draft, undangan Anda tidak akan bisa diakses sementara waktu.
        </p>

        <div className="bg-cream/15 p-4 rounded-2xl border border-sand/30 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-charcoal/70 block">Status saat ini:</span>
            <span
              className={`text-sm font-bold mt-1 inline-block uppercase tracking-wider ${
                wedding?.status === 'published' ? 'text-green-600' : 'text-amber-500'
              }`}
            >
              {wedding?.status === 'published' ? 'Published / Aktif' : 'Draft / Non-aktif'}
            </span>
          </div>

          <Button variant="primary" disabled={savingStatus} onClick={handleTogglePublish}>
            {savingStatus ? (
              <Loader2 className="animate-spin" size={14} />
            ) : wedding?.status === 'published' ? (
              'Ubah ke Draft'
            ) : (
              'Terbitkan Sekarang'
            )}
          </Button>
        </div>
      </Card>

      {/* 2. Custom Link / Slug Panel */}
      <Card className="p-6 border border-sand/45 bg-white shadow-sm rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
          <Globe className="text-gold-500" size={18} />
          <span>Kustom URL Undangan (Slug)</span>
        </h3>
        <p className="text-xs text-charcoal/60 leading-relaxed">
          Ganti tautan akhir URL undangan Anda. Link harus unik dan hanya mengandung huruf, angka, dan tanda strip (-).
        </p>

        <form onSubmit={handleUpdateSlug} className="space-y-4">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-charcoal/50 border-r border-sand pr-3">ngaturi.id/u/</span>
            <input
              type="text"
              value={slugInput}
              onChange={(e) => {
                setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                setIsSlugAvailable(null)
              }}
              placeholder="tautan-kustom"
              className="flex-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
            />
            <Button
              variant="outline"
              type="button"
              disabled={checkingSlug || slugInput === wedding?.slug}
              onClick={checkSlugAvailability}
            >
              {checkingSlug ? <Loader2 className="animate-spin" size={14} /> : 'Cek'}
            </Button>
          </div>

          {/* Availability response */}
          {isSlugAvailable !== null && (
            <div className="flex items-center gap-1.5 text-xs">
              {isSlugAvailable ? (
                <>
                  <CheckCircle className="text-green-600" size={14} />
                  <span className="text-green-600 font-semibold">Tautan kustom tersedia!</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" size={14} />
                  <span className="text-red-500 font-semibold">Tautan sudah digunakan oleh pengguna lain.</span>
                </>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-sand/20 text-xs">
            <a
              href={invitationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{invitationUrl}</span>
            </a>
            <Button
              variant="primary"
              type="submit"
              disabled={savingSlug || isSlugAvailable === false || slugInput === wedding?.slug}
            >
              {savingSlug ? <Loader2 className="animate-spin" size={14} /> : 'Ubah URL'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Custom Music Backsound Panel */}
      <Card className="p-6 border border-sand/45 bg-white shadow-sm rounded-3xl space-y-4">
        <div className="flex justify-between items-center border-b border-sand/20 pb-3">
          <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
            <Music className="text-gold-500" size={18} />
            <span>Musik Latar Belakang (Backsound)</span>
          </h3>
          {!isPremium && (
            <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
              <Lock size={10} />
              <span>Premium</span>
            </span>
          )}
        </div>

        <p className="text-xs text-charcoal/60 leading-relaxed">
          Unggah file MP3 untuk diputar otomatis ketika tamu membuka undangan digital pernikahan Anda.
        </p>

        {isPremium ? (
          <div className="space-y-4">
            {wedding?.data?.musicUrl ? (
              <div className="bg-cream/15 p-4 rounded-2xl border border-sand/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="text-gold-600" size={20} />
                  <div>
                    <span className="text-xs font-semibold text-charcoal/70 block">Audio Aktif:</span>
                    <span className="text-xs text-charcoal/50 truncate max-w-xs block">
                      {wedding.data.musicUrl}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteMusic}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    Hapus Musik
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-sand/75 hover:border-gold-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-cream/5 cursor-pointer transition-colors group">
                {uploadingMusic ? (
                  <Loader2 className="animate-spin text-gold-500" size={24} />
                ) : (
                  <>
                    <Music className="text-charcoal/30 group-hover:text-gold-500 transition-colors" size={24} />
                    <p className="text-xs font-semibold text-charcoal/60 mt-2 group-hover:text-gold-500 transition-colors">
                      Pilih & Unggah File MP3 Latar Belakang
                    </p>
                    <p className="text-[10px] text-charcoal/40 mt-1">Format: MP3 (Maksimal 4MB)</p>
                  </>
                )}
                <input
                  type="file"
                  accept="audio/mpeg"
                  disabled={uploadingMusic}
                  className="hidden"
                  onChange={handleMusicUpload}
                />
              </label>
            )}
          </div>
        ) : (
          <div className="bg-sand/10 border border-sand/35 rounded-2xl p-6 text-center space-y-3">
            <Lock className="text-charcoal/30 mx-auto" size={24} />
            <p className="text-xs text-charcoal/60">
              Fitur backsound audio musik kustom dikunci. Upgrade ke paket premium untuk mengaktifkan musik latar belakang.
            </p>
            <Link to="/dashboard/billing" className="inline-block">
              <Button variant="primary" size="sm" className="flex items-center gap-1.5 mx-auto">
                <span>Upgrade Sekarang</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Settings
