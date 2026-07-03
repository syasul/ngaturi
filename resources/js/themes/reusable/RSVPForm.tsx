import React, { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

interface RSVPFormProps {
  guestName?: string
  guestToken?: string
  onRsvpSubmit: (rsvpStatus: string, message: string) => Promise<void>
  initialStatus?: string
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
  guestName,
  guestToken,
  onRsvpSubmit,
  initialStatus = 'hadir',
}) => {
  const [rsvpStatus, setRsvpStatus] = useState(initialStatus)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onRsvpSubmit(rsvpStatus, message)
      setMessage('')
    } finally {
      setSubmitting(false)
    }
  }

  if (!guestToken) {
    return (
      <div className="bg-gold-500/5 border border-gold-500/10 p-5 rounded-2xl max-w-sm mx-auto text-center text-xs text-charcoal/60 leading-relaxed font-sans">
        Konfirmasi RSVP kustom dan ucapan tersedia bagi tamu terdaftar. Silakan akses link personal yang dikirimkan oleh mempelai melalui WhatsApp.
      </div>
    )
  }

  return (
    <Card className="p-6 border border-sand/40 bg-white/80 backdrop-blur rounded-3xl shadow-sm max-w-md mx-auto font-sans">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <h4 className="font-serif font-bold text-sm text-charcoal text-center mb-4">
          Kirim Konfirmasi Kehadiran Anda, {guestName || 'Tamu'}
        </h4>

        <div>
          <label className="block text-[10px] uppercase font-bold text-charcoal/50">
            Status Kehadiran
          </label>
          <select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
            className="w-full mt-1 border border-sand/40 bg-white px-3 py-2 rounded-xl text-xs text-charcoal/80 focus:outline-none focus:ring-1 focus:ring-gold-500"
          >
            <option value="hadir">Hadir</option>
            <option value="tidak">Tidak Hadir</option>
            <option value="ragu">Ragu-ragu</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-charcoal/50">
            Pesan Ucapan / Doa Restu
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
            className="w-full mt-1 border border-sand/40 bg-white px-3 py-2 rounded-xl text-xs text-charcoal/80 focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center items-center gap-1.5 mt-2 rounded-xl py-2 text-xs"
        >
          {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
          <span>Kirim Konfirmasi</span>
        </Button>
      </form>
    </Card>
  )
}

export default RSVPForm
