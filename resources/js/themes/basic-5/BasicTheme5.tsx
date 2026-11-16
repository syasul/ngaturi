import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Check,
    Clock,
    Copy,
    Gift,
    Heart,
    Image as ImageIcon,
    MapPin,
    MessageCircle,
    MessageSquare,
    Sparkles,
    User,
    Volume2,
    VolumeX,
    Waves,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
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

// Ocean Wave Corner Ornament
const OceanCorner = ({
    position = 'top-left',
    color = '#244B66',
    size = 46,
    className = '',
}: {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: string;
    size?: number;
    className?: string;
}) => {
    const transforms: Record<string, string> = {
        'top-left': 'scale(1, 1)',
        'top-right': 'scale(-1, 1)',
        'bottom-left': 'scale(1, -1)',
        'bottom-right': 'scale(-1, -1)',
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none absolute select-none ${className}`}
            style={{ transform: transforms[position] }}
        >
            <path
                d="M4 60 V20 C4 11.16 11.16 4 20 4 H60"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.35"
            />
            {/* Wave curl */}
            <path
                d="M20 20 C24 12 34 16 30 24 C26 32 16 28 20 20 Z"
                fill={color}
                fillOpacity="0.45"
            />
            <path
                d="M16 36 C22 30 30 34 26 40 C22 46 12 42 16 36 Z"
                fill={color}
                fillOpacity="0.3"
            />
            <circle cx="20" cy="4" r="2" fill={color} />
            <circle cx="4" cy="20" r="2" fill={color} />
        </svg>
    );
};

// Ocean Wave Divider
const OceanDivider = ({
    color = '#244B66',
    accent = '#C59B5F',
    className = '',
}: {
    color?: string;
    accent?: string;
    className?: string;
}) => (
    <div className={`flex items-center justify-center gap-3 select-none py-2 ${className}`}>
        <div
            className="h-[1px] w-14 sm:w-20 opacity-30"
            style={{ background: `linear-gradient(to right, transparent, ${color})` }}
        />
        <svg width="32" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0 10 Q 5 2, 10 10 T 20 10 T 30 10 T 40 10"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />
            <circle cx="20" cy="6" r="2" fill={accent} />
        </svg>
        <div
            className="h-[1px] w-14 sm:w-20 opacity-30"
            style={{ background: `linear-gradient(to left, transparent, ${color})` }}
        />
    </div>
);

// Ocean Wave Crest
const OceanCrest = ({
    color = '#244B66',
    accent = '#C59B5F',
    className = '',
}: {
    color?: string;
    accent?: string;
    className?: string;
}) => (
    <svg
        width="110"
        height="26"
        viewBox="0 0 140 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`mx-auto select-none ${className}`}
    >
        <line
            x1="10"
            y1="16"
            x2="52"
            y2="16"
            stroke={color}
            strokeWidth="1.2"
            strokeOpacity="0.35"
            strokeLinecap="round"
        />
        <line
            x1="88"
            y1="16"
            x2="130"
            y2="16"
            stroke={color}
            strokeWidth="1.2"
            strokeOpacity="0.35"
            strokeLinecap="round"
        />
        <circle cx="70" cy="16" r="4" fill={accent} />
        <path
            d="M58 16 Q 64 8, 70 16 Q 76 24, 82 16"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
        />
        <circle cx="48" cy="16" r="1.5" fill={color} fillOpacity="0.5" />
        <circle cx="92" cy="16" r="1.5" fill={color} fillOpacity="0.5" />
    </svg>
);

const resolveImageUrl = (url: string | null | undefined, fallback: string) => {
    if (!url) return fallback;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    if (url.startsWith('assets/')) return `/${url}`;
    return `/storage/${url}`;
};

// Countdown Block
const CountdownBlock = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const items = [
        { label: 'HARI', val: timeLeft.days },
        { label: 'JAM', val: timeLeft.hours },
        { label: 'MENIT', val: timeLeft.minutes },
        { label: 'DETIK', val: timeLeft.seconds },
    ];

    return (
        <div className="mx-auto grid max-w-sm grid-cols-4 gap-2.5">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-md"
                >
                    <span
                        className="text-2xl sm:text-3xl font-bold text-[#F3F7FA]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-wider text-[#C59B5F]">
                        {item.label}
                    </span>
                    <div className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-[#C59B5F]/20" />
                </div>
            ))}
        </div>
    );
};

export interface BasicTheme5Props extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}

export const BasicTheme5: React.FC<BasicTheme5Props> = ({
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

    // Couple names
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

    // RSVP Form state
    const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'tidak_hadir' | 'ragu'>('hadir');
    const [guestCount, setGuestCount] = useState<number>(1);
    const [rsvpName, setRsvpName] = useState(guestName || '');
    const [rsvpMessage, setRsvpMessage] = useState('');
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
    const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

    // Wishes state
    const [localWishes, setLocalWishes] = useState<any[]>(wishes);
    const [wishName, setWishName] = useState(guestName || '');
    const [wishMsg, setWishMsg] = useState('');
    const [wishLoading, setWishLoading] = useState(false);

    // Lightbox modal state
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    // Scrollspy active section tracking
    const [activeSection, setActiveSection] = useState<string>('section-cover');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container =
            containerRef.current ||
            document.getElementById('basic5-scroll-container');
        if (!container) return;

        const checkActiveSection = () => {
            const containerRect = container.getBoundingClientRect();
            const threshold = containerRect.top + containerRect.height * 0.35;

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

        container.addEventListener('scroll', checkActiveSection, { passive: true });
        window.addEventListener('scroll', checkActiveSection, { passive: true });
        checkActiveSection();

        return () => {
            container.removeEventListener('scroll', checkActiveSection);
            window.removeEventListener('scroll', checkActiveSection);
        };
    }, [isOpened]);

    const handleCopy = (text: string, setter: (val: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
    };

    const handleRsvpSubmitInternal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rsvpName) return;
        setIsSubmittingRsvp(true);

        try {
            if (onRsvpSubmit) {
                await onRsvpSubmit(rsvpStatus, rsvpMessage);
            }
            if (rsvpMessage.trim()) {
                const newWish = {
                    id: String(Date.now()),
                    name: rsvpName,
                    message: rsvpMessage,
                    createdAt: new Date().toISOString(),
                    rsvpStatus,
                };
                setLocalWishes((prev) => [newWish, ...prev]);
            }
            setRsvpSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmittingRsvp(false);
        }
    };

    const handleWishSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishName || !wishMsg) return;
        setWishLoading(true);

        try {
            if (onRsvpSubmit) {
                await onRsvpSubmit('hadir', wishMsg);
            }
            const newWish = {
                id: String(Date.now()),
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

    const scrollTo = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        const container =
            containerRef.current ||
            document.getElementById('basic5-scroll-container');
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
            `Walimatul Ursy ${groomFullName} & ${brideFullName}. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`,
        );
        const location = encodeURIComponent(
            schedules.akad?.location || schedules.resepsi?.location || 'Lokasi Pernikahan',
        );

        const cleanDate = (primaryDate || '').replace(/[^0-9]/g, '');
        const startDateStr = cleanDate
            ? `${cleanDate}T080000`
            : '20261024T080000';
        const endDateStr = cleanDate
            ? `${cleanDate}T130000`
            : '20261024T130000';

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDateStr}/${endDateStr}`;
    };

    const coupleHeroPhoto = resolveImageUrl(
        (data as any)?.coverPhoto ||
            (data as any)?.heroPhoto ||
            (data as any)?.couplePhoto ||
            customStyle?.heroPhoto ||
            photos?.find((p: any) => p.type === 'cover')?.url,
        '/assets/wedding/couple-foliage.png',
    );
    const groomPhoto = resolveImageUrl(
        groom.photo,
        '/assets/theme_1/foto-mempelai-pria.webp',
    );
    const bridePhoto = resolveImageUrl(
        bride.photo,
        '/assets/theme_1/foto-mempelai-wanita.webp',
    );

    return (
        <div
            className="relative flex min-h-screen w-full flex-col font-sans select-none lg:flex-row"
            style={{ colorScheme: 'only light' }}
        >
            {/* ============================================================== */}
            {/* LEFT PANEL: DESKTOP OCEAN BREEZE SHOWCASE                      */}
            {/* ============================================================== */}
            <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden bg-[#112330] p-12 text-[#F3F7FA] lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112330] via-[#112330]/75 to-transparent" />

                <OceanCorner position="top-left" color="#5B82A1" size={68} className="left-8 top-8" />
                <OceanCorner position="bottom-right" color="#5B82A1" size={68} className="bottom-8 right-8" />

                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#5B82A1]/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C59B5F] backdrop-blur-md">
                        <Waves size={13} /> The Ocean Wedding
                    </span>
                </div>

                <div className="relative z-10 max-w-xl py-12">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#5B82A1]">
                        Walimatul Ursy
                    </p>
                    <h1
                        className="mt-4 text-7xl font-normal leading-tight text-white drop-shadow-md"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                        {groomNickname} & {brideNickname}
                    </h1>
                    <p
                        className="mt-3 text-lg font-normal tracking-wide text-[#F3F7FA]/80"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {primaryDate} • Coastal Ceremony
                    </p>
                    <OceanDivider color="#5B82A1" accent="#C59B5F" className="my-6 !justify-start" />
                    <p className="max-w-md text-xs leading-relaxed text-[#F3F7FA]/70">
                        &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.&rdquo;
                    </p>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] text-[#F3F7FA]/50">
                    <span>Ngaturi Invitation • Ocean Breeze Edition</span>
                    <span>Scroll panel kanan untuk melihat undangan &rarr;</span>
                </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT PANEL / MAIN MOBILE INVITATION CONTENT                   */}
            {/* ============================================================== */}
            <div
                ref={containerRef}
                id="basic5-scroll-container"
                className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-[#F3F7FA] pb-24 scroll-smooth lg:w-[35%]"
            >
                {/* Floating Music Control */}
                {setIsPlayingMusic && (
                    <button
                        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                        aria-label="Toggle Music"
                        className="fixed right-5 top-5 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#244B66]/20 bg-white/95 text-[#244B66] shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    >
                        {isPlayingMusic ? (
                            <Volume2 size={18} className="animate-pulse" />
                        ) : (
                            <VolumeX size={18} className="opacity-60" />
                        )}
                    </button>
                )}

                {/* 1. COVER / HERO SECTION */}
                <section
                    id="section-cover"
                    className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-6 py-12 text-center"
                >
                    <OceanCorner position="top-left" color="#244B66" size={54} className="left-4 top-4" />
                    <OceanCorner position="top-right" color="#244B66" size={54} className="right-4 top-4" />

                    <div className="relative z-10 mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#5B82A1]">
                            The Wedding Of
                        </p>
                        <h2
                            className="mt-2 text-5xl sm:text-6xl font-normal text-[#183042]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groomNickname} & {brideNickname}
                        </h2>
                    </div>

                    {/* Ocean Arch Frame Photo */}
                    <div className="relative z-10 my-6">
                        <div className="relative mx-auto h-72 w-56 sm:h-80 sm:w-64 overflow-hidden rounded-t-full border-4 border-[#244B66]/25 bg-white p-2 shadow-2xl">
                            <div className="relative h-full w-full overflow-hidden rounded-t-full bg-[#E8EFF4]">
                                <img
                                    src={coupleHeroPhoto}
                                    alt="Hero Couple"
                                    className="h-full w-full object-cover object-top transition duration-700 hover:scale-105"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#244B66]/20 bg-white px-4 py-1 text-[11px] font-semibold text-[#244B66] shadow-md">
                            {primaryDate}
                        </div>
                    </div>

                    <div className="relative z-10 mb-8 max-w-xs">
                        <p className="text-xs text-[#516A7D]">
                            Kepada Yth. Bapak/Ibu/Saudara/i:
                        </p>
                        <div className="mt-2 rounded-2xl border border-[#244B66]/20 bg-white/90 p-3 shadow-sm backdrop-blur-xs">
                            <p className="text-base font-bold text-[#183042]">
                                {guestName || 'Tamu Undangan'}
                            </p>
                            <p className="text-[10px] text-[#516A7D]">
                                Di Tempat
                            </p>
                        </div>
                    </div>

                    <OceanDivider color="#244B66" accent="#C59B5F" />
                </section>

                {/* 2. AYAT & BISMILLAH SECTION (CONTRAST MIDNIGHT OCEAN BANNER) */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="relative overflow-hidden bg-[#112330] px-6 py-14 text-center text-[#F3F7FA] shadow-inner"
                >
                    <OceanCorner position="top-left" color="#5B82A1" size={44} className="left-3 top-3 opacity-60" />
                    <OceanCorner position="bottom-right" color="#5B82A1" size={44} className="bottom-3 right-3 opacity-60" />

                    <div className="relative z-10 mx-auto max-w-md">
                        <img
                            src="/assets/bismillah.webp"
                            alt="Bismillah"
                            className="mx-auto h-9 w-auto brightness-200 invert opacity-90 select-none"
                        />
                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-[#C59B5F]">
                            Ar-Rum : 21
                        </p>
                        <p
                            className="mt-3 text-xs sm:text-sm font-normal italic leading-relaxed text-[#F3F7FA]/90"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="h-[1px] w-8 bg-[#C59B5F]/40" />
                            <Heart size={12} className="text-[#C59B5F] fill-[#C59B5F]" />
                            <span className="h-[1px] w-8 bg-[#C59B5F]/40" />
                        </div>
                    </div>
                </motion.section>

                {/* 3. COUPLE DETAILS SECTION */}
                <section id="section-couple" className="relative px-6 py-16">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="text-center"
                    >
                        <OceanCrest color="#244B66" accent="#C59B5F" />
                        <h3
                            className="mt-2 text-3xl font-bold text-[#183042]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Pasangan Mempelai
                        </h3>
                        <p className="mt-1 text-xs text-[#516A7D]">
                            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan:
                        </p>
                    </motion.div>

                    {/* GROOM CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideLeft}
                        className="mt-10 overflow-hidden rounded-3xl border border-[#244B66]/20 bg-white p-6 shadow-md"
                    >
                        <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-[#E8EFF4] shadow-lg">
                            <img
                                src={groomPhoto}
                                alt={groomFullName}
                                className="h-full w-full object-cover object-top transition duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="mt-5 text-center">
                            <h4
                                className="text-2xl font-bold text-[#183042]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {groomFullName}
                            </h4>
                            <p
                                className="text-xl font-normal italic text-[#244B66]"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                - {groomNickname} -
                            </p>
                            <p className="mt-2 text-xs text-[#516A7D] leading-relaxed">
                                {groom.parents || 'Putra dari Bpk. Bambang & Ibu Siti'}
                            </p>
                            {groom.bio && (
                                <p className="mt-2 text-[11px] italic text-[#516A7D]/80">
                                    &ldquo;{groom.bio}&rdquo;
                                </p>
                            )}
                            {groom.ig && (
                                <div className="mt-4 flex justify-center">
                                    <a
                                        href={`https://instagram.com/${groom.ig.replace('@', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-1.5 text-[11px] font-semibold text-[#244B66] transition hover:bg-[#244B66] hover:text-white"
                                    >
                                        <InstagramIcon size={12} />
                                        <span>{groom.ig}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* AMPERSAND DIVIDER */}
                    <div className="my-8 flex items-center justify-center gap-4 text-[#244B66]">
                        <div className="h-[1px] flex-1 bg-[#244B66]/20" />
                        <span
                            className="text-4xl font-normal italic"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            &
                        </span>
                        <div className="h-[1px] flex-1 bg-[#244B66]/20" />
                    </div>

                    {/* BRIDE CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideRight}
                        className="overflow-hidden rounded-3xl border border-[#244B66]/20 bg-white p-6 shadow-md"
                    >
                        <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-[#E8EFF4] shadow-lg">
                            <img
                                src={bridePhoto}
                                alt={brideFullName}
                                className="h-full w-full object-cover object-top transition duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="mt-5 text-center">
                            <h4
                                className="text-2xl font-bold text-[#183042]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {brideFullName}
                            </h4>
                            <p
                                className="text-xl font-normal italic text-[#244B66]"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                - {brideNickname} -
                            </p>
                            <p className="mt-2 text-xs text-[#516A7D] leading-relaxed">
                                {bride.parents || 'Putri dari Bpk. Hartono & Ibu Sri'}
                            </p>
                            {bride.bio && (
                                <p className="mt-2 text-[11px] italic text-[#516A7D]/80">
                                    &ldquo;{bride.bio}&rdquo;
                                </p>
                            )}
                            {bride.ig && (
                                <div className="mt-4 flex justify-center">
                                    <a
                                        href={`https://instagram.com/${bride.ig.replace('@', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-1.5 text-[11px] font-semibold text-[#244B66] transition hover:bg-[#244B66] hover:text-white"
                                    >
                                        <InstagramIcon size={12} />
                                        <span>{bride.ig}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* 4. COUNTDOWN SECTION (CONTRAST MIDNIGHT OCEAN BANNER) */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={scaleIn}
                    className="relative overflow-hidden bg-[#112330] px-6 py-14 text-center text-[#F3F7FA] shadow-md"
                >
                    <OceanCorner position="top-right" color="#5B82A1" size={44} className="right-3 top-3 opacity-60" />
                    <OceanCorner position="bottom-left" color="#5B82A1" size={44} className="bottom-3 left-3 opacity-60" />

                    <div className="relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C59B5F]">
                            Menghitung Hari Menuju Bahagia
                        </p>
                        <h3
                            className="mt-2 text-3xl font-bold text-white"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Save The Date
                        </h3>
                        <p className="mt-1 text-xs text-[#F3F7FA]/70">
                            {primaryDate}
                        </p>

                        <div className="mt-6">
                            <CountdownBlock targetDate={primaryDate} />
                        </div>

                        <div className="mt-6 flex justify-center">
                            <a
                                href={createGoogleCalendarUrl()}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-[#C59B5F]/40 bg-[#C59B5F]/10 px-5 py-2.5 text-xs font-semibold text-[#C59B5F] backdrop-blur-md transition hover:bg-[#C59B5F] hover:text-[#112330]"
                            >
                                <CalendarIcon size={14} />
                                <span>Ingatkan di Google Calendar</span>
                            </a>
                        </div>
                    </div>
                </motion.section>

                {/* 5. EVENT DETAILS (AKAD & RESEPSI) */}
                <section id="section-event" className="relative px-6 py-16">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="text-center"
                    >
                        <OceanCrest color="#244B66" accent="#C59B5F" />
                        <h3
                            className="mt-2 text-3xl font-bold text-[#183042]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Rangkaian Acara
                        </h3>
                        <p className="mt-1 text-xs text-[#516A7D]">
                            Insya Allah acara pernikahan kami akan diselenggarakan pada:
                        </p>
                    </motion.div>

                    {/* AKAD CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mt-10 overflow-hidden rounded-3xl border border-[#244B66]/20 bg-white p-6 shadow-md"
                    >
                        <div className="flex items-center justify-between border-b border-[#244B66]/15 pb-4">
                            <div>
                                <span className="rounded-full bg-[#244B66]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#244B66]">
                                    Akad Nikah
                                </span>
                                <h4
                                    className="mt-2 text-2xl font-bold text-[#183042]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {schedules.akad?.title || 'Ijab Kabul'}
                                </h4>
                            </div>
                            <div className="rounded-2xl border border-[#244B66]/20 bg-[#F3F7FA] p-3 text-[#244B66]">
                                <Heart size={22} />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 text-xs text-[#516A7D]">
                            <div className="flex items-start gap-3">
                                <CalendarIcon size={16} className="mt-0.5 shrink-0 text-[#244B66]" />
                                <span>{schedules.akad?.date || primaryDate}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-0.5 shrink-0 text-[#244B66]" />
                                <span>{schedules.akad?.time || '08.00 - 10.00 WIB'}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-[#244B66]" />
                                <div>
                                    <p className="font-semibold text-[#183042]">
                                        {schedules.akad?.location || 'Masjid Al-Ikhlas'}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-[#516A7D]">
                                        {schedules.akad?.address || 'Jl. Malioboro No. 45, Yogyakarta'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href={
                                    schedules.akad?.mapUrl ||
                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        schedules.akad?.location || 'Masjid Al-Ikhlas Yogyakarta',
                                    )}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#244B66] py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#1a384d] active:scale-95"
                            >
                                <MapPin size={14} />
                                <span>Buka Google Maps</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* RESEPSI CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mt-6 overflow-hidden rounded-3xl border border-[#244B66]/20 bg-white p-6 shadow-md"
                    >
                        <div className="flex items-center justify-between border-b border-[#244B66]/15 pb-4">
                            <div>
                                <span className="rounded-full bg-[#C59B5F]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A66F24]">
                                    Resepsi Pernikahan
                                </span>
                                <h4
                                    className="mt-2 text-2xl font-bold text-[#183042]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {schedules.resepsi?.title || 'Walimatul Ursy'}
                                </h4>
                            </div>
                            <div className="rounded-2xl border border-[#C59B5F]/30 bg-[#F3F7FA] p-3 text-[#A66F24]">
                                <Sparkles size={22} />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 text-xs text-[#516A7D]">
                            <div className="flex items-start gap-3">
                                <CalendarIcon size={16} className="mt-0.5 shrink-0 text-[#244B66]" />
                                <span>{schedules.resepsi?.date || primaryDate}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-0.5 shrink-0 text-[#244B66]" />
                                <span>{schedules.resepsi?.time || '11.00 - 14.00 WIB'}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-[#244B66]" />
                                <div>
                                    <p className="font-semibold text-[#183042]">
                                        {schedules.resepsi?.location || 'Grand Ballroom Hotel'}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-[#516A7D]">
                                        {schedules.resepsi?.address || 'Jl. Palagan Tentara Pelajar No. 88, Yogyakarta'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href={
                                    schedules.resepsi?.mapUrl ||
                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        schedules.resepsi?.location || 'Grand Ballroom Yogyakarta',
                                    )}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#244B66] bg-white py-3 text-xs font-semibold text-[#244B66] shadow-sm transition hover:bg-[#F3F7FA] active:scale-95"
                            >
                                <MapPin size={14} />
                                <span>Buka Google Maps</span>
                            </a>
                        </div>
                    </motion.div>
                </section>

                {/* 6. LOVE STORY SECTION (IF ENABLED) */}
                {showStory && stories && stories.length > 0 && (
                    <section id="section-story" className="relative px-6 py-14">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeUp}
                            className="text-center"
                        >
                            <OceanCrest color="#244B66" accent="#C59B5F" />
                            <h3
                                className="mt-2 text-3xl font-bold text-[#183042]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Kisah Cinta Kami
                            </h3>
                            <p className="mt-1 text-xs text-[#516A7D]">
                                Ombak waktu yang mempertemukan dan menguatkan ikatan kami
                            </p>
                        </motion.div>

                        <div className="relative mt-8 space-y-6 border-l-2 border-[#244B66]/30 pl-6 ml-4">
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    variants={fadeUp}
                                    className="relative rounded-2xl border border-[#244B66]/15 bg-white p-5 shadow-xs"
                                >
                                    <div className="absolute -left-[31px] top-4 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#244B66]" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#244B66]">
                                        {story.year || story.date || `Babak ${idx + 1}`}
                                    </span>
                                    <h4 className="mt-1 font-bold text-[#183042]">
                                        {story.title}
                                    </h4>
                                    <p className="mt-1.5 text-xs text-[#516A7D] leading-relaxed">
                                        {story.description || story.content}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 7. GALLERY SECTION */}
                {showGallery && displayPhotos.length > 0 && (
                    <section id="section-gallery" className="relative px-6 py-14">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeUp}
                            className="text-center"
                        >
                            <OceanCrest color="#244B66" accent="#C59B5F" />
                            <h3
                                className="mt-2 text-3xl font-bold text-[#183042]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Galeri Kebersamaan
                            </h3>
                            <p className="mt-1 text-xs text-[#516A7D]">
                                Momen berharga dalam memori perjalanan cinta kami
                            </p>
                        </motion.div>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {displayPhotos.map((photo: any, index: number) => {
                                const photoUrl = resolveImageUrl(
                                    photo.url || photo,
                                    '/assets/theme_1/gallery1.webp',
                                );
                                return (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.15 }}
                                        variants={scaleIn}
                                        onClick={() => setSelectedPhoto(photoUrl)}
                                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#244B66]/15 bg-white shadow-xs"
                                    >
                                        <div className="aspect-4/5 overflow-hidden">
                                            <img
                                                src={photoUrl}
                                                alt={`Galeri ${index + 1}`}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#112330]/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                                            <span className="rounded-full bg-white/90 p-2 text-[#244B66] shadow-md">
                                                <Heart size={16} />
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* LIGHTBOX MODAL */}
                <AnimatePresence>
                    {selectedPhoto && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPhoto(null)}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                        >
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="absolute right-5 top-5 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                            >
                                <X size={20} />
                            </button>
                            <img
                                src={selectedPhoto}
                                alt="Expanded view"
                                className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 8. WEDDING GIFT SECTION */}
                {showGift && (
                    <motion.section
                        id="section-gift"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-14"
                    >
                        <div className="text-center">
                            <OceanCrest color="#244B66" accent="#C59B5F" />
                            <h3
                                className="mt-2 text-3xl font-bold text-[#183042]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Tanda Kasih & Hadiah
                            </h3>
                            <p className="mt-1 text-xs text-[#516A7D]">
                                Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda hendak memberikan tanda kasih, dapat melalui:
                            </p>
                        </div>

                        {/* DIGITAL BANK CARDS */}
                        <div className="mt-8 space-y-4">
                            {/* GROOM BANK */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#244B66] via-[#1E3E54] to-[#122634] p-6 text-white shadow-xl">
                                <OceanCorner position="top-right" color="#5B82A1" size={36} className="right-2 top-2 opacity-30" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-widest text-[#C59B5F]">
                                        {groom.bankName || 'BANK BCA'}
                                    </span>
                                    <Gift size={20} className="text-[#C59B5F]" />
                                </div>
                                <div className="mt-6">
                                    <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider">
                                        {groom.accountNumber || '8820192841'}
                                    </p>
                                    <p className="mt-1 text-xs text-white/80">
                                        a.n. {groom.accountHolder || groomFullName}
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                groom.accountNumber || '8820192841',
                                                setCopiedGroomBank,
                                            )
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white hover:text-[#244B66]"
                                    >
                                        {copiedGroomBank ? (
                                            <>
                                                <Check size={13} />
                                                <span>Tersalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>Salin No. Rekening</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* BRIDE BANK */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#456A85] via-[#2E516B] to-[#1D364A] p-6 text-white shadow-xl">
                                <OceanCorner position="top-right" color="#C59B5F" size={36} className="right-2 top-2 opacity-30" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-widest text-[#C59B5F]">
                                        {bride.bankName || 'BANK MANDIRI'}
                                    </span>
                                    <Gift size={20} className="text-[#C59B5F]" />
                                </div>
                                <div className="mt-6">
                                    <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider">
                                        {bride.accountNumber || '1370019283741'}
                                    </p>
                                    <p className="mt-1 text-xs text-white/80">
                                        a.n. {bride.accountHolder || brideFullName}
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                bride.accountNumber || '1370019283741',
                                                setCopiedBrideBank,
                                            )
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white hover:text-[#244B66]"
                                    >
                                        {copiedBrideBank ? (
                                            <>
                                                <Check size={13} />
                                                <span>Tersalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>Salin No. Rekening</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* PHYSICAL GIFT ADDRESS */}
                            <div className="rounded-3xl border border-[#244B66]/20 bg-white p-5 shadow-xs">
                                <div className="flex items-center gap-2 text-[#244B66]">
                                    <Gift size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Kirim Kado Fisik
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-[#183042] font-semibold">
                                    Kediaman Mempelai:
                                </p>
                                <p className="mt-1 text-xs text-[#516A7D] leading-relaxed">
                                    {customStyle.giftAddress ||
                                        'Jl. Kenari No. 12, Umbulharjo, Kota Yogyakarta, D.I. Yogyakarta 55166'}
                                </p>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                customStyle.giftAddress ||
                                                    'Jl. Kenari No. 12, Umbulharjo, Kota Yogyakarta, D.I. Yogyakarta 55166',
                                                setCopiedAddress,
                                            )
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#244B66]/30 bg-[#F3F7FA] px-3.5 py-1 text-xs font-medium text-[#244B66] transition hover:bg-[#244B66] hover:text-white"
                                    >
                                        {copiedAddress ? (
                                            <>
                                                <Check size={12} />
                                                <span>Alamat Tersalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                <span>Salin Alamat</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* 9. RSVP SECTION */}
                {showRsvp && (
                    <motion.section
                        id="section-rsvp"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-14"
                    >
                        <div className="overflow-hidden rounded-3xl border border-[#244B66]/25 bg-white p-6 shadow-md">
                            <div className="text-center">
                                <OceanCrest color="#244B66" accent="#C59B5F" />
                                <h3
                                    className="mt-2 text-2xl font-bold text-[#183042]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Konfirmasi Kehadiran
                                </h3>
                                <p className="mt-1 text-xs text-[#516A7D]">
                                    Mohon kesediaan Anda untuk konfirmasi kehadiran guna kelancaran jamuan kami.
                                </p>
                            </div>

                            {rsvpSubmitted ? (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-emerald-800">
                                    <Check className="mx-auto mb-2 text-emerald-600" size={28} />
                                    <p className="font-bold text-sm">
                                        Terima Kasih atas Konfirmasinya!
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-700">
                                        Jawaban kehadiran Anda telah berhasil disimpan ke dalam buku tamu kami.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleRsvpSubmitInternal} className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#516A7D]">
                                            Nama Anda
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={rsvpName}
                                            onChange={(e) => setRsvpName(e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="mt-1.5 w-full rounded-xl border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-2.5 text-xs text-[#183042] placeholder:text-[#516A7D]/40 focus:border-[#244B66] focus:bg-white focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#516A7D]">
                                            Konfirmasi Kehadiran
                                        </label>
                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                            {(['hadir', 'ragu', 'tidak_hadir'] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setRsvpStatus(status)}
                                                    className={`cursor-pointer rounded-xl border py-2 text-xs font-semibold capitalize transition ${
                                                        rsvpStatus === status
                                                            ? 'border-[#244B66] bg-[#244B66] text-white shadow-xs'
                                                            : 'border-[#244B66]/20 bg-[#F3F7FA] text-[#516A7D] hover:bg-neutral-100'
                                                    }`}
                                                >
                                                    {status === 'tidak_hadir'
                                                        ? 'Tidak Hadir'
                                                        : status === 'ragu'
                                                          ? 'Ragu-ragu'
                                                          : 'Hadir'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {rsvpStatus === 'hadir' && (
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#516A7D]">
                                                Jumlah Tamu
                                            </label>
                                            <select
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                                className="mt-1.5 w-full rounded-xl border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-2.5 text-xs text-[#183042] focus:border-[#244B66] focus:bg-white focus:outline-none"
                                            >
                                                <option value={1}>1 Orang</option>
                                                <option value={2}>2 Orang</option>
                                                <option value={3}>3 Orang</option>
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#516A7D]">
                                            Ucapan / Doa Restu
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={rsvpMessage}
                                            onChange={(e) => setRsvpMessage(e.target.value)}
                                            placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                                            className="mt-1.5 w-full rounded-xl border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-2.5 text-xs text-[#183042] placeholder:text-[#516A7D]/40 focus:border-[#244B66] focus:bg-white focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingRsvp}
                                        className="w-full cursor-pointer rounded-2xl bg-[#244B66] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#1a384d] active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmittingRsvp ? 'Mengirim Konfirmasi...' : 'Kirim Konfirmasi'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* 10. GUESTBOOK WISHES SECTION */}
                {showWishes && (
                    <motion.section
                        id="section-wishes"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative px-6 py-14"
                    >
                        <div className="overflow-hidden rounded-3xl border border-[#244B66]/20 bg-white p-6 shadow-md">
                            <div className="text-center">
                                <OceanCrest color="#244B66" accent="#C59B5F" />
                                <h3
                                    className="mt-2 text-2xl font-bold text-[#183042]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Doa & Ucapan Hangat
                                </h3>
                                <p className="mt-1 text-xs text-[#516A7D]">
                                    {localWishes.length} ucapan dari para kerabat dan sahabat
                                </p>
                            </div>

                            {/* Wish Form */}
                            <form onSubmit={handleWishSubmit} className="mt-6 space-y-3">
                                <input
                                    type="text"
                                    required
                                    value={wishName}
                                    onChange={(e) => setWishName(e.target.value)}
                                    placeholder="Nama Anda"
                                    className="w-full rounded-xl border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-2.5 text-xs text-[#183042] placeholder:text-[#516A7D]/40 focus:border-[#244B66] focus:bg-white focus:outline-none"
                                />
                                <textarea
                                    rows={2}
                                    required
                                    value={wishMsg}
                                    onChange={(e) => setWishMsg(e.target.value)}
                                    placeholder="Tulis doa atau harapan terbaik Anda..."
                                    className="w-full rounded-xl border border-[#244B66]/25 bg-[#F3F7FA] px-3.5 py-2.5 text-xs text-[#183042] placeholder:text-[#516A7D]/40 focus:border-[#244B66] focus:bg-white focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={wishLoading}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#244B66] py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1a384d] active:scale-95 disabled:opacity-50"
                                >
                                    {wishLoading ? 'Mengirim...' : 'Kirim Ucapan'}
                                </button>
                            </form>

                            {/* Wishes List */}
                            <div className="mt-6 divide-y divide-[#244B66]/10 max-h-80 overflow-y-auto pr-1">
                                {localWishes.length === 0 ? (
                                    <p className="py-6 text-center text-xs italic text-[#516A7D]">
                                        Belum ada ucapan. Jadilah yang pertama mendoakan!
                                    </p>
                                ) : (
                                    localWishes.map((w, idx) => (
                                        <div key={idx} className="py-3 first:pt-0 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-[#183042]">
                                                    {w.name}
                                                </span>
                                                <span className="text-[10px] text-[#516A7D]">
                                                    {w.createdAt
                                                        ? new Date(w.createdAt).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                          })
                                                        : 'Baru saja'}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-[#516A7D] leading-relaxed">
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
                    <OceanCrest color="#244B66" accent="#C59B5F" />
                    <p className="mt-3 text-xs text-[#516A7D] leading-relaxed">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
                    </p>
                    <div className="mt-6">
                        <p
                            className="text-4xl font-normal italic text-[#244B66]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groomNickname} & {brideNickname}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-[#516A7D]">
                            Beserta Keluarga Besar
                        </p>
                    </div>

                    <OceanDivider color="#244B66" accent="#C59B5F" className="mt-6" />

                    <div className="mt-8 border-t border-[#244B66]/15 pt-6 text-[10px] text-[#516A7D]">
                        <p>© {new Date().getFullYear()} Ngaturi Invitation • All Rights Reserved</p>
                    </div>
                </motion.section>

                {/* 12. FLOATING BOTTOM NAVIGATION DOCK WITH SCROLLSPY */}
                <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:left-auto lg:right-[17.5%] lg:translate-x-1/2">
                    <nav className="flex items-center gap-1 rounded-full border border-[#244B66]/20 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md">
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
                                            ? 'bg-[#244B66]/12 text-[#244B66] shadow-xs scale-105'
                                            : 'text-[#516A7D] hover:bg-[#244B66]/8 hover:text-[#244B66]'
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
                        className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#112330] p-8 text-center text-white"
                    >
                        <div
                            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
                            style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                        />

                        <OceanCorner position="top-left" color="#5B82A1" size={68} className="left-4 top-4" />
                        <OceanCorner position="top-right" color="#5B82A1" size={68} className="right-4 top-4" />
                        <OceanCorner position="bottom-left" color="#5B82A1" size={68} className="bottom-4 left-4" />
                        <OceanCorner position="bottom-right" color="#5B82A1" size={68} className="bottom-4 right-4" />

                        <div className="relative z-10 pt-8">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5B82A1]/30 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C59B5F] backdrop-blur-md">
                                <Sparkles size={11} /> Undangan Pernikahan
                            </span>
                        </div>

                        <div className="relative z-10 my-auto py-8">
                            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#5B82A1]">
                                The Wedding Of
                            </p>
                            <h2
                                className="mt-3 text-6xl sm:text-7xl font-normal leading-tight text-white drop-shadow-md"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                {groomNickname} & {brideNickname}
                            </h2>
                            <OceanDivider color="#5B82A1" accent="#C59B5F" className="my-5" />
                            <p
                                className="text-sm font-normal tracking-wide text-white/80"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {primaryDate}
                            </p>

                            <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                                <p className="text-[10px] font-medium text-white/70">
                                    Kepada Yth. Bapak/Ibu/Saudara/i:
                                </p>
                                <p className="mt-1 text-base font-bold text-white">
                                    {guestName || 'Tamu Undangan'}
                                </p>
                                <p className="mt-0.5 text-[10px] text-white/60">
                                    Di Tempat
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 pb-8">
                            <button
                                onClick={onOpen}
                                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-gradient-to-r from-[#244B66] to-[#456A85] px-8 py-3.5 text-xs font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <Heart size={14} className="fill-white animate-pulse" />
                                <span>Buka Undangan</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BasicTheme5;
