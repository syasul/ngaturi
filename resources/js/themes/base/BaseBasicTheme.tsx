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

export const InstagramIcon = ({ size = 13 }: { size?: number }) => (
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

export interface BasicThemeConfig {
    id: string;
    name: string;
    editionTitle: string;
    hashTag: string;
    heroIllustration: string;

    // Desktop Left Panel
    desktopBg: string;
    desktopGradient: string;
    desktopTextColor: string;
    desktopAccentText: string;
    desktopBadgeBorder: string;
    desktopBadgeBg: string;

    // Mobile Container
    containerBg: string;
    containerTextColor: string;
    containerId: string;

    // Accent Colors
    accentColor: string;
    accentColorAlt?: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    accentShadow: string;

    // Buttons
    buttonPrimary: string;
    buttonSecondary: string;

    // Sections
    sectionAltBg: string;
    quoteBannerBg: string;
    quoteTextColor: string;
    quoteAccentColor: string;

    // Cards
    cardBg: string;
    cardBorder: string;
    cardTitleText: string;
    cardSubText: string;

    // Bottom Dock
    dockBg: string;
    dockBorder: string;
    dockText: string;
    dockActiveText: string;
    dockActiveBg: string;

    // Renderers
    renderCorner: (props: {
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
        color?: string;
        size?: number;
        className?: string;
    }) => React.ReactNode;
    renderDivider: (props?: { color?: string; className?: string }) => React.ReactNode;
}

export interface BaseBasicThemeProps extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
    config: BasicThemeConfig;
}

export const BaseBasicTheme: React.FC<BaseBasicThemeProps> = ({
    data,
    photos = [],
    guestName,
    onRsvpSubmit,
    isOpened: externalIsOpened = true,
    onOpen: externalOnOpen,
    isPlayingMusic: externalIsPlayingMusic,
    setIsPlayingMusic: externalSetIsPlayingMusic,
    config,
}) => {
    const [isOpened, setIsOpened] = useState(externalIsOpened);

    useEffect(() => {
        setIsOpened(externalIsOpened);
    }, [externalIsOpened]);

    // Helpers
    const resolveImageUrl = (
        img: string | undefined | null,
        fallback: string,
    ) => {
        if (!img) return fallback;
        if (
            img.startsWith('http://') ||
            img.startsWith('https://') ||
            img.startsWith('/')
        ) {
            return img;
        }
        return `/storage/${img}`;
    };

    const customStyle = data?.customStyle || {};
    const groom = data?.groom || {
        fullName: 'Arya Pratama, S.T.',
        nickname: 'Arya',
        father: 'Bpk. Bambang Wijaya',
        mother: 'Ibu Rina Astuti',
        instagram: 'aryapratama',
        bio: 'Putra pertama dari keluarga Bpk. Bambang Wijaya & Ibu Rina Astuti',
    };

    const bride = data?.bride || {
        fullName: 'Nabila Putri Larasati, S.Ds.',
        nickname: 'Nabila',
        father: 'Bpk. Hendra Gunawan',
        mother: 'Ibu Sri Rahayu',
        instagram: 'nabilaputri',
        bio: 'Putri bungsu dari keluarga Bpk. Hendra Gunawan & Ibu Sri Rahayu',
    };

    const schedules = data?.schedules || {
        akad: {
            title: 'Akad Nikah',
            date: 'Sabtu, 24 Oktober 2026',
            time: '08:00 - 10:00 WIB',
            location: 'Masjid Agung Al-Berkah',
            address: 'Jl. Merpati Putih No. 12, Jawa Barat',
            mapsUrl: 'https://maps.google.com',
        },
        resepsi: {
            title: 'Resepsi Pernikahan',
            date: 'Sabtu, 24 Oktober 2026',
            time: '11:00 - 14:00 WIB',
            location: 'The Grand Pavilion Ballroom',
            address: 'Jl. Boulevard Raya No. 88, Jawa Barat',
            mapsUrl: 'https://maps.google.com',
        },
    };

    const galleries = data?.galleries?.length
        ? data.galleries
        : [
              {
                  id: '1',
                  url: '/assets/wedding/hero-floral.png',
                  caption: 'Kelopak Kasih Yang Mekar',
              },
              {
                  id: '2',
                  url: '/assets/wedding/couple-rustic.png',
                  caption: 'Ketenangan Bersamamu',
              },
              {
                  id: '3',
                  url: '/assets/wedding/couple-royal.png',
                  caption: 'Menatap Masa Depan Berdua',
              },
              {
                  id: '4',
                  url: '/assets/wedding/couple-foliage.png',
                  caption: 'Dua Jiwa Selaras',
              },
              {
                  id: '5',
                  url: '/assets/wedding/hero-floral.png',
                  caption: 'Senyuman Penuh Ketulusan',
              },
              {
                  id: '6',
                  url: '/assets/wedding/couple-rustic.png',
                  caption: 'Janji Sehidup Semati',
              },
          ];

    const stories = data?.stories?.length
        ? data.stories
        : [
              {
                  year: '2021',
                  title: 'Awal Pertemuan Indah',
                  content:
                      'Sebuah perkenalan yang tenang dan berkesan, memulai perjalanan panjang penuh harapan.',
              },
              {
                  year: '2023',
                  title: 'Menumbuhkan Keyakinan',
                  content:
                      'Saling mengerti, saling menghargai, dan menumbuhkan rasa percaya dalam setiap langkah.',
              },
              {
                  year: '2026',
                  title: 'Pernikahan Suci',
                  content:
                      'Dengan restu kedua orang tua dan berkah Illahi, kami mengikat janji suci untuk selamanya bersama.',
              },
          ];

    const bankAccounts = data?.bankAccounts?.length
        ? data.bankAccounts
        : [
              {
                  bank: 'BCA',
                  accountNumber: '8830192831',
                  accountName: 'Arya Pratama',
              },
              {
                  bank: 'Bank Mandiri',
                  accountNumber: '1370019283741',
                  accountName: 'Nabila Putri Larasati',
              },
          ];

    const wishes = data?.wishes?.length
        ? data.wishes
        : [
              {
                  id: '1',
                  name: 'Dimas & Keluarga',
                  message:
                      'Selamat atas pernikahannya Arya & Nabila! Semoga senantiasa sakinah mawaddah warahmah.',
                  createdAt: '1 jam lalu',
                  rsvpStatus: 'hadir',
              },
              {
                  id: '2',
                  name: 'Siti Sarah',
                  message:
                      'Happy wedding! Lancar sampai hari H, semoga bahagia dan langgeng selamanya yaa.',
                  createdAt: '2 jam lalu',
                  rsvpStatus: 'hadir',
              },
              {
                  id: '3',
                  name: 'Fauzan Akbar',
                  message:
                      'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Aamiin!',
                  createdAt: '3 jam lalu',
                  rsvpStatus: 'hadir',
              },
          ];

    const groomFullName = groom.fullName || 'Arya Pratama';
    const groomNickname = groom.nickname || 'Arya';
    const brideFullName = bride.fullName || 'Nabila Putri Larasati';
    const brideNickname = bride.nickname || 'Nabila';
    const primaryDate =
        schedules.akad?.date || schedules.resepsi?.date || 'Sabtu, 24 Oktober 2026';

    const handleOpen = () => {
        setIsOpened(true);
        if (externalOnOpen) externalOnOpen();
        if (externalSetIsPlayingMusic) externalSetIsPlayingMusic(true);
    };

    // Audio state
    const [isPlaying, setIsPlaying] = useState(
        externalIsPlayingMusic ?? isOpened,
    );
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (externalIsPlayingMusic !== undefined) {
            setIsPlaying(externalIsPlayingMusic);
        }
    }, [externalIsPlayingMusic]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying && isOpened) {
                audioRef.current.play().catch(() => {});
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isOpened]);

    const toggleMusic = () => {
        const next = !isPlaying;
        setIsPlaying(next);
        if (externalSetIsPlayingMusic) {
            externalSetIsPlayingMusic(next);
        }
    };

    // Countdown state
    const targetDate = new Date('2026-10-24T08:00:00+07:00').getTime();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                    ),
                    minutes: Math.floor(
                        (difference % (1000 * 60 * 60)) / (1000 * 60),
                    ),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    // Copy to clipboard notification
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedAccount(id);
        setTimeout(() => setCopiedAccount(null), 2500);
    };

    // RSVP state
    const [rsvpName, setRsvpName] = useState(guestName || '');
    const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'ragu' | 'tidak_hadir'>('hadir');
    const [rsvpMessage, setRsvpMessage] = useState('');
    const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

    // Wishes state
    const [localWishes, setLocalWishes] = useState<any[]>(wishes);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    // Scrollspy active section tracking
    const [activeSection, setActiveSection] = useState<string>('section-cover');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container =
            containerRef.current ||
            document.getElementById(config.containerId);
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
    }, [isOpened, config.containerId]);

    const handleRsvpSubmit = async (e: React.FormEvent) => {
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

    const scrollTo = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        const container =
            containerRef.current ||
            document.getElementById(config.containerId);
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
        config.heroIllustration || '/assets/wedding/couple-foliage.png',
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
            {/* LEFT PANEL: DESKTOP SHOWCASE                                   */}
            {/* ============================================================== */}
            <div className={`relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden ${config.desktopBg} p-12 ${config.desktopTextColor} lg:flex`}>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 saturate-125"
                    style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${config.desktopGradient}`} />

                {config.renderCorner({ position: 'top-left', size: 80, className: 'left-8 top-8' })}
                {config.renderCorner({ position: 'bottom-right', size: 80, className: 'bottom-8 right-8' })}

                <div className="relative z-10">
                    <span className={`inline-flex items-center gap-2 rounded-full border ${config.desktopBadgeBorder} ${config.desktopBadgeBg} px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] ${config.desktopAccentText} backdrop-blur-md`}>
                        <Sparkles size={12} /> {config.editionTitle}
                    </span>
                </div>

                <div className="relative z-10 my-auto max-w-xl py-12">
                    <p className={`font-serif text-sm tracking-[0.3em] uppercase ${config.desktopAccentText} opacity-80`}>
                        The Wedding Celebration
                    </p>
                    <h1 className="mt-4 font-serif text-6xl font-light tracking-tight xl:text-7xl">
                        {groomNickname} <span className={`font-serif italic ${config.desktopAccentText}`}>&</span> {brideNickname}
                    </h1>
                    <p className="mt-6 text-sm leading-relaxed opacity-70">
                        {primaryDate} &bull; {schedules.akad?.location || 'Jawa Barat'}
                    </p>
                    <div className="mt-8 flex items-center gap-6">
                        <div className={`rounded-xl border ${config.desktopBadgeBorder} bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]`}>
                            <p className={`font-serif text-2xl ${config.desktopAccentText}`}>{timeLeft.days}</p>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">Hari</p>
                        </div>
                        <div className={`rounded-xl border ${config.desktopBadgeBorder} bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]`}>
                            <p className={`font-serif text-2xl ${config.desktopAccentText}`}>{timeLeft.hours}</p>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">Jam</p>
                        </div>
                        <div className={`rounded-xl border ${config.desktopBadgeBorder} bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]`}>
                            <p className={`font-serif text-2xl ${config.desktopAccentText}`}>{timeLeft.minutes}</p>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">Menit</p>
                        </div>
                        <div className={`rounded-xl border ${config.desktopBadgeBorder} bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]`}>
                            <p className={`font-serif text-2xl ${config.desktopAccentText}`}>{timeLeft.seconds}</p>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">Detik</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs opacity-50">
                    <p>&copy; 2026 Ngaturi &bull; {config.name}</p>
                    <p className={`font-mono text-[11px] tracking-wider ${config.desktopAccentText}`}>{config.hashTag}</p>
                </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT PANEL: MOBILE-OPTIMIZED INVITATION CONTAINER             */}
            {/* ============================================================== */}
            <div
                ref={containerRef}
                id={config.containerId}
                className={`relative h-screen w-full flex-1 overflow-y-auto ${config.containerBg} ${config.containerTextColor} shadow-2xl lg:max-w-[480px] xl:max-w-[500px]`}
            >
                {/* Audio Element */}
                <audio
                    ref={audioRef}
                    loop
                    preload="auto"
                    src={resolveImageUrl(
                        data?.musicUrl,
                        '/music/audio.mp3',
                    )}
                />

                {/* Floating Sound Toggle Button */}
                {isOpened && (
                    <button
                        onClick={toggleMusic}
                        className={`fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border ${config.accentBorder} ${config.containerBg}/90 ${config.accentText} shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95`}
                        aria-label="Toggle Musik"
                    >
                        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                )}

                {/* ========================================================== */}
                {/* 1. OPENING COVER / ENVELOPE MODAL                           */}
                {/* ========================================================== */}
                <AnimatePresence>
                    {!isOpened && (
                        <motion.div
                            key={`cover-envelope-${config.id}`}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -60, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
                            className={`fixed inset-0 z-50 flex flex-col items-center justify-between ${config.containerBg} p-8 text-center`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-15"
                                style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-b ${config.containerBg}/95 via-${config.containerBg}/80 to-${config.containerBg}`} />

                            {config.renderCorner({ position: 'top-left', size: 70, className: 'left-4 top-4' })}
                            {config.renderCorner({ position: 'top-right', size: 70, className: 'right-4 top-4' })}
                            {config.renderCorner({ position: 'bottom-left', size: 70, className: 'bottom-4 left-4' })}
                            {config.renderCorner({ position: 'bottom-right', size: 70, className: 'bottom-4 right-4' })}

                            <div className="relative z-10 mt-8">
                                <span className={`text-[11px] font-medium uppercase tracking-[0.3em] ${config.accentText}`}>
                                    Undangan Pernikahan
                                </span>
                            </div>

                            <div className="relative z-10 my-auto flex flex-col items-center">
                                {/* Monogram */}
                                <div className={`relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border ${config.accentBorder} ${config.cardBg} shadow-md`}>
                                    <div className={`text-center font-serif text-2xl font-light ${config.cardTitleText}`}>
                                        <span>{groomNickname[0]}</span>
                                        <span className={`italic ${config.accentText}`}>&</span>
                                        <span>{brideNickname[0]}</span>
                                    </div>
                                </div>

                                <p className={`font-serif text-sm tracking-[0.25em] uppercase ${config.accentText}`}>
                                    The Wedding of
                                </p>
                                <h1 className={`mt-3 font-serif text-4xl font-normal tracking-tight ${config.cardTitleText} sm:text-5xl`}>
                                    {groomNickname} <span className={`font-serif italic ${config.accentText}`}>&</span> {brideNickname}
                                </h1>

                                <div className={`mt-8 rounded-2xl border ${config.cardBorder} ${config.cardBg} px-6 py-4 shadow-sm backdrop-blur-sm max-w-xs w-full`}>
                                    <p className={`text-[11px] ${config.accentText} uppercase tracking-widest`}>
                                        Kepada Yth. Bapak/Ibu/Saudara/i:
                                    </p>
                                    <p className={`mt-1 font-serif text-lg font-medium ${config.cardTitleText}`}>
                                        {guestName || 'Tamu Undangan'}
                                    </p>
                                    <p className={`mt-1 text-[10px] ${config.accentText} opacity-70 italic`}>
                                        *Mohon maaf bila ada kesalahan penulisan nama/gelar
                                    </p>
                                </div>

                                <button
                                    onClick={handleOpen}
                                    className={`group relative mt-8 flex items-center gap-2.5 overflow-hidden rounded-full ${config.buttonPrimary} px-8 py-3.5 text-xs font-semibold tracking-wider uppercase transition-all active:scale-95`}
                                >
                                    <Heart size={14} className="transition-transform group-hover:scale-125" />
                                    <span>Buka Undangan</span>
                                </button>
                            </div>

                            <div className={`relative z-10 mb-4 text-[10px] tracking-widest uppercase ${config.accentText} opacity-70`}>
                                {primaryDate}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ========================================================== */}
                {/* 2. SECTION: COVER / HERO                                   */}
                {/* ========================================================== */}
                <section
                    id="section-cover"
                    className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-6 py-16 text-center"
                >
                    {config.renderCorner({ position: 'top-left', size: 60, className: 'left-4 top-4' })}
                    {config.renderCorner({ position: 'top-right', size: 60, className: 'right-4 top-4' })}

                    <div className="relative z-10 pt-4">
                        <span className={`text-[10px] font-semibold tracking-[0.3em] uppercase ${config.accentText}`}>
                            Walimatul Ursy
                        </span>
                    </div>

                    <div className="relative z-10 my-auto flex w-full flex-col items-center">
                        <div className="relative mb-6 h-64 w-48 overflow-hidden rounded-[80px_80px_20px_20px] border-4 border-white/60 shadow-xl">
                            <img
                                src={coupleHeroPhoto}
                                alt="Mempelai"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <p className={`font-serif text-xs uppercase tracking-[0.25em] ${config.accentText}`}>
                            The Wedding of
                        </p>
                        <h1 className={`mt-2 font-serif text-3xl font-normal tracking-wide ${config.cardTitleText} sm:text-4xl`}>
                            {groomNickname} <span className={`font-serif italic ${config.accentText}`}>&</span> {brideNickname}
                        </h1>

                        <p className={`mt-3 font-serif text-xs italic ${config.cardSubText}`}>
                            {primaryDate}
                        </p>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        {/* Live Countdown Grid */}
                        <div className="grid grid-cols-4 gap-2.5 max-w-xs w-full">
                            <div className={`flex flex-col items-center justify-center rounded-xl border ${config.cardBorder} ${config.cardBg} p-2.5 shadow-sm min-w-[56px]`}>
                                <span className={`font-serif text-xl font-medium ${config.cardTitleText}`}>{timeLeft.days}</span>
                                <span className={`text-[9px] uppercase tracking-wider ${config.accentText}`}>Hari</span>
                            </div>
                            <div className={`flex flex-col items-center justify-center rounded-xl border ${config.cardBorder} ${config.cardBg} p-2.5 shadow-sm min-w-[56px]`}>
                                <span className={`font-serif text-xl font-medium ${config.cardTitleText}`}>{timeLeft.hours}</span>
                                <span className={`text-[9px] uppercase tracking-wider ${config.accentText}`}>Jam</span>
                            </div>
                            <div className={`flex flex-col items-center justify-center rounded-xl border ${config.cardBorder} ${config.cardBg} p-2.5 shadow-sm min-w-[56px]`}>
                                <span className={`font-serif text-xl font-medium ${config.cardTitleText}`}>{timeLeft.minutes}</span>
                                <span className={`text-[9px] uppercase tracking-wider ${config.accentText}`}>Menit</span>
                            </div>
                            <div className={`flex flex-col items-center justify-center rounded-xl border ${config.cardBorder} ${config.cardBg} p-2.5 shadow-sm min-w-[56px]`}>
                                <span className={`font-serif text-xl font-medium ${config.cardTitleText}`}>{timeLeft.seconds}</span>
                                <span className={`text-[9px] uppercase tracking-wider ${config.accentText}`}>Detik</span>
                            </div>
                        </div>

                        <a
                            href={createGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-6 inline-flex items-center gap-2 rounded-full border ${config.accentBorder} ${config.cardBg} px-5 py-2 text-[11px] font-medium ${config.accentText} shadow-sm backdrop-blur-sm transition-all hover:shadow-md active:scale-95`}
                        >
                            <CalendarIcon size={13} />
                            <span>Simpan ke Google Calendar</span>
                        </a>
                    </div>

                    <div className={`relative z-10 animate-bounce pb-2 ${config.accentText}`}>
                        <span className="text-[10px] uppercase tracking-widest">&darr; Gulir ke Bawah</span>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 3. SECTION: AYAT SUCI (CONTRAST BANNER)                     */}
                {/* ========================================================== */}
                <section className={`relative overflow-hidden ${config.quoteBannerBg} px-8 py-16 text-center ${config.quoteTextColor}`}>
                    {config.renderCorner({ position: 'top-left', size: 54, className: 'left-4 top-4' })}
                    {config.renderCorner({ position: 'bottom-right', size: 54, className: 'bottom-4 right-4' })}

                    <div className="relative z-10 mx-auto max-w-sm">
                        <svg className={`mx-auto mb-4 h-8 w-8 ${config.quoteAccentColor} opacity-70`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        <p className="font-serif text-sm leading-relaxed opacity-90 italic sm:text-base">
                            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
                        </p>
                        <p className={`mt-4 font-mono text-xs uppercase tracking-widest ${config.quoteAccentColor}`}>
                            &bull; Q.S. Ar-Rum: 21 &bull;
                        </p>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 4. SECTION: MEMPELAI (BRIDE & GROOM)                       */}
                {/* ========================================================== */}
                <section id="section-couple" className="relative px-6 py-20 text-center">
                    {config.renderCorner({ position: 'top-right', size: 50, className: 'right-3 top-3' })}

                    <div className="relative z-10 mx-auto max-w-md">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>
                            Pasangan Mempelai
                        </span>
                        <h2 className={`mt-2 font-serif text-2xl font-medium tracking-tight ${config.cardTitleText} sm:text-3xl`}>
                            Mempelai yang Berbahagia
                        </h2>
                        <p className={`mx-auto mt-2 max-w-xs text-xs leading-relaxed ${config.cardSubText}`}>
                            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud melangsungkan pernikahan putra-putri kami:
                        </p>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        {/* Groom Card */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`rounded-3xl border ${config.cardBorder} ${config.cardBg} p-6 shadow-sm backdrop-blur-sm`}
                        >
                            <div className="relative mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full border-2 border-white/80 shadow-md">
                                <img
                                    src={groomPhoto}
                                    alt={groomFullName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className={`font-serif text-xl font-medium ${config.cardTitleText}`}>
                                {groomFullName}
                            </h3>
                            <p className={`mt-1 text-xs font-serif italic ${config.accentText}`}>
                                &mdash; {groomNickname} &mdash;
                            </p>
                            <p className={`mt-3 text-xs leading-relaxed ${config.cardSubText}`}>
                                {groom.bio || `Putra pertama dari pasangan ${groom.father} & ${groom.mother}`}
                            </p>
                            {groom.instagram && (
                                <a
                                    href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-4 inline-flex items-center gap-1.5 rounded-full border ${config.accentBorder} px-3 py-1 text-[11px] ${config.accentText} transition hover:shadow-xs active:scale-95`}
                                >
                                    <InstagramIcon size={12} />
                                    <span>@{groom.instagram.replace('@', '')}</span>
                                </a>
                            )}
                        </motion.div>

                        <div className="my-6 flex items-center justify-center">
                            <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${config.accentBorder} ${config.cardBg} font-serif text-lg italic ${config.accentText} shadow-sm`}>
                                &
                            </span>
                        </div>

                        {/* Bride Card */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`rounded-3xl border ${config.cardBorder} ${config.cardBg} p-6 shadow-sm backdrop-blur-sm`}
                        >
                            <div className="relative mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full border-2 border-white/80 shadow-md">
                                <img
                                    src={bridePhoto}
                                    alt={brideFullName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className={`font-serif text-xl font-medium ${config.cardTitleText}`}>
                                {brideFullName}
                            </h3>
                            <p className={`mt-1 text-xs font-serif italic ${config.accentText}`}>
                                &mdash; {brideNickname} &mdash;
                            </p>
                            <p className={`mt-3 text-xs leading-relaxed ${config.cardSubText}`}>
                                {bride.bio || `Putri bungsu dari pasangan ${bride.father} & ${bride.mother}`}
                            </p>
                            {bride.instagram && (
                                <a
                                    href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-4 inline-flex items-center gap-1.5 rounded-full border ${config.accentBorder} px-3 py-1 text-[11px] ${config.accentText} transition hover:shadow-xs active:scale-95`}
                                >
                                    <InstagramIcon size={12} />
                                    <span>@{bride.instagram.replace('@', '')}</span>
                                </a>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 5. SECTION: ACARA (AKAD & RESEPSI)                         */}
                {/* ========================================================== */}
                <section id="section-event" className={`relative ${config.sectionAltBg} px-6 py-20 text-center`}>
                    {config.renderCorner({ position: 'top-left', size: 50, className: 'left-3 top-3' })}
                    {config.renderCorner({ position: 'bottom-right', size: 50, className: 'bottom-3 right-3' })}

                    <div className="relative z-10 mx-auto max-w-md">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>
                            Rangkaian Acara
                        </span>
                        <h2 className={`mt-2 font-serif text-2xl font-medium tracking-tight ${config.cardTitleText} sm:text-3xl`}>
                            Waktu & Tempat
                        </h2>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        {/* Akad Nikah */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`rounded-3xl border ${config.cardBorder} ${config.cardBg} p-6 shadow-sm backdrop-blur-sm`}
                        >
                            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${config.accentBg} text-white shadow-md`}>
                                <Sparkles size={20} />
                            </div>
                            <h3 className={`mt-4 font-serif text-xl font-medium ${config.cardTitleText}`}>
                                {schedules.akad?.title || 'Akad Nikah'}
                            </h3>
                            <div className="mt-4 flex flex-col items-center gap-2 text-xs">
                                <div className={`flex items-center gap-2 ${config.accentText} font-medium`}>
                                    <CalendarIcon size={14} />
                                    <span>{schedules.akad?.date || primaryDate}</span>
                                </div>
                                <div className={`flex items-center gap-2 ${config.cardSubText}`}>
                                    <Clock size={14} />
                                    <span>{schedules.akad?.time || '08:00 - 10:00 WIB'}</span>
                                </div>
                            </div>

                            <div className={`my-4 border-t border-dashed ${config.cardBorder}`} />

                            <p className={`font-serif text-sm font-medium ${config.cardTitleText}`}>
                                {schedules.akad?.location}
                            </p>
                            <p className={`mt-1 text-xs leading-relaxed ${config.cardSubText}`}>
                                {schedules.akad?.address}
                            </p>

                            {schedules.akad?.mapsUrl && (
                                <a
                                    href={schedules.akad.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-5 inline-flex items-center gap-2 rounded-xl ${config.buttonPrimary} px-5 py-2.5 text-xs font-semibold shadow-sm transition active:scale-95`}
                                >
                                    <MapPin size={13} />
                                    <span>Petunjuk Lokasi (Google Maps)</span>
                                </a>
                            )}
                        </motion.div>

                        {/* Resepsi */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`mt-6 rounded-3xl border ${config.cardBorder} ${config.cardBg} p-6 shadow-sm backdrop-blur-sm`}
                        >
                            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${config.accentBg} text-white shadow-md`}>
                                <Heart size={20} />
                            </div>
                            <h3 className={`mt-4 font-serif text-xl font-medium ${config.cardTitleText}`}>
                                {schedules.resepsi?.title || 'Resepsi Pernikahan'}
                            </h3>
                            <div className="mt-4 flex flex-col items-center gap-2 text-xs">
                                <div className={`flex items-center gap-2 ${config.accentText} font-medium`}>
                                    <CalendarIcon size={14} />
                                    <span>{schedules.resepsi?.date || primaryDate}</span>
                                </div>
                                <div className={`flex items-center gap-2 ${config.cardSubText}`}>
                                    <Clock size={14} />
                                    <span>{schedules.resepsi?.time || '11:00 - 14:00 WIB'}</span>
                                </div>
                            </div>

                            <div className={`my-4 border-t border-dashed ${config.cardBorder}`} />

                            <p className={`font-serif text-sm font-medium ${config.cardTitleText}`}>
                                {schedules.resepsi?.location}
                            </p>
                            <p className={`mt-1 text-xs leading-relaxed ${config.cardSubText}`}>
                                {schedules.resepsi?.address}
                            </p>

                            {schedules.resepsi?.mapsUrl && (
                                <a
                                    href={schedules.resepsi.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-5 inline-flex items-center gap-2 rounded-xl ${config.buttonPrimary} px-5 py-2.5 text-xs font-semibold shadow-sm transition active:scale-95`}
                                >
                                    <MapPin size={13} />
                                    <span>Petunjuk Lokasi (Google Maps)</span>
                                </a>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 6. SECTION: KISAH CINTA (OUR STORY)                         */}
                {/* ========================================================== */}
                <section id="section-story" className="relative px-6 py-20 text-center">
                    <div className="relative z-10 mx-auto max-w-md">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>
                            Kisah Kasih
                        </span>
                        <h2 className={`mt-2 font-serif text-2xl font-medium tracking-tight ${config.cardTitleText} sm:text-3xl`}>
                            Cerita Cinta Kami
                        </h2>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        <div className="space-y-4">
                            {stories.map((story: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`rounded-2xl border ${config.cardBorder} ${config.cardBg} p-5 text-left shadow-sm backdrop-blur-sm`}
                                >
                                    <span className={`inline-block rounded-full ${config.accentBg} px-3 py-1 font-mono text-[10px] font-bold text-white`}>
                                        {story.year}
                                    </span>
                                    <h4 className={`mt-2 font-serif text-base font-medium ${config.cardTitleText}`}>
                                        {story.title}
                                    </h4>
                                    <p className={`mt-1 text-xs leading-relaxed ${config.cardSubText}`}>
                                        {story.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 7. SECTION: GALERI FOTO                                    */}
                {/* ========================================================== */}
                <section id="section-gallery" className={`relative ${config.sectionAltBg} px-6 py-20 text-center`}>
                    <div className="relative z-10 mx-auto max-w-md">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>
                            Momen Bahagia
                        </span>
                        <h2 className={`mt-2 font-serif text-2xl font-medium tracking-tight ${config.cardTitleText} sm:text-3xl`}>
                            Galeri Foto
                        </h2>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {galleries.map((item: any, idx: number) => (
                                <motion.div
                                    key={item.id || idx}
                                    variants={scaleIn}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    onClick={() => setSelectedPhoto(resolveImageUrl(item.url, '/assets/wedding/hero-floral.png'))}
                                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 ${config.cardBorder} bg-white/40 shadow-sm transition hover:scale-105 hover:shadow-md`}
                                >
                                    <img
                                        src={resolveImageUrl(item.url, '/assets/wedding/hero-floral.png')}
                                        alt={item.caption || `Galeri ${idx + 1}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                        <ImageIcon size={20} className="text-white" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedPhoto && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPhoto(null)}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                        >
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="absolute right-6 top-6 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
                            >
                                <X size={20} />
                            </button>
                            <img
                                src={selectedPhoto}
                                alt="Pratinjau Foto"
                                className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ========================================================== */}
                {/* 8. SECTION: HADIAH DIGITAL (AMPLOP DIGITAL)                */}
                {/* ========================================================== */}
                <section id="section-gift" className="relative px-6 py-20 text-center">
                    <div className="relative z-10 mx-auto max-w-md">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>
                            Tanda Kasih
                        </span>
                        <h2 className={`mt-2 font-serif text-2xl font-medium tracking-tight ${config.cardTitleText} sm:text-3xl`}>
                            Kado & Amplop Digital
                        </h2>
                        <p className={`mx-auto mt-2 max-w-xs text-xs leading-relaxed ${config.cardSubText}`}>
                            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih:
                        </p>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        <div className="space-y-4">
                            {bankAccounts.map((account: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`rounded-2xl border ${config.cardBorder} ${config.cardBg} p-5 shadow-sm backdrop-blur-sm`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-serif text-sm font-semibold ${config.cardTitleText}`}>
                                            {account.bank}
                                        </span>
                                        <Gift size={16} className={config.accentText} />
                                    </div>
                                    <p className={`mt-3 font-mono text-base font-semibold tracking-wider ${config.cardTitleText}`}>
                                        {account.accountNumber}
                                    </p>
                                    <p className={`text-xs ${config.cardSubText}`}>
                                        a.n. {account.accountName}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(account.accountNumber, `bank-${idx}`)}
                                        className={`mt-4 inline-flex items-center gap-1.5 rounded-xl border ${config.accentBorder} ${config.containerBg} px-4 py-2 text-xs font-semibold ${config.accentText} transition hover:shadow-xs active:scale-95`}
                                    >
                                        {copiedAccount === `bank-${idx}` ? (
                                            <>
                                                <Check size={13} className="text-emerald-600" />
                                                <span>Berhasil Disalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>Salin No. Rekening</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 9. SECTION: RSVP & UCAPAN (GUESTBOOK)                       */}
                {/* ========================================================== */}
                <section id="section-rsvp" className={`relative ${config.sectionAltBg} px-6 py-20 text-center`}>
                    <div className="relative z-10 mx-auto max-w-md">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${config.accentText}`}>
                            Konfirmasi Kehadiran
                        </span>
                        <h2 className={`mt-2 font-serif text-2xl font-medium tracking-tight ${config.cardTitleText} sm:text-3xl`}>
                            RSVP & Ucapan Doa
                        </h2>

                        <div className="my-6">
                            {config.renderDivider()}
                        </div>

                        {/* RSVP Form */}
                        <form
                            onSubmit={handleRsvpSubmit}
                            className={`rounded-3xl border ${config.cardBorder} ${config.cardBg} p-6 text-left shadow-sm backdrop-blur-sm`}
                        >
                            <div className="mb-4">
                                <label className={`block text-xs font-medium ${config.cardTitleText}`}>
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={rsvpName}
                                    onChange={(e) => setRsvpName(e.target.value)}
                                    placeholder="Nama Anda"
                                    className={`mt-1.5 w-full rounded-xl border ${config.cardBorder} bg-white/70 px-4 py-2.5 text-xs ${config.cardTitleText} focus:outline-none focus:ring-2 focus:ring-current`}
                                />
                            </div>

                            <div className="mb-4">
                                <label className={`block text-xs font-medium ${config.cardTitleText}`}>
                                    Konfirmasi Kehadiran
                                </label>
                                <select
                                    value={rsvpStatus}
                                    onChange={(e: any) => setRsvpStatus(e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${config.cardBorder} bg-white/70 px-4 py-2.5 text-xs ${config.cardTitleText} focus:outline-none focus:ring-2 focus:ring-current`}
                                >
                                    <option value="hadir">Akan Hadir</option>
                                    <option value="ragu">Masih Ragu</option>
                                    <option value="tidak_hadir">Tidak Dapat Hadir</option>
                                </select>
                            </div>

                            <div className="mb-5">
                                <label className={`block text-xs font-medium ${config.cardTitleText}`}>
                                    Ucapan & Doa Restu
                                </label>
                                <textarea
                                    rows={3}
                                    value={rsvpMessage}
                                    onChange={(e) => setRsvpMessage(e.target.value)}
                                    placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                                    className={`mt-1.5 w-full rounded-xl border ${config.cardBorder} bg-white/70 px-4 py-2.5 text-xs ${config.cardTitleText} focus:outline-none focus:ring-2 focus:ring-current`}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingRsvp}
                                className={`w-full rounded-xl ${config.buttonPrimary} py-3 text-xs font-semibold shadow-sm transition active:scale-95 flex items-center justify-center gap-2`}
                            >
                                <MessageSquare size={14} />
                                <span>{isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi & Ucapan'}</span>
                            </button>

                            {rsvpSubmitted && (
                                <p className="mt-3 text-center text-xs font-semibold text-emerald-600">
                                    ✓ Terima kasih atas konfirmasi dan ucapan Anda!
                                </p>
                            )}
                        </form>

                        {/* Wishes List */}
                        <div id="section-wishes" className="mx-auto mt-10 max-w-sm text-left">
                            <h4 className={`mb-4 flex items-center gap-2 font-serif text-sm font-semibold ${config.cardTitleText}`}>
                                <MessageCircle size={15} className={config.accentText} />
                                <span>Doa & Harapan ({localWishes.length})</span>
                            </h4>

                            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                                {localWishes.map((w: any) => (
                                    <div
                                        key={w.id}
                                        className={`rounded-2xl border ${config.cardBorder} ${config.cardBg} p-4 shadow-2xs backdrop-blur-sm`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`font-serif text-xs font-semibold ${config.cardTitleText}`}>
                                                {w.name}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                                                w.rsvpStatus === 'hadir'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {w.rsvpStatus === 'hadir' ? 'Hadir' : 'Belum Pasti'}
                                            </span>
                                        </div>
                                        <p className={`mt-2 text-xs leading-relaxed ${config.cardSubText}`}>
                                            {w.message}
                                        </p>
                                        <p className={`mt-1.5 text-[10px] ${config.cardSubText} opacity-70`}>
                                            {w.createdAt ? new Date(w.createdAt).toLocaleDateString('id-ID') : 'Baru saja'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 10. SECTION: PROTOKOL KESEHATAN & PENUTUP                  */}
                {/* ========================================================== */}
                <section className="relative px-6 py-16 text-center">
                    <div className="relative z-10 mx-auto max-w-md">
                        <p className={`font-serif text-sm leading-relaxed italic ${config.cardSubText}`}>
                            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                        </p>
                        <p className={`mt-6 font-serif text-sm uppercase tracking-widest ${config.accentText}`}>
                            Kami yang berbahagia,
                        </p>
                        <h3 className={`mt-2 font-serif text-2xl font-medium ${config.cardTitleText}`}>
                            {groomNickname} & {brideNickname}
                        </h3>
                        <p className={`mt-1 text-xs ${config.cardSubText}`}>
                            Beserta segenap keluarga besar
                        </p>

                        <div className={`mt-12 border-t ${config.cardBorder} pt-6 text-[10px] ${config.cardSubText} opacity-70`}>
                            <p>Undangan Pernikahan Digital Online &bull; Ngaturi</p>
                            <p className="mt-1">&copy; 2026 Ngaturi. All Rights Reserved.</p>
                        </div>
                    </div>
                </section>

                {/* Padding for dock */}
                <div className="h-24" />

                {/* ========================================================== */}
                {/* 11. BOTTOM SCROLLSPY DOCK NAVIGATION                       */}
                {/* ========================================================== */}
                {isOpened && (
                    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
                        <nav className={`pointer-events-auto flex items-center gap-1 rounded-full border ${config.dockBorder} ${config.dockBg} px-3 py-2 shadow-xl backdrop-blur-md`}>
                            <button
                                onClick={() => scrollTo('section-cover')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    activeSection === 'section-cover'
                                        ? `${config.dockActiveBg} ${config.dockActiveText} font-semibold`
                                        : `${config.dockText} hover:${config.dockActiveText}`
                                }`}
                            >
                                <Heart size={13} />
                                <span className="hidden sm:inline">Sampul</span>
                            </button>
                            <button
                                onClick={() => scrollTo('section-couple')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    activeSection === 'section-couple'
                                        ? `${config.dockActiveBg} ${config.dockActiveText} font-semibold`
                                        : `${config.dockText} hover:${config.dockActiveText}`
                                }`}
                            >
                                <User size={13} />
                                <span className="hidden sm:inline">Mempelai</span>
                            </button>
                            <button
                                onClick={() => scrollTo('section-event')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    activeSection === 'section-event'
                                        ? `${config.dockActiveBg} ${config.dockActiveText} font-semibold`
                                        : `${config.dockText} hover:${config.dockActiveText}`
                                }`}
                            >
                                <CalendarIcon size={13} />
                                <span className="hidden sm:inline">Acara</span>
                            </button>
                            <button
                                onClick={() => scrollTo('section-gallery')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    activeSection === 'section-gallery'
                                        ? `${config.dockActiveBg} ${config.dockActiveText} font-semibold`
                                        : `${config.dockText} hover:${config.dockActiveText}`
                                }`}
                            >
                                <ImageIcon size={13} />
                                <span className="hidden sm:inline">Galeri</span>
                            </button>
                            <button
                                onClick={() => scrollTo('section-rsvp')}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                    activeSection === 'section-rsvp'
                                        ? `${config.dockActiveBg} ${config.dockActiveText} font-semibold`
                                        : `${config.dockText} hover:${config.dockActiveText}`
                                }`}
                            >
                                <MessageSquare size={13} />
                                <span className="hidden sm:inline">Ucapan</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BaseBasicTheme;
