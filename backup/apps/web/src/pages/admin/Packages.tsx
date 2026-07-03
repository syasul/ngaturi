import React, { useEffect, useState } from 'react'
import { Plus, Edit3, CheckCircle2, X, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'

interface Package {
  id: string
  name: string
  price: number
  features: string[]
  maxGuests: number
  durationDays: number
  createdAt: string
}

export const AdminPackages: React.FC = () => {
  const [packagesList, setPackagesList] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  // Drawer / Form state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [maxGuests, setMaxGuests] = useState<number>(100)
  const [durationDays, setDurationDays] = useState<number>(90)
  const [saving, setSaving] = useState(false)

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/packages')
      setPackagesList(response.data.packages)
    } catch (err: any) {
      toast.error('Gagal mengambil daftar paket.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const openAddDrawer = () => {
    setEditMode(false)
    setSelectedPkgId(null)
    setName('')
    setPrice(100000)
    setFeatures([])
    setFeatureInput('')
    setMaxGuests(100)
    setDurationDays(90)
    setDrawerOpen(true)
  }

  const openEditDrawer = (pkg: Package) => {
    setEditMode(true)
    setSelectedPkgId(pkg.id)
    setName(pkg.name)
    setPrice(pkg.price)
    setFeatures(pkg.features)
    setFeatureInput('')
    setMaxGuests(pkg.maxGuests)
    setDurationDays(pkg.durationDays)
    setDrawerOpen(true)
  }

  // Features list helpers
  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault()
    if (!featureInput.trim()) return
    if (features.includes(featureInput.trim())) {
      toast.warning('Fitur ini sudah ada di dalam daftar.')
      return
    }
    setFeatures([...features, featureInput.trim()])
    setFeatureInput('')
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || price === undefined || !durationDays) {
      toast.error('Lengkapi seluruh kolom data paket.')
      return
    }

    setSaving(true)
    const payload = {
      name,
      price,
      features,
      maxGuests,
      durationDays,
    }

    try {
      if (editMode && selectedPkgId) {
        await api.put(`/admin/packages/${selectedPkgId}`, payload)
        toast.success('Paket berhasil diperbarui!')
      } else {
        await api.post('/admin/packages', payload)
        toast.success('Paket baru berhasil ditambahkan!')
      }
      setDrawerOpen(false)
      fetchPackages()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan paket.')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Paket Layanan</h1>
          <p className="text-sm text-slate-400">Kelola paket langganan, batasan tamu, dan harga undangan</p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Paket</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {packagesList.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest block">
                      Ngaturi Tier
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mt-1">{pkg.name}</h3>
                  </div>
                  
                  <button
                    onClick={() => openEditDrawer(pkg)}
                    className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Edit Paket"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>

                {/* Price / Info */}
                <div className="bg-slate-950/65 border border-slate-850 p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">Harga Paket</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(pkg.price)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Durasi Masa Aktif</span>
                    <span className="font-semibold text-slate-300">{pkg.durationDays} Hari</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Maksimal Tamu</span>
                    <span className="font-semibold text-slate-300">
                      {pkg.maxGuests === 0 ? 'Unlimited' : `${pkg.maxGuests} Tamu`}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fitur Paket:</h4>
                  <ul className="space-y-2 text-xs">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={14} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer Form for Package */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl relative">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <h3 className="text-base font-serif font-bold text-white">
                {editMode ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
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
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Nama Paket (Unique)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. PREMIUM"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Harga Paket (IDR)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="e.g. 299000"
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    * Perubahan harga hanya akan berdampak pada transaksi tagihan/order baru.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Max Guests */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Max Kuota Tamu
                    </label>
                    <input
                      type="number"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(Number(e.target.value))}
                      placeholder="e.g. 1000 (0 = Unlimited)"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Duration Days */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Durasi (Hari)
                    </label>
                    <input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      placeholder="e.g. 365"
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Features Aggregator Form */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Daftar Kelebihan / Fitur
                  </label>
                  
                  {/* Add Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Tulis fitur (e.g. Premium Photo Gallery)..."
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Render Features Items */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {features.length > 0 ? (
                      features.map((f, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-xs"
                        >
                          <span className="text-slate-350 truncate pr-4">{f}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-400 hover:text-red-300 p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">Belum ada fitur ditambahkan.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/20 flex gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Paket'}
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

export default AdminPackages
