import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  id: string
  url: string
  order?: number
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  // Keyboard navigation
  useEffect(() => {
    if (currentIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrentIndex(null)
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, photos])

  const handlePrev = () => {
    if (currentIndex === null) return
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1))
  }

  const handleNext = () => {
    if (currentIndex === null) return
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1))
  }

  if (!photos || photos.length === 0) {
    return <p className="text-center text-xs text-charcoal/40 py-8 italic font-sans">Belum ada foto galeri.</p>
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setCurrentIndex(idx)}
            className="aspect-[4/3] border border-sand/30 bg-cream/10 rounded-2xl overflow-hidden shadow-sm cursor-pointer group relative"
          >
            <img
              src={photo.url}
              alt={`Gallery ${idx}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Left navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Image Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-4xl max-h-[80vh] flex items-center justify-center select-none"
            >
              <img
                src={photos[currentIndex].url}
                alt={`Gallery Large ${currentIndex}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Right navigation */}
            <button
              onClick={handleNext}
              className="absolute right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            {/* Index Display */}
            <div className="absolute bottom-4 text-white/60 text-xs font-mono">
              {currentIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotoGallery
