import React from 'react'
import { motion } from 'framer-motion'
import { MailCheck, Map, Image, Music, Link, QrCode } from 'lucide-react'
import Card from '../../components/ui/Card'

export const Features: React.FC = () => {
  const features = [
    {
      icon: <MailCheck className="text-gold-600 w-7 h-7" />,
      title: 'RSVP Otomatis',
      desc: 'Tamu melakukan konfirmasi kehadiran secara online and datanya langsung tercatat di dashboard.',
    },
    {
      icon: <Map className="text-gold-600 w-7 h-7" />,
      title: 'Integrasi Google Maps',
      desc: 'Peta penunjuk lokasi akad dan resepsi yang akurat, membantu tamu menemukan rute terbaik.',
    },
    {
      icon: <Image className="text-gold-600 w-7 h-7" />,
      title: 'Galeri Foto & Video',
      desc: 'Tampilkan kolase foto pre-wedding dan video momen bahagia kalian berdua dengan transisi elegan.',
    },
    {
      icon: <Music className="text-gold-600 w-7 h-7" />,
      title: 'Backsound Musik',
      desc: 'Sambut kunjungan tamu undangan dengan alunan lagu romantis pilihan yang dapat diaktifkan otomatis.',
    },
    {
      icon: <Link className="text-gold-600 w-7 h-7" />,
      title: 'Link Unik per Tamu',
      desc: 'Kirim link personalisasi sehingga nama masing-masing tamu secara eksklusif muncul di undangan.',
    },
    {
      icon: <QrCode className="text-gold-600 w-7 h-7" />,
      title: 'QR Code Kehadiran',
      desc: 'Gunakan scan QR code di lokasi resepsi untuk check-in kehadiran tamu secara praktis dan modern.',
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  }

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 font-poppins">
            Fitur Unggulan
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold mt-2">
            Semua yang Kamu Butuhkan, Sudah Ada
          </h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
        >
          {features.map((feat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full bg-cream/15 hover:bg-white border-gray-100 hover:border-gold-200 p-8 flex gap-5 items-start">
                <div className="p-3 bg-white border border-sand rounded-2xl shadow-xs shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-charcoal text-base sm:text-lg mb-2">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-sm text-charcoal/65 leading-relaxed">{feat.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
