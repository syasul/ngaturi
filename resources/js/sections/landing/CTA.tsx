import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import React from 'react';

export const CTA: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#252320] to-[#121110] py-28 text-white">
            {/* Floral overlay */}
            <img
                src="/assets/wedding/hero-floral.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.07]"
                style={{ mixBlendMode: 'luminosity' }}
            />
            {/* Ornament corners */}
            <img
                src="/assets/wedding/ornaments.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 w-44 select-none opacity-[0.1]"
            />
            <img
                src="/assets/wedding/ornaments.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 w-44 rotate-180 select-none opacity-[0.1]"
            />

            {/* Golden radial glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-[100px]" />

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <Sparkles className="h-5 w-5 animate-pulse text-gold-300" />
                </div>

                <h2 className="mb-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                    Hari Spesial Kalian
                    <br />
                    Layak Dirayakan dengan Indah
                </h2>

                <p className="mb-10 max-w-xl font-sans text-sm leading-relaxed text-[#e2cca6]/80 sm:text-base md:text-lg">
                    Buat draft undangan digital secara gratis sekarang. Desain
                    sesuka hati dan pilih paket pembayaran setelah Anda
                    benar-benar puas dengan hasilnya.
                </p>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative z-10 cursor-pointer rounded-full bg-white px-10 py-3.5 font-poppins text-sm font-bold text-charcoal shadow-lg transition-all duration-300 hover:bg-gold-100 hover:shadow-xl sm:text-base"
                >
                    Mulai Gratis Sekarang
                </motion.button>

                <span className="mt-5 font-poppins text-[10px] font-semibold uppercase tracking-widest text-[#e2cca6]/55 sm:text-xs">
                    Tanpa biaya setup awal · Batalkan kapan saja
                </span>
            </div>
        </section>
    );
};

export default CTA;
