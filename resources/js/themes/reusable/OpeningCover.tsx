import React from 'react'
import { motion } from 'framer-motion'
import { MailOpen, Heart } from 'lucide-react'
import Button from '../../components/ui/Button'

interface OpeningCoverProps {
  groomName: string
  brideName: string
  guestName?: string
  themeId: string
  onOpen: () => void
}

export const OpeningCover: React.FC<OpeningCoverProps> = ({
  groomName,
  brideName,
  guestName,
  themeId,
  onOpen,
}) => {
  // Theme styling definitions
  let containerBg = 'bg-[#FAF7F2] text-[#2C2C2C]'
  let cardBg = 'bg-white/80 border-gold-500/20'
  let buttonStyle = 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold-500/20'
  let fontTitle = 'font-serif'

  if (themeId === 'rustic') {
    containerBg = 'bg-[#F5EDE3] text-[#3D352E]'
    cardBg = 'bg-[#FAF6F0]/90 border-[#D4956A]/30'
    buttonStyle = 'bg-[#8B6914] hover:bg-[#705510] text-[#F5EDE3] shadow-amber-800/10'
    fontTitle = 'font-cursive' // Dancing Script style
  } else if (themeId === 'modern') {
    containerBg = 'bg-[#FFFFFF] text-[#111111]'
    cardBg = 'bg-neutral-50 border-neutral-200'
    buttonStyle = 'bg-black hover:bg-neutral-900 text-white shadow-black/10'
    fontTitle = 'font-sans font-black tracking-tight' // Poppins style
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed inset-0 z-40 flex flex-col justify-between items-center py-16 px-6 text-center select-none overflow-hidden ${containerBg}`}
    >
      {/* Decorative Ornaments */}
      {themeId === 'elegant' && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 bg-[url('/ornaments/flower-top-left.svg')] bg-contain bg-no-repeat opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[url('/ornaments/flower-bottom-right.svg')] bg-contain bg-no-repeat opacity-20 pointer-events-none" />
        </>
      )}
      {themeId === 'rustic' && (
        <>
          <div className="absolute top-0 right-0 w-28 h-28 bg-[url('/ornaments/leaves-top-right.svg')] bg-contain bg-no-repeat opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-[url('/ornaments/leaves-bottom-left.svg')] bg-contain bg-no-repeat opacity-20 pointer-events-none" />
        </>
      )}

      {/* Invitation Header */}
      <div className="space-y-4 mt-8 z-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600/80 block">
          THE WEDDING OF
        </span>
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mt-2 ${fontTitle}`}>
          {groomName} <Heart className="inline text-red-400 fill-red-400/10 mx-1 animate-pulse" size={24} /> {brideName}
        </h1>
      </div>

      {/* Guest Card Panel */}
      <div className={`space-y-4 backdrop-blur border py-6 px-8 rounded-3xl max-w-sm w-full shadow-sm z-10 ${cardBg}`}>
        <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-bold font-sans">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <div className="py-2">
          <h3 className="text-xl font-bold text-charcoal font-sans">
            {guestName || 'Saudara/i, Kerabat & Sahabat'}
          </h3>
        </div>
        <p className="text-[10px] text-charcoal/40 leading-relaxed font-sans">
          Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.
        </p>
      </div>

      {/* Open Button */}
      <div className="z-10 mb-8">
        <Button
          variant="primary"
          onClick={onOpen}
          className={`flex items-center justify-center px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 shadow-lg ${buttonStyle}`}
        >
          <span>Buka Undangan</span>
        </Button>
      </div>
    </motion.div>
  )
}

export default OpeningCover
