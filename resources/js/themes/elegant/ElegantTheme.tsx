import type { WeddingData } from '@wedding/shared';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Clock, Heart, MapPin } from 'lucide-react';
import React from 'react';
import CountdownTimer from '../reusable/CountdownTimer';
import GuestWishes from '../reusable/GuestWishes';
import MapEmbed from '../reusable/MapEmbed';
import PhotoGallery from '../reusable/PhotoGallery';
import RSVPForm from '../reusable/RSVPForm';
import StackingSection from '../reusable/StackingSection';

export interface ThemeProps {
    data: WeddingData | any;
    weddingId: string;
    photos?: any[];
    guestName?: string;
    guestToken?: string;
    wishes: any[];
    onRsvpSubmit: (rsvpStatus: string, message: string) => Promise<void>;
}

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

const childFadeUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: 'easeOut' as any },
    },
};

const childScaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: 'easeOut' as any },
    },
};

export const ElegantTheme: React.FC<ThemeProps> = ({
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

    const formatDate = (d?: string) =>
        d
            ? new Date(d).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : '-';

    const getParents = (p: any) =>
        p.fatherName && p.motherName
            ? `Putra/i dari Bpk. ${p.fatherName} & Ibu ${p.motherName}`
            : p.parents || '';

    const custom = data?.customStyle || {};
    const primaryColor = custom.primaryColor || '#C9A84C';
    const baseBg = custom.baseBg || '#FAF7F2';
    const textColor = custom.textColor || '#2C2C2C';

    const titleFontFamily =
        custom.titleFont === 'font-sans'
            ? "'Poppins', sans-serif"
            : custom.titleFont === 'font-cursive'
              ? "'Dancing Script', cursive"
              : "'Cormorant Garamond', Georgia, serif";

    const bodyFontFamily =
        custom.bodyFont === 'font-serif'
            ? "'Lora', serif"
            : "'Poppins', sans-serif";

    return (
        <div
            id={`wedding-theme-elegant-${weddingId}`}
            className="relative select-none bg-[#FAF7F2] font-sans text-[#2C2C2C]"
        >
            <style>{`
        #wedding-theme-elegant-${weddingId} {
          --primary-color: ${primaryColor};
          --base-bg: ${baseBg};
          --text-color: ${textColor};
          --font-title: ${titleFontFamily};
          --font-body: ${bodyFontFamily};
        }
        #wedding-theme-elegant-${weddingId} .text-\\[\\#C9A84C\\] { color: var(--primary-color) !important; }
        #wedding-theme-elegant-${weddingId} .text-\\[\\#C9A84C\\]\\/70 { color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.7) !important; }
        #wedding-theme-elegant-${weddingId} .bg-\\[\\#C9A84C\\] { background-color: var(--primary-color) !important; }
        #wedding-theme-elegant-${weddingId} .bg-\\[\\#C9A84C\\]\\/10 { background-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1) !important; }
        #wedding-theme-elegant-${weddingId} .border-\\[\\#C9A84C\\] { border-color: var(--primary-color) !important; }
        #wedding-theme-elegant-${weddingId} .border-\\[\\#C9A84C\\]\\/15 { border-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.15) !important; }
        #wedding-theme-elegant-${weddingId} .border-\\[\\#C9A84C\\]\\/20 { border-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.20) !important; }
        #wedding-theme-elegant-${weddingId} .border-\\[\\#C9A84C\\]\\/30 { border-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.30) !important; }
        #wedding-theme-elegant-${weddingId} .fill-\\[\\#C9A84C\\] { fill: var(--primary-color) !important; }
        #wedding-theme-elegant-${weddingId} .fill-\\[\\#C9A84C\\]\\/20 { fill: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.2) !important; }
        #wedding-theme-elegant-${weddingId} .via-\\[\\#C9A84C\\] { --tw-gradient-to: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0); --tw-gradient-stops: var(--tw-gradient-from), var(--primary-color) 50%, var(--tw-gradient-to) !important; }
        #wedding-theme-elegant-${weddingId} .to-\\[\\#C9A84C\\]\\/30 { --tw-gradient-to: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3) !important; }
        #wedding-theme-elegant-${weddingId} .from-\\[\\#C9A84C\\]\\/30 { --tw-gradient-from: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.3) !important; }
        #wedding-theme-elegant-${weddingId} .bg-\\[\\#FAF7F2\\] { background-color: var(--base-bg) !important; }
        #wedding-theme-elegant-${weddingId} .bg-\\[\\#FAF7F2\\]\\/10 { background-color: rgba(${parseInt(baseBg.slice(1, 3), 16)}, ${parseInt(baseBg.slice(3, 5), 16)}, ${parseInt(baseBg.slice(5, 7), 16)}, 0.1) !important; }
        #wedding-theme-elegant-${weddingId} .bg-\\[\\#FAF7F2\\]\\/20 { background-color: rgba(${parseInt(baseBg.slice(1, 3), 16)}, ${parseInt(baseBg.slice(3, 5), 16)}, ${parseInt(baseBg.slice(5, 7), 16)}, 0.2) !important; }
        #wedding-theme-elegant-${weddingId} .bg-\\[\\#FAF7F2\\]\\/60 { background-color: rgba(${parseInt(baseBg.slice(1, 3), 16)}, ${parseInt(baseBg.slice(3, 5), 16)}, ${parseInt(baseBg.slice(5, 7), 16)}, 0.6) !important; }
        #wedding-theme-elegant-${weddingId} .text-\\[\\#2C2C2C\\] { color: var(--text-color) !important; }
        #wedding-theme-elegant-${weddingId} .text-\\[\\#2C2C2C\\]\\/60 { color: rgba(${parseInt(textColor.slice(1, 3), 16)}, ${parseInt(textColor.slice(3, 5), 16)}, ${parseInt(textColor.slice(5, 7), 16)}, 0.6) !important; }
        #wedding-theme-elegant-${weddingId} .font-serif { font-family: var(--font-title) !important; }
        #wedding-theme-elegant-${weddingId} .font-sans { font-family: var(--font-body) !important; }
      `}</style>

            {/* ═══════════════════════ SECTION 1: COVER / HERO ═══════════════════════ */}
            <StackingSection
                id="hero"
                zIndex={10}
                bg="#FAF7F2"
                roundedVal="0px"
            >
                {/* Hero floral background */}
                <img
                    src="/assets/wedding/hero-floral.png"
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
                />
                {/* Overlay gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/20 via-[#FAF7F2]/10 to-[#FAF7F2]/60" />

                <motion.div
                    className="relative z-10 space-y-5 px-6 py-24"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.span
                        variants={childFadeUp}
                        className="block text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A84C]"
                    >
                        Walimatul Ursy
                    </motion.span>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto h-px w-10 bg-[#C9A84C]/60"
                    />
                    <motion.h1
                        variants={childFadeUp}
                        className="font-serif text-5xl font-bold leading-tight text-[#2C2C2C] md:text-6xl"
                    >
                        {groom.nickname || groom.name || 'Reza'}
                        <span className="block py-2 text-4xl font-light text-[#C9A84C]">
                            &
                        </span>
                        {bride.nickname || bride.name || 'Salsabila'}
                    </motion.h1>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
                    />
                    <motion.p
                        variants={childFadeUp}
                        className="mx-auto max-w-xs font-serif text-xs italic leading-relaxed text-[#2C2C2C]/60"
                    >
                        "
                        {quotes.text ||
                            'Dan Kami menciptakan kamu berpasang-pasangan'}
                        "
                    </motion.p>
                    {schedules.akad?.date && (
                        <motion.p
                            variants={childFadeUp}
                            className="mt-4 text-sm font-bold tracking-wide text-[#C9A84C]"
                        >
                            {formatDate(schedules.akad.date)}
                        </motion.p>
                    )}
                    <motion.div
                        variants={childFadeUp}
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-8 text-[#C9A84C]/70"
                    >
                        <ChevronDown size={24} className="mx-auto" />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* ═══════════════════════ SECTION 2: COUNTDOWN ═══════════════════════ */}
            <StackingSection
                id="countdown"
                zIndex={20}
                bg="#ffffff"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                {/* Ornament top-right */}
                <img
                    src="/assets/wedding/ornaments.png"
                    alt=""
                    className="pointer-events-none absolute right-0 top-0 w-44 opacity-20"
                    style={{ transform: 'rotate(90deg)' }}
                />

                <motion.div
                    className="mx-auto max-w-xl space-y-4 px-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <motion.span
                        variants={childFadeUp}
                        className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]"
                    >
                        Menghitung Hari Bahagia
                    </motion.span>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto h-px w-8 bg-[#C9A84C]/50"
                    />
                    {schedules.akad?.date && (
                        <motion.div variants={childScaleIn}>
                            <CountdownTimer targetDate={schedules.akad.date} />
                        </motion.div>
                    )}
                </motion.div>
            </StackingSection>

            {/* ═══════════════════════ SECTION 3: COUPLE ═══════════════════════ */}
            <StackingSection
                id="couple"
                zIndex={30}
                bg="#FAF7F2"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    className="mx-auto w-full max-w-2xl space-y-10 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                            Mempelai
                        </span>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#2C2C2C]">
                            Dua Jiwa, Satu Ikatan
                        </h2>
                        <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {[
                            { person: groom, label: 'Mempelai Pria' },
                            { person: bride, label: 'Mempelai Wanita' },
                        ].map(({ person, label }, i) => (
                            <motion.div key={i} variants={childScaleIn}>
                                <div className="space-y-4 rounded-3xl border border-[#C9A84C]/20 bg-white/80 p-7 text-center shadow-sm backdrop-blur transition-shadow hover:shadow-lg">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9A84C]">
                                        {label}
                                    </span>

                                    {/* Avatar */}
                                    <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-[#C9A84C]/30 bg-[#FAF7F2] p-1 shadow-inner">
                                        {person.photoUrl || person.photo ? (
                                            <img
                                                src={
                                                    person.photoUrl ||
                                                    person.photo
                                                }
                                                alt={person.name}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#C9A84C]/10 font-serif text-3xl font-bold text-[#C9A84C]">
                                                {
                                                    (person.nickname ||
                                                        person.name)?.[0]
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-serif text-lg font-bold text-[#2C2C2C]">
                                            {person.fullName || person.name}
                                        </h3>
                                        <p className="mt-1 text-[10px] text-[#2C2C2C]/50">
                                            {getParents(person)}
                                        </p>
                                    </div>

                                    {person.instagram && (
                                        <a
                                            href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A84C] hover:underline"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="13"
                                                height="13"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                            >
                                                <rect
                                                    x="2"
                                                    y="2"
                                                    width="20"
                                                    height="20"
                                                    rx="5"
                                                />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line
                                                    x1="17.5"
                                                    y1="6.5"
                                                    x2="17.51"
                                                    y2="6.5"
                                                />
                                            </svg>
                                            {person.instagram}
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Heart divider center */}
                    <motion.div
                        className="flex items-center gap-4"
                        variants={childFadeUp}
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A84C]/30" />
                        <Heart
                            size={18}
                            className="fill-[#C9A84C]/20 text-[#C9A84C]"
                        />
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A84C]/30" />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* ═══════════════════════ SECTION 4: SCHEDULE ═══════════════════════ */}
            <StackingSection
                id="schedule"
                zIndex={40}
                bg="#2C2C2C"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.35), 0 -4px 12px rgba(0, 0, 0, 0.15)"
                className="text-[#FAF7F2]"
            >
                {/* Ornament watermark bg */}
                <img
                    src="/assets/wedding/ornaments.png"
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-[0.04]"
                />

                <motion.div
                    className="relative z-10 mx-auto w-full max-w-2xl space-y-10 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                            Rangkaian Acara
                        </span>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#FAF7F2]">
                            Jadwal & Lokasi
                        </h2>
                        <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {[
                            {
                                key: 'akad',
                                label: 'Akad Nikah',
                                sched: schedules.akad,
                            },
                            {
                                key: 'resepsi',
                                label: 'Resepsi Pernikahan',
                                sched: schedules.resepsi,
                            },
                        ]
                            .filter((s) => s.sched)
                            .map(({ label, sched }, i) => (
                                <motion.div key={i} variants={childScaleIn}>
                                    <div className="animate-none space-y-4 rounded-3xl border border-[#C9A84C]/20 bg-white/5 p-6 backdrop-blur">
                                        <div className="flex items-center gap-3 border-b border-[#C9A84C]/15 pb-3">
                                            <Calendar
                                                size={18}
                                                className="text-[#C9A84C]"
                                            />
                                            <h3 className="font-serif font-bold text-[#FAF7F2]">
                                                {label}
                                            </h3>
                                        </div>
                                        <div className="space-y-2 text-xs text-[#FAF7F2]/70">
                                            <div className="flex items-start gap-2">
                                                <Calendar
                                                    size={12}
                                                    className="mt-0.5 shrink-0 text-[#C9A84C]"
                                                />
                                                <span>
                                                    {formatDate(sched?.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Clock
                                                    size={12}
                                                    className="mt-0.5 shrink-0 text-[#C9A84C]"
                                                />
                                                <span>
                                                    {sched?.timeStart} –{' '}
                                                    {sched?.timeEnd ||
                                                        'Selesai'}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin
                                                    size={12}
                                                    className="mt-0.5 shrink-0 text-[#C9A84C]"
                                                />
                                                <span>
                                                    {sched?.placeName},{' '}
                                                    {sched?.address}
                                                </span>
                                            </div>
                                        </div>
                                        <MapEmbed
                                            url={sched?.googleMapsUrl}
                                            placeName={sched?.placeName}
                                            address={sched?.address}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </motion.div>
            </StackingSection>

            {/* ═══════════════════════ SECTION 5: LOVE STORY ═══════════════════════ */}
            {stories.length > 0 && (
                <StackingSection
                    id="story"
                    zIndex={50}
                    bg="#FAF7F2"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        className="mx-auto w-full max-w-xl space-y-10 px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                    >
                        <motion.div
                            className="text-center"
                            variants={childFadeUp}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                                Perjalanan Cinta
                            </span>
                            <h2 className="mt-2 font-serif text-2xl font-bold text-[#2C2C2C]">
                                Cerita Kita
                            </h2>
                            <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                        </motion.div>

                        <div className="relative ml-4 space-y-10 border-l border-[#C9A84C]/30 pl-8">
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    variants={childFadeUp}
                                    className="relative"
                                >
                                    <div className="absolute -left-[37px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-[#FAF7F2]">
                                        <div className="h-2 w-2 rounded-full bg-[#C9A84C]" />
                                    </div>
                                    <span className="inline-block rounded bg-[#C9A84C]/10 px-2 py-0.5 text-[10px] font-bold text-[#C9A84C]">
                                        {story.date}
                                    </span>
                                    <h4 className="mt-1 font-serif text-sm font-bold text-[#2C2C2C]">
                                        {story.title}
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-[#2C2C2C]/60">
                                        {story.content}
                                    </p>
                                    {story.imageUrl && (
                                        <img
                                            src={story.imageUrl}
                                            alt={story.title}
                                            className="mt-3 max-h-48 w-full rounded-xl border border-[#C9A84C]/10 object-cover"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </StackingSection>
            )}

            {/* ═══════════════════════ SECTION 6: GALLERY ═══════════════════════ */}
            {photos.length > 0 && (
                <StackingSection
                    id="gallery"
                    zIndex={60}
                    bg="#ffffff"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        className="mx-auto w-full max-w-2xl space-y-8 px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                    >
                        <motion.div
                            className="text-center"
                            variants={childFadeUp}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                                Kenangan Indah
                            </span>
                            <h2 className="mt-2 font-serif text-2xl font-bold text-[#2C2C2C]">
                                Galeri Foto
                            </h2>
                            <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                        </motion.div>
                        <motion.div variants={childScaleIn}>
                            <PhotoGallery photos={photos} />
                        </motion.div>
                    </motion.div>
                </StackingSection>
            )}

            {/* ═══════════════════════ SECTION 7: RSVP ═══════════════════════ */}
            <StackingSection
                id="rsvp"
                zIndex={70}
                bg="#FAF7F2"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <img
                    src="/assets/wedding/ornaments.png"
                    alt=""
                    className="pointer-events-none absolute bottom-0 left-0 w-44 opacity-10"
                    style={{ transform: 'rotate(-90deg)' }}
                />

                <motion.div
                    className="relative z-10 mx-auto w-full max-w-lg space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                            Konfirmasi Kehadiran
                        </span>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#2C2C2C]">
                            Apakah Anda Hadir?
                        </h2>
                        <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                        {guestName && (
                            <p className="mt-4 text-sm text-[#2C2C2C]/60">
                                Kepada Yth.{' '}
                                <span className="font-bold text-[#C9A84C]">
                                    {guestName}
                                </span>
                            </p>
                        )}
                    </motion.div>

                    <motion.div variants={childScaleIn}>
                        <RSVPForm
                            guestName={guestName}
                            guestToken={guestToken}
                            onRsvpSubmit={onRsvpSubmit}
                            initialStatus="hadir"
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* ═══════════════════════ SECTION 8: WISHES / GUESTBOOK ═══════════════════════ */}
            <StackingSection
                id="wishes"
                zIndex={80}
                bg="#ffffff"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    className="mx-auto w-full max-w-lg space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                            Buku Tamu
                        </span>
                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#2C2C2C]">
                            Ucapan & Doa
                        </h2>
                        <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                    </motion.div>
                    <motion.div variants={childFadeUp}>
                        <GuestWishes
                            initialWishes={wishes}
                            weddingId={weddingId}
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* ═══════════════════════ FOOTER ═══════════════════════ */}
            <StackingSection
                id="footer"
                zIndex={90}
                bg="#FAF7F2"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <img
                    src="/assets/wedding/hero-floral.png"
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                />
                <motion.div
                    className="relative z-10 space-y-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <motion.div variants={childFadeUp}>
                        <Heart
                            size={20}
                            className="mx-auto fill-[#C9A84C]/30 text-[#C9A84C]"
                        />
                    </motion.div>
                    <motion.p
                        variants={childFadeUp}
                        className="font-serif text-lg font-bold text-[#2C2C2C]"
                    >
                        {groom.nickname || groom.name} &{' '}
                        {bride.nickname || bride.name}
                    </motion.p>
                    <motion.p
                        variants={childFadeUp}
                        className="text-xs text-[#2C2C2C]/40"
                    >
                        Dibuat dengan ❤️ menggunakan Ngaturi
                    </motion.p>
                </motion.div>
            </StackingSection>
        </div>
    );
};

export default ElegantTheme;
