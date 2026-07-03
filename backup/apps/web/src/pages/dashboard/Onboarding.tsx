import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Palette,
  Heart,
  Image as ImageIcon,
  Check,
  Upload,
  Loader2,
  Lock,
} from 'lucide-react'
import api from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import { toast } from 'sonner'

export const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [step, setStep] = useState(1)
  const [packages, setPackages] = useState<any[]>([])
  const [themes, setThemes] = useState<any[]>([])
  
  const [selectedPkg, setSelectedPkg] = useState<any>(null)
  
  // Basic metadata form state
  const [groomName, setGroomName] = useState('')
  const [groomNick, setGroomNick] = useState('')
  const [brideName, setBrideName] = useState('')
  const [brideNick, setBrideNick] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [weddingVenue, setWeddingVenue] = useState('')

  // Upload state
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activePackageLevel, setActivePackageLevel] = useState<string>('NONE')
  const [paymentMethod, setPaymentMethod] = useState('QRIS')
  const [pendingOrder, setPendingOrder] = useState<any>(null)

  // Redirect if user already has a wedding & check active package/orders
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await api.get('/weddings/me')
        if (res.data.status === 'success' && res.data.wedding) {
          toast.info('Anda sudah menyelesaikan onboarding.')
          navigate('/dashboard')
          return
        }

        // Check latest orders
        const ordersRes = await api.get('/orders/history')
        if (ordersRes.data.status === 'success' && ordersRes.data.history?.length > 0) {
          const latestPaid = ordersRes.data.history.find((h: any) => h.status === 'PAID')
          if (latestPaid) {
            setActivePackageLevel(latestPaid.packageName)
            setStep(2) // Skip directly to theme selection
          } else {
            const latestPending = ordersRes.data.history.find((h: any) => h.status === 'PENDING')
            if (latestPending) {
              setPendingOrder(latestPending)
            }
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    checkExisting()
  }, [navigate])

  // Fetch packages and themes
  useEffect(() => {
    api.get('/orders/packages').then((res) => {
      if (res.data.status === 'success') {
        setPackages(res.data.packages)
      }
    })
    api.get('/themes').then((res) => {
      if (res.data.status === 'success') {
        setThemes(res.data.themes)
      }
    })
  }, [])

  // Handle Checkout / Payment Registration
  const handleCheckout = async () => {
    if (!selectedPkg) return
    setLoading(true)
    try {
      const res = await api.post('/orders/checkout', {
        packageId: selectedPkg.id,
        paymentMethod: paymentMethod,
      })

      if (res.data.status === 'success') {
        toast.success(`Tagihan untuk paket ${selectedPkg.name} berhasil dibuat!`)
        setIsPaymentModalOpen(false)
        navigate(`/dashboard/checkout/${res.data.order.id}`)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memproses transaksi.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Theme Selection & Wedding Creation
  const handleSelectTheme = async (theme: any) => {
    if (theme.packageLevel === 'PREMIUM' && activePackageLevel !== 'PREMIUM') {
      toast.error('Tema Premium hanya tersedia untuk paket PREMIUM. Silakan upgrade.')
      return
    }
    setLoading(true)
    try {
      // Auto-generate slug
      const nameSlug = `${user?.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(
        Math.random() * 900 + 100
      )}`
      
      const res = await api.post('/weddings', {
        slug: nameSlug,
        themeId: theme.id,
      })

      if (res.data.status === 'success') {
        toast.success('Tema berhasil dipilih!')
        setStep(3)
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menyimpan pilihan tema.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Handle Saving Metadata
  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groomName || !brideName || !weddingDate || !weddingVenue) {
      toast.error('Silakan lengkapi semua data pernikahan.')
      return
    }

    setLoading(true)
    try {
      const weddingData = {
        groom: {
          name: groomName,
          nickname: groomNick || groomName.split(' ')[0],
          parents: 'Bapak & Ibu mempelai pria',
          bio: '',
          ig: '',
          photo: '',
        },
        bride: {
          name: brideName,
          nickname: brideNick || brideName.split(' ')[0],
          parents: 'Bapak & Ibu mempelai wanita',
          bio: '',
          ig: '',
          photo: '',
        },
        schedule: {
          akad: {
            date: weddingDate,
            time: '09:00 - 10:00',
            venue: weddingVenue,
            address: weddingVenue + ' Address',
            maps: '',
          },
          resepsi: {
            date: weddingDate,
            time: '11:00 - 13:00',
            venue: weddingVenue,
            address: weddingVenue + ' Address',
            maps: '',
          },
        },
        stories: [],
        quotes: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan...',
      }

      const res = await api.put('/weddings/me', { data: weddingData })
      if (res.data.status === 'success') {
        toast.success('Data pernikahan berhasil disimpan.')
        setStep(4)
      }
    } catch (err) {
      toast.error('Gagal menyimpan data pernikahan.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.status === 'success') {
        setCoverPhoto(res.data.url)
        toast.success('Foto cover berhasil diunggah!')
      }
    } catch (err) {
      toast.error('Gagal mengunggah foto.')
    } finally {
      setUploading(false)
    }
  }

  const stepsInfo = [
    { number: 1, name: 'Pilih Paket', icon: CreditCard },
    { number: 2, name: 'Pilih Tema', icon: Palette },
    { number: 3, name: 'Isi Data', icon: Heart },
    { number: 4, name: 'Cover Foto', icon: ImageIcon },
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="text-center text-4xl font-serif font-bold text-charcoal tracking-wide">
          Persiapan Undangan Digital Anda
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60">
          Selesaikan 4 langkah mudah ini untuk mengaktifkan undangan digital premium Anda.
        </p>

        {/* Progress bar */}
        <div className="mt-8 flex justify-between items-center relative px-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sand/60 -translate-y-1/2 z-0" />
          {stepsInfo.map((s) => {
            const Icon = s.icon
            const isCompleted = step > s.number
            const isActive = step === s.number
            return (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isActive
                      ? 'bg-gold-500 border-gold-500 text-white'
                      : 'bg-white border-sand text-charcoal/40'
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold mt-2 tracking-wide uppercase ${
                    isActive ? 'text-gold-600 font-bold' : 'text-charcoal/50'
                  }`}
                >
                  {s.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-sand/65 sm:rounded-3xl sm:px-10">
          {/* STEP 1: SELECT PACKAGE */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-charcoal text-center">
                Pilih Paket Fitur Undangan Anda
              </h3>

              {pendingOrder && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-amber-800">
                  <div className="text-xs text-left">
                    <p className="font-bold">Pembayaran Tertunda Ditemukan</p>
                    <p className="mt-0.5">Anda memiliki invoice untuk paket <strong>{pendingOrder.packageName}</strong> yang belum diselesaikan.</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/dashboard/checkout/${pendingOrder.id}`)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 px-4 text-xs shrink-0 rounded-xl"
                  >
                    Bayar Sekarang
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`p-6 border flex flex-col justify-between transition-all relative overflow-hidden ${
                      selectedPkg?.id === pkg.id
                        ? 'border-gold-500 bg-gold-500/5 ring-1 ring-gold-500'
                        : 'border-sand hover:border-gold-500 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="text-lg font-serif font-bold text-charcoal">{pkg.name}</h4>
                      <p className="text-2xl font-bold text-gold-600 mt-2">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </p>
                      <ul className="text-xs text-charcoal/70 space-y-2 mt-4">
                        {pkg.features.map((feat: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="text-green-600 mt-0.5 shrink-0" size={14} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={selectedPkg?.id === pkg.id ? 'primary' : 'outline'}
                      className="w-full mt-6"
                      onClick={() => {
                        setSelectedPkg(pkg)
                        setIsPaymentModalOpen(true)
                      }}
                    >
                      Pilih & Bayar
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT THEME */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-charcoal text-center">
                Pilih Tema Desain Undangan
              </h3>
              <p className="text-xs text-center text-charcoal/60">
                Paket Anda: <span className="font-semibold text-gold-600">{activePackageLevel}</span>. Tema dapat diganti kapan saja secara gratis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {themes.map((theme) => {
                  const isLocked = theme.packageLevel === 'PREMIUM' && activePackageLevel !== 'PREMIUM'
                  return (
                    <div
                      key={theme.id}
                      className={`border rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col ${
                        isLocked ? 'opacity-65' : 'hover:border-gold-500'
                      }`}
                    >
                      <div className="h-28 bg-sand/30 flex items-center justify-center relative">
                        {isLocked ? (
                          <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center z-10">
                            <div className="bg-white/95 p-2 rounded-full shadow text-charcoal">
                              <Lock size={16} />
                            </div>
                          </div>
                        ) : null}
                        <span className="font-serif font-semibold text-gold-700">{theme.name}</span>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-charcoal">{theme.name}</p>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-gold-600">
                            {theme.packageLevel}
                          </span>
                        </div>
                        <Button
                          variant={isLocked ? 'ghost' : 'primary'}
                          disabled={isLocked || loading}
                          className="w-full mt-3 text-xs py-1.5"
                          onClick={() => handleSelectTheme(theme)}
                        >
                          {isLocked ? 'Terkunci' : 'Gunakan'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: WEDDING BASIC DATA */}
          {step === 3 && (
            <form onSubmit={handleSaveMetadata} className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-charcoal text-center">
                Isi Informasi Dasar Pernikahan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Lengkap Pria</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="Nama Lengkap Pria"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Panggilan Pria</label>
                  <input
                    type="text"
                    value={groomNick}
                    onChange={(e) => setGroomNick(e.target.value)}
                    placeholder="Panggilan"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Lengkap Wanita</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="Nama Lengkap Wanita"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/60 uppercase">Panggilan Wanita</label>
                  <input
                    type="text"
                    value={brideNick}
                    onChange={(e) => setBrideNick(e.target.value)}
                    placeholder="Panggilan"
                    className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Tanggal Pernikahan (Akad)</label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/60 uppercase">Nama Tempat Pernikahan</label>
                <input
                  type="text"
                  required
                  value={weddingVenue}
                  onChange={(e) => setWeddingVenue(e.target.value)}
                  placeholder="Gedung Pernikahan / Rumah"
                  className="w-full mt-1 border border-sand bg-white px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 mt-4">
                {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                <span>Simpan & Lanjut</span>
              </Button>
            </form>
          )}

          {/* STEP 4: COVER PHOTO */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-serif font-bold text-charcoal">
                Unggah Foto Cover Undangan Anda
              </h3>
              <p className="text-xs text-charcoal/60">
                Pilih foto terbaik bersama pasangan untuk dipajang sebagai halaman sampul undangan digital.
              </p>

              {coverPhoto ? (
                <div className="w-full max-w-sm mx-auto h-52 border border-sand rounded-3xl overflow-hidden shadow-inner relative group bg-sand/20">
                  <img src={coverPhoto} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="bg-white text-charcoal px-4 py-2 rounded-xl font-semibold text-xs cursor-pointer hover:bg-cream">
                      Ganti Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="w-full max-w-sm mx-auto h-52 border-2 border-dashed border-sand hover:border-gold-500 rounded-3xl flex flex-col items-center justify-center bg-cream/20 cursor-pointer transition-colors group">
                  {uploading ? (
                    <Loader2 className="animate-spin text-gold-500" size={32} />
                  ) : (
                    <>
                      <Upload className="text-charcoal/40 group-hover:text-gold-500 transition-colors" size={32} />
                      <p className="text-xs font-semibold text-charcoal/60 mt-3 group-hover:text-gold-500 transition-colors">
                        Klik untuk unggah foto cover
                      </p>
                      <p className="text-[10px] text-charcoal/40 mt-1">JPEG, PNG, WEBP (Max 800KB)</p>
                    </>
                  )}
                  <input type="file" accept="image/*" disabled={uploading} className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}

              <Button
                variant="primary"
                className="w-full mt-6"
                onClick={() => {
                  toast.success('Selamat! Onboarding selesai.')
                  navigate('/dashboard')
                }}
              >
                Selesaikan & Buka Dasbor
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* TRIPAY PAYMENT METHOD MODAL */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Upgrade Paket: ${selectedPkg?.name}`}
      >
        <div className="space-y-6 text-center font-sans">
          <p className="text-sm text-charcoal/70">
            Pilih metode pembayaran di bawah untuk melanjutkan ke proses tagihan pembayaran otomatis platform Tripay.
          </p>

          <div className="text-left space-y-2">
            <label className="block text-xs text-charcoal/60 font-semibold uppercase tracking-wider mb-1.5">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'QRIS', name: 'QRIS (E-Wallet / Bank)', desc: 'Scan & bayar instan' },
                { id: 'BCAVA', name: 'BCA Virtual Account', desc: 'Transfer otomatis BCA' },
                { id: 'BNIVA', name: 'BNI Virtual Account', desc: 'Transfer otomatis BNI' },
                { id: 'MANDIRIVA', name: 'Mandiri Virtual Account', desc: 'Transfer otomatis Mandiri' },
                { id: 'BRIVA', name: 'BRI Virtual Account', desc: 'Transfer otomatis BRI' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === method.id
                      ? 'border-amber-500 bg-amber-500/5 shadow-sm'
                      : 'border-sand hover:border-amber-500/40'
                  }`}
                >
                  <span className="text-xs font-bold text-charcoal">{method.name}</span>
                  <span className="text-[9px] text-charcoal/50 mt-0.5">{method.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-cream/30 rounded-xl border border-sand/35 text-xs text-charcoal/80">
            <span>Total Tagihan:</span>
            <span className="text-sm font-bold text-amber-600">
              Rp {selectedPkg?.price.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" className="flex-1" onClick={() => setIsPaymentModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1 flex justify-center items-center gap-2"
              disabled={loading}
              onClick={handleCheckout}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              <span>Lanjut Bayar</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Onboarding
