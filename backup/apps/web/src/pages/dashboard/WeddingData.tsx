import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Calendar,
  MapPin,
  BookOpen,
  Quote,
  Save,
  Loader2,
  ExternalLink,
  Upload,
} from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { toast } from 'sonner'

type TabType = 'groom' | 'bride' | 'akad' | 'resepsi' | 'stories' | 'quotes'

export const WeddingData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('groom')
  const [wedding, setWedding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  
  // Local state for all fields
  const [formData, setFormData] = useState<any>({
    groom: { name: '', nickname: '', parents: '', bio: '', ig: '', photo: '' },
    bride: { name: '', nickname: '', parents: '', bio: '', ig: '', photo: '' },
    akad: { date: '', time: '', venue: '', address: '', maps: '' },
    resepsi: { date: '', time: '', venue: '', address: '', maps: '' },
    stories: [],
    quotes: '',
  })

  const isDirtyRef = useRef(false)

  // 1. Load data
  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const res = await api.get('/weddings/me')
        if (res.data.status === 'success' && res.data.wedding) {
          const w = res.data.wedding
          setWedding(w)
          
          // Merge fetched data with default structures
          const merged = {
            groom: { ...formData.groom, ...(w.data?.groom || {}) },
            bride: { ...formData.bride, ...(w.data?.bride || {}) },
            akad: { ...formData.akad, ...(w.data?.schedule?.akad || {}) },
            resepsi: { ...formData.resepsi, ...(w.data?.schedule?.resepsi || {}) },
            stories: w.data?.stories || [],
            quotes: w.data?.quotes || '',
          }
          setFormData(merged)
        }
      } catch (err) {
        toast.error('Gagal mengambil data undangan.')
      } finally {
        setLoading(false)
      }
    }
    fetchWedding()
  }, [])

  // 2. Auto-save every 30 seconds if dirty
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirtyRef.current) {
        handleSave(false) // Silent save
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [formData])

  const handleFieldChange = (tab: keyof typeof formData, field: string, value: any) => {
    isDirtyRef.current = true
    setFormData((prev: any) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }))
  }

  const handleStoryChange = (index: number, field: string, value: any) => {
    isDirtyRef.current = true
    const newStories = [...formData.stories]
    newStories[index] = { ...newStories[index], [field]: value }
    setFormData((prev: any) => ({ ...prev, stories: newStories }))
  }

  const addStory = () => {
    isDirtyRef.current = true
    setFormData((prev: any) => ({
      ...prev,
      stories: [...prev.stories, { year: '', title: '', story: '' }],
    }))
  }

  const removeStory = (index: number) => {
    isDirtyRef.current = true
    setFormData((prev: any) => ({
      ...prev,
      stories: prev.stories.filter((_: any, i: number) => i !== index),
    }))
  }

  // 3. Save to database
  const handleSave = async (showToast = true) => {
    setSaving(true)
    try {
      const payload = {
        data: {
          groom: formData.groom,
          bride: formData.bride,
          schedule: {
            akad: formData.akad,
            resepsi: formData.resepsi,
          },
          stories: formData.stories,
          quotes: formData.quotes,
        },
      }

      const res = await api.put('/weddings/me', payload)
      if (res.data.status === 'success') {
        isDirtyRef.current = false
        const now = new Date().toLocaleTimeString('id-ID')
        setLastSaved(now)
        if (showToast) {
          toast.success('Perubahan data berhasil disimpan!')
        }
      }
    } catch (err) {
      if (showToast) {
        toast.error('Gagal menyimpan perubahan.')
      }
    } finally {
      setSaving(false)
    }
  }

  // 4. Handle avatar uploads
  const handlePhotoUpload = async (tab: 'groom' | 'bride', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const toastId = toast.loading('Mengunggah foto...')
    const data = new FormData()
    data.append('file', file)

    try {
      const res = await api.post('/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.status === 'success') {
        handleFieldChange(tab, 'photo', res.data.url)
        toast.success('Foto berhasil diunggah!', { id: toastId })
        // Save automatically
        setTimeout(() => handleSave(false), 200)
      }
    } catch (err) {
      toast.error('Gagal mengunggah foto.', { id: toastId })
    }
  }

  const handlePreview = async () => {
    await handleSave(false)
    const previewUrl = `${window.location.origin}/u/${wedding?.slug}`
    window.open(previewUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat data editor...</p>
      </div>
    )
  }

  const tabs: { id: TabType; name: string; icon: any }[] = [
    { id: 'groom', name: 'Mempelai Pria', icon: User },
    { id: 'bride', name: 'Mempelai Wanita', icon: User },
    { id: 'akad', name: 'Akad Nikah', icon: Calendar },
    { id: 'resepsi', name: 'Resepsi', icon: MapPin },
    { id: 'stories', name: 'Love Story', icon: BookOpen },
    { id: 'quotes', name: 'Quotes', icon: Quote },
  ]

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/35 pb-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-charcoal">Data Pernikahan</h2>
          <p className="text-sm text-charcoal/60 mt-1">
            Lengkapi profil Anda dan pasangan, jadwal acara, cerita kasih, dan kutipan pengantar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-charcoal/50 font-medium">
              Simpan otomatis: {lastSaved}
            </span>
          )}
          <Button variant="outline" size="md" className="flex items-center gap-2" onClick={handlePreview}>
            <ExternalLink size={16} />
            <span>Simpan & Preview</span>
          </Button>
          <Button variant="primary" size="md" className="flex items-center gap-2" disabled={saving} onClick={() => handleSave(true)}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Simpan</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation list */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gold-500 text-white shadow-md shadow-gold-500/20'
                    : 'bg-white text-charcoal/70 hover:bg-cream/40 border border-sand/45'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Form panel */}
        <Card className="lg:col-span-3 p-6 sm:p-8 bg-white border border-sand/40 shadow-sm rounded-3xl">
          {/* TAB 1: GROOM */}
          {activeTab === 'groom' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-4 border-b border-sand/20">
                <div className="w-20 h-20 rounded-2xl border border-sand bg-cream/15 overflow-hidden flex items-center justify-center relative group">
                  {formData.groom.photo ? (
                    <img src={formData.groom.photo} alt="Groom Photo" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-charcoal/30" size={32} />
                  )}
                  <label className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="text-white" size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload('groom', e)} />
                  </label>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-charcoal">Foto Mempelai Pria</h4>
                  <p className="text-xs text-charcoal/50 mt-1">JPEG, PNG, WEBP. Maksimal ukuran 800KB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Lengkap Pria</label>
                  <input
                    type="text"
                    value={formData.groom.name}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('groom', 'name', e.target.value)}
                    placeholder="Nama Lengkap Mempelai Pria"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.groom.nickname}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('groom', 'nickname', e.target.value)}
                    placeholder="Panggilan"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Orang Tua</label>
                <input
                  type="text"
                  value={formData.groom.parents}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('groom', 'parents', e.target.value)}
                  placeholder="Putra dari Bpk. X & Ibu Y"
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Username Instagram (Opsional)</label>
                <input
                  type="text"
                  value={formData.groom.ig}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('groom', 'ig', e.target.value)}
                  placeholder="@username"
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Kata Pengantar / Bio Singkat</label>
                <textarea
                  rows={4}
                  value={formData.groom.bio}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('groom', 'bio', e.target.value)}
                  placeholder="Ceritakan singkat tentang diri mempelai pria..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BRIDE */}
          {activeTab === 'bride' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-4 border-b border-sand/20">
                <div className="w-20 h-20 rounded-2xl border border-sand bg-cream/15 overflow-hidden flex items-center justify-center relative group">
                  {formData.bride.photo ? (
                    <img src={formData.bride.photo} alt="Bride Photo" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-charcoal/30" size={32} />
                  )}
                  <label className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="text-white" size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload('bride', e)} />
                  </label>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-charcoal">Foto Mempelai Wanita</h4>
                  <p className="text-xs text-charcoal/50 mt-1">JPEG, PNG, WEBP. Maksimal ukuran 800KB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Lengkap Wanita</label>
                  <input
                    type="text"
                    value={formData.bride.name}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('bride', 'name', e.target.value)}
                    placeholder="Nama Lengkap Mempelai Wanita"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.bride.nickname}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('bride', 'nickname', e.target.value)}
                    placeholder="Panggilan"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Orang Tua</label>
                <input
                  type="text"
                  value={formData.bride.parents}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('bride', 'parents', e.target.value)}
                  placeholder="Putri dari Bpk. A & Ibu B"
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Username Instagram (Opsional)</label>
                <input
                  type="text"
                  value={formData.bride.ig}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('bride', 'ig', e.target.value)}
                  placeholder="@username"
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Kata Pengantar / Bio Singkat</label>
                <textarea
                  rows={4}
                  value={formData.bride.bio}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('bride', 'bio', e.target.value)}
                  placeholder="Ceritakan singkat tentang diri mempelai wanita..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                />
              </div>
            </div>
          )}

          {/* TAB 3: AKAD */}
          {activeTab === 'akad' && (
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-lg text-charcoal border-b border-sand/20 pb-2">
                Informasi Akad Nikah
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Tanggal Akad</label>
                  <input
                    type="date"
                    value={formData.akad.date}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('akad', 'date', e.target.value)}
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Waktu Akad (WIB/WITA/WIT)</label>
                  <input
                    type="text"
                    value={formData.akad.time}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('akad', 'time', e.target.value)}
                    placeholder="Contoh: 08:00 - 10:00 WIB"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Tempat / Gedung</label>
                <input
                  type="text"
                  value={formData.akad.venue}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('akad', 'venue', e.target.value)}
                  placeholder="Contoh: Masjid Agung Al-Akbar / Rumah Kediaman"
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  value={formData.akad.address}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('akad', 'address', e.target.value)}
                  placeholder="Alamat lengkap lokasi akad nikah..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Link Google Maps</label>
                <input
                  type="text"
                  value={formData.akad.maps}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('akad', 'maps', e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 4: RESEPSI */}
          {activeTab === 'resepsi' && (
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-lg text-charcoal border-b border-sand/20 pb-2">
                Informasi Resepsi Pernikahan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Tanggal Resepsi</label>
                  <input
                    type="date"
                    value={formData.resepsi.date}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('resepsi', 'date', e.target.value)}
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Waktu Resepsi</label>
                  <input
                    type="text"
                    value={formData.resepsi.time}
                    onBlur={() => handleSave(false)}
                    onChange={(e) => handleFieldChange('resepsi', 'time', e.target.value)}
                    placeholder="Contoh: 11:00 - Selesai"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Tempat / Gedung</label>
                <input
                  type="text"
                  value={formData.resepsi.venue}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('resepsi', 'venue', e.target.value)}
                  placeholder="Nama gedung resepis..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Alamat Lengkap</label>
                <textarea
                  rows={3}
                  value={formData.resepsi.address}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('resepsi', 'address', e.target.value)}
                  placeholder="Alamat lengkap lokasi resepsi..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Link Google Maps</label>
                <input
                  type="text"
                  value={formData.resepsi.maps}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => handleFieldChange('resepsi', 'maps', e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 5: STORIES */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-sand/20 pb-2">
                <h4 className="font-serif font-bold text-lg text-charcoal">Cerita Kasih (Love Story)</h4>
                <Button variant="outline" size="sm" onClick={addStory}>
                  + Tambah Cerita
                </Button>
              </div>

              {formData.stories.length === 0 ? (
                <div className="text-center py-12 text-charcoal/50 text-xs">
                  Belum ada cerita kasih yang ditambahkan. Klik tombol di atas untuk memulai.
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.stories.map((story: any, index: number) => (
                    <div key={index} className="p-4 border border-sand/40 rounded-2xl bg-cream/10 relative space-y-4">
                      <button
                        onClick={() => removeStory(index)}
                        className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-charcoal/60 uppercase">Tahun</label>
                          <input
                            type="text"
                            value={story.year}
                            onBlur={() => handleSave(false)}
                            onChange={(e) => handleStoryChange(index, 'year', e.target.value)}
                            placeholder="Contoh: 2020"
                            className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-charcoal/60 uppercase">Judul Cerita</label>
                          <input
                            type="text"
                            value={story.title}
                            onBlur={() => handleSave(false)}
                            onChange={(e) => handleStoryChange(index, 'title', e.target.value)}
                            placeholder="Contoh: Pertama Kali Bertemu"
                            className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-charcoal/60 uppercase">Cerita Singkat</label>
                        <textarea
                          rows={3}
                          value={story.story}
                          onBlur={() => handleSave(false)}
                          onChange={(e) => handleStoryChange(index, 'story', e.target.value)}
                          placeholder="Tuliskan cerita singkat tentang momen tersebut..."
                          className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <h4 className="font-serif font-bold text-lg text-charcoal border-b border-sand/20 pb-2">
                Kata Pengantar & Quotes
              </h4>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Quotes Pembuka / Ayat Suci</label>
                <textarea
                  rows={8}
                  value={formData.quotes}
                  onBlur={() => handleSave(false)}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, quotes: e.target.value }))}
                  placeholder="Kutipan ayat suci Quran, kutipan Alkitab, atau quotes romantis untuk pembuka undangan..."
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default WeddingData
