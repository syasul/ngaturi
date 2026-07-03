import React from 'react'
import { Star } from 'lucide-react'
import Card from '../../components/ui/Card'

export const Testimonials: React.FC = () => {
  const reviews = [
    { couple: 'Adit & Salsa', city: 'Jakarta', text: 'Sangat terbantu! Fitur RSVP real-time membantu kami menghitung jumlah porsi katering dengan akurat.' },
    { couple: 'Bagas & Dini', city: 'Surabaya', text: 'Temanya sangat premium. Banyak teman dan kerabat memuji undangan kami sangat elegan dan berkelas.' },
    { couple: 'Rian & Putri', city: 'Bandung', text: 'Bikinnya gampang sekali cuma 10 menit. Fitur QR Code kehadiran bikin meja registrasi rapi tanpa antrean.' },
    { couple: 'Genta & Rere', city: 'Yogyakarta', text: 'Hemat jutaan rupiah dibanding cetak undangan fisik ratusan lembar. Fitur kirim nama unik otomatis luar biasa.' },
    { couple: 'Fahmi & Alya', city: 'Malang', text: 'Alternatif pernikahan go-green ramah lingkungan tanpa menghasilkan tumpukan sampah kertas bekas undangan.' },
    { couple: 'Riza & Mita', city: 'Semarang', text: 'Customer Service-nya luar biasa cepat menanggapi pertanyaan. Sangat direkomendasikan untuk pasangan sibuk!' },
  ]

  const doubleReviews = [...reviews, ...reviews]

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 font-poppins">Ulasan Pengguna</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold mt-2">Sudah Dipercaya Ribuan Pasangan</h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
        </div>
      </div>

      <div className="relative w-full flex items-center overflow-hidden py-4 select-none">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
          {doubleReviews.map((rev, i) => (
            <Card key={i} hoverable={false} className="w-[280px] sm:w-[350px] shrink-0 border border-gray-100 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={14} className="fill-current" />)}
                </div>
                <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed italic mb-6">"{rev.text}"</p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                <div className="w-10 h-10 bg-gold-50 border border-gold-100 rounded-full flex items-center justify-center font-serif text-sm font-bold text-gold-600">{rev.couple.charAt(0)}</div>
                <div>
                  <h4 className="font-poppins font-bold text-sm text-charcoal">{rev.couple}</h4>
                  <span className="text-xs text-charcoal/40 font-sans">{rev.city}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
