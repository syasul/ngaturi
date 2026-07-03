import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Heart, Leaf, Sparkles } from 'lucide-react'
import Navbar from '../../sections/landing/Navbar'
import Footer from '../../sections/landing/Footer'

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12 border-b border-sand pb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-gold-600 mb-3">
            <Compass size={32} className="stroke-1" />
            <span className="text-xs uppercase tracking-widest font-semibold font-poppins">Misi & Cerita Kami</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 tracking-wide text-charcoal">
            Tentang Kami
          </h1>
          <p className="text-sm text-charcoal/60">Mewujudkan Undangan Pernikahan Digital Editorial Terbaik</p>
        </header>

        {/* Content */}
        <div className="space-y-12 text-charcoal/80 leading-relaxed font-poppins text-sm">
          {/* Section: Who We Are */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Seni dalam Setiap Undangan</h2>
              <p>
                Didirikan pada tahun 2026, <strong>Ngaturi</strong> lahir dari kegelisahan melihat mahalnya biaya cetak undangan kertas konvensional dan dampak sampahnya bagi lingkungan sekitar. Kami percaya bahwa transisi ke era digital tidak boleh menghilangkan rasa sakral, sopan santun, dan estetika premium dari sebuah kabar bahagia pernikahan.
              </p>
              <p>
                Nama <strong>"Ngaturi"</strong> berasal dari bahasa Jawa Kuno yang berarti *mengundang* atau *mempersembahkan secara santun*. Melalui filosofi ini, kami mendesain platform undangan pernikahan digital berasas premium editorial, memberikan kenyamanan berkarya bagi pasangan calon mempelai.
              </p>
            </div>
            <div className="bg-sand/30 border border-sand p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 h-full">
              <Sparkles size={40} className="text-gold-600 stroke-1" />
              <p className="font-serif italic text-lg text-charcoal">"Menyampaikan kabar suci dengan kemewahan digital tanpa merusak kelestarian bumi."</p>
            </div>
          </section>

          {/* Section: Core Values */}
          <section className="space-y-6 pt-8 border-t border-sand">
            <h2 className="font-serif text-2xl font-bold text-charcoal text-center">Tiga Pilar Utama Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-sand p-6 rounded-xl space-y-3 bg-white/50">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                  <Leaf size={20} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">Eco-Friendly</h3>
                <p className="text-xs text-charcoal/70">
                  Mengurangi konsumsi kertas cetak dan limbah karbon transportasi kurir pos untuk masa depan bumi yang hijau.
                </p>
              </div>

              <div className="border border-sand p-6 rounded-xl space-y-3 bg-white/50">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">High Aesthetics</h3>
                <p className="text-xs text-charcoal/70">
                  Tema premium yang dirancang khusus oleh desainer profesional demi menjaga kesakralan momentum suci pernikahan Anda.
                </p>
              </div>

              <div className="border border-sand p-6 rounded-xl space-y-3 bg-white/50">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                  <Heart size={20} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">Zero Hassle</h3>
                <p className="text-xs text-charcoal/70">
                  Fitur otomasi RSVP, navigasi maps, album musik latar, hingga sistem check-in tamu undangan terintegrasi.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Commitment */}
          <section className="space-y-4 pt-8 border-t border-sand text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-charcoal">Komitmen Kami</h2>
            <p>
              Kami terus melakukan inovasi secara konsisten demi memberikan performa web tercepat dan fitur termutakhir untuk menemani rangkaian hari bahagia pernikahan Anda. Terima kasih telah mempercayakan perayaan kebahagiaan suci Anda kepada Ngaturi.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutUs
