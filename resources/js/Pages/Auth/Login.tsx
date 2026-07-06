import React, { useState } from 'react'
import { Link, useForm, Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import Button from '../../components/ui/Button'

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('login'), {
      onFinish: () => reset('password'),
    })
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <Head title="Masuk" />
      
      {/* Premium background abstract elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-65" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rustic-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-45" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 cursor-pointer">
          <Heart className="fill-gold-500 text-gold-500 animate-pulse" size={28} />
          <span className="font-serif text-3xl font-bold text-gold-600 tracking-wide">Ngaturi</span>
        </Link>
        <h2 className="text-center text-3xl font-serif font-bold text-charcoal tracking-wide">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60 font-poppins">
          Kelola undangan digital premium Anda dengan mudah
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-sand sm:rounded-3xl sm:px-10">
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

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-charcoal font-poppins">
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-gold-600 hover:text-gold-500 font-poppins"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="mt-1.5 relative rounded-full shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/40">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={processing}
                  autoComplete="current-password"
                  className={`block w-full pl-11 pr-12 py-3 border rounded-full text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all ${
                    errors.password ? 'border-red-400 bg-red-50/10' : 'border-sand bg-white'
                  }`}
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
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
                <p className="mt-1 text-xs text-red-500 font-poppins">{errors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                disabled={processing}
                className="h-4 w-4 text-gold-500 focus:ring-gold-500/20 border-sand rounded-xs cursor-pointer accent-gold-500"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 block text-xs text-charcoal/70 font-poppins cursor-pointer">
                Ingat Saya
              </label>
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
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 backdrop-blur-md px-3 text-charcoal/50 font-poppins">atau</span>
            </div>
          </div>

          {/* Google OAuth Login Button */}
          <div className="mb-6">
            <a href="/auth/google" className="w-full block">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2.5 py-3 border-sand hover:bg-gold-50/10 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.23 2.73 1.258 6.708l3.992 3.057z"
                  />
                  <path
                    fill="#4285F4"
                    d="M16.04 15.345c-1.07.727-2.43 1.164-4.04 1.164a7.077 7.077 0 0 1-6.75-4.909l-3.99 3.064C3.23 21.27 7.27 24 12 24c3.09 0 5.82-1.023 7.82-2.782l-3.78-1.873z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.21 11.6c0-.527.09-1.036.25-1.527L1.47 7.01C.53 8.92 0 11.08 0 13.37c0 2.227.5 4.345 1.41 6.227l4.02-3.08c-.14-.52-.22-1.055-.22-1.617z"
                  />
                  <path
                    fill="#34A853"
                    d="M23.49 12.27c0-.79-.07-1.545-.19-2.27H12v4.51h6.46c-.28 1.48-.11 2.94-.97 4.18l3.78 1.87c2.22-2.055 2.22-6.19 2.22-8.29z"
                  />
                </svg>
                <span className="font-poppins font-medium text-charcoal">Masuk dengan Google</span>
              </Button>
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-charcoal/60 font-poppins">
              Belum memiliki akun?{' '}
              <Link href="/register" className="font-semibold text-gold-600 hover:text-gold-500">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
