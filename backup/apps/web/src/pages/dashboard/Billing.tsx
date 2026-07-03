import React, { useState, useEffect } from 'react'
import {
  History,
  Check,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { toast } from 'sonner'

export const Billing: React.FC = () => {
  const navigate = useNavigate()
  const [wedding, setWedding] = useState<any>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Simulation states
  const [selectedPkg, setSelectedPkg] = useState<any>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('QRIS')

  const loadBillingData = async () => {
    try {
      const weddingRes = await api.get('/weddings/me')
      if (weddingRes.data.status === 'success') {
        setWedding(weddingRes.data.wedding)
      }

      const packagesRes = await api.get('/orders/packages')
      if (packagesRes.data.status === 'success') {
        setPackages(packagesRes.data.packages)
      }

      const historyRes = await api.get('/orders/history')
      if (historyRes.data.status === 'success') {
        setHistory(historyRes.data.history)
      }
    } catch (err) {
      toast.error('Gagal memuat data pembayaran.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBillingData()
  }, [])

  const handleCheckout = async () => {
    if (!selectedPkg) return
    setCheckoutLoading(true)
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
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 font-medium">Memuat data pembayaran...</p>
      </div>
    )
  }

  const userPkg = wedding?.package?.packageName || 'BASIC'

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand/35 pb-4">
        <h2 className="text-3xl font-serif font-bold text-charcoal">Paket & Billing Pembayaran</h2>
        <p className="text-sm text-charcoal/60 mt-1">
          Lakukan upgrade paket fitur undangan digital Anda dan lihat riwayat pembayaran.
        </p>
      </div>

      {/* Current Package Card */}
      <Card className="p-6 border border-gold-500/40 bg-gold-500/5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-inner">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600 block">
            Status Paket Saat Ini
          </span>
          <h3 className="text-2xl font-serif font-bold text-charcoal mt-1">
            Paket {userPkg}
          </h3>
          <p className="text-xs text-charcoal/50 mt-1">
            Undangan aktif hingga:{' '}
            <span className="font-bold text-charcoal/70">
              {wedding?.expiredAt ? new Date(wedding.expiredAt).toLocaleDateString('id-ID') : '-'}
            </span>
          </p>
        </div>

        <Badge variant="success" className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
          Aktif / Paid
        </Badge>
      </Card>

      {/* Package comparison grids */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-charcoal flex items-center gap-2">
          <TrendingUp className="text-gold-500" size={20} />
          <span>Bandingkan & Upgrade Paket</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {packages.map((pkg) => {
            const isCurrent = userPkg === pkg.name
            const isUpgrade = !isCurrent && pkg.name === 'PREMIUM' && userPkg === 'BASIC'

            return (
              <Card
                key={pkg.id}
                className={`p-6 border flex flex-col justify-between rounded-3xl bg-white shadow-sm relative overflow-hidden ${
                  isCurrent ? 'border-gold-500 ring-2 ring-gold-500/20' : 'border-sand'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-serif font-bold text-charcoal">{pkg.name}</h4>
                    {isCurrent && (
                      <span className="bg-gold-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    )}
                  </div>

                  <p className="text-2xl font-bold text-gold-600 mt-3">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-1">
                    Aktif selama {pkg.durationDays} hari ({pkg.maxGuests} Tamu)
                  </p>

                  <ul className="space-y-2 mt-6 text-xs text-charcoal/70">
                    {pkg.features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="text-green-600 mt-0.5 shrink-0" size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-sand/35">
                  {isCurrent ? (
                    <Button variant="outline" disabled className="w-full text-xs">
                      Paket Aktif
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      variant="primary"
                      className="w-full text-xs"
                      onClick={() => {
                        setSelectedPkg(pkg)
                        setIsPaymentModalOpen(true)
                      }}
                    >
                      Upgrade Sekarang
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full text-xs">
                      Tersedia
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Transaction history logs */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-charcoal flex items-center gap-2">
          <History className="text-gold-500" size={20} />
          <span>Riwayat Pembayaran</span>
        </h3>

        <Card className="border border-sand/45 bg-white shadow-sm rounded-3xl overflow-x-auto p-2">
          {history.length === 0 ? (
            <div className="py-12 text-center text-charcoal/40 text-sm flex flex-col items-center justify-center">
              <AlertCircle className="text-charcoal/20 mb-2" size={28} />
              <p>Belum ada riwayat pembayaran.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-sand/30 text-charcoal/50 font-semibold text-xs uppercase bg-cream/15">
                  <th className="p-3">ID Pembayaran</th>
                  <th className="p-3">Nama Paket</th>
                  <th className="p-3">Total Tagihan</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3">Tanggal Lunas</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id} className="border-b border-sand/20 hover:bg-cream/10">
                    <td className="p-3 font-mono text-xs text-charcoal/60 truncate max-w-[120px]">
                      {row.id}
                    </td>
                    <td className="p-3 font-bold text-charcoal">{row.packageName}</td>
                    <td className="p-3 font-semibold text-gold-600">
                      Rp {row.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-charcoal/70">{row.paymentMethod}</td>
                    <td className="p-3 text-xs text-charcoal/50">
                      {row.paidAt ? new Date(row.paidAt).toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant={row.status === 'PAID' ? 'success' : row.status === 'PENDING' ? 'warning' : 'danger'}>
                          {row.status}
                        </Badge>
                        {row.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => navigate(`/dashboard/checkout/${row.id}`)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer border-0"
                          >
                            Bayar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
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
              disabled={checkoutLoading}
              onClick={handleCheckout}
            >
              {checkoutLoading ? <Loader2 className="animate-spin" size={16} /> : null}
              <span>Lanjut Bayar</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Billing
