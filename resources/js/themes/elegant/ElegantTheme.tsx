import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, MapPin, Clock, ChevronDown, Send, Mic2 } from 'lucide-react'
import type { WeddingData } from '@wedding/shared'
import type { Variants } from 'framer-motion'
import CountdownTimer from '../reusable/CountdownTimer'
import RSVPForm from '../reusable/RSVPForm'
import GuestWishes from '../reusable/GuestWishes'
import PhotoGallery from '../reusable/PhotoGallery'
import MapEmbed from '../reusable/MapEmbed'
import StackingSection from '../reusable/StackingSection'

export interface ThemeProps {
  data: WeddingData | any
  weddingId: string
  photos?: any[]
  guestName?: string
  guestToken?: string
  wishes: any[]
  onRsvpSubmit: (rsvpStatus: string, message: string) => Promise<void>
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const childFadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as any },
  },
}

const childScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' as any },
  },
}

export const ElegantTheme: React.FC<ThemeProps> = ({
  data, weddingId, photos = [], guestName, guestToken, wishes, onRsvpSubmit,
}) => {
  const groom = data?.groom || {}
  const bride = data?.bride || {}
  const schedules = data?.schedules || {}
  const stories = data?.stories || []
  const quotes = data?.quotes || {}

  const formatDate = (d?: string) => d
    ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '-'

  const getParents = (p: any) => p.fatherName && p.motherName
    ? `Putra/i dari Bpk. ${p.fatherName} & Ibu ${p.motherName}`
    : (p.parents || '')

  return (
    <div className="relative bg-[#FAF7F2] text-[#2C2C2C] font-sans select-none">

      {/* ═══════════════════════ SECTION 1: COVER / HERO ═══════════════════════ */}
      <StackingSection
        id="hero"
        zIndex={10}
        bg="#FAF7F2"
        roundedVal="0px"
      >
        {/* Hero floral background */}
        <img
          src="/assets/wedding/hero-floral.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/20 via-[#FAF7F2]/10 to-[#FAF7F2]/60 pointer-events-none" />

        <motion.div
          className="relative z-10 px-6 py-24 space-y-5"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.span variants={childFadeUp} className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] font-bold block">
            Walimatul Ursy
          </motion.span>
          <motion.div variants={childFadeUp} className="w-10 h-px bg-[#C9A84C]/60 mx-auto" />
          <motion.h1 variants={childFadeUp} className="text-5xl md:text-6xl font-serif font-bold text-[#2C2C2C] leading-tight">
            {groom.nickname || groom.name || 'Reza'}
            <span className="block text-[#C9A84C] font-light text-4xl py-2">&</span>
            {bride.nickname || bride.name || 'Salsabila'}
          </motion.h1>
          <motion.div variants={childFadeUp} className="w-20 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto" />
          <motion.p variants={childFadeUp} className="text-xs italic text-[#2C2C2C]/60 max-w-xs mx-auto font-serif leading-relaxed">
            "{quotes.text || 'Dan Kami menciptakan kamu berpasang-pasangan'}"
          </motion.p>
          {schedules.akad?.date && (
            <motion.p variants={childFadeUp} className="text-sm font-bold text-[#C9A84C] mt-4 tracking-wide">
              {formatDate(schedules.akad.date)}
            </motion.p>
          )}
          <motion.div
            variants={childFadeUp}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-8 text-[#C9A84C]/70"
          >
            <ChevronDown size={24} className="mx-auto" />
          </motion.div>
        </motion.div>
      </StackingSection>

      {/* ═══════════════════════ SECTION 2: COUNTDOWN ═══════════════════════ */}
      <StackingSection
        id="countdown"
        zIndex={20}
        bg="#ffffff"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        {/* Ornament top-right */}
        <img
          src="/assets/wedding/ornaments.png"
          alt=""
          className="absolute top-0 right-0 w-44 opacity-20 pointer-events-none"
          style={{ transform: 'rotate(90deg)' }}
        />

        <motion.div
          className="max-w-xl mx-auto px-6 text-center space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <motion.span variants={childFadeUp} className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold block">
            Menghitung Hari Bahagia
          </motion.span>
          <motion.div variants={childFadeUp} className="w-8 h-px bg-[#C9A84C]/50 mx-auto" />
          {schedules.akad?.date && (
            <motion.div variants={childScaleIn}>
              <CountdownTimer targetDate={schedules.akad.date} />
            </motion.div>
          )}
        </motion.div>
      </StackingSection>

      {/* ═══════════════════════ SECTION 3: COUPLE ═══════════════════════ */}
      <StackingSection
        id="couple"
        zIndex={30}
        bg="#FAF7F2"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          className="max-w-2xl mx-auto px-6 space-y-10 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Mempelai</span>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mt-2">Dua Jiwa, Satu Ikatan</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { person: groom, label: 'Mempelai Pria' },
              { person: bride, label: 'Mempelai Wanita' },
            ].map(({ person, label }, i) => (
              <motion.div
                key={i}
                variants={childScaleIn}
              >
                <div className="bg-white/80 backdrop-blur border border-[#C9A84C]/20 rounded-3xl p-7 text-center space-y-4 shadow-sm hover:shadow-lg transition-shadow">
                  <span className="text-[9px] uppercase tracking-widest text-[#C9A84C] font-bold">{label}</span>

                  {/* Avatar */}
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#C9A84C]/30 shadow-inner bg-[#FAF7F2] p-1">
                    {person.photoUrl || person.photo ? (
                      <img src={person.photoUrl || person.photo} alt={person.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-3xl font-serif font-bold text-[#C9A84C]">
                        {(person.nickname || person.name)?.[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">{person.fullName || person.name}</h3>
                    <p className="text-[10px] text-[#2C2C2C]/50 mt-1">{getParents(person)}</p>
                  </div>

                  {person.instagram && (
                    <a
                      href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] font-semibold hover:underline"
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      {person.instagram}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Heart divider center */}
          <motion.div className="flex items-center gap-4" variants={childFadeUp}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/30" />
            <Heart size={18} className="text-[#C9A84C] fill-[#C9A84C]/20" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/30" />
          </motion.div>
        </motion.div>
      </StackingSection>

      {/* ═══════════════════════ SECTION 4: SCHEDULE ═══════════════════════ */}
      <StackingSection
        id="schedule"
        zIndex={40}
        bg="#2C2C2C"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.35), 0 -4px 12px rgba(0, 0, 0, 0.15)"
        className="text-[#FAF7F2]"
      >
        {/* Ornament watermark bg */}
        <img
          src="/assets/wedding/ornaments.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-[0.04] pointer-events-none"
        />

        <motion.div
          className="max-w-2xl mx-auto px-6 space-y-10 relative z-10 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Rangkaian Acara</span>
            <h2 className="text-2xl font-serif font-bold text-[#FAF7F2] mt-2">Jadwal & Lokasi</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { key: 'akad', label: 'Akad Nikah', sched: schedules.akad },
              { key: 'resepsi', label: 'Resepsi Pernikahan', sched: schedules.resepsi },
            ].filter(s => s.sched).map(({ label, sched }, i) => (
              <motion.div
                key={i}
                variants={childScaleIn}
              >
                <div className="bg-white/5 border border-[#C9A84C]/20 rounded-3xl p-6 space-y-4 backdrop-blur animate-none">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#C9A84C]/15">
                    <Calendar size={18} className="text-[#C9A84C]" />
                    <h3 className="font-serif font-bold text-[#FAF7F2]">{label}</h3>
                  </div>
                  <div className="space-y-2 text-xs text-[#FAF7F2]/70">
                    <div className="flex items-start gap-2">
                      <Calendar size={12} className="text-[#C9A84C] mt-0.5 shrink-0" />
                      <span>{formatDate(sched?.date)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock size={12} className="text-[#C9A84C] mt-0.5 shrink-0" />
                      <span>{sched?.timeStart} – {sched?.timeEnd || 'Selesai'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={12} className="text-[#C9A84C] mt-0.5 shrink-0" />
                      <span>{sched?.placeName}, {sched?.address}</span>
                    </div>
                  </div>
                  <MapEmbed url={sched?.googleMapsUrl} placeName={sched?.placeName} address={sched?.address} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </StackingSection>

      {/* ═══════════════════════ SECTION 5: LOVE STORY ═══════════════════════ */}
      {stories.length > 0 && (
        <StackingSection
          id="story"
          zIndex={50}
          bg="#FAF7F2"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            className="max-w-xl mx-auto px-6 space-y-10 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
          >
            <motion.div className="text-center" variants={childFadeUp}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Perjalanan Cinta</span>
              <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mt-2">Cerita Kita</h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3" />
            </motion.div>

            <div className="relative border-l border-[#C9A84C]/30 ml-4 pl-8 space-y-10">
              {stories.map((story: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={childFadeUp}
                  className="relative"
                >
                  <div className="absolute -left-[37px] top-1 w-5 h-5 rounded-full border-2 border-[#C9A84C] bg-[#FAF7F2] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                  </div>
                  <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold px-2 py-0.5 rounded">{story.date}</span>
                  <h4 className="font-serif font-bold text-sm text-[#2C2C2C] mt-1">{story.title}</h4>
                  <p className="text-xs text-[#2C2C2C]/60 leading-relaxed mt-1">{story.content}</p>
                  {story.imageUrl && (
                    <img src={story.imageUrl} alt={story.title} className="w-full max-h-48 object-cover rounded-xl mt-3 border border-[#C9A84C]/10" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </StackingSection>
      )}

      {/* ═══════════════════════ SECTION 6: GALLERY ═══════════════════════ */}
      {photos.length > 0 && (
        <StackingSection
          id="gallery"
          zIndex={60}
          bg="#ffffff"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            className="max-w-2xl mx-auto px-6 space-y-8 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
          >
            <motion.div className="text-center" variants={childFadeUp}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Kenangan Indah</span>
              <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mt-2">Galeri Foto</h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3" />
            </motion.div>
            <motion.div variants={childScaleIn}>
              <PhotoGallery photos={photos} />
            </motion.div>
          </motion.div>
        </StackingSection>
      )}

      {/* ═══════════════════════ SECTION 7: RSVP ═══════════════════════ */}
      <StackingSection
        id="rsvp"
        zIndex={70}
        bg="#FAF7F2"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <img src="/assets/wedding/ornaments.png" alt="" className="absolute bottom-0 left-0 w-44 opacity-10 pointer-events-none" style={{ transform: 'rotate(-90deg)' }} />

        <motion.div
          className="max-w-lg mx-auto px-6 space-y-8 w-full relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Konfirmasi Kehadiran</span>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mt-2">Apakah Anda Hadir?</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3" />
            {guestName && (
              <p className="text-sm text-[#2C2C2C]/60 mt-4">
                Kepada Yth. <span className="text-[#C9A84C] font-bold">{guestName}</span>
              </p>
            )}
          </motion.div>

          <motion.div variants={childScaleIn}>
            <RSVPForm guestName={guestName} guestToken={guestToken} onRsvpSubmit={onRsvpSubmit} initialStatus="hadir" />
          </motion.div>
        </motion.div>
      </StackingSection>

      {/* ═══════════════════════ SECTION 8: WISHES / GUESTBOOK ═══════════════════════ */}
      <StackingSection
        id="wishes"
        zIndex={80}
        bg="#ffffff"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          className="max-w-lg mx-auto px-6 space-y-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Buku Tamu</span>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mt-2">Ucapan & Doa</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-3" />
          </motion.div>
          <motion.div variants={childFadeUp}>
            <GuestWishes initialWishes={wishes} weddingId={weddingId} />
          </motion.div>
        </motion.div>
      </StackingSection>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <StackingSection
        id="footer"
        zIndex={90}
        bg="#FAF7F2"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <img src="/assets/wedding/hero-floral.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
        <motion.div
          className="relative z-10 space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={childFadeUp}>
            <Heart size={20} className="mx-auto text-[#C9A84C] fill-[#C9A84C]/30" />
          </motion.div>
          <motion.p variants={childFadeUp} className="font-serif font-bold text-lg text-[#2C2C2C]">
            {groom.nickname || groom.name} & {bride.nickname || bride.name}
          </motion.p>
          <motion.p variants={childFadeUp} className="text-xs text-[#2C2C2C]/40">Dibuat dengan ❤️ menggunakan Ngaturi</motion.p>
        </motion.div>
      </StackingSection>
    </div>
  )
}

export default ElegantTheme
