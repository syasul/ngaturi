import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Heart, Sparkles } from 'lucide-react';
import React from 'react';
import Button from '../../components/ui/Button';
import TiltCard from '../../components/ui/TiltCard';

export const Hero: React.FC = () => {
    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-radial from-gold-50/40 via-white to-gold-50/10 pb-16 pt-28"
        >
            {/* Hero floral bg — very subtle watermark */}
            <img
                src="/assets/wedding/hero-floral.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.12]"
                style={{ mixBlendMode: 'multiply' }}
            />

            {/* Ornament top-left */}
            <motion.img
                src="/assets/wedding/ornaments.png"
                alt=""
                aria-hidden="true"
                animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="pointer-events-none absolute -left-10 -top-10 w-56 select-none opacity-20 lg:w-72"
            />

            {/* Ornament bottom-right */}
            <motion.img
                src="/assets/wedding/ornaments.png"
                alt=""
                aria-hidden="true"
                animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.5,
                }}
                className="pointer-events-none absolute -bottom-10 -right-10 w-56 select-none opacity-15 lg:w-72"
                style={{ transform: 'scaleX(-1) scaleY(-1)' }}
            />

            {/* Gold radial glows */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
                <div className="left-1/10 absolute top-1/4 h-96 w-96 rounded-full bg-gold-200/10 blur-3xl" />
                <div className="right-1/10 absolute bottom-1/4 h-96 w-96 rounded-full bg-rustic-200/10 blur-3xl" />
            </div>

            {/* Content wrapper */}
            <div className="z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16">
                {/* Left Side */}
                <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-4 py-1.5 font-poppins text-xs font-semibold uppercase tracking-wider text-gold-600"
                    >
                        <span>✨</span> Platform Undangan Autopilot
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl md:text-6xl"
                    >
                        Undangan Pernikahan Digital,
                        <br />
                        <span className="font-sans font-normal italic text-gold-500">
                            Elegan &amp; Siap Kirim
                        </span>
                        <br />
                        dalam 10 Menit
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mb-10 max-w-xl font-sans text-base leading-relaxed text-charcoal/70 sm:text-lg md:text-xl"
                    >
                        Buat website undangan pernikahan premium kamu sendiri
                        dengan mudah, cepat, dan otomatis. Bagikan momen bahagia
                        kepada tamu dengan satu sentuhan.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
                    >
                        <Button
                            size="lg"
                            variant="primary"
                            className="w-full px-10 sm:w-auto"
                        >
                            Buat Undangan Sekarang
                        </Button>
                        <a
                            href="#catalog"
                            className="w-full rounded-full border border-charcoal/10 px-10 py-3.5 text-center font-poppins font-medium text-charcoal transition-all duration-300 hover:border-gold-500 hover:bg-gold-50/50 hover:text-gold-600 sm:w-auto"
                        >
                            Lihat Contoh
                        </a>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-10 flex items-center gap-6 font-poppins text-xs text-charcoal/40"
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="text-gold-500">★★★★★</span> 4.9/5
                        </span>
                        <span className="h-4 w-px bg-charcoal/15" />
                        <span>10.000+ Pasangan</span>
                        <span className="h-4 w-px bg-charcoal/15" />
                        <span>30 Hari Garansi</span>
                    </motion.div>
                </div>

                {/* Right Side: Card Stack */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 35 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.4,
                    }}
                    className="relative mt-10 flex min-h-[460px] w-full items-center justify-center lg:col-span-5 lg:mt-0"
                >
                    <div className="pointer-events-none absolute inset-0 z-0 scale-75 rounded-full bg-gold-200/10 blur-3xl" />

                    <TiltCard className="relative z-10 aspect-[9/14] w-full max-w-[280px] cursor-grab active:cursor-grabbing sm:max-w-[300px]">
                        {/* Card 1: Back */}
                        <div className="pointer-events-none absolute inset-0 flex -translate-x-6 translate-y-4 -rotate-6 select-none flex-col justify-between rounded-3xl border border-gold-500/30 bg-slate-900 p-6 text-gold-200/60 opacity-50 shadow-xl">
                            <div className="flex items-start justify-between">
                                <span className="font-sans text-xs italic">
                                    Royal Theme
                                </span>
                                <Heart size={14} className="fill-current" />
                            </div>
                            <div className="my-auto text-center">
                                <h4 className="font-sans text-lg font-bold">
                                    R &amp; K
                                </h4>
                            </div>
                            <div className="border-t border-gold-500/20 pt-3 text-center font-mono text-[9px]">
                                NGATURI.ID
                            </div>
                        </div>

                        {/* Card 2: Middle */}
                        <div className="rotate-4 pointer-events-none absolute inset-0 flex -translate-y-2 translate-x-4 select-none flex-col justify-between rounded-3xl border border-[#8fa89b]/40 bg-[#eef3f0] p-6 text-[#2d4030]/70 opacity-85 shadow-xl">
                            <div className="flex items-start justify-between">
                                <span className="font-sans text-[10px] font-semibold tracking-wider">
                                    Foliage Theme
                                </span>
                                <Sparkles
                                    size={14}
                                    className="text-[#5b7a68]"
                                />
                            </div>
                            <div className="my-auto text-center">
                                <span className="font-sans text-xs italic">
                                    The Wedding of
                                </span>
                                <h4 className="mt-1 font-display text-base font-bold">
                                    Reno &amp; Kirana
                                </h4>
                            </div>
                            <div className="border-t border-[#8fa89b]/20 pt-3 text-center font-mono text-[9px]">
                                12.10.2026
                            </div>
                        </div>

                        {/* Card 3: Front — dengan floral bg */}
                        <div className="absolute inset-0 flex rotate-0 select-none flex-col justify-between overflow-hidden rounded-3xl border border-gold-300/40 bg-white p-6 text-charcoal shadow-2xl transition-colors duration-300 hover:border-gold-400">
                            <img
                                src="/assets/wedding/hero-floral.png"
                                alt=""
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08]"
                            />

                            <div className="relative z-10 flex items-center justify-between font-poppins text-[10px] font-semibold uppercase tracking-widest text-gold-600">
                                <span>Save The Date</span>
                                <Calendar size={12} className="text-gold-500" />
                            </div>

                            <div className="relative z-10 my-auto flex flex-col items-center text-center">
                                <img
                                    src="/assets/wedding/ornaments.png"
                                    alt=""
                                    aria-hidden="true"
                                    className="pointer-events-none mb-2 h-10 w-10 opacity-25"
                                />
                                <span className="font-sans text-xs italic text-charcoal/50">
                                    The Wedding of
                                </span>
                                <h4 className="mb-1 mt-1.5 font-sans text-xl font-bold tracking-wide text-gold-600">
                                    Reno &amp; Kirana
                                </h4>
                                <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-charcoal/40">
                                    Jakarta, Indonesia
                                </p>
                            </div>

                            <div className="relative z-10 flex flex-col items-center border-t border-gray-100 pt-4">
                                <div className="shadow-xs w-full rounded-full bg-gold-500 py-2 text-center font-poppins text-[10px] font-medium uppercase tracking-widest text-white">
                                    Buka Undangan
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer select-none flex-col items-center gap-1 text-charcoal/50"
                onClick={() =>
                    document
                        .getElementById('problem')
                        ?.scrollIntoView({ behavior: 'smooth' })
                }
            >
                <span className="font-poppins text-xs font-semibold uppercase tracking-widest">
                    Scroll Down
                </span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <ChevronDown size={18} />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
