import React, { useState } from 'react'
import { Smartphone, Eye } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import TiltCard from '../../components/ui/TiltCard'

export const Catalog: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedThemeName, setSelectedThemeName] = useState<string>('')

  const themes = [
    {
      id: 'classic-royal',
      name: 'Classic Royal',
      tag: 'PREMIUM',
      color: 'bg-slate-900 border-gold-400',
      textColor: 'text-gold-200',
      description: 'Desain royal mewah dengan aksen emas yang anggun dan latar belakang gelap elegan.',
      accent: 'gold' as const,
    },
    {
      id: 'modern-foliage',
      name: 'Modern Foliage',
      tag: 'PREMIUM',
      color: 'bg-[#f4f7f5] border-[#8fa89b]',
      textColor: 'text-[#2d4030]',
      description: 'Tampilan bersih, modern, dan minimalis berhias ilustrasi daun segar sage green.',
      accent: 'rustic' as const,
    },
    {
      id: 'rustic-autumn',
      name: 'Rustic Autumn',
      tag: 'BASIC',
      color: 'bg-[#faf6f0] border-[#d4956a]',
      textColor: 'text-[#5c3d2e]',
      description: 'Tema hangat berwarna terracotta, melambangkan kebersamaan alamiah yang bersahaja.',
      accent: 'cream' as const,
    },
  ]

  return (
    <section id="catalog" className="py-24 bg-cream/20 relative overflow-hidden">
      {/* Subtle floral watermark */}
      <img src="/assets/wedding/hero-floral.png" alt="" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 font-poppins">Desain Undangan</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold mt-2">
            Pilih Tema yang Mencerminkan Cinta Kalian
          </h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-sm sm:text-base text-charcoal/70 max-w-xl mx-auto mt-4 leading-relaxed">
            Temukan tema pilihan terbaik yang mewakili kepribadian dan nuansa hari istimewa kalian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <TiltCard key={theme.id} className="h-full">
              <Card className="flex flex-col justify-between items-start text-left h-full bg-white p-6 relative overflow-hidden" hoverable={false}>
                <div className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <Badge variant={theme.accent}>{theme.tag}</Badge>
                    <span className="text-[10px] font-bold text-charcoal/40 font-poppins">MOBILE OPTIMIZED</span>
                  </div>

                  {/* Theme preview with floral bg */}
                  <div className={`w-full aspect-[4/3] rounded-xl mb-6 flex flex-col justify-center items-center border p-4 select-none relative overflow-hidden ${theme.color}`}>
                    <img src="/assets/wedding/hero-floral.png" alt="" aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
                    <img src="/assets/wedding/ornaments.png" alt="" aria-hidden="true"
                      className="absolute top-0 right-0 w-14 opacity-30 pointer-events-none" />
                    <Smartphone className={`w-8 h-8 mb-2 opacity-50 relative z-10 ${theme.textColor}`} />
                    <span className={`font-serif text-sm font-semibold relative z-10 ${theme.textColor}`}>{theme.name}</span>
                    <span className={`text-[9px] opacity-40 uppercase tracking-widest mt-1 relative z-10 ${theme.textColor}`}>Live Template</span>
                  </div>

                  <h3 className="font-poppins font-bold text-charcoal text-lg mb-2">{theme.name}</h3>
                  <p className="font-sans text-sm text-charcoal/60 leading-relaxed mb-6">{theme.description}</p>
                </div>

                <button
                  onClick={() => { setSelectedTheme(theme.id); setSelectedThemeName(theme.name) }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 border border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white rounded-full font-poppins font-semibold text-sm transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Eye size={16} />
                  <span>Live Preview</span>
                </button>
              </Card>
            </TiltCard>
          ))}
        </div>
      </div>

      <Modal isOpen={selectedTheme !== null} onClose={() => setSelectedTheme(null)} title={`Live Preview: ${selectedThemeName}`} size="xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 min-h-[550px]">
          <div className="relative w-full max-w-[340px] aspect-[9/18] bg-charcoal rounded-3xl p-3 shadow-2xl border border-charcoal/80 overflow-hidden shrink-0">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-charcoal rounded-full z-30 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
            </div>
            {selectedTheme && (
              <iframe
                src={`/theme-preview/${selectedTheme}`}
                className="w-full h-full rounded-2xl border-0 overflow-hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                title={`${selectedThemeName} Preview`}
              />
            )}
          </div>

          <div className="flex-1 text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-500 font-poppins">Tampilan Mobile Responsive</span>
            <h3 className="font-display text-2xl font-bold text-charcoal mt-2 mb-4">Bagaimana Tamu Melihat Undanganmu</h3>
            <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed mb-6">
              Lebih dari 95% tamu undangan akan membuka link undangan digital melalui smartphone mereka.
              Desain tema kami dirancang khusus dan dioptimalkan secara presisi agar tampak sangat mewah dan pas di semua layar handphone.
            </p>
            <div className="p-4 bg-cream/50 border border-sand rounded-xl text-left flex flex-col gap-3 font-sans text-xs sm:text-sm text-charcoal/80">
              <p>✔️ Animasi transisi yang halus di browser handphone.</p>
              <p>✔️ Pengendali musik latar yang mudah dinyalakan/dimatikan.</p>
              <p>✔️ Integrasi langsung ke maps dan peta petunjuk arah lokasi.</p>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default Catalog
