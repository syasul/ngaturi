import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface MusicPlayerProps {
  musicUrl?: string
  autoPlay: boolean
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl, autoPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (musicUrl && !audioRef.current) {
      audioRef.current = new Audio(musicUrl)
      audioRef.current.loop = true
    } else if (audioRef.current && musicUrl) {
      audioRef.current.src = musicUrl
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [musicUrl])

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Autoplay prevented by browser security:', err))
    }
  }, [autoPlay])

  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error(err))
    }
  }

  if (!musicUrl) return null

  return (
    <button
      type="button"
      onClick={togglePlayback}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-2xl z-30 flex items-center justify-center transition-all duration-300 border border-sand/35 cursor-pointer ${
        isPlaying ? 'bg-amber-500 text-white animate-spin-slow shadow-amber-500/20' : 'bg-white text-charcoal'
      }`}
      title={isPlaying ? 'Mute Music' : 'Play Music'}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  )
}

export default MusicPlayer
