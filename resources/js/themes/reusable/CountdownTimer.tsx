import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetDate,
}) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const timeBlocks = [
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
    ];

    return (
        <motion.div
            className="my-6 flex justify-center gap-3 md:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
                visible: { transition: { staggerChildren: 0.08 } },
                hidden: {},
            }}
        >
            {timeBlocks.map((block, idx) => (
                <motion.div
                    key={idx}
                    variants={{
                        hidden: { opacity: 0, y: 18, scale: 0.92 },
                        visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="relative flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-2xl border border-sand/40 bg-white/75 shadow-sm backdrop-blur md:h-20 md:w-20"
                >
                    <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={block.label + block.value}
                            initial={{
                                y: -10,
                                opacity: 0,
                                filter: 'blur(4px)',
                            }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ y: 10, opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="font-mono text-xl font-bold leading-none text-gold-600 md:text-2xl"
                        >
                            {String(block.value).padStart(2, '0')}
                        </motion.span>
                    </AnimatePresence>
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-charcoal/50 md:mt-2 md:text-[10px]">
                        {block.label}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default CountdownTimer;
