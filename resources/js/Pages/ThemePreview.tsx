import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion'
import { Calendar, MapPin, Music, VolumeX, Heart, Clock, ChevronDown, Send, CheckCircle2, Camera, X, MessageSquare, Menu, Play } from 'lucide-react'

const up: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } } }

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const childFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as any },
  },
}

const childScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as any },
  },
}

function useCountdown() {
  const [t, setT] = useState({ days: 101, hours: 14, minutes: 33, seconds: 7 })
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      if (p.seconds > 0) return { ...p, seconds: p.seconds - 1 }
      if (p.minutes > 0) return { ...p, minutes: p.minutes - 1, seconds: 59 }
      if (p.hours > 0) return { ...p, hours: p.hours - 1, minutes: 59, seconds: 59 }
      if (p.days > 0) return { ...p, days: p.days - 1, hours: 23, minutes: 59, seconds: 59 }
      clearInterval(id); return p
    }), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

const THEMES = {
  'classic-royal': {
    accent: '#C9A84C',
    accentRgb: '201,168,76',
    bg1: '#1a1a2e',
    bg2: '#16213e',
    bg3: '#0f3460',
    bgEvents: '',
    text: '#f5e6c8',
    sub: 'rgba(245,230,200,0.55)',
    btn: 'bg-gold-500 hover:bg-gold-400 text-[#1a1a2e]',
    dark: true,
    couple: '/assets/wedding/couple-royal.png',
    fontSerif: "'Cormorant Garamond', serif",
    fontSans: "'Poppins', sans-serif",
    rounded: '2.5rem',
    borderStyle: 'none',
    pattern: 'none'
  },
  'modern-foliage': {
    accent: '#5b7a68',
    accentRgb: '91,122,104',
    bg1: '#f4f7f5',
    bg2: '#ffffff',
    bg3: '#eef3f0',
    bgEvents: '',
    text: '#2d4030',
    sub: 'rgba(45,64,48,0.5)',
    btn: 'bg-[#5b7a68] hover:bg-[#465f50] text-white',
    dark: false,
    couple: '/assets/wedding/couple-foliage.png',
    fontSerif: "'Playfair Display', serif",
    fontSans: "'Poppins', sans-serif",
    rounded: '2.5rem',
    borderStyle: 'none',
    pattern: 'none'
  },
  'rustic-autumn': {
    accent: '#c8714a',
    accentRgb: '200,113,74',
    bg1: '#faf6f0',
    bg2: '#f5ebd8',
    bg3: '#fffaf5',
    bgEvents: '',
    text: '#5c3d2e',
    sub: 'rgba(92,61,46,0.5)',
    btn: 'bg-[#c8714a] hover:bg-[#b05e39] text-white',
    dark: false,
    couple: '/assets/wedding/couple-rustic.png',
    fontSerif: "'Playfair Display', serif",
    fontSans: "'Poppins', sans-serif",
    rounded: '2.5rem',
    borderStyle: 'none',
    pattern: 'none'
  },
  'royal-yogyakarta': {
    accent: '#e9c349',
    accentRgb: '233,195,73',
    bg1: '#fff8f6',
    bg2: '#ffffff',
    bg3: '#fff1ed',
    bgEvents: '#5d4037',
    text: '#442a22',
    sub: '#504441',
    btn: 'bg-gradient-to-r from-[#e9c349] to-[#b8860b] hover:opacity-90 text-white font-poppins font-bold',
    dark: false,
    couple: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeGYhRBvLFy5V1HRFFhDvkPB_VS8U55457IXEulxR-6GVnS9W32UXZvo__QMT2GfmavtG6l-kO-5TUPl_kAesCGDh6eb6lq3l9NyFoUyNGPDmdVtiM_9Rs95YcmrH9WHRgx1UCbV_UQvCy5Aj1jULJrwUFUzYW4J5ikU2Z_XlysdIUsgmxXzZU9Bcw_oaXgN_Fw4bCkArM1kfNRMuX1vW_d8ogWDFp6io--5ppMJcJxtPjCfJb6AAk_1H0gnCOfyeM3dt6j0dXVZQE',
    fontSerif: "'Libre Caslon Text', serif",
    fontSans: "'Plus Jakarta Sans', sans-serif",
    rounded: '0.25rem',
    borderStyle: '1px solid #e9c349',
    pattern: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23fadcd5' stroke-width='0.5' opacity='0.4'/%3E%3Cpath d='M40 10 L70 40 L40 70 L10 40 Z' fill='none' stroke='%23fadcd5' stroke-width='0.5' opacity='0.2'/%3E%3Ccircle cx='40' cy='40' r='5' fill='none' stroke='%23e9c349' stroke-width='0.75' opacity='0.5'/%3E%3C/svg%3E\")"
  }
}

const SectionLabel: React.FC<{ children: string; accent: string; themeId?: string }> = ({ children, accent, themeId }) => (
  <div className="flex flex-col items-center gap-2 mb-4">
    <span className="text-[10px] font-bold uppercase tracking-[0.35em] font-poppins" style={{ color: accent }}>{children}</span>
    {themeId === 'royal-yogyakarta' ? (
      <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: accent }}>
        <span>✦</span>
        <span>⚜</span>
        <span>✦</span>
      </div>
    ) : (
      <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />
    )}
  </div>
)

const GununganIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 68 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto my-3 opacity-80">
    <path d="M50 8 C38 40 12 85 12 108 C12 122 30 125 50 125 C70 125 88 122 88 108 C88 85 62 40 50 8 Z" stroke={color} strokeWidth="1.75" fill="none" />
    <path d="M50 15 C41 45 17 85 17 106 C17 115 32 119 50 119 C68 119 83 115 83 106 C83 85 59 45 50 15 Z" stroke={color} strokeWidth="0.75" strokeDasharray="3 3" fill="none" />
    <path d="M50 115 V45 M50 115 C42 110 35 102 42 93 C49 84 50 75 50 75 M50 115 C58 110 65 102 58 93 C51 84 50 75 50 75" stroke={color} strokeWidth="1" />
    <path d="M50 80 C35 75 30 66 40 62 C45 60 50 69 50 69 M50 80 C65 75 70 66 60 62 C55 60 50 69 50 69" stroke={color} strokeWidth="1" />
    <path d="M50 62 C38 57 35 48 42 44 C45 42 50 51 50 51 M50 62 C62 57 65 48 58 44 C55 42 50 51 50 51" stroke={color} strokeWidth="1" />
    <rect x="42" y="98" width="16" height="14" rx="1" stroke={color} strokeWidth="1.25" fill="none" />
    <path d="M42 98 L50 92 L58 98" stroke={color} strokeWidth="1.25" fill="none" />
    <line x1="50" y1="98" x2="50" y2="112" stroke={color} strokeWidth="1" />
    <circle cx="50" cy="30" r="2" fill={color} />
    <circle cx="38" cy="70" r="1.5" fill={color} />
    <circle cx="62" cy="70" r="1.5" fill={color} />
  </svg>
)

const JavaneseDivider: React.FC<{ color: string; themeId?: string }> = ({ color, themeId }) => {
  if (themeId === 'royal-yogyakarta') {
    return (
      <div className="flex items-center justify-center gap-3 my-8 relative z-20 pointer-events-none">
        <div className="h-[1px] w-14" style={{ background: 'linear-gradient(to right, transparent, #e9c349)' }} />
        <img alt="Ornament" className="h-8 w-auto drop-shadow-md opacity-90 brightness-110" src="/assets/wedding/section-divider.png" />
        <div className="h-[1px] w-14" style={{ background: 'linear-gradient(to left, transparent, #e9c349)' }} />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-[1px] w-14" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <span className="text-[10px]" style={{ color }}>❖ ⚜ ❖</span>
      <div className="h-[1px] w-14" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

interface StackingSectionProps {
  id: string
  zIndex: number
  bg: string
  pattern?: string
  borderRadius?: string
  borderTop?: string
  boxShadow?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

const StackingSection: React.FC<StackingSectionProps> = ({
  id,
  zIndex,
  bg,
  pattern,
  borderRadius,
  borderTop,
  boxShadow,
  className = '',
  style = {},
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Track global scroll velocity
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 250, mass: 0.4 })

  // Map velocity to dynamic transforms (skew and elastic scale) for scroll feedback
  const skewY = useTransform(smoothVelocity, [-3000, 3000], [-1.5, 1.5])
  const scaleY = useTransform(smoothVelocity, [-3000, 3000], [0.99, 1.01])

  // Map progress to card-stacking depth transforms (scaling down & dimming overlay)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacityOverlay = useTransform(scrollYProgress, [0, 0.85], [0, 0.6])

  return (
    <div
      ref={containerRef}
      data-section-id={id}
      className={`relative overflow-hidden w-full flex flex-col justify-center items-center ${className}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex,
        minHeight: '100dvh',
        height: '100dvh',
        background: bg,
        backgroundImage: pattern || 'none',
        borderRadius: borderRadius || '0px',
        borderTop,
        boxShadow,
        ...style
      }}
    >
      <motion.div
        className="w-full h-full flex flex-col justify-center items-center relative overflow-y-auto overflow-x-hidden py-10 px-4"
        style={{
          scale,
          skewY,
          scaleY,
          transformOrigin: 'center center'
        }}
      >
        <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center relative z-10 my-auto">
          {children}
        </div>
        
        {/* Dimming overlay when card gets stacked underneath */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none z-[99]"
          style={{ opacity: opacityOverlay }}
        />
      </motion.div>
    </div>
  )
}

export const ThemePreview: React.FC = () => {
  const raw = window.location.pathname.split('/').pop() ?? ''
  const themeId = raw in THEMES ? raw : 'classic-royal'
  const T = THEMES[themeId as keyof typeof THEMES]

  const scrollToSection = (id: string) => {
    const el = document.querySelector(`[data-section-id="${id}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const groomName = themeId === 'royal-yogyakarta' ? 'Ararya Suryokusumo' : 'Reno Aditya, S.T.'
  const brideName = themeId === 'royal-yogyakarta' ? 'Sekar Ayu Ningsih' : 'Kirana Larasati, M.Psi.'
  const groomParents = themeId === 'royal-yogyakarta' ? 'Putra dari Bpk. Harimurti & Ibu Kinasih' : 'Putra dari Bpk. Handoko & Ibu Srimulyani'
  const brideParents = themeId === 'royal-yogyakarta' ? 'Putri dari Bpk. Dananjaya & Ibu Larasati' : 'Putri dari Bpk. Pramono & Ibu Lestari'
  const weddingDate = themeId === 'royal-yogyakarta' ? 'Senin, 31 Agustus 2026' : 'Minggu, 12 Oktober 2026'
  const coupleLabel = themeId === 'royal-yogyakarta' ? 'Ararya & Sekar' : 'Reno & Kirana'

  const events = themeId === 'royal-yogyakarta' ? [
    { title: 'Akad Nikah', date: 'Senin, 31 Agustus 2026', time: '08:00 – 10:00 WIB', loc: 'Masjid Raya Darussalam, Yogyakarta' },
    { title: 'Ngunduh Mantu', date: 'Senin, 31 Agustus 2026', time: '11:00 – 13:00 WIB', loc: 'Pendopo Agung Kedhaton, Yogyakarta' },
    { title: 'Resepsi Pernikahan', date: 'Senin, 31 Agustus 2026', time: '13:00 – Selesai', loc: 'Gedung Agung Yogyakarta' }
  ] : [
    { title: 'Akad Nikah', date: 'Minggu, 12 Oktober 2026', time: '08:00 – 10:00 WIB', loc: 'Masjid Agung Istiqlal, Jakarta Pusat' },
    { title: 'Resepsi Pernikahan', date: 'Minggu, 12 Oktober 2026', time: '11:00 – 14:00 WIB', loc: 'Hotel Borobudur Grand Ballroom, Jakarta' }
  ]

  const mapSrc = themeId === 'royal-yogyakarta'
    ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.9736561330386!2d110.364372!3d-7.803248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5787bf62c4a9%3A0x633519c5c06cb3e0!2sKeraton%20Ngayogyakarta%20Hadiningrat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6664672620786!2d106.8306915748408!3d-6.170668993816658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5c4f2bb7f5f%3A0x9d4e5f2cf2e65042!2sHotel%20Borobudur%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"

  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [rsvp, setRsvp] = useState<'hadir' | 'tidak' | null>(null)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [copiedBank, setCopiedBank] = useState<string | null>(null)
  const [giftTab, setGiftTab] = useState<'qris' | 'bank'>('qris')
  const [wishes, setWishes] = useState(
    themeId === 'royal-yogyakarta' ? [
      { name: 'Budi dan Ani, Bandung', msg: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', time: 'Sabtu, 20 Juni 2026 14:52 WIB', rsvp: 'hadir' },
      { name: 'dodi', msg: 'samawa', time: 'Selasa, 09 Juni 2026 19:06 WIB', rsvp: 'hadir' },
      { name: 'farhan', msg: 'samawa ya bosquu', time: 'Selasa, 02 Juni 2026 10:04 WIB', rsvp: 'hadir' }
    ] : [
      { name: 'Sarah & Budi', msg: 'Selamat Reno & Kirana! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin.', time: 'Baru saja', rsvp: 'hadir' },
      { name: 'Hendra Wijaya', msg: 'Happy wedding Reno & Kirana! Bahagia selalu hingga kakek nenek. Maaf belum bisa hadir langsung.', time: '2 jam yang lalu', rsvp: 'tidak' },
      { name: 'Dian Permata', msg: 'Selamat menempuh hidup baru! Semoga dilancarkan acaranya sampai selesai.', time: '5 jam yang lalu', rsvp: 'hadir' }
    ]
  )
  const time = useCountdown()

  const [pinned, setPinned] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!open) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-section-id')
          if (id) {
            const isPinned = entry.boundingClientRect.top <= 5
            setPinned(prev => ({
              ...prev,
              [id]: isPinned
            }))
          }
        })
      },
      { threshold: [0, 0.5, 1], rootMargin: '-2px 0px 0px 0px' }
    )

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[data-section-id]')
      elements.forEach(el => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [open])

  const overlay = `rgba(${T.accentRgb},0.12)`
  const shadow = `0 -20px 60px 0 ${T.bg1}`
  const sectionShadow = T.dark
    ? '0 -15px 40px rgba(0, 0, 0, 0.45), 0 -4px 12px rgba(0, 0, 0, 0.3)'
    : '0 -15px 40px rgba(0, 0, 0, 0.12), 0 -4px 10px rgba(0, 0, 0, 0.05)'

  // COVER
  if (!open) {
    if (themeId === 'royal-yogyakarta') {
      return (
        <>
          <style>{`
            .font-serif {
              font-family: ${T.fontSerif} !important;
            }
            .font-poppins, .font-sans {
              font-family: ${T.fontSans} !important;
            }
            h1, .headline-xl {
              font-size: 40px !important;
              font-weight: 700 !important;
              line-height: 48px !important;
              letter-spacing: -0.02em !important;
            }
            h2, .headline-lg {
              font-size: 32px !important;
              font-weight: 600 !important;
              line-height: 40px !important;
            }
            h3, .headline-md {
              font-size: 24px !important;
              font-weight: 600 !important;
              line-height: 32px !important;
            }
            p, .body-md {
              font-size: 16px !important;
              font-weight: 400 !important;
              line-height: 24px !important;
            }
            .body-lg {
              font-size: 18px !important;
              font-weight: 400 !important;
              line-height: 28px !important;
            }
            .label-md {
              font-size: 14px !important;
              font-weight: 600 !important;
              line-height: 20px !important;
              letter-spacing: 0.05em !important;
            }
            .label-sm {
              font-size: 12px !important;
              font-weight: 700 !important;
              line-height: 16px !important;
              letter-spacing: 0.1em !important;
            }
            .gold-text-gradient {
              background: linear-gradient(to right, #b8860b, #ffe088, #b8860b) !important;
              -webkit-background-clip: text !important;
              -webkit-text-fill-color: transparent !important;
              filter: drop-shadow(0 2px 8px rgba(233, 195, 73, 0.5)) !important;
            }
            .gold-border {
              border: 1px solid #e9c349 !important;
              box-shadow: 0 4px 15px rgba(233, 195, 73, 0.1) !important;
            }
            .watermark-bg {
              background-image: url('/assets/wedding/section-divider.png') !important;
              background-position: center !important;
              background-repeat: no-repeat !important;
              background-size: contain !important;
            }
            .gunungan-bg {
              background: linear-gradient(180deg, rgba(255,248,246,0) 0%, rgba(68,42,34,0.3) 50%, rgba(255,248,246,1) 100%) !important;
            }
          `}</style>
          <div className="w-full h-screen h-[100dvh] flex flex-col justify-end items-center text-center p-6 overflow-hidden relative select-none"
            style={{ background: T.bg1 }}>
            <div className="absolute inset-0 bg-cover bg-center w-full h-full z-0"
              style={{ backgroundImage: `url('${T.couple}')` }} />
            <div className="absolute inset-0 watermark-bg opacity-30 mix-blend-overlay scale-150 z-[5]" />
            <div className="absolute inset-0 gunungan-bg z-10" />

            <div className="relative z-20 w-full max-w-sm mb-4 flex flex-col items-center">
              <p className="font-poppins text-xs text-[#e9c349] uppercase tracking-widest mb-1 drop-shadow-md font-bold">Pernikahan</p>
              <h1 className="font-serif text-[36px] leading-[42px] font-bold mb-2 gold-text-gradient">
                Ararya &amp;<br />Sekar
              </h1>
              <p className="font-poppins text-[14px] text-[#504441] mb-6 italic drop-shadow-sm font-semibold">
                Senin, 31 Agustus 2026
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-xl gold-border mb-5 w-full max-w-xs">
                <p className="text-[10px] text-[#504441] mb-0.5 font-poppins">Kepada Yth.</p>
                <p className="font-serif text-[20px] font-bold text-[#442a22]">Budi dan Ani</p>
                <p className="text-[10px] text-[#504441] mt-0.5 font-poppins">di Bandung</p>
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setOpen(true); setPlaying(true) }}
                className="w-full max-w-xs bg-gradient-to-r from-[#e9c349] to-[#b8860b] text-white py-3 rounded-full font-poppins font-bold text-xs uppercase tracking-wide shadow-lg hover:opacity-90 transition-opacity border border-[#ffe088]/50">
                Buka Undangan
              </motion.button>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <style>{`
          .font-serif {
            font-family: ${T.fontSerif} !important;
          }
          .font-poppins, .font-sans {
            font-family: ${T.fontSans} !important;
          }
          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none !important;
          }
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          html, body {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          html::-webkit-scrollbar, body::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>

        <div className="w-full h-screen h-[100dvh] flex flex-col items-center justify-between py-8 px-6 text-center relative overflow-hidden select-none"
          style={{ background: `linear-gradient(160deg, ${T.bg1} 0%, ${T.bg3} 100%)` }}>
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: T.dark ? 0.22 : 0.18, mixBlendMode: T.dark ? 'luminosity' : 'multiply' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-48 pointer-events-none select-none"
            style={{ opacity: 0.25, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-48 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />

          {/* top name block */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center gap-1.5 pt-2">
            <span className="font-poppins text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color: T.accent }}>Walimatul Ursy</span>
            <div className="w-8 h-px" style={{ background: T.accent }} />
            <h1 className="font-serif leading-tight text-center" style={{ color: T.text, fontSize: '2.4rem', fontWeight: 700 }}>
              Reno<span className="inline mx-2" style={{ color: T.accent, fontWeight: 300, fontSize: '1.8rem' }}>&amp;</span>Kirana
            </h1>
            <div className="w-24 h-px" style={{ background: `linear-gradient(to right, transparent, ${T.accent}, transparent)` }} />
            <p className="font-poppins font-bold text-[10px]" style={{ color: T.accent }}>Minggu, 12 Oktober 2026</p>
          </motion.div>

          {/* Couple illustration with arched frame */}
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.16,1,0.3,1] as any }}
            className="relative z-10 w-full flex justify-center my-2">
            <div className="relative w-[150px] h-[220px] rounded-t-full border-2 overflow-hidden flex items-end justify-center p-2.5 shadow-xl"
              style={{ borderColor: T.accent, background: `linear-gradient(to bottom, rgba(${T.accentRgb}, 0.12), rgba(${T.accentRgb}, 0.02))` }}>
              {/* Floral background watermark inside the arch */}
              <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
              <img src={T.couple} alt="Pasangan Pengantin"
                className="w-full h-auto max-h-[90%] object-contain drop-shadow-lg select-none pointer-events-none relative z-10 transition-transform duration-700 hover:scale-105" />
            </div>
          </motion.div>

          {/* envelope card */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="relative z-10 flex flex-col items-center gap-2 py-4 px-8 border"
            style={{
              background: overlay,
              borderColor: `rgba(${T.accentRgb},0.25)`,
              borderRadius: T.rounded,
              boxShadow: `0 6px 30px rgba(${T.accentRgb},0.1)`
            }}>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <Heart size={22} fill="currentColor" style={{ color: T.accent }} />
            </motion.div>
            <span className="text-[8px] uppercase tracking-widest font-semibold font-poppins" style={{ color: T.sub }}>Kepada Yth.</span>
            <p className="font-poppins font-bold text-sm" style={{ color: T.text }}>Tamu Undangan</p>
            <p className="text-[8px]" style={{ color: T.sub }}>Silakan buka undangan ini</p>
          </motion.div>

          {/* open button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="relative z-10 pb-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => { setOpen(true); setPlaying(true) }}
              className={`px-8 py-3 font-poppins font-bold text-xs cursor-pointer transition-all ${T.btn}`}
              style={{
                borderRadius: '9999px',
                boxShadow: `0 6px 20px rgba(${T.accentRgb},0.3)`
              }}>
              Buka Undangan
            </motion.button>
          </motion.div>
        </div>
      </>
    )
  }

  const handleSubmitWish = () => {
    if (name.trim() && msg.trim()) {
      setWishes(prev => [
        { name: name.trim(), msg: msg.trim(), time: 'Baru saja', rsvp: rsvp || 'hadir' },
        ...prev
      ])
      setSent(true)
    }
  }

  // MAIN INVITATION
  return (
    <>
      <style>{`
        .font-serif {
          font-family: ${T.fontSerif} !important;
        }
        .font-poppins, .font-sans {
          font-family: ${T.fontSans} !important;
        }
        /* Hide scrollbars globally */
        ::-webkit-scrollbar {
          display: none !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html, body {
          overflow-x: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none !important;
        }
        ${themeId === 'royal-yogyakarta' ? `
          h1, .headline-xl {
            font-size: 40px !important;
            font-weight: 700 !important;
            line-height: 48px !important;
            letter-spacing: -0.02em !important;
          }
          h2, .headline-lg {
            font-size: 32px !important;
            font-weight: 600 !important;
            line-height: 40px !important;
          }
          h3, .headline-md {
            font-size: 24px !important;
            font-weight: 600 !important;
            line-height: 32px !important;
          }
          p, .body-md {
            font-size: 16px !important;
            font-weight: 400 !important;
            line-height: 24px !important;
          }
          .body-lg {
            font-size: 18px !important;
            font-weight: 400 !important;
            line-height: 28px !important;
          }
          .label-md {
            font-size: 14px !important;
            font-weight: 600 !important;
            line-height: 20px !important;
            letter-spacing: 0.05em !important;
          }
          .label-sm {
            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 16px !important;
            letter-spacing: 0.1em !important;
          }
        ` : ''}
      `}</style>
      <div className="relative" style={{ background: T.bg1, color: T.text, fontFamily: 'inherit' }}>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-[100] bg-white/90 border-b flex justify-between items-center px-6 h-16 transition-all duration-300 ease-in-out"
        style={{
          background: themeId === 'royal-yogyakarta' ? 'rgba(255,248,246,0.95)' : T.dark ? 'rgba(26,26,46,0.95)' : 'rgba(255,255,255,0.95)',
          borderColor: themeId === 'royal-yogyakarta' ? 'rgba(233,195,73,0.3)' : `rgba(${T.accentRgb},0.2)`
        }}>
        <button className="hover:opacity-80" style={{ color: T.accent }}>
          <Menu size={20} />
        </button>
        <div className="font-serif font-bold text-lg" style={{ color: T.text }}>
          {coupleLabel}
        </div>
        <button className="hover:opacity-80" style={{ color: T.accent }}>
          <Heart size={20} className="fill-current" />
        </button>
      </header>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-4 left-4 right-4 md:max-w-xs md:left-1/2 md:-translate-x-1/2 z-[100] flex justify-around items-center px-2 py-2.5 border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-full transition-transform"
        style={{
          borderColor: themeId === 'royal-yogyakarta' ? '#e9c349' : `rgba(${T.accentRgb},0.25)`,
          background: themeId === 'royal-yogyakarta' ? '#fff8f6' : T.bg2
        }}>
        {(() => {
          const activeSection = (pinned.rsvp || pinned.gift || pinned.protocol || pinned.closing)
            ? 'rsvp'
            : (pinned.gallery || pinned.wishes)
            ? 'gallery'
            : pinned.event
            ? 'event'
            : 'hero';

          return (
            <>
              <button onClick={() => scrollToSection('hero')} className="flex flex-col items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold font-poppins cursor-pointer transition-all duration-300"
                style={{ color: activeSection === 'hero' ? T.accent : T.sub }}>
                <Heart size={14} className="mb-0.5 transition-colors duration-300" fill={activeSection === 'hero' ? "currentColor" : "none"} />
                <span>Home</span>
              </button>
              <button onClick={() => scrollToSection('event')} className="flex flex-col items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold font-poppins cursor-pointer transition-all duration-300"
                style={{ color: activeSection === 'event' ? T.accent : T.sub }}>
                <Calendar size={14} className="mb-0.5 transition-colors duration-300" fill={activeSection === 'event' ? "currentColor" : "none"} />
                <span>Events</span>
              </button>
              <button onClick={() => scrollToSection('gallery')} className="flex flex-col items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold font-poppins cursor-pointer transition-all duration-300"
                style={{ color: activeSection === 'gallery' ? T.accent : T.sub }}>
                <Camera size={14} className="mb-0.5 transition-colors duration-300" fill={activeSection === 'gallery' ? "currentColor" : "none"} />
                <span>Gallery</span>
              </button>
              <button onClick={() => scrollToSection('rsvp')} className="flex flex-col items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold font-poppins cursor-pointer transition-all duration-300"
                style={{ color: activeSection === 'rsvp' ? T.accent : T.sub }}>
                <Send size={14} className="mb-0.5 transition-colors duration-300" fill={activeSection === 'rsvp' ? "currentColor" : "none"} />
                <span>RSVP</span>
              </button>
            </>
          );
        })()}
      </nav>

      {/* music btn */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        onClick={() => setPlaying(!playing)}
        className="fixed top-20 right-4 z-[100] w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer transition-all"
        style={{ background: overlay, borderColor: `rgba(${T.accentRgb},0.3)` }}>
        {playing ? <Music size={15} className="animate-spin-slow" style={{ color: T.accent }} /> : <VolumeX size={15} style={{ color: T.accent }} />}
      </motion.button>

      {/* ─── S1: HERO ─── sticky anchor */}
      <StackingSection
        id="hero"
        zIndex={10}
        bg={`linear-gradient(160deg, ${T.bg1} 0%, ${T.bg3} 100%)`}
        className="text-center"
        style={{ paddingTop: '6.5rem', paddingBottom: '4rem' }}
      >
        {themeId === 'royal-yogyakarta' ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center w-full h-full z-0 pointer-events-none"
              style={{ backgroundImage: `url('${T.couple}')` }} />
            <div className="absolute inset-0 watermark-bg opacity-30 mix-blend-overlay scale-150 z-[5]"
              style={{
                backgroundImage: "url('/assets/wedding/section-divider.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }} />
            <div className="absolute inset-0 gunungan-bg z-10" />
            <motion.div initial="hidden" animate="visible" variants={up} className="relative z-20 px-8 flex flex-col items-center gap-3" style={{ paddingBottom: '2rem' }}>
              <p className="font-poppins text-xs text-[#e9c349] uppercase tracking-widest mb-1 drop-shadow-md font-bold">Pernikahan</p>
              <h1 className="font-serif text-[38px] leading-[44px] font-bold mb-2 gold-text-gradient">
                Ararya &amp;<br />Sekar
              </h1>
              <p className="font-poppins text-[15px] text-[#504441] mb-5 italic drop-shadow-sm font-semibold">
                {weddingDate}
              </p>
              <div className="px-5 py-2 rounded-full border text-xs font-poppins font-semibold"
                style={{ color: T.accent, borderColor: `rgba(${T.accentRgb},0.4)`, background: 'rgba(255,255,255,0.85)' }}>
                📅 {weddingDate}
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, ${T.bg1}CC 100%)` }} />

            <motion.div initial="hidden" animate="visible" variants={up} className="relative z-10 px-8 flex flex-col items-center gap-2" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <SectionLabel themeId={themeId} accent={T.accent}>Walimatul Ursy</SectionLabel>
              <h1 className="font-serif font-bold leading-tight text-center" style={{ fontSize: '2.5rem', color: T.text }}>
                Reno
                <span className="block font-light" style={{ color: T.accent, fontSize: '1.8rem' }}>&amp;</span>
                Kirana
              </h1>
              <div className="w-24 h-px" style={{ background: `linear-gradient(to right, transparent, ${T.accent}, transparent)` }} />
              <p className="font-serif italic text-xs max-w-[240px] leading-relaxed text-center" style={{ color: T.sub }}>
                "Dan Kami menciptakan kamu berpasang-pasangan" — QS. An-Naba: 8
              </p>
              <div className="px-5 py-1.5 rounded-full border text-[10px] font-poppins font-semibold"
                style={{ color: T.accent, borderColor: `rgba(${T.accentRgb},0.4)`, background: overlay }}>
                📅 {weddingDate}
              </div>

              {/* Couple illustration in hero */}
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, delay: 0.4, ease: [0.16,1,0.3,1] as any }}
                className="relative mt-2 flex justify-center w-full">
                {/* Glow behind illustration */}
                <div className="absolute inset-0 rounded-full blur-3xl opacity-20 scale-90 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${T.accent}, transparent 70%)` }} />
                <div className="relative w-[150px] h-[220px] rounded-t-full border-2 overflow-hidden flex items-end justify-center p-2.5 shadow-2xl z-10"
                  style={{ borderColor: T.accent, background: `linear-gradient(to bottom, rgba(${T.accentRgb}, 0.12), rgba(${T.accentRgb}, 0.02))` }}>
                  {/* Floral background watermark inside the arch */}
                  <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
                  <img src={T.couple} alt="Pasangan Pengantin"
                     className="w-full h-auto max-h-[92%] object-contain drop-shadow-xl select-none pointer-events-none relative z-10" />
                </div>
              </motion.div>

              <motion.div className="mt-1" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
                <ChevronDown size={18} style={{ color: T.accent, opacity: 0.6 }} />
              </motion.div>
            </motion.div>
          </>
        )}
      </StackingSection>


      {/* ─── S1.5: INTRO & COUNTDOWN (MERGED) ─── */}
      <StackingSection
        id="countdown"
        zIndex={15}
        bg={T.bg1}
        pattern={T.pattern}
        borderRadius={pinned['countdown'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-16 text-center"
        style={{
          backgroundSize: themeId === 'royal-yogyakarta' ? '150px' : 'auto',
          backgroundRepeat: themeId === 'royal-yogyakarta' ? 'repeat' : 'no-repeat',
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />

          <div className="relative z-10 max-w-sm mx-auto px-6 flex flex-col items-center gap-3">
            {themeId === 'royal-yogyakarta' ? (
              <h2 className="font-serif font-bold text-xl gold-text-gradient mb-1">Assalamu'alaikum Warahmatullah</h2>
            ) : (
              <h2 className="font-serif font-bold text-xl mb-1" style={{ color: T.text }}>Assalamu'alaikum Wr. Wb.</h2>
            )}
            <p className="font-poppins text-xs leading-relaxed max-w-[280px]" style={{ color: T.sub }}>
              Dengan Rahmat Allah yang Maha Kuasa InsyaAllah kami akan melangsungkan pernikahan pada {weddingDate}. Semoga Allah memberkahi ikatan pernikahan kami.
            </p>
            
            <JavaneseDivider color={T.accent} themeId={themeId} />

            <div className="mt-2 flex flex-col items-center">
              <SectionLabel themeId={themeId} accent={T.accent}>Menghitung Hari</SectionLabel>
              <div className="flex justify-center gap-2 mt-2">
                {[['days', time.days], ['hours', time.hours], ['minutes', time.minutes], ['seconds', time.seconds]].map(([l, v]) => (
                  <div key={l} className="flex flex-col items-center px-2 py-2 w-[54px] border"
                    style={{
                      background: overlay,
                      borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.25)`,
                      borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '0.75rem'
                    }}>
                    <span className="text-xl font-bold font-mono leading-none" style={{ color: T.accent }}>{String(v).padStart(2,'0')}</span>
                    <span className="text-[8px] uppercase tracking-wider mt-1 font-poppins font-semibold" style={{ color: themeId === 'royal-yogyakarta' ? T.text : T.sub }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S3: COUPLE ─── slides over S2 on scroll */}
      <StackingSection
        id="couple"
        zIndex={20}
        bg={T.bg3}
        pattern={T.pattern}
        borderRadius={pinned['couple'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.08 }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Mempelai</SectionLabel>
              <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Dua Jiwa, Satu Ikatan</h2>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  name: groomName,
                  role: 'Mempelai Pria',
                  parents: groomParents,
                  init: 'A',
                  ig: themeId === 'royal-yogyakarta' ? '@araryasuryo' : '@reno.aditya',
                  img: themeId === 'royal-yogyakarta' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf5Evqen976f2JKCtyX3nCRq7LHKa4e2cK7krfgkXkg7RfZ27Ja9vGx7Gt6HoyE7bbE_DSw5cJrnCCzf-6l1ax_c3o2m5sBS6s8zdT23M1WVcCTHuU5Io0BOru_ADzqQDUTXD-Yzebjr9caV3FGvN0377juiFg579LTmVZE__vAHAsLIfW23bfJbwm6oupiH0UM_v6iKDLto5OFsXkef8gRLKRVGhUp51x0ZXzcoawtof-spj5ANJFUxLc2dgzDWOxz0kwRrJ8e3S9' : null
                },
                {
                  name: brideName,
                  role: 'Mempelai Wanita',
                  parents: brideParents,
                  init: 'S',
                  ig: themeId === 'royal-yogyakarta' ? '@sekar.ayuningsih' : '@kirana.larasati',
                  img: themeId === 'royal-yogyakarta' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDOJGWVdDIwNQA3BeSgyrnyyIYV-yb9eSCnvMD3UFciKNeP1bVRD07qAZ5g7lUM_MzdMNZd2NL8MXnc2rjM3V_4fDaFGgxEB8ED7UQ61U1yiGsB47zyoOFWaag6m9H6NAgE25LhmrhXTmCwxHGSm8uo94vsVAnNWYrPs80sAs6LSLbQq4YrW4rIxUYDLsTxz94rPnzn0J76T3SySfM7g2nOHRtDXiWc496QFo1qjw_2iPIL-j8ZdAN7FIPXouXAdUme7dY6W0b5Jp0' : null
                },
              ].map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="flex items-center gap-3 p-3 border"
                  style={{
                    background: `rgba(${T.accentRgb},0.06)`,
                    borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                    borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1rem',
                    boxShadow: themeId === 'royal-yogyakarta' ? `0 0 0 1px ${T.accent} inset` : 'none'
                  }}>
                  {/* Avatar */}
                  <div className="relative shrink-0 w-14 h-14 border flex items-center justify-center overflow-hidden"
                    style={{
                      borderColor: T.accent,
                      background: overlay,
                      borderRadius: themeId === 'royal-yogyakarta' ? '9999px 9999px 0 0' : '9999px'
                    }}>
                    {p.img ? (
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover relative z-10" />
                    ) : (
                      <>
                        <img src="/assets/wedding/ornaments.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                          style={{ opacity: 0.2 }} />
                        <span className="font-serif font-bold text-xl relative z-10" style={{ color: T.accent }}>{p.init}</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] uppercase tracking-widest font-bold font-poppins" style={{ color: T.accent }}>{p.role}</span>
                    <h3 className="font-serif font-bold text-sm mt-0.5" style={{ color: T.text }}>{p.name}</h3>
                    <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: T.sub }}>{p.parents}</p>
                    <p className="text-[9px] mt-0.5 font-semibold" style={{ color: T.accent }}>{p.ig}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              {themeId === 'royal-yogyakarta' && <JavaneseDivider color={T.accent} themeId={themeId} />}
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S3.5: CERITA CINTA (TIMELINE) ─── */}
      <StackingSection
        id="timeline"
        zIndex={25}
        bg={T.bg1}
        pattern={T.pattern}
        borderRadius={pinned['timeline'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
        style={{
          backgroundSize: themeId === 'royal-yogyakarta' ? '150px' : 'auto',
          backgroundRepeat: themeId === 'royal-yogyakarta' ? 'repeat' : 'no-repeat',
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-6">
              <SectionLabel themeId={themeId} accent={T.accent}>Kisah Kami</SectionLabel>
              {themeId === 'royal-yogyakarta' ? (
                <h2 className="font-serif font-bold text-xl gold-text-gradient">Cerita Cinta</h2>
              ) : (
                <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Cerita Cinta</h2>
              )}
            </div>

            {/* Timeline track */}
            <div className="relative border-l-2 ml-4 flex flex-col gap-4" style={{ borderColor: T.accent }}>
              {[
                {
                  title: themeId === 'royal-yogyakarta' ? 'Kapatemon' : 'Pertemuan Pertama',
                  date: themeId === 'royal-yogyakarta' ? 'Januari 2024' : 'Awal Tahun 2024',
                  desc: themeId === 'royal-yogyakarta' ? 'Gusti Allah mempertemukan kedua insan melalui tali silaturahmi keluarga.' : 'Pertemuan tak sengaja yang menjadi awal perjalanan kami.'
                },
                {
                  title: themeId === 'royal-yogyakarta' ? 'Lamaran (Peningset)' : 'Lamaran',
                  date: themeId === 'royal-yogyakarta' ? 'Maret 2026' : 'Awal Tahun 2026',
                  desc: themeId === 'royal-yogyakarta' ? 'Ikatan janji suci ditalikan dengan penyerahan peningset sebagai lambang kesungguhan.' : 'Komitmen bersama untuk melangkah ke jenjang pernikahan.'
                },
                {
                  title: themeId === 'royal-yogyakarta' ? 'Sajak Krama' : 'Pernikahan',
                  date: weddingDate,
                  desc: themeId === 'royal-yogyakarta' ? 'Mengikat janji suci di hadapan Penghulu dan para saksi untuk hidup bersama selamanya.' : 'Hari bahagia dimulainya kehidupan baru sebagai suami istri.'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative pl-5">
                  {/* timeline bullet */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white"
                    style={{ borderColor: T.accent }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider font-poppins" style={{ color: T.accent }}>{item.date}</span>
                    <h4 className="font-serif font-bold text-xs mt-0.5" style={{ color: T.text }}>{item.title}</h4>
                    <p className="font-poppins text-[10px] leading-relaxed mt-0.5" style={{ color: T.sub }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <JavaneseDivider color={T.accent} themeId={themeId} />
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S4: EVENT DETAILS ─── slides over S3 on scroll */}
      <StackingSection
        id="event"
        zIndex={30}
        bg={T.bgEvents || (T.dark ? '#252320' : '#2C2C2C')}
        pattern={T.pattern}
        borderRadius={pinned['event'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
        style={{
          color: themeId === 'royal-yogyakarta' ? '#FFFDD0' : '#f5e6c8',
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.25, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.3 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.55)' }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Rangkaian Acara</SectionLabel>
              <h2 className="font-serif font-bold text-xl" style={{ color: themeId === 'royal-yogyakarta' ? '#FFFDD0' : '#f5e6c8' }}>Jadwal &amp; Lokasi</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {events.map((ev, i) => (
                <div key={i} className="min-w-[85%] snap-center p-4 border text-left"
                  style={{
                    background: `rgba(${T.accentRgb},0.1)`,
                    borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                    borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1rem',
                    boxShadow: themeId === 'royal-yogyakarta' ? `0 0 0 1px ${T.accent} inset` : 'none'
                  }}>
                  <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b" style={{ borderColor: `rgba(${T.accentRgb},0.2)` }}>
                    {ev.title.includes('Resepsi') ? <Clock size={14} style={{ color: T.accent }} /> : <Calendar size={14} style={{ color: T.accent }} />}
                    <h3 className="font-serif font-bold text-xs" style={{ color: T.dark || themeId === 'royal-yogyakarta' ? '#f5e6c8' : T.text }}>{ev.title}</h3>
                  </div>
                  <p className="text-[10px] mb-0.5" style={{ color: `rgba(245,230,200,0.6)` }}>{ev.date}</p>
                  <p className="text-[11px] font-bold mb-1.5" style={{ color: T.accent }}>{ev.time}</p>
                  <div className="flex items-start gap-1.5 text-[10px]" style={{ color: `rgba(245,230,200,0.5)` }}>
                    <MapPin size={10} className="shrink-0 mt-0.5" style={{ color: T.accent }} />
                    <span>{ev.loc}</span>
                  </div>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2.5 text-[9px] font-semibold font-poppins rounded-full px-2.5 py-1 border"
                    style={themeId === 'royal-yogyakarta' ? {
                      color: '#FFFDD0',
                      borderColor: 'rgba(255, 253, 208, 0.4)',
                      background: 'transparent',
                      borderRadius: '0.25rem',
                      padding: '6px 12px',
                      fontFamily: T.fontSans,
                      fontSize: '9px',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    } : {
                      color: T.accent,
                      borderColor: `rgba(${T.accentRgb},0.35)`,
                      background: `rgba(${T.accentRgb},0.1)`
                    }}>
                    <MapPin size={8} /> Buka Navigator
                  </a>
                </div>
              ))}
            </div>

            {/* Map Lightbox Trigger Button */}
            <div className="flex justify-center mt-1">
              <button onClick={() => setShowMap(true)} className="inline-flex items-center gap-1.5 mt-2.5 text-[9px] font-semibold font-poppins rounded-full px-4 py-2 border cursor-pointer hover:opacity-90 transition-opacity"
                style={themeId === 'royal-yogyakarta' ? {
                  color: '#FFFDD0',
                  borderColor: T.accent,
                  background: 'rgba(233,195,73,0.15)',
                  borderRadius: '0.25rem',
                  fontFamily: T.fontSans,
                  fontSize: '9px',
                  fontWeight: '600',
                  letterSpacing: '0.05em'
                } : {
                  color: T.accent,
                  borderColor: `rgba(${T.accentRgb},0.35)`,
                  background: `rgba(${T.accentRgb},0.1)`
                }}>
                <MapPin size={10} /> Lihat Peta Lokasi
              </button>
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S4.2: VIDEO SECTION ─── */}
      <StackingSection
        id="video"
        zIndex={42}
        bg={T.bg2}
        pattern={T.pattern}
        borderRadius={pinned['video'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
        style={{
          backgroundSize: themeId === 'royal-yogyakarta' ? '150px' : 'auto',
          backgroundRepeat: themeId === 'royal-yogyakarta' ? 'repeat' : 'no-repeat',
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Momen Bahagia</SectionLabel>
              {themeId === 'royal-yogyakarta' ? (
                <h2 className="font-serif font-bold text-xl gold-text-gradient">Video Prewedding</h2>
              ) : (
                <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Video Prewedding</h2>
              )}
            </div>

            <div className="relative w-full aspect-video border overflow-hidden shadow-lg group"
              style={{
                borderColor: T.accent,
                borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1rem'
              }}>
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                poster="https://lh3.googleusercontent.com/aida-public/AB6AXuCeGYhRBvLFy5V1HRFFhDvkPB_VS8U55457IXEulxR-6GVnS9W32UXZvo__QMT2GfmavtG6l-kO-5TUPl_kAesCGDh6eb6lq3l9NyFoUyNGPDmdVtiM_9Rs95YcmrH9WHRgx1UCbV_UQvCy5Aj1jULJrwUFUzYW4J5ikU2Z_XlysdIUsgmxXzZU9Bcw_oaXgN_Fw4bCkArM1kfNRMuX1vW_d8ogWDFp6io--5ppMJcJxtPjCfJb6AAk_1H0gnCOfyeM3dt6j0dXVZQE"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-walking-in-a-field-44222-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="flex justify-center mt-6">
              <JavaneseDivider color={T.accent} themeId={themeId} />
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S4.5: GALLERY ─── slides over S4 on scroll */}
      <StackingSection
        id="gallery"
        zIndex={45}
        bg={T.bg1}
        pattern={T.pattern}
        borderRadius={pinned['gallery'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.08 }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Galeri Bahagia</SectionLabel>
              <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Momen Indah</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]' },
                { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]' },
                { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]' },
                { src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]' },
                { src: 'https://images.unsplash.com/photo-1519225495810-7517c296517a?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]' },
                { src: 'https://images.unsplash.com/photo-1507504038482-7621c37b3f9d?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-[3/4]' }
              ].map((img, i) => (
                <motion.div key={i} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setActivePhoto(img.src)}
                  className={`relative min-w-[78%] ${img.aspect} snap-center overflow-hidden cursor-pointer border shadow-md group`}
                  style={{
                    borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                    borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1rem'
                  }}>
                  <img src={img.src} alt={`Momen ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white drop-shadow-md" size={24} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-1.5 mt-2 text-[10px] text-gray-500 font-poppins font-medium">
              <span className="animate-pulse">Geser ke samping</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S4.8: AMPLOP DIGITAL ─── slides over S4.5 on scroll */}
      <StackingSection
        id="gift"
        zIndex={48}
        bg={T.bg3}
        pattern={T.pattern}
        borderRadius={pinned['gift'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.08 }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Kado Digital</SectionLabel>
              <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Amplop Digital</h2>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ color: T.sub }}>
                Doa restu Anda merupakan karunia terindah. Namun jika ingin memberikan tanda kasih, silakan gunakan pilihan di bawah ini.
              </p>
            </div>

            <div className="flex gap-2 mb-3 justify-center">
              <button
                onClick={() => setGiftTab('qris')}
                className="text-[10px] font-poppins font-bold px-4 py-1.5 border transition-colors cursor-pointer"
                style={{
                  color: giftTab === 'qris' ? T.bg3 : T.accent,
                  background: giftTab === 'qris' ? T.accent : 'transparent',
                  borderColor: T.accent,
                  borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '9999px'
                }}>
                QRIS Angpao
              </button>
              <button
                onClick={() => setGiftTab('bank')}
                className="text-[10px] font-poppins font-bold px-4 py-1.5 border transition-colors cursor-pointer"
                style={{
                  color: giftTab === 'bank' ? T.bg3 : T.accent,
                  background: giftTab === 'bank' ? T.accent : 'transparent',
                  borderColor: T.accent,
                  borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '9999px'
                }}>
                Transfer Bank
              </button>
            </div>

            <div className="p-4 border text-center flex flex-col justify-center min-h-[260px]"
              style={{
                background: overlay,
                borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.25)`,
                borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1.25rem',
                boxShadow: themeId === 'royal-yogyakarta' ? `0 0 0 1px ${T.accent} inset` : 'none'
              }}>
              {giftTab === 'qris' ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex justify-center bg-white p-1.5 border"
                    style={{
                      borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                      borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '0.75rem'
                    }}>
                    <img src="/assets/wedding/qris.png" alt="QRIS Angpao" className="w-36 h-auto" />
                  </div>
                  <p className="text-[9px]" style={{ color: T.sub }}>Scan QRIS di atas via aplikasi E-Wallet atau M-Banking Anda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(themeId === 'royal-yogyakarta' ? [
                    { bank: 'Bank Mandiri', number: '137-000-1234-567', holder: 'Ararya Suryokusumo' },
                    { bank: 'Bank Syariah Indonesia (BSI)', number: '714-1234-567', holder: 'Sekar Ayu Ningsih' }
                  ] : [
                    { bank: 'Bank Mandiri', number: '123-456-789-0', holder: 'Reno Aditya' }
                  ]).map((account, idx) => (
                    <div key={idx} className="text-left bg-black/5 dark:bg-white/5 p-3 space-y-1 text-xs" style={{ borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '0.75rem' }}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[11px]">{account.bank}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(account.number.replace(/-/g, ''));
                            setCopiedBank(account.number);
                            setTimeout(() => setCopiedBank(null), 2000);
                          }}
                          className="text-[8px] font-poppins font-bold px-2 py-0.5 border hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                          style={{
                            color: T.accent,
                            borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.4)`,
                            borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '9999px'
                          }}>
                          {copiedBank === account.number ? 'Tersalin ✓' : 'Salin'}
                        </button>
                      </div>
                      <p className="font-mono font-bold text-xs tracking-wider" style={{ color: T.accent }}>{account.number}</p>
                      <p className="text-[9px] opacity-75">a.n. {account.holder}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S5: RSVP & WISHES ─── slides over S4.8 on scroll */}
      <StackingSection
        id="rsvp"
        zIndex={50}
        bg={T.bg2}
        pattern={T.pattern}
        borderRadius={pinned['rsvp'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="relative py-12"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Konfirmasi Kehadiran</SectionLabel>
              <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Apakah Anda Hadir?</h2>
              <p className="text-[10px] mt-1 font-poppins" style={{ color: T.sub }}>
                Kepada Yth. <span className="font-bold" style={{ color: T.accent }}>Tamu Undangan</span>
              </p>
            </div>

            {/* RSVP buttons */}
            <div className="flex gap-2.5 mb-4">
              {(['hadir', 'tidak'] as const).map(v => (
                <button key={v} onClick={() => setRsvp(v)}
                  className="flex-1 py-2.5 text-xs font-poppins font-bold cursor-pointer transition-all border"
                  style={rsvp === v
                    ? (themeId === 'royal-yogyakarta'
                      ? { background: T.accent, color: '#2B1B17', borderColor: T.accent, borderRadius: '0.25rem' }
                      : { background: T.accent, color: T.dark ? '#1a1a2e' : '#fff', borderColor: T.accent, boxShadow: `0 4px 20px rgba(${T.accentRgb},0.4)`, borderRadius: '9999px' })
                    : (themeId === 'royal-yogyakarta'
                      ? { background: 'transparent', color: T.accent, borderColor: T.accent, borderRadius: '0.25rem' }
                      : { background: 'transparent', color: T.accent, borderColor: `rgba(${T.accentRgb},0.4)`, borderRadius: '9999px' })
                  }>
                  {v === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir'}
                </button>
              ))}
            </div>

            {/* Wish form */}
            <AnimatePresence>
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-4 border space-y-2.5"
                  style={{
                    background: overlay,
                    borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                    borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1.25rem',
                    boxShadow: themeId === 'royal-yogyakarta' ? `0 0 0 1px ${T.accent} inset` : 'none'
                  }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest font-poppins mb-0.5" style={{ color: T.accent }}>Ucapan &amp; Doa</p>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda"
                    className="w-full bg-transparent border-b text-xs py-1.5 outline-none font-poppins"
                    style={{
                      borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.3)`,
                      color: T.text,
                      borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '0px'
                    }} />
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2}
                    placeholder="Tulis ucapan & doa untuk mempelai..."
                    className="w-full bg-transparent border text-xs p-2.5 outline-none resize-none font-poppins"
                    style={{
                      borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                      color: T.text,
                      borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '0.75rem'
                    }} />
                  <button onClick={handleSubmitWish}
                    className={`w-full py-2.5 text-xs font-poppins font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${T.btn}`}
                    style={{
                      borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '9999px',
                      boxShadow: themeId === 'royal-yogyakarta' ? 'none' : `0 4px 20px rgba(${T.accentRgb},0.3)`
                    }}>
                    <Send size={12} /> Kirim Ucapan
                  </button>
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-6 text-center border"
                  style={{
                    background: overlay,
                    borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                    borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1.25rem'
                  }}>
                  <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: T.accent }} />
                  <p className="font-serif font-bold text-sm mb-1" style={{ color: T.text }}>Terima Kasih, {name}!</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: T.sub }}>Doa dan kehadiranmu sangat berarti bagi kami.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── S5.5: WISHES FEED ─── slides over S5 on scroll */}
      <StackingSection
        id="wishes"
        zIndex={55}
        bg={T.bg3}
        pattern={T.pattern}
        borderRadius={pinned['wishes'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.08 }} />

          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <SectionLabel themeId={themeId} accent={T.accent}>Pesan Restu</SectionLabel>
              <h2 className="font-serif font-bold text-xl" style={{ color: T.text }}>Ucapan &amp; Doa</h2>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <AnimatePresence initial={false}>
                {wishes.map((w, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 border text-left flex flex-col gap-1.5"
                    style={{
                      background: overlay,
                      borderColor: themeId === 'royal-yogyakarta' ? T.accent : `rgba(${T.accentRgb},0.2)`,
                      borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1rem',
                      boxShadow: themeId === 'royal-yogyakarta' ? `0 0 0 1px ${T.accent} inset` : 'none'
                    }}>
                    <div className="flex justify-between items-center">
                      <span className="font-poppins font-bold text-xs" style={{ color: T.text }}>{w.name}</span>
                      <span className="text-[8px] px-2 py-0.5 rounded-full font-poppins font-semibold"
                        style={w.rsvp === 'hadir'
                          ? { background: `rgba(${T.accentRgb},0.15)`, color: T.accent, borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '9999px' }
                          : { background: 'rgba(0,0,0,0.06)', color: T.sub, borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '9999px' }}>
                        {w.rsvp === 'hadir' ? '✓ Hadir' : '✗ Absen'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: T.text }}>{w.msg}</p>
                    <span className="text-[8px] self-end" style={{ color: T.sub }}>{w.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* ─── FOOTER ─── */}
      <StackingSection
        id="footer"
        zIndex={60}
        bg={T.bg1}
        pattern={T.pattern}
        borderRadius={pinned['footer'] ? '0px' : `${T.rounded} ${T.rounded} 0 0`}
        borderTop={T.borderStyle}
        boxShadow={sectionShadow}
        className="py-12 text-center"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={up} className="w-full h-full flex flex-col justify-center items-center relative">
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute top-0 right-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.3, transform: 'rotate(90deg)' }} />
          <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-32 pointer-events-none select-none"
            style={{ opacity: 0.2, transform: 'rotate(270deg)' }} />
          <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.4 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `${T.bg1}CC` }} />
          
          <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col justify-between h-full py-16">
            <div /> {/* Spacer */}
            
            <div className="space-y-4">
              {themeId === 'royal-yogyakarta' ? (
                <div className="flex justify-center mb-2">
                  <GununganIcon color={T.accent} />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${T.accent})` }} />
                  <Heart size={16} fill="currentColor" style={{ color: T.accent }} />
                  <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${T.accent})` }} />
                </div>
              )}
              <SectionLabel themeId={themeId} accent={T.accent}>Terima Kasih</SectionLabel>
              <p className="text-xs leading-relaxed max-w-[280px] mx-auto" style={{ color: T.sub }}>
                Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
              </p>
              
              <div className="pt-2">
                <p className="font-serif font-bold text-xl gold-text-gradient">{coupleLabel}</p>
                <p className="font-poppins text-[10px] mt-1" style={{ color: T.sub }}>{weddingDate}</p>
              </div>
            </div>
            
            <div>
              <p className="text-[9px]" style={{ color: T.sub }}>Dibuat dengan ❤️ menggunakan <span style={{ color: T.accent }}>Ngaturi</span></p>
            </div>
          </div>
        </motion.div>
      </StackingSection>


      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setActivePhoto(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
              onClick={() => setActivePhoto(null)}>
              <X size={28} />
            </button>
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              src={activePhoto} alt="Gallery Preview" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Lightbox Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowMap(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm border overflow-hidden shadow-2xl p-4 flex flex-col gap-3"
              style={{
                background: T.bg1,
                borderColor: T.accent,
                borderRadius: themeId === 'royal-yogyakarta' ? '0.25rem' : '1rem',
              }}
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: `rgba(${T.accentRgb},0.2)` }}>
                <h3 className="font-serif font-bold text-sm" style={{ color: T.text }}>Peta Lokasi</h3>
                <button onClick={() => setShowMap(false)} className="cursor-pointer hover:opacity-75 transition-opacity" style={{ color: T.text }}>
                  <X size={18} />
                </button>
              </div>
              <div className="w-full aspect-video border overflow-hidden relative bg-black/5" style={{ borderRadius: themeId === 'royal-yogyakarta' ? '0.15rem' : '0.5rem', borderColor: `rgba(${T.accentRgb},0.2)` }}>
                <iframe
                  src={mapSrc}
                  className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 text-center text-xs font-poppins font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                style={themeId === 'royal-yogyakarta' ? {
                  background: T.accent,
                  color: '#2B1B17',
                  borderRadius: '0.25rem'
                } : {
                  background: T.accent,
                  color: T.dark ? '#1a1a2e' : '#fff',
                  borderRadius: '9999px'
                }}>
                <MapPin size={11} /> Buka Google Maps
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  )
}

export default ThemePreview
