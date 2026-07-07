import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import React from 'react';
import Button from '../../components/ui/Button';

interface OpeningCoverProps {
    groomName: string;
    brideName: string;
    guestName?: string;
    themeId: string;
    onOpen: () => void;
}

export const OpeningCover: React.FC<OpeningCoverProps> = ({
    groomName,
    brideName,
    guestName,
    themeId,
    onOpen,
}) => {
    // Theme styling definitions
    let containerBg = 'bg-[#FAF7F2] text-[#2C2C2C]';
    let cardBg = 'bg-white/80 border-gold-500/20';
    let buttonStyle =
        'bg-gold-500 hover:bg-gold-600 text-white shadow-gold-500/20';
    let fontTitle = 'font-serif';

    if (themeId === 'rustic') {
        containerBg = 'bg-[#F5EDE3] text-[#3D352E]';
        cardBg = 'bg-[#FAF6F0]/90 border-[#D4956A]/30';
        buttonStyle =
            'bg-[#8B6914] hover:bg-[#705510] text-[#F5EDE3] shadow-amber-800/10';
        fontTitle = 'font-cursive'; // Dancing Script style
    } else if (themeId === 'modern') {
        containerBg = 'bg-[#FFFFFF] text-[#111111]';
        cardBg = 'bg-neutral-50 border-neutral-200';
        buttonStyle =
            'bg-black hover:bg-neutral-900 text-white shadow-black/10';
        fontTitle = 'font-sans font-black tracking-tight'; // Poppins style
    } else if (themeId === 'royal-yogyakarta') {
        containerBg = 'bg-[#FFF8F4] text-[#3D261F]';
        cardBg = 'bg-white/85 border-[#D8B76A]/35';
        buttonStyle =
            'bg-[#B68A2C] hover:bg-[#9C7424] text-white shadow-[#B68A2C]/20';
        fontTitle = 'font-serif font-bold';
    } else if (themeId === 'botanical-minimal') {
        containerBg = 'bg-[#F4F7F1] text-[#203429]';
        cardBg = 'bg-white/90 border-[#6D8B63]/20';
        buttonStyle =
            'bg-[#6D8B63] hover:bg-[#57704F] text-white shadow-[#6D8B63]/20';
        fontTitle = 'font-serif font-semibold';
    } else if (themeId === 'editorial-mono') {
        containerBg = 'bg-[#F7F5F0] text-[#151515]';
        cardBg = 'bg-white border-neutral-300';
        buttonStyle =
            'bg-[#151515] hover:bg-[#2A2A2A] text-white shadow-black/10';
        fontTitle = 'font-sans font-black uppercase tracking-tight';
    } else if (themeId === 'burgundy-bloom') {
        containerBg = 'bg-[#3A0511] text-[#FCF9F6]';
        cardBg = 'bg-white/95 border-[#D4AF37]/35 shadow-lg';
        buttonStyle =
            'bg-[#6B1D2F] hover:bg-[#5E0F20] text-[#FCF9F6] border border-[#D4AF37]/40 shadow-xl';
        fontTitle = 'font-serif font-bold italic';
    }

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-40 flex select-none flex-col items-center justify-between overflow-hidden px-6 py-16 text-center ${containerBg}`}
        >
            {/* Decorative Ornaments */}
            {themeId === 'burgundy-bloom' && (
                <>
                    <div className="absolute inset-0 z-0 bg-[url('/assets/wedding/burgundy-envelope-closed.png')] bg-cover bg-center opacity-85" />
                    <div className="absolute inset-0 z-[1] bg-black/30" />
                </>
            )}
            {themeId === 'elegant' && (
                <>
                    <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 bg-[url('/ornaments/flower-top-left.svg')] bg-contain bg-no-repeat opacity-20" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 bg-[url('/ornaments/flower-bottom-right.svg')] bg-contain bg-no-repeat opacity-20" />
                </>
            )}
            {themeId === 'rustic' && (
                <>
                    <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 bg-[url('/ornaments/leaves-top-right.svg')] bg-contain bg-no-repeat opacity-20" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 bg-[url('/ornaments/leaves-bottom-left.svg')] bg-contain bg-no-repeat opacity-20" />
                </>
            )}

            {/* Invitation Header */}
            <div className="z-10 mt-8 space-y-4">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-gold-600/80">
                    THE WEDDING OF
                </span>
                <h1
                    className={`mt-2 text-4xl font-bold tracking-wide md:text-5xl lg:text-6xl ${fontTitle}`}
                >
                    {groomName}{' '}
                    <Heart
                        className="mx-1 inline animate-pulse fill-red-400/10 text-red-400"
                        size={24}
                    />{' '}
                    {brideName}
                </h1>
            </div>

            {/* Guest Card Panel */}
            <div
                className={`z-10 w-full max-w-sm space-y-4 rounded-3xl border px-8 py-6 shadow-sm backdrop-blur ${cardBg}`}
            >
                <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-charcoal/40">
                    Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <div className="py-2">
                    <h3 className="font-sans text-xl font-bold text-charcoal">
                        {guestName || 'Saudara/i, Kerabat & Sahabat'}
                    </h3>
                </div>
                <p className="font-sans text-[10px] leading-relaxed text-charcoal/40">
                    Tanpa mengurangi rasa hormat, kami mengundang Anda untuk
                    hadir di hari bahagia kami.
                </p>
            </div>

            {/* Open Button */}
            <div className="z-10 mb-8">
                <Button
                    variant="primary"
                    onClick={onOpen}
                    className={`flex transform items-center justify-center rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300 active:scale-95 ${buttonStyle}`}
                >
                    <span>Buka Undangan</span>
                </Button>
            </div>
        </motion.div>
    );
};

export default OpeningCover;
