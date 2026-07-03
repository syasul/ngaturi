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
    <div className="min-h-screen bg-[#F5EDE3] text-[#3D352E] pb-24 font-sans select-none relative overflow-x-hidden">
      {/* Leaves ornaments top-left and bottom-right */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-[url('/ornaments/rustic-leaves-left.png')] bg-contain bg-no-repeat opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-36 h-36 bg-[url('/ornaments/rustic-leaves-right.png')] bg-contain bg-no-repeat opacity-15 pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24 space-y-24 z-10 relative">
        {/* Section 1: Hero Header */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="w-10 h-10 rounded-full bg-[#8B6914]/10 flex items-center justify-center mx-auto text-[#8B6914] animate-pulse">
            <Heart size={18} className="fill-[#8B6914]/10" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4956A] block">
            Pernikahan Rustic Bohemian
          </span>
          <h1 className="text-5xl md:text-6xl font-cursive font-bold text-[#8B6914]">
            {groom.nickname || groom.name} & {bride.nickname || bride.name}
          </h1>
          <div className="w-16 h-0.5 bg-[#D4956A]/60 mx-auto" />
          <p className="text-xs text-[#3D352E]/70 max-w-md mx-auto italic leading-relaxed font-sans px-4">
            "{quotes.text || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...'}"
            {quotes.source && <span className="block mt-1 font-bold text-[#8B6914] not-italic">— {quotes.source}</span>}
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
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#8B6914]">
              Menuju Hari Istimewa
            </span>
            <CountdownTimer targetDate={schedules.akad.date} />
          </motion.section>
        )}

        {/* Section 3: Mempelai */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Mempelai Kami</h3>
            <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Groom Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
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
        </section>

        {/* Section 4: Jadwal */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Agenda Hari H</h3>
            <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Akad */}
            {schedules.akad && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border border-[#D4956A]/30 bg-[#FAF6F0] rounded-3xl space-y-4 shadow-sm text-left">
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border border-[#D4956A]/30 bg-[#FAF6F0] rounded-3xl space-y-4 shadow-sm text-left">
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
        </section>

        {/* Section 5: Kisah */}
        {stories.length > 0 && (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Cerita Kita</h3>
              <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
            </div>

            <div className="relative border-l-2 border-[#D4956A]/30 ml-4 pl-6 space-y-8 mt-6">
              {stories.map((story: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative space-y-2 text-left"
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
          </section>
        )}

        {/* Section 6: Galeri */}
        {photos.length > 0 && (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Memori Bahagia</h3>
              <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
            </div>
            <PhotoGallery photos={photos} />
          </section>
        )}

        {/* Section 7: RSVP */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-cursive font-bold text-[#8B6914]">Kehadiran Tamu</h3>
            <div className="w-10 h-0.5 bg-[#D4956A]/50 mx-auto mt-2" />
          </div>
          <RSVPForm
            guestName={guestName}
            guestToken={guestToken}
            onRsvpSubmit={onRsvpSubmit}
            initialStatus="hadir"
          />
        </section>

        {/* Section 8: Wishes */}
        <section className="space-y-8">
          <GuestWishes initialWishes={wishes} weddingId={weddingId} />
        </section>
      </div>
    </div>
  )
}

export default RusticTheme
