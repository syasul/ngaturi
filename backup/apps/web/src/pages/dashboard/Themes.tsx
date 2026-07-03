import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Palette, Check, Lock, ArrowRight, ExternalLink } from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { toast } from 'sonner'

export const Themes: React.FC = () => {
  const [wedding, setWedding] = useState<any>(null)
  const [themes, setThemes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingThemeId, setSavingThemeId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const weddingRes = await api.get('/weddings/me')
        if (weddingRes.data.status === 'success') {
          setWedding(weddingRes.data.wedding)
        }

        const themesRes = await api.get('/themes')
        if (themesRes.data.status === 'success') {
          setThemes(themesRes.data.themes)
        }
      } catch (err) {
        toast.error('Gagal mengambil daftar tema.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelectTheme = async (themeId: string, packageLevel: string) => {
    const userPkg = wedding?.package?.packageName || 'BASIC'

    if (packageLevel === 'PREMIUM' && userPkg !== 'PREMIUM') {
      toast.error('Tema Premium hanya tersedia untuk paket PREMIUM. Silakan lakukan upgrade paket.')
      return
    }

    setSavingThemeId(themeId)
    try {
      const res = await api.put('/weddings/me/theme', { themeId })
      if (res.data.status === 'success') {
        setWedding((prev: any) => ({ ...prev, themeId }))
        toast.success('Tema undangan berhasil diperbarui!')
      }
    } catch (err) {
      toast.error('Gagal memperbarui tema.')
    } finally {
      setSavingThemeId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat data tema...</p>
      </div>
    )
  }

  const userPkg = wedding?.package?.packageName || 'BASIC'
  const previewUrl = `${window.location.origin}/u/${wedding?.slug}`

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/35 pb-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-charcoal">Pilih Tema Undangan</h2>
          <p className="text-sm text-charcoal/60 mt-1">
            Ganti template dan tampilan undangan digital Anda. Desain responsif, modern, dan premium.
          </p>
        </div>

        {wedding?.slug && (
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="md" className="flex items-center gap-2">
              <ExternalLink size={16} />
              <span>Buka Undangan</span>
            </Button>
          </a>
        )}
      </div>

      {/* Package Alert if Basic */}
      {userPkg !== 'PREMIUM' && (
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-charcoal/80">
            <p className="font-semibold text-gold-700">Dapatkan Semua Akses Tema Premium!</p>
            <p className="text-charcoal/60 mt-0.5">
              Upgrade ke paket PREMIUM untuk membuka tema eksklusif lainnya seperti Modern Minimalist.
            </p>
          </div>
          <Link to="/dashboard/billing">
            <Button variant="primary" size="sm" className="flex items-center gap-1">
              <span>Upgrade Sekarang</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      )}

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isSelected = wedding?.themeId === theme.id
          const isLocked = theme.packageLevel === 'PREMIUM' && userPkg !== 'PREMIUM'
          const savingThis = savingThemeId === theme.id

          return (
            <Card
              key={theme.id}
              className={`flex flex-col bg-white border rounded-3xl overflow-hidden transition-all shadow-sm ${
                isSelected
                  ? 'border-gold-500 ring-2 ring-gold-500/30'
                  : isLocked
                  ? 'border-sand/40 opacity-75'
                  : 'border-sand hover:border-gold-500'
              }`}
            >
              {/* Mock theme thumbnail cover */}
              <div className="h-44 bg-sand/20 flex flex-col items-center justify-center relative p-4 text-center">
                {isLocked && (
                  <div className="absolute inset-0 bg-charcoal/15 flex items-center justify-center z-10">
                    <div className="bg-white/95 p-3 rounded-full shadow-lg text-charcoal flex items-center gap-1.5 text-xs font-semibold">
                      <Lock size={14} />
                      <span>Premium Lock</span>
                    </div>
                  </div>
                )}
                
                <Palette className="text-gold-500/40 mb-2" size={32} />
                <span className="font-serif font-bold text-xl text-gold-800 tracking-wide">
                  {theme.name}
                </span>
                <span className="text-[10px] text-charcoal/40 mt-1">Ngaturi Premium Layout</span>
              </div>

              {/* Theme description details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif font-bold text-base text-charcoal">
                      {theme.name}
                    </h4>
                    <Badge variant={theme.packageLevel === 'PREMIUM' ? 'danger' : 'success'}>
                      {theme.packageLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal/50 mt-1">
                    Cocok untuk konsep pernikahan {theme.id === 'elegant' ? 'mewah klasik' : theme.id === 'rustic' ? 'natural kayu' : 'minimalis modern'}.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isSelected ? 'outline' : 'primary'}
                    disabled={isLocked || savingThis}
                    className="flex-1 flex justify-center items-center gap-1.5 text-xs py-2"
                    onClick={() => handleSelectTheme(theme.id, theme.packageLevel)}
                  >
                    {savingThis ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSelected ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      'Terapkan Tema'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Themes
