import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, FormInput, ImageUp, SendHorizonal } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    { icon: <UserPlus className="w-6 h-6 text-gold-500" />, step: '01', title: 'Daftar & Pilih Paket', desc: 'Buat akun dalam hitungan detik dan tentukan paket fitur sesuai kebutuhan pernikahanmu.' },
    { icon: <FormInput className="w-6 h-6 text-gold-500" />, step: '02', title: 'Isi Data & Pilih Tema', desc: 'Lengkapi formulir informasi pengantin, detail acara, serta pilih desain tema favorit.' },
    { icon: <ImageUp className="w-6 h-6 text-gold-500" />, step: '03', title: 'Upload Foto & Musik', desc: 'Unggah galeri foto pre-wedding, video pertunangan, dan pilih alunan lagu romantis pengiring.' },
    { icon: <SendHorizonal className="w-6 h-6 text-gold-500" />, step: '04', title: 'Publish & Sebar', desc: 'Undangan aktif seketika. Salin link personalisasi tamu dan bagikan ke seluruh daftar kontak.' },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-cream/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-gold-200/10 rounded-full blur-2xl z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 font-poppins">Langkah Mudah</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold mt-2">Bagaimana Cara Kerjanya?</h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative flex flex-col lg:flex-row gap-8 items-stretch justify-between">
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[1.5px] border-t border-dashed border-gold-300/60 z-0" />
          {steps.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              key={i}
              className="flex-1 bg-white border border-gray-100/80 rounded-2xl p-6 shadow-xs relative z-10 flex flex-col items-center text-center hover:border-gold-300 transition-all duration-300"
            >
              <div className="absolute top-4 right-6 text-gold-400/30 font-mono text-3xl font-bold font-poppins select-none">{item.step}</div>
              <div className="w-14 h-14 bg-cream border border-sand rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0.5 bg-white rounded-full border border-sand/40" />
                <div className="relative z-10">{item.icon}</div>
              </div>
              <h3 className="font-poppins font-bold text-charcoal text-base sm:text-lg mb-3">{item.title}</h3>
              <p className="font-sans text-xs sm:text-sm text-charcoal/60 leading-relaxed max-w-[240px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
