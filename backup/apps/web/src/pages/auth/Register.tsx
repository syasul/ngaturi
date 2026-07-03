import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { RegisterInputSchema, type RegisterInput } from '@wedding/shared'
import api from '../../lib/api'
import Button from '../../components/ui/Button'

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterInputSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success(response.data.message || 'OTP verifikasi telah dikirim ke email Anda.')
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error: any) {
      console.error('Registration error:', error)
      const errorData = error.response?.data
      toast.error(errorData?.message || 'Registrasi gagal. Silakan coba lagi.')
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
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60 font-poppins">
          Mulai buat undangan pernikahan digital premium Anda sendiri
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-sand sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal font-poppins">
                Nama Lengkap
              </label>
              <div className="mt-1.5 relative rounded-full shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/40">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  disabled={isLoading}
                  autoComplete="name"
                  className={`block w-full pl-11 pr-4 py-3 border rounded-full text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all ${
                    errors.name ? 'border-red-400 bg-red-50/10' : 'border-sand bg-white'
                  }`}
                  placeholder="Nama Anda"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 font-poppins">{errors.name.message}</p>
              )}
            </div>

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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal font-poppins">
                Kata Sandi
              </label>
              <div className="mt-1.5 relative rounded-full shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/40">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className={`block w-full pl-11 pr-12 py-3 border rounded-full text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all ${
                    errors.password ? 'border-red-400 bg-red-50/10' : 'border-sand bg-white'
                  }`}
                  placeholder="Min. 8 karakter"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-charcoal/40 hover:text-gold-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-poppins">{errors.password.message}</p>
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
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  'Daftar'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-charcoal/60 font-poppins">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-500">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
