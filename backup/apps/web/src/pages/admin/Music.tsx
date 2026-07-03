import React, { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2, Play, Pause, X, Loader2, Music as MusicIcon } from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'

interface MusicTrack {
  id: string
  title: string
  artist: string
  url: string
  isActive: boolean
  createdAt: string
}

export const AdminMusic: React.FC = () => {
  const [musicList, setMusicList] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)

  // Audio Player State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Drawer / Form State
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [musicUrl, setMusicUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchMusic = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/music')
      setMusicList(response.data.music)
    } catch (err: any) {
      toast.error('Gagal mengambil daftar musik.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMusic()
  }, [])

  // Audio Playback Controller
  const handlePlayPause = (track: MusicTrack) => {
    const fullUrl = track.url.startsWith('/')
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${track.url}`
      : track.url

    if (playingTrackId === track.id) {
      if (audioElement) {
        audioElement.pause()
      }
      setPlayingTrackId(null)
    } else {
      if (audioElement) {
        audioElement.pause()
      }
      const newAudio = new Audio(fullUrl)
      newAudio.play().catch(() => toast.error('Gagal memutar audio.'))
      newAudio.onended = () => setPlayingTrackId(null)
      
      setAudioElement(newAudio)
      setPlayingTrackId(track.id)
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause()
      }
    }
  }, [audioElement])

  const openAddDrawer = () => {
    setEditMode(false)
    setSelectedTrackId(null)
    setTitle('')
    setArtist('')
    setMusicUrl('')
    setIsActive(true)
    setDrawerOpen(true)
  }

  const openEditDrawer = (track: MusicTrack) => {
    setEditMode(true)
    setSelectedTrackId(track.id)
    setTitle(track.title)
    setArtist(track.artist)
    setMusicUrl(track.url)
    setIsActive(track.isActive)
    setDrawerOpen(true)
  }

  // Handle Music Upload (MP3, max 10MB)
  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File terlalu besar! Maksimal ukuran audio adalah 10MB.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const loadingToast = toast.loading('Mengunggah file MP3...')
    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.dismiss(loadingToast)
      toast.success('File audio berhasil diunggah!')
      setMusicUrl(response.data.url)
      
      // Auto-populate Title/Artist from filename as helper
      const cleanName = file.name.replace(/\.[^/.]+$/, '').split('-')
      if (cleanName.length > 1) {
        setArtist(cleanName[0].trim())
        setTitle(cleanName[1].trim())
      } else {
        setTitle(cleanName[0].trim())
      }
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error('Gagal mengunggah file audio.')
    }
  }

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !artist || !musicUrl) {
      toast.error('Judul, artis, dan file musik wajib diisi.')
      return
    }

    setSaving(true)
    const payload = {
      title,
      artist,
      url: musicUrl,
      isActive,
    }

    try {
      if (editMode && selectedTrackId) {
        await api.put(`/admin/music/${selectedTrackId}`, payload)
        toast.success('Metadata musik berhasil disimpan!')
      } else {
        await api.post('/admin/music', payload)
        toast.success('Musik berhasil ditambahkan ke pustaka!')
      }
      setDrawerOpen(false)
      fetchMusic()
    } catch (err: any) {
      toast.error('Gagal menyimpan musik.')
    } finally {
      setSaving(false)
    }
  }

  // Toggle Active
  const handleToggleActive = async (track: MusicTrack) => {
    const nextStatus = !track.isActive
    try {
      await api.put(`/admin/music/${track.id}`, {
        title: track.title,
        artist: track.artist,
        isActive: nextStatus,
      })
      toast.success(`Musik ${track.title} berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}!`)
      fetchMusic()
    } catch (err: any) {
      toast.error('Gagal memperbarui status musik.')
    }
  }

  // Delete Music
  const handleDeleteMusic = async (id: string) => {
    if (!window.confirm('Hapus musik ini dari pustaka secara permanen?')) return
    try {
      await api.delete(`/admin/music/${id}`)
      toast.success('Musik berhasil dihapus.')
      if (playingTrackId === id) {
        if (audioElement) audioElement.pause()
        setPlayingTrackId(null)
      }
      fetchMusic()
    } catch (err: any) {
      toast.error('Gagal menghapus musik.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Pustaka Musik</h1>
          <p className="text-sm text-slate-400">Kelola musik/backsound bawaan yang dapat dipilih oleh customer</p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Upload Musik</span>
        </button>
      </div>

      {/* Music Table */}
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
                  <th className="py-4 px-6 font-semibold w-16">Preview</th>
                  <th className="py-4 px-6 font-semibold">Judul Lagu</th>
                  <th className="py-4 px-6 font-semibold">Artis</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">File Path / URL</th>
                  <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {musicList.length > 0 ? (
                  musicList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/10">
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handlePlayPause(m)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            playingTrackId === m.id
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-350 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {playingTrackId === m.id ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
                        </button>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-200">{m.title}</td>
                      <td className="py-4 px-6 text-slate-400">{m.artist}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            m.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {m.isActive ? 'Aktif' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500 max-w-[200px] truncate">{m.url}</td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleActive(m)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            m.isActive
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                          }`}
                          title={m.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          <MusicIcon size={14} />
                        </button>
                        <button
                          onClick={() => openEditDrawer(m)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Edit Metadata"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMusic(m.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all cursor-pointer"
                          title="Hapus Musik"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Pustaka musik masih kosong.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer Form for Music */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl relative">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <h3 className="text-base font-serif font-bold text-white">
                {editMode ? 'Edit Metadata Musik' : 'Upload Musik Baru'}
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
                {/* Upload File (Only when adding new track) */}
                {!editMode && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      File Audio MP3 (Maksimal 10MB)
                    </label>
                    <input
                      type="file"
                      accept="audio/mpeg, audio/mp3"
                      onChange={handleMusicUpload}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                    />
                  </div>
                )}

                {/* File URL (read-only if uploaded, input editable otherwise) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    File Path / Audio URL
                  </label>
                  <input
                    type="text"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="URL musik (e.g. /uploads/song.mp3)"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Judul Lagu
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. A Thousand Years"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Artis / Penyanyi
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="e.g. Christina Perri"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-350">Status Musik</span>
                    <span className="block text-[10px] text-slate-500">Tampilkan pilihan ini ke dashboard customer</span>
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
                  {saving ? 'Menyimpan...' : 'Simpan Musik'}
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

export default AdminMusic
