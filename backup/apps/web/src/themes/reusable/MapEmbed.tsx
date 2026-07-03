import React from 'react'
import { MapPin } from 'lucide-react'
import Button from '../../components/ui/Button'

interface MapEmbedProps {
  url?: string
  placeName?: string
  address?: string
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ url, placeName, address }) => {
  // Determine the best source for the iframe embed
  const getEmbedUrl = () => {
    if (!url) {
      if (address) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
      }
      return null
    }

    if (url.includes('google.com/maps/embed') || url.includes('/maps/d/')) {
      return url
    }

    // Fall back to querying Google Maps with the url string or details
    const searchQuery = address || placeName || url
    return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
  }

  const embedSrc = getEmbedUrl()

  return (
    <div className="w-full space-y-4 font-sans">
      {embedSrc ? (
        <div className="w-full h-56 md:h-64 border border-sand/30 rounded-2xl overflow-hidden shadow-inner bg-cream/10 relative">
          <iframe
            title="Google Maps Location"
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="w-full h-40 border border-dashed border-sand/50 rounded-2xl flex flex-col items-center justify-center p-4 bg-cream/5 text-center text-xs text-charcoal/50">
          <MapPin size={24} className="text-sand mb-2" />
          <p>Peta lokasi tidak tersedia.</p>
        </div>
      )}

      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs rounded-xl"
          >
            <MapPin size={14} />
            <span>Petunjuk Arah Google Maps</span>
          </Button>
        </a>
      )}
    </div>
  )
}

export default MapEmbed
