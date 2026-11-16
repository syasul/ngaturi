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

// Earthy Rustic Olive Branch Corner
const OliveCorner = ({
    position = 'top-left',
    color = '#4E6136',
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
            {/* Main stem */}
            <path
                d="M6 74 C16 45 35 25 74 6"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeOpacity="0.45"
            />
            {/* Olive Leaves */}
            <path
                d="M26 48 C24 38 32 30 38 34 C42 38 34 46 26 48 Z"
                fill={color}
                fillOpacity="0.25"
                stroke={color}
                strokeWidth="1"
            />
            <path
                d="M48 26 C44 16 52 10 56 16 C60 22 54 28 48 26 Z"
                fill={color}
                fillOpacity="0.28"
                stroke={color}
                strokeWidth="1"
            />
            <path
                d="M40 40 C34 32 40 22 46 28 C50 32 46 42 40 40 Z"
                fill={color}
                fillOpacity="0.22"
                stroke={color}
                strokeWidth="1"
            />
            {/* Olives */}
            <ellipse cx="32" cy="42" rx="3.5" ry="5" transform="rotate(-30 32 42)" fill="#3E4D2A" />
            <ellipse cx="50" cy="24" rx="3" ry="4.5" transform="rotate(-40 50 24)" fill="#3E4D2A" />
        </svg>
    );
};

// Earthy Divider
const OliveDivider = ({
    color = '#4E6136',
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="12" rx="4" ry="6" fill={color} fillOpacity="0.3" transform="rotate(25 12 12)" />
            <path d="M7 17 C10 13 14 11 17 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="9" r="1.5" fill={color} />
            <circle cx="16" cy="15" r="1.5" fill={color} />
        </svg>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
        />
    </div>
);

export interface BasicTheme6Props extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}

export const BasicTheme6: React.FC<BasicTheme6Props> = ({
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
            location: 'Masjid Agung Al-Barkah',
            address: 'Jl. Veteran No. 12, Jawa Barat',
            mapsUrl: 'https://maps.google.com',
        },
        resepsi: {
            title: 'Resepsi Pernikahan',
            date: 'Sabtu, 24 Oktober 2026',
            time: '11:00 - 14:00 WIB',
            location: 'The Earth Garden Hall',
            address: 'Jl. Raya Botanical No. 88, Jawa Barat',
            mapsUrl: 'https://maps.google.com',
        },
    };

    const galleries = data?.galleries?.length
        ? data.galleries
        : [
              {
                  id: '1',
                  url: '/assets/wedding/couple-rustic.png',
                  caption: 'Langkah Pertama Menuju Keabadian',
              },
              {
                  id: '2',
                  url: '/assets/wedding/couple-foliage.png',
                  caption: 'Kisah Yang Tumbuh Bersama Waktu',
              },
              {
                  id: '3',
                  url: '/assets/wedding/couple-royal.png',
                  caption: 'Janji Suci Dalam Kasih',
              },
              {
                  id: '4',
                  url: '/assets/wedding/hero-floral.png',
                  caption: 'Menatap Masa Depan Bersama',
              },
              {
                  id: '5',
                  url: '/assets/wedding/couple-rustic.png',
                  caption: 'Bahagia Dalam Setiap Detik',
              },
              {
                  id: '6',
                  url: '/assets/wedding/couple-foliage.png',
                  caption: 'Dua Jiwa Satu Hati',
              },
          ];

    const stories = data?.stories?.length
        ? data.stories
        : [
              {
                  year: '2021',
                  title: 'Awal Pertemuan',
                  content:
                      'Pertemuan sederhana di sebuah kedai kopi bernuansa asri yang membawa percakapan hangat berjam-jam.',
              },
              {
                  year: '2023',
                  title: 'Menjalin Komitmen',
                  content:
                      'Memutuskan untuk saling mengikat hati, saling melengkapi mimpi, dan melangkah bersama dalam keyakinan.',
              },
              {
                  year: '2026',
                  title: 'Menuju Pelaminan',
                  content:
                      'Dengan izin Allah SWT dan doa restu kedua orang tua, kami mengukuhkan cinta kami dalam ikatan suci pernikahan.',
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
                  name: 'Dimas Kurniawan',
                  message:
                      'Barakallahu lakum wa baraka alaikum! Selamat menempuh hidup baru Arya & Nabila. Semoga menjadi keluarga sakinah mawaddah warahmah.',
                  createdAt: '1 jam yang lalu',
                  rsvpStatus: 'hadir',
              },
              {
                  id: '2',
                  name: 'Siti Sarah',
                  message:
                      'Selamat Nabila sayang! Semoga lancar sampai hari H, sehat selalu, dan langgeng sampai maut memisahkan.',
                  createdAt: '3 jam yang lalu',
                  rsvpStatus: 'hadir',
              },
              {
                  id: '3',
                  name: 'Rian Pratama',
                  message:
                      'Happy wedding bro Arya! Ikut bahagia untuk kalian berdua. Maaf belum bisa hadir langsung, doa terbaik selalu!',
                  createdAt: '5 jam yang lalu',
                  rsvpStatus: 'tidak_hadir',
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
    const [rsvpCount, setRsvpCount] = useState('1');
    const [rsvpMessage, setRsvpMessage] = useState('');
    const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

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
            document.getElementById('basic6-scroll-container');
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
            document.getElementById('basic6-scroll-container');
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
            {/* LEFT PANEL: DESKTOP SHOWCASE (Olive Earth)                      */}
            {/* ============================================================== */}
            <div className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden bg-[#24301B] p-12 text-[#F7F5EE] lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 saturate-120"
                    style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C2615] via-[#24301B]/80 to-transparent" />

                <OliveCorner position="top-left" color="#A4BE80" size={80} className="left-8 top-8" />
                <OliveCorner position="bottom-right" color="#A4BE80" size={80} className="bottom-8 right-8" />

                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#A4BE80]/40 bg-white/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[#CBE2AD] backdrop-blur-md">
                        <Sparkles size={12} /> The Earth Botanical
                    </span>
                </div>

                <div className="relative z-10 my-auto max-w-xl py-12">
                    <p className="font-serif text-sm tracking-[0.3em] uppercase text-[#CBE2AD]/80">
                        The Wedding of
                    </p>
                    <h1 className="mt-4 font-serif text-6xl font-light tracking-tight text-[#FAF7EE] xl:text-7xl">
                        {groomNickname} <span className="font-serif italic text-[#CBE2AD]">&</span> {brideNickname}
                    </h1>
                    <p className="mt-6 text-sm leading-relaxed text-[#FAF7EE]/70">
                        {primaryDate} &bull; {schedules.akad?.location || 'Jawa Barat'}
                    </p>
                    <div className="mt-8 flex items-center gap-6">
                        <div className="rounded-xl border border-[#A4BE80]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#CBE2AD]">{timeLeft.days}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#FAF7EE]/60">Hari</p>
                        </div>
                        <div className="rounded-xl border border-[#A4BE80]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#CBE2AD]">{timeLeft.hours}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#FAF7EE]/60">Jam</p>
                        </div>
                        <div className="rounded-xl border border-[#A4BE80]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#CBE2AD]">{timeLeft.minutes}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#FAF7EE]/60">Menit</p>
                        </div>
                        <div className="rounded-xl border border-[#A4BE80]/30 bg-black/20 p-4 text-center backdrop-blur-sm min-w-[70px]">
                            <p className="font-serif text-2xl text-[#CBE2AD]">{timeLeft.seconds}</p>
                            <p className="text-[10px] uppercase tracking-widest text-[#FAF7EE]/60">Detik</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-[#FAF7EE]/50">
                    <p>&copy; 2026 Ngaturi &bull; Olive Earth Collection</p>
                    <p className="font-mono text-[11px] tracking-wider text-[#CBE2AD]/70">#AryaNabilaJourney</p>
                </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT PANEL: MOBILE-OPTIMIZED INVITATION CONTAINER             */}
            {/* ============================================================== */}
            <div
                ref={containerRef}
                id="basic6-scroll-container"
                className="relative h-screen w-full flex-1 overflow-y-auto bg-[#F7F5EE] text-[#2C3822] shadow-2xl lg:max-w-[480px] xl:max-w-[500px]"
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
                        className="fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#4E6136]/30 bg-[#FAF8F2]/90 text-[#3D4D2B] shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
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
                            key="cover-envelope"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -60, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
                            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#F7F5EE] p-8 text-center"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-15"
                                style={{ backgroundImage: `url(${coupleHeroPhoto})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5EE]/95 via-[#F7F5EE]/80 to-[#F7F5EE]" />

                            <OliveCorner position="top-left" color="#4E6136" size={70} className="left-4 top-4" />
                            <OliveCorner position="top-right" color="#4E6136" size={70} className="right-4 top-4" />
                            <OliveCorner position="bottom-left" color="#4E6136" size={70} className="bottom-4 left-4" />
                            <OliveCorner position="bottom-right" color="#4E6136" size={70} className="bottom-4 right-4" />

                            <div className="relative z-10 mt-8">
                                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#4E6136]/70">
                                    Undangan Pernikahan
                                </span>
                            </div>

                            <div className="relative z-10 my-auto flex flex-col items-center">
                                {/* Monogram Wreath */}
                                <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-[#4E6136]/30 bg-white/70 shadow-sm">
                                    <svg className="absolute inset-0 h-full w-full -rotate-45" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="44" stroke="#4E6136" strokeWidth="1" strokeDasharray="3 4" fill="none" opacity="0.4" />
                                    </svg>
                                    <div className="text-center font-serif text-2xl font-light text-[#2C3822]">
                                        <span>{groomNickname[0]}</span>
                                        <span className="italic text-[#7E5739]">&</span>
                                        <span>{brideNickname[0]}</span>
                                    </div>
                                </div>

                                <p className="font-serif text-sm tracking-[0.25em] uppercase text-[#4E6136]/80">
                                    The Wedding of
                                </p>
                                <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-[#232F1A] sm:text-5xl">
                                    {groomNickname} <span className="font-serif italic text-[#7E5739]">&</span> {brideNickname}
                                </h1>

                                <div className="mt-8 rounded-2xl border border-[#4E6136]/25 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm max-w-xs w-full">
                                    <p className="text-[11px] text-[#4E6136]/70 uppercase tracking-widest">
                                        Kepada Yth. Bapak/Ibu/Saudara/i:
                                    </p>
                                    <p className="mt-1 font-serif text-lg font-medium text-[#232F1A]">
                                        {guestName || 'Tamu Undangan'}
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#4E6136]/60 italic">
                                        *Mohon maaf bila ada kesalahan penulisan nama/gelar
                                    </p>
                                </div>

                                <button
                                    onClick={handleOpen}
                                    className="group relative mt-8 flex items-center gap-2.5 overflow-hidden rounded-full bg-[#3D4D2B] px-8 py-3.5 text-xs font-semibold tracking-wider uppercase text-[#F7F5EE] shadow-lg shadow-[#3D4D2B]/30 transition-all hover:bg-[#2C3822] active:scale-95"
                                >
                                    <Heart size={14} className="transition-transform group-hover:scale-125" />
                                    <span>Buka Undangan</span>
                                </button>
                            </div>

                            <div className="relative z-10 mb-4 text-[10px] tracking-widest uppercase text-[#4E6136]/60">
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
                    <OliveCorner position="top-left" color="#4E6136" size={60} className="left-4 top-4" />
                    <OliveCorner position="top-right" color="#4E6136" size={60} className="right-4 top-4" />

                    <div className="relative z-10 pt-4">
                        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                            Walimatul Ursy
                        </span>
                    </div>

                    <div className="relative z-10 my-auto flex w-full flex-col items-center">
                        <div className="relative mb-6 h-64 w-48 overflow-hidden rounded-[80px_80px_16px_16px] border-4 border-white shadow-xl">
                            <img
                                src={coupleHeroPhoto}
                                alt="Mempelai"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>

                        <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#4E6136]/80">
                            The Marriage of
                        </p>
                        <h2 className="mt-2 font-serif text-4xl font-normal text-[#232F1A] sm:text-5xl">
                            {groomNickname} <span className="font-serif italic text-[#7E5739]">&</span> {brideNickname}
                        </h2>

                        <p className="mt-4 text-xs font-medium tracking-widest text-[#4E6136]">
                            {primaryDate}
                        </p>

                        <OliveDivider color="#4E6136" className="my-2" />

                        {/* Live Countdown Grid */}
                        <div className="grid grid-cols-4 gap-2.5 pt-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#4E6136]/20 bg-white/70 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#232F1A]">{timeLeft.days}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#4E6136]/70">Hari</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#4E6136]/20 bg-white/70 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#232F1A]">{timeLeft.hours}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#4E6136]/70">Jam</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#4E6136]/20 bg-white/70 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#232F1A]">{timeLeft.minutes}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#4E6136]/70">Menit</span>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#4E6136]/20 bg-white/70 p-2.5 shadow-sm min-w-[56px]">
                                <span className="font-serif text-xl font-medium text-[#232F1A]">{timeLeft.seconds}</span>
                                <span className="text-[9px] uppercase tracking-wider text-[#4E6136]/70">Detik</span>
                            </div>
                        </div>

                        <a
                            href={createGoogleCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#4E6136]/30 bg-white/60 px-5 py-2 text-[11px] font-medium text-[#3D4D2B] shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                        >
                            <CalendarIcon size={13} />
                            <span>Simpan ke Google Calendar</span>
                        </a>
                    </div>

                    <div className="relative z-10 animate-bounce pb-2 text-[#4E6136]/60">
                        <span className="text-[10px] uppercase tracking-widest">&darr; Gulir ke Bawah</span>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 3. SECTION: AYAT SUCI (CONTRAST BANNER: DEEP OLIVE NOIR)   */}
                {/* ========================================================== */}
                <section className="relative overflow-hidden bg-[#24301B] px-8 py-16 text-center text-[#F7F5EE]">
                    <OliveCorner position="top-left" color="#A4BE80" size={54} className="left-4 top-4" />
                    <OliveCorner position="bottom-right" color="#A4BE80" size={54} className="bottom-4 right-4" />

                    <div className="relative z-10 mx-auto max-w-sm">
                        <svg className="mx-auto mb-4 h-8 w-8 text-[#CBE2AD]/60" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        <p className="font-serif text-sm leading-relaxed text-[#F7F5EE]/90 italic sm:text-base">
                            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
                        </p>
                        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#CBE2AD]">
                            &bull; Q.S. Ar-Rum: 21 &bull;
                        </p>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 4. SECTION: MEMPELAI (BRIDE & GROOM)                       */}
                {/* ========================================================== */}
                <section id="section-couple" className="relative px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                        Assalamu&apos;alaikum Wr. Wb.
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#232F1A]">
                        Kedua Mempelai
                    </h2>
                    <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-[#4E6136]/80">
                        Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
                    </p>

                    <OliveDivider color="#4E6136" className="my-6" />

                    {/* Mempelai Pria */}
                    <div className="relative mx-auto mt-6 max-w-xs rounded-3xl border border-[#4E6136]/20 bg-white/80 p-6 shadow-sm">
                        <div className="relative mx-auto mb-4 h-44 w-36 overflow-hidden rounded-[40px] border-2 border-[#4E6136]/30 shadow-md">
                            <img
                                src={groomPhoto}
                                alt={groomFullName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-medium text-[#232F1A]">
                            {groomFullName}
                        </h3>
                        <p className="mt-2 text-xs text-[#4E6136]/80">
                            {groom.bio || `Putra dari ${groom.father} & ${groom.mother}`}
                        </p>
                        {groom.instagram && (
                            <a
                                href={`https://instagram.com/${groom.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#4E6136]/25 bg-[#F7F5EE] px-4 py-1.5 text-xs text-[#3D4D2B] transition-colors hover:bg-[#3D4D2B] hover:text-white"
                            >
                                <InstagramIcon size={12} />
                                <span>@{groom.instagram}</span>
                            </a>
                        )}
                    </div>

                    <div className="my-6 font-serif text-3xl italic text-[#7E5739]">&amp;</div>

                    {/* Mempelai Wanita */}
                    <div className="relative mx-auto max-w-xs rounded-3xl border border-[#4E6136]/20 bg-white/80 p-6 shadow-sm">
                        <div className="relative mx-auto mb-4 h-44 w-36 overflow-hidden rounded-[40px] border-2 border-[#4E6136]/30 shadow-md">
                            <img
                                src={bridePhoto}
                                alt={brideFullName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-medium text-[#232F1A]">
                            {brideFullName}
                        </h3>
                        <p className="mt-2 text-xs text-[#4E6136]/80">
                            {bride.bio || `Putri dari ${bride.father} & ${bride.mother}`}
                        </p>
                        {bride.instagram && (
                            <a
                                href={`https://instagram.com/${bride.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#4E6136]/25 bg-[#F7F5EE] px-4 py-1.5 text-xs text-[#3D4D2B] transition-colors hover:bg-[#3D4D2B] hover:text-white"
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
                <section id="section-event" className="relative bg-[#EFECE2] px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                        Rangkaian Hari Bahagia
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#232F1A]">
                        Agenda Pernikahan
                    </h2>

                    <OliveDivider color="#4E6136" className="my-6" />

                    <div className="space-y-6">
                        {/* Akad Card */}
                        {schedules.akad && (
                            <div className="relative mx-auto max-w-sm rounded-3xl border border-[#4E6136]/25 bg-white/90 p-6 text-left shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#4E6136]/15 pb-3">
                                    <h3 className="font-serif text-xl font-semibold text-[#232F1A]">
                                        {schedules.akad.title}
                                    </h3>
                                    <span className="rounded-full bg-[#4E6136]/15 px-3 py-1 font-mono text-[10px] font-medium text-[#3D4D2B]">
                                        Intimate
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2.5 text-xs text-[#2C3822]">
                                    <div className="flex items-start gap-2.5">
                                        <CalendarIcon size={14} className="mt-0.5 text-[#4E6136]" />
                                        <span>{schedules.akad.date}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Clock size={14} className="mt-0.5 text-[#4E6136]" />
                                        <span>{schedules.akad.time}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin size={14} className="mt-0.5 text-[#4E6136]" />
                                        <div>
                                            <p className="font-medium text-[#232F1A]">{schedules.akad.location}</p>
                                            <p className="text-[11px] text-[#4E6136]/70">{schedules.akad.address}</p>
                                        </div>
                                    </div>
                                </div>
                                {schedules.akad.mapsUrl && (
                                    <a
                                        href={schedules.akad.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D4D2B] py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#232F1A]"
                                    >
                                        <MapPin size={13} />
                                        <span>Petunjuk Arah Google Maps</span>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Resepsi Card */}
                        {schedules.resepsi && (
                            <div className="relative mx-auto max-w-sm rounded-3xl border border-[#4E6136]/25 bg-white/90 p-6 text-left shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#4E6136]/15 pb-3">
                                    <h3 className="font-serif text-xl font-semibold text-[#232F1A]">
                                        {schedules.resepsi.title}
                                    </h3>
                                    <span className="rounded-full bg-[#7E5739]/15 px-3 py-1 font-mono text-[10px] font-medium text-[#7E5739]">
                                        Celebration
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2.5 text-xs text-[#2C3822]">
                                    <div className="flex items-start gap-2.5">
                                        <CalendarIcon size={14} className="mt-0.5 text-[#4E6136]" />
                                        <span>{schedules.resepsi.date}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Clock size={14} className="mt-0.5 text-[#4E6136]" />
                                        <span>{schedules.resepsi.time}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin size={14} className="mt-0.5 text-[#4E6136]" />
                                        <div>
                                            <p className="font-medium text-[#232F1A]">{schedules.resepsi.location}</p>
                                            <p className="text-[11px] text-[#4E6136]/70">{schedules.resepsi.address}</p>
                                        </div>
                                    </div>
                                </div>
                                {schedules.resepsi.mapsUrl && (
                                    <a
                                        href={schedules.resepsi.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D4D2B] py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#232F1A]"
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
                <section id="section-story" className="relative px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                        Perjalanan Cinta
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#232F1A]">
                        Kisah Kami
                    </h2>

                    <OliveDivider color="#4E6136" className="my-6" />

                    <div className="relative mx-auto max-w-sm space-y-6 text-left">
                        <div className="absolute bottom-4 left-4 top-4 w-[2px] bg-[#4E6136]/20" />
                        {stories.map((story: any, idx: number) => (
                            <div key={idx} className="relative pl-10">
                                <div className="absolute left-2.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#4E6136] bg-[#F7F5EE]" />
                                <span className="inline-block rounded-md bg-[#4E6136]/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#3D4D2B]">
                                    {story.year}
                                </span>
                                <h4 className="mt-1 font-serif text-base font-medium text-[#232F1A]">
                                    {story.title}
                                </h4>
                                <p className="mt-1 text-xs leading-relaxed text-[#4E6136]/80">
                                    {story.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 7. SECTION: GALERI FOTO                                    */}
                {/* ========================================================== */}
                <section id="section-gallery" className="relative bg-[#EFECE2] px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                        Momen Berharga
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#232F1A]">
                        Galeri Bahagia
                    </h2>

                    <OliveDivider color="#4E6136" className="my-6" />

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

                {/* ========================================================== */}
                {/* 8. SECTION: DIGITAL GIFT / TANDA KASIH                    */}
                {/* ========================================================== */}
                <section id="section-gift" className="relative px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                        Tanda Kasih
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#232F1A]">
                        Kado Pernikahan
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-xs text-[#4E6136]/80 leading-relaxed">
                        Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih berupa hadiah, Anda dapat menggunakan saluran berikut:
                    </p>

                    <OliveDivider color="#4E6136" className="my-6" />

                    <div className="space-y-4">
                        {bankAccounts.map((acc: any, idx: number) => (
                            <div
                                key={idx}
                                className="relative mx-auto max-w-xs rounded-2xl border border-[#4E6136]/25 bg-white p-5 shadow-sm text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="rounded-md bg-[#4E6136]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#3D4D2B]">
                                        {acc.bank}
                                    </span>
                                    <Gift size={16} className="text-[#4E6136]" />
                                </div>
                                <p className="mt-3 font-mono text-lg font-semibold tracking-wider text-[#232F1A]">
                                    {acc.accountNumber}
                                </p>
                                <p className="text-xs text-[#4E6136]/70">
                                    a.n {acc.accountName}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(acc.accountNumber, `acc-${idx}`)}
                                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#4E6136]/30 bg-[#F7F5EE] py-2 text-xs font-medium text-[#3D4D2B] transition-colors hover:bg-[#3D4D2B] hover:text-white"
                                >
                                    {copiedAccount === `acc-${idx}` ? (
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

                {/* ========================================================== */}
                {/* 9. SECTION: RSVP & WISHES                                  */}
                {/* ========================================================== */}
                <section id="section-rsvp" className="relative bg-[#EFECE2] px-6 py-20 text-center">
                    <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#4E6136]/75">
                        Konfirmasi Kehadiran
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#232F1A]">
                        RSVP &amp; Doa Restu
                    </h2>

                    <OliveDivider color="#4E6136" className="my-6" />

                    {/* RSVP Form Card */}
                    <div className="relative mx-auto max-w-sm rounded-3xl border border-[#4E6136]/25 bg-white p-6 shadow-sm text-left">
                        {rsvpSubmitted ? (
                            <div className="py-6 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                                    <Check size={24} />
                                </div>
                                <h4 className="font-serif text-lg font-semibold text-[#232F1A]">
                                    Terima Kasih atas Konfirmasinya!
                                </h4>
                                <p className="mt-1 text-xs text-[#4E6136]/75">
                                    Konfirmasi kehadiran Anda telah tercatat dengan baik.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleRsvpSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E6136]">
                                        Nama Anda
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={rsvpName}
                                        onChange={(e) => setRsvpName(e.target.value)}
                                        placeholder="Tuliskan nama lengkap..."
                                        className="mt-1.5 w-full rounded-xl border border-[#4E6136]/30 bg-[#F7F5EE]/60 px-3.5 py-2.5 text-xs text-[#2C3822] focus:border-[#4E6136] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E6136]">
                                        Konfirmasi Kehadiran
                                    </label>
                                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRsvpStatus('hadir')}
                                            className={`rounded-xl py-2 text-xs font-medium transition-all ${
                                                rsvpStatus === 'hadir'
                                                    ? 'bg-[#3D4D2B] text-white shadow-sm'
                                                    : 'border border-[#4E6136]/25 bg-[#F7F5EE] text-[#4E6136]'
                                            }`}
                                        >
                                            Hadir
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRsvpStatus('ragu')}
                                            className={`rounded-xl py-2 text-xs font-medium transition-all ${
                                                rsvpStatus === 'ragu'
                                                    ? 'bg-[#7E5739] text-white shadow-sm'
                                                    : 'border border-[#4E6136]/25 bg-[#F7F5EE] text-[#4E6136]'
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
                                                    : 'border border-[#4E6136]/25 bg-[#F7F5EE] text-[#4E6136]'
                                            }`}
                                        >
                                            Tidak Hadir
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#4E6136]">
                                        Ucapan &amp; Doa
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={rsvpMessage}
                                        onChange={(e) => setRsvpMessage(e.target.value)}
                                        placeholder="Tuliskan ucapan selamat & doa restu..."
                                        className="mt-1.5 w-full rounded-xl border border-[#4E6136]/30 bg-[#F7F5EE]/60 px-3.5 py-2.5 text-xs text-[#2C3822] focus:border-[#4E6136] focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmittingRsvp}
                                    className="w-full rounded-xl bg-[#3D4D2B] py-3 text-xs font-semibold tracking-wider uppercase text-white shadow-md transition-all hover:bg-[#232F1A] active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmittingRsvp ? 'Mengirim...' : 'Kirim RSVP'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Wishes Guestbook List */}
                    <div id="section-wishes" className="mx-auto mt-10 max-w-sm text-left">
                        <div className="flex items-center justify-between border-b border-[#4E6136]/20 pb-2">
                            <h4 className="font-serif text-lg font-medium text-[#232F1A]">
                                Ucapan &amp; Doa ({localWishes.length})
                            </h4>
                            <MessageCircle size={16} className="text-[#4E6136]" />
                        </div>

                        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                            {localWishes.map((w: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-[#4E6136]/15 bg-white/90 p-4 shadow-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-serif text-sm font-semibold text-[#232F1A]">
                                            {w.name}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                                                w.rsvpStatus === 'hadir'
                                                    ? 'bg-green-100 text-green-800'
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
                                    <p className="mt-2 text-xs leading-relaxed text-[#2C3822]">
                                        {w.message}
                                    </p>
                                    <span className="mt-2 block text-[10px] text-[#4E6136]/60">
                                        {w.createdAt || 'Baru saja'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* 10. CLOSING FOOTER                                         */}
                {/* ========================================================== */}
                <footer className="relative bg-[#24301B] px-6 py-16 text-center text-[#F7F5EE]">
                    <OliveCorner position="top-left" color="#A4BE80" size={54} className="left-4 top-4" />
                    <OliveCorner position="top-right" color="#A4BE80" size={54} className="right-4 top-4" />

                    <p className="font-serif text-xs uppercase tracking-[0.25em] text-[#CBE2AD]">
                        Ungkapan Terima Kasih
                    </p>
                    <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-[#F7F5EE]/80">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
                    </p>
                    <h3 className="mt-6 font-serif text-3xl font-normal text-[#FAF7EE]">
                        {groomNickname} &amp; {brideNickname}
                    </h3>
                    <p className="mt-6 text-[10px] tracking-widest uppercase text-[#A4BE80]/70">
                        Dibuat dengan &hearts; oleh Ngaturi
                    </p>
                </footer>

                {/* ========================================================== */}
                {/* FLOATING BOTTOM NAVIGATION DOCK (REAL-TIME SCROLLSPY)       */}
                {/* ========================================================== */}
                {isOpened && (
                    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
                        <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full border border-[#4E6136]/30 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => scrollTo('section-cover')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-cover'
                                        ? 'bg-[#3D4D2B] text-white shadow-sm'
                                        : 'text-[#4E6136] hover:bg-[#4E6136]/15'
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
                                        ? 'bg-[#3D4D2B] text-white shadow-sm'
                                        : 'text-[#4E6136] hover:bg-[#4E6136]/15'
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
                                        ? 'bg-[#3D4D2B] text-white shadow-sm'
                                        : 'text-[#4E6136] hover:bg-[#4E6136]/15'
                                }`}
                                title="Agenda"
                            >
                                <CalendarIcon size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollTo('section-gallery')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-gallery'
                                        ? 'bg-[#3D4D2B] text-white shadow-sm'
                                        : 'text-[#4E6136] hover:bg-[#4E6136]/15'
                                }`}
                                title="Galeri"
                            >
                                <ImageIcon size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollTo('section-rsvp')}
                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                    activeSection === 'section-rsvp'
                                        ? 'bg-[#3D4D2B] text-white shadow-sm'
                                        : 'text-[#4E6136] hover:bg-[#4E6136]/15'
                                }`}
                                title="RSVP & Ucapan"
                            >
                                <MessageSquare size={16} />
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasicTheme6;
