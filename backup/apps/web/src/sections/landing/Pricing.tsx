import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import TiltCard from '../../components/ui/TiltCard'

export const Pricing: React.FC = () => {
  const [showMatrix, setShowMatrix] = useState(false)

  const packages: {
    name: string
    price: string
    description: string
    features: string[]
    isPopular: boolean
    cta: string
    accent: 'primary' | 'secondary' | 'outline' | 'ghost'
  }[] = [
    {
      name: 'Starter',
      price: 'Rp 99.000',
      description: 'Cocok untuk pernikahan intim dan sederhana.',
      features: [
        'Masa aktif 3 bulan',
        'Pilih 1 tema basic',
        'Galeri maks 5 foto',
        'RSVP & Ucapan online',
        'Integrasi Google Maps',
        'Backsound musik standar',
        'Maks 100 nama tamu unik',
      ],
      isPopular: false,
      cta: 'Pilih Starter',
      accent: 'outline',
    },
    {
      name: 'Premium',
      price: 'Rp 199.000',
      description: 'Paket paling laris dengan fitur lengkap.',
      features: [
        'Masa aktif 1 tahun',
        'Bebas ganti semua tema premium',
        'Galeri foto & video unlimited',
        'RSVP & Ucapan online real-time',
        'Integrasi Google Maps',
        'Backsound musik custom (MP3/Link)',
        'Unlimited nama tamu unik',
        'Buku Tamu Digital (QR Code)',
        'Protokol kesehatan & angpao digital',
      ],
      isPopular: true,
      cta: 'Pilih Premium',
      accent: 'primary',
    },
    {
      name: 'Custom / WO',
      price: 'Hubungi Kami',
      description: 'Layanan eksklusif untuk WO & pernikahan besar.',
      features: [
        'Masa aktif selamanya',
        'Desain kustom eksklusif sesuai request',
        'Domain kustom (.com / .id / .wedding)',
        'Layanan input data dibantu tim admin',
        'Support prioritas 24/7 WhatsApp',
        'White label (tanpa watermark Ngaturi)',
        'Custom integrasi buku tamu fisik',
      ],
      isPopular: false,
      cta: 'Hubungi Sales',
      accent: 'secondary',
    },
  ]

  const comparisonMatrix = [
    { feature: 'Masa Aktif', starter: '3 Bulan', premium: '1 Tahun', custom: 'Selamanya' },
    { feature: 'Pilihan Tema', starter: '1 Tema Basic', premium: 'Semua Tema', custom: 'Desain Kustom' },
    { feature: 'Jumlah Foto', starter: 'Maks 5 Foto', premium: 'Unlimited', custom: 'Unlimited' },
    { feature: 'Nama Tamu Unik', starter: 'Maks 100', premium: 'Unlimited', custom: 'Unlimited' },
    { feature: 'RSVP & Ucapan', starter: true, premium: true, custom: true },
    { feature: 'Backsound Musik', starter: 'Standar', premium: 'Custom MP3/Link', custom: 'Custom MP3/Link' },
    { feature: 'Buku Tamu (QR Code)', starter: false, premium: true, custom: true },
    { feature: 'Angpao Digital & Kado', starter: false, premium: true, custom: true },
    { feature: 'Hapus Watermark', starter: false, premium: false, custom: true },
    { feature: 'Custom Domain', starter: false, premium: false, custom: true },
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 font-poppins">
            Paket Investasi
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold mt-2">
            Investasi Sekali, Kenangan Selamanya
          </h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {packages.map((pkg, i) => (
            <TiltCard key={i} className="h-full flex w-full">
              <Card
                hoverable={false}
                className={`w-full flex flex-col justify-between p-8 bg-white relative rounded-3xl ${
                  pkg.isPopular ? 'border-2 border-gold-500 shadow-lg' : 'border border-gray-100'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <Badge variant="gold" className="px-4 py-1 font-bold shadow-xs">
                      ⭐ Terpopuler
                    </Badge>
                  </div>
                )}

                <div className="text-left mb-8">
                  <h3 className="font-poppins font-bold text-charcoal text-xl mb-2">{pkg.name}</h3>
                  <p className="font-sans text-xs text-charcoal/50 leading-relaxed mb-6">
                    {pkg.description}
                  </p>
                  <div className="flex items-baseline text-charcoal">
                    <span className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {pkg.price}
                    </span>
                    {pkg.price !== 'Hubungi Kami' && (
                      <span className="font-sans text-xs text-charcoal/50 ml-1">/sekali bayar</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="flex-1 flex flex-col justify-between">
                  <ul className="flex flex-col gap-3 text-left mb-8 font-sans text-sm text-charcoal/70">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <Check size={16} className="text-gold-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={pkg.accent}
                    size="md"
                    className="w-full font-semibold font-poppins"
                  >
                    {pkg.cta}
                  </Button>
                </div>
              </Card>
            </TiltCard>
          ))}
        </div>

        {/* Feature Comparison Matrix Toggle */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal/10 rounded-full font-poppins font-semibold text-sm text-charcoal/80 hover:text-gold-600 hover:border-gold-300 transition-all cursor-pointer"
          >
            <span>{showMatrix ? 'Sembunyikan Perbandingan' : 'Lihat Perbandingan Lengkap'}</span>
            {showMatrix ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showMatrix && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full max-w-4xl overflow-hidden mt-8 border border-gray-100 rounded-2xl shadow-xs"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs sm:text-sm text-charcoal border-collapse bg-white">
                    <thead>
                      <tr className="bg-cream/40 border-b border-gray-100 font-poppins font-semibold">
                        <th className="p-4 sm:p-5">Fitur Lengkap</th>
                        <th className="p-4 sm:p-5 text-center">Starter</th>
                        <th className="p-4 sm:p-5 text-center text-gold-600 font-bold">Premium</th>
                        <th className="p-4 sm:p-5 text-center">Custom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonMatrix.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-50 hover:bg-cream/10 transition-colors"
                        >
                          <td className="p-4 sm:p-5 font-medium">{row.feature}</td>

                          {/* Starter cell */}
                          <td className="p-4 sm:p-5 text-center text-charcoal/70">
                            {typeof row.starter === 'boolean' ? (
                              row.starter ? (
                                <Check size={16} className="text-gold-500 mx-auto" />
                              ) : (
                                <X size={16} className="text-red-400 mx-auto" />
                              )
                            ) : (
                              row.starter
                            )}
                          </td>

                          {/* Premium cell */}
                          <td className="p-4 sm:p-5 text-center text-gold-600 font-semibold bg-gold-50/10">
                            {typeof row.premium === 'boolean' ? (
                              row.premium ? (
                                <Check size={16} className="text-gold-500 mx-auto" />
                              ) : (
                                <X size={16} className="text-red-400 mx-auto" />
                              )
                            ) : (
                              row.premium
                            )}
                          </td>

                          {/* Custom cell */}
                          <td className="p-4 sm:p-5 text-center text-charcoal/70">
                            {typeof row.custom === 'boolean' ? (
                              row.custom ? (
                                <Check size={16} className="text-gold-500 mx-auto" />
                              ) : (
                                <X size={16} className="text-red-400 mx-auto" />
                              )
                            ) : (
                              row.custom
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Pricing
