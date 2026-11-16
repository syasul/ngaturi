import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Check,
    Clock,
    Copy,
    Crown,
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

// Imperial Emerald Gold Corner Ornament
const EmeraldCorner = ({
    position = 'top-left',
    color = '#C8A34A',
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
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none absolute select-none ${className}`}
            style={{ transform: transforms[position] }}
        >
            <path
                d="M4 74 V14 C4 8.48 8.48 4 14 4 H74"
                stroke={color}
                strokeWidth="1.8"
                strokeOpacity="0.5"
            />
            <path
                d="M12 66 V18 C12 14.69 14.69 12 18 12 H66"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.3"
            />
            {/* Diamond filigree */}
            <polygon points="14,14 20,8 26,14 20,20" fill={color} fillOpacity="0.6" />
            <circle cx="14" cy="32" r="2" fill={color} fillOpacity="0.5" />
            <circle cx="32" cy="14" r="2" fill={color} fillOpacity="0.5" />
            <path d="M26 26 L36 36" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
        </svg>
    );
};

// Royal Emerald Divider
const EmeraldDivider = ({
    color = '#C8A34A',
    className = '',
}: {
    color?: string;
    className?: string;
}) => (
    <div className={`flex items-center justify-center gap-3 py-4 ${className}`}>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, transparent, ${color})`,
            }}
        />
        <div className="flex items-center gap-1.5 text-[#C8A34A]">
            <Crown size={14} className="opacity-80" />
        </div>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
        />
    </div>
);

export interface BasicTheme9Props extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}

export const BasicTheme9: React.FC<BasicTheme9Props> = ({
    data,
    photos = [],
    guestName,
    isOpened: externalIsOpened,
    onOpen: externalOnOpen,
    isPlayingMusic: externalIsPlayingMusic,
    setIsPlayingMusic: externalSetIsPlayingMusic,
    onRsvpSubmit,
}) => {
    const groom = data?.groom || {
        name: 'Arya Pratama, S.T.',
        nickname: 'Arya',
        father: 'Bpk. Bambang Pratama',
        mother: 'Ibu Ratna Dewi',
        instagram: 'aryapratama',
        bio: 'Putra pertama dari keluarga Bpk. Bambang Pratama & Ibu Ratna Dewi',
    };

    const bride = data?.bride || {
        name: 'Nabila Putri Larasati, S.I.Kom',
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
            location: 'Grand Emerald Palace Mosque',
            address: 'Jl. Mahkota Hijau No. 1, Jawa Barat',
            mapsUrl: 'https://maps.google.com',
        },
        resepsi: {
            title: 'Resepsi Pernikahan',
            date: 'Sabtu, 24 Oktober 2026',
            time: '11:00 - 14:00 WIB',
            location: 'The Royal Emerald Ballroom',
            address: 'Jl. Puri Kemuning No. 18, Jawa Barat',
            mapsUrl: 'https://maps.google.com',
        },
    };

    const galleries = data?.galleries?.length
        ? data.galleries
        : [
              {
                  id: '1',
                  url: '/assets/wedding/couple-royal.png',
                  caption: 'Keanggunan Dalam Setiap Tatap',
              },
              {
                  id: '2',
                  url: '/assets/wedding/couple-foliage.png',
                  caption: 'Ikrar Suci Kemuliaan',
              },
              {
                  id: '3',
                  url: '/assets/wedding/hero-floral.png',
                  caption: 'Langkah Awal Bersama',
              },
              {
                  id: '4',
                  url: '/assets/wedding/couple-rustic.png',
                  caption: 'Tersenyum Menatap Esok',
              },
              {
                  id: '5',
                  url: '/assets/wedding/couple-royal.png',
                  caption: 'Bahagia Dalam Ridho Illahi',
              },
              {
                  id: '6',
                  url: '/assets/wedding/couple-foliage.png',
                  caption: 'Dua Hati Satu Tujuan',
              },
          ];

    const stories = data?.stories?.length
        ? data.stories
        : [
              {
                  year: '2021',
                  title: 'Awal Pertemuan Indah',
                  content:
                      'Takdir mempertemukan kami dalam sebuah seminar kepemimpinan yang mengawali diskusi panjang berharga.',
              },
              {
                  year: '2023',
                  title: 'Komitmen Mulia',
                  content:
                      'Saling menyelaraskan visi dan nilai kehidupan untuk melangkah bersama dalam ketulusan.',
              },
              {
                  year: '2026',
                  title: 'Pernikahan Agung',
                  content:
                      'Atas izin Allah SWT dan doa restu kedua keluarga terkasih, kami menyempurnakan separuh agama kami.',
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
                  name: 'Dr. Ilham Saputra',
                  message:
                      'Selamat atas pernikahan ananda Arya & Nabila. Semoga menjadi keluarga sakinah, mawaddah, warahmah yang selalu dinaungi keberkahan.',
                  createdAt: '1 jam yang lalu',
                  rsvpStatus: 'hadir',
              },
              {
                  id: '2',
                  name: 'Anisa Rahmawati',
                  message:
                      'Barakallah Nabila sayang! Semoga bahagia selalu, acaranya lancar dari awal hingga akhir.',
                  createdAt: '2 jam yang lalu',
                  rsvpStatus: 'hadir',
              },
          ];

    const customStyle = data?.customStyle || {};
    const groomFullName = groom.name;
    const brideFullName = bride.name;
    const groomNickname = groom.nickname || 'Arya';
    const brideNickname = bride.nickname || 'Nabila';

    const primaryDate =
        schedules.akad?.date ||
        schedules.resepsi?.date ||
        'Sabtu, 24 Oktober 2026';

    const sections = data?.sections || {};
    const showQuotes = sections.showQuotes !== false;
    const showStory = sections.showStory !== false;
    const showGallery = sections.showGallery !== false;
    const showGift = sections.showGift !== false;
    const showRsvp = sections.showRsvp !== false;
    const showWishes = sections.showWishes !== false;


    const resolveImageUrl = (path?: string, fallback = '') => {
        if (!path) return fallback;
        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('/')
        ) {
            return path;
        }
        return `/${path}`;
    };

    // Envelope state
    const [isOpened, setIsOpened] = useState(externalIsOpened ?? false);
    useEffect(() => {
        if (externalIsOpened !== undefined) {
            setIsOpened(externalIsOpened);
        }
    }, [externalIsOpened]);

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
            document.getElementById('basic9-scroll-container');
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
            document.getElementById('basic9-scroll-container');
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
            {/* LEFT PANEL: DESKTOP SHOWCASE (Emerald Royal)                   */}
            {/* ============================================================== */}
            <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden bg-[#0A241C] p-12 text-[#F1F7F4] lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 contrast-125"
                    style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061712] via-[#0A241C]/85 to-transparent" />

                <EmeraldCorner position="top-left" color="#C8A34A" size={80} className="left-8 top-8" />
                <EmeraldCorner position="bottom-right" color="#C8A34A" size={80} className="bottom-8 right-8" />

                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A34A]/40 bg-white/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[#E8D49E] backdrop-blur-md">
                        <Crown size={12} className="text-[#C8A34A]" /> The Royal Emerald
                    </span>
                </div>

                <div className="relative z-10 my-auto max-w-xl py-12">
                    <p className="font-serif text-sm tracking-[0.3em] uppercase text-[#E8D49E]/80">
                        The Royal Wedding of
                    </p>
                    <h1 className="mt-4 font-serif text-6xl font-light tracking-tight text-[#F1F7F4] xl:text-7xl">
                        {groomNickname} <span className="font-serif italic text-[#C8A34A]">&</span> {brideNickname}
                    </h1>
                    <p className="mt-6 text-sm leading-relaxed text-[#F1F7F4]/70">
                        {primaryDate} &bull; {schedules.akad?.location || 'Jawa Barat'}
                    </p>
                    <div className="mt-8 flex items-center gap-6">
                        <div className="rounded-xl border border-[#C8A34A]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#E8D49E]">{timeLeft.days}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#F1F7F4]/60">Hari</p>
                        </div>
                        <div className="rounded-xl border border-[#C8A34A]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#E8D49E]">{timeLeft.hours}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#F1F7F4]/60">Jam</p>
                        </div>
                        <div className="rounded-xl border border-[#C8A34A]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#E8D49E]">{timeLeft.minutes}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#F1F7F4]/60">Menit</p>
                        </div>
                        <div className="rounded-xl border border-[#C8A34A]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#E8D49E]">{timeLeft.seconds}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#F1F7F4]/60">Detik</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-[#F1F7F4]/50">
                    <p>&copy; 2026 Ngaturi &bull; Royal Emerald Edition</p>
                    <p className="font-mono text-[11px] tracking-wider text-[#E8D49E]/70">#AryaNabilaRoyal</p>
                </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT PANEL: MOBILE-OPTIMIZED INVITATION CONTAINER             */}
            {/* ============================================================== */}
            <div
                ref={containerRef}
                id="basic9-scroll-container"
                className="relative h-screen w-full flex-1 overflow-y-auto bg-[#F1F7F4] text-[#0A241C] shadow-2xl lg:max-w-[480px] xl:max-w-[500px]"
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
                        className="fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A34A]/40 bg-[#F1F7F4]/90 text-[#0F4435] shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
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
                            key="cover-envelope-9"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -60, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
                            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#F1F7F4] p-8 text-center"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-15"
                                style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#F1F7F4]/95 via-[#F1F7F4]/80 to-[#F1F7F4]" />

                            <EmeraldCorner position="top-left" color="#C8A34A" size={70} className="left-4 top-4" />
                            <EmeraldCorner position="top-right" color="#C8A34A" size={70} className="right-4 top-4" />
                            <EmeraldCorner position="bottom-left" color="#C8A34A" size={70} className="bottom-4 left-4" />
                            <EmeraldCorner position="bottom-right" color="#C8A34A" size={70} className="bottom-4 right-4" />

                            <div className="relative z-10 mt-8">
                                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#0F4435]/80">
                                    Undangan Pernikahan
                                </span>
                            </div>

                            <div className="relative z-10 my-auto flex flex-col items-center">
                                {/* Monogram */}
                                <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-[#C8A34A]/40 bg-white/80 shadow-md">
                                    <div className="text-center font-serif text-2xl font-light text-[#0A241C]">
                                        <span>{groomNickname[0]}</span>
                                        <span className="italic text-[#C8A34A]">&</span>
                                        <span>{brideNickname[0]}</span>
                                    </div>
                                </div>

                                <p className="font-serif text-sm tracking-[0.25em] uppercase text-[#0F4435]/80">
                                    The Royal Wedding of
                                </p>
                                <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-[#0A241C] sm:text-5xl">
                                    {groomNickname} <span className="font-serif italic text-[#C8A34A]">&</span> {brideNickname}
                                </h1>

                                <div className="mt-8 rounded-2xl border border-[#C8A34A]/30 bg-white/85 px-6 py-4 shadow-sm backdrop-blur-sm max-w-xs w-full">
                                    <p className="text-[11px] text-[#0F4435]/80 uppercase tracking-widest">
                                        Kepada Yth. Bapak/Ibu/Saudara/i:
                                    </p>
                                    <p className="mt-1 font-serif text-lg font-medium text-[#0A241C]">
                                        {guestName || 'Tamu Undangan'}
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#0F4435]/70 italic">
                                        *Mohon maaf bila ada kesalahan penulisan nama/gelar
                                    </p>
                                </div>

                                <button
                                    onClick={handleOpen}
                                    className="group relative mt-8 flex items-center gap-2.5 overflow-hidden rounded-full bg-[#0F4435] px-8 py-3.5 text-xs font-semibold tracking-wider uppercase text-[#E8D49E] shadow-lg shadow-[#0F4435]/30 transition-all hover:bg-[#07241C] active:scale-95"
                                >
                                    <Heart size={14} className="transition-transform group-hover:scale-125 text-[#C8A34A]" />
                                    <span>Buka Undangan</span>
                                </button>
                            </div>

                            <div className="relative z-10 mb-4 text-[10px] tracking-widest uppercase text-[#0F4435]/70">
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
                    <EmeraldCorner position="top-left" color="#C8A34A" size={60} className="left-4 top-4" />
                    <EmeraldCorner position="top-right" color="#C8A34A" size={60} className="right-4 top-4" />

                    <div className="relative z-10 pt-4">
                        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                            Walimatul Ursy
                        </span>
                    </div>

                    <div className="relative z-10 my-auto flex w-full flex-col items-center">
                        <div className="relative mb-6 h-64 w-48 overflow-hidden rounded-[80px_80px_20px_20px] border-4 border-white shadow-xl">
                            <img
                                src={coupleHeroPhoto}
                                alt="Mempelai"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        </div>

                        <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#0F4435]/80">
                            The Marriage of
                        </p>
                        <h2 className="mt-2 font-serif text-4xl font-normal text-[#0A241C] sm:text-5xl">
                            {groomNickname} <span className="font-serif italic text-[#C8A34A]">&</span> {brideNickname}
                        </h2>

                        <p className="mt-4 text-xs font-medium tracking-widest text-[#0F4435]">
                            {primaryDate}
                        </p>

                        <EmeraldDivider color="#C8A34A" className="my-2" />

                        {/* Live Countdown Grid */}
                        <div className="grid grid-cols-4 gap-2.5 pt-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#C8A34A]/25 bg-white/80 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#0A241C]">{timeLeft.days}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#0F4435]/80">Hari</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#C8A34A]/25 bg-white/80 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#0A241C]">{timeLeft.hours}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#0F4435]/80">Jam</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#C8A34A]/25 bg-white/80 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#0A241C]">{timeLeft.minutes}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#0F4435]/80">Menit</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#C8A34A]/25 bg-white/80 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#0A241C]">{timeLeft.seconds}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#0F4435]/80">Detik</span>
                            </div>
                        </div>

                        <a
                            href={createGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#C8A34A]/35 bg-white/70 px-5 py-2 text-[11px] font-medium text-[#0F4435] shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                        >
                            <CalendarIcon size={13} />
                            <span>Simpan ke Google Calendar</span>
                        </a>
                    </div>

                    <div className="relative z-10 animate-bounce pb-2 text-[#0F4435]/70">
                        <span className="text-[10px] uppercase tracking-widest">&darr; Gulir ke Bawah</span>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 3. SECTION: AYAT SUCI (CONTRAST BANNER: DEEP EMERALD NOIR) */}
                {/* ========================================================== */}
                                {showQuotes && (
                    <section className="relative overflow-hidden bg-[#0A241C] px-8 py-16 text-center text-[#F1F7F4]">
                    <EmeraldCorner position="top-left" color="#C8A34A" size={54} className="left-4 top-4" />
                    <EmeraldCorner position="bottom-right" color="#C8A34A" size={54} className="bottom-4 right-4" />

                    <div className="relative z-10 mx-auto max-w-sm">
                        <svg className="mx-auto mb-4 h-8 w-8 text-[#E8D49E]/70" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        <p className="font-serif text-sm leading-relaxed text-[#F1F7F4]/90 italic sm:text-base">
                            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
                        </p>
                        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#E8D49E]">
                            &bull; Q.S. Ar-Rum: 21 &bull;
                        </p>
                    </div>
                </section>
                )}

                {/* ========================================================== */}
                {/* 4. SECTION: MEMPELAI (BRIDE & GROOM)                       */}
                {/* ========================================================== */}
                <section id="section-couple" className="relative px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                        Assalamu&apos;alaikum Wr. Wb.
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#0A241C]">
                        Kedua Mempelai
                    </h2>
                    <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-[#0F4435]/80">
                        Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Izinkan kami memperkenalkan kedua calon mempelai:
                    </p>

                    <EmeraldDivider color="#C8A34A" className="my-6" />

                    {/* Mempelai Pria */}
                    <div className="relative mx-auto mt-6 max-w-xs rounded-3xl border border-[#C8A34A]/25 bg-white/80 p-6 shadow-sm">
                        <div className="relative mx-auto mb-4 h-44 w-36 overflow-hidden rounded-[40px] border-2 border-[#C8A34A]/40 shadow-md">
                            <img
                                src={groomPhoto}
                                alt={groomFullName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-medium text-[#0A241C]">
                            {groomFullName}
                        </h3>
                        <p className="mt-2 text-xs text-[#0F4435]/80">
                            {groom.bio || `Putra dari ${groom.father} & ${groom.mother}`}
                        </p>
                        {groom.instagram && (
                            <a
                                href={`https://instagram.com/${groom.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C8A34A]/30 bg-[#F1F7F4] px-4 py-1.5 text-xs text-[#0F4435] transition-colors hover:bg-[#0F4435] hover:text-[#E8D49E]"
                            >
                                <InstagramIcon size={12} />
                                <span>@{groom.instagram}</span>
                            </a>
                        )}
                    </div>

                    <div className="my-6 font-serif text-3xl italic text-[#C8A34A]">&amp;</div>

                    {/* Mempelai Wanita */}
                    <div className="relative mx-auto max-w-xs rounded-3xl border border-[#C8A34A]/25 bg-white/80 p-6 shadow-sm">
                        <div className="relative mx-auto mb-4 h-44 w-36 overflow-hidden rounded-[40px] border-2 border-[#C8A34A]/40 shadow-md">
                            <img
                                src={bridePhoto}
                                alt={brideFullName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-medium text-[#0A241C]">
                            {brideFullName}
                        </h3>
                        <p className="mt-2 text-xs text-[#0F4435]/80">
                            {bride.bio || `Putri dari ${bride.father} & ${bride.mother}`}
                        </p>
                        {bride.instagram && (
                            <a
                                href={`https://instagram.com/${bride.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C8A34A]/30 bg-[#F1F7F4] px-4 py-1.5 text-xs text-[#0F4435] transition-colors hover:bg-[#0F4435] hover:text-[#E8D49E]"
                            >
                                <InstagramIcon size={12} />
                                <span>@{bride.instagram}</span>
                            </a>
                        )}
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 5. SECTION: ACARA (EVENT SCHEDULE)                          */}
                {/* ========================================================== */}
                <section id="section-event" className="relative bg-[#E6EFEA] px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                        Waktu &amp; Tempat
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#0A241C]">
                        Agenda Pernikahan
                    </h2>

                    <EmeraldDivider color="#C8A34A" className="my-6" />

                    <div className="space-y-6">
                        {/* Akad Card */}
                        {schedules.akad && (
                            <div className="relative mx-auto max-w-sm rounded-3xl border border-[#C8A34A]/30 bg-white/95 p-6 text-left shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#C8A34A]/20 pb-3">
                                    <h3 className="font-serif text-xl font-semibold text-[#0A241C]">
                                        {schedules.akad.title}
                                    </h3>
                                    <span className="rounded-full bg-[#0F4435]/15 px-3 py-1 font-mono text-[10px] font-medium text-[#0F4435]">
                                        Akad Nikah
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2.5 text-xs text-[#0A241C]">
                                    <div className="flex items-start gap-2.5">
                                        <CalendarIcon size={14} className="mt-0.5 text-[#0F4435]" />
                                        <span>{schedules.akad.date}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Clock size={14} className="mt-0.5 text-[#0F4435]" />
                                        <span>{schedules.akad.time}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin size={14} className="mt-0.5 text-[#0F4435]" />
                                        <div>
                                            <p className="font-medium text-[#0A241C]">{schedules.akad.location}</p>
                                            <p className="text-[11px] text-[#0F4435]/70">{schedules.akad.address}</p>
                                        </div>
                                    </div>
                                </div>
                                {schedules.akad.mapsUrl && (
                                    <a
                                        href={schedules.akad.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4435] py-2.5 text-xs font-medium text-[#E8D49E] shadow-sm transition-all hover:bg-[#07241C]"
                                    >
                                        <MapPin size={13} />
                                        <span>Petunjuk Arah Google Maps</span>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Resepsi Card */}
                        {schedules.resepsi && (
                            <div className="relative mx-auto max-w-sm rounded-3xl border border-[#C8A34A]/30 bg-white/95 p-6 text-left shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#C8A34A]/20 pb-3">
                                    <h3 className="font-serif text-xl font-semibold text-[#0A241C]">
                                        {schedules.resepsi.title}
                                    </h3>
                                    <span className="rounded-full bg-[#C8A34A]/20 px-3 py-1 font-mono text-[10px] font-medium text-[#0F4435]">
                                        Resepsi
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2.5 text-xs text-[#0A241C]">
                                    <div className="flex items-start gap-2.5">
                                        <CalendarIcon size={14} className="mt-0.5 text-[#0F4435]" />
                                        <span>{schedules.resepsi.date}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Clock size={14} className="mt-0.5 text-[#0F4435]" />
                                        <span>{schedules.resepsi.time}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin size={14} className="mt-0.5 text-[#0F4435]" />
                                        <div>
                                            <p className="font-medium text-[#0A241C]">{schedules.resepsi.location}</p>
                                            <p className="text-[11px] text-[#0F4435]/70">{schedules.resepsi.address}</p>
                                        </div>
                                    </div>
                                </div>
                                {schedules.resepsi.mapsUrl && (
                                    <a
                                        href={schedules.resepsi.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4435] py-2.5 text-xs font-medium text-[#E8D49E] shadow-sm transition-all hover:bg-[#07241C]"
                                    >
                                        <MapPin size={13} />
                                        <span>Petunjuk Arah Google Maps</span>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 6. SECTION: LOVE STORY                                     */}
                {/* ========================================================== */}
                                {showStory && stories && stories.length > 0 && (
                    <section id="section-story" className="relative px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                        Untaian Kisah
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#0A241C]">
                        Kisah Kasih
                    </h2>

                    <EmeraldDivider color="#C8A34A" className="my-6" />

                    <div className="relative mx-auto max-w-sm space-y-6 text-left">
                        <div className="absolute bottom-4 left-4 top-4 w-[2px] bg-[#C8A34A]/30" />
                        {stories.map((story: any, idx: number) => (
                            <div key={idx} className="relative pl-10">
                                <div className="absolute left-2.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#C8A34A] bg-[#F1F7F4]" />
                                <span className="inline-block rounded-md bg-[#0F4435]/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0F4435]">
                                    {story.year}
                                </span>
                                <h4 className="mt-1 font-serif text-base font-medium text-[#0A241C]">
                                    {story.title}
                                </h4>
                                <p className="mt-1 text-xs leading-relaxed text-[#0F4435]/80">
                                    {story.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* ========================================================== */}
                {/* 7. SECTION: GALERI FOTO                                    */}
                {/* ========================================================== */}
                                {showGallery && galleries && galleries.length > 0 && (
                    <section id="section-gallery" className="relative bg-[#E6EFEA] px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                        Momen Berharga
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#0A241C]">
                        Galeri Anggun
                    </h2>

                    <EmeraldDivider color="#C8A34A" className="my-6" />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {galleries.map((img: any, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedPhoto(img.url)}
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 border-white shadow-sm transition-transform hover:scale-105"
                            >
                                <img
                                    src={resolveImageUrl(img.url)}
                                    alt={img.caption || `Galeri ${idx + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                                    <ImageIcon size={20} className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lightbox Modal */}
                    <AnimatePresence>
                        {selectedPhoto && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedPhoto(null)}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                            >
                                <div className="relative max-h-[85vh] max-w-md overflow-hidden rounded-2xl bg-white p-2">
                                    <button
                                        onClick={() => setSelectedPhoto(null)}
                                        className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                                    >
                                        <X size={16} />
                                    </button>
                                    <img
                                        src={resolveImageUrl(selectedPhoto)}
                                        alt="Preview"
                                        className="h-full w-full rounded-xl object-contain"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
                )}

                {/* ========================================================== */}
                {/* 8. SECTION: DIGITAL GIFT / TANDA KASIH                    */}
                {/* ========================================================== */}
                                {showGift && bankAccounts && bankAccounts.length > 0 && (
                    <section id="section-gift" className="relative px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                        Tanda Kasih
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#0A241C]">
                        Kado Pernikahan
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-xs text-[#0F4435]/80 leading-relaxed">
                        Doa restu Anda merupakan karunia terindah bagi kami. Namun apabila berkehendak memberikan tanda kasih berupa kado digital, dapat melalui:
                    </p>

                    <EmeraldDivider color="#C8A34A" className="my-6" />

                    <div className="space-y-4">
                        {bankAccounts.map((acc: any, idx: number) => (
                            <div
                                key={idx}
                                className="relative mx-auto max-w-xs rounded-2xl border border-[#C8A34A]/30 bg-white p-5 shadow-sm text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="rounded-md bg-[#0F4435]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#0F4435]">
                                        {acc.bank}
                                    </span>
                                    <Gift size={16} className="text-[#C8A34A]" />
                                </div>
                                <p className="mt-3 font-mono text-lg font-semibold tracking-wider text-[#0A241C]">
                                    {acc.accountNumber}
                                </p>
                                <p className="text-xs text-[#0F4435]/70">
                                    a.n {acc.accountName}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(acc.accountNumber, `acc-9-${idx}`)}
                                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#C8A34A]/35 bg-[#F1F7F4] py-2 text-xs font-medium text-[#0F4435] transition-colors hover:bg-[#0F4435] hover:text-[#E8D49E]"
                                >
                                    {copiedAccount === `acc-9-${idx}` ? (
                                        <>
                                            <Check size={13} className="text-green-600" />
                                            <span>Nomor Berhasil Disalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={13} />
                                            <span>Salin Nomor Rekening</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* ========================================================== */}
                {/* 9. SECTION: RSVP & WISHES                                  */}
                {/* ========================================================== */}
                                {(showRsvp || showWishes) && (
                    <section id="section-rsvp" className="relative bg-[#E6EFEA] px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0F4435]">
                        Konfirmasi Kehadiran
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#0A241C]">
                        RSVP &amp; Doa Restu
                    </h2>

                    <EmeraldDivider color="#C8A34A" className="my-6" />

                    {/* RSVP Form Card */}
                                        {showRsvp && (
                        <div className="relative mx-auto max-w-sm rounded-3xl border border-[#C8A34A]/30 bg-white p-6 shadow-sm text-left">
                        {rsvpSubmitted ? (
                            <div className="py-6 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#0F4435]">
                                    <Check size={24} />
                                </div>
                                <h4 className="font-serif text-lg font-semibold text-[#0A241C]">
                                    Terima Kasih atas Konfirmasinya!
                                </h4>
                                <p className="mt-1 text-xs text-[#0F4435]/80">
                                    Konfirmasi kehadiran Anda telah tercatat dengan baik.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleRsvpSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#0F4435]">
                                        Nama Anda
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={rsvpName}
                                        onChange={(e) => setRsvpName(e.target.value)}
                                        placeholder="Tuliskan nama lengkap..."
                                        className="mt-1.5 w-full rounded-xl border border-[#C8A34A]/30 bg-[#F1F7F4] px-3.5 py-2.5 text-xs text-[#0A241C] focus:border-[#0F4435] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#0F4435]">
                                        Konfirmasi Kehadiran
                                    </label>
                                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRsvpStatus('hadir')}
                                            className={`rounded-xl py-2 text-xs font-medium transition-all ${
                                                rsvpStatus === 'hadir'
                                                    ? 'bg-[#0F4435] text-[#E8D49E] shadow-sm'
                                                    : 'border border-[#C8A34A]/25 bg-[#F1F7F4] text-[#0F4435]'
                                            }`}
                                        >
                                            Hadir
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRsvpStatus('ragu')}
                                            className={`rounded-xl py-2 text-xs font-medium transition-all ${
                                                rsvpStatus === 'ragu'
                                                    ? 'bg-[#C8A34A] text-[#0A241C] shadow-sm'
                                                    : 'border border-[#C8A34A]/25 bg-[#F1F7F4] text-[#0F4435]'
                                            }`}
                                        >
                                            Ragu-ragu
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRsvpStatus('tidak_hadir')}
                                            className={`rounded-xl py-2 text-xs font-medium transition-all ${
                                                rsvpStatus === 'tidak_hadir'
                                                    ? 'bg-neutral-600 text-white shadow-sm'
                                                    : 'border border-[#C8A34A]/25 bg-[#F1F7F4] text-[#0F4435]'
                                            }`}
                                        >
                                            Tidak Hadir
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#0F4435]">
                                        Ucapan &amp; Doa
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={rsvpMessage}
                                        onChange={(e) => setRsvpMessage(e.target.value)}
                                        placeholder="Tuliskan ucapan selamat & doa restu..."
                                        className="mt-1.5 w-full rounded-xl border border-[#C8A34A]/30 bg-[#F1F7F4] px-3.5 py-2.5 text-xs text-[#0A241C] focus:border-[#0F4435] focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmittingRsvp}
                                    className="w-full rounded-xl bg-[#0F4435] py-3 text-xs font-semibold tracking-wider uppercase text-[#E8D49E] shadow-md transition-all hover:bg-[#07241C] active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmittingRsvp ? 'Mengirim...' : 'Kirim RSVP'}
                                </button>
                            </form>
                        )}
                    </div>
                    )}

                    {/* Wishes Guestbook List */}
                                        {showWishes && (
                        <div id="section-wishes" className="mx-auto mt-10 max-w-sm text-left">
                        <div className="flex items-center justify-between border-b border-[#C8A34A]/30 pb-2">
                            <h4 className="font-serif text-lg font-medium text-[#0A241C]">
                                Ucapan &amp; Doa ({localWishes.length})
                            </h4>
                            <MessageCircle size={16} className="text-[#0F4435]" />
                        </div>

                        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                            {localWishes.map((w: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-[#C8A34A]/20 bg-white/95 p-4 shadow-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-serif text-sm font-semibold text-[#0A241C]">
                                            {w.name}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                                                w.rsvpStatus === 'hadir'
                                                    ? 'bg-emerald-100 text-[#0F4435]'
                                                    : w.rsvpStatus === 'ragu'
                                                      ? 'bg-amber-100 text-amber-800'
                                                      : 'bg-neutral-100 text-neutral-700'
                                            }`}
                                        >
                                            {w.rsvpStatus === 'hadir'
                                                ? 'Hadir'
                                                : w.rsvpStatus === 'ragu'
                                                  ? 'Ragu'
                                                  : 'Berhalangan'}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-[#0A241C]">
                                        {w.message}
                                    </p>
                                    <span className="mt-2 block text-[10px] text-[#0F4435]/70">
                                        {w.createdAt || 'Baru saja'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </section>
                )}

                {/* ========================================================== */}
                {/* 10. CLOSING FOOTER                                         */}
                {/* ========================================================== */}
                <footer className="relative bg-[#0A241C] px-6 py-16 text-center text-[#F1F7F4]">
                    <EmeraldCorner position="top-left" color="#C8A34A" size={54} className="left-4 top-4" />
                    <EmeraldCorner position="top-right" color="#C8A34A" size={54} className="right-4 top-4" />

                    <p className="font-serif text-xs uppercase tracking-[0.25em] text-[#E8D49E]">
                        Ungkapan Terima Kasih
                    </p>
                    <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-[#F1F7F4]/80">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
                    </p>
                    <h3 className="mt-6 font-serif text-3xl font-normal text-[#F1F7F4]">
                        {groomNickname} &amp; {brideNickname}
                    </h3>
                    <p className="mt-6 text-[10px] tracking-widest uppercase text-[#C8A34A]/70">
                        Dibuat dengan &hearts; oleh Ngaturi
                    </p>
                </footer>

                {/* ========================================================== */}
                {/* FLOATING BOTTOM NAVIGATION DOCK (REAL-TIME SCROLLSPY)       */}
                {/* ========================================================== */}
                {isOpened && (
                    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
                        <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full border border-[#C8A34A]/35 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => scrollTo('section-cover')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-cover'
                                        ? 'bg-[#0F4435] text-[#E8D49E] shadow-sm'
                                        : 'text-[#0F4435] hover:bg-[#0F4435]/15'
                                }`}
                                title="Sampul"
                            >
                                <Heart size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollTo('section-couple')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-couple'
                                        ? 'bg-[#0F4435] text-[#E8D49E] shadow-sm'
                                        : 'text-[#0F4435] hover:bg-[#0F4435]/15'
                                }`}
                                title="Mempelai"
                            >
                                <User size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollTo('section-event')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-event'
                                        ? 'bg-[#0F4435] text-[#E8D49E] shadow-sm'
                                        : 'text-[#0F4435] hover:bg-[#0F4435]/15'
                                }`}
                                title="Agenda"
                            >
                                <CalendarIcon size={16} />
                            </button>
                            {showGallery && galleries && galleries.length > 0 && (

                                <button
                                type="button"
                                onClick={() => scrollTo('section-gallery')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-gallery'
                                        ? 'bg-[#0F4435] text-[#E8D49E] shadow-sm'
                                        : 'text-[#0F4435] hover:bg-[#0F4435]/15'
                                }`}
                                title="Galeri"
                            >
                                <ImageIcon size={16} />
                            </button>
                            )}
                            {(showRsvp || showWishes) && (

                                <button
                                type="button"
                                onClick={() => scrollTo('section-rsvp')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-rsvp'
                                        ? 'bg-[#0F4435] text-[#E8D49E] shadow-sm'
                                        : 'text-[#0F4435] hover:bg-[#0F4435]/15'
                                }`}
                                title="RSVP & Ucapan"
                            >
                                <MessageSquare size={16} />
                            </button>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasicTheme9;
