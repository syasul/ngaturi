import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, Heart, Calendar } from 'lucide-react'
import Button from '../../components/ui/Button'
import TiltCard from '../../components/ui/TiltCard'

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-radial from-gold-50/40 via-white to-gold-50/10"
    >
      {/* Background elegant grid or shapes */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-gold-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-rustic-200/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Botanical Ornaments */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 left-8 sm:left-16 lg:left-24 z-10 text-gold-300/40 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none select-none"
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M50 0C50 30 20 45 0 50C20 55 50 70 50 100C50 70 80 55 100 50C80 45 50 30 50 0Z" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-28 right-8 sm:right-16 lg:right-24 z-10 text-gold-300/40 w-20 h-20 lg:w-28 lg:h-28 pointer-events-none select-none"
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M30 10C50 10 70 30 80 50C60 70 40 70 20 50C25 40 25 20 30 10Z M60 20C75 35 75 55 60 70" />
        </svg>
      </motion.div>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-6 z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Sub-badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-600 font-poppins text-xs font-semibold tracking-wider uppercase mb-8"
          >
            <span>✨</span> Platform Undangan Autopilot
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-bold leading-tight tracking-tight mb-6"
          >
            Undangan Pernikahan Digital,
            <br />
            <span className="text-gold-500 font-serif italic font-normal">Elegan & Siap Kirim</span>
            <br />
            dalam 10 Menit
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-base sm:text-lg md:text-xl text-charcoal/70 max-w-xl leading-relaxed mb-10"
          >
            Buat website undangan pernikahan premium kamu sendiri dengan mudah, cepat, dan otomatis.
            Bagikan momen bahagia kepada tamu dengan satu sentuhan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button size="lg" variant="primary" className="w-full sm:w-auto px-10">
              Buat Undangan Sekarang
            </Button>
            <a
              href="#catalog"
              className="w-full sm:w-auto px-10 py-3.5 border border-charcoal/10 hover:border-gold-500 rounded-full font-poppins font-medium text-charcoal hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300 text-center"
            >
              Lihat Contoh
            </a>
          </motion.div>
        </div>

        {/* Right Side: 3D Elegant Card Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 35 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="lg:col-span-5 flex items-center justify-center relative min-h-[460px] w-full mt-10 lg:mt-0"
        >
          {/* Decorative radial gold glow behind stack */}
          <div className="absolute inset-0 bg-gold-200/10 rounded-full blur-3xl z-0 pointer-events-none scale-75" />

          <TiltCard className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/14] cursor-grab active:cursor-grabbing z-10">
            {/* Card 1: Back (Classic Royal Dark Theme Mock) */}
            <div className="absolute inset-0 bg-slate-900 border border-gold-500/30 rounded-3xl shadow-xl -rotate-6 -translate-x-6 translate-y-4 opacity-50 p-6 flex flex-col justify-between text-gold-200/60 pointer-events-none select-none">
              <div className="flex justify-between items-start">
                <span className="font-serif italic text-xs">Royal Theme</span>
                <Heart size={14} className="fill-current" />
              </div>
              <div className="text-center my-auto">
                <h4 className="font-serif text-lg font-bold">R & K</h4>
              </div>
              <div className="border-t border-gold-500/20 pt-3 text-[9px] text-center font-mono">
                NGATURI.ID
              </div>
            </div>

            {/* Card 2: Middle (Modern Foliage Sage Green Mock) */}
            <div className="absolute inset-0 bg-[#eef3f0] border border-[#8fa89b]/40 rounded-3xl shadow-xl rotate-4 translate-x-4 -translate-y-2 opacity-85 p-6 flex flex-col justify-between text-[#2d4030]/70 pointer-events-none select-none">
              <div className="flex justify-between items-start">
                <span className="font-sans text-[10px] font-semibold tracking-wider">Foliage Theme</span>
                <Sparkles size={14} className="text-[#5b7a68]" />
              </div>
              <div className="text-center my-auto">
                <span className="font-serif italic text-xs">The Wedding of</span>
                <h4 className="font-display text-base font-bold mt-1">Reno & Kirana</h4>
              </div>
              <div className="border-t border-[#8fa89b]/20 pt-3 text-[9px] text-center font-mono">
                12.10.2026
              </div>
            </div>

            {/* Card 3: Front (Classic Warm Cream Mock) */}
            <div className="absolute inset-0 bg-white border border-gold-300/40 rounded-3xl shadow-2xl rotate-0 p-6 flex flex-col justify-between text-charcoal hover:border-gold-400 transition-colors duration-300 select-none">
              {/* Card Header */}
              <div className="flex justify-between items-center text-[10px] text-gold-600 font-semibold tracking-widest font-poppins uppercase">
                <span>Save The Date</span>
                <Calendar size={12} className="text-gold-500" />
              </div>

              {/* Card Body */}
              <div className="text-center my-auto flex flex-col items-center">
                {/* Elegant Crest Ornament */}
                <div className="w-10 h-10 border border-gold-300 rounded-full flex items-center justify-center mb-4 text-gold-500/80 bg-gold-50/20">
                  <span className="font-serif font-bold text-xs italic">R</span>
                </div>
                
                <span className="font-serif italic text-xs text-charcoal/50">The Wedding of</span>
                <h4 className="font-serif text-xl font-bold text-gold-600 mt-1.5 mb-1 tracking-wide">
                  Reno & Kirana
                </h4>
                <p className="font-sans text-[10px] text-charcoal/40 uppercase tracking-widest mt-1">
                  Jakarta, Indonesia
                </p>
              </div>

              {/* Card Footer */}
              <div className="border-t border-gray-100 pt-4 flex flex-col items-center">
                <div className="w-full py-2 bg-gold-500 text-white font-poppins font-medium text-[10px] rounded-full shadow-xs text-center uppercase tracking-widest">
                  Buka Undangan
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Scroll indicator bouncing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-charcoal/50 select-none cursor-pointer"
        onClick={() => {
          document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span className="text-xs uppercase tracking-widest font-poppins font-semibold">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
