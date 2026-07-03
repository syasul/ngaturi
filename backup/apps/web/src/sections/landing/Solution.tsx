import React from 'react'
import { motion } from 'framer-motion'
import { PenTool, Send, LayoutDashboard, Sparkles } from 'lucide-react'

export const Solution: React.FC = () => {
  const solutions = [
    {
      icon: <PenTool className="text-gold-500 w-6 h-6" />,
      title: 'Buat & Kustomisasi Instan',
      desc: 'Isi formulir detail acara, pilih musik, upload galeri foto, dan sesuaikan tema sesuka hati hanya dalam 10 menit.',
    },
    {
      icon: <Send className="text-gold-500 w-6 h-6" />,
      title: 'Sebar Cepat & Personalisasi',
      desc: 'Tulis nama tamu secara otomatis di tiap link undangan. Sebar dengan mudah via WhatsApp, Telegram, atau Email.',
    },
    {
      icon: <LayoutDashboard className="text-gold-500 w-6 h-6" />,
      title: 'Dashboard RSVP Terintegrasi',
      desc: 'Pantau kehadiran tamu secara real-time, baca ucapan doa, serta kelola QR code Check-In kehadiran tamu di lokasi.',
    },
  ]

  return (
    <section id="solution" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Solution lists */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 font-poppins">
              Solusi Kami
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mt-2 mb-6 leading-tight">
              Satu Platform, Semua Kebutuhan Beres
            </h2>
            <p className="font-sans text-charcoal/70 mb-10 leading-relaxed">
              Tinggalkan cetak undangan fisik yang mahal dan repot. Kelola seluruh persiapan sebaran
              undangan hingga buku tamu digital secara autopilot.
            </p>

            <div className="flex flex-col gap-8">
              {solutions.map((sol, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  key={i}
                  className="flex gap-4 items-start"
                >
                  <div className="p-3 bg-gold-50 border border-gold-100 rounded-xl shrink-0">
                    {sol.icon}
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-charcoal text-base sm:text-lg mb-1.5">
                      {sol.title}
                    </h3>
                    <p className="font-sans text-sm text-charcoal/60 leading-relaxed">{sol.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Premium Mockups */}
          <div className="lg:col-span-7 relative flex items-center justify-center py-8">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-100/30 rounded-full blur-2xl z-0" />

            {/* Laptop Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-full max-w-[500px] aspect-[16/10] bg-charcoal rounded-xl shadow-xl overflow-hidden border border-charcoal/80"
            >
              {/* Browser bar */}
              <div className="h-6 bg-charcoal/90 flex items-center px-3 gap-1.5 border-b border-charcoal/10">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[10px] text-gray-500 font-mono ml-4 truncate">
                  dashboard.ngaturi.id/wedding-reno-kirana
                </span>
              </div>

              {/* Browser screen mockup content */}
              <div className="bg-gray-50 h-full flex font-sans text-xs">
                {/* Sidebar */}
                <div className="w-1/4 bg-charcoal text-gray-400 p-2 flex flex-col gap-2 border-r border-gray-200">
                  <div className="h-4 bg-gray-700/50 rounded-xs mb-4" />
                  <div className="h-3 bg-gold-500/20 text-gold-500 rounded-xs px-1.5 py-0.5 font-medium flex items-center gap-1">
                    📊 Dashboard
                  </div>
                  <div className="h-3 bg-transparent rounded-xs px-1.5 py-0.5">👥 Data Tamu</div>
                  <div className="h-3 bg-transparent rounded-xs px-1.5 py-0.5">🎨 Desain Tema</div>
                  <div className="h-3 bg-transparent rounded-xs px-1.5 py-0.5">🎵 Musik</div>
                </div>

                {/* Dashboard Main Content */}
                <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-charcoal">Undangan Reno & Kirana</span>
                    <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-sm font-semibold text-[8px]">
                      AKTIF
                    </span>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2 border border-gray-100 rounded-sm shadow-2xs">
                      <span className="text-gray-400 text-[8px] block">Tamu Diundang</span>
                      <span className="text-sm font-bold text-charcoal">1,250</span>
                    </div>
                    <div className="bg-white p-2 border border-gray-100 rounded-sm shadow-2xs">
                      <span className="text-gray-400 text-[8px] block">RSVP Hadir</span>
                      <span className="text-sm font-bold text-emerald-600">842</span>
                    </div>
                    <div className="bg-white p-2 border border-gray-100 rounded-sm shadow-2xs">
                      <span className="text-gray-400 text-[8px] block">Total Ucapan</span>
                      <span className="text-sm font-bold text-gold-600">312</span>
                    </div>
                  </div>

                  {/* Mock Chart Area */}
                  <div className="flex-1 bg-white p-2 border border-gray-100 rounded-sm flex flex-col justify-between">
                    <span className="text-gray-400 text-[8px] font-semibold">
                      Statistik Kehadiran
                    </span>
                    <div className="flex gap-2.5 items-end justify-center h-16 pt-2">
                      <div className="w-6 bg-gold-200 h-[30%] rounded-t-xs" />
                      <div className="w-6 bg-gold-300 h-[55%] rounded-t-xs" />
                      <div className="w-6 bg-gold-500 h-[85%] rounded-t-xs" />
                      <div className="w-6 bg-rustic-300 h-[45%] rounded-t-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="absolute bottom-[-20px] right-2 sm:right-6 lg:right-10 z-20 w-36 sm:w-44 aspect-[9/18] bg-charcoal rounded-2xl p-1.5 shadow-2xl border border-charcoal/80 overflow-hidden"
            >
              {/* Internal phone bezel notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-charcoal rounded-full z-30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
              </div>

              {/* Screen */}
              <div className="w-full h-full bg-[#fdfcf9] rounded-xl overflow-hidden relative flex flex-col items-center justify-between py-6 px-3 border border-sand">
                {/* Mobile design mockup */}
                <div className="text-center mt-3">
                  <span className="font-handwriting text-gold-500 text-sm">The Wedding of</span>
                  <h4 className="font-serif text-sm font-bold text-charcoal mt-1">
                    Reno & Kirana
                  </h4>
                </div>

                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gold-500/10 rounded-full animate-ping" />
                  <div className="relative p-2 bg-gold-500/20 text-gold-600 rounded-full">
                    <Sparkles size={16} />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-[7px] text-charcoal/60 uppercase tracking-widest font-semibold font-poppins">
                    Kepada Yth:
                  </span>
                  <span className="text-[8px] font-bold text-charcoal bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-sm">
                    Bapak Arya Mulya
                  </span>
                  <button className="bg-gold-500 text-white font-poppins font-medium text-[8px] py-1 px-3.5 rounded-full shadow-xs mt-1 hover:bg-gold-600 transition-colors">
                    Buka Undangan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Solution
