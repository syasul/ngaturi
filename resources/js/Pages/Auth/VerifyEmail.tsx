import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import api from '../../lib/api'
import Button from '../../components/ui/Button'

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const navigate = useNavigate()

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    // If no email in query, redirect to login
    if (!email) {
      toast.error('Alamat email tidak valid.')
      navigate('/login')
    }
  }, [email, navigate])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // Auto-focus first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return // Only allow single digit numbers

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move focus to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Clear previous input and focus it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (!/^[0-9]{6}$/.test(pastedData)) {
      toast.error('Silakan salin kode OTP 6 digit angka saja.')
      return
    }

    const digits = pastedData.split('')
    setOtp(digits)

    // Focus last input box
    inputRefs.current[5]?.focus()
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      toast.error('Silakan lengkapi kode OTP 6 digit.')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post('/auth/verify-email', {
        email,
        otp: otpCode,
      })

      toast.success(response.data.message || 'Email berhasil diverifikasi! Silakan masuk.')
      navigate('/login')
    } catch (error: any) {
      console.error('Verify email error:', error)
      const errorData = error.response?.data
      toast.error(errorData?.message || 'Kode verifikasi salah atau kedaluwarsa.')
    } finally {
      setIsLoading(false)
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return

    setIsResending(true)
    try {
      const response = await api.post('/auth/resend-otp', { email })
      toast.success(response.data.message || 'OTP baru berhasil dikirim!')
      setCooldown(60) // Start 60s cooldown
    } catch (error: any) {
      console.error('Resend OTP error:', error)
      const errorData = error.response?.data
      toast.error(errorData?.message || 'Gagal mengirim ulang OTP.')
    } finally {
      setIsResending(false)
    }
  };

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
          Verifikasi Email Anda
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal/60 font-poppins px-4">
          Kami telah mengirimkan kode OTP 6 digit ke <span className="font-semibold text-charcoal">{email}</span>. Silakan masukkan kode tersebut di bawah ini.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-sand sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  disabled={isLoading}
                  value={digit}
                  ref={(el) => { inputRefs.current[index] = el }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border border-sand bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-poppins"
                />
              ))}
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading || otp.some((d) => !d)}
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  'Verifikasi Email'
                )}
              </Button>
            </div>
          </form>

          {/* Resend Cooldown Section */}
          <div className="mt-6 text-center font-poppins text-sm">
            <span className="text-charcoal/60">Tidak menerima kode? </span>
            {cooldown > 0 ? (
              <span className="font-semibold text-gold-600">
                Kirim ulang dalam {cooldown}s
              </span>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-semibold text-gold-600 hover:text-gold-500 hover:underline transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isResending ? 'Mengirim...' : 'Kirim Ulang OTP'}
              </button>
            )}
          </div>

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

export default VerifyEmail
