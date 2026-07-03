import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  ArrowRight,
} from 'lucide-react'
import api from '../../lib/api'
import Button from '../../components/ui/Button'
import { toast } from 'sonner'

export const Gallery: React.FC = () => {
  const [wedding, setWedding] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const loadData = async () => {
    try {
      const res = await api.get('/weddings/me')
      if (res.data.status === 'success' && res.data.wedding) {
        setWedding(res.data.wedding)
        setPhotos(res.data.wedding.photos || [])
      }
    } catch (err) {
      toast.error('Gagal memuat data galeri.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const userPkg = wedding?.package?.packageName || 'BASIC'
  const maxLimit = userPkg === 'PREMIUM' ? 20 : 5
  const countRemaining = maxLimit - photos.length

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (photos.length >= maxLimit) {
      toast.error(`Batas unggah foto terlampaui. Upgrade ke PREMIUM untuk mengunggah hingga 20 foto.`)
      return
    }

    setUploading(true)
    const toastId = toast.loading('Mengunggah dan mengompresi foto...')
    const data = new FormData()
    data.append('file', file)

    try {
      const res = await api.post('/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.status === 'success') {
        toast.success('Foto berhasil ditambahkan ke galeri!', { id: toastId })
        loadData() // Reload photos
      }
    } catch (err) {
      toast.error('Gagal mengunggah foto.', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (photoId: string) => {
    try {
      const res = await api.delete(`/media/photos/${photoId}`)
      if (res.data.status === 'success') {
        setPhotos(photos.filter((p) => p.id !== photoId))
        toast.success('Foto berhasil dihapus.')
      }
    } catch (err) {
      toast.error('Gagal menghapus foto.')
    }
  }

  const handleMove = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= photos.length) return

    const newPhotos = [...photos]
    const temp = newPhotos[index]
    newPhotos[index] = newPhotos[targetIndex]
    newPhotos[targetIndex] = temp

    setPhotos(newPhotos)

    try {
      await api.post('/media/photos/sort', {
        photoIds: newPhotos.map((p) => p.id),
      })
    } catch (err) {
      toast.error('Gagal menyimpan urutan foto.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat data media...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand/35 pb-4">
        <h2 className="text-3xl font-serif font-bold text-charcoal">Galeri & Media Foto</h2>
        <p className="text-sm text-charcoal/60 mt-1">
          Unggah foto kenangan Anda bersama pasangan. Foto akan ditampilkan di gallery slide undangan online.
        </p>
      </div>

      {/* Package Info Alert */}
      <div className="bg-white border border-sand/40 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-charcoal/80">
          <p className="font-semibold text-charcoal">
            Paket Anda: <span className="font-bold text-gold-600">{userPkg}</span>
          </p>
          <p className="text-charcoal/50 mt-0.5">
            Telah terunggah <span className="font-bold">{photos.length}</span> dari maksimal{' '}
            <span className="font-bold">{maxLimit}</span> foto.
          </p>
        </div>

        {userPkg !== 'PREMIUM' && (
          <Link to="/dashboard/billing">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5">
              <span>Upgrade to Premium (20 Photos)</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Upload Box */}
        <div className="lg:col-span-1">
          {photos.length >= maxLimit ? (
            <div className="border border-sand bg-sand/10 rounded-3xl p-6 text-center text-charcoal/50 text-xs flex flex-col items-center justify-center h-48">
              <Lock className="text-charcoal/30 mb-2" size={24} />
              <p>Batas maksimal foto tercapai.</p>
              <p className="mt-1">Hapus foto lama untuk mengunggah baru.</p>
            </div>
          ) : (
            <label className="border-2 border-dashed border-sand/75 hover:border-gold-500 rounded-3xl p-6 flex flex-col items-center justify-center bg-white cursor-pointer h-48 transition-colors group">
              {uploading ? (
                <Loader2 className="animate-spin text-gold-500" size={32} />
              ) : (
                <>
                  <Upload className="text-charcoal/30 group-hover:text-gold-500 transition-colors" size={32} />
                  <p className="text-xs font-semibold text-charcoal/60 mt-3 group-hover:text-gold-500 transition-colors">
                    Unggah Foto Galeri
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-1">Maks. 800KB (JPEG/PNG/WEBP)</p>
                  <p className="text-[10px] text-gold-600 font-bold mt-2">Sisa Kuota: {countRemaining}</p>
                </>
              )}
              <input type="file" accept="image/*" disabled={uploading} className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>

        {/* Photos list */}
        <div className="lg:col-span-3">
          {photos.length === 0 ? (
            <div className="border border-sand/40 bg-white rounded-3xl p-12 text-center text-charcoal/40 text-sm flex flex-col items-center justify-center min-h-48">
              <ImageIcon className="text-charcoal/20 mb-2" size={32} />
              <p>Galeri foto Anda masih kosong.</p>
              <p className="text-xs text-charcoal/30 mt-1">Unggah foto pertama Anda untuk ditampilkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative border border-sand bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="h-32 bg-sand/15 overflow-hidden">
                    <img src={photo.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                  </div>

                  {/* Actions overlay */}
                  <div className="p-2 bg-cream/10 border-t border-sand/40 flex justify-between items-center">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMove(index, 'left')}
                        disabled={index === 0}
                        className="p-1 rounded bg-white border border-sand hover:bg-cream/40 text-charcoal/70 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'right')}
                        disabled={index === photos.length - 1}
                        className="p-1 rounded bg-white border border-sand hover:bg-cream/40 text-charcoal/70 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Order indicator */}
                  <div className="absolute top-2 left-2 bg-charcoal/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-bold">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery
