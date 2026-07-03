import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, Clock, FileWarning, Leaf } from 'lucide-react'
import Card from '../../components/ui/Card'

export const Problem: React.FC = () => {
  const problems = [
    {
      icon: <Landmark className="text-red-600 w-8 h-8" />,
      title: 'Biaya Cetak Selangit',
      desc: 'Cetak fisik mahal, wajib minimal order ratusan lembar, belum termasuk ongkir ke luar kota.',
    },
    {
      icon: <Clock className="text-amber-600 w-8 h-8" />,
      title: 'Buang Waktu & Energi',
      desc: 'Menulis alamat, menempel label, dan mengirimkan pesan WhatsApp satu-per-satu memakan waktu berhari-hari.',
    },
    {
      icon: <FileWarning className="text-orange-600 w-8 h-8" />,
      title: 'Salah Tulis & Cetak Ulang',
      desc: 'Ada typo nama tamu atau jadwal berubah? Undangan fisik terlanjur tercetak terpaksa dibuang.',
    },
    {
      icon: <Leaf className="text-emerald-600 w-8 h-8" />,
      title: 'Kurang Ramah Lingkungan',
      desc: 'Kertas sisa undangan fisik akan menjadi tumpukan sampah setelah acara selesai.',
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80 } },
  }

  return (
    <section id="problem" className="relative pt-24 pb-32 bg-cream/30">
      {/* Decorative ornament watermark */}
      <img src="/assets/wedding/ornaments.png" alt="" aria-hidden="true"
        className="absolute top-4 right-4 w-48 opacity-[0.06] pointer-events-none select-none rotate-90" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-rustic-600 font-poppins">Tantangan & Masalah</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold mt-2">Masih Pakai Cara Lama?</h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
        >
          {problems.map((prob, i) => (
            <motion.div key={i} variants={cardVariants}
              whileHover={{ rotate: [0, -2, 2, -2, 2, 0], transition: { duration: 0.35 } }}>
              <Card className="h-full flex flex-col items-start p-8 hover:border-red-200 bg-white">
                <div className="p-3 bg-cream rounded-xl mb-6">{prob.icon}</div>
                <h3 className="font-poppins font-semibold text-charcoal text-lg mb-3">{prob.title}</h3>
                <p className="font-sans text-sm text-charcoal/70 leading-relaxed">{prob.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Original wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none select-none z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] text-white fill-current">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
        </svg>
      </div>
    </section>
  )
}

export default Problem
