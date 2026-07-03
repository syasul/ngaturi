import React from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
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
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const childFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as any },
  },
}

const childScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as any },
  },
}

export const ModernTheme: React.FC<ThemeProps> = ({
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
    <div className="relative bg-white text-[#111111] font-sans select-none">
      
      {/* Section 1: Hero Header */}
      <StackingSection
        id="hero"
        zIndex={10}
        bg="#ffffff"
        roundedVal="0px"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 text-center space-y-8"
        >
          <motion.span variants={childFadeUp} className="text-[10px] uppercase font-bold tracking-widest text-[#D4A0A0] block">
            JOIN US TO CELEBRATE
          </motion.span>
          <motion.h1 variants={childFadeUp} className="text-5xl md:text-6xl font-black tracking-tight uppercase text-neutral-900 leading-none">
            {groom.nickname || groom.name}
            <br />
            <span className="text-[#D4A0A0] text-3xl font-light lowercase font-serif italic my-2 block">&amp;</span>
            {bride.nickname || bride.name}
          </motion.h1>
          <motion.div variants={childFadeUp} className="w-12 h-0.5 bg-neutral-900 mx-auto mt-4" />
          {quotes.text && (
            <motion.p variants={childFadeUp} className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed font-sans px-6 pt-2">
              "{quotes.text}"
              {quotes.source && <span className="block mt-1.5 font-semibold text-neutral-800">— {quotes.source}</span>}
            </motion.p>
          )}
        </motion.div>
      </StackingSection>

      {/* Section 2: Countdown */}
      {schedules.akad?.date && (
        <StackingSection
          id="countdown"
          zIndex={20}
          bg="#F8F8F8"
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
            <motion.span variants={childFadeUp} className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
              COUNTDOWN TO THE BIG DAY
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
        bg="#ffffff"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12"
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-950">THE COUPLE</h3>
            <div className="w-8 h-0.5 bg-neutral-900 mx-auto mt-1" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            {/* Groom Card */}
            <motion.div variants={childScaleIn}>
              <Card className="p-6 border border-neutral-100 bg-neutral-50/50 rounded-2xl text-center space-y-4 shadow-none">
                <div className="w-28 h-28 rounded-2xl bg-neutral-100 mx-auto overflow-hidden border border-neutral-200 p-0.5">
                  {groom.photoUrl || groom.photo ? (
                    <img
                      src={groom.photoUrl || groom.photo}
                      alt={groom.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-400 rounded-2xl">
                      {(groom.nickname || groom.name)?.[0]}
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-lg uppercase tracking-tight text-neutral-900">
                  {groom.fullName || groom.name}
                </h4>
                <p className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">{getParents(groom)}</p>
                {groom.bio && (
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {groom.bio}
                  </p>
                )}
                {groom.instagram && (
                  <a
                    href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#D4A0A0] font-bold hover:underline"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>{groom.instagram}</span>
                  </a>
                )}
              </Card>
            </motion.div>

            {/* Bride Card */}
            <motion.div variants={childScaleIn}>
              <Card className="p-6 border border-neutral-100 bg-neutral-50/50 rounded-2xl text-center space-y-4 shadow-none">
                <div className="w-28 h-28 rounded-2xl bg-neutral-100 mx-auto overflow-hidden border border-neutral-200 p-0.5">
                  {bride.photoUrl || bride.photo ? (
                    <img
                      src={bride.photoUrl || bride.photo}
                      alt={bride.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-400 rounded-2xl">
                      {(bride.nickname || bride.name)?.[0]}
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-lg uppercase tracking-tight text-neutral-900">
                  {bride.fullName || bride.name}
                </h4>
                <p className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">{getParents(bride)}</p>
                {bride.bio && (
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {bride.bio}
                  </p>
                )}
                {bride.instagram && (
                  <a
                    href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#D4A0A0] font-bold hover:underline"
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
        bg="#F8F8F8"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12"
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">EVENTS</h3>
            <div className="w-8 h-0.5 bg-neutral-900 mx-auto mt-1" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            {/* Akad */}
            {schedules.akad && (
              <motion.div variants={childScaleIn}>
                <Card className="p-6 border border-neutral-100 bg-white rounded-2xl space-y-4 shadow-none text-left animate-none">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                    <Calendar className="text-[#D4A0A0]" size={20} />
                    <h4 className="font-bold text-base uppercase tracking-wider text-neutral-900">Akad Nikah</h4>
                  </div>
                  <div className="space-y-2.5 text-xs text-neutral-600 font-light">
                    <p>
                      <strong className="font-semibold text-neutral-800">Tanggal:</strong> {formatDate(schedules.akad.date)}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-800">Waktu:</strong> {schedules.akad.timeStart || schedules.akad.time} -{' '}
                      {schedules.akad.timeEnd || 'Selesai'}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-800">Tempat:</strong> {schedules.akad.placeName || schedules.akad.venue}
                    </p>
                    <p className="leading-relaxed">
                      <strong className="font-semibold text-neutral-800">Alamat:</strong> {schedules.akad.address}
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
                <Card className="p-6 border border-neutral-100 bg-white rounded-2xl space-y-4 shadow-none text-left animate-none">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                    <Calendar className="text-[#D4A0A0]" size={20} />
                    <h4 className="font-bold text-base uppercase tracking-wider text-neutral-900">Resepsi</h4>
                  </div>
                  <div className="space-y-2.5 text-xs text-neutral-600 font-light">
                    <p>
                      <strong className="font-semibold text-neutral-800">Tanggal:</strong> {formatDate(schedules.resepsi.date)}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-800">Waktu:</strong> {schedules.resepsi.timeStart || schedules.resepsi.time} -{' '}
                      {schedules.resepsi.timeEnd || 'Selesai'}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-800">Tempat:</strong> {schedules.resepsi.placeName || schedules.resepsi.venue}
                    </p>
                    <p className="leading-relaxed">
                      <strong className="font-semibold text-neutral-800">Alamat:</strong> {schedules.resepsi.address}
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
          bg="#ffffff"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12"
          >
            <motion.div className="text-center" variants={childFadeUp}>
              <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">OUR LOVE STORY</h3>
              <div className="w-8 h-0.5 bg-neutral-900 mx-auto mt-1" />
            </motion.div>

            <div className="relative border-l border-neutral-200 ml-4 pl-6 space-y-8 mt-6 text-left">
              {stories.map((story: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={childFadeUp}
                  className="relative space-y-2"
                >
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border border-neutral-300 bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  </div>
                  <div className="bg-[#D4A0A0]/10 text-[#D4A0A0] text-[10px] font-bold px-2 py-0.5 rounded inline-block">
                    {story.date || story.year}
                  </div>
                  <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-tight">{story.title}</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {story.content || story.story}
                  </p>
                  {story.imageUrl && (
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full max-h-48 object-cover rounded-lg mt-2 border border-neutral-100"
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
          bg="#F8F8F8"
          roundedVal="2.5rem"
          boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12"
          >
            <motion.div className="text-center" variants={childFadeUp}>
              <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">GALLERY</h3>
              <div className="w-8 h-0.5 bg-neutral-900 mx-auto mt-1" />
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
        bg="#ffffff"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12"
        >
          <motion.div className="text-center" variants={childFadeUp}>
            <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">RSVP</h3>
            <div className="w-8 h-0.5 bg-neutral-900 mx-auto mt-1" />
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
        bg="#F8F8F8"
        roundedVal="2.5rem"
        boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12"
        >
          <motion.div variants={childFadeUp} className="w-full">
            <GuestWishes initialWishes={wishes} weddingId={weddingId} />
          </motion.div>
        </motion.div>
      </StackingSection>
    </div>
  )
}

export default ModernTheme
