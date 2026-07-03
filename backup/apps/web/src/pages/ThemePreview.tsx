import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, MapPin, Music, VolumeX, Heart, Clock } from 'lucide-react'

export const ThemePreview: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 120,
    hours: 5,
    minutes: 42,
    seconds: 9,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        clearInterval(timer)
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Theme settings
  const themeStyles = {
    'classic-royal': {
      bg: 'bg-slate-900 text-gold-100',
      card: 'bg-slate-800/80 border-gold-400/40 text-gold-100',
      accentText: 'text-gold-400 font-serif italic',
      headingFont: 'font-serif',
      button: 'bg-gold-500 hover:bg-gold-600 text-slate-950',
      accentBorder: 'border-gold-500/30',
      primaryColor: '#a9803b',
      title: 'Classic Royal Theme',
    },
    'modern-foliage': {
      bg: 'bg-[#f4f7f5] text-[#2d4030]',
      card: 'bg-white/90 border-[#8fa89b]/30 text-[#2d4030]',
      accentText: 'text-[#5b7a68] font-serif',
      headingFont: 'font-display',
      button: 'bg-[#5b7a68] hover:bg-[#465f50] text-white',
      accentBorder: 'border-[#5b7a68]/20',
      primaryColor: '#5b7a68',
      title: 'Modern Foliage Theme',
    },
    'rustic-autumn': {
      bg: 'bg-[#faf6f0] text-[#5c3d2e]',
      card: 'bg-[#f5ebd8]/80 border-[#d4956a]/30 text-[#5c3d2e]',
      accentText: 'text-[#d4956a] font-handwriting text-2xl',
      headingFont: 'font-poppins',
      button: 'bg-[#d4956a] hover:bg-[#bd7e54] text-white',
      accentBorder: 'border-[#d4956a]/30',
      primaryColor: '#d4956a',
      title: 'Rustic Autumn Theme',
    },
  }

  const activeTheme = themeStyles[themeId as keyof typeof themeStyles] || themeStyles['classic-royal']

  if (!hasOpened) {
    return (
      <div
        className={`w-full min-h-screen flex flex-col items-center justify-between py-16 px-6 text-center transition-all duration-500 ${activeTheme.bg}`}
      >
        <div className="flex flex-col items-center">
          <span className="font-poppins text-xs uppercase tracking-widest opacity-60 mb-2">
            The Wedding of
          </span>
          <h1 className={`${activeTheme.headingFont} text-4xl sm:text-5xl font-bold mt-2 mb-4`}>
            Reno & Kirana
          </h1>
          <span className="font-serif italic text-lg opacity-80">12 Oktober 2026</span>
        </div>

        <div className="p-8 border border-dashed rounded-full border-current/20 flex flex-col items-center justify-center w-64 h-64 bg-current/5 shadow-inner">
          <Heart className="animate-pulse w-8 h-8 mb-4 opacity-80" />
          <span className="text-xs uppercase tracking-widest opacity-60 mb-1">Kepada Yth.</span>
          <h3 className="font-poppins font-bold text-lg max-w-[200px] truncate mb-3">Tamu Undangan</h3>
          <span className="text-[10px] opacity-50">Silakan buka undangan</span>
        </div>

        <button
          onClick={() => {
            setHasOpened(true)
            setIsPlaying(true)
          }}
          className={`px-8 py-3 rounded-full font-poppins font-semibold shadow-md cursor-pointer transition-all duration-300 hover:scale-105 ${activeTheme.button}`}
        >
          Buka Undangan
        </button>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen relative pb-16 font-sans ${activeTheme.bg}`}>
      {/* Background Music Handler */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed top-6 right-6 z-40 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/20 transition-all text-current cursor-pointer"
      >
        {isPlaying ? <Music size={18} className="animate-spin" /> : <VolumeX size={18} />}
      </button>

      {/* Hero Header */}
      <div className="py-20 text-center px-6 border-b border-current/10">
        <span className="font-poppins text-xs uppercase tracking-widest opacity-60">The Wedding of</span>
        <h2 className={`text-4xl sm:text-5xl font-bold mt-3 mb-1.5 ${activeTheme.headingFont}`}>
          Reno & Kirana
        </h2>
        <p className={`${activeTheme.accentText} text-lg mb-8`}>Saling Mencintai dalam Ridho-Nya</p>

        {/* Timer Box */}
        <div className="flex justify-center gap-3 max-w-sm mx-auto mt-6">
          {Object.entries(timeLeft).map(([label, val]) => (
            <div key={label} className="flex flex-col items-center bg-current/5 border border-current/10 rounded-lg p-2.5 w-16 shadow-2xs">
              <span className="text-xl font-bold font-mono">{val}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-60 mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profiles */}
      <div className="py-16 px-6 max-w-xl mx-auto flex flex-col gap-12 text-center">
        {/* Groom */}
        <div className={`border rounded-2xl p-8 bg-current/5 ${activeTheme.accentBorder}`}>
          <div className="w-24 h-24 bg-current/10 rounded-full mx-auto mb-4 overflow-hidden border-2 border-current/25 flex items-center justify-center">
            👨‍💼
          </div>
          <h3 className={`text-2xl font-bold ${activeTheme.headingFont}`}>Reno Aditya, S.T.</h3>
          <p className="text-xs opacity-60 mt-1">Putra dari Bpk. Handoko & Ibu Srimulyani</p>
        </div>

        <span className={`${activeTheme.accentText} text-3xl font-serif italic`}>&</span>

        {/* Bride */}
        <div className={`border rounded-2xl p-8 bg-current/5 ${activeTheme.accentBorder}`}>
          <div className="w-24 h-24 bg-current/10 rounded-full mx-auto mb-4 overflow-hidden border-2 border-current/25 flex items-center justify-center">
            👩‍💼
          </div>
          <h3 className={`text-2xl font-bold ${activeTheme.headingFont}`}>Kirana Larasati, M.Psi.</h3>
          <p className="text-xs opacity-60 mt-1">Putri dari Bpk. Pramono & Ibu Lestari</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="py-16 px-6 max-w-xl mx-auto border-t border-current/10">
        <h3 className={`text-3xl font-bold text-center mb-10 ${activeTheme.headingFont}`}>
          Informasi Acara
        </h3>

        <div className="flex flex-col gap-8">
          {/* Akad */}
          <div className={`border p-6 rounded-xl bg-current/5 ${activeTheme.accentBorder}`}>
            <div className="flex items-center gap-3 mb-4" style={{ color: activeTheme.primaryColor }}>
              <Calendar size={20} className="text-current" />
              <h4 className="font-poppins font-bold text-lg text-current">Akad Nikah</h4>
            </div>
            <p className="text-sm leading-relaxed mb-1">Minggu, 12 Oktober 2026</p>
            <p className="text-sm leading-relaxed mb-4">Pukul 08:00 - 10:00 WIB</p>
            <div className="flex gap-2 items-start text-xs opacity-80 border-t border-current/10 pt-3">
              <MapPin size={16} className="shrink-0" />
              <span>Masjid Agung Istiqlal, Jakarta Pusat</span>
            </div>
          </div>

          {/* Resepsi */}
          <div className={`border p-6 rounded-xl bg-current/5 ${activeTheme.accentBorder}`}>
            <div className="flex items-center gap-3 mb-4" style={{ color: activeTheme.primaryColor }}>
              <Clock size={20} className="text-current" />
              <h4 className="font-poppins font-bold text-lg text-current">Resepsi</h4>
            </div>
            <p className="text-sm leading-relaxed mb-1">Minggu, 12 Oktober 2026</p>
            <p className="text-sm leading-relaxed mb-4">Pukul 11:00 - 14:00 WIB</p>
            <div className="flex gap-2 items-start text-xs opacity-80 border-t border-current/10 pt-3">
              <MapPin size={16} className="shrink-0" />
              <span>Hotel Borobudur Grand Ballroom, Jakarta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemePreview
