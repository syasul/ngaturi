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

type SampleThemeId =
    'royal-yogyakarta' | 'botanical-minimal' | 'editorial-mono';

interface SampleThemeConfig {
    id: SampleThemeId;
    label: string;
    eventLabel: string;
    baseBg: string;
    panelBg: string;
    altBg: string;
    darkBg: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    radius: string;
    serifClass: string;
    titleClass: string;
    cardClass: string;
    pattern?: string;
}

const themes: Record<SampleThemeId, SampleThemeConfig> = {
    'royal-yogyakarta': {
        id: 'royal-yogyakarta',
        label: 'Pawiwahan Agung',
        eventLabel: 'Rangkaian Pawiwahan',
        baseBg: '#FFF8F4',
        panelBg: '#FFFFFF',
        altBg: '#F7E8DE',
        darkBg: '#4B2F28',
        text: '#3D261F',
        muted: 'rgba(61, 38, 31, 0.62)',
        accent: '#B68A2C',
        accentSoft: 'rgba(182, 138, 44, 0.14)',
        radius: '0.75rem',
        serifClass: 'font-serif',
        titleClass: 'font-serif font-bold',
        cardClass:
            'rounded-lg border border-[#D8B76A]/35 bg-white/85 shadow-sm',
        pattern:
            'radial-gradient(circle at 20% 15%, rgba(182,138,44,.12), transparent 26%), radial-gradient(circle at 80% 82%, rgba(75,47,40,.10), transparent 30%)',
    },
    'botanical-minimal': {
        id: 'botanical-minimal',
        label: 'Botanical Vows',
        eventLabel: 'Wedding Day',
        baseBg: '#F4F7F1',
        panelBg: '#FFFFFF',
        altBg: '#E7EFE2',
        darkBg: '#2D4436',
        text: '#203429',
        muted: 'rgba(32, 52, 41, 0.62)',
        accent: '#6D8B63',
        accentSoft: 'rgba(109, 139, 99, 0.15)',
        radius: '1.25rem',
        serifClass: 'font-serif',
        titleClass: 'font-serif font-semibold',
        cardClass:
            'rounded-lg border border-[#6D8B63]/20 bg-white/90 shadow-sm',
        pattern:
            'linear-gradient(135deg, rgba(109,139,99,.11) 0 1px, transparent 1px 28px), linear-gradient(45deg, rgba(109,139,99,.08) 0 1px, transparent 1px 34px)',
    },
    'editorial-mono': {
        id: 'editorial-mono',
        label: 'The Wedding Issue',
        eventLabel: 'Ceremony Schedule',
        baseBg: '#F7F5F0',
        panelBg: '#FFFFFF',
        altBg: '#ECE8DF',
        darkBg: '#171717',
        text: '#151515',
        muted: 'rgba(21, 21, 21, 0.58)',
        accent: '#A04737',
        accentSoft: 'rgba(160, 71, 55, 0.12)',
        radius: '0.25rem',
        serifClass: 'font-serif',
        titleClass: 'font-sans font-black uppercase',
        cardClass: 'rounded border border-neutral-300 bg-white shadow-none',
        pattern:
            'linear-gradient(to right, rgba(0,0,0,.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.04) 1px, transparent 1px)',
    },
};

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const childFadeUp: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: 'easeOut' as any },
    },
};

const childScaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.65, ease: 'easeOut' as any },
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

const SectionHeader: React.FC<{
    config: SampleThemeConfig;
    eyebrow: string;
    title: string;
    inverse?: boolean;
}> = ({ config, eyebrow, title, inverse = false }) => (
    <motion.div className="space-y-3 text-center" variants={childFadeUp}>
        <span
            className="block text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: inverse ? config.accent : config.accent }}
        >
            {eyebrow}
        </span>
        <h2
            className={`text-2xl md:text-3xl ${config.titleClass}`}
            style={{ color: inverse ? config.panelBg : config.text }}
        >
            {title}
        </h2>
        <div
            className="mx-auto h-px w-16"
            style={{ background: config.accent }}
        />
    </motion.div>
);

const CoupleCard: React.FC<{
    person: any;
    label: string;
    config: SampleThemeConfig;
}> = ({ person, label, config }) => (
    <motion.div
        variants={childScaleIn}
        className={`${config.cardClass} space-y-4 p-6 text-center`}
    >
        <span
            className="text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: config.accent }}
        >
            {label}
        </span>
        <div
            className="mx-auto h-28 w-28 overflow-hidden border bg-white p-1"
            style={{ borderColor: config.accent, borderRadius: config.radius }}
        >
            {person.photoUrl || person.photo ? (
                <img
                    src={person.photoUrl || person.photo}
                    alt={person.name || label}
                    className="h-full w-full object-cover"
                    style={{ borderRadius: `calc(${config.radius} - 0.2rem)` }}
                />
            ) : (
                <div
                    className="flex h-full w-full items-center justify-center text-4xl font-bold"
                    style={{
                        background: config.accentSoft,
                        color: config.accent,
                        borderRadius: `calc(${config.radius} - 0.2rem)`,
                    }}
                >
                    {(person.nickname || person.name || label)?.[0]}
                </div>
            )}
        </div>
        <div className="space-y-2">
            <h3
                className={`text-xl ${config.titleClass}`}
                style={{ color: config.text }}
            >
                {person.fullName || person.name || '-'}
            </h3>
            <p
                className="text-[11px] leading-relaxed"
                style={{ color: config.muted }}
            >
                {getParents(person, label.includes('Pria') ? 'Putra' : 'Putri')}
            </p>
            {person.bio && (
                <p
                    className="text-xs leading-relaxed"
                    style={{ color: config.muted }}
                >
                    {person.bio}
                </p>
            )}
        </div>
        {person.instagram && (
            <a
                href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold"
                style={{ color: config.accent }}
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
                {person.instagram}
            </a>
        )}
    </motion.div>
);

const EventCard: React.FC<{
    title: string;
    schedule: any;
    config: SampleThemeConfig;
    inverse?: boolean;
}> = ({ title, schedule, config, inverse = false }) => (
    <motion.div
        variants={childScaleIn}
        className={`space-y-4 p-5 ${inverse ? 'bg-white/8 rounded-lg border border-white/15 backdrop-blur' : config.cardClass}`}
    >
        <div
            className="flex items-center gap-3 border-b pb-3"
            style={{
                borderColor: inverse
                    ? 'rgba(255,255,255,.16)'
                    : config.accentSoft,
            }}
        >
            <Calendar size={18} style={{ color: config.accent }} />
            <h3
                className={`font-bold ${config.serifClass}`}
                style={{ color: inverse ? config.panelBg : config.text }}
            >
                {title}
            </h3>
        </div>
        <div
            className="space-y-2 text-xs leading-relaxed"
            style={{ color: inverse ? 'rgba(255,255,255,.72)' : config.muted }}
        >
            <p className="flex gap-2">
                <Calendar
                    size={13}
                    className="mt-0.5 shrink-0"
                    style={{ color: config.accent }}
                />
                <span>{formatDate(schedule?.date)}</span>
            </p>
            <p className="flex gap-2">
                <Clock
                    size={13}
                    className="mt-0.5 shrink-0"
                    style={{ color: config.accent }}
                />
                <span>
                    {schedule?.timeStart || schedule?.time || '-'} -{' '}
                    {schedule?.timeEnd || 'Selesai'}
                </span>
            </p>
            <p className="flex gap-2">
                <MapPin
                    size={13}
                    className="mt-0.5 shrink-0"
                    style={{ color: config.accent }}
                />
                <span>
                    {schedule?.placeName || schedule?.venue || '-'},{' '}
                    {schedule?.address || ''}
                </span>
            </p>
        </div>
        <MapEmbed
            url={schedule?.googleMapsUrl || schedule?.maps}
            placeName={schedule?.placeName || schedule?.venue}
            address={schedule?.address}
        />
    </motion.div>
);

export const SampleDesignTheme: React.FC<
    ThemeProps & { sampleId: SampleThemeId }
> = ({
    sampleId,
    data,
    weddingId,
    photos = [],
    guestName,
    guestToken,
    wishes,
    onRsvpSubmit,
}) => {
    const config = themes[sampleId];
    const groom = data?.groom || {};
    const bride = data?.bride || {};
    const schedules = data?.schedules || data?.schedule || {};
    const stories = data?.stories || [];
    const quotes = data?.quotes || {};
    const weddingDate = schedules.akad?.date || schedules.resepsi?.date;

    return (
        <div
            className="relative select-none font-sans"
            style={{ background: config.baseBg, color: config.text }}
        >
            <StackingSection
                id="hero"
                zIndex={10}
                bg={config.baseBg}
                pattern={config.pattern}
                roundedVal="0px"
            >
                <motion.div
                    className="mx-auto w-full max-w-2xl space-y-6 px-6 py-14 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.span
                        variants={childFadeUp}
                        className="text-[10px] font-bold uppercase tracking-[0.35em]"
                        style={{ color: config.accent }}
                    >
                        {config.label}
                    </motion.span>
                    <motion.h1
                        variants={childFadeUp}
                        className={`text-5xl leading-none md:text-7xl ${config.titleClass}`}
                        style={{ color: config.text }}
                    >
                        {groom.nickname || groom.name || 'Arga'}
                        <span
                            className="my-3 block font-serif text-3xl normal-case italic md:text-4xl"
                            style={{ color: config.accent }}
                        >
                            &
                        </span>
                        {bride.nickname || bride.name || 'Kirana'}
                    </motion.h1>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto h-px w-20"
                        style={{ background: config.accent }}
                    />
                    <motion.p
                        variants={childFadeUp}
                        className="mx-auto max-w-sm text-xs italic leading-relaxed"
                        style={{ color: config.muted }}
                    >
                        "
                        {quotes.text ||
                            'Dan Kami menciptakan kamu berpasang-pasangan'}
                        "
                        {quotes.source && (
                            <span
                                className="mt-2 block font-bold not-italic"
                                style={{ color: config.accent }}
                            >
                                {quotes.source}
                            </span>
                        )}
                    </motion.p>
                    {weddingDate && (
                        <motion.p
                            variants={childFadeUp}
                            className="text-sm font-bold"
                            style={{ color: config.accent }}
                        >
                            {formatDate(weddingDate)}
                        </motion.p>
                    )}
                </motion.div>
            </StackingSection>

            <StackingSection
                id="countdown"
                zIndex={20}
                bg={config.panelBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.08)"
            >
                <motion.div
                    className="mx-auto w-full max-w-xl space-y-6 px-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        config={config}
                        eyebrow="Menghitung Hari"
                        title="Menuju Hari Bahagia"
                    />
                    {weddingDate && (
                        <motion.div variants={childScaleIn}>
                            <CountdownTimer targetDate={weddingDate} />
                        </motion.div>
                    )}
                </motion.div>
            </StackingSection>

            <StackingSection
                id="couple"
                zIndex={30}
                bg={config.altBg}
                pattern={config.pattern}
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.08)"
            >
                <motion.div
                    className="mx-auto w-full max-w-2xl space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        config={config}
                        eyebrow="Mempelai"
                        title="Dua Hati, Satu Janji"
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CoupleCard
                            person={groom}
                            label="Mempelai Pria"
                            config={config}
                        />
                        <CoupleCard
                            person={bride}
                            label="Mempelai Wanita"
                            config={config}
                        />
                    </div>
                </motion.div>
            </StackingSection>

            <StackingSection
                id="schedule"
                zIndex={40}
                bg={config.darkBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 44px rgba(0,0,0,.22)"
            >
                <motion.div
                    className="mx-auto w-full max-w-2xl space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        config={config}
                        eyebrow={config.eventLabel}
                        title="Jadwal & Lokasi"
                        inverse
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {schedules.akad && (
                            <EventCard
                                title="Akad Nikah"
                                schedule={schedules.akad}
                                config={config}
                                inverse
                            />
                        )}
                        {schedules.resepsi && (
                            <EventCard
                                title="Resepsi"
                                schedule={schedules.resepsi}
                                config={config}
                                inverse
                            />
                        )}
                    </div>
                </motion.div>
            </StackingSection>

            {stories.length > 0 && (
                <StackingSection
                    id="story"
                    zIndex={50}
                    bg={config.baseBg}
                    pattern={config.pattern}
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0,0,0,.08)"
                >
                    <motion.div
                        className="mx-auto w-full max-w-xl space-y-8 px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            config={config}
                            eyebrow="Love Story"
                            title="Perjalanan Kami"
                        />
                        <div
                            className="relative space-y-7 border-l pl-6"
                            style={{ borderColor: config.accent }}
                        >
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    variants={childFadeUp}
                                    className="relative space-y-2"
                                >
                                    <span
                                        className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 bg-white"
                                        style={{ borderColor: config.accent }}
                                    />
                                    <span
                                        className="inline-block rounded px-2 py-1 text-[10px] font-bold"
                                        style={{
                                            color: config.accent,
                                            background: config.accentSoft,
                                        }}
                                    >
                                        {story.date || story.year}
                                    </span>
                                    <h3
                                        className={`text-sm ${config.titleClass}`}
                                        style={{ color: config.text }}
                                    >
                                        {story.title}
                                    </h3>
                                    <p
                                        className="text-xs leading-relaxed"
                                        style={{ color: config.muted }}
                                    >
                                        {story.content || story.story}
                                    </p>
                                    {story.imageUrl && (
                                        <img
                                            src={story.imageUrl}
                                            alt={story.title}
                                            className="max-h-48 w-full rounded-lg border object-cover"
                                            style={{
                                                borderColor: config.accentSoft,
                                            }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </StackingSection>
            )}

            {photos.length > 0 && (
                <StackingSection
                    id="gallery"
                    zIndex={60}
                    bg={config.panelBg}
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0,0,0,.08)"
                >
                    <motion.div
                        className="mx-auto w-full max-w-2xl space-y-8 px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                    >
                        <SectionHeader
                            config={config}
                            eyebrow="Galeri"
                            title="Ruang Kenangan"
                        />
                        <motion.div variants={childScaleIn}>
                            <PhotoGallery photos={photos} />
                        </motion.div>
                    </motion.div>
                </StackingSection>
            )}

            <StackingSection
                id="rsvp"
                zIndex={70}
                bg={config.altBg}
                pattern={config.pattern}
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.08)"
            >
                <motion.div
                    className="mx-auto w-full max-w-lg space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        config={config}
                        eyebrow="RSVP"
                        title="Konfirmasi Kehadiran"
                    />
                    {guestName && (
                        <motion.p
                            variants={childFadeUp}
                            className="text-center text-sm"
                            style={{ color: config.muted }}
                        >
                            Kepada Yth.{' '}
                            <span
                                className="font-bold"
                                style={{ color: config.accent }}
                            >
                                {guestName}
                            </span>
                        </motion.p>
                    )}
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

            <StackingSection
                id="wishes"
                zIndex={80}
                bg={config.panelBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0,0,0,.08)"
            >
                <motion.div
                    className="mx-auto w-full max-w-lg space-y-8 px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                >
                    <SectionHeader
                        config={config}
                        eyebrow="Buku Tamu"
                        title="Ucapan & Doa"
                    />
                    <motion.div variants={childFadeUp}>
                        <GuestWishes
                            initialWishes={wishes}
                            weddingId={weddingId}
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>

            <StackingSection
                id="footer"
                zIndex={90}
                bg={config.darkBg}
                roundedVal="2.5rem"
                boxShadow="0 -15px 44px rgba(0,0,0,.22)"
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
                            size={22}
                            className="mx-auto"
                            style={{
                                color: config.accent,
                                fill: config.accentSoft,
                            }}
                        />
                    </motion.div>
                    <motion.p
                        variants={childFadeUp}
                        className={`text-2xl ${config.titleClass}`}
                        style={{ color: config.panelBg }}
                    >
                        {groom.nickname || groom.name || 'Groom'} &{' '}
                        {bride.nickname || bride.name || 'Bride'}
                    </motion.p>
                    <motion.p
                        variants={childFadeUp}
                        className="text-xs"
                        style={{ color: 'rgba(255,255,255,.55)' }}
                    >
                        Dibuat dengan cinta menggunakan Ngaturi
                    </motion.p>
                </motion.div>
            </StackingSection>
        </div>
    );
};

export const RoyalYogyakartaTheme: React.FC<ThemeProps> = (props) => (
    <SampleDesignTheme {...props} sampleId="royal-yogyakarta" />
);

export const BotanicalMinimalTheme: React.FC<ThemeProps> = (props) => (
    <SampleDesignTheme {...props} sampleId="botanical-minimal" />
);

export const EditorialMonoTheme: React.FC<ThemeProps> = (props) => (
    <SampleDesignTheme {...props} sampleId="editorial-mono" />
);

export default SampleDesignTheme;
