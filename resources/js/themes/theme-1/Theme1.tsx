import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Check,
    Copy,
    Heart,
    MapPin,
    Menu,
    QrCode,
    Video,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import CountdownTimer from '../reusable/CountdownTimer';
import GuestWishes from '../reusable/GuestWishes';
import RSVPForm from '../reusable/RSVPForm';

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
    weddingId,
    photos = [],
    guestName,
    guestToken,
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
    const mutedText = 'rgba(45, 26, 30, 0.65)';

    // States for interaction
    const [copiedGroomBank, setCopiedGroomBank] = useState(false);
    const [copiedBrideBank, setCopiedBrideBank] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isAlbumOpen, setIsAlbumOpen] = useState(false);

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

    // Pre-wedding gallery photolist
    const defaultPhotos = [
        {
            id: '1',
            url: '/assets/theme_1/1780160070223-pt4rx2-dfasdfasdfa.webp',
        },
        {
            id: '2',
            url: '/assets/theme_1/1780160567013-0mnba6-dfasdfasdfa1.webp',
        },
        {
            id: '3',
            url: '/assets/theme_1/1780161690535-imbyni-dfasdfasdfa2.webp',
        },
        {
            id: '4',
            url: '/assets/theme_1/1780162517758-r7brl9-dfasdfasdfa3.webp',
        },
        {
            id: '5',
            url: '/assets/theme_1/1780192623390-0qll0a-dfasdfasdfa4.webp',
        },
        {
            id: '6',
            url: '/assets/theme_1/1780356842285-xlct24-dfasdfasdfa31.webp',
        },
    ];
    const displayPhotos = photos && photos.length > 0 ? photos : defaultPhotos;

    const SectionHeader: React.FC<{
        eyebrow: string;
        title: string;
        inverse?: boolean;
    }> = ({ eyebrow, title, inverse = false }) => (
        <motion.div className="space-y-2 text-center" variants={fadeUpVariants}>
            <span
                className="block font-sans text-[2.4cqw] font-bold uppercase tracking-[0.35em]"
                style={{ color: inverse ? secondaryColor : primaryColor }}
            >
                {eyebrow}
            </span>
            <h2
                className="font-serif text-3xl font-bold italic"
                style={{ color: inverse ? '#FCF9F6' : textColor }}
            >
                {title}
            </h2>
            <div
                className="mx-auto h-[1.5px] w-12"
                style={{ background: secondaryColor }}
            />
        </motion.div>
    );

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
        <div className="flex min-h-screen w-full overflow-hidden bg-[#FAF3EC] text-[#2D1A1E]">
            {/* ============================================================== */}
            {/* 1. DESKTOP LEFT PANEL (STATIC COVER)                           */}
            {/* ============================================================== */}
            <div className="relative sticky left-0 top-0 hidden h-screen w-[60%] select-none flex-col justify-between overflow-hidden bg-[#3A0511] p-16 text-white lg:flex">
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
                        {bride.nickname || 'Berrly'}
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
            <div
                className="relative h-screen w-full overflow-y-auto scroll-smooth bg-[#FAF3EC] lg:w-[40%]"
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
                                {bride.nickname || 'Berrly'}
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
                    className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-[#FAF3EC] pb-32 pt-12"
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
                        <div className="relative space-y-1 pt-2 text-center">
                            <span
                                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-7xl font-black opacity-[0.04]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: '#5C061C',
                                }}
                            >
                                &
                            </span>
                            <h2
                                className="text-4xl font-black leading-tight"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: '#5C061C',
                                }}
                            >
                                The Groom
                            </h2>
                            <h2
                                className="-mt-0.5 pl-16 text-4xl leading-tight"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: '#5C061C',
                                }}
                            >
                                The Bride
                            </h2>
                        </div>
                    </motion.div>

                    {/* SCALLOPED CARD */}
                    <motion.div
                        className="relative z-10 mx-auto flex w-[100%] max-w-[500px] flex-col items-center justify-center p-4 @container"
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

                        {/* Ribbon Ornament */}
                        <img
                            src="/assets/theme_1/pita.webp"
                            className="absolute -left-6 -top-4 z-20 h-28 w-28 object-contain drop-shadow-md"
                            alt="Ribbon"
                        />

                        {/* Content inside the card */}
                        <div className="relative z-10 flex flex-col items-center space-y-5 px-6 py-14 text-center">
                            <img
                                src="/assets/theme_1/bismillah.webp"
                                className="h-12 w-auto object-contain opacity-90 brightness-[3]"
                                alt="Basmalah"
                            />

                            <div className="space-y-3">
                                <p className="text-[3.8cqw] font-medium tracking-wide text-[#FAF3EC] opacity-90">
                                    Assalamualaikum wbt
                                </p>
                                <p className="px-2 text-[3cqw] leading-relaxed text-[#FAF3EC] opacity-85">
                                    Dengan penuh rasa syukur, kami mengundang
                                    Anda untuk menghadiri acara pernikahan putra
                                    & putri kami.
                                </p>
                            </div>

                            {/* Groom */}
                            <div className="space-y-1 pt-2">
                                <h3
                                    className="text-[7cqw] leading-tight"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: '#FAF3EC',
                                    }}
                                >
                                    {groom.name || 'Virga A. Handsome, S.Kom'}
                                </h3>
                                <p className="mt-2 text-[3cqw] italic text-[#C9A84C]">
                                    The Son of
                                </p>
                                <p className="text-[3cqw] leading-relaxed text-[#FAF3EC] opacity-85">
                                    {groom.parents ||
                                        'Mr. Aghala Gola & Mrs. Egela Egle'}
                                </p>
                            </div>

                            {/* Ampersand */}
                            <div className="py-2">
                                <span
                                    className="text-[8cqw]"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                        color: '#FAF3EC',
                                    }}
                                >
                                    &
                                </span>
                            </div>

                            {/* Bride */}
                            <div className="space-y-1 pb-4">
                                <h3
                                    className="text-[7cqw] leading-tight"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: '#FAF3EC',
                                    }}
                                >
                                    {bride.name || 'Berrly C. Beauty, S.Kom'}
                                </h3>
                                <p className="mt-2 text-[3cqw] italic text-[#C9A84C]">
                                    The Daughter of
                                </p>
                                <p className="text-[3cqw] leading-relaxed text-[#FAF3EC] opacity-85">
                                    {bride.parents ||
                                        'Bapak Lord Capulet & Ibu Lady Capulet'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Elements: Horse Carriage, Flowers, Love text */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 flex h-64 flex-col items-center justify-end overflow-hidden">
                        <img
                            src="/assets/theme_1/kuda-outline.webp"
                            className="absolute bottom-8 h-auto w-[95%] max-w-[600px] object-contain opacity-25"
                            alt="Horse Carriage Bottom"
                        />
                        <img
                            src="/assets/theme_1/kumpulanbunga2.webp"
                            className="absolute bottom-6 right-6 z-10 h-24 w-24 object-contain drop-shadow-md"
                            alt="Flowers"
                        />
                        <div className="absolute -bottom-8 flex w-full justify-center">
                            <span
                                className="text-[110px] font-black tracking-widest text-[#5C061C] opacity-90"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Love
                            </span>
                        </div>
                    </div>
                </section>

                {/* C. KISAH CINTA TIMELINE SECTION */}
                {stories.length > 0 && (
                    <section
                        id="story"
                        className="relative overflow-hidden bg-[#FAF3EC] px-0 py-16"
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
                                className="relative px-6 pb-6"
                            >
                                {/* Floral top-right decoration */}
                                <div
                                    className="absolute right-2 top-0 h-20 w-20 bg-contain bg-no-repeat opacity-80"
                                    style={{
                                        backgroundImage:
                                            "url('/assets/theme_1/1779365549376-nqtsz1-719543e1113ce29e7052be17c6f9ab60.webp')",
                                    }}
                                />
                                <h2
                                    className="text-5xl font-black"
                                    style={{
                                        color: primaryColor,
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                    }}
                                >
                                    Love
                                </h2>
                                <h2
                                    className="-mt-2 text-5xl"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Story
                                </h2>
                            </motion.div>

                            {/* Stories with photo frames */}
                            <div className="relative">
                                {/* Winding thread line */}
                                <div className="pointer-events-none absolute bottom-0 left-[50%] top-0 w-[2px] -translate-x-[50%] bg-[#C9A84C]/20" />

                                <div className="space-y-0">
                                    {stories.map((story: any, idx: number) => {
                                        const isEven = idx % 2 === 0;
                                        const isLast =
                                            idx === stories.length - 1;
                                        const storyPhotos = [
                                            groom.photo ||
                                            '/assets/theme_1/1781458096155-8jwgyh-Desaintanpajudul78.webp',
                                            bride.photo ||
                                            '/assets/theme_1/1781458099113-j8vvhy-Desaintanpajudul77.webp',
                                        ];
                                        const photo = storyPhotos[idx % 2];

                                        return (
                                            <motion.div
                                                key={idx}
                                                variants={fadeUpVariants}
                                                className="relative flex items-center gap-0 py-8"
                                            >
                                                {isLast ? (
                                                    /* Last story: dark burgundy card full width */
                                                    <div
                                                        className="mx-4 w-full overflow-hidden rounded-2xl shadow-xl"
                                                        style={{
                                                            backgroundColor:
                                                                '#3A0511',
                                                            border: '1px solid #C9A84C',
                                                        }}
                                                    >
                                                        {/* Photo strip at top */}
                                                        <div
                                                            className="relative h-40 bg-cover bg-center"
                                                            style={{
                                                                backgroundImage: `url(${photo})`,
                                                            }}
                                                        >
                                                            <div className="absolute inset-0 bg-black/30" />
                                                            <div className="absolute right-3 top-3">
                                                                <span
                                                                    className="text-5xl font-black opacity-30"
                                                                    style={{
                                                                        fontFamily:
                                                                            "'Cormorant Garamond', serif",
                                                                        color: '#FAF3EC',
                                                                    }}
                                                                >
                                                                    {story.year ||
                                                                        story.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="relative space-y-2 p-5 text-center">
                                                            {/* Paper clip */}
                                                            <div className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#C9A84C]/70" />
                                                            <h4
                                                                className="font-serif text-sm font-bold italic"
                                                                style={{
                                                                    color: '#FAF3EC',
                                                                }}
                                                            >
                                                                {story.title}
                                                            </h4>
                                                            <p
                                                                className="text-[11px] leading-relaxed"
                                                                style={{
                                                                    color: 'rgba(250,243,236,0.7)',
                                                                }}
                                                            >
                                                                "
                                                                {story.content ||
                                                                    story.story}
                                                                "
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : isEven ? (
                                                    /* Even: photo left, text right */
                                                    <>
                                                        {/* Photo arch frame */}
                                                        <div className="w-[45%] flex-shrink-0 pl-4">
                                                            <div
                                                                className="aspect-[3/4] overflow-hidden border-[3px]"
                                                                style={{
                                                                    borderColor:
                                                                        secondaryColor,
                                                                }}
                                                            >
                                                                <img
                                                                    src={photo}
                                                                    className="h-full w-full object-cover"
                                                                    alt={
                                                                        story.title
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* Text right */}
                                                        <div className="flex-1 space-y-2 pr-4 text-right">
                                                            <span
                                                                className="block text-5xl font-black leading-none opacity-20"
                                                                style={{
                                                                    fontFamily:
                                                                        "'Cormorant Garamond', serif",
                                                                    color: primaryColor,
                                                                }}
                                                            >
                                                                {story.year ||
                                                                    story.date}
                                                            </span>
                                                            <h4
                                                                className="font-serif text-sm font-bold italic"
                                                                style={{
                                                                    color: textColor,
                                                                }}
                                                            >
                                                                {story.title}
                                                            </h4>
                                                            <p
                                                                className="text-[2.4cqw] leading-relaxed"
                                                                style={{
                                                                    color: mutedText,
                                                                }}
                                                            >
                                                                "
                                                                {story.content ||
                                                                    story.story}
                                                                "
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    /* Odd: text left, photo right */
                                                    <>
                                                        {/* Text left */}
                                                        <div className="flex-1 space-y-2 pl-4 text-left">
                                                            <span
                                                                className="block text-5xl font-black leading-none opacity-20"
                                                                style={{
                                                                    fontFamily:
                                                                        "'Cormorant Garamond', serif",
                                                                    color: primaryColor,
                                                                }}
                                                            >
                                                                {story.year ||
                                                                    story.date}
                                                            </span>
                                                            <h4
                                                                className="font-serif text-sm font-bold italic"
                                                                style={{
                                                                    color: textColor,
                                                                }}
                                                            >
                                                                {story.title}
                                                            </h4>
                                                            <p
                                                                className="text-[2.4cqw] leading-relaxed"
                                                                style={{
                                                                    color: mutedText,
                                                                }}
                                                            >
                                                                "
                                                                {story.content ||
                                                                    story.story}
                                                                "
                                                            </p>
                                                        </div>
                                                        {/* Photo arch frame */}
                                                        <div className="w-[45%] flex-shrink-0 pr-4">
                                                            <div
                                                                className="aspect-[3/4] overflow-hidden rounded-t-full border-[3px] shadow-lg"
                                                                style={{
                                                                    borderColor:
                                                                        secondaryColor,
                                                                }}
                                                            >
                                                                <img
                                                                    src={photo}
                                                                    className="h-full w-full object-cover"
                                                                    alt={
                                                                        story.title
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {/* Floral divider between items */}
                                                {idx < stories.length - 1 && (
                                                    <div className="absolute -bottom-4 left-1/2 z-10 -translate-x-1/2">
                                                        <img
                                                            src="/assets/theme_1/1779365451407-c39140-88f89bb01e0efa7776ac39e59d772a53.webp"
                                                            className="h-8 w-8 object-contain"
                                                            alt="floral divider"
                                                        />
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* D. COUNTDOWN & CALENDAR SECTION */}
                <section
                    id="countdown"
                    className="relative overflow-hidden bg-[#FAF3EC] px-6 py-16"
                >
                    {/* Floral corner decorations */}
                    <div
                        className="absolute bottom-4 left-0 h-28 w-28 bg-contain bg-no-repeat opacity-70"
                        style={{
                            backgroundImage:
                                "url('/assets/theme_1/1779365549376-nqtsz1-719543e1113ce29e7052be17c6f9ab60.webp')",
                        }}
                    />
                    <div
                        className="absolute right-0 top-4 h-24 w-24 bg-contain bg-no-repeat opacity-60"
                        style={{
                            backgroundImage:
                                "url('/assets/theme_1/1779523772253-6qdh29-e23e3773e2c20d4e802d9a053cca916f.webp')",
                        }}
                    />
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-6 text-center"
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
                                    fontFamily: "'Cormorant Garamond', serif",
                                    color: primaryColor,
                                }}
                            >
                                Days
                            </h2>
                        </motion.div>

                        {/* Countdown frame */}
                        <motion.div
                            variants={scaleInVariants}
                            className="relative mx-auto flex min-h-[200px] w-full flex-col items-center justify-center bg-contain bg-center bg-no-repeat p-8"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_1/1779514146982-1l2m0j-Desaintanpajudul32.webp')",
                            }}
                        >
                            <div className="relative z-10 scale-95">
                                <CountdownTimer targetDate={weddingDate} />
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
                                {Array.from({ length: 30 }).map((_, idx) => {
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
                                })}
                            </div>

                            <div className="flex justify-center pt-2">
                                <a
                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Ilyas+%26+Berrly&dates=20260921T090000/20260921T130000&details=Mohon+doa+restu+kehadiran+Anda+di+pernikahan+kami.&location=Masjid+Raya+Al-Jihad`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[2.4cqw] font-bold transition-all hover:bg-neutral-50 active:scale-95"
                                    style={{
                                        borderColor: secondaryColor,
                                        color: primaryColor,
                                    }}
                                >
                                    <CalendarIcon size={12} />
                                    <span>Google Calendar</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* E. EVENT SCHEDULE SECTION */}
                <section
                    id="schedule"
                    className="relative bg-[#FCF9F6] px-6 py-20"
                >
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="THE WEDDING"
                            title="Acara & Lokasi"
                        />

                        <div className="relative space-y-10">
                            {/* Akad card (arch top, flat bottom) */}
                            {schedules.akad && (
                                <motion.div
                                    variants={fadeUpVariants}
                                    className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-b-3xl rounded-t-full border-2 p-8 text-center shadow-md"
                                    style={{ borderColor: secondaryColor }}
                                >
                                    <div
                                        className="absolute inset-0 -z-10 bg-cover bg-no-repeat opacity-[0.93]"
                                        style={{
                                            backgroundImage:
                                                "url('/assets/theme_1/1779926454379-filwqr-dfasdfasdfa4.webp')",
                                        }}
                                    />
                                    <div className="absolute inset-0 -z-10 bg-black/35" />

                                    <div className="z-10 space-y-6 pt-10 text-white">
                                        <div className="space-y-1">
                                            <h3
                                                className="font-serif text-2xl font-bold italic"
                                                style={{ color: '#FAF3EC' }}
                                            >
                                                Akad Nikah
                                            </h3>
                                            <div
                                                className="mx-auto h-[1.5px] w-12"
                                                style={{
                                                    background: secondaryColor,
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-xs">
                                            <p className="font-semibold tracking-wide text-[#FAF3EC]">
                                                {formatDate(
                                                    schedules.akad.date,
                                                )}
                                            </p>
                                            <p className="text-white/80">
                                                {schedules.akad.time ||
                                                    '09:00 - 11:00 WIB'}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5 px-2 text-xs">
                                            <p className="font-bold text-white/95">
                                                {schedules.akad.venue ||
                                                    'Masjid Raya Al-Jihad'}
                                            </p>
                                            <p className="text-[11px] leading-relaxed text-white/70">
                                                {schedules.akad.address}
                                            </p>
                                        </div>
                                        {schedules.akad.maps && (
                                            <div className="pt-2">
                                                <a
                                                    href={schedules.akad.maps}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-[2.4cqw] font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                                                    style={{
                                                        borderColor:
                                                            secondaryColor,
                                                    }}
                                                >
                                                    <MapPin size={12} />
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
                                className="my-4 flex justify-center"
                            >
                                <img
                                    src="/assets/theme_1/1780085668625-rfalui-dfasdfasdfa4.webp"
                                    alt="Wedding rings sketch"
                                    className="h-16 w-auto object-contain opacity-65"
                                />
                            </motion.div>

                            {/* Resepsi card (flat top, arch bottom) */}
                            {schedules.resepsi && (
                                <motion.div
                                    variants={fadeUpVariants}
                                    className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-b-full rounded-t-3xl border-2 p-8 text-center shadow-md"
                                    style={{ borderColor: secondaryColor }}
                                >
                                    <div
                                        className="absolute inset-0 -z-10 scale-y-[-1] transform bg-cover bg-no-repeat opacity-[0.93]"
                                        style={{
                                            backgroundImage:
                                                "url('/assets/theme_1/1779926454379-filwqr-dfasdfasdfa4.webp')",
                                        }}
                                    />
                                    <div className="absolute inset-0 -z-10 bg-black/35" />

                                    <div className="z-10 space-y-6 pt-6 text-white">
                                        <div className="space-y-1">
                                            <h3
                                                className="font-serif text-2xl font-bold italic"
                                                style={{ color: '#FAF3EC' }}
                                            >
                                                Resepsi
                                            </h3>
                                            <div
                                                className="mx-auto h-[1.5px] w-12"
                                                style={{
                                                    background: secondaryColor,
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-xs">
                                            <p className="font-semibold tracking-wide text-[#FAF3EC]">
                                                {formatDate(
                                                    schedules.resepsi.date,
                                                )}
                                            </p>
                                            <p className="text-white/80">
                                                {schedules.resepsi.time ||
                                                    '11:00 - 13:00 WIB'}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5 px-2 text-xs">
                                            <p className="font-bold text-white/95">
                                                {schedules.resepsi.venue ||
                                                    'Gedung Golden Ballroom'}
                                            </p>
                                            <p className="text-[11px] leading-relaxed text-white/70">
                                                {schedules.resepsi.address}
                                            </p>
                                        </div>
                                        {schedules.resepsi.maps && (
                                            <div className="pb-6 pt-2">
                                                <a
                                                    href={
                                                        schedules.resepsi.maps
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-[2.4cqw] font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                                                    style={{
                                                        borderColor:
                                                            secondaryColor,
                                                    }}
                                                >
                                                    <MapPin size={12} />
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
                    className="relative bg-[#FAF3EC] px-6 py-20"
                >
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="TIMELINE RUNDOWN"
                            title="Susunan Acara"
                        />

                        <motion.div
                            variants={scaleInVariants}
                            className="relative overflow-hidden rounded-3xl border border-sand/30 bg-white p-6 shadow-sm"
                        >
                            {/* Decorative Bow ribbon */}
                            <div className="-mt-2 mb-6 flex justify-center">
                                <img
                                    src="/assets/theme_1/1779523772253-6qdh29-e23e3773e2c20d4e802d9a053cca916f.webp"
                                    alt="Ribbon bow"
                                    className="h-8 w-auto object-contain"
                                />
                            </div>

                            {/* Rundown detail items list */}
                            <div className="relative z-10 space-y-6 text-left">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-xl bg-[#6B1D2F]/10 p-2">
                                        <img
                                            src="/assets/theme_1/1780083844159-tihmmh-dfasdfasdfa1.webp"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span
                                            className="inline-block rounded px-2 py-0.5 text-[9px] font-bold text-white"
                                            style={{
                                                backgroundColor: secondaryColor,
                                            }}
                                        >
                                            10:30 WIB
                                        </span>
                                        <h4 className="font-serif text-sm font-bold italic text-[#2D1A1E]">
                                            Guest Welcoming
                                        </h4>
                                        <p className="text-[2.4cqw] leading-relaxed text-gray-500">
                                            Penyambutan tamu undangan dan
                                            pengisian buku tamu digital.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-xl bg-[#6B1D2F]/10 p-2">
                                        <img
                                            src="/assets/theme_1/1781084097346-3759bj-dfasdfasdfa48.webp"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span
                                            className="inline-block rounded px-2 py-0.5 text-[9px] font-bold text-white"
                                            style={{
                                                backgroundColor: secondaryColor,
                                            }}
                                        >
                                            12:00 WIB
                                        </span>
                                        <h4 className="font-serif text-sm font-bold italic text-[#2D1A1E]">
                                            Entrance Ceremony
                                        </h4>
                                        <p className="text-[2.4cqw] leading-relaxed text-gray-500">
                                            Kedatangan kedua mempelai memasuki
                                            ballroom acara pernikahan.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-xl bg-[#6B1D2F]/10 p-2">
                                        <img
                                            src="/assets/theme_1/1780085668625-rfalui-dfasdfasdfa4.webp"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span
                                            className="inline-block rounded px-2 py-0.5 text-[9px] font-bold text-white"
                                            style={{
                                                backgroundColor: secondaryColor,
                                            }}
                                        >
                                            12:30 WIB
                                        </span>
                                        <h4 className="font-serif text-sm font-bold italic text-[#2D1A1E]">
                                            Akad Ceremony
                                        </h4>
                                        <p className="text-[2.4cqw] leading-relaxed text-gray-500">
                                            Prosesi ijab qobul dan doa kebaikan
                                            bersama keluarga besar.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-xl bg-[#6B1D2F]/10 p-2">
                                        <img
                                            src="/assets/theme_1/1780880811533-mlg04f-dfasdfasdfa43.webp"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span
                                            className="inline-block rounded px-2 py-0.5 text-[9px] font-bold text-white"
                                            style={{
                                                backgroundColor: secondaryColor,
                                            }}
                                        >
                                            13:00 WIB
                                        </span>
                                        <h4 className="font-serif text-sm font-bold italic text-[#2D1A1E]">
                                            Greetings Session
                                        </h4>
                                        <p className="text-[2.4cqw] leading-relaxed text-gray-500">
                                            Sesi pemberian ucapan selamat dan
                                            jabat tangan bersama kerabat.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-xl bg-[#6B1D2F]/10 p-2">
                                        <img
                                            src="/assets/theme_1/1782651517890-qd2hgg-dfasdfasdfa81.webp"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span
                                            className="inline-block rounded px-2 py-0.5 text-[9px] font-bold text-white"
                                            style={{
                                                backgroundColor: secondaryColor,
                                            }}
                                        >
                                            19:00 WIB
                                        </span>
                                        <h4 className="font-serif text-sm font-bold italic text-[#2D1A1E]">
                                            Reception Dinner
                                        </h4>
                                        <p className="text-[2.4cqw] leading-relaxed text-gray-500">
                                            Acara ramah tamah, makan malam
                                            bersama, serta iringan musik syahdu.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-xl bg-[#6B1D2F]/10 p-2">
                                        <img
                                            src="/assets/theme_1/1779377825399-rvr91o-Desaintanpajudul31.webp"
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span
                                            className="inline-block rounded px-2 py-0.5 text-[9px] font-bold text-white"
                                            style={{
                                                backgroundColor: secondaryColor,
                                            }}
                                        >
                                            20:30 WIB
                                        </span>
                                        <h4 className="font-serif text-sm font-bold italic text-[#2D1A1E]">
                                            Group Photoshoot
                                        </h4>
                                        <p className="text-[2.4cqw] leading-relaxed text-gray-500">
                                            Sesi dokumentasi foto kenangan manis
                                            bersama para undangan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* G. DRESSCODE SECTION */}
                <section
                    id="dresscode"
                    className="relative bg-[#FCF9F6] px-6 py-20"
                >
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="DRESSCODE"
                            title="Ketentuan Pakaian"
                        />

                        {/* Dresscode main card */}
                        <motion.div
                            variants={scaleInVariants}
                            className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-sand/30 bg-white p-6 shadow-sm"
                        >
                            {/* Watermark hugging couple background */}
                            <div
                                className="pointer-events-none absolute inset-0 bg-contain bg-bottom bg-no-repeat opacity-10"
                                style={{
                                    backgroundImage:
                                        "url('/assets/theme_1/1781084043635-ydzi6u-dfasdfasdfa49.webp')",
                                }}
                            />

                            <div className="relative z-10 space-y-5">
                                <p
                                    className="mx-auto max-w-xs text-[11px] leading-relaxed"
                                    style={{ color: mutedText }}
                                >
                                    Untuk melengkapi keselarasan momen bahagia
                                    pernikahan kami, kami mengharapkan kesediaan
                                    Bapak/Ibu/Saudara/i mengenakan pakaian
                                    dengan sentuhan palet warna berikut:
                                </p>

                                {/* Swatches Grid */}
                                <div className="flex items-center justify-center gap-3 py-2">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="h-10 w-10 rounded-full border bg-cover bg-center shadow-inner"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/1780091442564-ox0r8n-Screenshot2026-05-30054824.webp')",
                                            }}
                                        />
                                        <span className="text-[9px] font-semibold uppercase text-gray-500">
                                            Burgundy
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="h-10 w-10 rounded-full border bg-cover bg-center shadow-inner"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/1780091445154-15gqxb-Screenshot2026-05-30054809.webp')",
                                            }}
                                        />
                                        <span className="text-[9px] font-semibold uppercase text-gray-500">
                                            Black
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="h-10 w-10 rounded-full border bg-cover bg-center shadow-inner"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/1780091441278-5xkqa2-Screenshot2026-05-30054837.webp')",
                                            }}
                                        />
                                        <span className="text-[9px] font-semibold uppercase text-gray-500">
                                            Rose Gold
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="h-10 w-10 rounded-full border bg-cover bg-center shadow-inner"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_1/1780091439740-o13bki-Screenshot2026-05-30054845.webp')",
                                            }}
                                        />
                                        <span className="text-[9px] font-semibold uppercase text-gray-500">
                                            Bronze
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* H. LIVE STREAMING SECTION */}
                <section
                    id="streaming"
                    className="relative bg-[#FAF3EC] px-6 py-20"
                >
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="LIVE STREAMING"
                            title="Siaran Langsung"
                        />

                        <motion.div
                            variants={scaleInVariants}
                            className="space-y-5 rounded-3xl border border-sand/30 bg-white p-6 shadow-sm"
                        >
                            <p
                                className="mx-auto max-w-xs text-[11px] leading-relaxed"
                                style={{ color: mutedText }}
                            >
                                Apabila berhalangan hadir secara langsung,
                                Bapak/Ibu/Saudara/i dapat menyaksikan hari
                                bahagia kami melalui siaran langsung virtual:
                            </p>

                            {/* Embedded Player Mockup */}
                            <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-inner">
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm filter"
                                    style={{
                                        backgroundImage:
                                            "url('/assets/theme_1/1780160070223-pt4rx2-dfasdfasdfa.webp')",
                                    }}
                                />
                                <div className="z-10 flex flex-col items-center gap-2">
                                    <div className="animate-pulse rounded-full bg-red-600 p-3.5 text-white">
                                        <Video size={24} />
                                    </div>
                                    <span className="rounded bg-red-600 px-2 py-0.5 text-[2.4cqw] font-bold tracking-widest text-white">
                                        LIVE BROADCAST
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a
                                    href="https://youtube.com/live"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="active:scale-98 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:opacity-90"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <span>Gabung Siaran</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* I. PHOTO GALLERY SECTION */}
                <section
                    id="gallery"
                    className="relative bg-[#FCF9F6] px-6 py-20"
                >
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="GALERI FOTO"
                            title="Album Momen Indah"
                        />

                        {/* Album Book Mockup Cover */}
                        <motion.div
                            variants={scaleInVariants}
                            className="space-y-4 rounded-3xl border border-sand/30 bg-white p-6 text-center shadow-sm"
                        >
                            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-100 p-1">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${displayPhotos[0].url})`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="relative z-10 space-y-1 text-white">
                                    <span
                                        className="text-[2.4cqw] font-bold uppercase tracking-[0.25em]"
                                        style={{ color: secondaryColor }}
                                    >
                                        OUR LOVE STORY
                                    </span>
                                    <h4 className="font-serif text-lg font-bold italic">
                                        Album Kenangan
                                    </h4>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAlbumOpen(!isAlbumOpen)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:bg-neutral-50 active:scale-[0.98]"
                                style={{ color: primaryColor }}
                            >
                                <span>
                                    {isAlbumOpen
                                        ? 'Tutup Album'
                                        : 'Lihat Seluruh Foto'}
                                </span>
                            </button>
                        </motion.div>

                        {/* Photo Grid list (collapsible) */}
                        <AnimatePresence>
                            {isAlbumOpen && (
                                <motion.div
                                    className="grid grid-cols-2 gap-4 pt-2"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {displayPhotos.map((photo, i) => (
                                        <div
                                            key={photo.id || i}
                                            className="aspect-[3/4] overflow-hidden rounded-t-full border-[3px] shadow-sm"
                                            style={{
                                                borderColor: secondaryColor,
                                            }}
                                        >
                                            <img
                                                src={photo.url}
                                                className="h-full w-full object-cover"
                                                alt="Gallery item"
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* J. DIGITAL GIFT SECTION */}
                <section id="gift" className="relative bg-[#FAF3EC] px-6 py-20">
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="WEDDING GIFT"
                            title="Kado Digital"
                        />

                        {/* Gift transfer block cards */}
                        <div className="space-y-6">
                            <motion.div
                                variants={fadeUpVariants}
                                className="relative overflow-hidden rounded-3xl border border-sand/30 bg-white p-6 text-left shadow-sm"
                            >
                                <div className="flex items-center justify-between border-b pb-2.5">
                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: primaryColor }}
                                    >
                                        BANK MANDIRI
                                    </span>
                                    <span className="text-[9px] font-bold uppercase text-gray-400">
                                        ILYAS HANDSOME
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div className="space-y-1">
                                        <p className="font-mono text-base font-bold tracking-wider text-gray-700">
                                            123-456-789-0
                                        </p>
                                        <p className="text-[9px] text-gray-400">
                                            Atas nama: Ilyas Handsome
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleCopy('123-456-789-0', 'groom')
                                        }
                                        className="flex items-center justify-center gap-1 rounded-full border p-2 text-[2.4cqw] font-bold transition-all hover:bg-neutral-50 active:scale-95"
                                        style={{
                                            borderColor: `${primaryColor}20`,
                                            color: primaryColor,
                                        }}
                                    >
                                        {copiedGroomBank ? (
                                            <>
                                                <Check
                                                    size={12}
                                                    className="text-green-600"
                                                />
                                                <span className="text-green-600">
                                                    Copied!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeUpVariants}
                                className="relative overflow-hidden rounded-3xl border border-sand/30 bg-white p-6 text-left shadow-sm"
                            >
                                <div className="flex items-center justify-between border-b pb-2.5">
                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: primaryColor }}
                                    >
                                        BANK BCA
                                    </span>
                                    <span className="text-[9px] font-bold uppercase text-gray-400">
                                        BERRLY BEAUTY
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div className="space-y-1">
                                        <p className="font-mono text-base font-bold tracking-wider text-gray-700">
                                            987-654-321-0
                                        </p>
                                        <p className="text-[9px] text-gray-400">
                                            Atas nama: Berrly Beauty
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleCopy('987-654-321-0', 'bride')
                                        }
                                        className="flex items-center justify-center gap-1 rounded-full border p-2 text-[2.4cqw] font-bold transition-all hover:bg-neutral-50 active:scale-95"
                                        style={{
                                            borderColor: `${primaryColor}20`,
                                            color: primaryColor,
                                        }}
                                    >
                                        {copiedBrideBank ? (
                                            <>
                                                <Check
                                                    size={12}
                                                    className="text-green-600"
                                                />
                                                <span className="text-green-600">
                                                    Copied!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* K. RSVP FORM SECTION */}
                <section id="rsvp" className="relative bg-[#FCF9F6] px-6 py-20">
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="KONFIRMASI RSVP"
                            title="Kehadiran Anda"
                        />

                        {guestName && (
                            <motion.p
                                variants={fadeUpVariants}
                                className="text-center text-xs"
                                style={{ color: mutedText }}
                            >
                                Kepada Yth. Bapak/Ibu/Saudara/i: <br />
                                <span
                                    className="mt-1 block text-base font-bold"
                                    style={{ color: primaryColor }}
                                >
                                    {guestName}
                                </span>
                            </motion.p>
                        )}

                        {/* Form card with deep burgundy backing/details */}
                        <motion.div
                            variants={scaleInVariants}
                            className="relative overflow-hidden rounded-3xl border border-sand/30 bg-white p-6 shadow-sm"
                        >
                            {/* Decorative seal bow */}
                            <div className="pointer-events-none absolute right-6 top-2 opacity-30">
                                <img
                                    src="/assets/theme_1/1779523772253-6qdh29-e23e3773e2c20d4e802d9a053cca916f.webp"
                                    className="h-12 w-12"
                                />
                            </div>

                            <RSVPForm
                                guestName={guestName}
                                guestToken={guestToken}
                                onRsvpSubmit={onRsvpSubmit}
                                initialStatus="hadir"
                            />
                        </motion.div>
                    </motion.div>
                </section>

                {/* L. GUEST WISHES SECTION */}
                <section
                    id="wishes"
                    className="relative bg-[#FAF3EC] px-6 py-20"
                >
                    <motion.div
                        className="mx-auto w-full max-w-sm space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="BUKU TAMU"
                            title="Doa Restu Anda"
                        />

                        <motion.div variants={fadeUpVariants} className="pt-2">
                            <div className="rounded-3xl border border-sand/30 bg-white p-6 shadow-sm">
                                <GuestWishes
                                    initialWishes={wishes}
                                    weddingId={weddingId}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* M. FOOTER CLOSING SECTION */}
                <footer
                    id="footer"
                    className="relative overflow-hidden bg-[#3A0511] px-6 py-24 text-center text-[#FCF9F6]"
                >
                    {/* Watermark gazebo background decoration */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-10"
                        style={{
                            backgroundImage:
                                "url('/assets/theme_1/1779926454379-filwqr-dfasdfasdfa4.webp')",
                        }}
                    />

                    <motion.div
                        className="relative z-10 space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={fadeUpVariants}>
                            <Heart
                                size={28}
                                className="mx-auto animate-pulse fill-[#C9A84C]/45 text-[#C9A84C]"
                            />
                        </motion.div>

                        <motion.p
                            variants={fadeUpVariants}
                            className="text-4xl font-normal italic tracking-wide text-white"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groom.nickname || 'Ilyas'} &{' '}
                            {bride.nickname || 'Berrly'}
                        </motion.p>

                        <motion.div
                            variants={fadeUpVariants}
                            className="space-y-1.5 text-xs text-white/70"
                        >
                            <p className="font-semibold tracking-[0.1em]">
                                {formatDate(weddingDate)}
                            </p>
                            <p className="text-[2.4cqw] opacity-75">
                                Merupakan kehormatan bagi kami atas kehadiran
                                Anda.
                            </p>
                        </motion.div>

                        <motion.p
                            variants={fadeUpVariants}
                            className="pt-4 font-sans text-[9px] uppercase tracking-widest text-white/40"
                        >
                            Dibuat dengan cinta menggunakan Ngaturi
                        </motion.p>
                    </motion.div>
                </footer>
            </div>

            {/* ============================================================== */}
            {/* 3. FLOATING BUTTON CONTROL INTERFACES                          */}
            {/* ============================================================== */}
            {/* A. QR CHECK-IN SCROLLER ACCESS BUTTON */}
            {guestName && (
                <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="z-35 fixed bottom-20 right-6 rounded-full border border-[#C9A84C]/35 bg-[#6B1D2F] p-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Akses Masuk QR"
                >
                    <QrCode size={20} />
                </button>
            )}

            {/* B. NAVIGATION MENU OVERLAY BURGER TOGGLE BUTTON */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="z-35 fixed bottom-6 right-6 rounded-full border border-sand/35 bg-white p-3.5 text-[#6B1D2F] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                title="Menu"
            >
                <Menu size={20} />
            </button>

            {/* C. FULL-SCREEN NAVIGATION OVERLAY MODAL */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex select-none flex-col items-center justify-center bg-[#2D1A1E]/95 p-8 text-center backdrop-blur-md"
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
                                    onClick={() => scrollToSection('couple')}
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
                                    onClick={() => scrollToSection('countdown')}
                                    className="transition-colors hover:text-[#C9A84C]"
                                >
                                    Waktu
                                </button>
                                <button
                                    onClick={() => scrollToSection('schedule')}
                                    className="transition-colors hover:text-[#C9A84C]"
                                >
                                    Acara & Lokasi
                                </button>
                                <button
                                    onClick={() => scrollToSection('timeline')}
                                    className="transition-colors hover:text-[#C9A84C]"
                                >
                                    Timeline
                                </button>
                                <button
                                    onClick={() => scrollToSection('dresscode')}
                                    className="transition-colors hover:text-[#C9A84C]"
                                >
                                    Dresscode
                                </button>
                                <button
                                    onClick={() => scrollToSection('gallery')}
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
                        className="fixed inset-0 z-50 flex select-none items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
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
                                    penerima tamu di lokasi acara untuk check-in
                                    kehadiran digital.
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
        </div>
    );
};

export default Theme1;
