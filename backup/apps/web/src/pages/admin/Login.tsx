import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { LoginInputSchema, type LoginInput } from '@wedding/shared'
import { useAuthStore } from '../../store/auth'
import api from '../../lib/api'
import Button from '../../components/ui/Button'

export const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })

      const { user, accessToken } = response.data
      
      if (user.role !== 'ADMIN') {
        toast.error('Akses ditolak: Akun Anda tidak memiliki hak akses Administrator.')
        setIsLoading(false)
        return
      }

      setAuth(user, accessToken)
      toast.success(`Selamat datang Admin, ${user.name}!`)
      navigate('/admin', { replace: true })
    } catch (error: any) {
      console.error('Admin login error:', error)
      const errorData = error.response?.data
      toast.error(errorData?.message || 'Email atau kata sandi salah.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-100">
      {/* Premium dark abstract background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center gap-2.5 mb-6">
          <div className="p-3 bg-amber-500/10 border border-amber-500/35 text-amber-500 rounded-2xl">
            <Shield size={28} />
          </div>
          <span className="font-serif text-3xl font-bold text-amber-500 tracking-wide">Ngaturi Admin</span>
        </div>
        <h2 className="text-center text-3xl font-serif font-bold text-white tracking-wide">
          Portal Administrator
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Silakan masuk untuk mengelola sistem dan data undangan
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl border border-slate-700 sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Alamat Email Admin
              </label>
              <div className="mt-1.5 relative rounded-full shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled={isLoading}
                  autoComplete="email"
                  className={`block w-full pl-11 pr-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-slate-900 border-slate-700 text-slate-100 ${
                    errors.email ? 'border-red-400 bg-red-900/10' : ''
                  }`}
                  placeholder="admin@ngaturi.id"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Kata Sandi
              </label>
              <div className="mt-1.5 relative rounded-full shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={`block w-full pl-11 pr-12 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-slate-900 border-slate-700 text-slate-100 ${
                    errors.password ? 'border-red-400 bg-red-900/10' : ''
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600 text-slate-950 font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Masuk ke System...</span>
                  </>
                ) : (
                  'Masuk System'
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
