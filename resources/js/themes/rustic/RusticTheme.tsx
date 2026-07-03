import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar } from 'lucide-react'
import type { WeddingData } from '@wedding/shared'
import type { Variants } from 'framer-motion'
import Card from '../../components/ui/Card'
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
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
}

const childFadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as any },
  },
}

const childScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' as any },
  },
}

export const RusticTheme: React.FC<ThemeProps> = ({
  data,
  weddingId,
  photos = [],
  guestName,
  guestToken,
  wishes,
  onRsvpSubmit,
}) => {
  const groom = data?.groom || {}
  const bride = data?.bride || {}
  const schedules = data?.schedules || data?.schedule || {}
  const stories = data?.stories || []
  const quotes = data?.quotes || {}

  const getParents = (person: any) => {
    if (person.fatherName && person.motherName) {
      return `Putra dari Bpk. ${person.fatherName} & Ibu ${person.motherName}`
    }
    return person.parents || ''
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="relative bg-[#F5EDE3] text-[#3D352E] font-sans select-none">

      {/* Section 1: Hero Header */}
      <StackingSection
        id="hero"
        zIndex={10}
        bg="#F5EDE3"
        roundedVal="0px"
      >
        {/* Leaves ornament top-left */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-[url('/ornaments/rustic-leaves-left.png')] bg-contain bg-no-repeat opacity-15 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 text-center space-y-6 relative z-10"
        >
          <motion.div variants={childScaleIn} className="w-10 h-10 rounded-full bg-[#8B6914]/10 flex items-center justify-center mx-auto text-[#8B6914] animate-pulse">
            <Heart size={18} className="fill-[#8B6914]/10" />
          </motion.div>
          <motion.span variants={childFadeUp} className="text-[10px] uppercase font-bold tracking-widest text-[#D4956A] block">
            Pernikahan Rustic Bohemian
          </motion.span>
          <motion.h1 variants={childFadeUp} className="text-5xl md:text-6xl font-cursive font-bold text-[#8B6914]">
            {groom.nickname || groom.name} & {bride.nickname || bride.name}
          </motion.h1>
          <motion.div variants={childFadeUp} className="w-16 h-0.5 bg-[#D4956A]/60 mx-auto" />
          <motion.p variants={childFadeUp} className="text-xs text-[#3D352E]/70 max-w-md mx-auto italic leading-relaxed font-sans px-4">
            "{quotes.text || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...'}"
            {quotes.source && <span className="block mt-1 font-bold text-[#8B6914] not-italic">— {quotes.source}</span>}
          </motion.p>
        </motion.div>
      </StackingSection>

      {/* Section 2: Countdown */}
      {schedules.akad?.date && (
        <StackingSection
          id="countdown"
          zIndex={20}
          bg="#FAF6F0"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="w-full max-w-2xl mx-auto px-6 py-12 text-center"
          >
            <motion.span variants={childFadeUp} className="text-[9px] uppercase font-bold tracking-widest text-[#8B6914]">
              Menuju Hari Istimewa
            </motion.span>
            <motion.div variants={childScaleIn} className="mt-4">
              <CountdownTimer targetDate={schedules.akad.date} />
            </motion.div>
          </motion.div>
        </StackingSection>
      )}

      {/* Section 3: Mempelai */}
      <StackingSection
        id="couple"
        zIndex={30}
        bg="#F5EDE3"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8"
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Mempelai Kami</h3>
            <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Groom Card */}
            <motion.div variants={childScaleIn}>
              <Card className="p-6 border border-[#D4956A]/30 bg-[#FAF6F0]/90 rounded-3xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-28 h-28 rounded-full bg-[#FAF6F0] mx-auto overflow-hidden border-2 border-[#D4956A]/40 p-1">
                  {groom.photoUrl || groom.photo ? (
                    <img
                      src={groom.photoUrl || groom.photo}
                      alt={groom.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D4956A]/10 flex items-center justify-center font-cursive text-4xl font-bold text-[#8B6914] rounded-full">
                      {(groom.nickname || groom.name)?.[0]}
                    </div>
                  )}
                </div>
                <h4 className="font-cursive font-bold text-2xl text-[#8B6914]">
                  {groom.fullName || groom.name}
                </h4>
                <p className="text-[10px] text-charcoal/50 font-bold">{getParents(groom)}</p>
                {groom.bio && (
                  <p className="text-xs text-[#3D352E]/70 leading-relaxed italic">
                    "{groom.bio}"
                  </p>
                )}
                {groom.instagram && (
                  <a
                    href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#8B6914] font-bold hover:underline"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>{groom.instagram}</span>
                  </a>
                )}
              </Card>
            </motion.div>

            {/* Bride Card */}
            <motion.div variants={childScaleIn}>
              <Card className="p-6 border border-[#D4956A]/30 bg-[#FAF6F0]/90 rounded-3xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-28 h-28 rounded-full bg-[#FAF6F0] mx-auto overflow-hidden border-2 border-[#D4956A]/40 p-1">
                  {bride.photoUrl || bride.photo ? (
                    <img
                      src={bride.photoUrl || bride.photo}
                      alt={bride.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D4956A]/10 flex items-center justify-center font-cursive text-4xl font-bold text-[#8B6914] rounded-full">
                      {(bride.nickname || bride.name)?.[0]}
                    </div>
                  )}
                </div>
                <h4 className="font-cursive font-bold text-2xl text-[#8B6914]">
                  {bride.fullName || bride.name}
                </h4>
                <p className="text-[10px] text-charcoal/50 font-bold">{getParents(bride)}</p>
                {bride.bio && (
                  <p className="text-xs text-[#3D352E]/70 leading-relaxed italic">
                    "{bride.bio}"
                  </p>
                )}
                {bride.instagram && (
                  <a
                    href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#8B6914] font-bold hover:underline"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>{bride.instagram}</span>
                  </a>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </StackingSection>

      {/* Section 4: Jadwal */}
      <StackingSection
        id="events"
        zIndex={40}
        bg="#FAF6F0"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8 animate-none"
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Agenda Hari H</h3>
            <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-left">
            {/* Akad */}
            {schedules.akad && (
              <motion.div variants={childScaleIn}>
                <Card className="p-6 border border-[#D4956A]/30 bg-[#FAF6F0] rounded-3xl space-y-4 shadow-sm animate-none">
                  <div className="flex items-center gap-3 border-b border-[#D4956A]/20 pb-3">
                    <Calendar className="text-[#8B6914]" size={20} />
                    <h4 className="font-serif font-bold text-lg text-[#8B6914]">Akad Nikah</h4>
                  </div>
                  <div className="space-y-2 text-xs text-charcoal/80">
                    <p>
                      <strong>Tanggal:</strong> {formatDate(schedules.akad.date)}
                    </p>
                    <p>
                      <strong>Waktu:</strong> {schedules.akad.timeStart || schedules.akad.time} -{' '}
                      {schedules.akad.timeEnd || 'Selesai'}
                    </p>
                    <p>
                      <strong>Lokasi:</strong> {schedules.akad.placeName || schedules.akad.venue}
                    </p>
                    <p className="leading-relaxed">
                      <strong>Alamat:</strong> {schedules.akad.address}
                    </p>
                  </div>
                  <MapEmbed
                    url={schedules.akad.googleMapsUrl || schedules.akad.maps}
                    placeName={schedules.akad.placeName}
                    address={schedules.akad.address}
                  />
                </Card>
              </motion.div>
            )}

            {/* Resepsi */}
            {schedules.resepsi && (
              <motion.div variants={childScaleIn}>
                <Card className="p-6 border border-[#D4956A]/30 bg-[#FAF6F0] rounded-3xl space-y-4 shadow-sm animate-none">
                  <div className="flex items-center gap-3 border-b border-[#D4956A]/20 pb-3">
                    <Calendar className="text-[#8B6914]" size={20} />
                    <h4 className="font-serif font-bold text-lg text-[#8B6914]">Resepsi</h4>
                  </div>
                  <div className="space-y-2 text-xs text-charcoal/80">
                    <p>
                      <strong>Tanggal:</strong> {formatDate(schedules.resepsi.date)}
                    </p>
                    <p>
                      <strong>Waktu:</strong> {schedules.resepsi.timeStart || schedules.resepsi.time} -{' '}
                      {schedules.resepsi.timeEnd || 'Selesai'}
                    </p>
                    <p>
                      <strong>Lokasi:</strong> {schedules.resepsi.placeName || schedules.resepsi.venue}
                    </p>
                    <p className="leading-relaxed">
                      <strong>Alamat:</strong> {schedules.resepsi.address}
                    </p>
                  </div>
                  <MapEmbed
                    url={schedules.resepsi.googleMapsUrl || schedules.resepsi.maps}
                    placeName={schedules.resepsi.placeName}
                    address={schedules.resepsi.address}
                  />
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </StackingSection>

      {/* Section 5: Kisah */}
      {stories.length > 0 && (
        <StackingSection
          id="story"
          zIndex={50}
          bg="#F5EDE3"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8"
          >
            <motion.div className="text-center" variants={childFadeUp}>
              <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Cerita Kita</h3>
              <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
            </motion.div>

            <div className="relative border-l-2 border-[#D4956A]/30 ml-4 pl-6 space-y-8 mt-6 text-left">
              {stories.map((story: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={childFadeUp}
                  className="relative space-y-2"
                >
                  <div className="absolute -left-[32px] top-1.5 w-4 w-4 rounded-full border-2 border-[#8B6914] bg-[#F5EDE3] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B6914]" />
                  </div>
                  <div className="bg-[#8B6914]/10 text-[#8B6914] text-[10px] font-bold px-2.5 py-0.5 rounded inline-block">
                    {story.date || story.year}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#8B6914]">{story.title}</h4>
                  <p className="text-xs text-[#3D352E]/80 leading-relaxed">
                    {story.content || story.story}
                  </p>
                  {story.imageUrl && (
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full max-h-48 object-cover rounded-xl mt-2 border border-[#D4956A]/20 shadow-sm"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </StackingSection>
      )}

      {/* Section 6: Galeri */}
      {photos.length > 0 && (
        <StackingSection
          id="gallery"
          zIndex={60}
          bg="#FAF6F0"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8"
          >
            <motion.div className="text-center" variants={childFadeUp}>
              <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Memori Bahagia</h3>
              <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
            </motion.div>
            <motion.div variants={childScaleIn}>
              <PhotoGallery photos={photos} />
            </motion.div>
          </motion.div>
        </StackingSection>
      )}

      {/* Section 7: RSVP */}
      <StackingSection
        id="rsvp"
        zIndex={70}
        bg="#F5EDE3"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8"
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Kehadiran Tamu</h3>
            <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
          </motion.div>
          <motion.div variants={childScaleIn}>
            <RSVPForm
              guestName={guestName}
              guestToken={guestToken}
              onRsvpSubmit={onRsvpSubmit}
              initialStatus="hadir"
            />
          </motion.div>
        </motion.div>
      </StackingSection>

      {/* Section 8: Wishes */}
      <StackingSection
        id="wishes"
        zIndex={80}
        bg="#FAF6F0"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        {/* Leaves ornament bottom-right */}
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-[url('/ornaments/rustic-leaves-right.png')] bg-contain bg-no-repeat opacity-15 pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8 relative z-10"
        >
          <motion.div variants={childFadeUp} className="w-full">
            <GuestWishes initialWishes={wishes} weddingId={weddingId} />
          </motion.div>
        </motion.div>
      </StackingSection>
    </div>
  )
}

export default RusticTheme
