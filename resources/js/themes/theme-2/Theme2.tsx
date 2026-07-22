import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    Copy,
    CreditCard,
    MapPin,
    Menu,
    Play,
    QrCode,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import OpeningCover from '../reusable/OpeningCover';

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
                    className="w-full border-b border-[#3E2723]/30 bg-transparent px-2 py-2 text-xs text-[#3E2723] placeholder-[#3E2723]/60 transition-colors focus:border-[#3E2723] focus:outline-none"
                />
            </div>
            <div>
                <input
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    type="text"
                    placeholder="JUMLAH TAMU"
                    className="w-full border-b border-[#3E2723]/30 bg-transparent px-2 py-2 text-xs text-[#3E2723] placeholder-[#3E2723]/60 transition-colors focus:border-[#3E2723] focus:outline-none"
                />
            </div>
            <div className="space-y-3 pt-2">
                <label className="font-serif text-[10px] uppercase tracking-widest text-[#3E2723]">
                    Apakah Anda Akan Hadir?
                </label>
                <div
                    onClick={() => setStatus('hadir')}
                    className="flex cursor-pointer items-center justify-between rounded border border-[#3E2723]/30 p-3 transition-colors hover:bg-[#3E2723]/5"
                >
                    <span className="font-serif text-xs text-[#3E2723]">
                        Ya, saya akan hadir
                    </span>
                    <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${status === 'hadir'
                            ? 'border-[#3E2723]'
                            : 'border-[#3E2723]/50'
                            }`}
                    >
                        {status === 'hadir' && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[#3E2723]"></div>
                        )}
                    </div>
                </div>
                <div
                    onClick={() => setStatus('tidak_hadir')}
                    className="flex cursor-pointer items-center justify-between rounded border border-[#3E2723]/30 p-3 transition-colors hover:bg-[#3E2723]/5"
                >
                    <span className="font-serif text-xs text-[#3E2723]">
                        Maaf, tidak bisa hadir
                    </span>
                    <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${status === 'tidak_hadir'
                            ? 'border-[#3E2723]'
                            : 'border-[#3E2723]/50'
                            }`}
                    >
                        {status === 'tidak_hadir' && (
                            <div className="h-1.5 w-1.5 rounded-full bg-[#3E2723]"></div>
                        )}
                    </div>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-[#3E2723] py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-[#3E2723]/90 disabled:opacity-50"
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
            await onRsvpSubmit('hadir', message);
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
                        className="w-full border-b border-[#3E2723]/30 bg-transparent px-2 py-2 text-xs text-[#3E2723] placeholder-[#3E2723]/60 transition-colors focus:border-[#3E2723] focus:outline-none"
                    />
                </div>
                <div>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Tulis ucapan/doa Anda..."
                        className="w-full resize-none border-b border-[#3E2723]/30 bg-transparent px-2 py-2 text-xs text-[#3E2723] placeholder-[#3E2723]/60 transition-colors focus:border-[#3E2723] focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-[#3E2723] py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-[#3E2723]/90 disabled:opacity-50"
                >
                    {loading ? 'MENGIRIM...' : 'KIRIM UCAPAN'}
                </button>
            </form>

            <hr className="mb-8 mt-10 border-[#3E2723]/20" />

            <h4 className="mb-6 text-center font-serif text-[11px] font-bold uppercase tracking-widest text-[#3E2723]">
                Ucapan Terbaru
            </h4>

            <div className="scrollbar-thin scrollbar-thumb-[#3E2723]/20 scrollbar-track-transparent relative h-[300px] overflow-y-auto rounded-2xl border border-[#3E2723]/30 p-4">
                {wishes.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="font-serif text-[11px] italic text-[#3E2723]/70">
                            Belum ada ucapan. Jadilah yang pertama!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wishes.map((wish) => (
                            <div
                                key={wish.id}
                                className="border-b border-[#3E2723]/20 pb-3 last:border-0 last:pb-0"
                            >
                                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#3E2723]">
                                    {wish.name}
                                </span>
                                <p className="font-serif text-[11px] italic leading-relaxed text-[#3E2723]/80">
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

const Theme2Countdown = ({ targetDate }: { targetDate: string }) => {
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
        { l: 'Hari', v: timeLeft.days },
        { l: 'Jam', v: timeLeft.hours },
        { l: 'Menit', v: timeLeft.minutes },
        { l: 'Detik', v: timeLeft.seconds },
    ];

    return (
        <div className="flex items-center justify-center gap-3">
            {blocks.map((b, i) => (
                <div
                    key={i}
                    className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-[#9E4B57] text-white shadow-md sm:h-20 sm:w-20"
                >
                    <span className="font-serif text-xl font-bold leading-none sm:text-2xl">
                        {String(b.v).padStart(2, '0')}
                    </span>
                    <span className="mt-1 font-sans text-[9px] font-medium opacity-95 sm:text-[11px]">
                        {b.l}
                    </span>
                </div>
            ))}
        </div>
    );
};

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
};

const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

interface Theme2Props extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
}

export const Theme2: React.FC<Theme2Props> = ({
    data,
    guestName,
    wishes,
    onRsvpSubmit,
    isOpened = true,
    onOpen,
}) => {
    const groom = data?.groom || {};
    const bride = data?.bride || {};
    const schedules = data?.schedules || data?.schedule || {};
    const stories = data?.stories || [];
    const quotes = data?.quotes || {};

    const primaryColor = '#6B1D2F';
    const textColor = '#2D1A1E';

    const getGroomParents = (p: any) => {
        if (p.fatherName && p.motherName) {
            return `Putra dari Bpk. ${p.fatherName} & Ibu ${p.motherName}`;
        }
        return p.parents || '';
    };

    const getBrideParents = (p: any) => {
        if (p.fatherName && p.motherName) {
            return `Putri dari Bpk. ${p.fatherName} & Ibu ${p.motherName}`;
        }
        return p.parents || '';
    };

    const getGroomPhoto = () => {
        const isDefault =
            !groom.photo ||
            groom.photo.includes('foto-mempelai-pria.webp') ||
            groom.photo.includes('Desaintanpajudul');
        if (isDefault) {
            return '/assets/theme_2/foto-bingkai-laki.png';
        }
        return resolveImageUrl(
            groom.photo,
            '/assets/theme_2/foto-bingkai-laki.png',
        );
    };

    const getBridePhoto = () => {
        const isDefault =
            !bride.photo ||
            bride.photo.includes('foto-mempelai-cewe.webp') ||
            bride.photo.includes('Desaintanpajudul');
        if (isDefault) {
            return '/assets/theme_2/foto-bingkai-perempuan.png';
        }
        return resolveImageUrl(
            bride.photo,
            '/assets/theme_2/foto-bingkai-perempuan.png',
        );
    };

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

    const displayPhotos = defaultPhotos;
    const weddingDate =
        schedules.akad?.date || schedules.resepsi?.date || '2026-09-21';

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
        <div className="flex min-h-screen w-full overflow-hidden bg-[#FDF9F1] text-[#3E2723]">
            {/* DESKTOP LEFT PANEL */}
            <div className="relative sticky left-0 top-0 hidden h-screen w-[70%] select-none flex-col justify-between overflow-hidden bg-[#F7F5F0] p-16 lg:flex">
                <div
                    className="pointer-events-none absolute inset-0 z-0 scale-[1] bg-cover bg-bottom bg-no-repeat transition-transform duration-500 ease-in-out"
                    style={{
                        backgroundImage:
                            "url('/assets/theme_2/rumah-full2.png')",
                        backgroundSize: '130% 80%',
                    }}
                />
                <div
                    className="pointer-events-none absolute inset-0 bottom-20 z-10 bg-bottom bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('/assets/theme_2/pohon-kanan-kiri.png')",
                        backgroundSize: '130% auto',
                    }}
                />
                <div
                    className="pointer-events-none absolute -bottom-20 -left-20 z-20 h-[35%] w-[50%] bg-contain bg-left-bottom bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('/assets/theme_2/border-samping-kiri.png')",
                    }}
                />
                <div
                    className="pointer-events-none absolute -bottom-20 -right-20 z-20 h-[35%] w-[50%] bg-contain bg-right-bottom bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('/assets/theme_2/border-samping-kanan.png')",
                    }}
                />
                <div className="pointer-events-none absolute inset-0 z-30 bg-white/20 bg-gradient-to-t from-white/50 via-transparent to-white/20" />

                <motion.div
                    className="relative z-40 flex h-full w-full flex-col justify-between"
                    initial="hidden"
                    animate={isOpened ? 'visible' : 'hidden'}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.3,
                                delayChildren: 0.8,
                            },
                        },
                    }}
                >
                    <motion.div variants={fadeUpVariants} className="space-y-4">
                        <span className="block font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#7A7265]">
                            THE WEDDING INVITATION OF
                        </span>
                        <div className="h-[1px] w-12 bg-[#A89F91]" />
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        className="space-y-6 text-center"
                    >
                        <h1
                            className="text-7xl font-normal italic leading-tight text-[#4A453E]"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            {groom?.nickname || 'Ilyas'} &{' '}
                            {bride?.nickname || 'Iftitah'}
                        </h1>
                        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-[#7A7265]">
                            SAVE THE DATE • {formatDate(weddingDate)}
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUpVariants} className="max-w-md">
                        <p className="text-xs italic leading-relaxed text-[#5A554E]">
                            "
                            {quotes?.text ||
                                'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...'}
                            "
                            {quotes?.source && (
                                <span className="mt-2 block font-bold not-italic text-[#8B8273]">
                                    {quotes.source}
                                </span>
                            )}
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* RIGHT PANEL */}
            <div className="relative h-screen w-full overflow-hidden lg:w-[30%]">
                <AnimatePresence>
                    {!isOpened && onOpen && (
                        <OpeningCover
                            onOpen={onOpen}
                            containerBgClassName="bg-gradient-to-b from-white via-white to-[#F7DCE3] text-[#4A3B32]"
                            positionClass="absolute inset-0 z-50"
                        >
                            {(isOpening, handleOpen) => (
                                <>
                                    <motion.div
                                        className="pointer-events-none absolute inset-0 -bottom-20 z-0 flex items-end justify-center"
                                        style={{ willChange: 'transform, opacity' }}
                                        animate={
                                            isOpening
                                                ? { scale: 0.9, opacity: 0 }
                                                : { scale: 1, opacity: 1 }
                                        }
                                        transition={{ duration: 0.6 }}
                                    >
                                        <img
                                            src="/assets/theme_2/muslim-couple3.webp"
                                            alt="Couple Illustration"
                                            className="h-[105%] w-[350%] max-w-none"
                                        />
                                    </motion.div>
                                    <div
                                        className="pointer-events-none absolute -bottom-0 left-0 right-0 z-10 h-[22%] w-full bg-cover bg-bottom bg-no-repeat"
                                        style={{
                                            backgroundImage:
                                                "url('/assets/theme_2/border-bawah2.webp')",
                                        }}
                                    />
                                    <div className="relative z-20 flex h-full w-full flex-1 flex-col items-center justify-end pb-16">
                                        <motion.div
                                            className="flex flex-col items-center space-y-2"
                                            style={{ willChange: 'transform, opacity' }}
                                            animate={
                                                isOpening
                                                    ? { y: -40, opacity: 0 }
                                                    : { y: 0, opacity: 1 }
                                            }
                                            transition={{ duration: 0.5 }}
                                        >
                                            <span className="text-sm font-normal text-[#4A3B32]/80">
                                                The Wedding of
                                            </span>
                                            <h1
                                                className="mb-1 text-5xl leading-tight text-[#B5527A]"
                                                style={{
                                                    fontFamily:
                                                        "'Dancing Script', cursive",
                                                }}
                                            >
                                                {groom.nickname || 'Habib'} &{' '}
                                                {bride.nickname || 'Adiba'}
                                            </h1>
                                            <div className="mt-4 flex flex-col items-center space-y-1.5">
                                                <p className="text-sm text-[#4A3B32]/80">
                                                    Kepada Bapak/Ibu/Saudara/i
                                                </p>
                                                <h3 className="text-lg font-bold text-[#4A3B32]">
                                                    {guestName || 'Nama Tamu'}
                                                </h3>
                                            </div>
                                            <motion.div
                                                className="mt-6"
                                                style={{ willChange: 'transform, opacity' }}
                                                animate={
                                                    isOpening
                                                        ? { y: 40, opacity: 0 }
                                                        : { y: 0, opacity: 1 }
                                                }
                                                transition={{ duration: 0.5 }}
                                            >
                                                <button
                                                    onClick={handleOpen}
                                                    className="flex transform items-center justify-center rounded-full bg-[#D6738F] px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#C25E7B] active:scale-95"
                                                >
                                                    <span>Buka Undangan</span>
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </>
                            )}
                        </OpeningCover>
                    )}
                </AnimatePresence>

                <div
                    className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth"
                    id="invitation-scroll-container"
                >
                    {/* HOME SECTION */}
                    <section
                        id="home"
                        className="relative z-20 flex min-h-screen w-full flex-col items-center justify-start overflow-x-clip pb-24 pt-12"
                    >
                        {/* LAYER 1: Background Utama - Rumah/Kastil */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/rumah-full3.png')",
                            }}
                        />

                        <div
                            className="absolute bottom-10 z-40 h-[50%] w-[120%] bg-contain bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/border-bawah3.webp')",
                            }}
                        />

                        <div
                            className="absolute bottom-[45px] left-1/2 z-20 h-[90%] w-[90%] -translate-x-1/2 bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/air-mancur-background.png')",
                                backgroundSize: '80% 100%',
                            }}
                        />

                        <div
                            className="absolute bottom-[45px] z-30 h-[90%] w-[140%] bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/pohon-kanan-kiri.png')",
                                backgroundSize: '100% 100%',
                            }}
                        />

                        <div
                            className="absolute bottom-5 z-30 h-[100%] w-[120%] scale-[1.1] bg-contain bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/batas2.webp')",
                            }}
                        />

                        {/* LAYER 4: Overlay Gradient untuk readability */}
                        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/40 via-white/20 to-white/50" />

                        {/* CONTENT */}
                        <motion.div
                            className="relative z-30 mx-auto mt-4 flex w-[90%] max-w-[500px] flex-col items-center @container"
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
                            {/* Top Text - The Wedding of */}
                            <motion.div
                                className="mt-[35%] flex flex-col items-center text-center"
                                variants={fadeUpVariants}
                            >
                                <span
                                    className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.3em]"
                                    style={{ color: '#5C4B4B' }}
                                >
                                    The Wedding of
                                </span>
                                {/* Names */}
                                <h2
                                    className="text-6xl font-normal italic leading-none"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    {groom.nickname || 'Ilyas'}
                                </h2>
                                <span
                                    className="my-2 text-4xl italic"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    &
                                </span>
                                <h2
                                    className="text-6xl font-normal italic leading-none"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    {bride.nickname || 'Iftitah'}
                                </h2>

                                {/* Date */}
                                <div className="mt-6 flex flex-col items-center">
                                    <span
                                        className="font-serif text-lg font-semibold"
                                        style={{ color: textColor }}
                                    >
                                        {heroDay} {heroMonth} {heroYear}
                                    </span>

                                    {/* Save The Date Button */}
                                    <button
                                        className="mt-4 rounded-full px-8 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: primaryColor,
                                        }}
                                    >
                                        Save The Date
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>
                    {/* COUPLE SECTION */}
                    <section
                        id="quote"
                        className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-x-clip bg-transparent pb-32 pt-12"
                    >
                        {/* LAYER: Background Pohon */}
                        <div
                            className="pointer-events-none absolute bottom-40 left-1/2 z-0 h-[65%] w-[135%] -translate-x-1/2 bg-bottom bg-no-repeat opacity-60"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/pohon-kanan-kiri.png')",
                                backgroundSize: '100% 100%',
                            }}
                        />

                        <div
                            className="bottom-85 absolute z-30 h-[100%] w-[100%] scale-[1.1] bg-contain bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-ornamen-768x335.webp')",
                            }}
                        />

                        <motion.div
                            className="relative z-10 mx-auto mt-28 flex h-[50%] w-[90%] max-w-[400px] flex-col items-center justify-center space-y-6 rounded-full border-[6px] border-double border-[#C9A84C]/60 bg-[#FAF3EC] px-8 py-24 text-center shadow-2xl"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={scaleInVariants}
                        >
                            {/* Flower Bouquet */}
                            <div className="aspect-square w-[105%] max-w-[190px]">
                                <img
                                    src="/assets/theme_2/VINTAGE-06-bunga2.webp"
                                    alt="Flowers"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {/* Quote Text */}
                            <p className="text-l px-2 font-serif italic leading-relaxed text-[#3E2723]/90">
                                "
                                {quotes?.text ||
                                    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.'}
                                "
                            </p>
                            <p
                                className="text-s font-bold text-[#5C061C]"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                {quotes?.source || '(Qs. Ar-Rum : 21)'}
                            </p>
                        </motion.div>
                    </section>
                    {/* BRIDE & GROOM PROFILE SECTION */}
                    <section
                        id="couple"
                        className="relative z-10 mb-10 mt-20 flex w-full flex-col items-center justify-start overflow-x-clip bg-transparent pb-32 pt-16"
                    >
                        {/* LAYER: Background Castle */}
                        <div
                            className="pointer-events-none absolute left-0 right-0 z-30 h-[250px] bg-[length:100%_auto] bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-ornamen-768x335.webp')",
                                bottom: '-65px', // <--- UBAH NILAI INI (misal: '80px', '100px') untuk menaikkan/menurunkan kastil
                            }}
                        />

                        {/* Bottom Border */}

                        {/* Header & Subheader */}
                        <motion.div
                            className="relative z-20 mb-12 flex flex-col items-center space-y-4 px-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={fadeUpVariants}
                        >
                            <h2
                                className="text-5xl font-normal leading-none md:text-6xl"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: primaryColor,
                                }}
                            >
                                Bride & Groom
                            </h2>
                            <p
                                className="max-w-[340px] text-xs font-semibold leading-relaxed text-[#3E2723]/80"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Tanpa mengurangi rasa hormat, kami mengundang
                                Bapak/Ibu/Saudara/i serta kerabat sekalian untuk
                                menghadiri acara pernikahan kami.
                            </p>
                        </motion.div>

                        {/* Profiles Container */}
                        <div className="relative z-20 flex w-full flex-col items-center space-y-12 px-6">
                            {/* GROOM (Mempelai Pria) */}
                            <motion.div
                                className="flex w-full max-w-[320px] flex-col items-center space-y-4 text-center"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={scaleInVariants}
                            >
                                {/* Framed Image */}
                                <div className="aspect-[3/4] w-[85%] max-w-[240px] overflow-hidden">
                                    <img
                                        src={getGroomPhoto()}
                                        alt={
                                            groom.fullName ||
                                            groom.name ||
                                            'Habib Yulianto'
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                {/* Name */}
                                <h3
                                    className="text-4xl font-normal leading-tight"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    {groom.fullName ||
                                        groom.name ||
                                        'Habib Yulianto'}
                                </h3>

                                {/* Parent Info */}
                                <p
                                    className="max-w-[280px] text-xs font-semibold leading-relaxed text-[#3E2723]/80"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                    }}
                                >
                                    {getGroomParents(groom)}
                                </p>

                                {/* Instagram Icon */}
                                {(groom.instagram || groom.ig) && (
                                    <a
                                        href={`https://instagram.com/${(groom.instagram || groom.ig).replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-110"
                                        style={{
                                            backgroundColor: primaryColor,
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            fill="none"
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
                                    </a>
                                )}
                            </motion.div>

                            {/* Separator Ampersand */}
                            <motion.div
                                className="text-5xl font-normal italic"
                                style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    color: primaryColor,
                                }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={fadeUpVariants}
                            >
                                &
                            </motion.div>

                            {/* BRIDE (Mempelai Wanita) */}
                            <motion.div
                                className="flex w-full max-w-[320px] flex-col items-center space-y-4 text-center"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={scaleInVariants}
                            >
                                {/* Framed Image */}
                                <div className="aspect-[3/4] w-[85%] max-w-[240px] overflow-hidden">
                                    <img
                                        src={getBridePhoto()}
                                        alt={
                                            bride.fullName ||
                                            bride.name ||
                                            'Adiba'
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                {/* Name */}
                                <h3
                                    className="text-4xl font-normal leading-tight"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    {bride.fullName || bride.name || 'Adiba'}
                                </h3>

                                {/* Parent Info */}
                                <p
                                    className="max-w-[280px] text-xs font-semibold leading-relaxed text-[#3E2723]/80"
                                    style={{
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                    }}
                                >
                                    {getBrideParents(bride)}
                                </p>

                                {/* Instagram Icon */}
                                {(bride.instagram || bride.ig) && (
                                    <a
                                        href={`https://instagram.com/${(bride.instagram || bride.ig).replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-110"
                                        style={{
                                            backgroundColor: primaryColor,
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            fill="none"
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
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </section>
                    {/* DECORATIVE COUPLE ILLUSTRATION SECTION */}
                    <section className="relative z-10 flex w-full flex-col items-center justify-center bg-[#FAF7F2] py-12">
                        {/* Top Border */}
                        <div
                            className="pointer-events-none absolute left-0 right-0 top-0 h-[100%] w-[100%] scale-[1.1] bg-contain bg-repeat-x"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/batas2.webp')",
                            }}
                        />

                        {/* Muslim Couple Image */}
                        <motion.div
                            className="z-20 my-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeUpVariants}
                        >
                            <img
                                src="/assets/theme_2/muslim-couple4.webp"
                                alt="Muslim Couple Illustration"
                                className="h-full w-full object-contain"
                            />
                        </motion.div>

                        {/* Bottom Border */}
                        <div
                            className="pointer-events-none absolute -bottom-[100%] left-0 right-0 h-[100%] w-[100%] scale-[1.1] bg-contain bg-repeat-x"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/batas2.webp')",
                            }}
                        />
                    </section>
                    {/* COUNTDOWN SECTION */}
                    <section
                        id="countdown"
                        className="relative mt-20 overflow-hidden bg-transparent px-6 py-12"
                    >
                        <div
                            className="absolute -left-10 top-[50%] z-0 h-40 w-24 -translate-y-1/2 bg-contain bg-left bg-no-repeat opacity-30 sm:h-48 sm:w-32"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-bunga1.webp')",
                            }}
                        />
                        <div
                            className="absolute -right-12 top-0 z-0 h-56 w-40 bg-contain bg-top bg-no-repeat opacity-30 sm:h-64 sm:w-48"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-bunga1.webp')",
                            }}
                        />

                        <motion.div
                            className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center space-y-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            {/* Heading */}
                            <motion.div
                                variants={fadeUpVariants}
                                className="space-y-1"
                            >
                                <h2
                                    className="text-5xl font-normal leading-none"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Save The Date
                                </h2>
                            </motion.div>

                            {/* Countdown Cards */}
                            <motion.div
                                variants={scaleInVariants}
                                className="w-full"
                            >
                                <Theme2Countdown targetDate={weddingDate} />
                            </motion.div>

                            {/* Description Text */}
                            <motion.p
                                variants={fadeUpVariants}
                                className="max-w-[340px] px-4 text-xs font-semibold leading-relaxed text-[#3E2723]/80"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            >
                                Dan kami bersyukur, dipertemukan Allah di waktu
                                terbaik, Kini kami menanti hari istimewa kami.
                            </motion.p>
                        </motion.div>
                    </section>
                    {/* SCHEDULE SECTION */}
                    <section
                        id="schedule"
                        className="relative bg-transparent px-6 py-12"
                    >
                        <motion.div
                            className="mx-auto w-full max-w-lg space-y-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <div className="relative space-y-10">
                                {schedules.akad && (
                                    <motion.div
                                        variants={fadeUpVariants}
                                        className="relative flex min-h-[580px] flex-col justify-center px-10 py-16 text-center"
                                    >
                                        <div
                                            className="absolute z-0 bg-[length:130%_100%] bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_2/border2.png')",
                                                top: '-5%',
                                                bottom: '-5%',
                                                left: '0',
                                                right: '0',
                                            }}
                                        />
                                        <div className="relative z-10 space-y-5 text-[#3E2723]">
                                            {/* Title */}
                                            <div className="space-y-1">
                                                <h3
                                                    className="text-4xl font-normal"
                                                    style={{
                                                        color: primaryColor,
                                                        fontFamily:
                                                            "'Dancing Script', cursive",
                                                    }}
                                                >
                                                    Akad Nikah
                                                </h3>
                                            </div>

                                            {/* Date */}
                                            <p
                                                className="text-base font-bold"
                                                style={{
                                                    color: primaryColor,
                                                    fontFamily:
                                                        "'Cormorant Garamond', serif",
                                                }}
                                            >
                                                {formatDate(
                                                    schedules.akad.date,
                                                )}
                                            </p>

                                            {/* Time */}
                                            <p className="text-xs font-bold text-gray-700">
                                                Pukul :{' '}
                                                {schedules.akad.time ||
                                                    '08:00 WIB'}
                                            </p>

                                            {/* Divider Line */}
                                            <div className="relative mx-auto my-3 flex w-[80%] items-center justify-center">
                                                <div className="h-[1px] w-[45%] bg-gray-400/50" />
                                                <MapPin
                                                    className="mx-2"
                                                    size={14}
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                />
                                                <div className="h-[1px] w-[45%] bg-gray-400/50" />
                                            </div>

                                            {/* Venue & Address */}
                                            <div className="space-y-1 text-gray-700">
                                                <p className="text-xs font-bold">
                                                    Tempat :{' '}
                                                    <span className="font-extrabold uppercase">
                                                        {schedules.akad.venue ||
                                                            'KEDIAMAN MEMPELAI WANITA'}
                                                    </span>
                                                </p>
                                                <p className="mx-auto max-w-[290px] text-[11px] font-bold leading-relaxed opacity-80">
                                                    {schedules.akad.address}
                                                </p>
                                            </div>

                                            {/* Button */}
                                            {schedules.akad.maps && (
                                                <div className="pt-2">
                                                    <a
                                                        href={
                                                            schedules.akad.maps
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-full px-8 py-2 text-xs font-bold uppercase text-white shadow-md transition-all hover:scale-105 active:scale-95"
                                                        style={{
                                                            backgroundColor:
                                                                '#9E4B57',
                                                        }}
                                                    >
                                                        <MapPin size={12} />
                                                        <span>
                                                            LIHAT LOKASI
                                                        </span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {schedules.resepsi && (
                                    <motion.div
                                        variants={fadeUpVariants}
                                        className="relative flex min-h-[580px] flex-col justify-center px-10 py-16 text-center"
                                    >
                                        <div
                                            className="absolute z-0 bg-[length:130%_100%] bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage:
                                                    "url('/assets/theme_2/border2.png')",
                                                top: '-5%',
                                                bottom: '-5%',
                                                left: '0',
                                                right: '0',
                                            }}
                                        />
                                        <div className="relative z-10 space-y-5 text-[#3E2723]">
                                            {/* Title */}
                                            <div className="space-y-1">
                                                <h3
                                                    className="text-4xl font-normal"
                                                    style={{
                                                        color: primaryColor,
                                                        fontFamily:
                                                            "'Dancing Script', cursive",
                                                    }}
                                                >
                                                    Resepsi
                                                </h3>
                                            </div>

                                            {/* Date */}
                                            <p
                                                className="text-base font-bold"
                                                style={{
                                                    color: primaryColor,
                                                    fontFamily:
                                                        "'Cormorant Garamond', serif",
                                                }}
                                            >
                                                {formatDate(
                                                    schedules.resepsi.date,
                                                )}
                                            </p>

                                            {/* Time */}
                                            <p className="text-xs font-bold text-gray-700">
                                                Pukul :{' '}
                                                {schedules.resepsi.time ||
                                                    '10:00 WIB - Selesai'}
                                            </p>

                                            {/* Divider Line */}
                                            <div className="relative mx-auto my-3 flex w-[80%] items-center justify-center">
                                                <div className="h-[1px] w-[45%] bg-gray-400/50" />
                                                <MapPin
                                                    className="mx-2"
                                                    size={14}
                                                    style={{
                                                        color: primaryColor,
                                                    }}
                                                />
                                                <div className="h-[1px] w-[45%] bg-gray-400/50" />
                                            </div>

                                            {/* Venue & Address */}
                                            <div className="space-y-1 text-gray-700">
                                                <p className="text-xs font-bold">
                                                    Tempat :{' '}
                                                    <span className="font-extrabold uppercase">
                                                        {schedules.resepsi
                                                            .venue ||
                                                            'KEDIAMAN MEMPELAI WANITA'}
                                                    </span>
                                                </p>
                                                <p className="mx-auto max-w-[290px] text-[11px] font-bold leading-relaxed opacity-80">
                                                    {schedules.resepsi.address}
                                                </p>
                                            </div>

                                            {/* Button */}
                                            {schedules.resepsi.maps && (
                                                <div className="pt-2">
                                                    <a
                                                        href={
                                                            schedules.resepsi
                                                                .maps
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-full px-8 py-2 text-xs font-bold uppercase text-white shadow-md transition-all hover:scale-105 active:scale-95"
                                                        style={{
                                                            backgroundColor:
                                                                '#9E4B57',
                                                        }}
                                                    >
                                                        <MapPin size={12} />
                                                        <span>
                                                            LIHAT LOKASI
                                                        </span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </section>
                    {/* LOVE STORY SECTION */}
                    {stories.length > 0 && (
                        <section
                            id="story"
                            className="relative bg-transparent pb-20 pt-16"
                        >
                            {/* Top Border */}
                            <div
                                className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-[100%] bg-contain bg-repeat-x"
                                style={{
                                    backgroundImage:
                                        "url('/assets/theme_2/batas2.webp')",
                                }}
                            />

                            {/* Flower Garland */}
                            <div
                                className="top-10 pointer-events-none absolute left-0 right-0 z-0 h-[140px] w-full bg-top bg-no-repeat"
                                style={{
                                    backgroundImage:
                                        "url('/assets/theme_2/VINTAGE-06-bunga3-2048x648.webp')",
                                    backgroundSize: '110% 100%',
                                }}
                            />

                            <motion.div
                                className="relative z-20 mx-auto w-full max-w-md space-y-12 pt-20 text-center"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={containerVariants}
                            >
                                <motion.div variants={fadeUpVariants}>
                                    <h2
                                        className="text-5xl font-normal leading-none"
                                        style={{
                                            fontFamily:
                                                "'Dancing Script', cursive",
                                            color: primaryColor,
                                        }}
                                    >
                                        Love Story
                                    </h2>
                                </motion.div>

                                <div className="space-y-10">
                                    {stories.map((story: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            variants={fadeUpVariants}
                                            className="mx-auto max-w-sm space-y-2 px-6 text-center"
                                        >
                                            <h3
                                                className="font-serif text-lg font-bold"
                                                style={{ color: primaryColor }}
                                            >
                                                {story.title}
                                            </h3>
                                            <p
                                                className="px-4 text-xs font-semibold leading-relaxed text-[#3E2723]/80 sm:text-[13px]"
                                                style={{
                                                    fontFamily:
                                                        "'Cormorant Garamond', serif",
                                                }}
                                            >
                                                {story.content || story.story}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>
                    )}
                    {/* STREAMING SECTION */}
                    <section
                        id="streaming"
                        className="relative overflow-hidden bg-transparent px-6 pb-48 pt-16"
                    >
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm space-y-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <motion.div variants={fadeUpVariants}>
                                <h2
                                    className="text-[3.5rem] font-normal leading-none"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: primaryColor,
                                    }}
                                >
                                    Live Streaming
                                </h2>
                            </motion.div>

                            <motion.p
                                variants={fadeUpVariants}
                                className="px-4 font-serif text-[13px] font-semibold leading-relaxed text-gray-700"
                            >
                                Kami mengundang Bapak/Ibu/Saudara/i untuk
                                menyaksikan pernikahan kami secara virtual yang
                                disiarkan langsung melalui media sosial di bawah
                                ini
                            </motion.p>

                            <motion.div
                                variants={fadeUpVariants}
                                className="space-y-1"
                            >
                                <p
                                    className="text-base font-bold"
                                    style={{
                                        color: primaryColor,
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                    }}
                                >
                                    {schedules.akad?.date
                                        ? formatDate(schedules.akad.date)
                                        : 'Senin, 28 Desember 2026'}
                                </p>
                                <p
                                    className="text-xs font-semibold"
                                    style={{
                                        color: primaryColor,
                                        fontFamily:
                                            "'Cormorant Garamond', serif",
                                    }}
                                >
                                    Pukul : {schedules.akad?.time || '08:00'}{' '}
                                    WIB
                                </p>
                            </motion.div>

                            <motion.div
                                variants={scaleInVariants}
                                className="pt-2"
                            >
                                <a
                                    href={
                                        data?.streaming?.url ||
                                        'https://instagram.com'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full px-8 py-2 text-xs font-bold uppercase text-white shadow-md transition-all hover:scale-105 active:scale-95"
                                    style={{ backgroundColor: '#9E4B57' }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        fill="none"
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
                                    <span>
                                        {data?.streaming?.username
                                            ? data.streaming.username.startsWith(
                                                '@',
                                            )
                                                ? data.streaming.username
                                                : `@${data.streaming.username}`
                                            : '@HABIB'}
                                    </span>
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Castle Background */}
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[220px] bg-[length:100%_auto] bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-ornamen-768x335.webp')",
                            }}
                        />

                        {/* Bottom Border */}
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[100%] bg-contain bg-bottom bg-repeat-x"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/batas2.webp')",
                            }}
                        />
                    </section>
                    {/* RSVP & WISHES SECTION */}
                    <section
                        id="rsvp-wishes"
                        className="relative overflow-x-clip overflow-y-visible bg-transparent px-6 py-24"
                    >
                        {/* Background Ornament Watermark */}
                        <div
                            className="pointer-events-none absolute left-1/2 top-20 z-0 h-[600px] w-[150%] max-w-none -translate-x-1/2 bg-center bg-no-repeat opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-ornamen.webp')",
                                backgroundSize: 'contain',
                            }}
                        />

                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-lg space-y-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <div className="flex justify-center pb-2">
                                <img
                                    src="/assets/theme_2/VINTAGE-06-bunga1.webp"
                                    className="w-[85px] drop-shadow-md"
                                    alt="Flower Garland"
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-[3.25rem] font-normal leading-[1.1] tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: '#3E2723',
                                    }}
                                >
                                    Konfirmasi Kehadiran
                                    <br />
                                    Anda
                                </h2>
                            </div>
                            <p
                                className="px-4 font-serif text-[13px] font-semibold leading-relaxed"
                                style={{ color: '#3E2723' }}
                            >
                                Mohon berkenan mengonfirmasi kehadiran Anda
                                sebagai bagian dari kebahagiaan yang akan kami
                                rayakan bersama.
                            </p>
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mt-12 rounded-[2rem] border-4 border-double border-[#C9A84C]/60 bg-[#FAF3EC] px-6 py-12 shadow-2xl"
                            >
                                <CustomRSVPForm onRsvpSubmit={onRsvpSubmit} />
                            </motion.div>
                        </motion.div>

                        <div className="h-32 md:h-40"></div>

                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-lg space-y-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <div className="flex justify-center pb-2">
                                <img
                                    src="/assets/theme_2/VINTAGE-06-bunga1.webp"
                                    className="w-[85px] drop-shadow-md"
                                    alt="Flower Garland"
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-[3.25rem] font-normal leading-[1.1] tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: '#3E2723',
                                    }}
                                >
                                    Ucapan & Doa
                                </h2>
                            </div>
                            <p
                                className="px-4 font-serif text-[13px] font-semibold leading-relaxed"
                                style={{ color: '#3E2723' }}
                            >
                                Setiap doa, harapan, dan ucapan yang Anda
                                titipkan akan menjadi kenangan berharga dalam
                                perjalanan kami bersama
                            </p>
                            <motion.div
                                variants={scaleInVariants}
                                className="relative mt-12 rounded-[2rem] border-4 border-double border-[#C9A84C]/60 bg-[#FAF3EC] px-6 py-12 shadow-2xl"
                            >
                                <CustomWishesForm
                                    initialWishes={wishes}
                                    onRsvpSubmit={onRsvpSubmit}
                                />
                            </motion.div>
                        </motion.div>
                    </section>
                    {/* Elegant Divider */}
                    <div className="relative z-20 mx-auto my-6 flex w-full max-w-lg items-center justify-center px-6">
                        <div className="h-[1px] flex-1 bg-[#C9A84C]/40" />
                        <img
                            src="/assets/theme_2/VINTAGE-06-bunga1.webp"
                            className="mx-4 w-12 opacity-80 drop-shadow-sm"
                            alt="Divider Flower"
                        />
                        <div className="h-[1px] flex-1 bg-[#C9A84C]/40" />
                    </div>
                    {/* GALLERY SECTION */}
                    <section
                        id="gallery"
                        className="relative overflow-x-clip overflow-y-visible bg-transparent px-6 py-20"
                    >
                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-sm space-y-8 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
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

                            <div className="relative pt-4">
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
                    </section>{' '}
                    {/* GIFT SECTION */}
                    <section
                        id="gift"
                        className="relative overflow-x-clip overflow-y-visible bg-transparent px-4 pb-72 pt-24"
                    >
                        {/* Background Ornament Watermark */}
                        <div
                            className="pointer-events-none absolute left-1/2 top-20 z-0 h-[600px] w-[150%] max-w-none -translate-x-1/2 bg-center bg-no-repeat opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-ornamen.webp')",
                                backgroundSize: 'contain',
                            }}
                        />

                        <motion.div
                            className="relative z-10 mx-auto w-full max-w-lg text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <div className="flex justify-center pb-2">
                                <img
                                    src="/assets/theme_2/VINTAGE-06-bunga1.webp"
                                    className="w-[85px] drop-shadow-md"
                                    alt="Flower Garland"
                                />
                            </div>
                            <div>
                                <h2
                                    className="text-[5.5rem] font-normal tracking-wide"
                                    style={{
                                        fontFamily: "'Dancing Script', cursive",
                                        color: '#3E2723',
                                        lineHeight: '0.8',
                                    }}
                                >
                                    Gift
                                </h2>
                            </div>
                            <p className="mx-auto mt-6 max-w-[280px] px-4 font-serif text-[10px] font-semibold leading-tight text-[#3E2723] opacity-90">
                                For those of you who want to give a token of
                                <br />
                                love to the bride and groom, you can use the
                                <br />
                                account number below:
                            </p>

                            <div className="relative mt-32">
                                <div className="pointer-events-none absolute -top-[130px] left-0 right-0 z-0 flex justify-center opacity-[0.35]"></div>
                                <div className="relative z-10 mx-2 mb-8 mt-8 flex items-center justify-center gap-6 border-b border-[#3E2723]/15 pb-0">
                                    <button
                                        onClick={() => setGiftTab('bank')}
                                        className={`pb-2 text-[9px] font-bold tracking-widest ${giftTab === 'bank' ? '-mb-[1px] border-b-[2px] border-[#3E2723]' : 'text-[#3E2723]/40'}`}
                                        style={
                                            giftTab === 'bank'
                                                ? { color: '#3E2723' }
                                                : {}
                                        }
                                    >
                                        TRANSFER BANK
                                    </button>
                                    <button
                                        onClick={() => setGiftTab('address')}
                                        className={`pb-2 text-[9px] font-bold tracking-widest ${giftTab === 'address' ? '-mb-[1px] border-b-[2px] border-[#3E2723]' : 'text-[#3E2723]/40'}`}
                                        style={
                                            giftTab === 'address'
                                                ? { color: '#3E2723' }
                                                : {}
                                        }
                                    >
                                        KIRIM KADO
                                    </button>
                                </div>

                                <div className="relative z-10 space-y-6 px-2">
                                    {giftTab === 'bank' ? (
                                        <>
                                            <div className="rounded-[1.25rem] border border-[#C9A84C]/40 bg-[#FAF3EC] px-4 py-6 text-left shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
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
                                                                color: '#3E2723',
                                                            }}
                                                        >
                                                            BNI
                                                        </span>
                                                    </div>
                                                    <CreditCard
                                                        size={22}
                                                        className="text-[#3E2723]/40"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <p
                                                        className="text-[7.5px] font-bold uppercase tracking-[0.2em]"
                                                        style={{
                                                            color: '#3E2723',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        NOMOR REKENING
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p
                                                            className="font-sans text-[1.5rem] font-bold tracking-wider"
                                                            style={{
                                                                color: '#3E2723',
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
                                                                borderColor:
                                                                    '#3E272325',
                                                                color: '#3E2723',
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
                                                            color: '#3E2723',
                                                        }}
                                                    >
                                                        a.n Ananda
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-[1.25rem] border border-[#C9A84C]/40 bg-[#FAF3EC] px-4 py-6 text-left shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
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
                                                                color: '#3E2723',
                                                            }}
                                                        >
                                                            MANDIRI
                                                        </span>
                                                    </div>
                                                    <CreditCard
                                                        size={22}
                                                        className="text-[#3E2723]/40"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <p
                                                        className="text-[7.5px] font-bold uppercase tracking-[0.2em]"
                                                        style={{
                                                            color: '#3E2723',
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        NOMOR REKENING
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p
                                                            className="font-sans text-[1.5rem] font-bold tracking-wider"
                                                            style={{
                                                                color: '#3E2723',
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
                                                                borderColor:
                                                                    '#3E272325',
                                                                color: '#3E2723',
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
                                                            color: '#3E2723',
                                                        }}
                                                    >
                                                        a.n WRTY
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center rounded-[1.25rem] border border-[#C9A84C]/40 bg-[#FAF3EC] px-4 py-10 text-center shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
                                            <h4
                                                className="font-serif text-[2.25rem]"
                                                style={{ color: '#3E2723' }}
                                            >
                                                Ilyas & Iftitah
                                            </h4>
                                            <p
                                                className="mb-10 mt-2 max-w-[200px] font-serif text-[9px] font-bold leading-relaxed opacity-80"
                                                style={{ color: '#3E2723' }}
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
                                                    className="flex w-full items-center justify-center gap-2 border border-[#3E2723]/20 py-3 transition-all hover:bg-[#3E2723]/5 active:scale-95"
                                                >
                                                    {copiedAddress ? (
                                                        <Check
                                                            size={12}
                                                            className="text-[#3E2723]"
                                                        />
                                                    ) : (
                                                        <Copy
                                                            size={10}
                                                            className="text-[#3E2723]"
                                                        />
                                                    )}
                                                    <span className="text-[7px] font-bold uppercase tracking-widest text-[#3E2723]">
                                                        {copiedAddress
                                                            ? 'TERSALIN'
                                                            : 'SALIN ALAMAT'}
                                                    </span>
                                                </button>
                                                <button className="flex w-full items-center justify-center border border-[#3E2723]/20 py-3 transition-all hover:bg-[#3E2723]/5 active:scale-95">
                                                    <span className="text-[7px] font-bold uppercase tracking-widest text-[#3E2723]">
                                                        LIHAT PETA
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {showConfirmationForm ? (
                                    <div className="relative z-10 mx-2 mt-8">
                                        <div className="rounded-[1.25rem] border border-[#C9A84C]/40 bg-[#FAF3EC] px-4 py-8 text-left shadow-[0_4px_20px_-10px_rgba(122,34,62,0.15)] backdrop-blur-md">
                                            <div className="mb-6 flex items-center justify-between">
                                                <h4
                                                    className="font-serif text-[1.6rem]"
                                                    style={{ color: '#3E2723' }}
                                                >
                                                    Konfirmasi
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        setShowConfirmationForm(
                                                            false,
                                                        )
                                                    }
                                                    className="text-[6.5px] font-bold uppercase tracking-widest text-[#3E2723]/50 hover:text-[#3E2723]"
                                                >
                                                    TUTUP
                                                </button>
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="NAMA ANDA"
                                                        className="w-full border-b border-[#3E2723]/25 bg-transparent pb-2 font-serif text-[10px] uppercase tracking-wide text-[#3E2723] placeholder-[#3E2723]/50 focus:border-[#3E2723] focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="BANK TUJUAN"
                                                        className="w-full border-b border-[#3E2723]/25 bg-transparent pb-2 font-serif text-[10px] uppercase tracking-wide text-[#3E2723] placeholder-[#3E2723]/50 focus:border-[#3E2723] focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex items-end border-b border-[#3E2723]/25 pb-2">
                                                    <span className="mb-[1px] mr-3 font-serif text-[10px] font-bold text-[#3E2723]">
                                                        Rp
                                                    </span>
                                                    <input
                                                        type="number"
                                                        placeholder="NOMINAL"
                                                        className="w-full bg-transparent font-serif text-[10px] uppercase tracking-wide text-[#3E2723] placeholder-[#3E2723]/50 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <button className="mt-8 w-full bg-[#3E2723] py-3.5 text-[8px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#3E2723]/90 active:scale-95">
                                                KONFIRMASI KE DASHBOARD
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative z-10 flex w-full justify-center px-6 pb-2 pt-12">
                                        <div className="w-full border-t border-[#3E2723]/15 pt-5 text-center">
                                            <button
                                                onClick={() =>
                                                    setShowConfirmationForm(
                                                        true,
                                                    )
                                                }
                                                className="inline-block border-b border-[#3E2723]/40 pb-1 text-[7.5px] font-bold uppercase tracking-widest"
                                                style={{ color: '#3E2723' }}
                                            >
                                                SUDAH MENGIRIM KADO? KONFIRMASI
                                                DI SINI
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                        <div className="pointer-events-none absolute bottom-0 left-0 z-0 flex w-full justify-center opacity-[0.25]"></div>
                    </section>
                    {/* FOOTER SECTION */}
                    <footer
                        id="footer"
                        className="relative mt-[-1px] overflow-hidden bg-transparent px-0 pb-0 pt-16 text-center"
                    >
                        <div
                            className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-[100%] bg-contain bg-repeat-x"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/batas2.webp')",
                            }}
                        />

                        {/* Flower Garland */}
                        <div
                            className="top-10 pointer-events-none absolute left-0 right-0 z-0 h-[140px] w-full bg-top bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/assets/theme_2/VINTAGE-06-bunga3-2048x648.webp')",
                                backgroundSize: '110% 100%',
                            }}
                        />

                        <motion.div
                            className="relative z-10 mx-auto mt-20 flex w-full max-w-sm flex-col items-center px-6 text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={containerVariants}
                        >
                            <h2
                                className="mb-6 text-[4.5rem] font-normal tracking-wide drop-shadow-sm"
                                style={{ color: primaryColor }}
                            >
                                See You
                            </h2>
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
                            <div className="relative mb-6 flex h-44 w-44 items-center justify-center">
                                <span
                                    className="absolute font-serif text-[5rem] italic leading-none opacity-40 drop-shadow-[2px_4px_10px_rgba(122,34,62,0.3)] pt-1"
                                    style={{ color: primaryColor }}
                                >
                                    {'&'}
                                </span>
                                <div className="relative z-10 -ml-4 flex items-center justify-center">
                                    <span
                                        className="pr-5 font-serif text-[5.5rem] italic leading-none drop-shadow-[2px_4px_10px_rgba(122,34,62,0.3)]"
                                        style={{ color: primaryColor }}
                                    >
                                        I
                                    </span>
                                    <span
                                        className="pt-12 font-serif text-[5.5rem] italic leading-none drop-shadow-[2px_4px_10px_rgba(122,34,62,0.3)]"
                                        style={{ color: primaryColor }}
                                    >
                                        I
                                    </span>
                                </div>
                            </div>
                            <p className="mb-8 font-serif text-[8.5px] font-bold uppercase tracking-widest text-[#7A223E]">
                                MONDAY, 21 SEPTEMBER 2026
                            </p>
                            <div className="-mb-2 flex w-full max-w-[260px] justify-center"></div>
                            <h3
                                className="mb-12 font-serif text-[2.2rem]"
                                style={{ color: primaryColor }}
                            >
                                Ilyas & Iftitah
                            </h3>
                        </motion.div>

                        <div className="relative z-20 flex w-full items-center justify-center gap-4 rounded-t-[1.5rem] bg-[#4A1728] py-4 text-center text-[#FDF5F6] shadow-lg">
                            <span className="text-[6px] font-bold uppercase tracking-[0.25em] opacity-90">
                                POWERED BY NGATURI
                            </span>
                            <span className="text-[6px] font-bold opacity-60">
                                •
                            </span>
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


                {/* FLOATING BUTTONS */}
                {isOpened && (
                    <>
                        <button
                            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                            className="absolute bottom-20 left-6 z-[99] flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-[#C9A84C]/40 bg-[#3A322C] shadow-[0_4px_20px_-5px_rgba(58,5,17,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
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

                        <button
                            onClick={() => setIsQrisModalOpen(true)}
                            className="absolute bottom-36 left-6 z-[99] rounded-full border border-[#C9A84C]/35 bg-white p-3.5 text-[#4A3B32] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                            title="QRIS"
                        >
                            <QrCode size={20} />
                        </button>

                        {guestName && (
                            <button
                                onClick={() => setIsQrModalOpen(true)}
                                className="absolute bottom-36 right-6 z-[99] rounded-full border border-[#C9A84C]/35 bg-[#4A3B32] p-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                                title="Akses Masuk QR"
                            >
                                <QrCode size={20} />
                            </button>
                        )}

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="absolute bottom-20 right-6 z-[99] rounded-full border border-sand/35 bg-white p-3.5 text-[#4A3B32] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                            title="Menu"
                        >
                            <Menu size={20} />
                        </button>
                    </>
                )}

                {/* NAVIGATION MENU */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="absolute inset-0 z-[100] flex select-none flex-col items-center justify-center bg-[#2D1A1E]/95 p-8 text-center backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
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

                {/* QR MODAL */}
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
                                <div
                                    className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border-2 bg-neutral-50 p-3.5 shadow-inner"
                                    style={{ borderColor: `${primaryColor}20` }}
                                >
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="h-full w-full text-[#4A3B32]"
                                    >
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

                {/* QRIS MODAL */}
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
                                        A.N. Ilyas & IFTITAH
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Theme2;
