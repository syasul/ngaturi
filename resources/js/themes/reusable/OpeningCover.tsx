import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
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
    const [isOpening, setIsOpening] = useState(false);

    // Theme styling definitions
    let containerBg = 'bg-[#FAF7F2] text-[#2C2C2C]';
    let cardBg = 'bg-white/80 border-[#C9A84C]/20';
    let buttonStyle =
        'bg-[#C9A84C] hover:bg-[#a8822c] text-white shadow-[#C9A84C]/20';
    let fontTitle = 'font-serif';

    if (themeId === 'rustic') {
        containerBg = 'bg-[#F5EDE3] text-[#3D352E]';
        cardBg = 'bg-[#FAF6F0]/90 border-[#D4956A]/30';
        buttonStyle =
            'bg-[#8B6914] hover:bg-[#705510] text-[#F5EDE3] shadow-amber-800/10';
        fontTitle = 'font-handwriting'; // Dancing Script style
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
    } else if (themeId === 'burgundy-bloom' || themeId === 'theme-1') {
        // Costume / Jalinsava Kostum Theme
        containerBg = 'bg-[#FAF3EC] text-[#2D1A1E]';
        cardBg = 'bg-[#FAF3EC]/95 border-[#D4AF37]/45 shadow-lg';
        buttonStyle =
            'bg-[#6B1D2F] hover:bg-[#5E0F20] text-[#FCF9F6] border border-[#D4AF37]/40 shadow-2xl'; // Tombol merah burgundy membulat (Gambar 2)
        fontTitle = 'font-serif font-bold italic';
    }

    const handleOpenClick = () => {
        setIsOpening(true);
        setTimeout(() => {
            onOpen();
        }, 800); // 800ms delay for envelope opening transition
    };

    const isTheme1 = themeId === 'burgundy-bloom' || themeId === 'theme-1';

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-40 flex select-none flex-col items-center overflow-hidden px-6 py-12 text-center ${containerBg}`}
        >
            {/* Background for theme-1 */}
            {isTheme1 && (
                <>
                    {/* Pink 3D embossed floral backdrop */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700"
                        style={{
                            backgroundImage:
                                "url('/assets/theme_1/1780080644951-nj4yyf-Gemini_Generated_Image_avw4y4avw4y4avw4.webp')",
                            opacity: isOpening ? 0.3 : 0.85,
                        }}
                    />
                    <div className="absolute inset-0 z-[1] bg-black/5" />
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

            {isTheme1 ? (
                /* ===== THEME-1 CUSTOM LAYOUT WITH Z-INDEX OVERLAP ===== */
                <div className="relative z-10 flex h-full w-full flex-1 flex-col items-center justify-between">
                    {/* 1. AMPLOP DI LAYER BELAKANG (z-10 absolute) */}
                    {/* Menggunakan inset-0 dan ditarik scale-nya agar besar memenuhi layar tanpa merusak susunan teks */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                        animate={
                            isOpening
                                ? { scale: 1.35, y: 40, opacity: 0 }
                                : { scale: 1.22 }
                        }
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
                        <img
                            src={'/assets/wedding/burgundy-envelope-closed.png'}
                            alt="Envelope"
                            className="pointer-events-auto h-auto w-[110%] max-w-[28rem] object-contain drop-shadow-2xl"
                        />
                    </motion.div>

                    {/* 2. TEKS DI LAYER DEPAN (z-20 relative) */}
                    {/* Grup Atas: Inisial & Invited */}
                    <div className="relative z-20 mt-1 flex flex-col items-center">
                        <motion.div
                            className="flex flex-col items-center"
                            animate={
                                isOpening
                                    ? { y: -60, opacity: 0 }
                                    : { y: 0, opacity: 1 }
                            }
                            transition={{ duration: 0.5 }}
                        >
                            <h1
                                className="mr-10 text-8xl leading-[0.7]"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: 'rgba(107,29,47,0.22)',
                                }}
                            >
                                {(groomName || 'I')[0]}
                            </h1>
                            <h1
                                className="-mt-2 ml-10 text-8xl leading-[0.7]"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: 'rgba(107,29,47,0.22)',
                                }}
                            >
                                {(brideName || 'B')[0]}
                            </h1>
                        </motion.div>

                        <motion.div
                            className="mt-6 flex flex-col items-center"
                            animate={
                                isOpening
                                    ? { y: -30, opacity: 0 }
                                    : { y: 0, opacity: 1 }
                            }
                            transition={{ duration: 0.5, delay: 0.05 }}
                        >
                            <p
                                className="mb-1 text-2xl italic"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: '#6B1D2F',
                                }}
                            >
                                You&apos;re
                            </p>
                            <h2
                                className="text-3xl font-black uppercase tracking-[0.15em]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: '#6B1D2F',
                                }}
                            >
                                INVITED
                            </h2>
                        </motion.div>
                    </div>

                    {/* Grup Bawah: Nama Tamu & Tombol */}
                    <div className="relative z-20 mb-2 flex w-full flex-col items-center space-y-6">
                        <motion.div
                            className="flex flex-col items-center"
                            animate={
                                isOpening
                                    ? { scale: 0.9, opacity: 0 }
                                    : { scale: 1, opacity: 1 }
                            }
                            transition={{ duration: 0.5 }}
                        >
                            <p
                                className="mb-1 text-sm font-medium"
                                style={{ color: 'rgba(107,29,47,0.7)' }}
                            >
                                Dear,
                            </p>
                            <h3
                                className="mb-1 text-center text-2xl font-bold italic"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: '#6B1D2F',
                                }}
                            >
                                {guestName || 'Tamu Undangan'}
                            </h3>
                            <p
                                className="px-6 text-center text-[10px] italic leading-relaxed"
                                style={{ color: 'rgba(107,29,47,0.6)' }}
                            >
                                We apologize if there is any misspelling of name
                                or title
                            </p>
                        </motion.div>

                        <motion.div
                            animate={
                                isOpening
                                    ? { y: 50, opacity: 0 }
                                    : { y: 0, opacity: 1 }
                            }
                            transition={{ duration: 0.5 }}
                        >
                            <Button
                                variant="primary"
                                onClick={handleOpenClick}
                                className={`flex transform items-center justify-center rounded-full px-12 py-3.5 text-xs font-bold uppercase tracking-[0.25em] shadow-xl transition-all duration-300 active:scale-95 ${buttonStyle}`}
                            >
                                <span>LET&apos;S OPEN</span>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            ) : (
                /* ===== DEFAULT LAYOUT (other themes) ===== */
                <>
                    {/* Invitation Header */}
                    <motion.div
                        className="z-10 mt-8 space-y-4"
                        animate={
                            isOpening
                                ? { y: -50, opacity: 0 }
                                : { y: 0, opacity: 1 }
                        }
                        transition={{ duration: 0.5 }}
                    >
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#a8822c]">
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
                    </motion.div>

                    {/* Guest Card Panel */}
                    <motion.div
                        className={`z-10 w-full max-w-sm space-y-4 rounded-3xl border px-8 py-6 shadow-sm backdrop-blur ${cardBg}`}
                        animate={
                            isOpening
                                ? { scale: 0.9, opacity: 0 }
                                : { scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 0.5 }}
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
                            Tanpa mengurangi rasa hormat, kami mengundang Anda
                            untuk hadir di hari bahagia kami.
                        </p>
                    </motion.div>

                    {/* Open Button */}
                    <motion.div
                        className="z-10 mb-8"
                        animate={
                            isOpening
                                ? { y: 50, opacity: 0 }
                                : { y: 0, opacity: 1 }
                        }
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            variant="primary"
                            onClick={handleOpenClick}
                            className={`flex transform items-center justify-center rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300 active:scale-95 ${buttonStyle}`}
                        >
                            <span>Buka Undangan</span>
                        </Button>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default OpeningCover;
