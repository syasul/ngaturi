import React from 'react'
import { Link, useForm, Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Heart, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import Button from '../../components/ui/Button'

export const ForgotPassword: React.FC<{ status?: string }> = ({ status }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('password.email'))
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <Head title="Lupa Kata Sandi" />

      {/* Premium background abstract elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-65" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rustic-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-45" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 cursor-pointer">
          <Heart className="fill-gold-500 text-gold-500 animate-pulse" size={28} />
          <span className="font-serif text-3xl font-bold text-gold-600 tracking-wide">Ngaturi</span>
        </Link>
        <h2 className="text-center text-3xl font-serif font-bold text-charcoal tracking-wide">
          Atur Ulang Kata Sandi
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60 font-poppins">
          Masukkan email Anda dan kami akan mengirimkan tautan untuk menyetel ulang kata sandi Anda.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-sand sm:rounded-3xl sm:px-10">
          {!status ? (
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal font-poppins">
                  Alamat Email
                </label>
                <div className="mt-1.5 relative rounded-full shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/40">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    disabled={processing}
                    autoComplete="email"
                    className={`block w-full pl-11 pr-4 py-3 border rounded-full text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/10' : 'border-sand bg-white'
                    }`}
                    placeholder="name@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-poppins">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  disabled={processing}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    'Kirim Tautan Atur Ulang'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="flex justify-center text-gold-500">
                <CheckCircle size={48} className="stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Permintaan Berhasil Dikirim</h3>
              <p className="text-sm text-charcoal/70 font-poppins">
                {status}
              </p>
            </motion.div>
          )}

          <div className="mt-6 border-t border-sand pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal/60 hover:text-gold-500 font-poppins"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Halaman Masuk</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
