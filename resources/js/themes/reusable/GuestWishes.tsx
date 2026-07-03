import React, { useState, useEffect } from 'react'
import { MessageSquare, Clock } from 'lucide-react'
import api from '../../lib/api'

interface Wish {
  id: string
  name: string
  rsvpStatus: string
  message: string
  createdAt: string
}

interface GuestWishesProps {
  initialWishes: Wish[]
  weddingId: string
}

export const GuestWishes: React.FC<GuestWishesProps> = ({ initialWishes, weddingId }) => {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)

  useEffect(() => {
    setWishes(initialWishes)
  }, [initialWishes])

  // Polling for new wishes every 10 seconds
  useEffect(() => {
    if (!weddingId) return

    const fetchWishes = async () => {
      try {
        const res = await api.get(`/guests/public/wishes/${weddingId}`)
        if (res.data.status === 'success') {
          setWishes(res.data.wishes)
        }
      } catch (err) {
        console.error('Error polling wishes:', err)
      }
    }

    const interval = setInterval(fetchWishes, 10000)
    return () => clearInterval(interval)
  }, [weddingId])

  return (
    <div className="space-y-4 max-w-md mx-auto font-sans">
      <h4 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-sand/20 pb-2">
        <MessageSquare className="text-gold-500" size={18} />
        <span>Ucapan & Doa ({wishes.length})</span>
      </h4>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {wishes.length === 0 ? (
          <p className="text-center text-xs text-charcoal/40 py-6 italic">Belum ada ucapan. Jadilah yang pertama!</p>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-4 border border-sand/30 bg-white/70 backdrop-blur rounded-2xl shadow-sm text-left space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-charcoal">{wish.name}</span>
                <span className="text-[9px] text-charcoal/40 uppercase bg-cream/30 px-2 py-0.5 rounded border border-sand/20">
                  {wish.rsvpStatus === 'hadir' || wish.rsvpStatus === 'attending'
                    ? 'Hadir'
                    : wish.rsvpStatus === 'tidak' || wish.rsvpStatus === 'declined'
                    ? 'Absen'
                    : 'Ragu'}
                </span>
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed italic">
                "{wish.message}"
              </p>
              <div className="flex justify-end items-center gap-1 text-[9px] text-charcoal/40 pt-1 border-t border-sand/15">
                <Clock size={10} />
                <span>{new Date(wish.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default GuestWishes
