import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
  QrCode,
  CreditCard,
} from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { toast } from 'sonner'

export const Checkout: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const [transaction, setTransaction] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [openStep, setOpenStep] = useState<number | null>(0)
  const [timeLeft, setTimeLeft] = useState<string>('24:00:00')

  const fetchOrderDetail = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`)
      if (res.data.status === 'success') {
        setOrder(res.data.order)
        setTransaction(res.data.transaction)
        
        // If order status is already PAID, redirect to success
        if (res.data.order.status === 'PAID') {
          navigate(`/payment/success?id=${orderId}`)
        } else if (res.data.order.status === 'EXPIRED') {
          navigate(`/payment/failed?id=${orderId}`)
        }
      }
    } catch (err) {
      toast.error('Gagal memuat detail transaksi.')
    } finally {
      setLoading(false)
    }
  }

  // Initial Fetch & Polling
  useEffect(() => {
    fetchOrderDetail()
    
    // Poll order status every 5 seconds
    const interval = setInterval(() => {
      fetchOrderDetail()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [orderId])

  // Countdown Timer
  useEffect(() => {
    if (!transaction || !transaction.payload) return

    const expiryTime = transaction.payload.expired_time * 1000 // Convert to ms
    
    const updateTimer = () => {
      const now = Date.now()
      const difference = expiryTime - now

      if (difference <= 0) {
        setTimeLeft('Expired')
        clearInterval(timerInterval)
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      const formatted = [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].join(':')

      setTimeLeft(formatted)
    }

    updateTimer() // run once immediately
    const timerInterval = setInterval(updateTimer, 1000)

    return () => clearInterval(timerInterval)
  }, [transaction])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Disalin ke papan klip!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Memuat detail tagihan...</p>
      </div>
    )
  }

  if (!order || !transaction) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="text-rose-500" size={48} />
        <h3 className="text-lg font-bold text-white">Transaksi Tidak Ditemukan</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Tagihan pembayaran tidak valid atau Anda tidak memiliki akses ke tagihan ini.
        </p>
        <Button onClick={() => navigate('/dashboard/billing')} className="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200">
          Kembali ke Billing
        </Button>
      </div>
    )
  }

  const payload = transaction.payload
  const isQris = order.paymentMethod === 'QRIS'
  const isExpired = timeLeft === 'Expired' || order.status === 'EXPIRED'

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-8 font-sans">
      {/* Header Back Button */}
      <button
        onClick={() => navigate('/dashboard/billing')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all cursor-pointer bg-transparent border-0"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Billing & Paket</span>
      </button>

      {/* Expiration Banner */}
      <Card className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${
        isExpired 
          ? 'border-rose-950 bg-rose-950/20 text-rose-300' 
          : 'border-amber-500/20 bg-amber-500/5 text-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          <Clock className={isExpired ? 'text-rose-400' : 'text-amber-400 animate-pulse'} size={24} />
          <div>
            <span className="text-xs font-semibold block text-slate-400">Selesaikan Pembayaran Dalam:</span>
            <span className="text-xl font-bold font-mono tracking-wider">{timeLeft}</span>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-0.5">Batas Pembayaran</span>
          <span className="text-xs font-semibold text-slate-300">
            {new Date(payload.expired_time * 1000).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </Card>

      {/* Main Billing Card */}
      <Card className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
        {/* Payment Summary */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block mb-1">
              Invoice ID
            </span>
            <h3 className="text-sm font-bold text-white">
              INV-{order.id.substring(0, 8).toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Paket {order.packageName}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">
              Metode Pembayaran
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-350 border border-slate-700">
              {isQris ? <QrCode size={12} /> : <CreditCard size={12} />}
              {payload.payment_name}
            </span>
          </div>
        </div>

        {/* QR Code or VA Code Input */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-850 text-center">
          {isQris ? (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-semibold block">Scan Kode QRIS di bawah ini:</span>
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border-2 border-amber-500/30">
                {payload.qr_url ? (
                  <img
                    src={payload.qr_url}
                    alt="QRIS Payment"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-400 font-mono text-xs">
                    Generating QR...
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Dapat discan menggunakan GoPay, OVO, Dana, LinkAja, BCA, Mandiri, dan aplikasi perbankan lainnya.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <span className="text-xs text-slate-400 font-semibold block">Nomor Virtual Account:</span>
              <div className="flex items-center justify-between gap-4 px-5 py-4 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto">
                <span className="text-xl font-bold font-mono tracking-wider text-amber-500">
                  {payload.payment_code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(payload.payment_code)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all cursor-pointer border border-slate-700"
                >
                  {copied ? <Check className="text-green-500" size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Gunakan menu transfer virtual account pada bank pilihan Anda.
              </p>
            </div>
          )}
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center p-4 bg-slate-950/40 rounded-xl border border-slate-850">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
              Jumlah Tagihan
            </span>
            <span className="text-xs text-slate-400">(Sudah termasuk biaya admin)</span>
          </div>
          <span className="text-xl font-bold text-amber-500 font-mono">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(order.amount)}
          </span>
        </div>

        {/* Instructions */}
        {payload.instructions && payload.instructions.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Instruksi Cara Pembayaran
            </h4>
            <div className="space-y-2">
              {payload.instructions.map((inst: any, idx: number) => {
                const isOpen = openStep === idx
                return (
                  <div key={idx} className="border border-slate-850 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenStep(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center px-4 py-3 bg-slate-900 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer border-0"
                    >
                      <span>{inst.title}</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-slate-950/40 border-t border-slate-850 text-xs text-slate-400 space-y-2 font-poppins">
                        {inst.steps.map((step: string, sIdx: number) => (
                          <div key={sIdx} className="flex gap-2 items-start leading-relaxed">
                            <span className="font-bold text-amber-500">{sIdx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>
      
      {/* Realtime Note */}
      <div className="flex items-center gap-2 justify-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        <span>Menunggu pembayaran... Halaman ini akan otomatis ter-update</span>
      </div>
    </div>
  )
}

export default Checkout
