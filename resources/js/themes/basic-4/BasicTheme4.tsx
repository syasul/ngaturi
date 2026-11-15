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

// Chic Minimalist Editorial Corner Brackets
const EditorialCorner = ({
    position = 'top-left',
    color = '#18181B',
    size = 42,
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
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none absolute select-none ${className}`}
            style={{ transform: transforms[position] }}
        >
            <path
                d="M4 56 V12 C4 7.58 7.58 4 12 4 H56"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.4"
            />
            <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.8" />
            <line x1="12" y1="24" x2="12" y2="34" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            <line x1="24" y1="12" x2="34" y2="12" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
        </svg>
    );
};

// Editorial Hairline Divider
const EditorialDivider = ({
    color = '#18181B',
    accent = '#C5A880',
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
        <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="h-1 w-6 rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div
            className="h-[1px] w-14 sm:w-20 opacity-30"
            style={{ background: `linear-gradient(to left, transparent, ${color})` }}
        />
    </div>
);

// Editorial Crest
const EditorialCrest = ({
    color = '#18181B',
    accent = '#C5A880',
    className = '',
}: {
    color?: string;
    accent?: string;
    className?: string;
}) => (
    <div className={`mx-auto flex items-center justify-center gap-2 select-none ${className}`}>
        <div className="h-[1px] w-10 sm:w-16 bg-neutral-300" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C5A880]">
            EST. 2026
        </span>
        <div className="h-[1px] w-10 sm:w-16 bg-neutral-300" />
    </div>
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
                        className="text-2xl sm:text-3xl font-bold text-[#FBF9F5]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-wider text-[#C5A880]">
                        {item.label}
                    </span>
                    <div className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-[#C5A880]/20" />
                </div>
            ))}
        </div>
    );
};

export interface BasicTheme4Props extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}

export const BasicTheme4: React.FC<BasicTheme4Props> = ({
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
            document.getElementById('basic4-scroll-container');
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
            document.getElementById('basic4-scroll-container');
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
        customStyle.heroPhoto || data?.coverPhoto,
        '/assets/wedding/couple-royal.png',
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
            {/* LEFT PANEL: DESKTOP EDITORIAL NOIR SHOWCASE                    */}
            {/* ============================================================== */}
            <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden bg-[#121214] p-12 text-[#FBF9F5] lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 grayscale contrast-125"
                    style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/75 to-transparent" />

                <EditorialCorner position="top-left" color="#C5A880" size={68} className="left-8 top-8" />
                <EditorialCorner position="bottom-right" color="#C5A880" size={68} className="bottom-8 right-8" />

                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-white/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[#C5A880] backdrop-blur-md">
                        <Sparkles size={12} /> The Wedding Editorial
                    </span>
                </div>

                <div className="relative z-10 max-w-xl py-12">
                    <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]">
                        The Official Union
                    </p>
                    <h1
                        className="mt-4 text-7xl font-light tracking-tight text-white drop-shadow-md"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {groomNickname} <span className="font-normal italic text-[#C5A880]" style={{ fontFamily: "'Dancing Script', cursive" }}>&</span> {brideNickname}
                    </h1>
                    <p className="mt-3 font-mono text-xs tracking-[0.2em] text-[#FBF9F5]/70">
                        {primaryDate} • SPECIAL REGION OF YOGYAKARTA
                    </p>
                    <EditorialDivider color="#C5A880" accent="#C5A880" className="my-6 !justify-start" />
                    <p className="max-w-md text-xs leading-relaxed text-[#FBF9F5]/70">
                        &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.&rdquo;
                    </p>
                </div>

                <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-[#FBF9F5]/50">
                    <span>Ngaturi Invitation • Classic Ivory Noir Edition</span>
                    <span>Scroll panel kanan untuk melihat undangan &rarr;</span>
                </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT PANEL / MAIN MOBILE INVITATION CONTENT                   */}
            {/* ============================================================== */}
            <div
                ref={containerRef}
                id="basic4-scroll-container"
                className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-[#FAF9F5] pb-24 scroll-smooth lg:w-[35%]"
            >
                {/* Floating Music Control */}
                {setIsPlayingMusic && (
                    <button
                        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                        aria-label="Toggle Music"
                        className="fixed right-5 top-5 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white/95 text-[#18181B] shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
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
                    <EditorialCorner position="top-left" color="#18181B" size={54} className="left-4 top-4" />
                    <EditorialCorner position="top-right" color="#18181B" size={54} className="right-4 top-4" />

                    <div className="relative z-10 mt-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A880]">
                            Wedding Celebration
                        </p>
                        <h2
                            className="mt-2 text-5xl sm:text-6xl font-light text-[#18181B]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            {groomNickname}{' '}
                            <span
                                className="font-normal italic text-[#C5A880]"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                &
                            </span>{' '}
                            {brideNickname}
                        </h2>
                    </div>

                    {/* Editorial Framed Photo */}
                    <div className="relative z-10 my-6">
                        <div className="relative mx-auto h-76 w-58 sm:h-84 sm:w-66 overflow-hidden rounded-3xl border border-neutral-300 bg-white p-2.5 shadow-2xl">
                            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-100">
                                <img
                                    src={coupleHeroPhoto}
                                    alt="Hero Couple"
                                    className="h-full w-full object-cover object-top filter grayscale contrast-110 transition duration-700 hover:scale-105 hover:grayscale-0"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-neutral-300 bg-white px-4 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#18181B] shadow-md">
                            {primaryDate}
                        </div>
                    </div>

                    <div className="relative z-10 mb-8 max-w-xs">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                            Kepada Yth. Bapak/Ibu/Saudara/i:
                        </p>
                        <div className="mt-2 rounded-2xl border border-neutral-300 bg-white/90 p-3 shadow-xs backdrop-blur-xs">
                            <p className="text-base font-bold text-[#18181B]">
                                {guestName || 'Tamu Undangan'}
                            </p>
                            <p className="font-mono text-[10px] text-neutral-400">
                                Di Tempat
                            </p>
                        </div>
                    </div>

                    <EditorialDivider color="#18181B" accent="#C5A880" />
                </section>

                {/* 2. AYAT & BISMILLAH SECTION (CONTRAST ONYX NOIR BANNER) */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="relative overflow-hidden bg-[#121214] px-6 py-14 text-center text-[#FBF9F5] shadow-inner"
                >
                    <EditorialCorner position="top-left" color="#C5A880" size={42} className="left-3 top-3 opacity-50" />
                    <EditorialCorner position="bottom-right" color="#C5A880" size={42} className="bottom-3 right-3 opacity-50" />

                    <div className="relative z-10 mx-auto max-w-md">
                        <img
                            src="/assets/bismillah.webp"
                            alt="Bismillah"
                            className="mx-auto h-9 w-auto brightness-200 invert opacity-90 select-none"
                        />
                        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
                            Ar-Rum : 21
                        </p>
                        <p
                            className="mt-3 text-xs sm:text-sm font-normal italic leading-relaxed text-[#FBF9F5]/90"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="h-[1px] w-8 bg-[#C5A880]/40" />
                            <Heart size={12} className="text-[#C5A880] fill-[#C5A880]" />
                            <span className="h-[1px] w-8 bg-[#C5A880]/40" />
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
                        <EditorialCrest color="#18181B" accent="#C5A880" />
                        <h3
                            className="mt-2 text-3xl font-light text-[#18181B]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Pasangan Mempelai
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan:
                        </p>
                    </motion.div>

                    {/* GROOM CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideLeft}
                        className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                        <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-2xl border-2 border-neutral-100 shadow-md">
                            <img
                                src={groomPhoto}
                                alt={groomFullName}
                                className="h-full w-full object-cover object-top filter grayscale contrast-110 transition duration-500 hover:grayscale-0"
                            />
                        </div>
                        <div className="mt-5 text-center">
                            <h4
                                className="text-2xl font-semibold text-[#18181B]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {groomFullName}
                            </h4>
                            <p
                                className="text-xl font-normal italic text-[#C5A880]"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                - {groomNickname} -
                            </p>
                            <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                                {groom.parents || 'Putra dari Bpk. Bambang & Ibu Siti'}
                            </p>
                            {groom.bio && (
                                <p className="mt-2 text-[11px] italic text-neutral-400">
                                    &ldquo;{groom.bio}&rdquo;
                                </p>
                            )}
                            {groom.ig && (
                                <div className="mt-4 flex justify-center">
                                    <a
                                        href={`https://instagram.com/${groom.ig.replace('@', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-[#18181B] transition hover:bg-[#18181B] hover:text-white"
                                    >
                                        <InstagramIcon size={12} />
                                        <span>{groom.ig}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* AMPERSAND DIVIDER */}
                    <div className="my-8 flex items-center justify-center gap-4 text-[#C5A880]">
                        <div className="h-[1px] flex-1 bg-neutral-200" />
                        <span
                            className="text-4xl font-normal italic"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            &
                        </span>
                        <div className="h-[1px] flex-1 bg-neutral-200" />
                    </div>

                    {/* BRIDE CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideRight}
                        className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                        <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-2xl border-2 border-neutral-100 shadow-md">
                            <img
                                src={bridePhoto}
                                alt={brideFullName}
                                className="h-full w-full object-cover object-top filter grayscale contrast-110 transition duration-500 hover:grayscale-0"
                            />
                        </div>
                        <div className="mt-5 text-center">
                            <h4
                                className="text-2xl font-semibold text-[#18181B]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {brideFullName}
                            </h4>
                            <p
                                className="text-xl font-normal italic text-[#C5A880]"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                                - {brideNickname} -
                            </p>
                            <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                                {bride.parents || 'Putri dari Bpk. Hartono & Ibu Sri'}
                            </p>
                            {bride.bio && (
                                <p className="mt-2 text-[11px] italic text-neutral-400">
                                    &ldquo;{bride.bio}&rdquo;
                                </p>
                            )}
                            {bride.ig && (
                                <div className="mt-4 flex justify-center">
                                    <a
                                        href={`https://instagram.com/${bride.ig.replace('@', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-[#18181B] transition hover:bg-[#18181B] hover:text-white"
                                    >
                                        <InstagramIcon size={12} />
                                        <span>{bride.ig}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* 4. COUNTDOWN SECTION (CONTRAST ONYX NOIR BANNER) */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={scaleIn}
                    className="relative overflow-hidden bg-[#121214] px-6 py-14 text-center text-[#FBF9F5] shadow-md"
                >
                    <EditorialCorner position="top-right" color="#C5A880" size={42} className="right-3 top-3 opacity-50" />
                    <EditorialCorner position="bottom-left" color="#C5A880" size={42} className="bottom-3 left-3 opacity-50" />

                    <div className="relative z-10">
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
                            Countdown To The Day
                        </p>
                        <h3
                            className="mt-2 text-3xl font-light text-white"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Save The Date
                        </h3>
                        <p className="mt-1 font-mono text-xs text-neutral-400">
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
                                className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 px-5 py-2.5 font-mono text-xs font-semibold text-[#C5A880] backdrop-blur-md transition hover:bg-[#C5A880] hover:text-[#121214]"
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
                        <EditorialCrest color="#18181B" accent="#C5A880" />
                        <h3
                            className="mt-2 text-3xl font-light text-[#18181B]"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Rangkaian Acara
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                            Insya Allah acara pernikahan kami akan diselenggarakan pada:
                        </p>
                    </motion.div>

                    {/* AKAD CARD */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                            <div>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                                    Akad Nikah
                                </span>
                                <h4
                                    className="mt-1 text-2xl font-semibold text-[#18181B]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {schedules.akad?.title || 'Ijab Kabul'}
                                </h4>
                            </div>
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-[#18181B]">
                                <Heart size={20} />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 text-xs text-neutral-600">
                            <div className="flex items-start gap-3">
                                <CalendarIcon size={16} className="mt-0.5 shrink-0 text-[#C5A880]" />
                                <span>{schedules.akad?.date || primaryDate}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-0.5 shrink-0 text-[#C5A880]" />
                                <span>{schedules.akad?.time || '08.00 - 10.00 WIB'}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-[#C5A880]" />
                                <div>
                                    <p className="font-semibold text-[#18181B]">
                                        {schedules.akad?.location || 'Masjid Al-Ikhlas'}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-neutral-500">
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
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18181B] py-3 text-xs font-semibold text-white shadow-md transition hover:bg-neutral-800 active:scale-95"
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
                        className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                            <div>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                                    Resepsi Pernikahan
                                </span>
                                <h4
                                    className="mt-1 text-2xl font-semibold text-[#18181B]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    {schedules.resepsi?.title || 'Walimatul Ursy'}
                                </h4>
                            </div>
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-[#C5A880]">
                                <Sparkles size={20} />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 text-xs text-neutral-600">
                            <div className="flex items-start gap-3">
                                <CalendarIcon size={16} className="mt-0.5 shrink-0 text-[#C5A880]" />
                                <span>{schedules.resepsi?.date || primaryDate}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-0.5 shrink-0 text-[#C5A880]" />
                                <span>{schedules.resepsi?.time || '11.00 - 14.00 WIB'}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-[#C5A880]" />
                                <div>
                                    <p className="font-semibold text-[#18181B]">
                                        {schedules.resepsi?.location || 'Grand Ballroom Hotel'}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-neutral-500">
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
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-[#18181B] shadow-xs transition hover:bg-neutral-100 active:scale-95"
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
                            <EditorialCrest color="#18181B" accent="#C5A880" />
                            <h3
                                className="mt-2 text-3xl font-light text-[#18181B]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Kisah Cinta Kami
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500">
                                Perjalanan indah yang mengantarkan kami menuju ikatan suci
                            </p>
                        </motion.div>

                        <div className="relative mt-8 space-y-6 border-l border-neutral-300 pl-6 ml-4">
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    variants={fadeUp}
                                    className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs"
                                >
                                    <div className="absolute -left-[31px] top-4 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#18181B]" />
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                                        {story.year || story.date || `Babak ${idx + 1}`}
                                    </span>
                                    <h4 className="mt-1 font-semibold text-[#18181B]">
                                        {story.title}
                                    </h4>
                                    <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
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
                            <EditorialCrest color="#18181B" accent="#C5A880" />
                            <h3
                                className="mt-2 text-3xl font-light text-[#18181B]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Galeri Kebersamaan
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500">
                                Memori visual perjalanan kasih kami
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
                                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs"
                                    >
                                        <div className="aspect-4/5 overflow-hidden">
                                            <img
                                                src={photoUrl}
                                                alt={`Galeri ${index + 1}`}
                                                className="h-full w-full object-cover filter grayscale contrast-110 transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                                            />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                                            <span className="rounded-full bg-white/90 p-2 text-[#18181B] shadow-md">
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
                            <EditorialCrest color="#18181B" accent="#C5A880" />
                            <h3
                                className="mt-2 text-3xl font-light text-[#18181B]"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Tanda Kasih & Hadiah
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500">
                                Doa restu Anda adalah karunia terindah bagi kami. Namun jika Anda hendak memberikan tanda kasih, dapat melalui:
                            </p>
                        </div>

                        {/* DIGITAL BANK CARDS */}
                        <div className="mt-8 space-y-4">
                            {/* GROOM BANK */}
                            <div className="relative overflow-hidden rounded-3xl bg-[#18181B] p-6 text-white shadow-xl">
                                <EditorialCorner position="top-right" color="#C5A880" size={36} className="right-2 top-2 opacity-30" />
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold tracking-widest text-[#C5A880]">
                                        {groom.bankName || 'BANK BCA'}
                                    </span>
                                    <Gift size={20} className="text-[#C5A880]" />
                                </div>
                                <div className="mt-6">
                                    <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider">
                                        {groom.accountNumber || '8820192841'}
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-300">
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
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white hover:text-[#18181B]"
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
                            <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-6 text-white shadow-xl border border-neutral-800">
                                <EditorialCorner position="top-right" color="#C5A880" size={36} className="right-2 top-2 opacity-30" />
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold tracking-widest text-[#C5A880]">
                                        {bride.bankName || 'BANK MANDIRI'}
                                    </span>
                                    <Gift size={20} className="text-[#C5A880]" />
                                </div>
                                <div className="mt-6">
                                    <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider">
                                        {bride.accountNumber || '1370019283741'}
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-300">
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
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white hover:text-[#18181B]"
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
                            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xs">
                                <div className="flex items-center gap-2 text-[#18181B]">
                                    <Gift size={16} />
                                    <span className="font-mono text-xs font-bold uppercase tracking-wider">
                                        Kirim Kado Fisik
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-[#18181B] font-semibold">
                                    Kediaman Mempelai:
                                </p>
                                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
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
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-1 text-xs font-medium text-[#18181B] transition hover:bg-[#18181B] hover:text-white"
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
                        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="text-center">
                                <EditorialCrest color="#18181B" accent="#C5A880" />
                                <h3
                                    className="mt-2 text-2xl font-semibold text-[#18181B]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Konfirmasi Kehadiran
                                </h3>
                                <p className="mt-1 text-xs text-neutral-500">
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
                                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                            Nama Anda
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={rsvpName}
                                            onChange={(e) => setRsvpName(e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-[#18181B] placeholder:text-neutral-400 focus:border-[#18181B] focus:bg-white focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600">
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
                                                            ? 'border-[#18181B] bg-[#18181B] text-white shadow-xs'
                                                            : 'border-neutral-300 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
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
                                            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                                Jumlah Tamu
                                            </label>
                                            <select
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-[#18181B] focus:border-[#18181B] focus:bg-white focus:outline-none"
                                            >
                                                <option value={1}>1 Orang</option>
                                                <option value={2}>2 Orang</option>
                                                <option value={3}>3 Orang</option>
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                            Ucapan / Doa Restu
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={rsvpMessage}
                                            onChange={(e) => setRsvpMessage(e.target.value)}
                                            placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                                            className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-[#18181B] placeholder:text-neutral-400 focus:border-[#18181B] focus:bg-white focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingRsvp}
                                        className="w-full cursor-pointer rounded-2xl bg-[#18181B] py-3 text-xs font-bold text-white shadow-md transition hover:bg-neutral-800 active:scale-95 disabled:opacity-50"
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
                        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="text-center">
                                <EditorialCrest color="#18181B" accent="#C5A880" />
                                <h3
                                    className="mt-2 text-2xl font-semibold text-[#18181B]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Doa & Ucapan Hangat
                                </h3>
                                <p className="mt-1 text-xs text-neutral-500">
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
                                    className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-[#18181B] placeholder:text-neutral-400 focus:border-[#18181B] focus:bg-white focus:outline-none"
                                />
                                <textarea
                                    rows={2}
                                    required
                                    value={wishMsg}
                                    onChange={(e) => setWishMsg(e.target.value)}
                                    placeholder="Tulis doa atau harapan terbaik Anda..."
                                    className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-[#18181B] placeholder:text-neutral-400 focus:border-[#18181B] focus:bg-white focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={wishLoading}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#18181B] py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-neutral-800 active:scale-95 disabled:opacity-50"
                                >
                                    {wishLoading ? 'Mengirim...' : 'Kirim Ucapan'}
                                </button>
                            </form>

                            {/* Wishes List */}
                            <div className="mt-6 divide-y divide-neutral-200 max-h-80 overflow-y-auto pr-1">
                                {localWishes.length === 0 ? (
                                    <p className="py-6 text-center text-xs italic text-neutral-400">
                                        Belum ada ucapan. Jadilah yang pertama mendoakan!
                                    </p>
                                ) : (
                                    localWishes.map((w, idx) => (
                                        <div key={idx} className="py-3 first:pt-0 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-[#18181B]">
                                                    {w.name}
                                                </span>
                                                <span className="font-mono text-[10px] text-neutral-400">
                                                    {w.createdAt
                                                        ? new Date(w.createdAt).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                          })
                                                        : 'Baru saja'}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
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
                    <EditorialCrest color="#18181B" accent="#C5A880" />
                    <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
                    </p>
                    <div className="mt-6">
                        <p
                            className="text-4xl font-normal italic text-[#18181B]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groomNickname} & {brideNickname}
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                            Beserta Keluarga Besar
                        </p>
                    </div>

                    <EditorialDivider color="#18181B" accent="#C5A880" className="mt-6" />

                    <div className="mt-8 border-t border-neutral-200 pt-6 font-mono text-[10px] text-neutral-400">
                        <p>© {new Date().getFullYear()} Ngaturi Invitation • All Rights Reserved</p>
                    </div>
                </motion.section>

                {/* 12. FLOATING BOTTOM NAVIGATION DOCK WITH SCROLLSPY */}
                <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:left-auto lg:right-[17.5%] lg:translate-x-1/2">
                    <nav className="flex items-center gap-1 rounded-full border border-neutral-300 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md">
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
                                            ? 'bg-neutral-900 text-white shadow-xs scale-105'
                                            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
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
                        className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#121214] p-8 text-center text-white"
                    >
                        <div
                            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 filter grayscale contrast-125"
                            style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                        />

                        <EditorialCorner position="top-left" color="#C5A880" size={68} className="left-4 top-4" />
                        <EditorialCorner position="top-right" color="#C5A880" size={68} className="right-4 top-4" />
                        <EditorialCorner position="bottom-left" color="#C5A880" size={68} className="bottom-4 left-4" />
                        <EditorialCorner position="bottom-right" color="#C5A880" size={68} className="bottom-4 right-4" />

                        <div className="relative z-10 pt-8">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] backdrop-blur-md">
                                <Sparkles size={11} /> Undangan Pernikahan
                            </span>
                        </div>

                        <div className="relative z-10 my-auto py-8">
                            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A880]">
                                The Wedding Of
                            </p>
                            <h2
                                className="mt-3 text-6xl sm:text-7xl font-light leading-tight text-white drop-shadow-md"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {groomNickname}{' '}
                                <span
                                    className="font-normal italic text-[#C5A880]"
                                    style={{ fontFamily: "'Dancing Script', cursive" }}
                                >
                                    &
                                </span>{' '}
                                {brideNickname}
                            </h2>
                            <EditorialDivider color="#C5A880" accent="#C5A880" className="my-5" />
                            <p className="font-mono text-xs tracking-wider text-white/80">
                                {primaryDate}
                            </p>

                            <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                                <p className="font-mono text-[10px] font-medium text-white/70">
                                    Kepada Yth. Bapak/Ibu/Saudara/i:
                                </p>
                                <p className="mt-1 text-base font-bold text-white">
                                    {guestName || 'Tamu Undangan'}
                                </p>
                                <p className="font-mono text-[10px] text-white/60">
                                    Di Tempat
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 pb-8">
                            <button
                                onClick={onOpen}
                                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-xs font-bold text-[#18181B] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <Heart size={14} className="fill-[#18181B] text-[#18181B] animate-pulse" />
                                <span>Buka Undangan</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BasicTheme4;
