import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ForgotPasswordInputSchema, type ForgotPasswordInput } from '@wedding/shared'
import api from '../../lib/api'
import Button from '../../components/ui/Button'

export const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordInputSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', {
        email: data.email,
      })
      toast.success(response.data.message || 'Email tautan atur ulang kata sandi berhasil dikirim.')
      setIsSubmitted(true)
    } catch (error: any) {
      console.error('Forgot password error:', error)
      const errorData = error.response?.data
      toast.error(errorData?.message || 'Permintaan gagal. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Premium background abstract elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-65" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rustic-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-45" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 cursor-pointer">
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
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                    disabled={isLoading}
                    autoComplete="email"
                    className={`block w-full pl-11 pr-4 py-3 border rounded-full text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/10' : 'border-sand bg-white'
                    }`}
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-poppins">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  {isLoading ? (
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
                Kami telah mengirimkan instruksi beserta tautan pemulihan kata sandi ke email Anda jika terdaftar. Silakan periksa kotak masuk atau spam email Anda.
              </p>
            </motion.div>
          )}

          <div className="mt-6 border-t border-sand pt-4 text-center">
            <Link
              to="/login"
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
