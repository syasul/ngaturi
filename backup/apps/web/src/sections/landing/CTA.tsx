import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export const CTA: React.FC = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-[#252320] to-[#121110] text-white">
      {/* Background elegant golden radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        {/* Heart/Sparkles ornament */}
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
          <Sparkles className="text-gold-300 w-5 h-5 animate-pulse" />
        </div>

        {/* Headline */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
          Hari Spesial Kalian
          <br />
          Layak Dirayakan dengan Indah
        </h2>

        {/* Sub-text */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-[#e2cca6]/80 max-w-xl leading-relaxed mb-10">
          Buat draft undangan digital secara gratis sekarang. Desain sesuka hati dan pilih paket pembayaran
          setelah Anda benar-benar puas dengan hasilnya.
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white hover:bg-gold-100 text-charcoal font-bold font-poppins px-10 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-sm sm:text-base z-10 relative"
        >
          Mulai Gratis Sekarang
        </motion.button>

        <span className="text-[10px] sm:text-xs text-[#e2cca6]/55 uppercase tracking-widest font-semibold font-poppins mt-5">
          Tanpa biaya setup awal · Batalkan kapan saja
        </span>
      </div>
    </section>
  )
}

export default CTA
