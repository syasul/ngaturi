import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const orderId = query.get('id') || ''

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-sans">
      <Card className="max-w-md w-full p-8 border border-green-500/20 bg-green-500/5 backdrop-blur-md rounded-3xl text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/20 text-green-400 rounded-full animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-white">Pembayaran Berhasil!</h2>
          <p className="text-sm text-slate-350">
            Terima kasih! Pembayaran tagihan Anda dengan nomor invoice{' '}
            <span className="font-mono font-bold text-green-400">
              INV-{orderId.substring(0, 8).toUpperCase()}
            </span>{' '}
            telah kami terima.
          </p>
          <p className="text-xs text-slate-500">
            Paket layanan premium Anda telah diaktifkan secara otomatis. Silakan masuk kembali ke dashboard untuk melihat fitur baru Anda.
          </p>
        </div>

        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Masuk Ke Dashboard</span>
          <ArrowRight size={16} />
        </Button>
      </Card>
    </div>
  )
}

export const PaymentPending: React.FC = () => {
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const orderId = query.get('id') || ''

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-sans">
      <Card className="max-w-md w-full p-8 border border-amber-500/20 bg-amber-500/5 backdrop-blur-md rounded-3xl text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/20 text-amber-400 rounded-full animate-pulse">
          <AlertCircle size={48} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-white">Menunggu Pembayaran</h2>
          <p className="text-sm text-slate-350">
            Transaksi invoice{' '}
            <span className="font-mono font-bold text-amber-400">
              INV-{orderId.substring(0, 8).toUpperCase()}
            </span>{' '}
            sedang menunggu penyelesaian pembayaran Anda.
          </p>
          <p className="text-xs text-slate-500">
            Silakan selesaikan pembayaran sesuai dengan petunjuk yang telah diberikan pada halaman checkout.
          </p>
        </div>

        <div className="space-y-3">
          {orderId && (
            <Button
              onClick={() => navigate(`/dashboard/checkout/${orderId}`)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Kembali Ke Halaman Bayar</span>
              <ArrowRight size={16} />
            </Button>
          )}
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all cursor-pointer border border-slate-750"
          >
            Kembali Ke Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}

export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const orderId = query.get('id') || ''

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-sans">
      <Card className="max-w-md w-full p-8 border border-rose-500/20 bg-rose-500/5 backdrop-blur-md rounded-3xl text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-rose-500/20 text-rose-400 rounded-full">
          <XCircle size={48} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-white">Pembayaran Gagal</h2>
          <p className="text-sm text-slate-350">
            Transaksi invoice{' '}
            <span className="font-mono font-bold text-rose-400">
              INV-{orderId.substring(0, 8).toUpperCase()}
            </span>{' '}
            telah gagal, dibatalkan, atau masa berlaku pembayarannya telah habis.
          </p>
          <p className="text-xs text-slate-500">
            Silakan ajukan checkout ulang atau hubungi tim customer service kami jika Anda merasa sudah melakukan transfer.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/dashboard/billing')}
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Ulangi Pemesanan</span>
            <ArrowRight size={16} />
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all cursor-pointer border border-slate-750"
          >
            Kembali Ke Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
