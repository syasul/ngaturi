import React from 'react'
import { Link, useForm, Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Heart, Mail, Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'

interface VerifyEmailProps {
  status?: string
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ status }) => {
  const { post, processing } = useForm({})

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('verification.send'), {
      onSuccess: () => toast.success('Link verifikasi baru telah dikirim!'),
    })
  }

  const handleLogout = () => {
    post(route('logout'))
  }

  const isLinkSent = status === 'verification-link-sent'

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <Head title="Verifikasi Email" />

      {/* Premium background abstract elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-65" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rustic-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-45" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-2 mb-6 cursor-default">
          <Heart className="fill-gold-500 text-gold-500 animate-pulse" size={28} />
          <span className="font-serif text-3xl font-bold text-gold-600 tracking-wide">Ngaturi</span>
        </div>
        <h2 className="text-center text-3xl font-serif font-bold text-charcoal tracking-wide">
          Verifikasi Email Anda
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60 font-poppins px-4">
          Terima kasih telah mendaftar! Sebelum memulai, silakan verifikasi email Anda dengan mengklik tautan yang baru saja kami kirimkan.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-sand sm:rounded-3xl sm:px-10 space-y-6">
          {isLinkSent && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-xs font-poppins text-green-700">
              Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda daftarkan.
            </div>
          )}

          <div className="flex justify-center text-gold-500 my-4">
            <Mail size={48} className="animate-bounce" />
          </div>

          <form onSubmit={handleResend} className="space-y-4">
            <Button
              type="submit"
              disabled={processing}
              variant="primary"
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Mengirim Ulang...</span>
                </>
              ) : (
                'Kirim Ulang Email Verifikasi'
              )}
            </Button>
          </form>

          <div className="border-t border-sand/40 pt-4 flex justify-between items-center text-xs font-poppins">
            <span className="text-charcoal/50">Gunakan akun lain?</span>
            <button
              onClick={handleLogout}
              className="font-semibold text-red-600 hover:text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
