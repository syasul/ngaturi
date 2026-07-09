import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Check,
    Copy,
    CreditCard,
    Heart,
    MapPin,
    Maximize,
    Menu,
    MessageSquare,
    Play,
    QrCode,
    Volume2,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';

const CustomRSVPForm = ({
    onRsvpSubmit,
}: {
    onRsvpSubmit: (status: string, msg: string) => Promise<void>;
}) => {
    const [name, setName] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [status, setStatus] = useState('hadir');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onRsvpSubmit(
                status,
                `Nama: ${name}, Jumlah Tamu: ${guestCount}`,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative z-20 space-y-6 text-left"
        >
            <div>
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="NAMA ANDA"
                    className="w-full border-b border-white/50 bg-transparent px-2 py-2 text-xs text-white placeholder-white/70 transition-colors focus:border-white focus:outline-none"
                />
            </div>
            <div>
                <input
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    type="text"
                    placeholder="JUMLAH TAMU"
                    className="w-full border-b border-white/50 bg-transparent px-2 py-2 text-xs text-white placeholder-white/70 transition-colors focus:border-white focus:outline-none"
                />
            </div>

            <div className="space-y-3 pt-2">
                <label className="font-serif text-[10px] uppercase tracking-widest text-white">
                    Apakah Anda Akan Hadir?
                </label>

                <div
                    onClick={() => setStatus('hadir')}
                    className="flex cursor-pointer items-center justify-between rounded border border-white/30 p-3 transition-colors hover:bg-white/10"
                >
                    <span className="font-serif text-xs text-white">
                        Ya, saya akan hadir
                    </span>
                    <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${status === 'hadir' ? 'border-white' : 'border-white/50'}`}
                    >
                        {status === 'hadir' && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        )}
                    </div>
                </div>

                <div
                    onClick={() => setStatus('tidak_hadir')}
                    className="flex cursor-pointer items-center justify-between rounded border border-white/30 p-3 transition-colors hover:bg-white/10"
                >
                    <span className="font-serif text-xs text-white">
                        Maaf, tidak bisa hadir
                    </span>
                    <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${status === 'tidak_hadir' ? 'border-white' : 'border-white/50'}`}
                    >
                        {status === 'tidak_hadir' && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-white py-4 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
                {loading ? 'MENGIRIM...' : 'KONFIRMASI KEHADIRAN'}
            </button>
        </form>
    );
};

const CustomWishesForm = ({ initialWishes, onRsvpSubmit }: any) => {
    const [wishes, setWishes] = useState<any[]>(initialWishes || []);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setWishes(initialWishes || []);
    }, [initialWishes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !message) return;
        setLoading(true);
        try {
            await onRsvpSubmit('hadir', message); // Basic submit logic mapping to onRsvpSubmit
            setWishes((prev) => [
                {
                    id: Date.now().toString(),
                    name,
                    message,
                    createdAt: new Date().toISOString(),
                    rsvpStatus: 'hadir',
                },
                ...prev,
            ]);
            setName('');
            setMessage('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-20 w-full text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="NAMA ANDA"
                        className="w-full border-b border-white/50 bg-transparent px-2 py-2 text-xs text-white placeholder-white/70 transition-colors focus:border-white focus:outline-none"
                    />
                </div>
                <div>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Tulis ucapan/doa Anda..."
                        className="w-full resize-none border-b border-white/50 bg-transparent px-2 py-2 text-xs text-white placeholder-white/70 transition-colors focus:border-white focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-white py-4 text-[11px] font-bold uppercase tracking-widest text-black shadow-md transition-colors hover:bg-gray-100 disabled:opacity-50"
                >
                    {loading ? 'MENGIRIM...' : 'KIRIM UCAPAN'}
                </button>
            </form>

            <hr className="mb-8 mt-10 border-white/20" />

            <h4 className="mb-6 text-center font-serif text-[11px] font-bold uppercase tracking-widest text-white">
                Ucapan Terbaru
            </h4>

            <div className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent relative h-[300px] overflow-y-auto rounded-2xl border border-white/50 p-4">
                {wishes.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="font-serif text-[11px] italic text-white/70">
                            Belum ada ucapan. Jadilah yang pertama!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wishes.map((wish) => (
                            <div
                                key={wish.id}
                                className="border-b border-white/20 pb-3 last:border-0 last:pb-0"
                            >
                                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-white">
                                    {wish.name}
                                </span>
                                <p className="font-serif text-[11px] italic leading-relaxed text-white/80">
                                    "{wish.message}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const resolveImageUrl = (url: string | null | undefined, fallback: string) => {
    if (!url) return fallback;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    if (
        url.startsWith('storage/') ||
        url.startsWith('assets/') ||
        url.startsWith('images/')
    )
        return `/${url}`;
    return `/storage/${url}`;
};

const Theme1Countdown = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference <= 0)
                return setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
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

    const blocks = [
        { l: 'HARI', v: timeLeft.days },
        { l: 'JAM', v: timeLeft.hours },
        { l: 'MENIT', v: timeLeft.minutes },
        { l: 'DETIK', v: timeLeft.seconds },
    ];

    return (
        <div className="flex scale-[0.85] items-center justify-center gap-1.5 pt-1 text-[#8C1B2F] sm:scale-95 sm:gap-3">
            {blocks.map((b, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                        <span
                            className="text-[1.75rem] font-bold sm:text-4xl"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            {String(b.v).padStart(2, '0')}
                        </span>
                        <span className="mt-0.5 text-[8px] font-bold tracking-widest text-[#8C1B2F]/80 sm:text-[9px]">
                            {b.l}
                        </span>
                    </div>
                    {i < 3 && (
                        <span
                            className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            :
                        </span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Container staggered animation variants
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

// Fade up animation variants
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
};

// Scale in animation variants
const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
};

// Y-axis floating animations
/*
const floatYVariants: Variants = {
    animate: {
        y: [0, -8, 0],
        transition: {
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const floatYVariantsSlow: Variants = {
    animate: {
        y: [0, -5, 0],
        rotate: [0, 1.5, 0],
        transition: {
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
*/

// Date formatter helper
const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Falling Rose Petals Canvas Animation Component (Removed)

export const Theme1: React.FC<ThemeProps> = ({
    data,
    guestName,
    wishes,
    onRsvpSubmit,
}) => {
    const groom = data?.groom || {};
    const bride = data?.bride || {};
    const schedules = data?.schedules || data?.schedule || {};
    const stories = data?.stories || [];
    const quotes = data?.quotes || {};

    // Premium Color Palette
    const primaryColor = '#6B1D2F'; // Burgundy
    const secondaryColor = '#C9A84C'; // Gold
    // const baseBg = '#FAF3EC'; // Soft ivory cream
    const textColor = '#2D1A1E'; // Dark maroon/charcoal

    // States for interaction
    const [copiedGroomBank, setCopiedGroomBank] = useState(false);
    const [copiedBrideBank, setCopiedBrideBank] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isAlbumOpen, setIsAlbumOpen] = useState(false);
    const [giftTab, setGiftTab] = useState<'bank' | 'address'>('bank');
    const [showConfirmationForm, setShowConfirmationForm] = useState(false);
    const [isPlayingMusic, setIsPlayingMusic] = useState(true);
    const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

    const handleCopy = (text: string, type: 'groom' | 'bride') => {
        navigator.clipboard.writeText(text);
        if (type === 'groom') {
            setCopiedGroomBank(true);
            setTimeout(() => setCopiedGroomBank(false), 2000);
        } else {
            setCopiedBrideBank(true);
            setTimeout(() => setCopiedBrideBank(false), 2000);
        }
    };

    const handleCopyAddress = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    // Pre-wedding gallery photolist
    const defaultPhotos = [
        { id: '1', url: '/assets/theme_1/gallery1.webp' },
        { id: '2', url: '/assets/theme_1/gallery2.webp' },
        { id: '3', url: '/assets/theme_1/gallery3.webp' },
        { id: '4', url: '/assets/theme_1/gallery4.webp' },
        { id: '5', url: '/assets/theme_1/gallery6.webp' },
        { id: '6', url: '/assets/theme_1/gallery7.webp' },
        { id: '7', url: '/assets/theme_1/gallery1.webp' },
        { id: '8', url: '/assets/theme_1/gallery2.webp' },
    ];
    // Force default photos for now to match the requested design exactly
    const displayPhotos = defaultPhotos;


    const weddingDate =
        schedules.akad?.date || schedules.resepsi?.date || '2026-09-21';

    // Parse date for hero badges
    const parsedDate = new Date(weddingDate);
    const heroDay = isNaN(parsedDate.getTime()) ? '21' : parsedDate.getDate();
    const heroMonth = isNaN(parsedDate.getTime())
        ? 'September'
        : parsedDate.toLocaleDateString('id-ID', { month: 'long' });
    const heroYear = isNaN(parsedDate.getTime())
        ? '2026'
        : parsedDate.getFullYear();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        const container = document.getElementById(
            'invitation-scroll-container',
        );
        if (element && container) {
            const containerTop = container.getBoundingClientRect().top;
            const elementTop = element.getBoundingClientRect().top;
            container.scrollTo({
                top: container.scrollTop + elementTop - containerTop,
                behavior: 'smooth',
            });
        } else if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-[#FDF5F6] text-[#2D1A1E]">
            {/* ============================================================== */}
            {/* 1. DESKTOP LEFT PANEL (STATIC COVER)                           */}
            {/* ============================================================== */}
            <div className="relative sticky left-0 top-0 hidden h-screen w-[70%] select-none flex-col justify-between overflow-hidden bg-[#3A0511] p-16 text-white lg:flex">
                <div className="absolute left-8 top-8 h-16 w-16 border-l-2 border-t-2 border-[#C9A84C]" />
                <div className="absolute right-8 top-8 h-16 w-16 border-r-2 border-t-2 border-[#C9A84C]" />
                <div className="absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-[#C9A84C]" />
                <div className="absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-[#C9A84C]" />
                <div
                    className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "url('/assets/theme_1/1781084043635-ydzi6u-dfasdfasdfa49.webp')",
                    }}
                />

                <div className="space-y-4">
                    <span className="block font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                        THE WEDDING INVITATION OF
                    </span>
                    <div className="h-[1px] w-12 bg-[#C9A84C]" />
                </div>

                <div className="space-y-6">
                    <h1
                        className="text-7xl font-normal italic leading-tight"
                        style={{
                            fontFamily: "'Dancing Script', cursive",
                            color: '#FAF3EC',
                        }}
                    >
                        {groom.nickname || 'Ilyas'} &{' '}
                        {bride.nickname || 'Iftitah'}
                    </h1>
                    <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-[#FAF3EC]/80">
                        SAVE THE DATE — {formatDate(weddingDate)}
                    </p>
                </div>

                <div className="max-w-md">
                    <p className="text-xs italic leading-relaxed text-[#FAF3EC]/60">
                        "
                        {quotes.text ||
                            'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...'}
                        "
                        {quotes.source && (
                            <span className="mt-2 block font-bold not-italic text-[#C9A84C]">
                                {quotes.source}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* ============================================================== */}
            {/* 2. RIGHT PANEL (SCROLLABLE MOBILE INVITATION)                  */}
            {/* ============================================================== */}
            <div className="relative h-screen w-full overflow-hidden bg-[#FAF3EC] lg:w-[30%]">
                <div
                    className="h-full w-full overflow-y-auto scroll-smooth"
                    id="invitation-scroll-container"
                >
                    <section
                        id="home"
                        className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden pb-24 pt-12"
                    >
                        {/* MAIN BUNDLED BACKGROUND */}
                        <motion.div
                            className="relative z-10 mx-auto mt-4 flex w-[90%] max-w-[500px] flex-col items-center bg-contain bg-center bg-no-repeat @container"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_1/bundled-bg-section1.png')",
                                aspectRatio: '614/1024',
                            }}
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 1.2,
                                        ease: [0.25, 1, 0.5, 1],
                                    },
                                },
                            }}
                        >
                            {/* ABSOLUTE POSITIONED DYNAMIC TEXT OVERLAYS */}

                            {/* Main Arch Names */}
                            <div className="absolute top-[45%] flex w-[60%] flex-col items-center text-center">
                                <span
                                    className="mb-3 font-sans text-[2.4cqw] font-medium tracking-[0.2em]"
                                    style={{ color: '#666' }}
                                >
                                    The Wedding of
                                </span>
                                <h2
                                    className="text-[10.5cqw] font-normal italic leading-none tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    {groom.nickname || 'Virga'}
                                </h2>
                                <span
                                    className="my-1 font-serif text-[5.7cqw] italic"
                                    style={{ color: primaryColor }}
                                >
                                    &
                                </span>
                                <h2
                                    className="text-[10.5cqw] font-normal italic leading-none tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    {bride.nickname || 'Iftitah'}
                                </h2>
                            </div>

                            {/* Date Badge text (bottom-left) */}
                            <div className="absolute bottom-[12%] left-[12%] flex aspect-square w-[33%] flex-col items-center justify-center text-white drop-shadow-md">
                                <span className="-mb-3 mt-2 font-serif text-[10.7cqw] font-bold">
                                    {heroDay}
                                </span>
                                <span
                                    className="my-0.5 text-[4.8cqw] italic"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                    }}
                                >
                                    {heroMonth}
                                </span>
                                <span className="font-sans text-[3.8cqw] font-semibold tracking-widest opacity-90">
                                    {heroYear}
                                </span>
                            </div>

                            {/* Initials Badge text (bottom-right) */}
                            <div className="absolute bottom-[3%] right-[5%] flex aspect-square w-[33%] items-center justify-center text-white drop-shadow-md">
                                <span
                                    className="mt-2 text-[12.2cqw] font-normal italic tracking-wider"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                    }}
                                >
                                    {(groom.nickname || 'V')[0]}
                                    {(bride.nickname || 'B')[0]}
                                </span>
                            </div>
                        </motion.div>
                        {/* Horse Carriage Watermark (Mirrored) */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { delay: 1.8, duration: 1 },
                                },
                            }}
                            className="pointer-events-none relative z-10 -mt-24 flex w-[90%] max-w-[500px] justify-end"
                            initial="hidden"
                            animate="visible"
                        >
                            <img
                                src="/assets/theme_1/kuda-outline.webp"
                                alt="Carriage watermark"
                                className="h-auto w-[90%] object-contain opacity-30"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                        </motion.div>
                    </section>

                    {/* B. BRIDE & GROOM PROFILE SECTION */}
                    <section
                        id="couple"
                        className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-x-clip bg-[#FDF5F6] pb-32 pt-12"
                    >
                        {/* The Groom & The Bride Heading */}
                        <motion.div
                            variants={fadeUpVariants}
                            className="z-10 mb-8 flex w-full max-w-[380px] flex-col items-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <div className="relative mx-auto mb-6 mt-4 h-[1px] w-[80%] bg-[#5C061C]/30">
                                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#5C061C]/60" />
                            </div>

                            {/* Title Wrapper */}
                            <div className="relative flex w-full max-w-[320px] select-none flex-col justify-center px-6 pb-6 pt-2">
                                {/* Background Ampersand */}
                                <span
                                    className="pointer-events-none absolute left-[55%] top-[40%] -translate-x-1/2 -translate-y-1/2 select-none text-[100px] font-light italic opacity-[0.08]"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        color: '#5C061C',
                                    }}
                                >
                                    &
                                </span>

                                {/* The Groom */}
                                <h2
                                    className="text-4xl font-bold leading-tight text-[#5C061C]"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        marginRight: 'auto',
                                        textShadow:
                                            '1px 1px 2px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    The Groom
                                </h2>

                                {/* The Bride */}
                                <h2
                                    className="mt-2 text-4xl leading-tight text-[#5C061C]"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        marginLeft: 'auto',
                                        textShadow:
                                            '1px 1px 2px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    The Bride
                                </h2>
                            </div>
                        </motion.div>

                        {/* SCALLOPED CARD */}
                        {/* SCALLOPED CARD */}
                        <motion.div
                            className="relative z-10 -mx-[11%] mx-auto -mt-14 mb-6 flex w-[122%] max-w-[490px] flex-col items-center justify-center @container"
                            style={{ aspectRatio: '550 / 660' }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={scaleInVariants}
                        >
                            {/* Background Image of the Card */}
                            <img
                                src="/assets/theme_1/bg-section2.webp"
                                className="absolute inset-0 z-0 h-full w-full object-fill drop-shadow-2xl"
                                alt="Card Background"
                            />

                            {/* Ribbon Ornament (Responsive) */}
                            <img
                                src="/assets/theme_1/pita.webp"
                                className="absolute left-[13%] top-[4%] z-20 h-auto w-[18%] object-contain drop-shadow-md"
                                alt="Ribbon"
                            />

                            {/* Content inside the card (Absolutely positioned to fit aspect-ratio) */}
                            <div className="absolute bottom-[16%] left-[22%] right-[22%] top-[12%] z-10 flex select-none flex-col items-center justify-between text-center">
                                <img
                                    src="/assets/theme_1/bismillah.webp"
                                    className="h-[5%] w-auto object-contain opacity-95 brightness-[3]"
                                    alt="Basmalah"
                                />

                                <div className="flex flex-col items-center space-y-[0.5%]">
                                    <p className="text-[3.6cqw] font-semibold tracking-wide text-[#FAF3EC] opacity-90">
                                        Assalamualaikum wbt
                                    </p>
                                    <p className="px-[1%] text-[2.6cqw] leading-relaxed text-[#FAF3EC] opacity-80">
                                        Dengan penuh rasa syukur, kami
                                        mengundang Anda untuk menghadiri acara
                                        pernikahan putra & putri kami.
                                    </p>
                                </div>

                                {/* Groom */}
                                <div className="flex flex-col items-center">
                                    {/* <div className="mb-1.5 h-[14cqw] w-[14cqw] overflow-hidden rounded-full border-[1.5px] border-[#C9A84C]/60 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                                    <img
                                        src={resolveImageUrl(groom.photo, '/assets/theme_1/foto-mempelai-pria.webp')}
                                        alt={groom.nickname || 'Groom'}
                                        className="h-full w-full object-cover"
                                    />
                                </div> */}
                                    <h3
                                        className="text-[5.5cqw] font-semibold leading-tight"
                                        style={{
                                            fontFamily:
                                                "'Dancing Script', cursive",
                                            color: '#FAF3EC',
                                        }}
                                    >
                                        {groom.name ||
                                            'Virga A. Handsome, S.Kom'}
                                    </h3>
                                    <p className="text-[2.4cqw] italic text-[#C9A84C]">
                                        The Son of
                                    </p>
                                    <p className="mx-auto mt-0.5 max-w-[85%] text-[2.4cqw] leading-relaxed text-[#FAF3EC] opacity-80">
                                        {groom.parents ||
                                            'Mr. Aghala Gola & Mrs. Egela Egle'}
                                    </p>
                                </div>

                                {/* Ampersand */}
                                <span
                                    className="my-0.5 text-[4.5cqw] leading-none opacity-80"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        color: '#FAF3EC',
                                    }}
                                >
                                    &
                                </span>

                                {/* Bride */}
                                <div className="flex flex-col items-center">
                                    {/* <div className="mb-1.5 h-[14cqw] w-[14cqw] overflow-hidden rounded-full border-[1.5px] border-[#C9A84C]/60 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                                    <img
                                        src={resolveImageUrl(bride.photo, '/assets/theme_1/foto-mempelai-cewe.webp')}
                                        alt={bride.nickname || 'Bride'}
                                        className="h-full w-full object-cover"
                                    />
                                </div> */}
                                    <h3
                                        className="text-[5.5cqw] font-semibold leading-tight"
                                        style={{
                                            fontFamily:
                                                "'Dancing Script', cursive",
                                            color: '#FAF3EC',
                                        }}
                                    >
                                        {bride.name ||
                                            'Iftitah C. Beauty, S.Kom'}
                                    </h3>
                                    <p className="text-[2.4cqw] italic text-[#C9A84C]">
                                        The Daughter of
                                    </p>
                                    <p className="mx-auto mt-0.5 max-w-[85%] text-[2.4cqw] leading-relaxed text-[#FAF3EC] opacity-80">
                                        {bride.parents ||
                                            'Bapak Lord Capulet & Ibu Lady Capulet'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom Elements: Horse Carriage, Flowers, Love text */}
                        <div className="pointer-events-none absolute -bottom-10 left-0 right-0 z-0 flex h-64 flex-col items-center justify-end">
                            <img
                                src="/assets/theme_1/kuda-outline.webp"
                                className="absolute -bottom-8 -left-10 h-auto w-[85%] max-w-[500px] object-contain opacity-25"
                                alt="Horse Carriage Bottom"
                            />
                            <img
                                src="/assets/theme_1/kumpulanbunga1.webp"
                                className="absolute -bottom-16 right-0 z-10 h-32 w-auto object-contain drop-shadow-md"
                                alt="Flowers"
                            />
                        </div>
                    </section>

                    {/* C. KISAH CINTA TIMELINE SECTION */}
                    {stories.length > 0 && (
                        <section
                            id="story"
                            className="relative overflow-hidden bg-[#FDF5F6] px-0 py-16"
                        >
                            <motion.div
                                className="mx-auto w-full max-w-sm space-y-0"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.05 }}
                                variants={containerVariants}
                            >
                                {/* Mixed typography heading */}
                                <motion.div
                                    variants={fadeUpVariants}
                                    className="relative flex flex-col items-center px-6 pb-12 pt-8"
                                >
                                    {/* Floral top-right decoration */}
                                    <div
                                        className="absolute -top-8 right-0 z-10 h-32 w-32 bg-contain bg-no-repeat opacity-90"
                                        style={{
                                            backgroundImage:
                                                "url('/assets/theme_1/kumpulanbunga2.webp')",
                                            backgroundPosition: 'top right',
                                        }}
                                    />
                                    <div className="relative mt-4 flex flex-col items-center">
                                        <h2
                                            className="relative z-20 text-[3.5rem] font-black leading-none"
                                            style={{
                                                color: '#5C061C',
                                                fontFamily:
                                                    "'Cormorant Garamond', serif",
                                            }}
                                        >
                                            Love
                                        </h2>
                                        <h2
                                            className="relative z-20 -mt-4 ml-24 text-[4rem] leading-none"
                                            style={{
                                                fontFamily:
                                                    "'Dancing Script', cursive",
                                                color: '#5C061C',
                                            }}
                                        >
                                            Story
                                        </h2>
                                    </div>
                                </motion.div>
                                {/* Stories with photo frames */}
                                <div className="relative w-full">
                                    {/* Winding thread line */}
                                    <div className="pointer-events-none absolute inset-0 z-0 flex justify-center opacity-90">
                                        <div
                                            className="h-full w-[20%] max-w-[200px]"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/line.webp')",
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '100% 100%',
                                                backgroundPosition:
                                                    'top center',
                                            }}
                                        />
                                    </div>

                                    <div className="relative z-10 space-y-10 py-12">
                                        {stories.map(
                                            (story: any, idx: number) => {
                                                const isEven = idx % 2 === 0;
                                                const fallbackPhoto = isEven
                                                    ? '/assets/theme_1/foto-mempelai-pria.webp'
                                                    : '/assets/theme_1/foto-mempelai-cewe.webp';
                                                const rawPhotoUrl =
                                                    story.imageUrl ||
                                                    story.image_url ||
                                                    story.image ||
                                                    fallbackPhoto;
                                                const photo = resolveImageUrl(
                                                    rawPhotoUrl,
                                                    fallbackPhoto,
                                                );

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="relative flex w-full items-start justify-between px-2 sm:px-4"
                                                    >
                                                        {isEven ? (
                                                            /* Even (e.g. 2019): photo left, text right */
                                                            <>
                                                                <motion.div
                                                                    className="relative z-10 flex w-[45%] justify-start pt-12"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        x: -40,
                                                                    }}
                                                                    whileInView={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                    }}
                                                                    viewport={{
                                                                        once: true,
                                                                        amount: 0.3,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.8,
                                                                        type: 'spring',
                                                                        bounce: 0.3,
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            photo
                                                                        }
                                                                        className="aspect-[4/5] w-full max-w-[115px] rounded-[2rem] object-cover shadow-xl"
                                                                        alt={
                                                                            story.title
                                                                        }
                                                                    />
                                                                </motion.div>
                                                                <motion.div
                                                                    className="flex w-[45%] flex-col items-end"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        x: 40,
                                                                    }}
                                                                    whileInView={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                    }}
                                                                    viewport={{
                                                                        once: true,
                                                                        amount: 0.3,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.8,
                                                                        type: 'spring',
                                                                        bounce: 0.3,
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="mb-2 block w-full text-right text-[4.5rem] font-thin italic leading-none text-[#E5B5B5]"
                                                                        style={{
                                                                            fontFamily:
                                                                                "'Cormorant Garamond', serif",
                                                                        }}
                                                                    >
                                                                        {story.year ||
                                                                            story.date}
                                                                    </span>
                                                                    <p className="w-full text-right text-[11.5px] font-bold leading-relaxed text-[#5C061C] sm:text-[12.5px]">
                                                                        "
                                                                        {story.content ||
                                                                            story.story}
                                                                        "
                                                                    </p>
                                                                </motion.div>
                                                            </>
                                                        ) : (
                                                            /* Odd (e.g. 2022): text left, photo right */
                                                            <>
                                                                <motion.div
                                                                    className="flex w-[45%] flex-col items-start"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        x: -40,
                                                                    }}
                                                                    whileInView={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                    }}
                                                                    viewport={{
                                                                        once: true,
                                                                        amount: 0.3,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.8,
                                                                        type: 'spring',
                                                                        bounce: 0.3,
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="mb-2 block w-full text-left text-[4.5rem] font-thin italic leading-none text-[#E5B5B5]"
                                                                        style={{
                                                                            fontFamily:
                                                                                "'Cormorant Garamond', serif",
                                                                        }}
                                                                    >
                                                                        {story.year ||
                                                                            story.date}
                                                                    </span>
                                                                    <p className="w-full text-left text-[11.5px] font-bold leading-relaxed text-[#5C061C] sm:text-[12.5px]">
                                                                        "
                                                                        {story.content ||
                                                                            story.story}
                                                                        "
                                                                    </p>
                                                                </motion.div>
                                                                <motion.div
                                                                    className="relative z-10 flex w-[45%] justify-end pt-12"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        x: 40,
                                                                    }}
                                                                    whileInView={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                    }}
                                                                    viewport={{
                                                                        once: true,
                                                                        amount: 0.3,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.8,
                                                                        type: 'spring',
                                                                        bounce: 0.3,
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            photo
                                                                        }
                                                                        className="aspect-[4/5] w-full max-w-[115px] rounded-[2rem] object-cover shadow-xl"
                                                                        alt={
                                                                            story.title
                                                                        }
                                                                    />
                                                                </motion.div>
                                                            </>
                                                        )}

                                                        {/* Decorators */}
                                                        {idx === 0 && (
                                                            <div className="bottom-30 absolute left-1/2 z-20 -translate-x-1/2">
                                                                <img
                                                                    src="/assets/theme_1/bunga.webp"
                                                                    className="h-24 w-24 object-contain drop-shadow-md"
                                                                    alt="flower"
                                                                />
                                                            </div>
                                                        )}
                                                        {idx === 1 && (
                                                            <div className="absolute -bottom-10 left-[48%] z-20 -translate-x-1/2">
                                                                <img
                                                                    src="/assets/theme_1/kupu1.webp"
                                                                    className="h-14 w-14 -rotate-12 transform object-contain drop-shadow-md"
                                                                    alt="butterfly"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                {/* Sticky Note for the Last Story (Rendered AFTER the line wrapper) */}
                                {stories.length > 0 &&
                                    (() => {
                                        const lastStory =
                                            stories[stories.length - 1];
                                        const lastFallback =
                                            (stories.length - 1) % 2 === 0
                                                ? '/assets/theme_1/foto-mempelai-pria.webp'
                                                : '/assets/theme_1/foto-mempelai-cewe.webp';
                                        const lastPhotoUrl =
                                            lastStory.imageUrl ||
                                            lastStory.image_url ||
                                            lastStory.image ||
                                            lastFallback;
                                        return (
                                            <div className="relative z-20 mt-12 flex w-full flex-col items-center px-4">
                                                <div className="relative w-full max-w-[550px]">
                                                    {/* Last Year Header */}
                                                    <span
                                                        className="mb-2 block w-full text-left text-[4.5rem] font-thin italic leading-none text-[#E5B5B5]"
                                                        style={{
                                                            fontFamily:
                                                                "'Cormorant Garamond', serif",
                                                        }}
                                                    >
                                                        {lastStory.year ||
                                                            lastStory.date}
                                                    </span>

                                                    <div className="relative mt-4 flex w-full items-center justify-start">
                                                        {/* Sliding Photo (Behind) */}
                                                        <motion.div
                                                            className="absolute right-0 top-[35%] z-10 w-[35%] -translate-y-1/2"
                                                            initial={{
                                                                opacity: 0,
                                                                x: -100,
                                                                rotate: 0,
                                                            }}
                                                            whileInView={{
                                                                opacity: 1,
                                                                x: 0,
                                                                rotate: 15,
                                                            }}
                                                            viewport={{
                                                                once: true,
                                                                amount: 0.3,
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                                delay: 0.3,
                                                                type: 'spring',
                                                                bounce: 0.3,
                                                            }}
                                                        >
                                                            <img
                                                                src={resolveImageUrl(
                                                                    lastPhotoUrl,
                                                                    lastFallback,
                                                                )}
                                                                className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl"
                                                                alt={
                                                                    lastStory.title ||
                                                                    'Story'
                                                                }
                                                            />
                                                        </motion.div>

                                                        {/* Sticky Note (Front) */}
                                                        <motion.div
                                                            className="relative z-20 w-[75%]"
                                                            initial={{
                                                                opacity: 0,
                                                                y: 50,
                                                            }}
                                                            whileInView={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            viewport={{
                                                                once: true,
                                                                amount: 0.3,
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                                type: 'spring',
                                                                bounce: 0.3,
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/theme_1/sticky-notes.webp"
                                                                className="h-auto w-full drop-shadow-2xl"
                                                                alt="sticky note"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center p-8 pr-12 pt-12 sm:p-10 sm:pr-14 sm:pt-16">
                                                                <p
                                                                    className="text-center text-[13px] font-bold leading-relaxed text-[#FAF3EC] sm:text-[15px]"
                                                                    style={{
                                                                        fontFamily:
                                                                            "'Cormorant Garamond', serif",
                                                                    }}
                                                                >
                                                                    "
                                                                    {lastStory.content ||
                                                                        lastStory.story}
                                                                    "
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                            </motion.div>
                        </section>
                    )}

                    {/* D. COUNTDOWN & CALENDAR SECTION */}
                    <section
                        id="countdown"
                        className="relative overflow-hidden bg-[#FDF5F6] px-6 py-16"
                    >
                        {/* Floral corner decorations */}
                        <div
                            className="absolute -left-10 top-[50%] z-0 h-40 w-24 -translate-y-1/2 bg-contain bg-left bg-no-repeat sm:h-48 sm:w-32"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_1/bunga.webp')",
                            }}
                        />
                        <div
                            className="absolute -right-12 top-0 z-0 h-56 w-40 bg-contain bg-top bg-no-repeat sm:h-64 sm:w-48"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_1/kumpulanbunga.webp')",
                            }}
                        />
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Mixed typography "Counting Days" heading */}
                            <motion.div
                                variants={fadeUpVariants}
                                className="space-y-0"
                            >
                                <h2
                                    className="text-5xl italic"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Counting
                                </h2>
                                <h2
                                    className="-mt-2 text-6xl font-black"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        color: primaryColor,
                                    }}
                                >
                                    Days
                                </h2>
                            </motion.div>

                            {/* Countdown frame */}
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mx-auto -mt-10 flex min-h-[400px] w-full max-w-[400px] flex-col items-center justify-center bg-contain bg-center bg-no-repeat sm:-mt-6 sm:min-h-[320px]"
                                style={{
                                    backgroundImage:
                                        "url('/assets/theme_1/border-counting.webp')",
                                }}
                            >
                                <div className="relative z-10 mt-0 flex w-full flex-col items-center justify-center space-y-2 sm:space-y-3">
                                    <Theme1Countdown targetDate={weddingDate} />

                                    <a
                                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Ilyas+%26+Iftitah&dates=20260921T090000/20260921T130000&details=Mohon+doa+restu+kehadiran+Anda+di+pernikahan+kami.&location=Masjid+Raya+Al-Jihad`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FDF5F6] px-3 py-1.5 text-[10px] font-bold text-[#8C1B2F] shadow-sm transition-all hover:bg-white active:scale-95 sm:text-[11px]"
                                    >
                                        <CalendarIcon
                                            size={12}
                                            className="sm:h-3.5 sm:w-3.5"
                                        />
                                        <span>Add to Calendar</span>
                                    </a>
                                </div>
                            </motion.div>

                            {/* Month card and calendar grid */}
                            <motion.div
                                variants={fadeUpVariants}
                                className="space-y-5 rounded-3xl border border-sand/30 bg-white p-6 shadow-sm"
                            >
                                <div className="relative py-1">
                                    <h3
                                        className="font-serif text-3xl font-bold italic"
                                        style={{ color: primaryColor }}
                                    >
                                        {heroMonth}
                                    </h3>
                                    <span className="absolute inset-0 -z-10 flex select-none items-center justify-center font-serif text-5xl font-black tracking-widest opacity-[0.05]">
                                        {heroYear}
                                    </span>
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-y-2 text-center font-serif text-xs">
                                    {[
                                        'Min',
                                        'Sen',
                                        'Sel',
                                        'Rab',
                                        'Kam',
                                        'Jum',
                                        'Sab',
                                    ].map((d) => (
                                        <span
                                            key={d}
                                            className="font-sans text-[9px] font-bold text-gray-400"
                                        >
                                            {d}
                                        </span>
                                    ))}
                                    <span className="py-1"></span>
                                    <span className="py-1"></span>
                                    {Array.from({ length: 30 }).map(
                                        (_, idx) => {
                                            const dayNum = idx + 1;
                                            const isSpecial =
                                                dayNum === Number(heroDay);
                                            return (
                                                <div
                                                    key={dayNum}
                                                    className="relative flex items-center justify-center py-1"
                                                >
                                                    {isSpecial ? (
                                                        <div
                                                            className="relative flex h-7 w-7 items-center justify-center rounded-full font-bold text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    primaryColor,
                                                            }}
                                                        >
                                                            <Heart className="absolute inset-0 h-full w-full fill-current stroke-none p-0.5 opacity-90" />
                                                            <span className="relative z-10 mt-0.5 text-[9px]">
                                                                {dayNum}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-sans text-[11px] text-gray-700">
                                                            {dayNum}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* E. EVENT SCHEDULE SECTION */}
                    <section
                        id="schedule"
                        className="relative bg-[#FDF5F6] px-6 py-20"
                    >
                        <motion.div
                            className="mx-auto w-full max-w-md space-y-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.div
                                variants={fadeUpVariants}
                                className="relative z-20 pb-4 text-center"
                            >
                                <h2
                                    className="text-5xl font-normal sm:text-6xl"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    The Wedding
                                </h2>
                            </motion.div>

                            <div className="relative space-y-1">
                                {/* Akad card (arch top, flat bottom) */}
                                {schedules.akad && (
                                    <motion.div
                                        variants={fadeUpVariants}
                                        className="relative flex min-h-[520px] flex-col justify-center px-10 py-16 text-center"
                                    >
                                        <div
                                            className="absolute inset-0 z-0 bg-[length:100%_100%] bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/background-acara.webp')",
                                            }}
                                        />

                                        <div className="relative z-10 space-y-7 text-[#FAF3EC]">
                                            <div className="space-y-2">
                                                <h3
                                                    className="font-serif text-4xl font-bold italic"
                                                    style={{ color: '#FAF3EC' }}
                                                >
                                                    Akad Nikah
                                                </h3>
                                                <div
                                                    className="mx-auto h-[1.5px] w-12"
                                                    style={{
                                                        background:
                                                            secondaryColor,
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1.5 text-sm">
                                                <p className="font-semibold tracking-wide text-[#FAF3EC]">
                                                    {formatDate(
                                                        schedules.akad.date,
                                                    )}
                                                </p>
                                                <p className="text-[#FAF3EC]/80">
                                                    {schedules.akad.time ||
                                                        '09:00 - 11:00 WIB'}
                                                </p>
                                            </div>
                                            <div className="space-y-1.5 px-2 text-sm">
                                                <p className="font-bold text-[#FAF3EC]">
                                                    {schedules.akad.venue ||
                                                        'Masjid Raya Al-Jihad'}
                                                </p>
                                                <p className="text-xs leading-relaxed text-[#FAF3EC]/70">
                                                    {schedules.akad.address}
                                                </p>
                                            </div>
                                            {schedules.akad.maps && (
                                                <div className="pt-3">
                                                    <a
                                                        href={
                                                            schedules.akad.maps
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs font-bold transition-all hover:bg-white/10 active:scale-95"
                                                        style={{
                                                            borderColor:
                                                                secondaryColor,
                                                            color: '#FAF3EC',
                                                        }}
                                                    >
                                                        <MapPin size={14} />
                                                        <span>LOKASI MAPS</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Intertwined rings decorative sketch divider */}
                                <motion.div
                                    variants={scaleInVariants}
                                    className="my-1 flex justify-center"
                                >
                                    <img
                                        src="/assets/theme_1/outlinecincin.webp"
                                        alt="Wedding rings sketch"
                                        className="h-40 w-auto object-contain opacity-80"
                                    />
                                </motion.div>

                                {/* Resepsi card (flat top, arch bottom) */}
                                {schedules.resepsi && (
                                    <motion.div
                                        variants={fadeUpVariants}
                                        className="relative flex min-h-[520px] flex-col justify-center px-10 py-16 text-center"
                                    >
                                        <div
                                            className="absolute inset-0 z-0 scale-y-[-1] transform bg-[length:100%_100%] bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/background-acara.webp')",
                                            }}
                                        />

                                        <div className="relative z-10 space-y-7 text-[#FAF3EC]">
                                            <div className="space-y-2">
                                                <h3
                                                    className="font-serif text-4xl font-bold italic"
                                                    style={{ color: '#FAF3EC' }}
                                                >
                                                    Resepsi
                                                </h3>
                                                <div
                                                    className="mx-auto h-[1.5px] w-12"
                                                    style={{
                                                        background:
                                                            secondaryColor,
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1.5 text-sm">
                                                <p className="font-semibold tracking-wide text-[#FAF3EC]">
                                                    {formatDate(
                                                        schedules.resepsi.date,
                                                    )}
                                                </p>
                                                <p className="text-[#FAF3EC]/80">
                                                    {schedules.resepsi.time ||
                                                        '11:00 - 13:00 WIB'}
                                                </p>
                                            </div>
                                            <div className="space-y-1.5 px-2 text-sm">
                                                <p className="font-bold text-[#FAF3EC]">
                                                    {schedules.resepsi.venue ||
                                                        'Gedung Golden Ballroom'}
                                                </p>
                                                <p className="text-xs leading-relaxed text-[#FAF3EC]/70">
                                                    {schedules.resepsi.address}
                                                </p>
                                            </div>
                                            {schedules.resepsi.maps && (
                                                <div className="pt-3">
                                                    <a
                                                        href={
                                                            schedules.resepsi
                                                                .maps
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs font-bold transition-all hover:bg-white/10 active:scale-95"
                                                        style={{
                                                            borderColor:
                                                                secondaryColor,
                                                            color: '#FAF3EC',
                                                        }}
                                                    >
                                                        <MapPin size={14} />
                                                        <span>LOKASI MAPS</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </section>

                    {/* F. TIMELINE RUNDOWN SECTION */}
                    <section
                        id="timeline"
                        className="relative bg-[#FDF5F6] pb-24 pt-16"
                    >
                        <motion.div
                            className="mx-auto w-full max-w-md text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Header */}
                            <motion.div
                                variants={fadeUpVariants}
                                className="relative z-20 pb-4 text-center"
                            >
                                <h2
                                    className="text-5xl font-normal sm:text-6xl"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Wedding
                                </h2>
                                <h2
                                    className="font-serif text-3xl font-normal tracking-widest sm:text-4xl"
                                    style={{ color: primaryColor }}
                                >
                                    Timeline
                                </h2>
                            </motion.div>

                            {/* Timeline Graphic Container */}
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mx-auto mt-6 max-w-[420px]"
                            >
                                {/* Draped Curtain */}
                                <img
                                    src="/assets/theme_1/tirai-timeline.webp"
                                    alt="Curtain"
                                    className="absolute -top-10 left-1/2 z-0 w-[120%] max-w-none -translate-x-1/2 object-contain"
                                />

                                {/* Items Container */}
                                <div className="relative z-10 mx-auto w-fit space-y-10 px-6 pb-20 pt-[45%] sm:px-10">
                                    {/* Item 1 */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="flex w-14 justify-end sm:w-16">
                                            <img
                                                src="/assets/theme_1/outline-kursi.webp"
                                                className="h-12 w-12 object-contain opacity-85 sm:h-14 sm:w-14"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 text-left">
                                            <p
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                10:30 AM
                                            </p>
                                            <p
                                                className="text-[11px] font-semibold leading-snug sm:text-xs"
                                                style={{ color: primaryColor }}
                                            >
                                                Penyambutan Tamu &<br />
                                                Ramah Tamah
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="flex w-14 justify-end sm:w-16">
                                            <img
                                                src="/assets/theme_1/pengantin-outline.webp"
                                                className="h-12 w-12 object-contain opacity-85 sm:h-14 sm:w-14"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 text-left">
                                            <p
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                12:00 PM
                                            </p>
                                            <p
                                                className="text-[11px] font-semibold leading-snug sm:text-xs"
                                                style={{ color: primaryColor }}
                                            >
                                                Kedatangan Pengantin
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 3 */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="flex w-14 justify-end sm:w-16">
                                            <img
                                                src="/assets/theme_1/outlinecincin.webp"
                                                className="h-12 w-12 object-contain opacity-85 sm:h-14 sm:w-14"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 text-left">
                                            <p
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                12:30 PM
                                            </p>
                                            <p
                                                className="text-[11px] font-semibold leading-snug sm:text-xs"
                                                style={{ color: primaryColor }}
                                            >
                                                Prosesi Akad Nikah
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 4 */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="flex w-14 justify-end sm:w-16">
                                            <img
                                                src="/assets/theme_1/potongan-tangan.webp"
                                                className="h-12 w-12 object-contain opacity-85 sm:h-14 sm:w-14"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 text-left">
                                            <p
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                13:00 PM
                                            </p>
                                            <p
                                                className="text-[11px] font-semibold leading-snug sm:text-xs"
                                                style={{ color: primaryColor }}
                                            >
                                                Sesi Ucapan Selamat
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 5 */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="flex w-14 justify-end sm:w-16">
                                            <img
                                                src="/assets/theme_1/pengantin-ciuman-outline.webp"
                                                className="h-12 w-12 object-contain opacity-85 sm:h-14 sm:w-14"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 text-left">
                                            <p
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                19:00 PM
                                            </p>
                                            <p
                                                className="text-[11px] font-semibold leading-snug sm:text-xs"
                                                style={{ color: primaryColor }}
                                            >
                                                Resepsi Pernikahan
                                            </p>
                                        </div>
                                    </div>
                                    {/* Item 6 */}
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="flex w-14 justify-end sm:w-16">
                                            <img
                                                src="/assets/theme_1/outline-foto.webp"
                                                className="h-12 w-12 object-contain opacity-85 sm:h-14 sm:w-14"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 text-left">
                                            <p
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                20:30 PM
                                            </p>
                                            <p
                                                className="text-[11px] font-semibold leading-snug sm:text-xs"
                                                style={{ color: primaryColor }}
                                            >
                                                Sesi Foto Bersama
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Bridge */}
                                <div className="relative z-10 mt-8 flex justify-center">
                                    <img
                                        src="/assets/theme_1/bridge-outline.webp"
                                        className="h-auto w-[100%] max-w-none object-contain opacity-50"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* G. DRESSCODE SECTION */}
                    <section
                        id="dresscode"
                        className="relative overflow-hidden bg-[#FDF5F6] px-6 py-20 pb-28"
                    >
                        <motion.div
                            className="relative mx-auto w-full max-w-[400px] text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Background Arch (tirai-outline.webp) */}
                            <img
                                src="/assets/theme_1/tirai-outline.webp"
                                className="absolute -top-10 left-1/2 z-0 w-[150%] max-w-none -translate-x-1/2 opacity-70"
                            />

                            {/* Top Flower */}
                            <div className="relative z-10 flex justify-center">
                                <img
                                    src="/assets/theme_1/bunga.webp"
                                    className="w-[85px] drop-shadow-md"
                                />
                            </div>

                            {/* Title */}
                            <div className="relative z-10 mt-1">
                                <h2
                                    className="text-[3.25rem] font-normal tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Dresscode
                                </h2>
                            </div>

                            {/* Description */}
                            <div className="relative z-10 mt-10 px-6">
                                <p
                                    className="font-serif text-[13px] font-semibold leading-relaxed"
                                    style={{ color: primaryColor }}
                                >
                                    Kehadiran Anda adalah hadiah terindah bagi
                                    kami. Untuk menyelaraskan keindahan momen
                                    bahagia ini, kami memohon kesediaan
                                    Bapak/Ibu/Saudara/i untuk mengenakan pakaian
                                    dengan sentuhan palet warna berikut:
                                </p>
                            </div>

                            {/* Bottom Couple and Swatches */}
                            <div className="relative z-10 mt-8 flex w-full flex-col items-center justify-end">
                                {/* Kissing Couple */}
                                <img
                                    src="/assets/theme_1/pengantin-ciuman-outline2.webp"
                                    className="h-[150%] w-[95%] max-w-[280px] opacity-95"
                                />

                                {/* Swatches Grid */}
                                <div className="bottom-15 absolute left-1/2 flex w-full -translate-x-1/2 items-center justify-center gap-3 px-2">
                                    <div className="h-[4.25rem] w-[4.25rem] overflow-hidden rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                                        <img
                                            src="/assets/theme_1/kain1.webp"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="h-[4.25rem] w-[4.25rem] overflow-hidden rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                                        <img
                                            src="/assets/theme_1/kain2.webp"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="h-[4.25rem] w-[4.25rem] overflow-hidden rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                                        <img
                                            src="/assets/theme_1/kain3.webp"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="h-[4.25rem] w-[4.25rem] overflow-hidden rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                                        <img
                                            src="/assets/theme_1/kain4.webp"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* H. LIVE STREAMING SECTION */}
                    <section
                        id="streaming"
                        className="relative overflow-hidden bg-[#FDF5F6] px-6 py-20"
                    >
                        {/* Top Horse Carriage Outline */}
                        <div className="absolute left-1/2 top-4 flex w-full -translate-x-1/2 -translate-y-1/4 justify-center opacity-30">
                            <img
                                src="/assets/theme_1/kuda-outline.webp"
                                className="w-[125%] max-w-[500px]"
                            />
                        </div>

                        <motion.div
                            className="relative z-10 mx-auto mt-48 w-full max-w-sm space-y-5 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Title */}
                            <h2
                                className="text-[3.5rem] font-normal tracking-wide"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: primaryColor,
                                }}
                            >
                                Live Streaming
                            </h2>

                            {/* Description */}
                            <p
                                className="px-4 font-serif text-[13px] font-semibold leading-relaxed"
                                style={{ color: primaryColor }}
                            >
                                Bagi keluarga dan kerabat yang terhalang oleh
                                jarak, kehadiran virtual Anda tetaplah sebuah
                                berkah yang melimpah. Mari menjadi saksi dari
                                awal perjalanan suci kami.
                            </p>

                            {/* Middle Flowers */}
                            <div className="flex justify-center py-6">
                                <motion.img
                                    variants={scaleInVariants}
                                    src="/assets/theme_1/kumpulanbunga2.webp"
                                    className="w-[130px] drop-shadow-xl"
                                />
                            </div>

                            {/* Embedded Player Mockup */}
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mx-auto flex aspect-video w-full max-w-[340px] flex-col items-center justify-center overflow-hidden rounded-2xl border-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                            >
                                {/* Background image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage:
                                            "url('/assets/theme_1/gallery1.webp')",
                                    }}
                                />
                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/40" />

                                {/* Youtube UI Mockup */}
                                <div className="absolute left-4 right-4 top-3 z-10 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 overflow-hidden rounded-full border border-white/50 bg-stone-300">
                                            <img
                                                src="/assets/theme_1/foto-mempelai-pria.webp"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[13px] font-semibold leading-tight text-white drop-shadow-md">
                                                Classic Romance
                                            </p>
                                            <p className="text-[10px] text-white/80 drop-shadow-md">
                                                Abe Riki
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <Volume2 size={18} />
                                        <MessageSquare size={18} />
                                    </div>
                                </div>

                                <div className="relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-transform hover:scale-110">
                                    <Play
                                        size={24}
                                        className="ml-1 text-white"
                                        fill="white"
                                    />
                                </div>

                                <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between px-1 text-white/90">
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-red-600"></div>
                                            <span className="text-[10px] font-bold tracking-widest">
                                                LIVE
                                            </span>
                                        </div>
                                        <Maximize size={14} />
                                    </div>
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/30">
                                        <div className="h-full w-1/3 bg-red-600"></div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="pb-10 pt-8">
                                <a
                                    href="https://youtube.com/live"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-[1rem] border px-10 py-2.5 text-xs font-bold tracking-widest shadow-sm transition-all hover:bg-white/50 active:scale-95"
                                    style={{
                                        borderColor: primaryColor,
                                        color: primaryColor,
                                        backgroundColor: '#FAF3EC',
                                    }}
                                >
                                    JOIN NOW
                                </a>
                            </div>

                            {/* Bottom Rumah Outline */}
                            <div className="relative z-10 flex w-full justify-center opacity-60">
                                <img
                                    src="/assets/theme_1/rumah-outline.webp"
                                    className="w-[150%] max-w-[550px]"
                                />
                            </div>
                        </motion.div>
                    </section>

                    {/* RSVP & GUEST WISHES COMBINED SECTION */}
                    <section
                        id="rsvp-wishes"
                        className="relative overflow-x-clip overflow-y-visible bg-[#FDF5F6] px-6 py-24"
                    >
                        {/* Background Outlines */}
                        {/* Chair on top left of RSVP */}
                        <img
                            src="/assets/theme_1/outline-kursi.webp"
                            className="pointer-events-none absolute -top-10 left-[-20%] w-[50%] max-w-[300px] opacity-30"
                        />

                        {/* Single Hand-holding spanning the gap between RSVP and Wishes */}
                        <img
                            src="/assets/theme_1/gandengan-tangan-outline.webp"
                            className="pointer-events-none absolute -right-10 top-[45%] z-0 w-[50%] max-w-[350px] -translate-y-1/2 opacity-25"
                        />

                        {/* --- RSVP BLOCK --- */}
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm space-y-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Title */}
                            <div>
                                <h2
                                    className="text-[3.25rem] font-normal leading-[1.1] tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Konfirmasi Kehadiran
                                    <br />
                                    Anda
                                </h2>
                            </div>

                            {/* Description */}
                            <p
                                className="px-4 font-serif text-[13px] font-semibold leading-relaxed"
                                style={{ color: primaryColor }}
                            >
                                Mohon berkenan mengonfirmasi kehadiran Anda
                                sebagai bagian dari kebahagiaan yang akan kami
                                rayakan bersama.
                            </p>

                            {/* Form card with deep maroon backing */}
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mt-12 rounded-[2rem] px-6 py-12 shadow-2xl"
                                style={{ backgroundColor: '#4C081A' }}
                            >
                                {/* Decorative Ribbon */}
                                <img
                                    src="/assets/theme_1/pita.webp"
                                    className="pointer-events-none absolute -right-6 -top-8 z-20 w-[100px] drop-shadow-2xl"
                                />

                                <CustomRSVPForm onRsvpSubmit={onRsvpSubmit} />
                            </motion.div>
                        </motion.div>

                        {/* GAP between forms */}
                        <div className="h-32 md:h-40"></div>

                        {/* --- GUEST WISHES BLOCK --- */}
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm space-y-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Title */}
                            <div>
                                <h2
                                    className="text-[3.25rem] font-normal leading-[1.1] tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Ucapan & Doa
                                </h2>
                            </div>

                            {/* Description */}
                            <p
                                className="px-4 font-serif text-[13px] font-semibold leading-relaxed"
                                style={{ color: primaryColor }}
                            >
                                Setiap doa, harapan, dan ucapan yang Anda
                                titipkan akan menjadi kenangan berharga dalam
                                perjalanan kami bersama
                            </p>

                            {/* Form card with deep maroon backing */}
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mt-12 rounded-[2rem] px-6 py-12 shadow-2xl"
                                style={{ backgroundColor: '#4C081A' }}
                            >
                                {/* Decorative Ribbon */}
                                <img
                                    src="/assets/theme_1/pita.webp"
                                    className="pointer-events-none absolute -right-6 -top-8 z-20 w-[100px] drop-shadow-2xl"
                                />
                                {/* Decorative Flowers */}
                                <img
                                    src="/assets/theme_1/kumpulanbunga.webp"
                                    className="pointer-events-none absolute -bottom-10 -left-6 z-20 w-32 drop-shadow-xl"
                                />

                                <CustomWishesForm
                                    initialWishes={wishes}
                                    onRsvpSubmit={onRsvpSubmit}
                                />
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* I. PHOTO GALLERY SECTION */}
                    <section
                        id="gallery"
                        className="relative overflow-x-clip overflow-y-visible bg-[#FDF5F6] px-6 py-20"
                    >
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm space-y-8 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Title: Our Moment */}
                            <div className="flex flex-col items-center justify-center pb-4 pt-8 text-center">
                                <h2
                                    className="-translate-x-20 text-[4.5rem] font-normal tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                        lineHeight: '0.8',
                                    }}
                                >
                                    Our
                                </h2>
                                <h2
                                    className="translate-x-8 font-serif text-[3.25rem] tracking-widest"
                                    style={{
                                        color: primaryColor,
                                        lineHeight: '1',
                                    }}
                                >
                                    Moment
                                </h2>
                            </div>

                            {/* Visual Layout: Book, Rings, Key */}
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mt-2 flex h-[420px] w-full items-center justify-center"
                            >
                                <img
                                    src="/assets/theme_1/buku.webp"
                                    className="absolute left-[-2%] top-2 z-20 h-[85%] w-[85%] max-w-[340px] -rotate-[15deg] drop-shadow-2xl"
                                />
                                <img
                                    src="/assets/theme_1/outlinecincin.webp"
                                    className="absolute -top-5 right-0 z-10 w-[45%] max-w-[160px] opacity-70"
                                />
                                <img
                                    src="/assets/theme_1/kunci.webp"
                                    className="absolute right-2 top-40 z-30 w-[30%] max-w-[90px] -scale-x-100 drop-shadow-xl"
                                />
                            </motion.div>

                            {/* Title: Galeri */}
                            <div className="relative z-30 mb-10 mt-[-5rem]">
                                <h3
                                    className="text-[5rem] font-normal"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                        lineHeight: '1',
                                    }}
                                >
                                    Galeri
                                </h3>
                            </div>

                            {/* Photo Grid */}
                            <div className="relative pt-4">
                                {/* Decorative Flowers */}
                                <img
                                    src="/assets/theme_1/kumpulanbunga.webp"
                                    className="pointer-events-none absolute -left-12 top-1/4 z-20 w-20 opacity-90"
                                />
                                <img
                                    src="/assets/theme_1/kumpulanbunga.webp"
                                    className="pointer-events-none absolute -right-12 top-10 z-20 w-24 -scale-x-100 opacity-90"
                                />
                                <img
                                    src="/assets/theme_1/kumpulanbunga.webp"
                                    className="pointer-events-none absolute -bottom-12 -right-8 z-20 w-28 opacity-90"
                                />

                                <div className="relative z-10 grid grid-cols-2 gap-4">
                                    {(isAlbumOpen
                                        ? displayPhotos
                                        : displayPhotos.slice(0, 6)
                                    ).map((photo, i) => (
                                        <motion.div
                                            variants={scaleInVariants}
                                            key={photo.id || i}
                                            className="aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg"
                                        >
                                            <img
                                                src={photo.url}
                                                className="h-full w-full object-cover"
                                                alt="Gallery item"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Lihat Lebih Button */}
                            {displayPhotos.length > 6 && (
                                <div className="pt-10">
                                    <button
                                        onClick={() =>
                                            setIsAlbumOpen(!isAlbumOpen)
                                        }
                                        className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-semibold tracking-widest text-white shadow-md transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: primaryColor,
                                        }}
                                    >
                                        {isAlbumOpen
                                            ? 'Tutup Galeri'
                                            : 'Lihat Lebih'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </section>

                    {/* J. DIGITAL GIFT SECTION */}
                    <section
                        id="gift"
                        className="relative overflow-x-clip overflow-y-visible bg-[#FDF5F6] px-6 pb-72 pt-24"
                    >
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Title */}
                            <div>
                                <h2
                                    className="text-[5.5rem] font-normal tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                        lineHeight: '0.8',
                                    }}
                                >
                                    Gift
                                </h2>
                            </div>

                            {/* Subtitle / Description */}
                            <p className="mx-auto mt-6 max-w-[280px] px-4 font-serif text-[10px] font-semibold leading-tight text-[#7A223E] opacity-90">
                                For those of you who want to give a token of
                                <br />
                                love to the bride and groom, you can use the
                                <br />
                                account number below:
                            </p>

                            <div className="relative mt-32">
                                {/* Background Outline */}
                                <div className="pointer-events-none absolute -top-[130px] left-0 right-0 z-0 flex justify-center opacity-[0.35]">
                                    <img
                                        src="/assets/theme_1/gandengan-tangan-outline.webp"
                                        className="w-[70%] max-w-[320px]"
                                    />
                                </div>

                                {/* Tabs */}
                                <div className="relative z-10 mx-6 mb-8 mt-8 flex items-center justify-center gap-12 border-b border-[#7A223E]/15 pb-0">
                                    <button
                                        onClick={() => setGiftTab('bank')}
                                        className={`pb-2 text-[9px] font-bold tracking-widest ${giftTab === 'bank' ? '-mb-[1px] border-b-[2px] border-[#7A223E]' : 'text-[#7A223E]/40'}`}
                                        style={
                                            giftTab === 'bank'
                                                ? { color: primaryColor }
                                                : {}
                                        }
                                    >
                                        TRANSFER BANK
                                    </button>
                                    <button
                                        onClick={() => setGiftTab('address')}
                                        className={`pb-2 text-[9px] font-bold tracking-widest ${giftTab === 'address' ? '-mb-[1px] border-b-[2px] border-[#7A223E]' : 'text-[#7A223E]/40'}`}
                                        style={
                                            giftTab === 'address'
                                                ? { color: primaryColor }
                                                : {}
                                        }
                                    >
                                        KIRIM KADO
                                    </button>
                                </div>

                                {/* Cards Container */}
                                <div className="relative z-10 space-y-6 px-2">
                                    {giftTab === 'bank' ? (
                                        <>
                                            {/* Card 1: BNI */}
                                            <div className="rounded-[1.25rem] border border-[#7A223E]/15 bg-gradient-to-br from-white/90 to-[#FCF0F2]/90 p-6 text-left shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
                                                <div className="mb-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#F59E0B] p-[3px]">
                                                            <svg
                                                                viewBox="0 0 24 16"
                                                                fill="none"
                                                                className="h-full w-full opacity-90"
                                                            >
                                                                <path
                                                                    d="M4 2H10C11.1 2 12 2.9 12 4V12C12 13.1 11.1 14 10 14H4C2.9 14 2 13.1 2 12V4C2 2.9 2.9 2 4 2Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M14 2H20C21.1 2 22 2.9 22 4V12C22 13.1 21.1 14 20 14H14C12.9 14 12 13.1 12 12V4C12 2.9 12.9 2 14 2Z"
                                                                    fill="white"
                                                                />
                                                                <rect
                                                                    x="9"
                                                                    y="5"
                                                                    width="6"
                                                                    height="6"
                                                                    fill="#F59E0B"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <span
                                                            className="font-serif text-[17px] font-bold italic tracking-wide"
                                                            style={{
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            BNI
                                                        </span>
                                                    </div>
                                                    <CreditCard
                                                        size={22}
                                                        className="text-[#7A223E]/40"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <p
                                                        className="text-[7.5px] font-bold uppercase tracking-[0.2em]"
                                                        style={{
                                                            color: primaryColor,
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        NOMOR REKENING
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p
                                                            className="font-sans text-[1.5rem] font-bold tracking-wider"
                                                            style={{
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            123456789
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                handleCopy(
                                                                    '123456789',
                                                                    'groom',
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[7px] font-bold shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
                                                            style={{
                                                                borderColor: `${primaryColor}25`,
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            {copiedGroomBank ? (
                                                                <>
                                                                    <Check
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    <span>
                                                                        COPIED
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    <span>
                                                                        SALIN
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p
                                                        className="pt-1 font-serif text-[10px] font-bold"
                                                        style={{
                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        a.n Ananda
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Card 2: MANDIRI */}
                                            <div className="rounded-[1.25rem] border border-[#7A223E]/15 bg-gradient-to-br from-white/90 to-[#FCF0F2]/90 p-6 text-left shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
                                                <div className="mb-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#F59E0B] p-[3px]">
                                                            <svg
                                                                viewBox="0 0 24 16"
                                                                fill="none"
                                                                className="h-full w-full opacity-90"
                                                            >
                                                                <path
                                                                    d="M4 2H10C11.1 2 12 2.9 12 4V12C12 13.1 11.1 14 10 14H4C2.9 14 2 13.1 2 12V4C2 2.9 2.9 2 4 2Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M14 2H20C21.1 2 22 2.9 22 4V12C22 13.1 21.1 14 20 14H14C12.9 14 12 13.1 12 12V4C12 2.9 12.9 2 14 2Z"
                                                                    fill="white"
                                                                />
                                                                <rect
                                                                    x="9"
                                                                    y="5"
                                                                    width="6"
                                                                    height="6"
                                                                    fill="#F59E0B"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <span
                                                            className="font-serif text-[17px] font-bold italic tracking-wide"
                                                            style={{
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            MANDIRI
                                                        </span>
                                                    </div>
                                                    <CreditCard
                                                        size={22}
                                                        className="text-[#7A223E]/40"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <p
                                                        className="text-[7.5px] font-bold uppercase tracking-[0.2em]"
                                                        style={{
                                                            color: primaryColor,
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        NOMOR REKENING
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p
                                                            className="font-sans text-[1.5rem] font-bold tracking-wider"
                                                            style={{
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            123456789
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                handleCopy(
                                                                    '123456789',
                                                                    'bride',
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[7px] font-bold shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
                                                            style={{
                                                                borderColor: `${primaryColor}25`,
                                                                color: primaryColor,
                                                            }}
                                                        >
                                                            {copiedBrideBank ? (
                                                                <>
                                                                    <Check
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    <span>
                                                                        COPIED
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    <span>
                                                                        SALIN
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p
                                                        className="pt-1 font-serif text-[10px] font-bold"
                                                        style={{
                                                            color: primaryColor,
                                                        }}
                                                    >
                                                        a.n WRTY
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center rounded-[1.25rem] border border-[#7A223E]/15 bg-gradient-to-br from-white/90 to-[#FCF0F2]/90 px-6 py-10 text-center shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
                                            <h4
                                                className="font-serif text-[2.25rem]"
                                                style={{ color: primaryColor }}
                                            >
                                                Virga & Iftitah
                                            </h4>
                                            <p
                                                className="mb-10 mt-2 max-w-[200px] font-serif text-[9px] font-bold leading-relaxed opacity-80"
                                                style={{ color: primaryColor }}
                                            >
                                                Perumahan Indah No. 123, Jakarta
                                                Selatan
                                            </p>
                                            <div className="w-full space-y-3">
                                                <button
                                                    onClick={() =>
                                                        handleCopyAddress(
                                                            'Perumahan Indah No. 123, Jakarta Selatan',
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 border border-[#7A223E]/20 py-3 transition-all hover:bg-[#7A223E]/5 active:scale-95"
                                                >
                                                    {copiedAddress ? (
                                                        <Check
                                                            size={12}
                                                            className="text-[#7A223E]"
                                                        />
                                                    ) : (
                                                        <Copy
                                                            size={10}
                                                            className="text-[#7A223E]"
                                                        />
                                                    )}
                                                    <span className="text-[7px] font-bold uppercase tracking-widest text-[#7A223E]">
                                                        {copiedAddress
                                                            ? 'TERSALIN'
                                                            : 'SALIN ALAMAT'}
                                                    </span>
                                                </button>
                                                <button className="flex w-full items-center justify-center border border-[#7A223E]/20 py-3 transition-all hover:bg-[#7A223E]/5 active:scale-95">
                                                    <span className="text-[7px] font-bold uppercase tracking-widest text-[#7A223E]">
                                                        LIHAT PETA
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirmation Form or Link */}
                                {showConfirmationForm ? (
                                    <div className="relative z-10 mx-2 mt-8">
                                        <div className="rounded-[1.25rem] border border-[#7A223E]/15 bg-gradient-to-br from-white/90 to-[#FCF0F2]/90 px-6 py-8 text-left shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
                                            <div className="mb-6 flex items-center justify-between">
                                                <h4
                                                    className="font-serif text-[1.6rem]"
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                >
                                                    Konfirmasi
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        setShowConfirmationForm(
                                                            false,
                                                        )
                                                    }
                                                    className="text-[6.5px] font-bold uppercase tracking-widest text-[#7A223E]/50 hover:text-[#7A223E]"
                                                >
                                                    TUTUP
                                                </button>
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="NAMA ANDA"
                                                        className="w-full border-b border-[#7A223E]/25 bg-transparent pb-2 font-serif text-[10px] uppercase tracking-wide text-[#7A223E] placeholder-[#7A223E]/50 focus:border-[#7A223E] focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="BANK TUJUAN"
                                                        className="w-full border-b border-[#7A223E]/25 bg-transparent pb-2 font-serif text-[10px] uppercase tracking-wide text-[#7A223E] placeholder-[#7A223E]/50 focus:border-[#7A223E] focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex items-end border-b border-[#7A223E]/25 pb-2">
                                                    <span className="mb-[1px] mr-3 font-serif text-[10px] font-bold text-[#7A223E]">
                                                        Rp
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="NOMINAL"
                                                        className="w-full bg-transparent font-serif text-[10px] uppercase tracking-wide text-[#7A223E] placeholder-[#7A223E]/50 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <button className="mt-8 w-full bg-[#7A223E] py-3.5 text-[8px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#5a1822] active:scale-95">
                                                KONFIRMASI KE DASHBOARD
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative z-10 flex w-full justify-center px-6 pb-2 pt-12">
                                        <div className="w-full border-t border-[#7A223E]/15 pt-5 text-center">
                                            <button
                                                onClick={() =>
                                                    setShowConfirmationForm(
                                                        true,
                                                    )
                                                }
                                                className="inline-block border-b border-[#7A223E]/40 pb-1 text-[7.5px] font-bold uppercase tracking-widest"
                                                style={{ color: primaryColor }}
                                            >
                                                SUDAH MENGIRIM KADO? KONFIRMASI
                                                DI SINI
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Bottom Illustration (Gazebo) */}
                        <div className="pointer-events-none absolute bottom-0 left-0 z-0 flex w-full justify-center opacity-[0.25]">
                            <img
                                src="/assets/theme_1/rumah-outline.webp"
                                alt="Gazebo"
                                className="w-[110%] max-w-[450px]"
                            />
                        </div>
                    </section>

                    {/* M. FOOTER CLOSING SECTION */}
                    <footer
                        id="footer"
                        className="relative mt-[-1px] overflow-hidden bg-[#FDF5F6] px-0 pb-0 pt-16 text-center"
                    >
                        <motion.div
                            className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center px-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Title */}
                            <h2
                                className="mb-6 text-[4.5rem] font-normal tracking-wide drop-shadow-sm"
                                style={{ color: primaryColor }}
                            >
                                See You
                            </h2>

                            {/* Description Text */}
                            <p className="mb-8 max-w-[280px] font-serif text-[7.5px] font-bold uppercase leading-[2.5] tracking-[0.25em] text-[#7A223E] opacity-80">
                                MERUPAKAN SUATU KEHORMATAN DAN
                                <br />
                                KEBAHAGIAAN BAGI KAMI APABILA
                                <br />
                                BAPAK/IBU/SAUDARA/I BERKENAN
                                <br />
                                HADIR UNTUK MEMBERIKAN DOA
                                <br />
                                RESTU KEPADA KAMI.
                            </p>

                            <p className="mb-6 font-serif text-[8.5px] font-bold uppercase tracking-[0.3em] text-[#7A223E]">
                                TERIMAKASIH
                            </p>

                            {/* Initials & Rings */}
                            <div className="relative mb-6 flex h-44 w-44 items-center justify-center">
                                <img
                                    src="/assets/theme_1/outlinecincin.webp"
                                    className="absolute w-[125%] max-w-none opacity-80"
                                />
                                <div className="relative z-10 -ml-4 flex items-center justify-center">
                                    <span
                                        className="pr-5 font-serif text-[5.5rem] italic leading-none drop-shadow-[2px_4px_10px_rgba(122,34,62,0.3)]"
                                        style={{ color: primaryColor }}
                                    >
                                        V
                                    </span>
                                    <span
                                        className="pt-12 font-serif text-[5.5rem] italic leading-none drop-shadow-[2px_4px_10px_rgba(122,34,62,0.3)]"
                                        style={{ color: primaryColor }}
                                    >
                                        B
                                    </span>
                                </div>
                            </div>

                            {/* Date */}
                            <p className="mb-8 font-serif text-[8.5px] font-bold uppercase tracking-widest text-[#7A223E]">
                                MONDAY, 21 SEPTEMBER 2026
                            </p>

                            {/* Couple Illustration */}
                            <div className="-mb-2 flex w-full max-w-[260px] justify-center">
                                <img
                                    src="/assets/theme_1/pengantin-ciuman-outline.webp"
                                    alt="Couple"
                                    className="w-[90%] opacity-80 mix-blend-multiply"
                                />
                            </div>

                            {/* Names */}
                            <h3
                                className="mb-12 font-serif text-[2.2rem]"
                                style={{ color: primaryColor }}
                            >
                                Virga & Iftitah
                            </h3>
                        </motion.div>

                        {/* Final Footer Bar */}
                        <div className="relative z-20 flex w-full items-center justify-center gap-4 rounded-t-[1.5rem] bg-[#4A1728] py-4 text-center text-[#FDF5F6] shadow-lg">
                            <span className="text-[6px] font-bold uppercase tracking-[0.25em] opacity-90">
                                POWERED BY NGATURI
                            </span>
                            <span className="text-[6px] font-bold opacity-60">
                                •
                            </span>
                            {/* Icons */}
                            <div className="flex items-center gap-3 opacity-90">
                                <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="2"
                                        y="2"
                                        width="20"
                                        height="20"
                                        rx="5"
                                        ry="5"
                                    ></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line
                                        x1="17.5"
                                        y1="6.5"
                                        x2="17.51"
                                        y2="6.5"
                                    ></line>
                                </svg>
                                <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* ============================================================== */}
                {/* 3. FLOATING BUTTON CONTROL INTERFACES                          */}
                {/* ============================================================== */}

                {/* MUSIC BUTTON */}
                <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="absolute bottom-6 left-6 z-[99] flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#C9A84C]/40 bg-[#3A0511] shadow-[0_4px_20px_-5px_rgba(58,5,17,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Toggle Music"
                >
                    <div
                        className={`flex h-full w-full items-center justify-center ${isPlayingMusic ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-[22px] w-[22px] text-[#C9A84C] opacity-90"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="11"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M12 9a3 3 0 0 0 0 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </div>
                    {/* Pause/Stop indicator overlay */}
                    {!isPlayingMusic && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-[0.5px]">
                            <Play
                                size={16}
                                className="ml-0.5 text-white"
                                fill="white"
                            />
                        </div>
                    )}
                </button>

                {/* QRIS BUTTON */}
                <button
                    onClick={() => setIsQrisModalOpen(true)}
                    className="absolute bottom-20 left-6 z-[99] rounded-full border border-[#C9A84C]/35 bg-white p-3.5 text-[#6B1D2F] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    title="QRIS"
                >
                    <QrCode size={20} />
                </button>

                {/* A. QR CHECK-IN SCROLLER ACCESS BUTTON */}
                {guestName && (
                    <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="absolute bottom-20 right-6 z-[99] rounded-full border border-[#C9A84C]/35 bg-[#6B1D2F] p-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                        title="Akses Masuk QR"
                    >
                        <QrCode size={20} />
                    </button>
                )}

                {/* B. NAVIGATION MENU OVERLAY BURGER TOGGLE BUTTON */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="absolute bottom-6 right-6 z-[99] rounded-full border border-sand/35 bg-white p-3.5 text-[#6B1D2F] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Menu"
                >
                    <Menu size={20} />
                </button>

                {/* C. FULL-SCREEN NAVIGATION OVERLAY MODAL */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="absolute inset-0 z-[100] flex select-none flex-col items-center justify-center bg-[#2D1A1E]/95 p-8 text-center backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Close menu button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute right-8 top-8 p-2 text-[#FAF3EC] transition-opacity hover:opacity-75"
                            >
                                <X size={28} />
                            </button>

                            <div className="space-y-6">
                                <span className="font-sans text-[2.4cqw] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">
                                    MENU INVITATION
                                </span>
                                <div className="mx-auto mb-8 h-[1px] w-8 bg-[#C9A84C]/40" />

                                <div className="flex flex-col gap-6 font-serif text-2xl italic text-[#FAF3EC]">
                                    <button
                                        onClick={() => scrollToSection('home')}
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Home
                                    </button>
                                    <button
                                        onClick={() =>
                                            scrollToSection('couple')
                                        }
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Mempelai
                                    </button>
                                    <button
                                        onClick={() => scrollToSection('story')}
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Kisah Cinta
                                    </button>
                                    <button
                                        onClick={() =>
                                            scrollToSection('countdown')
                                        }
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Waktu
                                    </button>
                                    <button
                                        onClick={() =>
                                            scrollToSection('schedule')
                                        }
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Acara & Lokasi
                                    </button>
                                    <button
                                        onClick={() =>
                                            scrollToSection('timeline')
                                        }
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Timeline
                                    </button>
                                    <button
                                        onClick={() =>
                                            scrollToSection('dresscode')
                                        }
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Dresscode
                                    </button>
                                    <button
                                        onClick={() =>
                                            scrollToSection('gallery')
                                        }
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Galeri
                                    </button>
                                    <button
                                        onClick={() => scrollToSection('gift')}
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        Hadiah
                                    </button>
                                    <button
                                        onClick={() => scrollToSection('rsvp')}
                                        className="transition-colors hover:text-[#C9A84C]"
                                    >
                                        RSVP
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* D. AKSES MASUK QR CODE modal */}
                <AnimatePresence>
                    {isQrModalOpen && (
                        <motion.div
                            className="absolute inset-0 z-[100] flex select-none items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="relative w-full max-w-sm space-y-6 rounded-3xl border border-sand/40 bg-white p-6 text-center shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                            >
                                {/* Close Modal button */}
                                <button
                                    onClick={() => setIsQrModalOpen(false)}
                                    className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>

                                <div className="space-y-1">
                                    <h3
                                        className="font-serif text-lg font-bold italic"
                                        style={{ color: primaryColor }}
                                    >
                                        Akses Masuk
                                    </h3>
                                    <p className="mx-auto max-w-xs text-[2.4cqw] leading-relaxed text-gray-500">
                                        Tunjukkan QR Code ini kepada petugas
                                        penerima tamu di lokasi acara untuk
                                        check-in kehadiran digital.
                                    </p>
                                </div>

                                {/* Generative QR Code SVG design */}
                                <div
                                    className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border-2 bg-neutral-50 p-3.5 shadow-inner"
                                    style={{ borderColor: `${primaryColor}20` }}
                                >
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="h-full w-full text-[#6B1D2F]"
                                    >
                                        {/* Corners squares */}
                                        <rect
                                            x="0"
                                            y="0"
                                            width="25"
                                            height="25"
                                            fill="currentColor"
                                            rx="2"
                                        />
                                        <rect
                                            x="5"
                                            y="5"
                                            width="15"
                                            height="15"
                                            fill="white"
                                            rx="1"
                                        />
                                        <rect
                                            x="8"
                                            y="8"
                                            width="9"
                                            height="9"
                                            fill="currentColor"
                                        />

                                        <rect
                                            x="75"
                                            y="0"
                                            width="25"
                                            height="25"
                                            fill="currentColor"
                                            rx="2"
                                        />
                                        <rect
                                            x="80"
                                            y="5"
                                            width="15"
                                            height="15"
                                            fill="white"
                                            rx="1"
                                        />
                                        <rect
                                            x="83"
                                            y="8"
                                            width="9"
                                            height="9"
                                            fill="currentColor"
                                        />

                                        <rect
                                            x="0"
                                            y="75"
                                            width="25"
                                            height="25"
                                            fill="currentColor"
                                            rx="2"
                                        />
                                        <rect
                                            x="5"
                                            y="80"
                                            width="15"
                                            height="15"
                                            fill="white"
                                            rx="1"
                                        />
                                        <rect
                                            x="8"
                                            y="83"
                                            width="9"
                                            height="9"
                                            fill="currentColor"
                                        />

                                        {/* Random simulated QR matrix dots */}
                                        <rect
                                            x="35"
                                            y="5"
                                            width="10"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="50"
                                            y="10"
                                            width="5"
                                            height="15"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="60"
                                            y="0"
                                            width="10"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="35"
                                            y="20"
                                            width="15"
                                            height="5"
                                            fill="currentColor"
                                        />

                                        <rect
                                            x="0"
                                            y="35"
                                            width="5"
                                            height="10"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="15"
                                            y="35"
                                            width="10"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="30"
                                            y="30"
                                            width="15"
                                            height="15"
                                            fill="currentColor"
                                            rx="1"
                                        />
                                        <rect
                                            x="35"
                                            y="35"
                                            width="5"
                                            height="5"
                                            fill="white"
                                        />
                                        <rect
                                            x="55"
                                            y="35"
                                            width="20"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="85"
                                            y="35"
                                            width="5"
                                            height="15"
                                            fill="currentColor"
                                        />

                                        <rect
                                            x="5"
                                            y="55"
                                            width="15"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="30"
                                            y="50"
                                            width="5"
                                            height="20"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="40"
                                            y="60"
                                            width="20"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="65"
                                            y="50"
                                            width="10"
                                            height="10"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="80"
                                            y="55"
                                            width="15"
                                            height="5"
                                            fill="currentColor"
                                        />

                                        <rect
                                            x="35"
                                            y="80"
                                            width="20"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="35"
                                            y="90"
                                            width="10"
                                            height="5"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="60"
                                            y="75"
                                            width="5"
                                            height="15"
                                            fill="currentColor"
                                        />
                                        <rect
                                            x="75"
                                            y="75"
                                            width="15"
                                            height="15"
                                            fill="currentColor"
                                            rx="1"
                                        />
                                        <rect
                                            x="80"
                                            y="80"
                                            width="5"
                                            height="5"
                                            fill="white"
                                        />
                                    </svg>
                                </div>

                                <div className="space-y-1">
                                    <span className="block text-[2.4cqw] font-bold uppercase tracking-widest text-gray-400">
                                        NAMA TAMU
                                    </span>
                                    <span className="text-base font-bold text-gray-700">
                                        {guestName}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* E. QRIS MODAL */}
                <AnimatePresence>
                    {isQrisModalOpen && (
                        <motion.div
                            className="absolute inset-0 z-[100] flex select-none items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="relative w-full max-w-[320px] rounded-[1.5rem] border border-[#7A223E]/20 bg-gradient-to-br from-[#FDF5F6] to-[#FCF0F2] p-8 text-center shadow-[0_10px_40px_-10px_rgba(122,34,62,0.3)] backdrop-blur-md"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                            >
                                {/* Close Modal button */}
                                <button
                                    onClick={() => setIsQrisModalOpen(false)}
                                    className="absolute right-5 top-5 p-1.5 text-[#7A223E]/40 transition-colors hover:text-[#7A223E]"
                                >
                                    <X size={20} />
                                </button>

                                <div className="space-y-6">
                                    <div>
                                        <h3
                                            className="font-serif text-[2.2rem] font-normal drop-shadow-sm"
                                            style={{ color: primaryColor }}
                                        >
                                            QRIS
                                        </h3>
                                        <p className="mt-1 font-serif text-[9px] font-bold uppercase tracking-widest text-[#7A223E] opacity-70">
                                            Scan untuk Kirim Kado
                                        </p>
                                    </div>

                                    <div className="relative mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center overflow-hidden rounded-[1rem] border border-[#7A223E]/10 bg-white p-4 shadow-inner">
                                        <div className="pointer-events-none absolute inset-0 bg-[#7A223E]/5"></div>
                                        <QrCode
                                            size={120}
                                            className="text-[#7A223E]/30"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    <p className="pt-1 font-serif text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#7A223E] opacity-90">
                                        A.N. VIRGA & IFTITAH
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Close the outer Right Panel relative wrapper */}
            </div>
        </div>
    );
};

export default Theme1;
