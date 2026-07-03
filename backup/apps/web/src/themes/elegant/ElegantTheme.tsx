import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar } from 'lucide-react'
import type { WeddingData } from '@wedding/shared'
import Card from '../../components/ui/Card'
import CountdownTimer from '../reusable/CountdownTimer'
import RSVPForm from '../reusable/RSVPForm'
import GuestWishes from '../reusable/GuestWishes'
import PhotoGallery from '../reusable/PhotoGallery'
import MapEmbed from '../reusable/MapEmbed'

export interface ThemeProps {
  data: WeddingData | any
  weddingId: string
  photos?: any[]
  guestName?: string
  guestToken?: string
  wishes: any[]
  onRsvpSubmit: (rsvpStatus: string, message: string) => Promise<void>
}

export const ElegantTheme: React.FC<ThemeProps> = ({
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

  // Helper for parents fallback
  const getParents = (person: any) => {
    if (person.fatherName && person.motherName) {
      return `Putra dari Bpk. ${person.fatherName} & Ibu ${person.motherName}`
    }
    return person.parents || ''
  }

  // Format Date Helper
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2C] pb-24 font-sans select-none relative overflow-x-hidden">
      {/* Decorative Top Leaf SVG mask */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[url('/ornaments/elegant-leaves.png')] bg-contain bg-no-repeat opacity-15 pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24 space-y-24 z-10 relative">
        {/* Section 1: Hero Header */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="w-12 h-12 rounded-full border border-[#C9A84C]/40 flex items-center justify-center mx-auto text-[#C9A84C] animate-pulse">
            <Heart size={20} className="fill-[#C9A84C]/10" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block">
            Walimatul Ursy
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wide text-[#2C2C2C]">
            {groom.nickname || groom.name} & {bride.nickname || bride.name}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto" />
          <p className="text-xs text-charcoal/50 max-w-md mx-auto italic leading-relaxed font-serif px-4">
            "{quotes.text || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...'}"
            {quotes.source && <span className="block mt-1 font-bold text-[#C9A84C] not-italic">— {quotes.source}</span>}
          </p>
        </motion.section>

        {/* Section 2: Countdown */}
        {schedules.akad?.date && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#C9A84C]">
              Menghitung Hari Bahagia
            </span>
            <CountdownTimer targetDate={schedules.akad.date} />
          </motion.section>
        )}

        {/* Section 3: Bride & Groom profiles */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold text-[#2C2C2C]">Mempelai</h3>
            <div className="w-10 h-0.5 bg-[#C9A84C]/50 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Groom Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6 border border-[#C9A84C]/20 bg-white/70 backdrop-blur rounded-3xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-28 h-28 rounded-full bg-[#FAF7F2] mx-auto overflow-hidden border-2 border-[#C9A84C]/30 p-1 shadow-inner">
                  {groom.photoUrl || groom.photo ? (
                    <img
                      src={groom.photoUrl || groom.photo}
                      alt={groom.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#C9A84C]/5 flex items-center justify-center font-serif text-3xl font-bold text-[#C9A84C] rounded-full">
                      {(groom.nickname || groom.name)?.[0]}
                    </div>
                  )}
                </div>
                <h4 className="font-serif font-bold text-xl text-[#2C2C2C]">
                  {groom.fullName || groom.name}
                </h4>
                <p className="text-[10px] text-charcoal/50 font-bold">{getParents(groom)}</p>
                {groom.bio && (
                  <p className="text-xs text-charcoal/70 leading-relaxed italic font-serif">
                    "{groom.bio}"
                  </p>
                )}
                {groom.instagram && (
                  <a
                    href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#C9A84C] font-bold hover:underline"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>{groom.instagram}</span>
                  </a>
                )}
              </Card>
            </motion.div>

            {/* Bride Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6 border border-[#C9A84C]/20 bg-white/70 backdrop-blur rounded-3xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-28 h-28 rounded-full bg-[#FAF7F2] mx-auto overflow-hidden border-2 border-[#C9A84C]/30 p-1 shadow-inner">
                  {bride.photoUrl || bride.photo ? (
                    <img
                      src={bride.photoUrl || bride.photo}
                      alt={bride.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#C9A84C]/5 flex items-center justify-center font-serif text-3xl font-bold text-[#C9A84C] rounded-full">
                      {(bride.nickname || bride.name)?.[0]}
                    </div>
                  )}
                </div>
                <h4 className="font-serif font-bold text-xl text-[#2C2C2C]">
                  {bride.fullName || bride.name}
                </h4>
                <p className="text-[10px] text-charcoal/50 font-bold">{getParents(bride)}</p>
                {bride.bio && (
                  <p className="text-xs text-charcoal/70 leading-relaxed italic font-serif">
                    "{bride.bio}"
                  </p>
                )}
                {bride.instagram && (
                  <a
                    href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#C9A84C] font-bold hover:underline"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>{bride.instagram}</span>
                  </a>
                )}
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Section 4: Schedule */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold text-[#2C2C2C]">Acara & Jadwal</h3>
            <div className="w-10 h-0.5 bg-[#C9A84C]/50 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Akad */}
            {schedules.akad && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border border-[#C9A84C]/25 bg-white/80 rounded-3xl space-y-4 shadow-sm text-left">
                  <div className="flex items-center gap-3 border-b border-[#C9A84C]/10 pb-3">
                    <Calendar className="text-[#C9A84C]" size={20} />
                    <h4 className="font-serif font-bold text-lg text-[#2C2C2C]">Akad Nikah</h4>
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
                      <strong>Tempat:</strong> {schedules.akad.placeName || schedules.akad.venue}
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border border-[#C9A84C]/25 bg-white/80 rounded-3xl space-y-4 shadow-sm text-left">
                  <div className="flex items-center gap-3 border-b border-[#C9A84C]/10 pb-3">
                    <Calendar className="text-[#C9A84C]" size={20} />
                    <h4 className="font-serif font-bold text-lg text-[#2C2C2C]">Resepsi Pernikahan</h4>
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
                      <strong>Tempat:</strong> {schedules.resepsi.placeName || schedules.resepsi.venue}
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
        </section>

        {/* Section 5: Stories */}
        {stories.length > 0 && (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-[#2C2C2C]">Cerita Cinta Kami</h3>
              <div className="w-10 h-0.5 bg-[#C9A84C]/50 mx-auto mt-2" />
            </div>

            <div className="relative border-l border-[#C9A84C]/30 ml-4 pl-6 space-y-8 mt-6">
              {stories.map((story: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative space-y-2 text-left"
                >
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border border-[#C9A84C] bg-[#FAF7F2] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                  </div>
                  <div className="bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                    {story.date || story.year}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#2C2C2C]">{story.title}</h4>
                  <p className="text-xs text-charcoal/60 leading-relaxed">
                    {story.content || story.story}
                  </p>
                  {story.imageUrl && (
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full max-h-48 object-cover rounded-xl mt-2 border border-sand/20"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Photo Gallery */}
        {photos.length > 0 && (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-[#2C2C2C]">Galeri Foto</h3>
              <div className="w-10 h-0.5 bg-[#C9A84C]/50 mx-auto mt-2" />
            </div>
            <PhotoGallery photos={photos} />
          </section>
        )}

        {/* Section 7: RSVP Form */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold text-[#2C2C2C]">Konfirmasi Kehadiran</h3>
            <div className="w-10 h-0.5 bg-[#C9A84C]/50 mx-auto mt-2" />
          </div>
          <RSVPForm
            guestName={guestName}
            guestToken={guestToken}
            onRsvpSubmit={onRsvpSubmit}
            initialStatus="hadir"
          />
        </section>

        {/* Section 8: Wishes Guestbook */}
        <section className="space-y-8">
          <GuestWishes initialWishes={wishes} weddingId={weddingId} />
        </section>
      </div>
    </div>
  )
}

export default ElegantTheme
