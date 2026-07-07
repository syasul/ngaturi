import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Calendar, Clock, Heart, MapPin } from 'lucide-react';
import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import CountdownTimer from '../reusable/CountdownTimer';
import GuestWishes from '../reusable/GuestWishes';
import MapEmbed from '../reusable/MapEmbed';
import PhotoGallery from '../reusable/PhotoGallery';
import RSVPForm from '../reusable/RSVPForm';
import StackingSection from '../reusable/StackingSection';

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const childFadeUp: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const childScaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: 'easeOut' },
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

const getParents = (person: any, fallbackLabel: string) => {
    if (person.fatherName && person.motherName) {
        return `${fallbackLabel} dari Bpk. ${person.fatherName} & Ibu ${person.motherName}`;
    }
    return person.parents || '';
};

export const BurgundyBloomTheme: React.FC<ThemeProps> = ({
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

    // Custom styling overrides
    const custom = data?.customStyle || {};
    const primaryColor = custom.primaryColor || '#6B1D2F'; // Burgundy
    const secondaryColor = custom.secondaryColor || '#D4AF37'; // Gold
    const baseBg = custom.baseBg || '#FCF9F6'; // Cream
    const panelBg = custom.panelBg || '#FFFFFF'; // White
    const darkBg = custom.darkBg || '#3A0511'; // Deep Burgundy
    const textColor = custom.textColor || '#2D1A1E'; // Dark text
    const accentSoft = `rgba(107, 29, 47, 0.12)`;
    const mutedText = `rgba(45, 26, 30, 0.6)`;

    const fontTitleClass =
        custom.titleFont === 'font-sans'
            ? 'font-sans font-black tracking-tight'
            : custom.titleFont === 'font-cursive'
              ? 'font-cursive text-4xl'
              : 'font-serif font-bold italic';

    const fontBodyClass =
        custom.bodyFont === 'font-serif' ? 'font-serif' : 'font-sans';

    const SectionHeader: React.FC<{
        eyebrow: string;
        title: string;
        inverse?: boolean;
    }> = ({ eyebrow, title, inverse = false }) => (
        <motion.div className="space-y-2.5 text-center" variants={childFadeUp}>
            <span
                className="block text-[10px] font-bold uppercase tracking-[0.32em]"
                style={{ color: inverse ? secondaryColor : primaryColor }}
            >
                {eyebrow}
            </span>
            <h2
                className={`text-2xl md:text-3xl ${fontTitleClass}`}
                style={{ color: inverse ? panelBg : textColor }}
            >
                {title}
            </h2>
            <div
                className="mx-auto h-px w-16"
                style={{ background: secondaryColor }}
            />
        </motion.div>
    );

    const CoupleCard: React.FC<{ person: any; label: string }> = ({
        person,
        label,
    }) => (
        <motion.div
            variants={childScaleIn}
            className="space-y-4 rounded-3xl border bg-white/95 p-6 text-center shadow-sm"
            style={{ borderColor: `${secondaryColor}30` }}
        >
            <span
                className="text-[10px] font-bold uppercase tracking-[0.24em]"
                style={{ color: primaryColor }}
            >
                {label}
            </span>
            <div
                className="relative mx-auto h-28 w-28 overflow-hidden border bg-white p-1 shadow-sm"
                style={{ borderColor: secondaryColor, borderRadius: '2rem' }}
            >
                {person.photoUrl || person.photo ? (
                    <img
                        src={person.photoUrl || person.photo}
                        alt={person.name || label}
                        className="h-full w-full object-cover"
                        style={{ borderRadius: '1.85rem' }}
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-4xl font-bold"
                        style={{
                            background: accentSoft,
                            color: primaryColor,
                            borderRadius: '1.85rem',
                        }}
                    >
                        {(person.nickname || person.name || label)?.[0]}
                    </div>
                )}
            </div>
            <div className="space-y-1.5">
                <h3
                    className={`text-xl ${fontTitleClass}`}
                    style={{ color: textColor }}
                >
                    {person.fullName || person.name || '-'}
                </h3>
                <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: mutedText }}
                >
                    {getParents(
                        person,
                        label.includes('Pria') ? 'Putra' : 'Putri',
                    )}
                </p>
                {person.bio && (
                    <p
                        className="mt-2 px-2 text-xs italic leading-relaxed"
                        style={{ color: mutedText }}
                    >
                        "{person.bio}"
                    </p>
                )}
            </div>
            {person.ig && (
                <a
                    href={`https://instagram.com/${person.ig.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-80"
                    style={{ color: primaryColor }}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>@{person.ig.replace('@', '')}</span>
                </a>
            )}
        </motion.div>
    );

    const EventCard: React.FC<{
        title: string;
        schedule: any;
        inverse?: boolean;
    }> = ({ title, schedule, inverse = false }) => (
        <motion.div
            variants={childScaleIn}
            className={`space-y-4 rounded-3xl border p-6 shadow-sm ${
                inverse
                    ? 'border-white/10 bg-white/5 backdrop-blur'
                    : 'border-sand/40 bg-white'
            }`}
            style={!inverse ? { borderColor: `${secondaryColor}30` } : {}}
        >
            <div
                className="flex items-center gap-3 border-b pb-3"
                style={{
                    borderColor: inverse
                        ? 'rgba(255,255,255,0.12)'
                        : `${primaryColor}15`,
                }}
            >
                <Calendar size={18} style={{ color: secondaryColor }} />
                <h3
                    className={`font-bold ${fontTitleClass}`}
                    style={{ color: inverse ? panelBg : textColor }}
                >
                    {title}
                </h3>
            </div>
            <div
                className="space-y-3.5 text-xs leading-relaxed"
                style={{ color: inverse ? 'rgba(255,255,255,0.7)' : mutedText }}
            >
                <p className="flex items-start gap-2.5">
                    <Calendar
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: secondaryColor }}
                    />
                    <span>{formatDate(schedule?.date)}</span>
                </p>
                <p className="flex items-start gap-2.5">
                    <Clock
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: secondaryColor }}
                    />
                    <span>
                        {schedule?.timeStart || schedule?.time || '-'} -{' '}
                        {schedule?.timeEnd || 'Selesai'}
                    </span>
                </p>
                <p className="flex items-start gap-2.5">
                    <MapPin
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: secondaryColor }}
                    />
                    <span>
                        {schedule?.placeName || schedule?.venue || '-'},{' '}
                        {schedule?.address || ''}
                    </span>
                </p>
            </div>
            {schedule?.maps && (
                <div className="pt-2">
                    <MapEmbed
                        url={schedule?.googleMapsUrl || schedule?.maps}
                        placeName={schedule?.placeName || schedule?.venue}
                        address={schedule?.address}
                    />
                </div>
            )}
        </motion.div>
    );

    const weddingDate = schedules.akad?.date || schedules.resepsi?.date;

    return (
        <div
            className={`relative ${fontBodyClass} select-none overflow-x-hidden`}
            style={{ background: baseBg, color: textColor }}
        >
            {/* 1. HERO COVER SECTION */}
            <StackingSection
                id="hero"
                zIndex={10}
                bg={baseBg}
                pattern="url('/assets/wedding/burgundy-floral-bg.png')"
                roundedVal="0px"
            >
                <motion.div
                    className="relative z-10 mx-auto w-full max-w-2xl space-y-6 px-6 py-14 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Subtle white flower overlay corners */}
                    <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 bg-[url('/assets/wedding/burgundy-floral-bg.png')] bg-contain bg-no-repeat opacity-10" />

                    <motion.span
                        variants={childFadeUp}
                        className="text-[10px] font-bold uppercase tracking-[0.35em]"
                        style={{ color: primaryColor }}
                    >
                        The Wedding of
                    </motion.span>
                    <motion.h1
                        variants={childFadeUp}
                        className={`text-5xl leading-none md:text-7xl ${fontTitleClass}`}
                        style={{ color: primaryColor }}
                    >
                        {groom.nickname || groom.name || 'Groom'}
                        <span
                            className="my-3 block font-serif text-3xl normal-case italic md:text-4xl"
                            style={{ color: secondaryColor }}
                        >
                            &
                        </span>
                        {bride.nickname || bride.name || 'Bride'}
                    </motion.h1>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto h-px w-20"
                        style={{ background: secondaryColor }}
                    />

                    {quotes.text && (
                        <motion.p
                            variants={childFadeUp}
                            className="mx-auto max-w-sm text-xs italic leading-relaxed"
                            style={{ color: mutedText }}
                        >
                            "{quotes.text}"
                            {quotes.source && (
                                <span
                                    className="mt-2 block font-bold not-italic"
                                    style={{ color: primaryColor }}
                                >
                                    {quotes.source}
                                </span>
                            )}
                        </motion.p>
                    )}

                    {weddingDate && (
                        <motion.p
                            variants={childFadeUp}
                            className="mt-4 text-sm font-bold tracking-wide"
                            style={{ color: secondaryColor }}
                        >
                            {formatDate(weddingDate)}
                        </motion.p>
                    )}
                </motion.div>
            </StackingSection>

            {/* 2. COUNTDOWN TIMER */}
            <StackingSection
                id="countdown"
                zIndex={20}
                bg={panelBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.04)"
            >
                <motion.div
                    className="mx-auto w-full max-w-xl space-y-6 px-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        eyebrow="Menghitung Hari"
                        title="Menuju Hari Bahagia"
                    />
                    {weddingDate && (
                        <motion.div variants={childScaleIn} className="mt-4">
                            <CountdownTimer targetDate={weddingDate} />
                        </motion.div>
                    )}
                </motion.div>
            </StackingSection>

            {/* 3. MEMPELAI PROFILE */}
            <StackingSection
                id="couple"
                zIndex={30}
                bg={baseBg}
                pattern="url('/assets/wedding/burgundy-floral-bg.png')"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.04)"
            >
                <motion.div
                    className="mx-auto w-full max-w-2xl space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        eyebrow="Pasangan Mempelai"
                        title="Dua Hati, Satu Janji"
                    />
                    <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                        <CoupleCard person={groom} label="Mempelai Pria" />
                        <CoupleCard person={bride} label="Mempelai Wanita" />
                    </div>
                </motion.div>
            </StackingSection>

            {/* 4. ACARA / JADWAL */}
            <StackingSection
                id="schedule"
                zIndex={40}
                bg={darkBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 44px rgba(0,0,0,.15)"
            >
                <motion.div
                    className="mx-auto w-full max-w-2xl space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        eyebrow="Agenda Acara"
                        title="Jadwal & Lokasi"
                        inverse
                    />
                    <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                        {schedules.akad && (
                            <EventCard
                                title="Akad Nikah"
                                schedule={schedules.akad}
                                inverse
                            />
                        )}
                        {schedules.resepsi && (
                            <EventCard
                                title="Resepsi"
                                schedule={schedules.resepsi}
                                inverse
                            />
                        )}
                    </div>
                </motion.div>
            </StackingSection>

            {/* 5. LOVE STORY */}
            {stories.length > 0 && (
                <StackingSection
                    id="story"
                    zIndex={50}
                    bg={baseBg}
                    pattern="url('/assets/wedding/burgundy-floral-bg.png')"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0,0,0,.04)"
                >
                    <motion.div
                        className="mx-auto w-full max-w-xl space-y-8 px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="Perjalanan Cinta"
                            title="Kisah Kami"
                        />
                        <div
                            className="relative space-y-7 border-l pl-6"
                            style={{ borderColor: primaryColor }}
                        >
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    variants={childFadeUp}
                                    className="relative space-y-2"
                                >
                                    <span
                                        className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 bg-white"
                                        style={{ borderColor: primaryColor }}
                                    />
                                    <span
                                        className="inline-block rounded px-2.5 py-1 text-[10px] font-bold"
                                        style={{
                                            color: primaryColor,
                                            background: accentSoft,
                                        }}
                                    >
                                        {story.date || story.year}
                                    </span>
                                    <h3
                                        className={`text-sm ${fontTitleClass}`}
                                        style={{ color: textColor }}
                                    >
                                        {story.title}
                                    </h3>
                                    <p
                                        className="text-xs leading-relaxed"
                                        style={{ color: mutedText }}
                                    >
                                        {story.content || story.story}
                                    </p>
                                    {story.imageUrl && (
                                        <img
                                            src={story.imageUrl}
                                            alt={story.title}
                                            className="mt-2 max-h-48 w-full rounded-2xl border object-cover"
                                            style={{
                                                borderColor: `${primaryColor}20`,
                                            }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </StackingSection>
            )}

            {/* 6. PHOTO GALLERY */}
            {photos.length > 0 && (
                <StackingSection
                    id="gallery"
                    zIndex={60}
                    bg={panelBg}
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0,0,0,.04)"
                >
                    <motion.div
                        className="mx-auto w-full max-w-2xl space-y-8 px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            eyebrow="Album Galeri"
                            title="Momen Bahagia"
                        />
                        <motion.div variants={childScaleIn} className="pt-2">
                            <PhotoGallery photos={photos} />
                        </motion.div>
                    </motion.div>
                </StackingSection>
            )}

            {/* 7. RSVP FORM & QR CODE */}
            <StackingSection
                id="rsvp"
                zIndex={70}
                bg={baseBg}
                pattern="url('/assets/wedding/burgundy-floral-bg.png')"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.04)"
            >
                <motion.div
                    className="mx-auto w-full max-w-lg space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        eyebrow="Konfirmasi RSVP"
                        title="Kehadiran Anda"
                    />

                    {guestName && (
                        <motion.p
                            variants={childFadeUp}
                            className="text-center text-sm"
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

                    <motion.div variants={childScaleIn} className="pt-2">
                        <RSVPForm
                            guestName={guestName}
                            guestToken={guestToken}
                            onRsvpSubmit={onRsvpSubmit}
                            initialStatus="hadir"
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* 8. GUEST WISHES */}
            <StackingSection
                id="wishes"
                zIndex={80}
                bg={panelBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.04)"
            >
                <motion.div
                    className="mx-auto w-full max-w-lg space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader eyebrow="Buku Tamu" title="Doa Restu Anda" />
                    <motion.div variants={childFadeUp} className="pt-2">
                        <GuestWishes
                            initialWishes={wishes}
                            weddingId={weddingId}
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* 9. FOOTER */}
            <StackingSection
                id="footer"
                zIndex={90}
                bg={darkBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 44px rgba(0,0,0,.15)"
            >
                <motion.div
                    className="relative z-10 space-y-4 px-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <motion.div variants={childFadeUp}>
                        <Heart
                            size={24}
                            className="mx-auto animate-pulse"
                            style={{
                                color: secondaryColor,
                                fill: `${secondaryColor}40`,
                            }}
                        />
                    </motion.div>
                    <motion.p
                        variants={childFadeUp}
                        className={`text-2xl ${fontTitleClass}`}
                        style={{ color: panelBg }}
                    >
                        {groom.nickname || groom.name || 'Groom'} &{' '}
                        {bride.nickname || bride.name || 'Bride'}
                    </motion.p>
                    <motion.p
                        variants={childFadeUp}
                        className="text-xs"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        Dibuat dengan cinta menggunakan Ngaturi
                    </motion.p>
                </motion.div>
            </StackingSection>
        </div>
    );
};

export default BurgundyBloomTheme;
