import React, { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date()
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const timeBlocks = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <div className="flex justify-center gap-3 md:gap-5 my-6">
      {timeBlocks.map((block, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/70 backdrop-blur border border-sand/40 shadow-sm rounded-2xl"
        >
          <span className="text-xl md:text-2xl font-bold font-mono text-gold-600 leading-none">
            {String(block.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-charcoal/50 mt-1 md:mt-2">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CountdownTimer
