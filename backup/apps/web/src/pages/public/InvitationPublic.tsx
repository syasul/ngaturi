import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Heart, Clock } from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'
import ThemeRouter from '../../themes/ThemeRouter'
import OpeningCover from '../../themes/reusable/OpeningCover'
import MusicPlayer from '../../themes/reusable/MusicPlayer'

export const InvitationPublic: React.FC = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const guestToken = searchParams.get('to')

  const [wedding, setWedding] = useState<any>(null)
  const [guest, setGuest] = useState<any>(null)
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Presentation States
  const [isOpened, setIsOpened] = useState(false)
  const [autoPlayMusic, setAutoPlayMusic] = useState(false)

  // 1. Dynamic Font Injection on Mount
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Dancing+Script:wght@400;700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // 2. Load Wedding Details and Wishes
  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const res = await api.get(`/weddings/public/${slug}`)
        if (res.data.status === 'success') {
          const w = res.data.wedding
          setWedding(w)

          // Load wishes list
          const wishesRes = await api.get(`/guests/public/wishes/${w.id}`)
          if (wishesRes.data.status === 'success') {
            setWishes(wishesRes.data.wishes)
          }

          // If guest token present, fetch guest name
          if (guestToken) {
            try {
              const guestRes = await api.get(`/guests/public/by-token/${guestToken}`)
              if (guestRes.data.status === 'success') {
                setGuest(guestRes.data.guest)
              }
            } catch (e) {
              console.error('Guest token loading error:', e)
            }
          }
        }
      } catch (err) {
        console.error('Error loading wedding:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadPublicData()
    }
  }, [slug, guestToken])

  // 3. Dynamic Open Graph Meta Tag Injector
  useEffect(() => {
    if (wedding) {
      const groomNick = wedding.data?.groom?.nickname || wedding.data?.groom?.name || 'Groom'
      const brideNick = wedding.data?.bride?.nickname || wedding.data?.bride?.name || 'Bride'
      const title = `Pernikahan ${groomNick} & ${brideNick}`
      const desc = `Undangan pernikahan digital kami. Klik untuk info lokasi, detail acara, galeri foto, dan RSVP.`

      document.title = title

      const updateMetaTag = (property: string, content: string, attr: 'name' | 'property' = 'property') => {
        let element = document.querySelector(`meta[${attr}="${property}"]`)
        if (!element) {
          element = document.createElement('meta')
          element.setAttribute(attr, property)
          document.head.appendChild(element)
        }
        element.setAttribute('content', content)
      }

      const coverImg = wedding.photos?.find((p: any) => p.type === 'cover')?.url || wedding.thumbnailUrl || ''

      updateMetaTag('og:title', title)
      updateMetaTag('og:description', desc)
      updateMetaTag('og:image', coverImg)
      updateMetaTag('og:url', window.location.href)
      updateMetaTag('og:type', 'website')
      updateMetaTag('description', desc, 'name')
    }
  }, [wedding])

  // Handle RSVP Submit
  const handleRsvpSubmit = async (rsvpStatus: string, message: string) => {
    if (!guestToken) return

    try {
      const res = await api.post('/guests/public/rsvp', {
        uniqueToken: guestToken,
        rsvpStatus,
        message,
      })

      if (res.data.status === 'success') {
        toast.success('Konfirmasi kehadiran berhasil dikirim!')

        // Reload wishes list
        const wishesRes = await api.get(`/guests/public/wishes/${wedding.id}`)
        if (wishesRes.data.status === 'success') {
          setWishes(wishesRes.data.wishes)
        }
      }
    } catch (err) {
      toast.error('Gagal mengirim konfirmasi kehadiran.')
    }
  }

  const handleOpenInvitation = () => {
    setIsOpened(true)
    setAutoPlayMusic(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4 font-sans">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs text-charcoal/60 font-semibold tracking-wider uppercase">
          Membuka undangan digital...
        </p>
      </div>
    )
  }

  // Handle 404: Not Found or Unpublished/Draft state
  if (!wedding || wedding.status !== 'published') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <Heart className="text-red-300 mb-4 animate-pulse" size={48} />
        <h2 className="text-2xl font-serif font-bold text-[#2C2C2C]">Undangan Tidak Aktif</h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          Maaf, undangan digital dengan tautan URL ini tidak ditemukan atau masih dalam status draf.
        </p>
      </div>
    )
  }

  // Handle Expired checks
  const isExpired = wedding.expiredAt ? new Date(wedding.expiredAt) < new Date() : false
  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center font-sans">
        <Clock className="text-neutral-400 mb-4 animate-bounce" size={48} />
        <h2 className="text-2xl font-serif font-bold text-[#2C2C2C]">Undangan Telah Kedaluwarsa</h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          Masa aktif undangan digital ini telah berakhir. Silakan hubungi pasangan pengantin untuk informasi lebih lanjut.
        </p>
      </div>
    )
  }

  const data = wedding.data
  const themeId = wedding.themeId || 'elegant'

  return (
    <div className="min-h-screen relative w-full overflow-hidden">
      {/* Autoplay Music Player */}
      {wedding.data?.musicUrl && (
        <MusicPlayer musicUrl={wedding.data.musicUrl} autoPlay={autoPlayMusic} />
      )}

      {/* Opening Envelope Cover Screen */}
      <AnimatePresence>
        {!isOpened && (
          <OpeningCover
            groomName={data?.groom?.nickname || data?.groom?.name || 'Groom'}
            brideName={data?.bride?.nickname || data?.bride?.name || 'Bride'}
            guestName={guest?.name}
            themeId={themeId}
            onOpen={handleOpenInvitation}
          />
        )}
      </AnimatePresence>

      {/* Main Content (Theme Component Router) */}
      {isOpened && (
        <ThemeRouter
          themeId={themeId}
          data={data}
          weddingId={wedding.id}
          photos={wedding.photos}
          guestName={guest?.name}
          guestToken={guestToken || undefined}
          wishes={wishes}
          onRsvpSubmit={handleRsvpSubmit}
        />
      )}
    </div>
  )
}

export default InvitationPublic
