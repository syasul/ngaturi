import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Check,
    Clock,
    Compass,
    Copy,
    CreditCard,
    Gift,
    Heart,
    Image as ImageIcon,
    MapPin,
    MessageCircle,
    MessageSquare,
    Music as MusicIcon,
    Sparkles,
    User,
    Users,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';

// Framer motion variants
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const slideLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const slideRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const InstagramIcon = ({ size = 13 }: { size?: number }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

// Botanical Corner Flourish
const BotanicalCorner: React.FC<{
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: string;
    size?: number;
    className?: string;
}> = ({ position, color = '#2D4F3E', size = 64, className = '' }) => {
    const transforms = {
        'top-left': '',
        'top-right': 'scale(-1, 1)',
        'bottom-left': 'scale(1, -1)',
        'bottom-right': 'scale(-1, -1)',
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none absolute select-none ${className}`}
            style={{ transform: transforms[position] }}
        >
            <path
                d="M10 90 C10 50 35 25 75 15 C85 12 95 10 95 10 C95 10 92 20 90 30 C80 68 55 90 10 90 Z"
                fill={color}
                fillOpacity="0.12"
            />
            <path
                d="M5 95 C5 45 40 10 95 5 M95 5 C75 25 65 55 60 90 M95 5 C60 15 25 45 10 90"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.5"
            />
            <path
                d="M40 38 C32 28 35 15 45 18 C55 21 50 34 40 38 Z"
                fill={color}
                fillOpacity="0.35"
            />
            <path
                d="M62 25 C60 14 70 8 78 14 C86 20 74 30 62 25 Z"
                fill={color}
                fillOpacity="0.4"
            />
            <path
                d="M25 60 C15 52 14 38 25 40 C36 42 33 56 25 60 Z"
                fill={color}
                fillOpacity="0.3"
            />
            <path
                d="M22 78 C12 70 16 58 26 62 C36 66 30 78 22 78 Z"
                fill={color}
                fillOpacity="0.35"
            />
            <circle cx="95" cy="5" r="3" fill={color} fillOpacity="0.6" />
        </svg>
    );
};

// Symmetrical Floral Divider
const BotanicalDivider: React.FC<{ color?: string; className?: string }> = ({
    color = '#2D4F3E',
    className = '',
}) => (
    <div
        className={`flex items-center justify-center gap-3 select-none py-3 ${className}`}
    >
        <div
            className="h-[1px] w-16 sm:w-24 opacity-30"
            style={{
                background: `linear-gradient(to right, transparent, ${color})`,
            }}
        />
        <svg
            width="28"
            height="20"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
        >
            <path
                d="M20 2 C16 8 8 10 2 12 C8 14 16 16 20 22 C24 16 32 14 38 12 C32 10 24 8 20 2 Z"
                fill={color}
                fillOpacity="0.4"
            />
            <circle cx="20" cy="12" r="2.5" fill={color} />
            <circle cx="10" cy="12" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="30" cy="12" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
        <div
            className="h-[1px] w-16 sm:w-24 opacity-30"
            style={{
                background: `linear-gradient(to left, transparent, ${color})`,
            }}
        />
    </div>
);

// Leaf Branch Wreath Top Header
const BotanicalHeaderFlourish: React.FC<{
    color?: string;
    className?: string;
}> = ({ color = '#C2A676', className = '' }) => (
    <svg
        width="110"
        height="28"
        viewBox="0 0 140 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`mx-auto select-none ${className}`}
    >
        <path
            d="M10 16 C40 16 55 12 70 4 C85 12 100 16 130 16"
            stroke={color}
            strokeWidth="1.25"
            strokeLinecap="round"
        />
        <circle cx="70" cy="4" r="2.5" fill={color} />
        <path
            d="M30 15 C26 10 32 6 36 10 C40 14 35 18 30 15 Z"
            fill={color}
            fillOpacity="0.6"
        />
        <path
            d="M50 14 C48 8 55 5 58 9 C61 13 55 17 50 14 Z"
            fill={color}
            fillOpacity="0.6"
        />
        <path
            d="M110 15 C114 10 108 6 104 10 C100 14 105 18 110 15 Z"
            fill={color}
            fillOpacity="0.6"
        />
        <path
            d="M90 14 C92 8 85 5 82 9 C79 13 85 17 90 14 Z"
            fill={color}
            fillOpacity="0.6"
        />
    </svg>
);

const resolveImageUrl = (url: string | null | undefined, fallback: string) => {
    if (!url) return fallback;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    if (
        url.startsWith('storage/') ||
        url.startsWith('assets/') ||
        url.startsWith('images/') ||
        url.startsWith('uploads/')
    )
        return `/${url}`;
    return `/storage/${url}`;
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

const CountdownBlock = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calc = () => {
            const diff = +new Date(targetDate) - +new Date();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        calc();
        const t = setInterval(calc, 1000);
        return () => clearInterval(t);
    }, [targetDate]);

    const items = [
        { label: 'HARI', val: timeLeft.days },
        { label: 'JAM', val: timeLeft.hours },
        { label: 'MENIT', val: timeLeft.minutes },
        { label: 'DETIK', val: timeLeft.seconds },
    ];

    return (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 py-2">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-md"
                >
                    <span
                        className="text-2xl sm:text-3xl font-bold text-[#FAF7F2]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-wider text-[#C2A676]">
                        {item.label}
                    </span>
                    <div className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-[#C2A676]/20" />
                </div>
            ))}
        </div>
    );
};

export interface BasicThemeProps extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}

export const BasicTheme1: React.FC<BasicThemeProps> = ({
    data,
    guestName,
    guestToken,
    photos = [],
    wishes = [],
    onRsvpSubmit,
    isOpened = true,
    onOpen,
    isPlayingMusic = true,
    setIsPlayingMusic,
}) => {
    const groom = data?.groom || {};
    const bride = data?.bride || {};
    const schedules = data?.schedules || data?.schedule || {};
    const stories = data?.stories || [];
    const quotes = data?.quotes || {};
    const customStyle = data?.customStyle || {};
    const sections = data?.sections || {};

    const showStory = sections.showStory !== false;
    const showGallery = sections.showGallery !== false;
    const showQuotes = sections.showQuotes !== false;
    const showGift = sections.showGift !== false;
    const showRsvp = sections.showRsvp !== false;
    const showWishes = sections.showWishes !== false;

    // Neutral elegant demo couple names
    const groomNickname = groom.nickname || 'Arya';
    const brideNickname = bride.nickname || 'Nabila';
    const groomFullName = groom.name || 'Arya Pratama, S.T.';
    const brideFullName = bride.name || 'Nabila Putri Larasati, S.I.Kom';

    // Dates
    const akadDate = schedules.akad?.date || '2026-10-24';
    const resepsiDate = schedules.resepsi?.date || akadDate;
    const primaryDate = akadDate || resepsiDate;

    // Photos fallback
    const defaultPhotos = [
        { id: '1', url: '/assets/theme_1/gallery1.webp' },
        { id: '2', url: '/assets/theme_1/gallery2.webp' },
        { id: '3', url: '/assets/theme_1/gallery3.webp' },
        { id: '4', url: '/assets/theme_1/gallery4.webp' },
        { id: '5', url: '/assets/theme_1/gallery6.webp' },
        { id: '6', url: '/assets/theme_1/gallery7.webp' },
    ];
    const displayPhotos = photos && photos.length > 0 ? photos : defaultPhotos;

    // Copy states
    const [copiedGroomBank, setCopiedGroomBank] = useState(false);
    const [copiedBrideBank, setCopiedBrideBank] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState(false);

    // Lightbox modal state
    const [activePhoto, setActivePhoto] = useState<string | null>(null);

    // RSVP Form state
    const [rsvpName, setRsvpName] = useState(guestName || '');
    const [rsvpCount, setRsvpCount] = useState('1');
    const [rsvpStatus, setRsvpStatus] = useState('hadir');
    const [rsvpMsg, setRsvpMsg] = useState('');
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

    // Wishes list state
    const [localWishes, setLocalWishes] = useState<any[]>(wishes || []);
    const [wishName, setWishName] = useState(guestName || '');
    const [wishMsg, setWishMsg] = useState('');
    const [wishLoading, setWishLoading] = useState(false);

    useEffect(() => {
        if (wishes && wishes.length > 0) {
            setLocalWishes(wishes);
        }
    }, [wishes]);

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

    const handleRsvp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rsvpName) return;
        setRsvpLoading(true);
        try {
            await onRsvpSubmit(
                rsvpStatus,
                `Nama: ${rsvpName}, Jumlah: ${rsvpCount} orang. Pesan: ${rsvpMsg || '-'}`,
            );
            setRsvpSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleWishSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishName || !wishMsg) return;
        setWishLoading(true);
        try {
            await onRsvpSubmit('hadir', wishMsg);
            const newWish = {
                id: Date.now().toString(),
                name: wishName,
                message: wishMsg,
                createdAt: new Date().toISOString(),
                rsvpStatus: 'hadir',
            };
            setLocalWishes((prev) => [newWish, ...prev]);
            setWishMsg('');
        } catch (err) {
            console.error(err);
        } finally {
            setWishLoading(false);
        }
    };

    const [activeSection, setActiveSection] = useState<string>('section-cover');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container =
            containerRef.current ||
            document.getElementById('basic-scroll-container');
        if (!container) return;

        const checkActiveSection = () => {
            const containerRect = container.getBoundingClientRect();
            const threshold = containerRect.top + containerRect.height * 0.35;

            // If user scrolled to the bottom (within 80px), activate the last item ('section-rsvp')
            if (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 80
            ) {
                setActiveSection('section-rsvp');
                return;
            }

            const checkpoints: { navId: string; elementId: string }[] = [
                { navId: 'section-cover', elementId: 'section-cover' },
                { navId: 'section-couple', elementId: 'section-couple' },
                { navId: 'section-event', elementId: 'section-event' },
                { navId: 'section-gallery', elementId: 'section-story' },
                { navId: 'section-gallery', elementId: 'section-gallery' },
                { navId: 'section-rsvp', elementId: 'section-gift' },
                { navId: 'section-rsvp', elementId: 'section-rsvp' },
                { navId: 'section-rsvp', elementId: 'section-wishes' },
            ];

            let active = 'section-cover';
            for (const cp of checkpoints) {
                const el = document.getElementById(cp.elementId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= threshold) {
                        active = cp.navId;
                    }
                }
            }

            setActiveSection(active);
        };

        container.addEventListener('scroll', checkActiveSection, {
            passive: true,
        });
        window.addEventListener('scroll', checkActiveSection, { passive: true });
        checkActiveSection();

        return () => {
            container.removeEventListener('scroll', checkActiveSection);
            window.removeEventListener('scroll', checkActiveSection);
        };
    }, [isOpened]);

    const scrollTo = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        const container =
            containerRef.current ||
            document.getElementById('basic-scroll-container');
        if (el && container) {
            const containerTop = container.getBoundingClientRect().top;
            const elTop = el.getBoundingClientRect().top;
            container.scrollTo({
                top: container.scrollTop + elTop - containerTop,
                behavior: 'smooth',
            });
        } else if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const createGoogleCalendarUrl = () => {
        const title = encodeURIComponent(
            `Pernikahan ${groomNickname} & ${brideNickname}`,
        );
        const details = encodeURIComponent(
            `Undangan Pernikahan Suci ${groomFullName} & ${brideFullName}`,
        );
        const location = encodeURIComponent(
            schedules.resepsi?.venue || schedules.akad?.venue || 'Lokasi Acara',
        );
        const dateFormatted = primaryDate.replace(/-/g, '');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T090000Z/${dateFormatted}T130000Z`;
    };

    return (
        <div
            className="relative flex min-h-screen w-full overflow-hidden bg-[#FAF7F2] text-[#243028]"
            style={{ colorScheme: 'only light' }}
        >
            {/* ============================================================== */}
            {/* DESKTOP LEFT PANEL (STICKY LUXURY BOTANICAL SHOWCASE)          */}
            {/* ============================================================== */}
            <div className="relative sticky left-0 top-0 hidden h-screen w-[65%] select-none flex-col justify-between overflow-hidden bg-[#183124] p-14 text-white lg:flex">
                <div
                    className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                        backgroundImage: "url('/assets/wedding/hero-floral.png')",
                    }}
                />

                <BotanicalCorner position="top-left" color="#C2A676" size={80} className="left-6 top-6" />
                <BotanicalCorner position="top-right" color="#C2A676" size={80} className="right-6 top-6" />
                <BotanicalCorner position="bottom-left" color="#C2A676" size={80} className="bottom-6 left-6" />
                <BotanicalCorner position="bottom-right" color="#C2A676" size={80} className="bottom-6 right-6" />

                <div className="relative z-10 space-y-2">
                    <BotanicalHeaderFlourish color="#C2A676" className="!mx-0" />
                    <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-[#C2A676]">
                        WALIMATUL 'URS
                    </span>
                    <div className="h-[1px] w-14 bg-[#C2A676]/60" />
                </div>

                <div className="relative z-10 my-auto space-y-6">
                    <div className="relative mx-auto h-72 w-52 overflow-hidden rounded-t-full border-2 border-[#C2A676]/60 p-1 shadow-2xl">
                        <img
                            src={resolveImageUrl(
                                bride.photo || groom.photo,
                                '/assets/wedding/couple-foliage.png',
                            )}
                            alt="Mempelai"
                            className="h-full w-full rounded-t-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-t-full border border-white/20" />
                    </div>

                    <div className="text-center space-y-2">
                        <BotanicalDivider color="#C2A676" />
                        <h1
                            className="text-6xl font-normal italic tracking-wide text-[#FAF7F2]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groomNickname} & {brideNickname}
                        </h1>
                        <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C2A676]">
                            {formatDate(primaryDate)}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-[#C2A676]/20 pt-4 text-[11px] text-[#FAF7F2]/60">
                    <span className="uppercase tracking-widest">
                        Ngaturi Minimalist Sage Theme
                    </span>
                    <span className="font-serif italic text-[#C2A676]">
                        The Wedding of {groomNickname} & {brideNickname}
                    </span>
                </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT PANEL / MAIN MOBILE INVITATION CONTENT                   */}
            {/* ============================================================== */}
            <div
                ref={containerRef}
                id="basic-scroll-container"
                className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-[#FAF7F2] pb-24 scroll-smooth lg:w-[35%]"
            >
                {/* Floating Music Control */}
                {setIsPlayingMusic && (
                    <button
                        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                        aria-label="Toggle Music"
                        className="fixed right-5 top-5 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#2D4F3E]/20 bg-white/95 text-[#2D4F3E] shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    >
                        {isPlayingMusic ? (
                            <Volume2 size={18} className="animate-pulse" />
                        ) : (
                            <VolumeX size={18} />
                        )}
                    </button>
                )}

                {/* Subtle Botanical Background Pattern */}
                <div
                    className="pointer-events-none fixed inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: "url('/assets/wedding/hero-floral.png')",
                        backgroundRepeat: 'repeat',
                        backgroundSize: '360px',
                    }}
                />

                {/* 1. HERO COVER SECTION */}
                <motion.section
                    id="section-cover"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="relative flex min-h-[95vh] flex-col items-center justify-between px-6 py-10 text-center"
                >
                    <BotanicalCorner position="top-left" color="#2D4F3E" size={54} className="left-2 top-2" />
                    <BotanicalCorner position="top-right" color="#2D4F3E" size={54} className="right-2 top-2" />

                    <div className="space-y-2 pt-4">
                        <BotanicalHeaderFlourish color="#2D4F3E" />
                        <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D4F3E]/80">
                            THE WEDDING CELEBRATION OF
                        </span>
                    </div>

                    <motion.div variants={scaleIn} className="my-6 space-y-5">
                        <div className="relative mx-auto aspect-[3/4] w-56 overflow-hidden rounded-t-full border-4 border-white shadow-2xl">
                            <img
                                src={resolveImageUrl(
                                    bride.photo || groom.photo,
                                    '/assets/wedding/couple-foliage.png',
                                )}
                                alt="Couple"
                                className="h-full w-full object-cover"
                            />
                            <div className="pointer-events-none absolute inset-1.5 rounded-t-full border border-[#C2A676]/40" />
                        </div>

                        <div>
                            <BotanicalDivider color="#2D4F3E" className="!py-1" />
                            <h2
                                className="text-4xl sm:text-5xl font-normal italic text-[#2D4F3E]"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                }}
                            >
                                {groomNickname} & {brideNickname}
                            </h2>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#5F6E64]">
                                {formatDate(primaryDate)}
                            </p>
                        </div>
                    </motion.div>

                    <div className="w-full max-w-xs space-y-3 pb-4">
                        <a
                            href={createGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2D4F3E]/30 bg-white/90 py-3 text-xs font-semibold text-[#2D4F3E] shadow-sm backdrop-blur-xs transition hover:bg-[#2D4F3E] hover:text-white"
                        >
                            <CalendarIcon size={14} />
                            <span>Simpan ke Google Calendar</span>
                        </a>
                    </div>
                </motion.section>

                {/* 2. AYAT / QUOTE SECTION (HIGH CONTRAST FOREST SAGE BANNER) */}
                {showQuotes && (
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-10 text-center"
                    >
                        <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl bg-[#183124] p-8 text-[#FAF7F2] shadow-xl">
                            <BotanicalCorner position="top-left" color="#C2A676" size={44} className="left-2 top-2" />
                            <BotanicalCorner position="bottom-right" color="#C2A676" size={44} className="bottom-2 right-2" />

                            <img
                                src="/assets/theme_1/bismillah.webp"
                                alt="Bismillah"
                                className="mx-auto mb-4 h-9 object-contain brightness-0 invert opacity-85"
                            />

                            <p
                                className="text-xs leading-relaxed italic text-[#FAF7F2]/90"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '16px',
                                }}
                            >
                                "{quotes.text ||
                                    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}"
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <div className="h-[1px] w-8 bg-[#C2A676]/40" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2A676]">
                                    {quotes.source || 'QS. Ar-Rum : 21'}
                                </span>
                                <div className="h-[1px] w-8 bg-[#C2A676]/40" />
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* 3. MEMPELAI (STAGGERED COUPLE SLIDE ANIMATIONS) */}
                <section
                    id="section-couple"
                    className="relative space-y-8 px-6 py-10"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="text-center"
                    >
                        <BotanicalHeaderFlourish color="#2D4F3E" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D4F3E]">
                            PASANGAN MEMPELAI
                        </span>
                        <h3
                            className="mt-1 text-2xl font-bold text-[#2D4F3E]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            Mempelai Yang Berbahagia
                        </h3>
                        <p className="mt-1 text-[11px] text-[#5F6E64]">
                            Dengan memohon rahmat dan ridho Allah SWT, kami
                            bermaksud menyelenggarakan pernikahan putra-putri
                            kami:
                        </p>
                    </motion.div>

                    {/* Groom Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideLeft}
                        className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 text-center shadow-md transition hover:shadow-lg"
                    >
                        <BotanicalCorner position="top-left" color="#2D4F3E" size={38} className="left-1 top-1" />
                        <BotanicalCorner position="top-right" color="#2D4F3E" size={38} className="right-1 top-1" />

                        <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-[#2D4F3E]/30 p-1 shadow-md">
                            <img
                                src={resolveImageUrl(
                                    groom.photo,
                                    '/assets/theme_1/foto-mempelai-pria.webp',
                                )}
                                alt={groomFullName}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <h4
                            className="text-xl font-bold text-[#2D4F3E]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            {groomFullName}
                        </h4>
                        <p className="mt-1 text-xs text-[#5F6E64]">
                            {groom.parents ||
                                'Putra pertama dari Bpk. Ir. H. Bambang Pratama & Ibu Hj. Rina Wulandari'}
                        </p>
                        {groom.ig && (
                            <a
                                href={`https://instagram.com/${groom.ig.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-1 text-[11px] font-medium text-[#2D4F3E] hover:bg-[#2D4F3E] hover:text-white transition"
                            >
                                <InstagramIcon size={12} />
                                <span>{groom.ig}</span>
                            </a>
                        )}
                    </motion.div>

                    <BotanicalDivider color="#2D4F3E" />

                    {/* Bride Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideRight}
                        className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 text-center shadow-md transition hover:shadow-lg"
                    >
                        <BotanicalCorner position="top-left" color="#2D4F3E" size={38} className="left-1 top-1" />
                        <BotanicalCorner position="top-right" color="#2D4F3E" size={38} className="right-1 top-1" />

                        <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-[#2D4F3E]/30 p-1 shadow-md">
                            <img
                                src={resolveImageUrl(
                                    bride.photo,
                                    '/assets/theme_1/foto-mempelai-cewe.webp',
                                )}
                                alt={brideFullName}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <h4
                            className="text-xl font-bold text-[#2D4F3E]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            {brideFullName}
                        </h4>
                        <p className="mt-1 text-xs text-[#5F6E64]">
                            {bride.parents ||
                                'Putri kedua dari Bpk. Drs. H. Hendra Setiawan & Ibu Hj. Dewi Anggraini'}
                        </p>
                        {bride.ig && (
                            <a
                                href={`https://instagram.com/${bride.ig.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-1 text-[11px] font-medium text-[#2D4F3E] hover:bg-[#2D4F3E] hover:text-white transition"
                            >
                                <InstagramIcon size={12} />
                                <span>{bride.ig}</span>
                            </a>
                        )}
                    </motion.div>
                </section>

                {/* 4. COUNTDOWN (LUXURY CONTRAST STRIP) */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="relative px-6 py-6"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-[#1D3529] p-7 text-center text-white shadow-xl">
                        <BotanicalCorner position="top-left" color="#C2A676" size={38} className="left-2 top-2" />
                        <BotanicalCorner position="bottom-right" color="#C2A676" size={38} className="bottom-2 right-2" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C2A676]">
                            MENGHITUNG HARI
                        </span>
                        <h3
                            className="mt-1 text-2xl font-bold text-[#FAF7F2]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            Menuju Hari Bahagia
                        </h3>
                        <div className="mt-5">
                            <CountdownBlock targetDate={primaryDate} />
                        </div>
                    </div>
                </motion.section>

                {/* 5. ACARA PERNIKAHAN (EVENTS SCHEDULE WITH DATE BADGES) */}
                <section
                    id="section-event"
                    className="relative space-y-6 px-6 py-10"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="text-center"
                    >
                        <BotanicalHeaderFlourish color="#2D4F3E" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D4F3E]">
                            WAKTU & TEMPAT
                        </span>
                        <h3
                            className="mt-1 text-2xl font-bold text-[#2D4F3E]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            Rangkaian Acara
                        </h3>
                    </motion.div>

                    {/* Akad Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 shadow-md transition hover:shadow-lg"
                    >
                        <BotanicalCorner position="top-right" color="#2D4F3E" size={42} className="right-1 top-1" />

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2D4F3E]/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2D4F3E]">
                            <Sparkles size={12} />
                            <span>Akad Nikah</span>
                        </div>
                        <h4
                            className="text-xl font-bold text-[#2D4F3E]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            {schedules.akad?.venue || 'Masjid Agung Al-Ikhlas'}
                        </h4>
                        <div className="mt-4 space-y-2.5 text-xs text-[#5F6E64]">
                            <div className="flex items-center gap-2.5">
                                <CalendarIcon size={14} className="text-[#2D4F3E]" />
                                <span className="font-semibold text-[#243028]">
                                    {formatDate(schedules.akad?.date || akadDate)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock size={14} className="text-[#2D4F3E]" />
                                <span>{schedules.akad?.time || '08:00 - 10:00 WIB'}</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <MapPin size={14} className="mt-0.5 shrink-0 text-[#2D4F3E]" />
                                <span>
                                    {schedules.akad?.address ||
                                        'Jl. Melati Indah No. 45, Kebayoran Baru, Jakarta Selatan'}
                                </span>
                            </div>
                        </div>

                        {schedules.akad?.maps && (
                            <a
                                href={schedules.akad.maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D4F3E] py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#183124]"
                            >
                                <MapPin size={13} />
                                <span>Petunjuk Lokasi (Google Maps)</span>
                            </a>
                        )}
                    </motion.div>

                    {/* Resepsi Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 shadow-md transition hover:shadow-lg"
                    >
                        <BotanicalCorner position="top-right" color="#C2A676" size={42} className="right-1 top-1" />

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C2A676]/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2D4F3E]">
                            <Heart size={12} />
                            <span>Resepsi Pernikahan</span>
                        </div>
                        <h4
                            className="text-xl font-bold text-[#2D4F3E]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            {schedules.resepsi?.venue ||
                                'The Glass House Grand Ballroom'}
                        </h4>
                        <div className="mt-4 space-y-2.5 text-xs text-[#5F6E64]">
                            <div className="flex items-center gap-2.5">
                                <CalendarIcon size={14} className="text-[#2D4F3E]" />
                                <span className="font-semibold text-[#243028]">
                                    {formatDate(schedules.resepsi?.date || resepsiDate)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock size={14} className="text-[#2D4F3E]" />
                                <span>{schedules.resepsi?.time || '11:00 - 14:00 WIB'}</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <MapPin size={14} className="mt-0.5 shrink-0 text-[#2D4F3E]" />
                                <span>
                                    {schedules.resepsi?.address ||
                                        'Jl. Sudirman Boulevard No. 108, Jakarta Selatan'}
                                </span>
                            </div>
                        </div>

                        {schedules.resepsi?.maps && (
                            <a
                                href={schedules.resepsi.maps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D4F3E] py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#183124]"
                            >
                                <MapPin size={13} />
                                <span>Petunjuk Lokasi (Google Maps)</span>
                            </a>
                        )}
                    </motion.div>
                </section>

                {/* 6. CERITA CINTA (STEPPED TIMELINE) */}
                {showStory && stories.length > 0 && (
                    <motion.section
                        id="section-story"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-10"
                    >
                        <div className="text-center">
                            <BotanicalHeaderFlourish color="#2D4F3E" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D4F3E]">
                                KISAH KAMI
                            </span>
                            <h3
                                className="mt-1 text-2xl font-bold text-[#2D4F3E]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Perjalanan Cerita Cinta
                            </h3>
                        </div>

                        <div className="relative mt-8 border-l-2 border-[#2D4F3E]/20 pl-6 space-y-6">
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    variants={fadeUp}
                                    className="relative rounded-2xl border border-[#2D4F3E]/10 bg-white/80 p-4 shadow-xs"
                                >
                                    <div className="absolute -left-[32px] top-4 h-4 w-4 rounded-full border-2 border-[#2D4F3E] bg-[#FAF7F2]" />
                                    <span className="inline-block rounded-full bg-[#2D4F3E]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#2D4F3E]">
                                        {story.year || `Babak ${idx + 1}`}
                                    </span>
                                    <h4 className="mt-1 text-sm font-bold text-[#2D4F3E]">
                                        {story.title}
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-[#5F6E64]">
                                        {story.content}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* 7. GALERI FOTO (MASONRY GRID) */}
                {showGallery && displayPhotos.length > 0 && (
                    <motion.section
                        id="section-gallery"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={fadeUp}
                        className="relative px-6 py-10"
                    >
                        <div className="text-center">
                            <BotanicalHeaderFlourish color="#2D4F3E" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2D4F3E]">
                                MOMEN INDAH
                            </span>
                            <h3
                                className="mt-1 text-2xl font-bold text-[#2D4F3E]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Galeri Kebersamaan
                            </h3>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {displayPhotos.map((photo: any, index: number) => (
                                <motion.div
                                    key={photo.id || index}
                                    variants={scaleIn}
                                    onClick={() =>
                                        setActivePhoto(
                                            resolveImageUrl(photo.url, ''),
                                        )
                                    }
                                    className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl border-2 border-white shadow-sm transition hover:shadow-md"
                                >
                                    <img
                                        src={resolveImageUrl(photo.url, '')}
                                        alt={`Moment ${index + 1}`}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* 8. TANDA KASIH (LUXURY BANK CARD MOCKUP) */}
                {showGift && (
                    <motion.section
                        id="section-gift"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-10"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 shadow-md text-center">
                            <BotanicalCorner position="top-left" color="#C2A676" size={38} className="left-1 top-1" />
                            <BotanicalCorner position="bottom-right" color="#C2A676" size={38} className="bottom-1 right-1" />

                            <Gift
                                size={24}
                                className="mx-auto mb-2 text-[#2D4F3E]"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D4F3E]">
                                TANDA KASIH
                            </span>
                            <h3
                                className="mt-1 text-xl font-bold text-[#2D4F3E]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Amplop Digital
                            </h3>
                            <p className="mt-2 text-xs text-[#5F6E64]">
                                Doa restu Anda merupakan karunia terindah bagi
                                kami. Namun jika berkenan memberi tanda kasih,
                                Anda dapat mengirimkannya melalui:
                            </p>

                            <div className="mt-6 space-y-4">
                                {/* Groom Bank Card Mockup */}
                                {groom.bankName && groom.accountNumber && (
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D3529] to-[#2D4F3E] p-5 text-left text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#C2A676]">
                                                {groom.bankName}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleCopy(
                                                        groom.accountNumber,
                                                        'groom',
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs transition hover:bg-white/30"
                                            >
                                                {copiedGroomBank ? (
                                                    <>
                                                        <Check size={12} className="text-emerald-300" />
                                                        <span>Tersalin!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>Salin</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className="mt-4 font-mono text-base font-bold tracking-widest text-[#FAF7F2]">
                                            {groom.accountNumber}
                                        </p>
                                        <p className="mt-1 text-[11px] uppercase tracking-wider text-[#FAF7F2]/75">
                                            a.n {groom.accountHolder || groomFullName}
                                        </p>
                                    </div>
                                )}

                                {/* Bride Bank Card Mockup */}
                                {bride.bankName && bride.accountNumber && (
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C2A676] to-[#99794B] p-5 text-left text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
                                                {bride.bankName}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleCopy(
                                                        bride.accountNumber,
                                                        'bride',
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs transition hover:bg-white/35"
                                            >
                                                {copiedBrideBank ? (
                                                    <>
                                                        <Check size={12} className="text-emerald-200" />
                                                        <span>Tersalin!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>Salin</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className="mt-4 font-mono text-base font-bold tracking-widest text-white">
                                            {bride.accountNumber}
                                        </p>
                                        <p className="mt-1 text-[11px] uppercase tracking-wider text-white/80">
                                            a.n {bride.accountHolder || brideFullName}
                                        </p>
                                    </div>
                                )}

                                {/* Gift Address */}
                                {customStyle.giftAddress && (
                                    <div className="rounded-2xl border border-[#2D4F3E]/15 bg-[#FAF7F2] p-4 text-left">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#2D4F3E]">
                                                Kirim Kado Fisik
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleCopyAddress(
                                                        customStyle.giftAddress,
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#2D4F3E] hover:underline"
                                            >
                                                {copiedAddress ? (
                                                    <>
                                                        <Check size={12} />
                                                        <span>Tersalin!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>Salin</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className="mt-2 text-xs text-[#5F6E64] leading-relaxed">
                                            {customStyle.giftAddress}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* 9. KONFIRMASI KEHADIRAN (RSVP) */}
                {showRsvp && (
                    <motion.section
                        id="section-rsvp"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-10"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 shadow-md text-left">
                            <BotanicalCorner position="top-right" color="#2D4F3E" size={36} className="right-1 top-1" />

                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D4F3E]">
                                RSVP
                            </span>
                            <h3
                                className="mt-1 text-xl font-bold text-[#2D4F3E]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Konfirmasi Kehadiran
                            </h3>
                            <p className="mt-1 text-xs text-[#5F6E64]">
                                Mohon konfirmasi kehadiran Anda untuk membantu
                                kami mempersiapkan jamuan dengan baik:
                            </p>

                            {rsvpSubmitted ? (
                                <div className="mt-6 rounded-2xl bg-[#2D4F3E]/10 p-5 text-center text-xs font-semibold text-[#2D4F3E]">
                                    <Check
                                        size={24}
                                        className="mx-auto mb-2 text-[#2D4F3E]"
                                    />
                                    Terima kasih! Konfirmasi kehadiran Anda
                                    telah kami terima.
                                </div>
                            ) : (
                                <form onSubmit={handleRsvp} className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#2D4F3E]">
                                            Nama Tamu
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={rsvpName}
                                            onChange={(e) =>
                                                setRsvpName(e.target.value)
                                            }
                                            placeholder="Contoh: Dimas & Partner"
                                            className="mt-1 block w-full rounded-xl border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-[#243028] placeholder-[#5F6E64]/60 focus:border-[#2D4F3E] focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#2D4F3E]">
                                            Apakah Anda Akan Hadir?
                                        </label>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRsvpStatus('hadir')
                                                }
                                                className={`cursor-pointer rounded-xl border py-2.5 text-xs font-semibold transition ${
                                                    rsvpStatus === 'hadir'
                                                        ? 'border-[#2D4F3E] bg-[#2D4F3E] text-white shadow-xs'
                                                        : 'border-[#2D4F3E]/20 bg-[#FAF7F2] text-[#2D4F3E]'
                                                }`}
                                            >
                                                Ya, Saya Hadir
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRsvpStatus('tidak_hadir')
                                                }
                                                className={`cursor-pointer rounded-xl border py-2.5 text-xs font-semibold transition ${
                                                    rsvpStatus === 'tidak_hadir'
                                                        ? 'border-[#2D4F3E] bg-[#2D4F3E] text-white shadow-xs'
                                                        : 'border-[#2D4F3E]/20 bg-[#FAF7F2] text-[#2D4F3E]'
                                                }`}
                                            >
                                                Maaf, Berhalangan
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#2D4F3E]">
                                            Jumlah Tamu
                                        </label>
                                        <select
                                            value={rsvpCount}
                                            onChange={(e) =>
                                                setRsvpCount(e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-xl border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-[#243028] focus:border-[#2D4F3E] focus:outline-hidden"
                                        >
                                            <option value="1">1 Orang</option>
                                            <option value="2">2 Orang</option>
                                            <option value="3">3 Orang</option>
                                            <option value="4">4 Orang</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#2D4F3E]">
                                            Catatan / Pesan Singkat (Opsional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={rsvpMsg}
                                            onChange={(e) =>
                                                setRsvpMsg(e.target.value)
                                            }
                                            placeholder="Tulis pesan untuk mempelai..."
                                            className="mt-1 block w-full resize-none rounded-xl border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-[#243028] placeholder-[#5F6E64]/60 focus:border-[#2D4F3E] focus:outline-hidden"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={rsvpLoading}
                                        className="w-full cursor-pointer rounded-xl bg-[#2D4F3E] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#183124] disabled:opacity-50"
                                    >
                                        {rsvpLoading
                                            ? 'Mengirim...'
                                            : 'Kirim Konfirmasi'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* 10. BUKU TAMU / UCAPAN (WISHES) */}
                {showWishes && (
                    <motion.section
                        id="section-wishes"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-10"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-[#2D4F3E]/15 bg-white p-6 shadow-md text-left">
                            <BotanicalCorner position="top-right" color="#2D4F3E" size={36} className="right-1 top-1" />

                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D4F3E]">
                                BUKU TAMU
                            </span>
                            <h3
                                className="mt-1 text-xl font-bold text-[#2D4F3E]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Doa & Ucapan Selamat
                            </h3>

                            {/* Wish Form */}
                            <form
                                onSubmit={handleWishSubmit}
                                className="mt-4 space-y-3"
                            >
                                <input
                                    type="text"
                                    required
                                    value={wishName}
                                    onChange={(e) =>
                                        setWishName(e.target.value)
                                    }
                                    placeholder="Nama Anda"
                                    className="block w-full rounded-xl border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-[#243028] placeholder-[#5F6E64]/60 focus:border-[#2D4F3E] focus:outline-hidden"
                                />
                                <textarea
                                    required
                                    rows={3}
                                    value={wishMsg}
                                    onChange={(e) =>
                                        setWishMsg(e.target.value)
                                    }
                                    placeholder="Tulis ucapan dan doa tulus Anda..."
                                    className="block w-full resize-none rounded-xl border border-[#2D4F3E]/20 bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-[#243028] placeholder-[#5F6E64]/60 focus:border-[#2D4F3E] focus:outline-hidden"
                                />
                                <button
                                    type="submit"
                                    disabled={wishLoading}
                                    className="w-full cursor-pointer rounded-xl bg-[#2D4F3E] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#183124] disabled:opacity-50"
                                >
                                    {wishLoading ? 'Mengirim...' : 'Kirim Ucapan'}
                                </button>
                            </form>

                            {/* Wishes List */}
                            <div className="mt-6 divide-y divide-[#2D4F3E]/10 max-h-80 overflow-y-auto pr-1">
                                {localWishes.length === 0 ? (
                                    <p className="py-6 text-center text-xs italic text-[#5F6E64]">
                                        Belum ada ucapan. Jadilah yang pertama
                                        mendoakan!
                                    </p>
                                ) : (
                                    localWishes.map((w: any) => (
                                        <div key={w.id} className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D4F3E] text-[11px] font-bold text-white shadow-xs">
                                                    {w.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-xs font-bold text-[#2D4F3E]">
                                                    {w.name}
                                                </span>
                                            </div>
                                            <p className="mt-1 pl-9 text-xs leading-relaxed text-[#5F6E64]">
                                                {w.message}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* 11. CLOSING & THANK YOU NOTE */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="relative px-6 py-14 text-center"
                >
                    <BotanicalHeaderFlourish color="#2D4F3E" />
                    <p className="mt-3 text-xs text-[#5F6E64] leading-relaxed">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami
                        apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan
                        doa restu kepada kedua mempelai.
                    </p>
                    <p className="mt-6 text-xs font-semibold text-[#2D4F3E]">
                        Wassalamu'alaikum Warahmatullahi Wabarakatuh
                    </p>
                    <div className="mt-6">
                        <p
                            className="text-4xl font-normal italic text-[#2D4F3E]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groomNickname} & {brideNickname}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-[#5F6E64]">
                            Beserta Keluarga Besar
                        </p>
                    </div>

                    <BotanicalDivider color="#2D4F3E" className="mt-6" />

                    <div className="mt-8 border-t border-[#2D4F3E]/15 pt-6 text-[10px] text-[#5F6E64]">
                        <p>© {new Date().getFullYear()} Ngaturi Invitation • All Rights Reserved</p>
                    </div>
                </motion.section>

                {/* 12. FLOATING BOTTOM NAVIGATION DOCK */}
                <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:left-auto lg:right-[17.5%] lg:translate-x-1/2">
                    <nav className="flex items-center gap-1 rounded-full border border-[#2D4F3E]/20 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md">
                        {[
                            { id: 'section-cover', label: 'Cover', icon: Heart },
                            { id: 'section-couple', label: 'Mempelai', icon: User },
                            { id: 'section-event', label: 'Acara', icon: CalendarIcon },
                            { id: 'section-gallery', label: 'Galeri', icon: ImageIcon },
                            { id: 'section-rsvp', label: 'RSVP', icon: MessageSquare },
                        ].map((item) => {
                            const IconComponent = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`relative cursor-pointer rounded-full p-2.5 transition-all duration-300 ${
                                        isActive
                                            ? 'bg-[#2D4F3E]/12 text-[#2D4F3E] shadow-xs scale-105'
                                            : 'text-[#5F6E64] hover:bg-[#2D4F3E]/8 hover:text-[#2D4F3E]'
                                    }`}
                                    title={item.label}
                                    aria-label={item.label}
                                >
                                    <IconComponent size={17} />
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* ============================================================== */}
            {/* OPENING COVER OVERLAY (When !isOpened)                         */}
            {/* ============================================================== */}
            <AnimatePresence>
                {!isOpened && onOpen && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#183124] p-8 text-center text-white"
                    >
                        <div
                            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
                            style={{
                                backgroundImage: "url('/assets/wedding/hero-floral.png')",
                            }}
                        />

                        <BotanicalCorner position="top-left" color="#C2A676" size={68} className="left-4 top-4" />
                        <BotanicalCorner position="top-right" color="#C2A676" size={68} className="right-4 top-4" />
                        <BotanicalCorner position="bottom-left" color="#C2A676" size={68} className="bottom-4 left-4" />
                        <BotanicalCorner position="bottom-right" color="#C2A676" size={68} className="bottom-4 right-4" />

                        <div className="relative z-10 space-y-2 pt-6">
                            <BotanicalHeaderFlourish color="#C2A676" />
                            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-[#C2A676]">
                                UNDANGAN PERNIKAHAN
                            </span>
                        </div>

                        <div className="relative z-10 my-auto space-y-5">
                            <div className="relative mx-auto h-52 w-40 overflow-hidden rounded-t-full border-2 border-[#C2A676]/60 p-1 shadow-2xl">
                                <img
                                    src={resolveImageUrl(
                                        bride.photo || groom.photo,
                                        '/assets/wedding/couple-foliage.png',
                                    )}
                                    alt="Mempelai"
                                    className="h-full w-full rounded-t-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-1.5 rounded-t-full border border-white/20" />
                            </div>
                            <div>
                                <BotanicalDivider color="#C2A676" className="!py-1" />
                                <h1
                                    className="text-4xl sm:text-5xl font-normal italic text-[#FAF7F2]"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                    }}
                                >
                                    {groomNickname} & {brideNickname}
                                </h1>
                                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#C2A676]">
                                    {formatDate(primaryDate)}
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 w-full max-w-xs space-y-4 pb-6">
                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-[#FAF7F2]/75">
                                    Kepada Yth. Bapak/Ibu/Saudara/i:
                                </p>
                                <p className="mt-1 text-base font-bold text-[#C2A676]">
                                    {guestName || 'Tamu Undangan'}
                                </p>
                            </div>

                            <button
                                onClick={onOpen}
                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#C2A676] py-3.5 text-xs font-bold uppercase tracking-widest text-[#183124] shadow-xl transition hover:scale-105 hover:bg-[#d4b98c]"
                            >
                                <Heart size={14} className="fill-current" />
                                <span>Buka Undangan</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Photo Lightbox Modal */}
            <AnimatePresence>
                {activePhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActivePhoto(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <button
                            onClick={() => setActivePhoto(null)}
                            className="absolute right-6 top-6 text-white/80 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={activePhoto}
                            alt="Full Preview"
                            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BasicTheme1;
